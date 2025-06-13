import { useEffect, useState } from "react";
import AppSettings from "../AppSettings";
import Modal from "../components/Element/Modal";
import InputDate from "../components/Element/inputDate";
import InputNumber from "../components/Element/InputNumber";
import InputText from "../components/Element/InputText";
import TextArea from "../components/Element/TextArea";
import SelectInput from "../components/Element/selectInput";
import AppLayout from "../components/AppLayouts";

const Transaction = () => {
  const [transactionId, setTransactionId] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [transactionName, setTransactionName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  const [addOpen, setAddOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const [filterValues, setFilterValues] = useState({
    type: '',
    category: '',
    dateStart: '',
    dateEnd: ''
  });

  // menjalankan fungsi saat komponen pertama kali dimuat
  useEffect(() => {
    getTransactions();
  }, []);

  useEffect(() => {
    setFilteredTransactions(transactions);
  }, [transactions]);

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
      setAddOpen(false);
      // Reset form
      setType('');
      setCategory('');
      setDate('');
      setTransactionName('');
      setAmount('');
      setDescription('');
      getTransactions();
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
      setFilteredTransactions(formattedData);
    } catch (error) {
      console.error(error);
    }
  };

  const setInput = (transactionId) => {
    setUpdateOpen(true);
    // Ambil data transaksi berdasarkan transactionId
    const transaction = transactions.find(t => t.transactionId === transactionId);
    if (!transaction) {
      alert('Transaction not found!');
      return;
    }
    // Set data transaksi ke state
    setTransactionId(transaction.transactionId);
    setType(transaction.type);
    setCategory(transaction.category);
    setDate(transaction.date);
    setTransactionName(transaction.transactionName);
    setAmount(transaction.amount);
    setDescription(transaction.description);
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${AppSettings.api}/transactions/update/${transactionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          type: type,
          category: category,
          date: date.split('/').concat().reverse().join('-'),
          transactionName: transactionName,
          amount: amount,
          description: description,
        }),
      });

      alert('Transaction Updated successfully!');
      setUpdateOpen(false);
      getTransactions();
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Error updating transaction: ' + error.message);
    }
  };

  const deleteTransaction = async (transactionId) => {
    if (!confirm('Yakin ingin menghapus transaksi ini?')) return;
    
    try {
      const response = await fetch(`${AppSettings.api}/transactions/delete/${transactionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      } else {
        alert('Transaction deleted successfully!');
        // Refresh transactions after deletion
        getTransactions();
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Error deleting transaction: ' + error.message);
    }
  };

  // Format angka ke format rupiah
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Fungsi filter transaksi
  const applyFilter = () => {
    let filtered = transactions;

    if (filterValues.type) {
      filtered = filtered.filter((t) =>
        t.type.toLowerCase() === filterValues.type.toLowerCase()
      );
    }

    if (filterValues.category) {
      filtered = filtered.filter((t) =>
        t.category.toLowerCase().includes(filterValues.category.toLowerCase())
      );
    }

    if (filterValues.dateStart && filterValues.dateEnd) {
      const start = new Date(filterValues.dateStart);
      const end = new Date(filterValues.dateEnd);

      filtered = filtered.filter((t) => {
        const [day, month, year] = t.date.split('/');
        const transactionDate = new Date(`${year}-${month}-${day}`);
        return transactionDate >= start && transactionDate <= end;
      });
    }

    setFilteredTransactions(filtered);
  };

  const clearFilter = () => {
    setFilterValues({
      type: '',
      category: '',
      dateStart: '',
      dateEnd: ''
    });
    setFilteredTransactions(transactions);
  };

  useEffect(() => {
    applyFilter();
  }, [filterValues, transactions]);

  return (
    <AppLayout>
      {/* MOBILE OPTIMIZED VERSION */}
      <div className="space-y-4 p-2 sm:p-0">
        
        {/* Header - Mobile Optimized */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Transaksi</h1>
              <p className="text-sm text-gray-600">Kelola semua transaksi keuangan Anda</p>
            </div>
            <div className="flex gap-2">
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg font-medium transition-colors text-sm"
                onClick={() => setShowFilter(!showFilter)}
              >
                {showFilter ? 'Tutup Filter' : 'Filter'}
              </button>
              <button
                className='bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-colors text-sm'
                onClick={() => setAddOpen(true)}
              >
                + Transaksi
              </button>
            </div>
          </div>
        </div>

        {/* Filter Section - Mobile Optimized */}
        {showFilter && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-3">Filter Transaksi</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={filterValues.type}
                  onChange={(e) => setFilterValues({...filterValues, type: e.target.value})}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Semua Tipe</option>
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>

                <select
                  value={filterValues.category}
                  onChange={(e) => setFilterValues({...filterValues, category: e.target.value})}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Semua Kategori</option>
                  <option value="Gaji">💰 Gaji</option>
                  <option value="Bonus">🪙 Bonus</option>
                  <option value="Makan">🍔 Makan</option>
                  <option value="Transportasi">🚗 Transportasi</option>
                  <option value="Hiburan">🎥 Hiburan</option>
                  <option value="Kesehatan">🏥 Kesehatan</option>
                  <option value="Lainnya">💬 Lainnya</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Dari Tanggal:</label>
                  <input
                    type="date"
                    value={filterValues.dateStart}
                    onChange={(e) => setFilterValues({...filterValues, dateStart: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Sampai Tanggal:</label>
                  <input
                    type="date"
                    value={filterValues.dateEnd}
                    onChange={(e) => setFilterValues({...filterValues, dateEnd: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <button
                onClick={clearFilter}
                className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm"
              >
                Hapus Filter
              </button>
            </div>
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{filteredTransactions.length}</div>
              <div className="text-sm text-gray-600">Total Transaksi</div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredTransactions.filter(t => t.type === 'Income').length}
              </div>
              <div className="text-sm text-gray-600">Pemasukan</div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {filteredTransactions.filter(t => t.type === 'Expense').length}
              </div>
              <div className="text-sm text-gray-600">Pengeluaran</div>
            </div>
          </div>
        </div>

        {/* Transactions List - Mobile Optimized */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold">Daftar Transaksi</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredTransactions.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 text-4xl mb-2">📝</div>
                <p className="text-gray-500">Belum ada transaksi</p>
                <button
                  onClick={() => setAddOpen(true)}
                  className="mt-3 text-blue-600 hover:text-blue-800 text-sm"
                >
                  Tambah transaksi pertama →
                </button>
              </div>
            ) : (
              filteredTransactions.map((transaction, idx) => (
                <div key={transaction.transactionId || idx} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-block w-2 h-2 rounded-full ${
                              transaction.type === 'Income' ? 'bg-green-500' : 'bg-red-500'
                            }`}></span>
                            <h3 className="font-semibold text-gray-900 text-sm">
                              {transaction.category}
                            </h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              transaction.type === 'Income' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {transaction.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{transaction.transactionName}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-gray-500">{transaction.date}</span>
                            <span className="text-xs text-gray-500 truncate max-w-32">
                              {transaction.description}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold text-sm ${
                            transaction.type === 'Income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'Income' ? '+' : '-'}
                            {formatCurrency(transaction.amount)}
                          </div>
                          <div className="flex items-center space-x-1 mt-2">
                            <button
                              onClick={() => setInput(transaction.transactionId)}
                              className="text-blue-600 hover:text-blue-800 text-xs bg-blue-50 px-2 py-1 rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteTransaction(transaction.transactionId)}
                              className="text-red-600 hover:text-red-800 text-xs bg-red-50 px-2 py-1 rounded"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Transaction Modal */}
        <Modal open={addOpen} setOpen={setAddOpen} title="Tambah Transaksi">
          <div className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <SelectInput name="type" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="">Pilih Type</option>
                    <option value="Income">💰 Income</option>
                    <option value="Expense">💸 Expense</option>
                  </SelectInput>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <SelectInput name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Pilih Category</option>
                    <option value="Gaji">💰 Gaji</option>
                    <option value="Bonus">🪙 Bonus</option>
                    <option value="Dividen">💹 Dividen</option>
                    <option value="Makan">🍔 Makan</option>
                    <option value="Transportasi">🚗 Transportasi</option>
                    <option value="Hiburan">🎥 Hiburan</option>
                    <option value="Kesehatan">🏥 Kesehatan</option>
                    <option value="Pendidikan">🎓 Pendidikan</option>
                    <option value="Lainnya">💬 Lainnya</option>
                  </SelectInput>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <InputDate name="date" onChange={(e) => setDate(e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <InputNumber name="amount" onChange={(e) => setAmount(e.target.value)} placeHolder="0" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Name</label>
                  <InputText name="transaction" onChange={(e) => setTransactionName(e.target.value)} placeHolder="Nama transaksi" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <TextArea name="description" onChange={(e) => setDescription(e.target.value)} placeHolder="Catatan (opsional)" />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setAddOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </Modal>

        {/* Update Transaction Modal */}
        <Modal open={updateOpen} setOpen={setUpdateOpen} title="Edit Transaksi">
          <div className="p-4">
            <form onSubmit={handleSubmitUpdate} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <SelectInput name="type" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="">Pilih Type</option>
                    <option value="Income">💰 Income</option>
                    <option value="Expense">💸 Expense</option>
                  </SelectInput>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <SelectInput name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Pilih Category</option>
                    <option value="Gaji">💰 Gaji</option>
                    <option value="Bonus">🪙 Bonus</option>
                    <option value="Dividen">💹 Dividen</option>
                    <option value="Makan">🍔 Makan</option>
                    <option value="Transportasi">🚗 Transportasi</option>
                    <option value="Hiburan">🎥 Hiburan</option>
                    <option value="Kesehatan">🏥 Kesehatan</option>
                    <option value="Pendidikan">🎓 Pendidikan</option>
                    <option value="Lainnya">💬 Lainnya</option>
                  </SelectInput>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <InputDate 
                    name="date" 
                    onChange={(e) => setDate(e.target.value)} 
                    value={date.split('/').reverse().join('-')} 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <InputNumber name="amount" onChange={(e) => setAmount(e.target.value)} value={amount} placeHolder="0" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Name</label>
                  <InputText name="transaction" onChange={(e) => setTransactionName(e.target.value)} value={transactionName} placeHolder="Nama transaksi" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <TextArea name="description" onChange={(e) => setDescription(e.target.value)} value={description} placeHolder="Catatan (opsional)" />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setUpdateOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
};

export default Transaction;