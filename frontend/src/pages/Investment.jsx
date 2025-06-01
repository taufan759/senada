import { useState } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Sidebar from '../components/common/Sidebar';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Registrasi komponen Chart.js yang dibutuhkan
ChartJS.register(ArcElement, Tooltip, Legend);

const Investment = () => {
  const [riskProfile, setRiskProfile] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  
  const investmentData = {
    labels: ['Saham', 'Obligasi', 'Reksadana', 'Emas', 'Deposito'],
    datasets: [
      {
        data: [30, 20, 25, 15, 10],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
        borderWidth: 0,
      },
    ],
  };
  
  const portfolioOptions = {
    plugins: {
      legend: {
        position: 'right',
      },
    },
    maintainAspectRatio: false,
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const handleCompleteQuiz = (result) => {
    setRiskProfile(result);
    setShowQuiz(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-grow">
        <Sidebar />
        
        <main className="flex-grow bg-gray-50 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Perencanaan Investasi</h1>
            <p className="text-gray-600">Rencanakan dan kelola portofolio investasimu</p>
          </div>
          
          {!riskProfile && !showQuiz ? (
            <div className="card text-center py-10">
              <h2 className="text-2xl font-bold mb-4">Temukan Profil Risiko Investasimu</h2>
              <p className="mb-6 text-gray-600 max-w-2xl mx-auto">
                Sebelum memulai investasi, penting untuk mengetahui profil risiko yang sesuai dengan situasi keuangan, 
                tujuan, dan toleransi risiko Anda. Ini akan membantu dalam memilih instrumen investasi yang tepat.
              </p>
              <button 
                onClick={handleStartQuiz}
                className="bg-secondary text-white py-2 px-6 rounded-md hover:bg-secondary-light transition-colors"
              >
                Mulai Kuis Profil Risiko
              </button>
            </div>
          ) : showQuiz ? (
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Kuis Profil Risiko</h2>
              
              {/* Simulation of a risk profile quiz */}
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <p className="font-medium mb-3">1. Berapa lama jangka waktu investasi yang Anda rencanakan?</p>
                  <div className="space-y-2">
                    <label className="block">
                      <input type="radio" name="horizon" className="mr-2" />
                      Kurang dari 1 tahun
                    </label>
                    <label className="block">
                      <input type="radio" name="horizon" className="mr-2" />
                      1-3 tahun
                    </label>
                    <label className="block">
                      <input type="radio" name="horizon" className="mr-2" />
                      3-5 tahun
                    </label>
                    <label className="block">
                      <input type="radio" name="horizon" className="mr-2" />
                      Lebih dari 5 tahun
                    </label>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <p className="font-medium mb-3">2. Bagaimana reaksi Anda jika investasi Anda turun 20% dalam satu tahun?</p>
                  <div className="space-y-2">
                    <label className="block">
                      <input type="radio" name="reaction" className="mr-2" />
                      Saya akan menjual semua investasi saya
                    </label>
                    <label className="block">
                      <input type="radio" name="reaction" className="mr-2" />
                      Saya akan menjual sebagian investasi saya
                    </label>
                    <label className="block">
                      <input type="radio" name="reaction" className="mr-2" />
                      Saya tidak akan melakukan apa-apa
                    </label>
                    <label className="block">
                      <input type="radio" name="reaction" className="mr-2" />
                      Saya akan membeli lebih banyak karena harganya turun
                    </label>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <p className="font-medium mb-3">3. Mana yang lebih penting bagi Anda?</p>
                  <div className="space-y-2">
                    <label className="block">
                      <input type="radio" name="priority" className="mr-2" />
                      Melindungi nilai investasi saya
                    </label>
                    <label className="block">
                      <input type="radio" name="priority" className="mr-2" />
                      Pertumbuhan moderat dengan risiko terbatas
                    </label>
                    <label className="block">
                      <input type="radio" name="priority" className="mr-2" />
                      Pertumbuhan yang tinggi meskipun ada risiko kerugian
                    </label>
                  </div>
                </div>
                
                <div className="text-center">
                  <button
                    onClick={() => handleCompleteQuiz('Moderate')}
                    className="bg-secondary text-white py-2 px-6 rounded-md hover:bg-secondary-light transition-colors"
                  >
                    Selesai & Lihat Hasil
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Risk Profile Card */}
              <div className="card">
                <h2 className="text-xl font-bold mb-4">Profil Risiko Anda</h2>
                <div className="bg-primary text-white p-4 rounded-lg mb-4">
                  <p className="text-2xl font-bold mb-2">Moderate</p>
                  <p>
                    Anda cenderung mencari keseimbangan antara pertumbuhan dan perlindungan nilai. 
                    Portofolio yang disarankan memiliki campuran aset berisiko dan aman.
                  </p>
                </div>
                
                <h3 className="font-bold mb-2">Rekomendasi Alokasi Aset:</h3>
                <ul className="space-y-2 mb-4">
                  <li className="flex justify-between">
                    <span>Saham</span>
                    <span className="font-bold">30%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Obligasi</span>
                    <span className="font-bold">20%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Reksadana</span>
                    <span className="font-bold">25%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Emas</span>
                    <span className="font-bold">15%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Deposito</span>
                    <span className="font-bold">10%</span>
                  </li>
                </ul>
                
                <button className="text-secondary hover:underline text-sm">
                  Ubah Profil Risiko
                </button>
              </div>
              
              {/* Portfolio Chart */}
              <div className="card">
                <h2 className="text-xl font-bold mb-4">Portofolio Saat Ini</h2>
                <div className="h-64">
                  <Doughnut data={investmentData} options={portfolioOptions} />
                </div>
                <div className="mt-4">
                  <p className="mb-2">Total Investasi: <span className="font-bold">Rp 45.000.000</span></p>
                  <button className="text-secondary hover:underline text-sm">
                    Lihat Detail Portofolio
                  </button>
                </div>
              </div>
              
              {/* Investment Goals */}
              <div className="card">
                <h2 className="text-xl font-bold mb-4">Target Investasi</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Dana Pensiun</span>
                      <span>25%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>Rp 250.000.000</span>
                      <span>2040</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Dana Pendidikan Anak</span>
                      <span>40%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>Rp 150.000.000</span>
                      <span>2030</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Dana Darurat</span>
                      <span>75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>Rp 30.000.000</span>
                      <span>2025</span>
                    </div>
                  </div>
                </div>
                
                <button className="w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-secondary-light transition-colors mt-4">
                  Tambah Target Baru
                </button>
              </div>
              
              {/* Recommended Investments */}
              <div className="md:col-span-3">
                <div className="card">
                  <h2 className="text-xl font-bold mb-4">Rekomendasi Investasi</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                          <th className="py-3 px-6 text-left">Instrumen</th>
                          <th className="py-3 px-6 text-left">Jenis</th>
                          <th className="py-3 px-6 text-center">Risiko</th>
                          <th className="py-3 px-6 text-center">Potensi Return</th>
                          <th className="py-3 px-6 text-center">Jangka Waktu</th>
                          <th className="py-3 px-6 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600 text-sm">
                        <tr className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-6 text-left">Reksadana Pendapatan Tetap</td>
                          <td className="py-3 px-6 text-left">Obligasi</td>
                          <td className="py-3 px-6 text-center">
                            <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-xs">Rendah</span>
                          </td>
                          <td className="py-3 px-6 text-center">6-8% p.a.</td>
                          <td className="py-3 px-6 text-center">1-3 tahun</td>
                          <td className="py-3 px-6 text-center">
                            <button className="bg-primary text-white py-1 px-3 rounded-md text-xs">Detail</button>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-6 text-left">Reksadana Saham</td>
                          <td className="py-3 px-6 text-left">Saham</td>
                          <td className="py-3 px-6 text-center">
                            <span className="bg-red-100 text-red-800 py-1 px-3 rounded-full text-xs">Tinggi</span>
                          </td>
                          <td className="py-3 px-6 text-center">10-15% p.a.</td>
                          <td className="py-3 px-6 text-center">{'>'}  5 tahun</td>
                          <td className="py-3 px-6 text-center">
                            <button className="bg-primary text-white py-1 px-3 rounded-md text-xs">Detail</button>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-6 text-left">Reksadana Campuran</td>
                          <td className="py-3 px-6 text-left">Campuran</td>
                          <td className="py-3 px-6 text-center">
                            <span className="bg-yellow-100 text-yellow-800 py-1 px-3 rounded-full text-xs">Sedang</span>
                          </td>
                          <td className="py-3 px-6 text-center">8-12% p.a.</td>
                          <td className="py-3 px-6 text-center">3-5 tahun</td>
                          <td className="py-3 px-6 text-center">
                            <button className="bg-primary text-white py-1 px-3 rounded-md text-xs">Detail</button>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-6 text-left">Deposito Berjangka</td>
                          <td className="py-3 px-6 text-left">Simpanan</td>
                          <td className="py-3 px-6 text-center">
                            <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-xs">Rendah</span>
                          </td>
                          <td className="py-3 px-6 text-center">3-4% p.a.</td>
                          <td className="py-3 px-6 text-center">1-12 bulan</td>
                          <td className="py-3 px-6 text-center">
                            <button className="bg-primary text-white py-1 px-3 rounded-md text-xs">Detail</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Investment;