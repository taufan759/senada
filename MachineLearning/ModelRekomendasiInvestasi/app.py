from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import tensorflow as tf
import joblib
import logging
import os # Tambahkan import os untuk menggabungkan path

# Inisialisasi Aplikasi Flask dan Logging
app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

# Memuat Model dan Preprocessor dari Sub-folder 'saved model'
MODEL = None
PREPROCESSOR = None
MODEL_DIR = 'saved_models' 
MODEL_PATH = os.path.join(MODEL_DIR, 'investment_recommendation_model.h5')
PREPROCESSOR_PATH = os.path.join(MODEL_DIR, 'investment_preprocessor.joblib')

try:
    logging.info(f"Mencari model di path: {MODEL_PATH}")
    logging.info(f"Mencari preprocessor di path: {PREPROCESSOR_PATH}")
    
    MODEL = tf.keras.models.load_model(MODEL_PATH)
    PREPROCESSOR = joblib.load(PREPROCESSOR_PATH)
    
    logging.info("Model dan preprocessor berhasil dimuat.")
except Exception as e:
    logging.error(f"Error saat memuat model atau preprocessor: {e}")
    logging.error("Pastikan Anda menjalankan script ini dari folder 'RekomendasiInvestasi' dan folder 'saved model' serta isinya ada di dalamnya.")

# ==============================================================================
# Data Master Produk Investasi
# ==============================================================================
def get_all_products():
    """Mendefinisikan semua produk investasi yang tersedia sebagai DataFrame."""
    products_data = [
        {'produk_id': 'P01', 'nama_produk': 'Reksa Dana Pasar Uang Amanah', 'jenis_produk': 'Reksa Dana Pasar Uang', 'tingkat_risiko_skor': 1, 'potensi_return_tahunan_persen': 4.5, 'likuiditas': 'Sangat Tinggi', 'minimum_investasi_rp': 10000},
        {'produk_id': 'P02', 'nama_produk': 'Tabungan Emas Digital', 'jenis_produk': 'Emas Digital', 'tingkat_risiko_skor': 2, 'potensi_return_tahunan_persen': 5.0, 'likuiditas': 'Tinggi', 'minimum_investasi_rp': 10000},
        {'produk_id': 'P03', 'nama_produk': 'SBN Ritel ORI025', 'jenis_produk': 'SBN Ritel', 'tingkat_risiko_skor': 2, 'potensi_return_tahunan_persen': 6.25, 'likuiditas': 'Rendah', 'minimum_investasi_rp': 1000000},
        {'produk_id': 'P04', 'nama_produk': 'Reksa Dana Pendapatan Tetap Stabil', 'jenis_produk': 'Reksa Dana Pendapatan Tetap', 'tingkat_risiko_skor': 3, 'potensi_return_tahunan_persen': 7.0, 'likuiditas': 'Sedang', 'minimum_investasi_rp': 100000},
        {'produk_id': 'P05', 'nama_produk': 'Reksa Dana Campuran Seimbang', 'jenis_produk': 'Reksa Dana Campuran', 'tingkat_risiko_skor': 5, 'potensi_return_tahunan_persen': 10.0, 'likuiditas': 'Sedang', 'minimum_investasi_rp': 100000},
        {'produk_id': 'P06', 'nama_produk': 'Saham Bank BBCA', 'jenis_produk': 'Saham Blue Chip', 'tingkat_risiko_skor': 7, 'potensi_return_tahunan_persen': 15.0, 'likuiditas': 'Tinggi', 'minimum_investasi_rp': 1000000},
        {'produk_id': 'P07', 'nama_produk': 'Reksa Dana Saham Indeks LQ45', 'jenis_produk': 'Reksa Dana Indeks Saham', 'tingkat_risiko_skor': 8, 'potensi_return_tahunan_persen': 18.0, 'likuiditas': 'Sedang', 'minimum_investasi_rp': 100000},
        {'produk_id': 'P08', 'nama_produk': 'Saham Teknologi GOTO', 'jenis_produk': 'Saham Teknologi', 'tingkat_risiko_skor': 9, 'potensi_return_tahunan_persen': 25.0, 'likuiditas': 'Tinggi', 'minimum_investasi_rp': 50000},
    ]
    return pd.DataFrame(products_data)

DF_PRODUCTS = get_all_products()
EXPECTED_COLUMNS_ORDER = [
    'usia', 'pendapatan_bulanan_juta', 'jumlah_tanggungan', 'jangka_waktu_thn', 
    'target_dana_juta', 'tingkat_risiko_skor', 'potensi_return_tahunan_persen', 
    'minimum_investasi_rp', 'profil_risiko', 'tingkat_pengetahuan', 
    'status_pernikahan', 'tujuan_keuangan', 'jenis_produk', 'likuiditas'
]

# ==============================================================================
# Endpoint API untuk Rekomendasi
# ==============================================================================
@app.route('/recommend', methods=['POST'])
def recommend():
    """Endpoint untuk menerima data pengguna dan mengembalikan rekomendasi."""
    if MODEL is None or PREPROCESSOR is None:
        return jsonify({"error": "Model atau preprocessor tidak berhasil dimuat. Periksa log server."}), 500

    json_data = request.get_json()
    if not json_data:
        return jsonify({"error": "Request body harus dalam format JSON."}), 400

    logging.info(f"Menerima data input: {json_data}")

    required_keys = ['usia', 'profil_risiko', 'pendapatan_bulanan_juta', 'tingkat_pengetahuan', 'tujuan_keuangan', 'jangka_waktu_thn']
    if not all(key in json_data for key in required_keys):
        return jsonify({"error": f"Data tidak lengkap. Key yang dibutuhkan: {required_keys}"}), 400
    
    user_input = {**json_data}
    user_input.setdefault('status_pernikahan', 'Lajang')
    user_input.setdefault('jumlah_tanggungan', 0)
    user_input.setdefault('target_dana_juta', 100)

    inference_df = DF_PRODUCTS.copy()
    for key, value in user_input.items():
        if key in EXPECTED_COLUMNS_ORDER:
            inference_df[key] = value

    try:
        inference_df_ordered = inference_df[EXPECTED_COLUMNS_ORDER]
        data_processed = PREPROCESSOR.transform(inference_df_ordered)
        probabilities = MODEL.predict(data_processed)
    except Exception as e:
        logging.error(f"Error saat preprocessing atau prediksi: {e}")
        return jsonify({"error": "Terjadi kesalahan pada server saat memproses data."}), 500

    inference_df['skor_kecocokan'] = probabilities
    results = inference_df[inference_df['skor_kecocokan'] >= 0.5].sort_values('skor_kecocokan', ascending=False)
    
    top_3_results = results.head(3)
    recommendations = []
    for _, row in top_3_results.iterrows():
        recommendations.append({
            "nama_produk": row['nama_produk'],
            "jenis_produk": row['jenis_produk'],
            "tingkat_risiko": int(row['tingkat_risiko_skor']),
            "skor_kecocokan": float(row['skor_kecocokan'])
        })

    logging.info(f"Mengirimkan {len(recommendations)} rekomendasi.")
    return jsonify({
        "status": "success",
        "message": "Rekomendasi berhasil dibuat",
        "rekomendasi": recommendations
    })

# ==============================================================================
# Menjalankan Aplikasi Flask
# ==============================================================================
if __name__ == '__main__':
    app.run(debug=True, port=5000)