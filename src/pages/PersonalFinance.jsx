import { useState } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Sidebar from '../components/common/Sidebar';

const PersonalFinance = () => {
  const [activeTab, setActiveTab] = useState('daily');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().substr(0, 10),
    amount: '',
    category: '',
    description: '',
    type: 'expense',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      date: new Date().toISOString().substr(0, 10),
      amount: '',
      category: '',
      description: '',
      type: 'expense',
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-grow">
        <Sidebar />
        
        <main className="flex-grow bg-gray-50 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Keuangan Pribadi</h1>
            <p className="text-gray-600">Kelola dan rencanakan keuangan pribadimu</p>
          </div>
          
          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <ul className="flex flex-wrap -mb-px">
              <li className="mr-2">
                <button
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    activeTab === 'daily'
                      ? 'border-secondary text-secondary'
                      : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('daily')}
                >
                  Pencatatan Harian
                </button>
              </li>
              <li className="mr-2">
                <button
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    activeTab === 'goals'
                      ? 'border-secondary text-secondary'
                      : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('goals')}
                >
                  Rencana Keuangan
                </button>
              </li>
            </ul>
          </div>
          
          {/* Content for Daily Tab */}
          {activeTab === 'daily' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Form Card */}
              <div className="md:col-span-1">
                <div className="card">
                  <h2 className="text-xl font-bold mb-4">Tambah Transaksi</h2>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Tipe Transaksi</label>
                      <div className="flex">
                        <label className="inline-flex items-center mr-4">
                          <input
                            type="radio"
                            name="type"
                            value="expense"
                            checked={formData.type === 'expense'}
                            onChange={handleChange}
                            className="form-radio text-secondary"
                          />
                          <span className="ml-2">Pengeluaran</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="type"
                            value="income"
                            checked={formData.type === 'income'}
                            onChange={handleChange}
                            className="form-radio text-secondary"
                          />
                          <span className="ml-2">Pemasukan</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="date" className="block text-gray-700 mb-2">Tanggal</label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="amount" className="block text-gray-700 mb-2">Jumlah (Rp)</label>
                      <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                        placeholder="0"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="category" className="block text-gray-700 mb-2">Kategori</label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                        required
                      >
                        <option value="">Pilih Kategori</option>
                        {formData.type === 'expense' ? (
                          <>
                            <option value="food">Makanan</option>
                            <option value="transportation">Transportasi</option>
                            <option value="entertainment">Hiburan</option>
                            <option value="shopping">Belanja</option>
                            <option value="bills">Tagihan</option>
                            <option value="others">Lainnya</option>
                          </>
                        ) : (
                          <>
                            <option value="salary">Gaji</option>
                            <option value="bonus">Bonus</option>
                            <option value="investment">Investasi</option>
                            <option value="side_hustle">Bisnis Sampingan</option>
                            <option value="others">Lainnya</option>
                          </>
                        )}
                      </select>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="description" className="block text-gray-700 mb-2">Deskripsi</label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                        rows="3"
                        placeholder="Deskripsi transaksi..."
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-secondary-light transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                    >
                      Simpan Transaksi
                    </button>
                  </form>
                </div>
              </div>
              
              {/* Recent Transactions Card */}
              <div className="md:col-span-2">
                <div className="card h-full">
                  <h2 className="text-xl font-bold mb-4">Transaksi Terbaru</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                          <th className="py-3 px-6 text-left">Tanggal</th>
                          <th className="py-3 px-6 text-left">Kategori</th>
                          <th className="py-3 px-6 text-left">Deskripsi</th>
                          <th className="py-3 px-6 text-right">Jumlah</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600 text-sm">
                        <tr className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-6 text-left">08-05-2024</td>
                          <td className="py-3 px-6 text-left">Makanan</td>
                          <td className="py-3 px-6 text-left">Makan Siang</td>
                          <td className="py-3 px-6 text-right text-red-500">- Rp 75.000</td>
                        </tr>
                        <tr className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-6 text-left">07-05-2024</td>
                          <td className="py-3 px-6 text-left">Gaji</td>
                          <td className="py-3 px-6 text-left">Gaji Bulanan</td>
                          <td className="py-3 px-6 text-right text-green-500">+ Rp 5.000.000</td>
                        </tr>
                        <tr className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-6 text-left">06-05-2024</td>
                          <td className="py-3 px-6 text-left">Transportasi</td>
                          <td className="py-3 px-6 text-left">Bensin</td>
                          <td className="py-3 px-6 text-right text-red-500">- Rp 150.000</td>
                        </tr>
                        <tr className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-6 text-left">05-05-2024</td>
                          <td className="py-3 px-6 text-left">Belanja</td>
                          <td className="py-3 px-6 text-left">Belanja Bulanan</td>
                          <td className="py-3 px-6 text-right text-red-500">- Rp 450.000</td>
                        </tr>
                        <tr className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-6 text-left">04-05-2024</td>
                          <td className="py-3 px-6 text-left">Tagihan</td>
                          <td className="py-3 px-6 text-left">Pembayaran Listrik</td>
                          <td className="py-3 px-6 text-right text-red-500">- Rp 250.000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 flex justify-center">
                    <button className="text-secondary hover:underline">Lihat Semua Transaksi</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Content for Goals Tab */}
          {activeTab === 'goals' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Goals Cards */}
              <div className="card bg-primary text-white">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">Kendaraan</h3>
                  <span className="text-2xl">🚗</span>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span>Progress</span>
                    <span>15%</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2.5">
                    <div className="bg-secondary h-2.5 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
                <p className="mb-3">Target: Rp 150.000.000</p>
                <p className="mb-3">Terkumpul: Rp 22.500.000</p>
                <p className="mb-5">Estimasi tercapai: Oktober 2026</p>
                <button className="w-full bg-white text-primary py-2 px-4 rounded-md hover:bg-gray-100 transition-colors">
                  Detail
                </button>
              </div>
              
              <div className="card bg-primary text-white">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">Rumah KPR</h3>
                  <span className="text-2xl">🏠</span>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span>Progress</span>
                    <span>5%</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2.5">
                    <div className="bg-secondary h-2.5 rounded-full" style={{ width: '5%' }}></div>
                  </div>
                </div>
                <p className="mb-3">Target: Rp 500.000.000</p>
                <p className="mb-3">Terkumpul: Rp 25.000.000</p>
                <p className="mb-5">Estimasi tercapai: Maret 2030</p>
                <button className="w-full bg-white text-primary py-2 px-4 rounded-md hover:bg-gray-100 transition-colors">
                  Detail
                </button>
              </div>
              
              <div className="card bg-primary text-white">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">Tabungan Haji</h3>
                  <span className="text-2xl">🕋</span>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span>Progress</span>
                    <span>30%</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2.5">
                    <div className="bg-secondary h-2.5 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
                <p className="mb-3">Target: Rp 85.000.000</p>
                <p className="mb-3">Terkumpul: Rp 25.500.000</p>
                <p className="mb-5">Estimasi tercapai: Agustus 2027</p>
                <button className="w-full bg-white text-primary py-2 px-4 rounded-md hover:bg-gray-100 transition-colors">
                  Detail
                </button>
              </div>
              
              {/* Add New Goal Card */}
              <div className="card border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-6 cursor-pointer hover:border-secondary transition-colors">
                <div className="bg-gray-100 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-700">Tambah Tujuan Keuangan</p>
                <p className="text-sm text-gray-500 text-center mt-2">
                  Buat tujuan keuangan baru untuk membantu mencapai impianmu
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default PersonalFinance;