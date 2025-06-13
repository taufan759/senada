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

  // FIXED: Export PDF dengan styling yang lebih baik
  const exportToPDF = () => {
    // Buat window baru untuk print
    const printWindow = window.open('', '_blank');
    const periodText = filterPeriod === 'month' 
      ? `${monthNames[selectedMonth - 1]} ${selectedYear}` 
      : `Tahun ${selectedYear}`;

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Laporan Keuangan - ${periodText}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            background: white;
          }
          
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #2563eb;
          }
          
          .header h1 {
            font-size: 24px;
            color: #1e40af;
            margin-bottom: 5px;
          }
          
          .header p {
            color: #666;
            font-size: 14px;
          }
          
          .period-info {
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 25px;
            text-align: center;
          }
          
          .summary-section {
            margin-bottom: 30px;
          }
          
          .summary-cards {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            margin-bottom: 20px;
          }
          
          .summary-card {
            flex: 1;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
          }
          
          .income-card {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
          }
          
          .expense-card {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
          }
          
          .balance-card {
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            color: white;
          }
          
          .summary-card h3 {
            font-size: 14px;
            opacity: 0.9;
            margin-bottom: 8px;
          }
          
          .summary-card .amount {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          
          .summary-card .count {
            font-size: 11px;
            opacity: 0.8;
          }
          
          .table-section {
            margin-bottom: 30px;
          }
          
          .table-section h3 {
            font-size: 16px;
            margin-bottom: 15px;
            color: #1e40af;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          
          th, td {
            padding: 10px;
            text-align: left;
            border: 1px solid #e5e7eb;
          }
          
          th {
            background: #f9fafb;
            font-weight: bold;
            color: #374151;
            font-size: 11px;
            text-transform: uppercase;
          }
          
          td {
            font-size: 11px;
          }
          
          .type-income {
            background: #dcfce7;
            color: #166534;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
          }
          
          .type-expense {
            background: #fee2e2;
            color: #991b1b;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
          }
          
          .amount-positive {
            color: #059669;
            font-weight: bold;
          }
          
          .amount-negative {
            color: #dc2626;
            font-weight: bold;
          }
          
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 10px;
          }
          
          .page-break {
            page-break-before: always;
          }
          
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>LAPORAN KEUANGAN</h1>
          <p>SENADA Financial Manager</p>
        </div>
        
        <div class="period-info">
          <strong>Periode: ${periodText}</strong><br>
          Dicetak pada: ${new Date().toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
        
        <div class="summary-section">
          <h3>Ringkasan Keuangan</h3>
          <div class="summary-cards">
            <div class="summary-card income-card">
              <h3>Total Pemasukan</h3>
              <div class="amount">${formatCurrency(totalIncome)}</div>
              <div class="count">${filteredTransactions.filter(t => t.type === 'Income').length} transaksi</div>
            </div>
            <div class="summary-card expense-card">
              <h3>Total Pengeluaran</h3>
              <div class="amount">${formatCurrency(totalExpense)}</div>
              <div class="count">${filteredTransactions.filter(t => t.type === 'Expense').length} transaksi</div>
            </div>
            <div class="summary-card balance-card">
              <h3>Saldo Bersih</h3>
              <div class="amount">${formatCurrency(netIncome)}</div>
              <div class="count">${netIncome >= 0 ? 'Surplus' : 'Defisit'}</div>
            </div>
          </div>
        </div>
        
        <div class="table-section">
          <h3>Detail Transaksi</h3>
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Tipe</th>
                <th>Kategori</th>
                <th>Keterangan</th>
                <th style="text-align: right;">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTransactions.map(t => `
                <tr>
                  <td>${t.date}</td>
                  <td>
                    <span class="${t.type === 'Income' ? 'type-income' : 'type-expense'}">
                      ${t.type === 'Income' ? 'Pemasukan' : 'Pengeluaran'}
                    </span>
                  </td>
                  <td>${t.category}</td>
                  <td>${t.transactionName}</td>
                  <td style="text-align: right;" class="${t.type === 'Income' ? 'amount-positive' : 'amount-negative'}">
                    ${t.type === 'Income' ? '+' : '-'}${formatCurrency(t.amount)}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="footer">
          <p>Laporan ini digenerate secara otomatis oleh SENADA Financial Manager</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Tunggu loading selesai kemudian print
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  // FIXED: Export Excel menggunakan proper Excel format
  const exportToExcel = () => {
    // Buat script untuk load SheetJS library
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    script.onload = () => {
      const XLSX = window.XLSX;
      
      // Data untuk summary
      const summaryData = [
        ['LAPORAN KEUANGAN'],
        [`Periode: ${filterPeriod === 'month' ? `${monthNames[selectedMonth - 1]} ${selectedYear}` : `Tahun ${selectedYear}`}`],
        [`Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`],
        [''],
        ['RINGKASAN KEUANGAN'],
        ['Total Pemasukan', formatCurrency(totalIncome)],
        ['Total Pengeluaran', formatCurrency(totalExpense)],
        ['Saldo Bersih', formatCurrency(netIncome)],
        [''],
        ['DETAIL TRANSAKSI'],
        ['Tanggal', 'Tipe', 'Kategori', 'Keterangan', 'Jumlah', 'Deskripsi']
      ];

      // Data transaksi
      const transactionData = filteredTransactions.map(t => [
        t.date,
        t.type === 'Income' ? 'Pemasukan' : 'Pengeluaran',
        t.category,
        t.transactionName,
        Number(t.amount),
        t.description || ''
      ]);

      // Gabungkan data
      const allData = [...summaryData, ...transactionData];

      // Buat worksheet
      const ws = XLSX.utils.aoa_to_sheet(allData);

      // Set column widths
      ws['!cols'] = [
        { wch: 12 }, // Tanggal
        { wch: 15 }, // Tipe
        { wch: 20 }, // Kategori
        { wch: 30 }, // Keterangan
        { wch: 18 }, // Jumlah
        { wch: 25 }  // Deskripsi
      ];

      // Style untuk header
      const headerStyle = {
        font: { bold: true },
        fill: { fgColor: { rgb: "CCCCCC" } }
      };

      // Style untuk summary
      const summaryStyle = {
        font: { bold: true, size: 12 },
        fill: { fgColor: { rgb: "E6F3FF" } }
      };

      // Apply styles
      ws['A1'] = { v: 'LAPORAN KEUANGAN', s: { font: { bold: true, size: 16 } } };
      ws['A5'] = { v: 'RINGKASAN KEUANGAN', s: summaryStyle };
      ws['A10'] = { v: 'DETAIL TRANSAKSI', s: summaryStyle };

      // Style untuk header tabel
      const headerRow = 10; // Row index untuk header tabel (0-based)
      ['A', 'B', 'C', 'D', 'E', 'F'].forEach(col => {
        const cellRef = col + (headerRow + 1);
        if (ws[cellRef]) {
          ws[cellRef].s = headerStyle;
        }
      });

      // Format currency columns
      transactionData.forEach((_, index) => {
        const rowIndex = summaryData.length + index + 1;
        const amountCell = `E${rowIndex}`;
        if (ws[amountCell]) {
          ws[amountCell].z = '"Rp "#,##0';
        }
      });

      // Buat workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Laporan Keuangan");

      // Download file
      const fileName = `Laporan-Keuangan-${selectedYear}-${selectedMonth < 10 ? '0' + selectedMonth : selectedMonth}.xlsx`;
      XLSX.writeFile(wb, fileName);
    };

    // Handle jika library gagal load
    script.onerror = () => {
      console.error('Failed to load XLSX library');
      // Fallback ke CSV
      exportToCSV();
    };

    document.head.appendChild(script);
  };

  // Fallback CSV export
  const exportToCSV = () => {
    const periodText = filterPeriod === 'month' 
      ? `${monthNames[selectedMonth - 1]} ${selectedYear}` 
      : `Tahun ${selectedYear}`;

    const csvContent = [
      ['LAPORAN KEUANGAN'],
      [`Periode: ${periodText}`],
      [`Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`],
      [''],
      ['RINGKASAN KEUANGAN'],
      ['Total Pemasukan', totalIncome],
      ['Total Pengeluaran', totalExpense],
      ['Saldo Bersih', netIncome],
      [''],
      ['DETAIL TRANSAKSI'],
      ['Tanggal', 'Tipe', 'Kategori', 'Keterangan', 'Jumlah', 'Deskripsi'],
      ...filteredTransactions.map(t => [
        t.date,
        t.type === 'Income' ? 'Pemasukan' : 'Pengeluaran',
        t.category,
        t.transactionName,
        t.amount,
        t.description || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-keuangan-${selectedYear}-${selectedMonth < 10 ? '0' + selectedMonth : selectedMonth}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
    </AppLayout>
  );
};

export default Reports;