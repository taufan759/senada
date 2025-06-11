import React, { useState, useEffect } from 'react';
import mlService from '../../services/mlService';
import { formatters } from '../../utils/formatters';

const CashflowPrediction = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPrediction = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await mlService.getCashflowPrediction();
      if (response.success) {
        setPrediction(response.data.prediction);
      } else {
        setError(response.message || 'Failed to get prediction');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching prediction');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction();
  }, []);

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'Upward':
        return '📈';
      case 'Downward':
        return '📉';
      default:
        return '➡️';
    }
  };

  const getTrendColor = (trend) => {
    switch(trend) {
      case 'Upward':
        return 'from-green-500 to-emerald-400';
      case 'Downward':
        return 'from-red-500 to-pink-400';
      default:
        return 'from-yellow-500 to-orange-400';
    }
  };

  const getTrendTextColor = (trend) => {
    switch(trend) {
      case 'Upward':
        return 'text-green-600';
      case 'Downward':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl">🤖</span>
            </div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Analyzing your financial patterns...</p>
          <div className="mt-4 flex space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">⚠️</span>
            </div>
            <p className="font-semibold text-red-800">{error}</p>
          </div>
          <button 
            onClick={fetchPrediction} 
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!prediction) return null;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300">
            <span className="text-2xl">🤖</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Cashflow Prediction</h2>
            <p className="text-sm text-gray-500">AI-powered financial forecast</p>
          </div>
        </div>
        <button 
          onClick={fetchPrediction}
          className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 transform hover:scale-105 group"
          title="Refresh prediction"
        >
          <svg className="w-5 h-5 text-gray-600 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Next Month Prediction */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-600 font-medium">Next Month Forecast</p>
            <div className={`w-10 h-10 bg-gradient-to-br ${getTrendColor(prediction.trend)} rounded-xl flex items-center justify-center shadow-md`}>
              <span className="text-lg">{getTrendIcon(prediction.trend)}</span>
            </div>
          </div>
          <p className={`text-3xl font-bold ${getTrendTextColor(prediction.trend)} mb-2`}>
            {formatters.formatCurrency(prediction.nextMonthCashflow)}
          </p>
          <p className={`text-sm font-semibold ${getTrendTextColor(prediction.trend)}`}>
            {prediction.trend} Trend
          </p>
        </div>

        {/* Last Month Actual */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-600 font-medium">Last Month Actual</p>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-lg">📊</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {formatters.formatCurrency(prediction.lastMonthCashflow)}
          </p>
          <p className="text-sm text-gray-500">Baseline</p>
        </div>

        {/* Expected Change */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-600 font-medium">Expected Change</p>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-lg">🔄</span>
            </div>
          </div>
          <p className={`text-3xl font-bold ${
            prediction.percentageChange > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {prediction.percentageChange > 0 ? '+' : ''}
            {prediction.percentageChange.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-500">vs last month</p>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-xl">💡</span>
          </div>
          <h3 className="font-bold text-lg text-gray-800">AI Insights</h3>
        </div>
        {prediction.trend === 'Upward' && (
          <p className="text-gray-700 leading-relaxed">
            Great news! Your cashflow is trending upward. This is a perfect opportunity to boost your savings or explore investment options. Consider allocating at least 20% of the extra income to your emergency fund or long-term goals.
          </p>
        )}
        {prediction.trend === 'Downward' && (
          <p className="text-gray-700 leading-relaxed">
            Heads up! Your cashflow might decrease next month. Now's the time to review your expenses and identify areas to cut back. Focus on essential spending and postpone any large purchases until your cashflow stabilizes.
          </p>
        )}
        {prediction.trend === 'Stable' && (
          <p className="text-gray-700 leading-relaxed">
            Your financial flow remains steady - that's consistency! Keep up your current habits while looking for small optimizations. Even a 5% improvement in expense management can make a significant difference over time.
          </p>
        )}
      </div>
    </div>
  );
};

export default CashflowPrediction;