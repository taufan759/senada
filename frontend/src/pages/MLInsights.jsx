import React from 'react';
import AppLayout from '../components/AppLayouts';
import CashflowPrediction from '../components/ml/CashflowPrediction';
import FinancialTips from '../components/ml/FinancialTips';

const MLInsights = () => {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-3xl">🤖</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                AI Financial Insights
              </h1>
              <p className="text-gray-600 mt-1">
                Get personalized predictions and recommendations powered by artificial intelligence
              </p>
            </div>
          </div>
          
          {/* Info Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white text-lg">ℹ️</span>
            </div>
            <p className="text-sm text-gray-700">
              <strong className="text-gray-800">Pro tip:</strong> Our AI analyzes your transaction patterns from the last 6 months to provide accurate predictions. The more data you have, the better the predictions!
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Cashflow Prediction Section */}
          <div className="transform hover:scale-[1.01] transition-transform duration-300">
            <CashflowPrediction />
          </div>

          {/* Financial Tips Section */}
          <div className="transform hover:scale-[1.01] transition-transform duration-300">
            <FinancialTips />
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-3">
              Want More Detailed Analysis?
            </h3>
            <p className="text-lg opacity-90 mb-6">
              Upgrade to Premium to unlock advanced AI features including weekly predictions, 
              investment recommendations, and personalized financial coaching.
            </p>
            <button className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg">
              Upgrade to Premium →
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default MLInsights;