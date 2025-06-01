import { useState } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const Dashboard = () => {
  // Data dummy untuk chart
  const monthlyData = [
    { month: 'Jan', income: 2500000, expense: 1200000 },
    { month: 'Feb', income: 2300000, expense: 1900000 },
    { month: 'Mar', income: 2400000, expense: 1500000 },
    { month: 'Apr', income: 2600000, expense: 1700000 },
    { month: 'Mei', income: 2700000, expense: 1400000 },
    { month: 'Jun', income: 2900000, expense: 1800000 },
  ];
  
  const categoryData = [
    { name: 'Makanan', percentage: 30, color: '#F9A826' },
    { name: 'Transportasi', percentage: 25, color: '#2E5EAA' },
    { name: 'Belanja', percentage: 20, color: '#FF6B6B' },
    { name: 'Hiburan', percentage: 15, color: '#4ECDC4' },
    { name: 'Lainnya', percentage: 10, color: '#A5A5A5' },
  ];
  
  const transactions = [
    { id: 1, date: '08/05/2025', description: 'Makan Siang', amount: -75000, category: 'Makanan' },
    { id: 2, date: '07/05/2025', description: 'Gaji Bulanan', amount: 5000000, category: 'Pendapatan' },
    { id: 3, date: '06/05/2025', description: 'Bensin', amount: -150000, category: 'Transportasi' },
    { id: 4, date: '05/05/2025', description: 'Belanja Bulanan', amount: -450000, category: 'Belanja' },
    { id: 5, date: '04/05/2025', description: 'Pembayaran Listrik', amount: -250000, category: 'Tagihan' },
  ];
  
  // Format angka ke format rupiah
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Dashboard Keuangan</h1>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-600">Total Saldo</h3>
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-lg">₹</span>
                </div>
              </div>
              <div className="mb-2">
                <p className="text-2xl font-bold">{formatCurrency(4325000)}</p>
              </div>
              <div className="flex items-center text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                <span>+8.2% dibanding bulan lalu</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-600">Pemasukan Bulan Ini</h3>
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-lg">₹</span>
                </div>
              </div>
              <div className="mb-2">
                <p className="text-2xl font-bold">{formatCurrency(5000000)}</p>
              </div>
              <div className="flex items-center text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                <span>+5.3% dibanding bulan lalu</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-600">Pengeluaran Bulan Ini</h3>
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-white text-lg">₹</span>
                </div>
              </div>
              <div className="mb-2">
                <p className="text-2xl font-bold">{formatCurrency(2675000)}</p>
              </div>
              <div className="flex items-center text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                </svg>
                <span>-2.7% dibanding bulan lalu</span>
              </div>
            </div>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Pemasukan & Pengeluaran</h2>
              
              {/* Simple bar chart visualization */}
              <div className="h-64">
                <div className="flex h-full items-end space-x-2">
                  {monthlyData.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full flex flex-col-reverse space-y-reverse space-y-1">
                        <div 
                          className="w-full bg-secondary rounded-t" 
                          style={{height: `${(data.expense / 3000000) * 100}%`}}
                          title={`Pengeluaran: ${formatCurrency(data.expense)}`}
                        ></div>
                        <div 
                          className="w-full bg-primary rounded-t" 
                          style={{height: `${(data.income / 3000000) * 100}%`}}
                          title={`Pemasukan: ${formatCurrency(data.income)}`}
                        ></div>
                      </div>
                      <span className="text-xs mt-2">{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center mt-4 space-x-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
                  <span className="text-sm">Pemasukan</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-secondary rounded-full mr-2"></div>
                  <span className="text-sm">Pengeluaran</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Kategori Pengeluaran</h2>
              
              {/* Simple donut chart visualization */}
              <div className="flex justify-center">
                <div className="relative w-52 h-52">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {categoryData.reduce((acc, category, i) => {
                      const prevTotal = acc.total;
                      const newTotal = prevTotal + category.percentage;
                      
                      // Create a donut slice
                      const startAngle = prevTotal * 3.6; // 3.6 degrees per percentage point
                      const endAngle = newTotal * 3.6;
                      
                      // Convert angles to radians
                      const startRad = (startAngle - 90) * Math.PI / 180;
                      const endRad = (endAngle - 90) * Math.PI / 180;
                      
                      // Calculate points
                      const x1 = 50 + 40 * Math.cos(startRad);
                      const y1 = 50 + 40 * Math.sin(startRad);
                      const x2 = 50 + 40 * Math.cos(endRad);
                      const y2 = 50 + 40 * Math.sin(endRad);
                      
                      // Create the arc
                      const largeArcFlag = category.percentage > 50 ? 1 : 0;
                      
                      const pathData = `
                        M 50 50
                        L ${x1} ${y1}
                        A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}
                        Z
                      `;
                      
                      acc.paths.push(
                        <path 
                          key={i} 
                          d={pathData} 
                          fill={category.color} 
                          stroke="#fff" 
                          strokeWidth="1"
                        />
                      );
                      
                      return { paths: acc.paths, total: newTotal };
                    }, { paths: [], total: 0 }).paths}
                    
                    {/* Inner circle to create donut */}
                    <circle cx="50" cy="50" r="25" fill="white" />
                  </svg>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-4">
                {categoryData.map((category, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: category.color}}></div>
                    <span className="text-sm">{category.name} ({category.percentage}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Transaksi Terbaru</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Tanggal</th>
                    <th className="py-3 px-6 text-left">Deskripsi</th>
                    <th className="py-3 px-6 text-left">Kategori</th>
                    <th className="py-3 px-6 text-right">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-6 text-left">{transaction.date}</td>
                      <td className="py-3 px-6 text-left">{transaction.description}</td>
                      <td className="py-3 px-6 text-left">{transaction.category}</td>
                      <td className={`py-3 px-6 text-right ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(transaction.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 text-center">
              <button className="text-primary hover:underline">Lihat Semua Transaksi</button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;