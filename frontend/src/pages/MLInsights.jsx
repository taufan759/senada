import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayouts';
import AppSettings from '../AppSettings';

const MLInsights = () => {
  const [activeTab, setActiveTab] = useState('cashflow');
  const [loading, setLoading] = useState(false);
  const [cashflowData, setCashflowData] = useState(null);
  const [financialTips, setFinancialTips] = useState([]);
  const [anomalies, setAnomalies] = useState([]);

  useEffect(() => {
    loadMLData();
  }, []);

  const loadMLData = async () => {
    setLoading(true);
    try {
      // Simulasi loading data dari ML API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Data dummy untuk demo - replace dengan actual API calls
      setCashflowData({
        currentMonth: {
          predicted_income: 8500000,
          predicted_expense: 6200000,
          predicted_balance: 2300000,
          confidence: 85
        },
        nextMonths: [
          { month: 'Juli 2025', income: 8700000, expense: 6400000, balance: 2300000 },
          { month: 'Agustus 2025', income: 8600000, expense: 6100000, balance: 2500000 },
          { month: 'September 2025', income: 9000000, expense: 6500000, balance: 2500000 },
        ],
        insights: [
          "Pendapatan Anda diprediksi stabil di kisaran Rp 8,5-9 juta",
          "Pengeluaran cenderung meningkat 3% bulan depan",
          "Surplus tertinggi diprediksi pada September 2025"
        ]
      });

      setFinancialTips([
        {
          id: 1,
          priority: 'high',
          icon: '💰',
          title: 'Optimalisasi Anggaran Makan',
          description: 'Berdasarkan analisis, pengeluaran makan Anda 25% di atas rata-rata. Coba meal prep untuk menghemat Rp 800.000/bulan.',
          impact: 'Hemat Rp 9.6 juta/tahun',
          category: 'budgeting'
        },
        {
          id: 2,
          priority: 'medium',
          icon: '📈',
          title: 'Peluang Investasi Reksa Dana',
          description: 'Dengan surplus rata-rata Rp 2,3 juta/bulan, Anda bisa mulai investasi reksa dana dengan return potensial 8-12%/tahun.',
          impact: 'Potensi return Rp 2.76 juta/tahun',
          category: 'investment'
        },
        {
          id: 3,
          priority: 'high',
          icon: '🎯',
          title: 'Dana Darurat Belum Optimal',
          description: 'Dana darurat Anda saat ini hanya 2 bulan pengeluaran. Idealnya 6-8 bulan untuk financial security yang lebih baik.',
          impact: 'Target tambahan Rp 24 juta',
          category: 'saving'
        }
      ]);

      setAnomalies([
        {
          id: 1,
          type: 'unusual_expense',
          severity: 'high',
          date: '2025-06-10',
          amount: 2500000,
          category: 'Hiburan',
          description: 'Pengeluaran hiburan 400% lebih tinggi dari rata-rata bulanan',
          suggestion: 'Periksa transaksi ini dan pertimbangkan untuk membuat budget hiburan yang lebih ketat'
        },
        {
          id: 2,
          type: 'missing_income',
          severity: 'medium',
          date: '2025-06-01',
          amount: 0,
          category: 'Gaji',
          description: 'Belum ada pemasukan gaji bulan ini, padahal biasanya masuk tanggal 1',
          suggestion: 'Cek dengan HR atau bank apakah ada keterlambatan transfer gaji'
        },
        {
          id: 3,
          type: 'duplicate_transaction',
          severity: 'low',
          date: '2025-06-08',
          amount: 150000,
          category: 'Makan',
          description: 'Transaksi serupa terdeteksi dalam waktu 5 menit',
          suggestion: 'Pastikan tidak ada double charge dari merchant'
        }
      ]);

    } catch (error) {
      console.error('Error loading ML data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  // Komponen Cashflow Prediction
  const CashflowPrediction = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">Prediksi Cashflow</h3>
              <p className="text-blue-100">Proyeksi keuangan 3 bulan mendatang</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Current Month Prediction */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Bulan Ini (Juni 2025)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-green-600 font-medium">Prediksi Pemasukan</span>
                  <span className="text-green-500">💰</span>
                </div>
                <p className="text-xl font-bold text-green-700">
                  {cashflowData && formatCurrency(cashflowData.currentMonth.predicted_income)}
                </p>
              </div>
              
              <div className="bg-red-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-red-600 font-medium">Prediksi Pengeluaran</span>
                  <span className="text-red-500">💸</span>
                </div>
                <p className="text-xl font-bold text-red-700">
                  {cashflowData && formatCurrency(cashflowData.currentMonth.predicted_expense)}
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-600 font-medium">Prediksi Surplus</span>
                  <span className="text-blue-500">💎</span>
                </div>
                <p className="text-xl font-bold text-blue-700">
                  {cashflowData && formatCurrency(cashflowData.currentMonth.predicted_balance)}
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tingkat Akurasi Prediksi</span>
                <span className="text-sm font-semibold text-gray-900">
                  {cashflowData && cashflowData.currentMonth.confidence}%
                </span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${cashflowData ? cashflowData.currentMonth.confidence : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Next 3 Months Forecast */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Proyeksi 3 Bulan Mendatang</h4>
            <div className="space-y-3">
              {cashflowData && cashflowData.nextMonths.map((month, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">{month.month}</h5>
                        <p className="text-sm text-gray-600">
                          Surplus: {formatCurrency(month.balance)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        <span className="text-green-600">+{formatCurrency(month.income)}</span>
                        {" / "}
                        <span className="text-red-600">-{formatCurrency(month.expense)}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">💡 Insights AI</h4>
            <div className="space-y-3">
              {cashflowData && cashflowData.insights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-3 bg-yellow-50 rounded-xl p-4">
                  <div className="w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-yellow-600 text-sm">💡</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Komponen Financial Tips
  const FinancialTips = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💡</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">Tips Keuangan AI</h3>
              <p className="text-purple-100">Rekomendasi personal berdasarkan pola keuangan Anda</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            {financialTips.map((tip) => (
              <div key={tip.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg">{tip.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{tip.title}</h4>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(tip.priority)}`}>
                          {tip.priority === 'high' ? 'Urgent' : tip.priority === 'medium' ? 'Penting' : 'Opsional'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{tip.description}</p>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-sm font-semibold text-blue-700">{tip.impact}</p>
                  </div>
                </div>
                <div className="p-4">
                  <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105">
                    Terapkan Sekarang
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-4">📊 Ringkasan Rekomendasi</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {financialTips.filter(tip => tip.priority === 'high').length}
                </div>
                <div className="text-sm text-gray-600">Tips Urgent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {financialTips.length}
                </div>
                <div className="text-sm text-gray-600">Total Tips</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  Rp 15M+
                </div>
                <div className="text-sm text-gray-600">Potensi Penghematan</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Komponen Anomaly Detection
  const AnomalyDetection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🔍</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">Deteksi Anomali</h3>
              <p className="text-red-100">AI mendeteksi pola transaksi yang tidak biasa</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-red-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-red-600 font-medium">Anomali Tinggi</span>
                <span className="text-red-500">🚨</span>
              </div>
              <p className="text-2xl font-bold text-red-700">
                {anomalies.filter(a => a.severity === 'high').length}
              </p>
            </div>
            
            <div className="bg-yellow-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-yellow-600 font-medium">Anomali Sedang</span>
                <span className="text-yellow-500">⚠️</span>
              </div>
              <p className="text-2xl font-bold text-yellow-700">
                {anomalies.filter(a => a.severity === 'medium').length}
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-blue-600 font-medium">Anomali Rendah</span>
                <span className="text-blue-500">ℹ️</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">
                {anomalies.filter(a => a.severity === 'low').length}
              </p>
            </div>
          </div>

          {/* Anomalies List */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">🔍 Anomali Terdeteksi</h4>
            {anomalies.map((anomaly) => (
              <div key={anomaly.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className={`w-3 h-3 rounded-full ${getSeverityColor(anomaly.severity)} mt-2 flex-shrink-0`}></div>
                  <div className="flex-grow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h5 className="font-semibold text-gray-900">
                          {anomaly.type === 'unusual_expense' ? '💸 Pengeluaran Tidak Biasa' :
                           anomaly.type === 'missing_income' ? '❌ Pemasukan Hilang' :
                           anomaly.type === 'duplicate_transaction' ? '🔄 Transaksi Duplikat' : 
                           'Anomali Terdeteksi'}
                        </h5>
                        <p className="text-sm text-gray-600">{anomaly.date} • {anomaly.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {anomaly.amount > 0 ? formatCurrency(anomaly.amount) : '-'}
                        </p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          anomaly.severity === 'high' ? 'bg-red-100 text-red-700' :
                          anomaly.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {anomaly.severity === 'high' ? 'Tinggi' : 
                           anomaly.severity === 'medium' ? 'Sedang' : 'Rendah'}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{anomaly.description}</p>
                    <div className="bg-blue-50 rounded-lg p-3 mb-3">
                      <p className="text-sm text-blue-700">
                        <strong>💡 Saran:</strong> {anomaly.suggestion}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors">
                        Investigasi
                      </button>
                      <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium transition-colors">
                        Tandai Normal
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {anomalies.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-500 text-2xl">✅</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak Ada Anomali</h3>
              <p className="text-gray-500">Semua transaksi Anda terlihat normal</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

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

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-200 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('cashflow')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'cashflow'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>📈</span>
              <span>Cashflow Prediction</span>
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'tips'
                  ? 'bg-white text-purple-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>💡</span>
              <span>Financial Tips</span>
            </button>
            <button
              onClick={() => setActiveTab('anomaly')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'anomaly'
                  ? 'bg-white text-red-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>🔍</span>
              <span>Anomaly Detection</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {loading ? (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'cashflow' && <CashflowPrediction />}
              {activeTab === 'tips' && <FinancialTips />}
              {activeTab === 'anomaly' && <AnomalyDetection />}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default MLInsights;