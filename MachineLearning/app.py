import mysql.connector # Atau import pymysql.cursors (jika pakai PyMySQL)
from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import tensorflow as tf
import pickle
import os

app = Flask(__name__)

# --- Global Variables for Model Artifacts ---
# Inisialisasi variabel global. Nilai akan diisi oleh load_artifacts()
model = None
scaler_features = None
scaler_target = None
features_list = None
sequence_length = None

# --- Path ke Model dan Scaler yang Tersimpan ---
MODEL_PATH = 'my_cashflow_prediction_model.h5'
SCALER_FEATURES_PATH = 'scaler_features.pkl'
SCALER_TARGET_PATH = 'scaler_target.pkl'
FEATURES_LIST_PATH = 'features_list.pkl'
SEQUENCE_LENGTH_PATH = 'sequence_length.pkl'

# --- Fungsi untuk Memuat Model dan Scaler ---
def load_artifacts():
    global model, scaler_features, scaler_target, features_list, sequence_length
    try:
        # Periksa apakah file ada sebelum mencoba memuat
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")
        if not os.path.exists(SCALER_FEATURES_PATH):
            raise FileNotFoundError(f"Scaler features file not found: {SCALER_FEATURES_PATH}")
        if not os.path.exists(SCALER_TARGET_PATH):
            raise FileNotFoundError(f"Scaler target file not found: {SCALER_TARGET_PATH}")
        if not os.path.exists(FEATURES_LIST_PATH):
            raise FileNotFoundError(f"Features list file not found: {FEATURES_LIST_PATH}")
        if not os.path.exists(SEQUENCE_LENGTH_PATH):
            raise FileNotFoundError(f"Sequence length file not found: {SEQUENCE_LENGTH_PATH}")

        model = tf.keras.models.load_model(MODEL_PATH)
        with open(SCALER_FEATURES_PATH, 'rb') as f:
            scaler_features = pickle.load(f)
        with open(SCALER_TARGET_PATH, 'rb') as f:
            scaler_target = pickle.load(f)
        with open(FEATURES_LIST_PATH, 'rb') as f:
            features_list = pickle.load(f)
        with open(SEQUENCE_LENGTH_PATH, 'rb') as f:
            sequence_length = pickle.load(f)

        print("Model and scalers loaded successfully.")
    except Exception as e:
        print(f"Error loading model or scalers: {e}")
        print("Please ensure all model and scaler files are in the correct directory and are valid.")
        # Dalam lingkungan produksi, Anda mungkin ingin melakukan log error dan keluar dari aplikasi
        exit(1) # Keluar dari aplikasi jika gagal memuat artefak

# --- Fungsi Pra-pemrosesan Data Input (Direplikasi dari preprocess_data) ---
# Fungsi ini akan mengambil satu DataFrame bulanan historis dari DB dan menyiapkan untuk model
def preprocess_input_data(df_monthly_raw_history, features_list, sequence_length):
    # Pastikan data yang masuk adalah DataFrame bulanan dengan Income, Expenses, Net Cashflow
    df_processed = df_monthly_raw_history.copy()

    # Tambahkan kolom moving average (sesuai preprocessing model)
    # Gunakan window=3, min_periods=1 seperti saat training
    df_processed['Net_Cashflow_MA3'] = df_processed['Net Cashflow'].rolling(window=3, min_periods=1).mean()
    df_processed['Income_MA3'] = df_processed['Income'].rolling(window=3, min_periods=1).mean()
    df_processed['Expenses_MA3'] = df_processed['Expenses'].rolling(window=3, min_periods=1).mean()

    # Tambahkan fitur musiman: bulan (month)
    df_processed['Month'] = df_processed.index.month

    # Tambahkan fitur event spesial (misal: Lebaran)
    df_processed['is_lebaran_month'] = ((df_processed.index.month == 4) | (df_processed.index.month == 5)).astype(int)

    # Pastikan tidak ada NaN yang tercipta dari rolling window jika history terlalu pendek
    # Atau, jika history terlalu pendek, harusnya sudah dihandle di fetch_user_financial_data
    df_processed = df_processed.dropna()

    if len(df_processed) < sequence_length:
        raise ValueError(f"Not enough complete historical data after feature engineering. Requires at least {sequence_length} months.")

    # Ambil hanya 'sequence_length' bulan terakhir yang sudah diproses
    last_n_months_data = df_processed.iloc[-sequence_length:]

    # Pastikan urutan dan jumlah kolom sesuai dengan features_list yang digunakan saat training
    # Ini krusial!
    processed_values = last_n_months_data[features_list].values
    
    # Skalakan data input menggunakan scaler yang sudah dilatih (scaler_features)
    scaled_input = scaler_features.transform(processed_values)
    
    # Reshape untuk LSTM (1 sampel, sequence_length timestep, num_features)
    final_input = scaled_input.reshape(1, sequence_length, len(features_list))
    
    return final_input

# --- Konfigurasi Database MySQL Anda ---
DB_CONFIG = {
    'host': 'localhost', # Ganti dengan host DB Anda (misal: IP server)
    'user': 'your_db_user', # Ganti dengan username DB Anda
    'password': 'your_db_password', # Ganti dengan password DB Anda
    'database': 'your_database_name' # Ganti dengan nama database Anda
}

# Fungsi untuk terhubung ke DB dan mengambil data
def fetch_user_financial_data(user_id, num_months_history):
    conn = None
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)

        current_date = pd.Timestamp.now()
        end_of_current_month = current_date.to_period('M').end_time
        start_date_query = end_of_current_month - pd.DateOffset(months=num_months_history - 1)

        query = """
        SELECT
            CAST(DATE_FORMAT(date, '%%Y-%%m-01') AS DATE) AS month_start_date,
            SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) AS income_sum, -- Menyesuaikan dengan 'type' = 'credit'
            SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END) AS expenses_sum  -- Menyesuaikan dengan 'type' = 'debit'
        FROM
            transactions
        WHERE
            userID = %s AND date BETWEEN %s AND %s -- Menyesuaikan dengan 'userID' dan 'date'
        GROUP BY
            month_start_date
        ORDER BY
            month_start_date ASC;
        """
        cursor.execute(query, (user_id, start_date_query.strftime('%Y-%m-%d'), end_of_current_month.strftime('%Y-%m-%d')))
        
        records = cursor.fetchall()

        if not records:
            return pd.DataFrame()

        df_monthly = pd.DataFrame(records)
        df_monthly['month_start_date'] = pd.to_datetime(df_monthly['month_start_date'])
        df_monthly.set_index('month_start_date', inplace=True)
        df_monthly.index = df_monthly.index + pd.offsets.MonthEnd(0) # Ubah indeks ke akhir bulan

        # Menyesuaikan nama kolom hasil query ke nama yang diharapkan model
        df_monthly.rename(columns={'income_sum': 'Income', 'expenses_sum': 'Expenses'}, inplace=True)
        df_monthly['Net Cashflow'] = df_monthly['Income'] - df_monthly['Expenses']

        return df_monthly

    except mysql.connector.Error as err:
        print(f"Error connecting to MySQL or fetching data: {err}")
        return None
    finally:
        if conn:
            conn.close()


# --- Endpoint API untuk Prediksi ---
@app.route('/predict_cashflow_from_db', methods=['POST'])
def predict_cashflow_from_db():
    if model is None:
        return jsonify({"error": "Model not loaded. Please check server logs.", "status": "failed"}), 503 # Service Unavailable

    try:
        request_data = request.get_json(force=True)
        user_id = request_data.get('user_id')

        if not user_id:
            return jsonify({"error": "User ID is required."}), 400

        # Kita ambil history yang cukup untuk rolling average (misal sequence_length + 3 bulan untuk MA3)
        # Pastikan angka ini cukup untuk semua fitur yang Anda buat saat training
        required_history_for_features = sequence_length + 2 # Ini karena MA3 butuh 3 bulan sebelumnya.
                                                            # Kalau sequence_length 3, dan butuh 3 bulan MA,
                                                            # maka perlu 3 (seq) + (3-1) (MA) = 5 bulan total.
                                                            # Jadi, ambil sequence_length + (window - 1) untuk MA.
                                                            # Window MA adalah 3, jadi perlu 3 + (3-1) = 5 bulan.
                                                            # Tambah padding lagi 1-2 bulan jika ragu.

        df_monthly_user_data = fetch_user_financial_data(user_id, required_history_for_features)

        if df_monthly_user_data is None:
            return jsonify({"error": "Failed to retrieve data from database. Check DB logs."}), 500
        
        # Cek apakah ada cukup data setelah aggregasi dan pengambilan dari DB
        # Harusnya kita punya cukup data untuk sequence_length setelah semua MA dll dihitung
        if len(df_monthly_user_data) < sequence_length:
            return jsonify({"error": f"Not enough historical data for user {user_id}. Requires at least {sequence_length} months (after DB aggregation). Received {len(df_monthly_user_data)} months."}), 400
        
        # Panggil fungsi pra-pemrosesan yang sudah disesuaikan
        processed_input = preprocess_input_data(df_monthly_user_data, features_list, sequence_length)

        # Lakukan prediksi
        prediction_scaled = model.predict(processed_input, verbose=0)[0][0]
        predicted_cashflow = scaler_target.inverse_transform([[prediction_scaled]])[0][0]

        # Analisis tren
        # Ambil Net Cashflow aktual bulan terakhir dari data yang diambil dari DB
        last_actual_cashflow_in_history = df_monthly_user_data['Net Cashflow'].iloc[-1]
        threshold_trend = last_actual_cashflow_in_history * 0.05
        trend_status = 'Stable'
        if predicted_cashflow > last_actual_cashflow_in_history + threshold_trend:
            trend_status = 'Upward'
        elif predicted_cashflow < last_actual_cashflow_in_history - threshold_trend:
            trend_status = 'Downward'

        return jsonify({
            "predicted_cashflow": float(predicted_cashflow),
            "predicted_trend": trend_status,
            "status": "success"
        })

    except Exception as e:
        # Logging error lebih detail di sisi server untuk debugging
        print(f"Prediction API Error: {e}")
        return jsonify({"error": str(e), "status": "failed"}), 500

# Untuk menjalankan aplikasi Flask
if __name__ == '__main__':
    # Pastikan model dan scaler dimuat saat aplikasi Flask dimulai
    load_artifacts()
    # Debug=True hanya untuk pengembangan. Dalam produksi, gunakan Gunicorn/uWSGI
    app.run(debug=True, host='0.0.0.0', port=5000)