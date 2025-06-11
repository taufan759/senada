import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.ensemble import RandomForestClassifier
import pickle
import os

class FinancialTipsRecommender:
    def __init__(self):
        self.tips_df = None
        self.scaler = StandardScaler()
        self.behavior_profiles = None
        self.model = None
        
    def load_data(self):
        """Load tips and user behavior data"""
        # Load tips dataset
        self.tips_df = pd.read_csv('data/tips_finansial.csv')
        print(f"Loaded {len(self.tips_df)} financial tips")
        
        # Load user behavior data for training
        behavior_df = pd.read_csv('data/perilaku_keuangan_pengguna.csv')
        print(f"Loaded behavior data for {len(behavior_df)} users")
        
        return behavior_df
    
    def create_user_profile(self, user_data):
        """Create user financial behavior profile"""
        profile = {
            'income_level': self._categorize_income(user_data.get('total_pemasukan_bulan_ini', 0)),
            'expense_ratio': user_data.get('total_pengeluaran_bulan_ini', 0) / max(user_data.get('total_pemasukan_bulan_ini', 1), 1),
            'primary_expense_ratio': user_data.get('proporsi_pengeluaran_primer', 0),
            'online_transaction_freq': user_data.get('frekuensi_transaksi_online', 0),
            'savings_level': self._categorize_savings(user_data.get('saldo_tabungan_akhir_bulan', 0)),
            'debt_level': self._categorize_debt(user_data.get('jumlah_utang_saat_ini', 0)),
            'financial_health_score': self._calculate_financial_health(user_data)
        }
        return profile
    
    def _categorize_income(self, income):
        """Categorize income level (1-5)"""
        if income < 3000000:
            return 1
        elif income < 5000000:
            return 2
        elif income < 10000000:
            return 3
        elif income < 20000000:
            return 4
        else:
            return 5
    
    def _categorize_savings(self, savings):
        """Categorize savings level (1-5)"""
        if savings < 1000000:
            return 1
        elif savings < 5000000:
            return 2
        elif savings < 10000000:
            return 3
        elif savings < 20000000:
            return 4
        else:
            return 5
    
    def _categorize_debt(self, debt):
        """Categorize debt level (1-5, inverse)"""
        if debt == 0:
            return 5
        elif debt < 1000000:
            return 4
        elif debt < 5000000:
            return 3
        elif debt < 10000000:
            return 2
        else:
            return 1
    
    def _calculate_financial_health(self, user_data):
        """Calculate overall financial health score (0-100)"""
        income = user_data.get('total_pemasukan_bulan_ini', 0)
        expenses = user_data.get('total_pengeluaran_bulan_ini', 0)
        savings = user_data.get('saldo_tabungan_akhir_bulan', 0)
        debt = user_data.get('jumlah_utang_saat_ini', 0)
        
        # Calculate ratios
        expense_ratio = min(expenses / max(income, 1), 1)
        savings_ratio = min(savings / max(income, 1), 2)
        debt_ratio = min(debt / max(income, 1), 3)
        
        # Calculate score (weighted)
        score = 100 * (
            0.3 * (1 - expense_ratio) +  # Lower expense ratio is better
            0.4 * min(savings_ratio / 2, 1) +  # Higher savings ratio is better
            0.3 * (1 - min(debt_ratio / 3, 1))  # Lower debt ratio is better
        )
        
        return max(0, min(100, score))
    
    def recommend_tips(self, user_data, n_recommendations=5):
        """Recommend tips based on user profile"""
        if self.tips_df is None:
            self.load_data()
        
        # Create user profile
        profile = self.create_user_profile(user_data)
        
        # Rule-based recommendations
        recommendations = []
        
        # 1. Based on financial health score
        if profile['financial_health_score'] < 30:
            # Poor financial health - basic tips
            priority_categories = ['basic_budgeting', 'debt_management', 'emergency_fund']
            priority_behaviors = ['reduce_expenses', 'manage_debt', 'start_saving']
        elif profile['financial_health_score'] < 60:
            # Average financial health - improvement tips
            priority_categories = ['smart_spending', 'savings_strategy', 'financial_planning']
            priority_behaviors = ['optimize_spending', 'increase_savings', 'budget_planning']
        else:
            # Good financial health - advanced tips
            priority_categories = ['investment', 'wealth_building', 'tax_optimization']
            priority_behaviors = ['invest_wisely', 'grow_wealth', 'optimize_taxes']
        
        # 2. Based on specific issues
        if profile['expense_ratio'] > 0.8:
            priority_categories.append('expense_reduction')
            priority_behaviors.append('reduce_expenses')
        
        if profile['debt_level'] < 3:
            priority_categories.append('debt_management')
            priority_behaviors.append('manage_debt')
        
        if profile['savings_level'] < 3:
            priority_categories.append('savings_tips')
            priority_behaviors.append('increase_savings')
        
        if profile['online_transaction_freq'] > 20:
            priority_categories.append('digital_finance')
            priority_behaviors.append('online_safety')
        
        # Filter and score tips
        scored_tips = []
        for idx, tip in self.tips_df.iterrows():
            score = 0
            
            # Category matching
            if tip['category'] in priority_categories:
                score += 3
            
            # Behavior matching
            if tip['target_behavior'] in priority_behaviors:
                score += 2
            
            # Add randomness to avoid same tips
            score += np.random.random() * 0.5
            
            scored_tips.append({
                'content_id': tip['content_id'],
                'title': tip['title'],
                'category': tip['category'],
                'topic': tip['topic'],
                'target_behavior': tip['target_behavior'],
                'relevance_score': score,
                'reason': self._get_recommendation_reason(tip, profile)
            })
        
        # Sort by score and get top N
        scored_tips.sort(key=lambda x: x['relevance_score'], reverse=True)
        recommendations = scored_tips[:n_recommendations]
        
        return {
            'user_profile': profile,
            'recommendations': recommendations,
            'financial_health_score': profile['financial_health_score']
        }
    
    def _get_recommendation_reason(self, tip, profile):
        """Generate reason for recommendation"""
        reasons = []
        
        if profile['expense_ratio'] > 0.8 and tip['category'] in ['expense_reduction', 'basic_budgeting']:
            reasons.append("Your expenses are high relative to income")
        
        if profile['debt_level'] < 3 and tip['category'] == 'debt_management':
            reasons.append("You have significant debt to manage")
        
        if profile['savings_level'] < 3 and tip['category'] in ['savings_tips', 'emergency_fund']:
            reasons.append("Your savings could be improved")
        
        if profile['financial_health_score'] < 50:
            reasons.append("This tip can help improve your financial health")
        
        return reasons[0] if reasons else "Recommended based on your financial profile"
    
    def save_model(self, filepath='models/recommendation_model.pkl'):
        """Save the recommendation model"""
        model_data = {
            'scaler': self.scaler,
            'behavior_profiles': self.behavior_profiles,
            'model_version': '1.0'
        }
        
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, 'wb') as f:
            pickle.dump(model_data, f)
        print(f"Model saved to {filepath}")
    
    def load_model(self, filepath='models/recommendation_model.pkl'):
        """Load the recommendation model"""
        try:
            with open(filepath, 'rb') as f:
                model_data = pickle.load(f)
            
            self.scaler = model_data['scaler']
            self.behavior_profiles = model_data['behavior_profiles']
            print(f"Model loaded from {filepath}")
            return True
        except Exception as e:
            print(f"Error loading model: {e}")
            return False

# Utility function for API use
def get_recommendations_for_user(user_financial_data):
    """Get recommendations for a user based on their financial data"""
    recommender = FinancialTipsRecommender()
    recommender.load_data()
    
    # Transform user data to expected format
    user_profile_data = {
        'total_pemasukan_bulan_ini': user_financial_data.get('monthly_income', 0),
        'total_pengeluaran_bulan_ini': user_financial_data.get('monthly_expenses', 0),
        'proporsi_pengeluaran_primer': user_financial_data.get('primary_expense_ratio', 0.7),
        'frekuensi_transaksi_online': user_financial_data.get('online_transactions', 10),
        'saldo_tabungan_akhir_bulan': user_financial_data.get('savings_balance', 0),
        'jumlah_utang_saat_ini': user_financial_data.get('current_debt', 0)
    }
    
    return recommender.recommend_tips(user_profile_data)