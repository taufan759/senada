import os
import joblib
import pandas as pd
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify

# Inisialisasi aplikasi Flask
app = Flask(__name__)

# Definisikan path ke model dan preprocessor
MODEL_DIR = 'saved_models'
PREPROCESSOR_PATH = os.path.join(MODEL_DIR, 'preprocessor.joblib')
MODEL_PATH = os.path.join(MODEL_DIR, 'model.h5') 

# Muat artefak saat aplikasi dimulai
try:
    preprocessor = joblib.load(PREPROCESSOR_PATH)
    model = tf.keras.models.load_model(MODEL_PATH, compile=False)
    print(">>> Model dan Preprocessor berhasil dimuat.")
except Exception as e:
    print(f"XXX Gagal memuat model. Error: {e}")
    preprocessor = None
    model = None

@app.route('/predict', methods=['POST'])
def predict_anomaly():
    # Cek apakah model sudah dimuat
    if model is None or preprocessor is None:
        return jsonify({'error': 'Model tidak siap, periksa log server.'}), 500

    # 1. Ambil data JSON dari request
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body tidak valid.'}), 400

    # 2. Validasi input
    required_features = ['amount', 'transaction_type', 'merchant_category', 'location', 'hour_of_day', 'day_of_week']
    if not all(feature in data for feature in required_features):
        return jsonify({'error': f'Input tidak lengkap. Butuh: {required_features}'}), 400

    # 3. Ubah menjadi DataFrame
    input_df = pd.DataFrame([data])

    # 4. Lakukan prapemrosesan
    input_processed = preprocessor.transform(input_df)

    # 5. Lakukan prediksi
    prediction_proba = model.predict(input_processed)[0][0]
    prediction_class = 1 if prediction_proba > 0.5 else 0

    # 6. Format dan kembalikan respons
    result = {
        'input_data': data,
        'prediction_probability': float(prediction_proba),
        'conclusion': 'ANOMALI (FRAUD)' if prediction_class == 1 else 'NORMAL'
    }
    return jsonify(result)

# Endpoint dasar untuk mengecek status
@app.route('/', methods=['GET'])
def index():
    return "API Server Deteksi Anomali - Aktif."

# Blok untuk menjalankan aplikasi
if __name__ == '__main__':
    # port=5000 adalah port default Flask
    # debug=True membuat server otomatis restart jika ada perubahan kode
    app.run(port=5000, debug=True)