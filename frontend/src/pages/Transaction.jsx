import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import { useEffect, useState } from "react";
import AppSettings from "../AppSettings";
import Modal from "../components/Element/Modal";
import InputDate from "../components/Element/inputDate";
import InputNumber from "../components/Element/InputNumber";
import InputText from "../components/Element/InputText";
import TextArea from "../components/Element/TextArea";
import SelectInput from "../components/Element/selectInput";

const Transaction = () => {
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [transactionName, setTransactionName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const [transactions, setTransactions] = useState([]);

  const [addOpen, setAddOpen] = useState(false)

  let filterStatus = true;
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


  // Format angka ke format rupiah
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Menampilkan filter
  const openFilter = () => {
    const filterElement = document.getElementById('filter');
    if (filterStatus) {
      console.log('open filter');
      filterElement.innerHTML = `
        <div class="flex justify-end gap-2 mb-4">
          <input type="text" id="filterCategoryText" placeholder="Cari kategori..." class="border border-gray-300 rounded-md px-3 py-2" />
          <input type="text" id="filterTypeText" placeholder="Cari type..." class="border border-gray-300 rounded-md px-3 py-2" />
          <input type="date" id="filterDate" class="border border-gray-300 rounded-md px-3 py-2" />
          <select id="filterCategory" class="border border-gray-300 rounded-md px-3 py-2">
            <option value="">All Categories</option>
            <option value="Dining">Dining</option>
            <option value="Fitness">Fitness</option>
          </select>
          <button class="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-md" onclick="clearFilter()">Clear Filter</button>
        </div>
        `;

      filterStatus = false;
    } else if (!filterStatus) {
      console.log('close filter');
      filterElement.innerHTML = '';

      filterStatus = true;
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex flex-grow">
        <Sidebar />

        <main className="flex-grow bg-gray-50 p-6">
          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-2">
              <h2 className="text-xl font-bold mb-4">Transaksi Terbaru</h2>
              <div className="flex justify-end gap-2">
                <button
                  className="place-self-end -translate-y-5 bg-gray-500 hover:bg-gray-400 text-white px-3 py-2 rounded-md font-medium transition-colors"
                  onClick={() => openFilter()}
                >Filter</button>

                <button
                  className='place-self-end -translate-y-5 bg-secondary hover:bg-secondary-light text-white px-3 py-2 rounded-md font-medium transition-colors'
                  onClick={() => setAddOpen(true)}
                >Tambah Transaksi</button>
              </div>
            </div>
            <div id="filter">
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Tanggal</th>
                    <th className="py-3 px-6 text-left">Deskripsi</th>
                    <th className="py-3 px-6 text-left">Kategori</th>
                    <th className="py-3 px-6 text-right">Jumlah</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {/* tampilkan maksimal 5 data */}
                  {transactions.map((transaction, idx) => (
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
                      <td>
                        <div className="flex justify-end gap-2">
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => alert('Edit functionality not implemented yet')}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => alert('Delete functionality not implemented yet')}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <Footer />

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

            <div className="sm:col-span-3">
              <label htmlFor="date" className="block text-sm/6 font-medium text-gray-900">
                Date
              </label>
              <InputDate name="date" onChange={(e) => setDate(e.target.value)} />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="amount" className="block text-sm/6 font-medium text-gray-900">
                Amount
              </label>
              <InputNumber name="amount" onChange={(e) => setAmount(e.target.value)} placeHolder="0.00" />
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="transaction" className="block text-sm/6 font-medium text-gray-900">
                Transaction Name
              </label>
              <InputText name="transaction" onChange={(e) => setTransactionName(e.target.value)} placeHolder="Masukkan Nama Transaksi" />
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="note" className="block text-sm/6 font-medium text-gray-900">
                Desciption
              </label>
              <TextArea name="note" onChange={(e) => setDescription(e.target.value)} placeHolder="Tambahkan catatan jika perlu" />
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
  )
}

export default Transaction;