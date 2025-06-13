Proyek Deteksi Anomali Transaksi Keuangan
Sebuah API berbasis Flask dan TensorFlow untuk mendeteksi transaksi keuangan yang mencurigakan secara real-time.

Deskripsi Proyek
Proyek ini merupakan implementasi dari sebuah model machine learning (Deep Neural Network) yang telah dilatih untuk mengklasifikasikan sebuah transaksi sebagai NORMAL atau ANOMALI (FRAUD). Karena kelangkaan data fraud, model ini dilatih menggunakan dataset sintetis yang dibuat secara terprogram untuk merepresentasikan berbagai skenario anomali.

Aplikasi ini diekspos melalui sebuah API sederhana menggunakan framework Flask, yang siap untuk diintegrasikan dengan aplikasi frontend (web atau mobile).

Tumpukan Teknologi (Technology Stack)
Backend Framework: Flask

ML Framework: TensorFlow / Keras

Data & Preprocessing: Pandas, Scikit-learn, NumPy, Joblib

Bahasa: Python 3.9+

Struktur Direktori
Struktur folder proyek yang direkomendasikan adalah sebagai berikut untuk memastikan aplikasi berjalan dengan benar:

/proyek_deteksi_anomali/
|
├── app.py              # File utama aplikasi Flask
|
├── data.json           # (Opsional) File untuk pengujian API
|
└── /saved_models/
    |
    ├── preprocessor.joblib   # File preprocessor yang sudah dilatih
    |
    └── model.h5              # File model H5 yang sudah dilatih
    

Instalasi dan Konfigurasi
Untuk menjalankan aplikasi ini di lingkungan lokal, ikuti langkah-langkah berikut:

Clone atau Download Proyek
Pastikan Anda memiliki semua file (app.py, folder saved_models, dll.) di dalam satu folder utama.

Buat dan Aktifkan Virtual Environment
Sangat disarankan untuk menggunakan lingkungan virtual untuk menghindari konflik library. Buka terminal di folder utama proyek dan jalankan:

# Buat environment (hanya sekali)
python -m venv venv

# Aktifkan environment (setiap kali Anda membuka terminal baru)
# Untuk Windows (PowerShell/CMD):
.\venv\Scripts\activate
# Untuk macOS/Linux:
# source venv/bin/activate

Instal Dependencies
Dengan environment yang sudah aktif, instal semua library yang dibutuhkan dengan perintah berikut:

pip install Flask tensorflow pandas scikit-learn joblib

Menjalankan Aplikasi
Setelah semua library terinstal, jalankan server Flask dari terminal Anda:

python app.py

Jika berhasil, Anda akan melihat output yang menandakan server berjalan, seperti:

>>> Model (.h5) dan Preprocessor berhasil dimuat.
>>> Aplikasi siap menerima request.
 * Serving Flask app 'app'
 * Running on http://127.0.0.1:5000

Biarkan terminal ini tetap berjalan.

Dokumentasi API Endpoint
Prediksi Anomali
Endpoint ini menerima detail sebuah transaksi dan mengembalikan prediksi apakah transaksi tersebut normal atau anomali.

URL: /predict

Method: POST

Headers: Content-Type: application/json

Body Request (Contoh JSON):

{
    "amount": 5000000.0,
    "transaction_type": "withdrawal",
    "merchant_category": "electronics",
    "location": "Lagos",
    "hour_of_day": 3,
    "day_of_week": 5
}

Success Response (Contoh JSON):

{
    "conclusion": "ANOMALI (FRAUD)",
    "input_data": {
        "amount": 5000000.0,
        "day_of_week": 5,
        "hour_of_day": 3,
        "location": "Lagos",
        "merchant_category": "electronics",
        "transaction_type": "withdrawal"
    },
    "prediction_probability": 0.9987
}

Error Response (Contoh JSON jika input kurang):

{
    "error": "Input tidak lengkap. Fitur yang dibutuhkan: ['amount', 'transaction_type', ...]"
}

Contoh Pengujian dengan curl (Windows PowerShell):
Untuk menguji, Anda bisa menggunakan file data.json yang telah kita buat.

# Pastikan Anda berada di direktori yang sama dengan data.json
Invoke-WebRequest -Uri http://127.0.0.1:5000/predict -Method POST -ContentType "application/json" -Body (Get-Content -Raw data.json)
