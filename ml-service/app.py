import mysql.connector
from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import tensorflow as tf
import pickle
import os
from flask_cors import CORS
from recommendation_engine import get_recommendations_for_user

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# --- Global Variables for Model Artifacts ---
model = None
scaler_features = None
scaler_target = None
features_list = None
sequence_length = None

# --- Path ke Model (sesuai struktur Anda) ---
MODEL_PATH = 'models/my_cashflow_prediction_model.h5'
SCALER_FEATURES_PATH = 'models/scaler_features.pkl'
SCALER_TARGET_PATH = 'models/scaler_target.pkl'
FEATURES_LIST_PATH = 'models/features_list.pkl'
SEQUENCE_LENGTH_PATH = 'models/sequence_length.pkl'

# --- Database Configuration ---
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',      # Kosong sesuai Database.js Anda
    'database': 'senada'
}

# --- Fungsi untuk Memuat Model dan Scaler ---
def load_artifacts():
    global model, scaler_features, scaler_target, features_list, sequence_length
    try:
        # Check if files exist
        files_to_check = {
            'Model': MODEL_PATH,
            'Scaler features': SCALER_FEATURES_PATH,
            'Scaler target': SCALER_TARGET_PATH,
            'Features list': FEATURES_LIST_PATH,
            'Sequence length': SEQUENCE_LENGTH_PATH
        }
        
        missing_files = []
        for name, path in files_to_check.items():
            if not os.path.exists(path):
                missing_files.append(f"{name}: {path}")
        
        if missing_files:
            print("❌ Missing files:")
            for file in missing_files:
                print(f"   - {file}")
            print("\n⚠️  Please run: python train_and_save_model.py")
            return False
        
        model = tf.keras.models.load_model(MODEL_PATH)
        with open(SCALER_FEATURES_PATH, 'rb') as f:
            scaler_features = pickle.load(f)
        with open(SCALER_TARGET_PATH, 'rb') as f:
            scaler_target = pickle.load(f)
        with open(FEATURES_LIST_PATH, 'rb') as f:
            features_list = pickle.load(f)
        with open(SEQUENCE_LENGTH_PATH, 'rb') as f:
            sequence_length = pickle.load(f)

        print("✅ Model and scalers loaded successfully.")
        print(f"Features expected: {features_list}")
        print(f"Sequence length: {sequence_length}")
        return True
    except Exception as e:
        print(f"❌ Error loading model or scalers: {e}")
        return False

# --- Preprocessing Function ---
def preprocess_input_data(df_monthly_raw_history, features_list, sequence_length):
    df_processed = df_monthly_raw_history.copy()

    # Add moving averages
    df_processed['Net_Cashflow_MA3'] = df_processed['Net Cashflow'].rolling(window=3, min_periods=1).mean()
    df_processed['Income_MA3'] = df_processed['Income'].rolling(window=3, min_periods=1).mean()
    df_processed['Expenses_MA3'] = df_processed['Expenses'].rolling(window=3, min_periods=1).mean()

    # Add seasonal features
    df_processed['Month'] = df_processed.index.month
    df_processed['is_lebaran_month'] = ((df_processed.index.month == 4) | (df_processed.index.month == 5)).astype(int)

    # Drop NaN values
    df_processed = df_processed.dropna()

    if len(df_processed) < sequence_length:
        raise ValueError(f"Not enough complete historical data. Requires at least {sequence_length} months.")

    # Get last n months
    last_n_months_data = df_processed.iloc[-sequence_length:]

    # Select features in correct order
    processed_values = last_n_months_data[features_list].values
    
    # Scale the data
    scaled_input = scaler_features.transform(processed_values)
    
    # Reshape for LSTM
    final_input = scaled_input.reshape(1, sequence_length, len(features_list))
    
    return final_input

# --- Fetch User Financial Data from Database (UPDATED FOR YOUR SCHEMA) ---
def fetch_user_financial_data(user_id, num_months_history):
    conn = None
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)

        # Get current date and calculate date range
        current_date = pd.Timestamp.now()
        end_of_current_month = current_date.to_period('M').end_time
        start_date_query = end_of_current_month - pd.DateOffset(months=num_months_history - 1)
        
        # Query UPDATED untuk schema Anda
        # Menggunakan 'type' bukan 'transaction_type' dan 'income'/'expense' bukan 'credit'/'debit'
        query = """
        SELECT
            CAST(DATE_FORMAT(date, '%%Y-%%m-01') AS DATE) AS month_start_date,
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income_sum,
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense_sum
        FROM
            transactions
        WHERE
            userId = %s AND date BETWEEN %s AND %s
        GROUP BY
            month_start_date
        ORDER BY
            month_start_date ASC;
        """
        
        cursor.execute(query, (user_id, start_date_query.strftime('%Y-%m-%d'), end_of_current_month.strftime('%Y-%m-%d')))
        records = cursor.fetchall()

        if not records:
            return pd.DataFrame()

        # Convert to DataFrame
        df_monthly = pd.DataFrame(records)
        df_monthly['month_start_date'] = pd.to_datetime(df_monthly['month_start_date'])
        df_monthly.set_index('month_start_date', inplace=True)
        df_monthly.index = df_monthly.index + pd.offsets.MonthEnd(0)

        df_monthly.rename(columns={'income_sum': 'Income', 'expense_sum': 'Expenses'}, inplace=True)
        df_monthly['Net Cashflow'] = df_monthly['Income'] - df_monthly['Expenses']

        print(f"📊 Fetched {len(df_monthly)} months of data for user {user_id}")
        print(df_monthly)
        
        return df_monthly

    except mysql.connector.Error as err:
        print(f"Database error: {err}")
        return None
    finally:
        if conn:
            conn.close()

# --- Health Check Endpoint ---
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None,
        "service": "ml-cashflow-prediction"
    })

# --- Main Prediction Endpoint ---
@app.route('/predict', methods=['POST'])
def predict_cashflow_from_db():
    if model is None:
        return jsonify({
            "error": "Model not loaded. Please check server logs.",
            "status": "failed"
        }), 503

    try:
        request_data = request.get_json(force=True)
        user_id = request_data.get('userId')  # camelCase sesuai JS convention

        if not user_id:
            return jsonify({"error": "User ID is required.", "status": "failed"}), 400

        print(f"🔍 Processing prediction for user: {user_id}")

        # Calculate required history (sequence_length + buffer for MA)
        required_history_for_features = sequence_length + 2

        # Fetch user data
        df_monthly_user_data = fetch_user_financial_data(user_id, required_history_for_features)

        if df_monthly_user_data is None:
            return jsonify({
                "error": "Failed to retrieve data from database.",
                "status": "failed"
            }), 500
        
        if len(df_monthly_user_data) < sequence_length:
            return jsonify({
                "error": f"Not enough historical data. Requires at least {sequence_length} months, found {len(df_monthly_user_data)} months.",
                "status": "failed"
            }), 400
        
        # Preprocess and predict
        processed_input = preprocess_input_data(df_monthly_user_data, features_list, sequence_length)
        prediction_scaled = model.predict(processed_input, verbose=0)[0][0]
        predicted_cashflow = scaler_target.inverse_transform([[prediction_scaled]])[0][0]

        # Analyze trend
        last_actual_cashflow = df_monthly_user_data['Net Cashflow'].iloc[-1]
        threshold_trend = abs(last_actual_cashflow * 0.05)
        
        if predicted_cashflow > last_actual_cashflow + threshold_trend:
            trend_status = 'Upward'
        elif predicted_cashflow < last_actual_cashflow - threshold_trend:
            trend_status = 'Downward'
        else:
            trend_status = 'Stable'

        # Prepare response
        response = {
            "status": "success",
            "data": {
                "userId": user_id,
                "prediction": {
                    "nextMonthCashflow": float(predicted_cashflow),
                    "trend": trend_status,
                    "lastMonthCashflow": float(last_actual_cashflow),
                    "percentageChange": float(((predicted_cashflow - last_actual_cashflow) / abs(last_actual_cashflow)) * 100) if last_actual_cashflow != 0 else 0
                },
                "timestamp": pd.Timestamp.now().isoformat()
            }
        }

        print(f"✅ Prediction successful: {predicted_cashflow:.2f} ({trend_status})")
        return jsonify(response)

    except Exception as e:
        print(f"❌ Prediction error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "error": str(e),
            "status": "failed"
        }), 500

# --- Financial Tips Recommendation Endpoint (UPDATED) ---
@app.route('/recommend-tips', methods=['POST'])
def recommend_financial_tips():
    try:
        request_data = request.get_json(force=True)
        user_id = request_data.get('userId')
        
        if not user_id:
            return jsonify({"error": "User ID is required.", "status": "failed"}), 400
        
        print(f"🎯 Getting recommendations for user: {user_id}")
        
        # Get user's current financial data from database
        conn = None
        try:
            conn = mysql.connector.connect(**DB_CONFIG)
            cursor = conn.cursor(dictionary=True)
            
            # Get user's financial summary for current month
            current_date = pd.Timestamp.now()
            start_of_month = current_date.replace(day=1)
            
            # Query UPDATED untuk schema Anda
            query = """
            SELECT 
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as monthly_income,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as monthly_expenses,
                COUNT(CASE WHEN type = 'expense' THEN 1 END) as transaction_count
            FROM transactions
            WHERE userId = %s 
                AND date >= %s 
                AND date <= %s
            """
            
            cursor.execute(query, (
                user_id, 
                start_of_month.strftime('%Y-%m-%d'),
                current_date.strftime('%Y-%m-%d')
            ))
            
            monthly_data = cursor.fetchone()
            
            # Get user's savings (last positive balance)
            savings_query = """
            SELECT 
                SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as balance
            FROM transactions
            WHERE userId = %s
            """
            cursor.execute(savings_query, (user_id,))
            balance_data = cursor.fetchone()
            
            # Prepare user financial data
            user_financial_data = {
                'monthly_income': float(monthly_data['monthly_income'] or 0),
                'monthly_expenses': float(monthly_data['monthly_expenses'] or 0),
                'primary_expense_ratio': 0.7,  # Default, could be calculated
                'online_transactions': int(monthly_data['transaction_count'] or 0),
                'savings_balance': max(0, float(balance_data['balance'] or 0)),
                'current_debt': 0  # Could be tracked separately
            }
            
            print(f"📊 User financial summary: {user_financial_data}")
            
        except mysql.connector.Error as err:
            print(f"Database error: {err}")
            user_financial_data = {
                'monthly_income': 0,
                'monthly_expenses': 0,
                'primary_expense_ratio': 0.7,
                'online_transactions': 0,
                'savings_balance': 0,
                'current_debt': 0
            }
        finally:
            if conn:
                conn.close()
        
        # Get recommendations
        recommendations = get_recommendations_for_user(user_financial_data)
        
        # Prepare response
        response = {
            "status": "success",
            "data": {
                "userId": user_id,
                "financialHealthScore": recommendations['financial_health_score'],
                "userProfile": {
                    "incomeLevel": recommendations['user_profile']['income_level'],
                    "expenseRatio": recommendations['user_profile']['expense_ratio'],
                    "savingsLevel": recommendations['user_profile']['savings_level'],
                    "debtLevel": recommendations['user_profile']['debt_level']
                },
                "recommendations": [
                    {
                        "contentId": tip['content_id'],
                        "title": tip['title'],
                        "category": tip['category'],
                        "topic": tip['topic'],
                        "targetBehavior": tip['target_behavior'],
                        "relevanceScore": tip['relevance_score'],
                        "reason": tip['reason']
                    }
                    for tip in recommendations['recommendations']
                ],
                "timestamp": pd.Timestamp.now().isoformat()
            }
        }
        
        print(f"✅ Recommendations generated successfully")
        return jsonify(response)
        
    except Exception as e:
        print(f"❌ Recommendation error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "error": str(e),
            "status": "failed"
        }), 500

# --- Run Flask App ---
if __name__ == '__main__':
    print("🚀 Starting ML Service...")
    if load_artifacts():
        app.run(debug=True, host='0.0.0.0', port=5001)
    else:
        print("❌ Failed to load models. Please check the setup.")