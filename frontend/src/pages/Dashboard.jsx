import { useState } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Modal from '../components/Element/Modal';
import AppSettings from '../AppSettings';
import { useEffect } from 'react';

const Dashboard = () => {
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [transactionName, setTransactionName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const [transactions, setTransactions] = useState([]);

  // menjalankan fungsi saat komponen pertama kali dimuat
  useEffect(() => {
    getTransactions();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      // input transaksi ke database
      fetch(`${AppSettings.api}/transactions/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          type: type,
          category: category,
          date: date,
          transactionName: transactionName,
          amount: amount,
          description: description,
        }),
      });

      alert('Transaction added successfully!');
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  }

  // mengambil data transaksi dari database
  const getTransactions = async () => {
    try {
      // ambil data transaksi dari API
      const response = await fetch(`${AppSettings.api}/transactions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        }
      });

      const data = await response.json();
      // Format tanggal menjadi dd/mm/yyyy
      const formattedData = data.map((transaction) => ({
        ...transaction,
        date: new Date(transaction.date).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
      }));

      // Set data transaksi ke state transactions
      setTransactions(formattedData);
    } catch (error) {
      console.error(error);
    }
  };

  // Generate monthly data dari data transactions untuk menampilkan grafik
  // dengan format { month: 'Jan', income: 0, expense: 0 }
  const monthlyData = (() => {
    // inisialisasi tanggal sekarang dan tahun saat ini
    const now = new Date();
    const currentYear = now.getFullYear();

    // inisialisasi nama bulan
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];

    // mempersiapkan data untuk setiap bulan
    const data = Array.from({ length: 6 }, (_, i) => ({
      month: monthNames[i],
      income: 0,
      expense: 0,
    }));

    transactions.forEach((t) => {
      // mengambil tanggal dari transaksi
      const [day, month, year] = t.date.split('/');
      const tDate = new Date(`${year}-${month}-${day}`);

      // hanya mengambil data untuk tahun saat ini
      if (tDate.getFullYear() === currentYear) {
        const idx = tDate.getMonth();
        if (t.type === 'Income') {
          data[idx].income += Number(t.amount);
        } else if (t.type === 'Expense') {
          data[idx].expense += Number(t.amount);
        }
      }
    });

    return data;
  })();

  // Generate category pengeluaran dari transactions
  const categoryTotals = transactions.reduce((acc, transaction) => {
    if (transaction.type === 'Expense') {
      acc[transaction.category] = (acc[transaction.category] || 0) + Number(transaction.amount);
    }
    return acc;
  }, {});

  // Hitung total pengeluaran
  const totalExpense = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

  const categoryColors = [
    '#F9A826',
    '#2E5EAA',
    '#FF6B6B',
    '#4ECDC4',
    '#A5A5A5',
  ];

  // membuat format data kategori untuk chart
  const categoryData = Object.entries(categoryTotals).map(([name, amount], idx) => ({
    name,
    percentage: totalExpense ? Math.round((amount / totalExpense) * 100) : 0,
    color: categoryColors[idx % categoryColors.length],
  }));


  // Hitung total pemasukan bulan ini
  const cashFlowThisMonth = (type) => {
    // Hitung pemasukan bulan ini dan bulan lalu
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    const cashFlowThisMonth = transactions
      .filter(t => {
        if (t.type !== type) return false;
        const [day, month, year] = t.date.split('/');
        const tDate = new Date(`${year}-${month}-${day}`);
        return tDate.getMonth() === thisMonth && tDate.getFullYear() === thisYear;
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const cashFlowLastMonth = transactions
      .filter(t => {
        if (t.type !== type) return false;
        const [day, month, year] = t.date.split('/');
        const tDate = new Date(`${year}-${month}-${day}`);
        return tDate.getMonth() === lastMonth && tDate.getFullYear() === lastMonthYear;
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);

    if (cashFlowLastMonth === 0) return <span className='text-blue-500'>Baru bulan ini</span>;
    const percent = ((cashFlowThisMonth - cashFlowLastMonth) / cashFlowLastMonth) * 100;
    const result = `${percent > 0 ? '+' : ''}${percent.toFixed(1)}`;

    if (percent > 0) {
      return (
        <div className={`flex items-center ${type === 'Income' ? 'text-green-500' : 'text-red-500'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
          </svg>
          <span>{result}% dibanding bulan lalu</span>
        </div>
      );
    } else if (percent < 0) {
      return (
        <div className={`flex items-center ${type === 'Income' ? 'text-red-500' : 'text-green-500'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
          </svg>
          <span>{result}% dibanding bulan lalu</span>
        </div>
      );
    } else {
      return <span className='text-blue-500'>{result}% dibanding bulan lalu</span>;
    }
  }


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
          <div className="grid grid-cols-2">
            <h1 className="text-3xl font-bold mb-8">Dashboard Keuangan</h1>
            <Modal>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="type" className="block text-sm/6 font-medium text-gray-900">
                      Type
                    </label>
                    <div className="grid grid-cols-1">
                      <select
                        id="type"
                        name="type"
                        autoComplete="type-name"
                        className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                      >
                        <option value="">Pilih Type</option>
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="category" className="block text-sm/6 font-medium text-gray-900">
                      Category
                    </label>
                    <div className="grid grid-cols-1">
                      <select
                        id="category"
                        name="category"
                        autoComplete="category-name"
                        className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="">Pilih Category</option>
                        <option value="Dining">Dining</option>
                        <option value="Fitness">Fitness</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="date" className="block text-sm/6 font-medium text-gray-900">
                      Date
                    </label>
                    <div>
                      <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                        <input
                          id="date"
                          name="date"
                          type="date"
                          className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                          onChange={(e) => setDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="amount" className="block text-sm/6 font-medium text-gray-900">
                      Amount
                    </label>
                    <div>
                      <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                        <input
                          id="amount"
                          name="amount"
                          type="number"
                          placeholder="0.00"
                          className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="transaction" className="block text-sm/6 font-medium text-gray-900">
                      Transaction Name
                    </label>
                    <div>
                      <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                        <input
                          id="transaction"
                          name="transaction"
                          type="text"
                          placeholder="Masukkan nama transaksi"
                          className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                          onChange={(e) => setTransactionName(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="note" className="block text-sm/6 font-medium text-gray-900">
                      Desciption
                    </label>
                    <div>
                      <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                        <textarea
                          id="note"
                          name="note"
                          rows="3"
                          placeholder="Tambahkan catatan jika perlu"
                          className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                          onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 sm:ml-3 sm:w-auto"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    data-autofocus
                    onClick={() => setOpen(false)}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </Modal>
          </div>

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
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    transactions.reduce((total, t) => {
                      if (t.type === 'Income') return total + Number(t.amount);
                      if (t.type === 'Expense') return total - Number(t.amount);
                      return total;
                    }, 0)
                  )}
                </p>
              </div>
              {/* <div className="flex items-center text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                <span>
                  +5.3% dibanding bulan lalu
                </span>
              </div> */}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-600">Pemasukan Bulan Ini</h3>
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-lg">₹</span>
                </div>
              </div>
              <div className="mb-2">
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    transactions
                      .filter((t) => {
                        const now = new Date();
                        const tDate = new Date(t.date.split('/').reverse().join('-'));
                        return (
                          t.type === 'Income' &&
                          tDate.getMonth() === now.getMonth() &&
                          tDate.getFullYear() === now.getFullYear()
                        );
                      })
                      .reduce((sum, t) => sum + Number(t.amount), 0)
                  )}
                </p>
              </div>
              {cashFlowThisMonth('Income')}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-600">Pengeluaran Bulan Ini</h3>
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                  <span className="text-white text-lg">₹</span>
                </div>
              </div>
              <div className="mb-2">
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    transactions
                      .filter((t) => {
                        const now = new Date();
                        const tDate = new Date(t.date.split('/').reverse().join('-'));
                        return (
                          t.type === 'Expense' &&
                          tDate.getMonth() === now.getMonth() &&
                          tDate.getFullYear() === now.getFullYear()
                        );
                      })
                      .reduce((sum, t) => sum + Number(t.amount), 0)
                  )}
                </p>
              </div>
              {cashFlowThisMonth('Expense')}
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
                          style={{ height: `${(data.expense / 3000000) * 100}%` }}
                          title={`Pengeluaran: ${formatCurrency(data.expense)}`}
                        ></div>
                        <div
                          className="w-full bg-primary rounded-t"
                          style={{ height: `${(data.income / 3000000) * 100}%` }}
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
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
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
                  {/* tampilkan maksimal 5 data */}
                  {transactions.slice(0, 5).map((transaction, idx) => (
                    <tr key={transaction.transactionId || idx} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-6 text-left">{transaction.date}</td>
                      <td className="py-3 px-6 text-left">{transaction.description}</td>
                      <td className="py-3 px-6 text-left">{transaction.category}</td>
                      <td className={`py-3 px-6 text-right ${transaction.type === 'Income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {
                          transaction.type === 'Income' ? formatCurrency(transaction.amount) : '-' + formatCurrency(transaction.amount)
                        }
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
      </main >

      <Footer />
    </div >
  );
};

export default Dashboard;