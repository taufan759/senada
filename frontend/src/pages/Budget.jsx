import AppLayout from '../components/AppLayouts';
import React, { useEffect, useState } from 'react';
import Modal from '../components/Element/Modal';
import SelectInput from '../components/Element/selectInput';
import InputText from '../components/Element/InputText';
import InputNumber from '../components/Element/InputNumber';
import AppSettings from '../AppSettings';

const Budget = () => {
  /////////////////////       STATE VARIABLES       /////////////////////
  const [addOpen, setAddOpen] = useState(false);
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [budgetName, setBudgetName] = useState('');
  const [allocated, setAllocated] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(new Date().toLocaleString('id-ID', { month: 'long' }));
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  /////////////////////       API CALL VARIABLES       /////////////////////
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);

  /////////////////////       CONSTANTS       /////////////////////
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const yearList = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  useEffect(() => {
    getBudgets();
    getTransactions();
  }, [currentMonth, currentYear]);

  /////////////////////       API CALL FUNCTIONS       /////////////////////

  // mengambil data transaksi dari database
  const getTransactions = async () => {
    try {
      // ambil data transaksi dari API
      const response = await fetch(`${AppSettings.api}/budget/transactions?month=${monthNames.indexOf(currentMonth) + 1}&year=${currentYear}`, {
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

  // mengambil data transaksi dari database
  const getBudgets = async () => {
    try {
      // ambil data transaksi dari API
      const response = await fetch(`${AppSettings.api}/budget`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        }
      });

      const data = await response.json();
      // Format tanggal menjadi dd/mm/yyyy
      const formattedData = data.map((budget) => ({
        ...budget
      }));

      // Set data transaksi ke state transactions
      setBudgets(formattedData);
    } catch (error) {
      console.error(error);
    }
  };

  /////////////////////       HANDLE FUNCTIONS       /////////////////////

  // handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // input transaksi ke database
      await fetch(`${AppSettings.api}/budget/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          type: type,
          category: category,
          allocated: allocated,
          budgetName: budgetName,
        }),
      });

      console.log(type, category, allocated, budgetName);

      alert('Budget added successfully!');
    } catch (error) {
      console.error("Error adding Budget:", error);
    }
  }


  /////////////////////       UTILITY FUNCTIONS       /////////////////////
  const getBudgetStatus = (allocated, spent) => {
    const percentage = (spent / allocated) * 100;

    if (percentage >= 100) return 'danger'; // Melebihi
    if (percentage >= 80) return 'warning'; // Perhatian
    return 'safe'; // Aman
  }

  const totalAllocated = budgets.reduce((sum, budget) => sum + budget.allocated, 0);
  const totalSpent = transactions
    .filter((t) => t.type === 'Expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const totalRemaining = totalAllocated - totalSpent;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getProgressWidth = (spent, allocated) => {
    return Math.min((spent / allocated) * 100, 100);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'safe': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'danger': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressColor = (status) => {
    switch (status) {
      case 'safe': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'danger': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 mt-16 lg:mt-0">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Anggaran</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Kelola dan pantau anggaran keuangan Anda</p>
        </div>
        <button
          className='place-self-end bg-secondary hover:bg-secondary-light text-white px-3 py-2 rounded-md font-medium transition-colors'
          onClick={() => setAddOpen(true)}
        >➕ Tambah Anggaran</button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-lg sm:text-xl">🎯</span>
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm text-gray-600">Total Anggaran</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{formatCurrency(totalAllocated)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-lg sm:text-xl">📈</span>
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm text-gray-600">Total Pengeluaran</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                {formatCurrency(totalSpent)}
              </p>
            </div>
          </div>
        </div>

        <div className="sm:col-span-2 lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${totalRemaining >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <span className={`text-lg sm:text-xl ${totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>⚠️</span>
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm text-gray-600">Sisa Anggaran</p>
              <p className={`text-lg sm:text-2xl font-bold ${totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totalRemaining)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Budget List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Daftar Anggaran</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="text-base">📅</span>
              <select
                className="bg-transparent border-none focus:ring-0 text-gray-600"
                value={currentMonth}
                onChange={(e) => {
                  setCurrentMonth(e.target.value);
                  getBudgets();
                }}
              >
                {monthNames.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                className="bg-transparent border-none focus:ring-0 text-gray-600"
                value={currentYear}
                onChange={(e) => {
                  setCurrentYear(e.target.value);
                  getBudgets();
                }}
              >
                {yearList.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            {budgets.map((budget) => {
              const budgetTransaction = transactions
                .filter(transaction => transaction.category === budget.category && transaction.type === 'Expense')
                .reduce((total, transaction) => total + transaction.amount, 0);

              const budgetStatus = getBudgetStatus(budget.allocated, budgetTransaction);

              return (
                <div key={budget.budgetId} className="border border-gray-100 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">{budget.category}</h3>
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(budgetStatus)}`}>
                        {budgetStatus === 'safe' ? 'Aman' : budgetStatus === 'warning' ? 'Perhatian' : 'Melebihi'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                        <span className="text-sm">👁️</span>
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                        <span className="text-sm">✏️</span>
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                        <span className="text-sm">🗑️</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">Dialokasikan</p>
                      <p className="text-sm sm:text-lg font-semibold text-gray-900">{formatCurrency(budget.allocated)}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">Digunakan</p>
                      <p className="text-sm sm:text-lg font-semibold text-gray-900">
                        {formatCurrency(budgetTransaction)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">Sisa</p>
                      <p className={`text-sm sm:text-lg font-semibold ${budgetStatus === 'safe' ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(budget.allocated - budgetTransaction)}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{Math.round((budgetTransaction / budget.allocated) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(budgetStatus)}`}
                        style={{
                          width: `${getProgressWidth(budgetTransaction, budget.allocated)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>)
            })}
          </div>

          {budgets.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">🎯</span>
              </div>
              <p className="text-gray-500 text-base sm:text-lg mb-2">Belum ada anggaran yang dibuat</p>
              <p className="text-gray-400 text-sm mb-4 sm:mb-6">Mulai dengan membuat anggaran pertama Anda</p>
              <button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-3 rounded-lg flex items-center justify-center space-x-2 mx-auto transition-colors">
                <span className="text-lg">➕</span>
                <span>Buat Anggaran</span>
              </button>
            </div>
          )}
        </div>
      </div>


      {/* Add Transaction Modal */}
      <Modal open={addOpen} setOpen={setAddOpen}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="type" className="block text-sm/6 font-medium text-gray-900">
                Type
              </label>
              <SelectInput name="type" value={type} autoComplete="type-name" onChange={(e) => setType(e.target.value)}>
                <option value="">Pilih Type</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </SelectInput>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="category" className="block text-sm/6 font-medium text-gray-900">
                Category
              </label>
              <SelectInput name="category" value={category} autoComplete="category-name" onChange={(e) => setCategory(e.target.value)}>
                <option value="">Pilih Category</option>
                <option value="Dining">Dining</option>
                <option value="Fitness">Fitness</option>
              </SelectInput>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="transaction" className="block text-sm/6 font-medium text-gray-900">
                Nama Anggaran
              </label>
              <InputText name="transaction" onChange={(e) => setBudgetName(e.target.value)} placeHolder="Masukkan Nama Anggaran" />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="allocated" className="block text-sm/6 font-medium text-gray-900">
                Alokasi
              </label>
              <InputNumber name="allocated" onChange={(e) => setAllocated(e.target.value)} placeHolder="0.00" />
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
              onClick={() => setAddOpen(false)}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
};

export default Budget;