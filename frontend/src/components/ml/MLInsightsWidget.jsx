import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import mlService from '../../services/mlService';
import { formatters } from '../../utils/formatters';

const MLInsightsWidget = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuickInsights = async () => {
      try {
        const response = await mlService.getCashflowPrediction();
        if (response.success) {
          setPrediction(response.data.prediction);
        }
      } catch (err) {
        setError('Unable to load predictions');
      } finally {
        setLoading(false);
      }
    };

    fetchQuickInsights();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="animate-pulse">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            <div>
              <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error || !prediction) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 group hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">AI Insights</h3>
              <p className="text-xs text-gray-500">Powered by ML</p>
            </div>
          </div>
          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-xs px-3 py-1 rounded-full text-white font-bold animate-pulse">
            NEW
          </span>
        </div>
        <p className="text-gray-500 text-sm mb-4">Enable AI predictions to see financial insights</p>
        <Link 
          to="/ml-insights" 
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 transform hover:scale-105 shadow-md"
        >
          <span className="font-medium">Explore AI Features</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    );
  }

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'Upward': return '📈';
      case 'Downward': return '📉';
      default: return '➡️';
    }
  };

  const getTrendGradient = (trend) => {
    switch(trend) {
      case 'Upward': return 'from-green-500 to-emerald-400';
      case 'Downward': return 'from-red-500 to-pink-400';
      default: return 'from-yellow-500 to-orange-400';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 group hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
            <span className="text-2xl">🤖</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">AI Cashflow Prediction</h3>
            <p className="text-xs text-gray-500">Next month forecast</p>
          </div>
        </div>
        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-xs px-3 py-1 rounded-full text-white font-bold animate-pulse">
          AI
        </span>
      </div>

      <div className="mb-5">
        <div className="flex items-baseline space-x-3 mb-2">
          <span className="text-3xl font-bold text-gray-800">
            {formatters.formatCurrency(prediction.nextMonthCashflow)}
          </span>
          <div className={`w-8 h-8 bg-gradient-to-br ${getTrendGradient(prediction.trend)} rounded-lg flex items-center justify-center shadow-md`}>
            <span className="text-lg">{getTrendIcon(prediction.trend)}</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className={`text-sm font-semibold ${
            prediction.percentageChange > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {prediction.percentageChange > 0 ? '+' : ''}{prediction.percentageChange.toFixed(1)}%
            <span className="text-gray-500 font-normal ml-1">vs last month</span>
          </span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-sm text-gray-600 font-medium">
            {prediction.trend} trend
          </span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <Link 
          to="/ml-insights" 
          className="flex items-center justify-between group/link"
        >
          <span className="text-sm font-medium text-gray-600 group-hover/link:text-gray-800 transition-colors">
            View detailed analysis
          </span>
          <div className="flex items-center space-x-1 text-yellow-600">
            <span className="text-sm font-medium">See More</span>
            <svg className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </div>

      {/* Quick Insight */}
      {prediction.trend === 'Upward' && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3">
          <p className="text-xs text-green-700 font-medium">
            💡 Good news! Consider increasing your savings this month.
          </p>
        </div>
      )}
      {prediction.trend === 'Downward' && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="text-xs text-red-700 font-medium">
            💡 Time to review your expenses and cut unnecessary spending.
          </p>
        </div>
      )}
    </div>
  );
};

export default MLInsightsWidget;