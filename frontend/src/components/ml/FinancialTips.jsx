import React, { useState, useEffect } from 'react';
import mlService from '../../services/mlService';

const FinancialTips = () => {
  const [tipsData, setTipsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [completedTips, setCompletedTips] = useState([]);

  const fetchTips = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await mlService.getFinancialTips();
      if (response.success) {
        setTipsData(response.data);
      } else {
        setError(response.message || 'Failed to get tips');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching tips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, []);

  const getCategoryGradient = (category) => {
    const gradients = {
      'basic_budgeting': 'from-blue-500 to-cyan-400',
      'expense_reduction': 'from-red-500 to-pink-400',
      'savings_tips': 'from-green-500 to-emerald-400',
      'emergency_fund': 'from-indigo-500 to-purple-400',
      'debt_management': 'from-orange-500 to-red-400',
      'investment': 'from-purple-500 to-pink-400',
      'digital_finance': 'from-teal-500 to-cyan-400',
      'financial_planning': 'from-yellow-500 to-orange-400'
    };
    return gradients[category] || 'from-gray-500 to-gray-400';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'basic_budgeting': '📊',
      'expense_reduction': '💸',
      'savings_tips': '💰',
      'emergency_fund': '🏦',
      'debt_management': '💳',
      'investment': '📈',
      'digital_finance': '📱',
      'financial_planning': '📋'
    };
    return icons[category] || '💡';
  };

  const getHealthScoreGradient = (score) => {
    if (score >= 70) return 'from-green-500 to-emerald-400';
    if (score >= 40) return 'from-yellow-500 to-orange-400';
    return 'from-red-500 to-pink-400';
  };

  const getHealthScoreLabel = (score) => {
    if (score >= 70) return { text: 'Excellent', emoji: '🌟' };
    if (score >= 40) return { text: 'Good', emoji: '👍' };
    return { text: 'Needs Attention', emoji: '⚠️' };
  };

  const formatCategory = (category) => {
    return category.replace(/_/g, ' ').split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const toggleTipCompletion = (tipId) => {
    setCompletedTips(prev => 
      prev.includes(tipId) 
        ? prev.filter(id => id !== tipId)
        : [...prev, tipId]
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl">💡</span>
            </div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Creating personalized tips for you...</p>
          <div className="mt-4 flex space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
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
            onClick={fetchTips} 
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!tipsData) return null;

  const healthLabel = getHealthScoreLabel(tipsData.financialHealthScore);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300">
            <span className="text-2xl">💡</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Your Financial Tips</h2>
            <p className="text-sm text-gray-500">Personalized recommendations by AI</p>
          </div>
        </div>
        <button 
          onClick={fetchTips}
          className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 transform hover:scale-105 group"
          title="Refresh tips"
        >
          <svg className="w-5 h-5 text-gray-600 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Financial Health Score */}
      <div className={`bg-gradient-to-br ${getHealthScoreGradient(tipsData.financialHealthScore)} rounded-2xl p-8 mb-8 text-white shadow-lg`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2 opacity-90">Financial Health Score</h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-5xl font-bold">{Math.round(tipsData.financialHealthScore)}</span>
              <span className="text-2xl opacity-80">/100</span>
            </div>
            <div className="flex items-center space-x-2 mt-3">
              <span className="text-2xl">{healthLabel.emoji}</span>
              <span className="text-lg font-semibold">{healthLabel.text}</span>
            </div>
          </div>
          
          {/* Profile Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-sm opacity-90 mb-1">Income Level</p>
              <div className="text-yellow-300">
                {'⭐'.repeat(tipsData.userProfile.incomeLevel)}
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-sm opacity-90 mb-1">Savings Level</p>
              <div className="text-yellow-300">
                {'⭐'.repeat(tipsData.userProfile.savingsLevel)}
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-sm opacity-90 mb-1">Debt Control</p>
              <div className="text-yellow-300">
                {'⭐'.repeat(tipsData.userProfile.debtLevel)}
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="text-sm opacity-90 mb-1">Spending</p>
              <p className="font-bold text-lg">{(tipsData.userProfile.expenseRatio * 100).toFixed(0)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Personalized Action Items</h3>
          <span className="text-sm text-gray-500">
            {completedTips.length} of {tipsData.recommendations.length} completed
          </span>
        </div>
        
        <div className="space-y-4">
          {tipsData.recommendations.map((tip, index) => (
            <div 
              key={tip.contentId} 
              className={`border rounded-2xl p-6 transition-all duration-300 ${
                completedTips.includes(tip.contentId)
                  ? 'bg-gray-50 border-gray-200 opacity-75'
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg transform hover:-translate-y-1'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${getCategoryGradient(tip.category)} rounded-xl flex items-center justify-center shadow-md flex-shrink-0`}>
                    <span className="text-xl">{getCategoryIcon(tip.category)}</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs text-gray-500 font-medium">TIP #{index + 1}</span>
                      {completedTips.includes(tip.contentId) && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                    <h4 className={`text-lg font-bold mb-2 ${
                      completedTips.includes(tip.contentId) ? 'text-gray-500 line-through' : 'text-gray-800'
                    }`}>
                      {tip.title}
                    </h4>
                  </div>
                </div>
              </div>
              
              <div className="ml-16 mb-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-3 py-1 text-xs rounded-full font-medium bg-gradient-to-r ${getCategoryGradient(tip.category)} text-white`}>
                    {formatCategory(tip.category)}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                    {tip.topic}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                    Score: {tip.relevanceScore.toFixed(1)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  <strong className="text-gray-700">Why this matters:</strong> {tip.reason}
                </p>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => toggleTipCompletion(tip.contentId)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                      completedTips.includes(tip.contentId)
                        ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        : 'bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-md hover:shadow-lg'
                    }`}
                  >
                    {completedTips.includes(tip.contentId) ? 'Mark as Pending' : 'Mark as Done'}
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all duration-200">
                    Learn More →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinancialTips;