import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayouts';
import AppSettings from '../AppSettings';

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [filterPeriod, setFilterPeriod] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear, filterPeriod]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        getTransactions(),
        getBudgets()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactions = async () => {
    try {
      const response = await fetch(`${AppSettings.api}/transactions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        }
      });
      const data = await response.json();
      const formattedData = data.map((transaction) => ({
        ...transaction,
        date: new Date(transaction.date).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
      }));
      setTransactions(formattedData);
    } catch (error) {
      console.error(error);
    }
  };

  const getBudgets = async () => {
    try {
      const response = await fetch(`${AppSettings.api}/budget`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        }
      });
      const data = await response.json();
      setBudgets(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Filter transactions berdasarkan periode
  const filteredTransactions = transactions.filter((t) => {
    const [day, month, year] = t.date.split('/');
    const tDate = new Date(`${year}-${month}-${day}`);
    
    if (filterPeriod === 'month') {
      return tDate.getMonth() + 1 === selectedMonth && tDate.getFullYear() === selectedYear;
    } else if (filterPeriod === 'year') {
      return tDate.getFullYear() === selectedYear;
    }
    return true;
  });

  // Hitung statistik
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netIncome = totalIncome - totalExpense;

  // Group expenses by category
  const expenseByCategory = filteredTransactions
    .filter(t => t.type === 'Expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {});

  // Calculate budget utilization
  const budgetUtilization = budgets.map(budget => {
    const spent = filteredTransactions
      .filter(t => t.type === 'Expense' && t.category === budget.category)
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    return {
      ...budget,
      spent,
      utilization: budget.allocated ? (spent / budget.allocated * 100).toFixed(1) : 0
    };
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const exportToPDF = () => {
    window.print();
  };

  const exportToExcel = () => {
    // Simplified CSV export
    const headers = ['Tanggal', 'Tipe', 'Kategori', 'Nama Transaksi', 'Jumlah', 'Deskripsi'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => 
        [t.date, t.type, t.category, t.transactionName, t.amount, t.description || ''].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-keuangan-${selectedYear}-${selectedMonth}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat laporan...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 print:mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Laporan Keuangan</h1>
              <p className="text-gray-600">Ringkasan dan analisis keuangan Anda</p>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0 print:hidden">
              <button
                onClick={exportToPDF}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <span>📄</span>
                Export PDF
              </button>
              <button
                onClick={exportToExcel}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <span>📊</span>
                Export Excel
              </button>
            </div>
          </div>
        </div>

        {/* Filter Period */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 print:hidden">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Periode</label>
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="month">Bulanan</option>
                <option value="year">Tahunan</option>
              </select>
            </div>
            
            {filterPeriod === 'month' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bulan</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {monthNames.map((month, idx) => (
                    <option key={idx} value={idx + 1}>{month}</option>
                  ))}
                </select>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[2023, 2024, 2025].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-green-100">Total Pemasukan</h3>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(totalIncome)}</p>
            <p className="text-green-100 text-sm mt-2">
              {filteredTransactions.filter(t => t.type === 'Income').length} transaksi
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-red-100">Total Pengeluaran</h3>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💸</span>
              </div>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(totalExpense)}</p>
            <p className="text-red-100 text-sm mt-2">
              {filteredTransactions.filter(t => t.type === 'Expense').length} transaksi
            </p>
          </div>

          <div className={`bg-gradient-to-br ${netIncome >= 0 ? 'from-blue-500 to-blue-600' : 'from-gray-500 to-gray-600'} rounded-xl p-6 text-white`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-blue-100">Saldo Bersih</h3>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">{netIncome >= 0 ? '📈' : '📉'}</span>
              </div>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(netIncome)}</p>
            <p className="text-blue-100 text-sm mt-2">
              {netIncome >= 0 ? 'Surplus' : 'Defisit'} periode ini
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Expense by Category */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Pengeluaran per Kategori</h3>
            {Object.keys(expenseByCategory).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(expenseByCategory)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([category, amount], idx) => {
                    const percentage = totalExpense ? (amount / totalExpense * 100).toFixed(1) : 0;
                    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
                    
                    return (
                      <div key={idx}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">{category}</span>
                          <span className="text-sm text-gray-600">{formatCurrency(amount)} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${colors[idx % colors.length]} h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl mb-2 block">📊</span>
                <p>Belum ada pengeluaran pada periode ini</p>
              </div>
            )}
          </div>

          {/* Budget Utilization */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Penggunaan Anggaran</h3>
            {budgetUtilization.length > 0 ? (
              <div className="space-y-4">
                {budgetUtilization.slice(0, 5).map((budget, idx) => {
                  const statusColor = budget.utilization > 100 ? 'text-red-600' : 
                                    budget.utilization > 80 ? 'text-yellow-600' : 'text-green-600';
                  
                  return (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{budget.category}</p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(budget.spent)} / {formatCurrency(budget.allocated)}
                        </p>
                      </div>
                      <span className={`text-lg font-bold ${statusColor}`}>
                        {budget.utilization}%
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl mb-2 block">💳</span>
                <p>Belum ada anggaran yang ditetapkan</p>
              </div>
            )}
          </div>
        </div>

        {/* Transaction Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Detail Transaksi</h3>
          {filteredTransactions.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipe
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kategori
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Keterangan
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jumlah
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransactions.slice(0, 10).map((transaction, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            transaction.type === 'Income' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.category}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {transaction.transactionName}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                          transaction.type === 'Income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'Income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredTransactions.length > 10 && (
                <p className="text-center text-sm text-gray-500 mt-4">
                  Menampilkan 10 dari {filteredTransactions.length} transaksi
                </p>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <span className="text-5xl mb-4 block">📋</span>
              <p className="text-lg font-medium mb-2">Belum ada transaksi</p>
              <p className="text-sm">Transaksi pada periode ini akan muncul di sini</p>
            </div>
          )}
        </div>

        {/* Print Footer */}
        <div className="hidden print:block mt-8 pt-4 border-t border-gray-300">
          <p className="text-sm text-gray-600 text-center">
            Laporan Keuangan SENADA - Dicetak pada {new Date().toLocaleDateString('id-ID')}
          </p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          @page {
            margin: 20mm;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:block {
            display: block !important;
          }
        }
      `}</style>
    </AppLayout>
  );
};

export default Reports;