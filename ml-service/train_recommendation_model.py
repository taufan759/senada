"""
Script to setup and train the financial tips recommendation model
Run this once to prepare the recommendation system
"""

import pandas as pd
import numpy as np
from recommendation_engine import FinancialTipsRecommender
import os

def generate_sample_tips():
    """Generate sample financial tips if file doesn't exist"""
    tips_data = {
        'content_id': range(1, 126),
        'title': [],
        'category': [],
        'topic': [],
        'target_behavior': []
    }
    
    # Sample tips data
    sample_tips = [
        # Basic budgeting tips
        ("Cara Membuat Anggaran Bulanan yang Efektif", "basic_budgeting", "budgeting", "budget_planning"),
        ("50/30/20 Rule: Atur Keuangan dengan Mudah", "basic_budgeting", "budgeting", "budget_planning"),
        ("Track Pengeluaran Harian Anda", "basic_budgeting", "expense_tracking", "reduce_expenses"),
        ("Mengenal Kebutuhan vs Keinginan", "basic_budgeting", "financial_literacy", "optimize_spending"),
        ("Tips Mencatat Keuangan untuk Pemula", "basic_budgeting", "expense_tracking", "budget_planning"),
        
        # Expense reduction tips
        ("10 Cara Hemat Belanja Bulanan", "expense_reduction", "shopping", "reduce_expenses"),
        ("Hemat Listrik dengan Cara Sederhana", "expense_reduction", "utilities", "reduce_expenses"),
        ("Meal Prep: Hemat Uang Makan", "expense_reduction", "food", "reduce_expenses"),
        ("Bandingkan Harga Sebelum Membeli", "expense_reduction", "shopping", "optimize_spending"),
        ("Kurangi Langganan yang Tidak Perlu", "expense_reduction", "subscriptions", "reduce_expenses"),
        
        # Savings tips
        ("Mulai Menabung dengan Rp 10.000", "savings_tips", "saving", "start_saving"),
        ("Automatic Saving: Set and Forget", "savings_tips", "saving", "increase_savings"),
        ("Challenge Menabung 52 Minggu", "savings_tips", "saving", "increase_savings"),
        ("Tips Menabung untuk Anak Muda", "savings_tips", "saving", "start_saving"),
        ("Cara Menabung 30% dari Gaji", "savings_tips", "saving", "increase_savings"),
        
        # Emergency fund
        ("Pentingnya Dana Darurat", "emergency_fund", "emergency", "start_saving"),
        ("Berapa Besar Dana Darurat Ideal?", "emergency_fund", "emergency", "increase_savings"),
        ("Cara Membangun Dana Darurat", "emergency_fund", "emergency", "start_saving"),
        ("Kapan Menggunakan Dana Darurat?", "emergency_fund", "emergency", "manage_risk"),
        ("Dana Darurat vs Tabungan Biasa", "emergency_fund", "emergency", "financial_planning"),
        
        # Debt management
        ("Strategi Melunasi Utang Kartu Kredit", "debt_management", "credit_card", "manage_debt"),
        ("Debt Snowball vs Debt Avalanche", "debt_management", "debt_strategy", "manage_debt"),
        ("Cara Negosiasi Bunga Pinjaman", "debt_management", "loans", "manage_debt"),
        ("Hindari Jebakan Pinjaman Online", "debt_management", "online_loans", "manage_risk"),
        ("Konsolidasi Utang: Pro dan Kontra", "debt_management", "debt_strategy", "manage_debt"),
        
        # Investment basics
        ("Investasi untuk Pemula", "investment", "investing", "invest_wisely"),
        ("Mengenal Risiko Investasi", "investment", "risk", "manage_risk"),
        ("Reksadana vs Saham: Mana yang Cocok?", "investment", "instruments", "invest_wisely"),
        ("Dollar Cost Averaging Explained", "investment", "strategy", "invest_wisely"),
        ("Diversifikasi Portfolio Investasi", "investment", "strategy", "manage_risk"),
        
        # Digital finance
        ("Keamanan Transaksi Online", "digital_finance", "security", "online_safety"),
        ("E-Wallet: Tips Penggunaan Aman", "digital_finance", "e_wallet", "online_safety"),
        ("Waspada Penipuan Online", "digital_finance", "fraud", "online_safety"),
        ("Manfaatkan Promo Digital Wisely", "digital_finance", "promotions", "optimize_spending"),
        ("Digital Banking untuk Millennials", "digital_finance", "banking", "financial_planning"),
        
        # Financial planning
        ("Rencana Keuangan untuk Menikah", "financial_planning", "life_events", "financial_planning"),
        ("Persiapan Dana Pendidikan Anak", "financial_planning", "education", "long_term_planning"),
        ("Kapan Waktu Tepat Beli Rumah?", "financial_planning", "property", "long_term_planning"),
        ("Retirement Planning di Usia 30", "financial_planning", "retirement", "long_term_planning"),
        ("Asuransi: Proteksi atau Investasi?", "financial_planning", "insurance", "manage_risk"),
    ]
    
    # Extend to 125 tips by repeating and modifying
    all_tips = []
    categories = ["basic_budgeting", "expense_reduction", "savings_tips", "emergency_fund", 
                  "debt_management", "investment", "digital_finance", "financial_planning",
                  "smart_spending", "wealth_building", "tax_optimization", "side_income"]
    
    behaviors = ["reduce_expenses", "increase_savings", "manage_debt", "invest_wisely",
                 "start_saving", "budget_planning", "optimize_spending", "manage_risk",
                 "online_safety", "financial_planning", "long_term_planning", "grow_wealth"]
    
    # Use sample tips first
    for i in range(min(40, 125)):
        if i < len(sample_tips):
            all_tips.append(sample_tips[i])
        else:
            # Generate random tips for the rest
            cat = np.random.choice(categories)
            behav = np.random.choice(behaviors)
            title = f"Financial Tip #{i+1}: {cat.replace('_', ' ').title()}"
            topic = cat.split('_')[0]
            all_tips.append((title, cat, topic, behav))
    
    # Fill the rest with variations
    while len(all_tips) < 125:
        base_tip = sample_tips[len(all_tips) % len(sample_tips)]
        title = f"{base_tip[0]} - Part {(len(all_tips) // len(sample_tips)) + 1}"
        all_tips.append((title, base_tip[1], base_tip[2], base_tip[3]))
    
    # Populate the dataframe
    for i, (title, category, topic, behavior) in enumerate(all_tips[:125]):
        tips_data['title'].append(title)
        tips_data['category'].append(category)
        tips_data['topic'].append(topic)
        tips_data['target_behavior'].append(behavior)
    
    return pd.DataFrame(tips_data)

def generate_sample_behavior_data():
    """Generate sample user behavior data if file doesn't exist"""
    np.random.seed(42)
    
    behavior_data = {
        'user_id': [f'user_{i:03d}' for i in range(1, 201)],
        'total_pemasukan_bulan_ini': [],
        'total_pengeluaran_bulan_ini': [],
        'proporsi_pengeluaran_primer': [],
        'frekuensi_transaksi_online': [],
        'saldo_tabungan_akhir_bulan': [],
        'jumlah_utang_saat_ini': []
    }
    
    # Generate realistic financial behavior data
    for i in range(200):
        # Income (varied distribution)
        if i < 40:  # Low income
            income = np.random.normal(3000000, 500000)
        elif i < 120:  # Middle income
            income = np.random.normal(7000000, 2000000)
        else:  # High income
            income = np.random.normal(15000000, 5000000)
        
        income = max(1000000, income)  # Minimum income
        
        # Expenses (60-95% of income typically)
        expense_ratio = np.random.beta(7, 3)  # Skewed towards 70-80%
        expenses = income * expense_ratio
        
        # Primary expenses (50-80% of total expenses)
        primary_ratio = np.random.uniform(0.5, 0.8)
        
        # Online transactions (depends on age/tech savvy)
        online_freq = int(np.random.gamma(3, 5))
        
        # Savings (correlated with income-expense gap)
        savings_potential = income - expenses
        if savings_potential > 0:
            savings = savings_potential * np.random.uniform(2, 12)  # 2-12 months of savings
        else:
            savings = np.random.uniform(0, 500000)
        
        # Debt (inversely correlated with savings)
        if savings < 1000000:
            debt = np.random.exponential(2000000)
        else:
            debt = np.random.exponential(500000) if np.random.random() > 0.7 else 0
        
        behavior_data['total_pemasukan_bulan_ini'].append(int(income))
        behavior_data['total_pengeluaran_bulan_ini'].append(int(expenses))
        behavior_data['proporsi_pengeluaran_primer'].append(round(primary_ratio, 2))
        behavior_data['frekuensi_transaksi_online'].append(online_freq)
        behavior_data['saldo_tabungan_akhir_bulan'].append(int(max(0, savings)))
        behavior_data['jumlah_utang_saat_ini'].append(int(max(0, debt)))
    
    return pd.DataFrame(behavior_data)

def main():
    """Main training function"""
    print("🚀 Setting up Financial Tips Recommendation System")
    
    # Create data directory if not exists
    os.makedirs('data', exist_ok=True)
    os.makedirs('models', exist_ok=True)
    
    # Check if data files exist, if not create sample data
    if not os.path.exists('data/tips_finansial.csv'):
        print("📝 Generating sample tips data...")
        tips_df = generate_sample_tips()
        tips_df.to_csv('data/tips_finansial.csv', index=False)
        print(f"✅ Created tips_finansial.csv with {len(tips_df)} tips")
    
    if not os.path.exists('data/perilaku_keuangan_pengguna.csv'):
        print("📊 Generating sample user behavior data...")
        behavior_df = generate_sample_behavior_data()
        behavior_df.to_csv('data/perilaku_keuangan_pengguna.csv', index=False)
        print(f"✅ Created perilaku_keuangan_pengguna.csv with {len(behavior_df)} users")
    
    # Initialize recommender
    print("\n🔧 Initializing recommendation engine...")
    recommender = FinancialTipsRecommender()
    
    # Load data
    behavior_data = recommender.load_data()
    
    # Test recommendation for a sample user
    print("\n🧪 Testing recommendation system...")
    
    test_users = [
        {
            'name': 'Low Income User',
            'total_pemasukan_bulan_ini': 2500000,
            'total_pengeluaran_bulan_ini': 2300000,
            'proporsi_pengeluaran_primer': 0.85,
            'frekuensi_transaksi_online': 5,
            'saldo_tabungan_akhir_bulan': 200000,
            'jumlah_utang_saat_ini': 1000000
        },
        {
            'name': 'Middle Income User',
            'total_pemasukan_bulan_ini': 7000000,
            'total_pengeluaran_bulan_ini': 5000000,
            'proporsi_pengeluaran_primer': 0.70,
            'frekuensi_transaksi_online': 15,
            'saldo_tabungan_akhir_bulan': 5000000,
            'jumlah_utang_saat_ini': 2000000
        },
        {
            'name': 'High Income User',
            'total_pemasukan_bulan_ini': 20000000,
            'total_pengeluaran_bulan_ini': 12000000,
            'proporsi_pengeluaran_primer': 0.60,
            'frekuensi_transaksi_online': 30,
            'saldo_tabungan_akhir_bulan': 25000000,
            'jumlah_utang_saat_ini': 0
        }
    ]
    
    for test_user in test_users:
        print(f"\n--- Testing for {test_user['name']} ---")
        result = recommender.recommend_tips(test_user, n_recommendations=3)
        
        print(f"Financial Health Score: {result['financial_health_score']:.1f}/100")
        print(f"User Profile: Income Level={result['user_profile']['income_level']}, "
              f"Debt Level={result['user_profile']['debt_level']}, "
              f"Savings Level={result['user_profile']['savings_level']}")
        
        print("\nRecommended Tips:")
        for i, tip in enumerate(result['recommendations'], 1):
            print(f"{i}. {tip['title']}")
            print(f"   Category: {tip['category']}")
            print(f"   Reason: {tip['reason']}")
    
    # Save model
    print("\n💾 Saving recommendation model...")
    recommender.save_model()
    
    print("\n✅ Recommendation system setup complete!")
    print("\nFiles created:")
    print("- data/tips_finansial.csv")
    print("- data/perilaku_keuangan_pengguna.csv")
    print("- models/recommendation_model.pkl")

if __name__ == "__main__":
    main()