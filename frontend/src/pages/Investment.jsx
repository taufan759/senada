import { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayouts';
import { jwtDecode } from 'jwt-decode';
import SelectInput from '../components/Element/selectInput';
import InputNumber from '../components/Element/InputNumber';
import CardOption from '../components/Element/CardOption';
import InputRadio from '../components/Element/InputRadio';
import AppSettings from '../AppSettings';

const Investment = () => {
  const [riskProfile, setRiskProfile] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [layerQuiz, setLayerQuiz] = useState(0);

  const [tujuan, setTujuan] = useState('');
  const [usia, setUsia] = useState('');
  const [pendapatan, setPendapatan] = useState('');
  const [targetDana, setTargetDana] = useState('');
  const [jangkaWaktu, setJangkaWaktu] = useState('');
  const [pemahaman, setPemahaman] = useState('');
  const [behavior, setBehavior] = useState('');
  const [priority, setPriority] = useState('');
  const [jenisInvestasi, setJenisInvestasi] = useState('');

  const [user, setUser] = useState({
    name: '',
    email: '',
    role: ''
  });

  const [recommend, setRecommend] = useState();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decoded = jwtDecode(token);

      const user = {
        name: decoded.name || '',
        email: decoded.email || '',
        role: decoded.role || 'user'
      };

      setUser(user);
    } else {
      console.log('No token found');
    }

    getRecommend();
  }, []);

  const handleStartQuiz = () => {
    setShowQuiz(true);
    setLayerQuiz(1);
  };

  const getRecommend = async () => {
    try {
      // ambil data transaksi dari API
      const response = await fetch(`${AppSettings.api}/recommend`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        }
      });

      const data = await response.json();
      const formattedData = data.map((d) => d)

      if (data.length === 0) {
        return;
      }
      setRecommend(formattedData);
    } catch (error) {
      console.log(error)
    }
  }

  const handleCompleteQuiz = async (e) => {
    e.preventDefault();

    let profileResiko = parseInt(behavior) + parseInt(priority) + parseInt(jenisInvestasi);

    if (profileResiko >= 3 && profileResiko <= 5) {
      profileResiko = 'Konservatif';
    } else if (profileResiko >= 6 && profileResiko <= 10) {
      profileResiko = 'Moderat';

    } else if (profileResiko >= 11 && profileResiko <= 15) {
      profileResiko = 'Agresif';
    }

    try {
      const response = await fetch(`${AppSettings.api}/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          usia: usia,
          profil_risiko: profileResiko,
          pendapatan_bulanan_juta: pendapatan,
          tingkat_pengetahuan: pemahaman,
          tujuan_keuangan: tujuan,
          target_dana_juta: targetDana,
          jangka_waktu_thn: jangkaWaktu
        })
      });

      const data = await response.json();
      setRiskProfile(true);
      // Memasukkan hasil ML ke Database
      fetch(`${AppSettings.api}/recommend/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ ...data, profile_risiko: profileResiko })
      })

    } catch (error) {
      console.error('Error:', error);
    }

    // setRiskProfile(false);
    setShowQuiz(false);
    // window.location.reload();
  };
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">Portfolio Investasi</h1>

          {/* Investment Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-600 mb-1">Total Investasi</h3>
              <p className="text-xl font-bold text-blue-600">Rp 0</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-600 mb-1">Keuntungan</h3>
              <p className="text-xl font-bold text-green-600">Rp 0</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-600 mb-1">Return</h3>
              <p className="text-xl font-bold text-purple-600">0%</p>
            </div>
          </div>
        </div>
        {!showQuiz ? (
          <>
            {/* Risk Profile */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Profil Risiko</h2>
              {!recommend ? (
                <>
                  <p className="text-gray-600 mb-4">Tentukan profil risiko Anda untuk mendapatkan rekomendasi investasi yang sesuai</p>
                  <button className="bg-secondary hover:bg-secondary-light text-white px-6 py-2 rounded-md font-medium transition-colors"
                    onClick={handleStartQuiz}>
                    Mulai Assessment
                  </button>
                </>
              ) : (
                <>
                  <p className="text-gray-600 mb-4">Berikut Profile risiko anda:</p>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">

                    {/* Recommendation Section */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-20 h-20 rounded-lg flex items-center justify-center">
                          <span className="text-6xl">🎯</span>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Rekomendasi Investasi</h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600 mb-1">{recommend ? recommend.length : 0}</div>
                          <div className="text-sm text-gray-600">Produk Cocok</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {recommend && recommend.length > 0
                              ? (
                                (recommend.reduce((acc, rec) => acc + (parseFloat(rec.skor_kecocokan) || 0), 0) / recommend.length * 100)
                                  .toFixed(2)
                              )
                              : 0
                            }%
                          </div>
                          <div className="text-sm text-gray-600">Rata-rata Match</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600 mb-1">
                            {recommend && recommend.length > 0 ? recommend[0].profile_risiko : '-'}
                          </div>
                          <div className="text-sm text-gray-600">Profil Risiko</div>
                        </div>
                      </div>
                    </div>
                    {/* Investment Cards Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                      {recommend.map((rec) => (
                        <div
                          key={rec.id}
                          className={`rounded-xl p-6 shadow-sm border border-gray-200 bg-blue-50 hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer
                            }`}
                        >
                          {/* Card Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                {rec.nama_produk}
                              </h3>

                              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                Jenis: {rec.jenis_produk}
                              </p>
                            </div>

                            <div className="text-right">
                              <div className="text-sm text-gray-500 mb-1">Skor Kecocokan</div>
                              <div className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                                {(rec.skor_kecocokan * 100).toFixed(2)}%
                              </div>
                            </div>
                          </div>


                          {/* Risk Level and CTA */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">Risiko:</span>
                              <span className={`bg-red-500 text-white px-2 py-1 rounded text-xs font-medium`}>
                                {rec.tingkat_risiko}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* {recommend && Array.isArray(recommend) && recommend.length > 0 ? (
                      recommend.map((rec, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-blue-50">
                          <h3 className="font-semibold text-lg mb-2">{rec.nama_produk || 'Rekomendasi Investasi'}</h3>
                          <p className="text-sm text-gray-700 mb-2">{rec.deskripsi || rec.keterangan || 'Produk investasi yang sesuai dengan profil risiko Anda.'}</p>
                          <div className="flex gap-5">
                            {rec.skor_kecocokan && (
                              <span className="inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded mb-2">
                                Skor Kecocokan: {rec.skor_kecocokan * 100 + '%'}
                              </span>
                            )}
                            {rec.tingkat_risiko && (
                              <div className="inline-block bg-red-700 text-white text-xs px-2 py-1 rounded mb-2">Risiko: {rec.tingkat_risiko}</div>
                            )}
                          </div>
                          <button className="text-primary hover:underline text-sm mt-2">Pelajari Lebih Lanjut →</button>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500">Belum ada rekomendasi investasi.</div>
                    )} */}
                  </div>
                  <button className="bg-secondary hover:bg-secondary-light text-white px-6 py-2 rounded-md font-medium transition-colors"
                    onClick={handleStartQuiz}>
                    Ulang Assessment
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Profil Risiko</h2>
            <form onSubmit={handleCompleteQuiz}>
              {(() => {
                switch (layerQuiz) {
                  case 1:
                    return (
                      <>
                        <div className="flex flex-col gap-2">
                          <label htmlFor="tujuan" className="text-sm text-gray-600 mb-1">Hai {user.name}! Apa tujuan keuangan utamamu saat ini?</label>
                          <SelectInput
                            name="tujuan"
                            options={['Pengembangan Karir', 'Pembelian Rumah', 'Pendidikan Anak', 'Pensiun', 'Pengembangan Usaha']}
                            onChange={(e) => setTujuan(e.target.value)}
                            value={tujuan}
                            placeholder="Pilih Tujuan"
                            className="border border-gray-300 rounded-md p-2"
                          >
                            <option value="">Pilih Tujuan Keuangan</option>
                            <option value="Beli Properti Pertama">🏠Beli Properti Pertama</option>
                            <option value="Beli Kendaraan">🚗Beli Kendaraan</option>
                            <option value="Dana Menikah">💒Dana Menikah</option>
                            <option value="Dana Haji/Umrah">🛕Dana Haji/Umrah</option>
                            <option value="Dana Pendidikan Anak">🎓Dana Pendidikan Anak</option>
                            <option value="Dana Darurat">🚨Dana Darurat</option>
                            <option value="Dana Pensiun">🏆Dana Pensiun</option>
                            <option value="Mengembangkan Aset">💰Mengembangkan Aset</option>
                          </SelectInput>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <CardOption tujuan={tujuan} icon="🏠"
                            onClick={() => setTujuan("Beli Properti Pertama")}
                            title="Beli Properti Pertama"
                            description="Investasi properti untuk hunian pertama" />

                          <CardOption tujuan={tujuan} icon="🚗"
                            onClick={() => setTujuan("Beli Kendaraan")}
                            title="Beli Kendaraan"
                            description="Kebutuhan transportasi pribadi" />

                          <CardOption tujuan={tujuan} icon="💒"
                            onClick={() => setTujuan("Dana Menikah")}
                            title="Dana Menikah"
                            description="Persiapan pernikahan" />

                          <CardOption tujuan={tujuan} icon="🛕"
                            onClick={() => setTujuan("Dana Haji/Umrah")}
                            title="Dana Haji/Umrah"
                            description="Persiapan ibadah haji/umrah" />

                          <CardOption tujuan={tujuan} icon="🎓"
                            onClick={() => setTujuan("Dana Pendidikan Anak")}
                            title="Dana Pendidikan Anak"
                            description="Persiapan biaya pendidikan" />

                          <CardOption tujuan={tujuan} icon="💒"
                            onClick={() => setTujuan("Dana Darurat")}
                            title="Dana Darurat"
                            description="Persiapan untuk keadaan darurat" />

                          <CardOption tujuan={tujuan} icon="🏆"
                            onClick={() => setTujuan("Dana Pensiun")}
                            title="Dana Pensiun"
                            description="Persiapan masa pensiun" />

                          <CardOption tujuan={tujuan} icon="💰"
                            onClick={() => setTujuan("Mengembangkan Aset")}
                            title="Mengembangkan Aset"
                            description="Pengembangan kekayaan" />

                        </div>
                        <button className="bg-secondary hover:bg-secondary-light text-white px-6 py-2 rounded-md font-medium transition-colors mt-4" onClick={(e) => { e.preventDefault(); setLayerQuiz(2); }}>
                          Lanjutkan
                        </button>
                      </>
                    );
                  case 2:
                    return (
                      <>
                        <div className="flex flex-col gap-2">
                          <label htmlFor="targetDana" className="text-sm text-gray-600 mb-1">Berapa kira-kira dana yang kamu butuhkan? (dalam juta. Contoh: 100)</label>
                          <InputNumber name="targetDana" value={targetDana} onChange={(e) => setTargetDana(e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label htmlFor="tujuan" className="text-sm text-gray-600 mb-1">Kapan kamu ingin tujuan ini tercapai?</label>
                          <SelectInput
                            name="tujuan"
                            options={['Pengembangan Karir', 'Pembelian Rumah', 'Pendidikan Anak', 'Pensiun', 'Pengembangan Usaha']}
                            onChange={(e) => setJangkaWaktu(e.target.value)}
                            value={jangkaWaktu}
                            placeholder="Pilih Tujuan"
                            className="border border-gray-300 rounded-md p-2"
                          >
                            <option value="1">&lt; 1 Tahun</option>
                            <option value="2">1 Tahun - 3 Tahun</option>
                            <option value="4">3 Tahun - 5 Tahun</option>
                            <option value="5">&gt; 5 Tahun</option>
                          </SelectInput>
                        </div>
                        <button className="bg-secondary hover:bg-secondary-light text-white px-6 py-2 rounded-md font-medium transition-colors mt-4" onClick={(e) => { e.preventDefault(); setLayerQuiz(1) }}>
                          Kembali
                        </button>
                        <button className="bg-secondary hover:bg-secondary-light text-white px-6 py-2 rounded-md font-medium transition-colors mt-4" onClick={(e) => { e.preventDefault(); setLayerQuiz(3) }}>
                          Lanjutkan
                        </button>
                      </>
                    );
                  case 3:
                    return (
                      <>
                        <div className="flex flex-col gap-2">
                          <label htmlFor="usia" className="text-sm text-gray-600 mb-1">Berapa usia anda saat ini?</label>
                          <InputNumber name="usia" value={usia} onChange={(e) => setUsia(e.target.value)} />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label htmlFor="pendapatan" className="text-sm text-gray-600 mb-1">Berapa kira-kira total pendapatan bulananmu?</label>
                          <SelectInput
                            name="pendapatan"
                            options={['Pengembangan Karir', 'Pembelian Rumah', 'Pendidikan Anak', 'Pensiun', 'Pengembangan Usaha']}
                            onChange={(e) => setPendapatan(e.target.value)}
                            value={pendapatan}
                            placeholder="Silahkan pilih"
                            className="border border-gray-300 rounded-md p-2"
                          >
                            <option value="5">&lt; Rp 5.000.000</option>
                            <option value="7.5">Rp 5.000.000 - Rp 10.000.000</option>
                            <option value="15">Rp 10.000.000 - Rp 20.000.000</option>
                            <option value="20">&gt; Rp 20.000.000</option>
                          </SelectInput>
                        </div>
                        <button className="bg-secondary hover:bg-secondary-light text-white px-6 py-2 rounded-md font-medium transition-colors mt-4" onClick={(e) => { e.preventDefault(); setLayerQuiz(2) }}>
                          Kembali
                        </button>
                        <button className="bg-secondary hover:bg-secondary-light text-white px-6 py-2 rounded-md font-medium transition-colors mt-4" onClick={(e) => { e.preventDefault(); setLayerQuiz(4) }}>
                          Lanjutkan
                        </button>
                      </>
                    );
                  case 4:
                    return (
                      <>
                        <div className="flex flex-col gap-2">
                          <label htmlFor="pemahaman" className="text-sm text-gray-600 mb-1">Seberapa jauh pemahamanmu tentang investasi?</label>
                          <div className="space-y-3">
                            <InputRadio
                              id="pemahaman-1"
                              name="pemahaman"
                              label="Baru mau coba, istilahnya aja masih asing"
                              value="Pemula"
                              onChange={(e) => setPemahaman(e.target.value)} />

                            <InputRadio
                              id="pemahaman-2"
                              name="pemahaman"
                              label="Sudah pernah investasi, tahu bedanya saham dan reksa dana"
                              value="Menengah"
                              onChange={(e) => setPemahaman(e.target.value)} />

                            <InputRadio
                              id="pemahaman-3"
                              name="pemahaman"
                              label="Cukup paham, saya rutin memantau kondisi pasar"
                              value="Mahir"
                              onChange={(e) => setPemahaman(e.target.value)} />
                          </div>
                        </div>
                        <br />
                        <div className="flex flex-col gap-2">
                          <label htmlFor="behavior" className="text-sm text-gray-600 mb-1">Bayangkan nilai investasimu tiba-tiba anjlok 20% dalam sebulan. Apa yang akan kamu lakukan?</label>
                          <div className="space-y-3">
                            <InputRadio
                              id="behavior-1"
                              name="behavior"
                              label="Panik! Saya akan jual sebagian besar agar tidak rugi lebih banyak"
                              value="1"
                              onChange={(e) => setBehavior(e.target.value)} />


                            <InputRadio
                              id="behavior-2"
                              name="behavior"
                              label="Khawatir, tapi saya akan diamkan dan tunggu sampai pulih"
                              value="3"
                              onChange={(e) => setBehavior(e.target.value)} />

                            <InputRadio
                              id="behavior-3"
                              name="behavior"
                              label="Tenang. Justru ini kesempatan untuk beli lagi di harga murah"
                              value="5"
                              onChange={(e) => setBehavior(e.target.value)} />
                          </div>
                        </div>
                        <button className="bg-secondary hover:bg-secondary-light text-white px-6 py-2 rounded-md font-medium transition-colors mt-4" onClick={(e) => { e.preventDefault(); setLayerQuiz(3) }}>
                          Kembali
                        </button>
                        <button className="bg-secondary hover:bg-secondary-light text-white px-6 py-2 rounded-md font-medium transition-colors mt-4" onClick={(e) => { e.preventDefault(); setLayerQuiz(5) }}>
                          Lanjutkan
                        </button>
                      </>
                    );
                  case 5:
                    return (
                      <>
                        <div className="flex flex-col gap-2">
                          <label htmlFor="priority" className="text-sm text-gray-600 mb-1">Dalam berinvestasi, mana yang lebih penting untukmu?</label>
                          <div className="space-y-3">
                            <InputRadio
                              id="priority-1"
                              name="priority"
                              label="Pokoknya uangku aman, untung sedikit tidak apa-apa"
                              value="1"
                              onChange={(e) => setPriority(e.target.value)} />

                            <InputRadio
                              id="priority-2"
                              name="priority"
                              label="Siap terima risiko tinggi untuk untung besar"
                              value="5"
                              onChange={(e) => setPriority(e.target.value)} />
                          </div>
                        </div>
                        <br />
                        <div className="flex flex-col gap-2">
                          <label htmlFor="jenisInvestasi" className="text-sm text-gray-600 mb-1">Jika diberi pilihan, produk mana yang paling membuatmu merasa 'aman' untuk dicoba?</label>
                          <div className="space-y-3">
                            <InputRadio
                              id="jenisInvestasi-3"
                              name="jenisInvestasi"
                              label="Deposito atau Emas"
                              value="1"
                              onChange={(e) => setJenisInvestasi(e.target.value)} />

                            <InputRadio
                              id="jenisInvestasi-2"
                              name="jenisInvestasi"
                              label="Reksa Dana"
                              value="3"
                              onChange={(e) => setJenisInvestasi(e.target.value)} />

                            <InputRadio
                              id="jenisInvestasi-3"
                              name="jenisInvestasi"
                              label="Saham"
                              value="5"
                              onChange={(e) => setJenisInvestasi(e.target.value)} />
                          </div>
                        </div>
                        <button className="bg-secondary hover:bg-secondary-light text-white px-6 py-2 rounded-md font-medium transition-colors mt-4" onClick={(e) => { e.preventDefault(); setLayerQuiz(4) }}>
                          Kembali
                        </button>
                        <button
                          className="bg-secondary hover:bg-secondary-light text-white px-6 py-2 rounded-md font-medium transition-colors mt-4"
                          type='submit'
                        >
                          Selesai
                        </button>
                      </>
                    );
                  default:
                    return null;
                }
              })()}

            </form>
          </div>
        )
        }

        {/* Investment Options */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Rekomendasi Investasi</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-2">Reksa Dana</h3>
              <p className="text-sm text-gray-600 mb-3">Investasi yang dikelola profesional dengan risiko terukur</p>
              <button className="text-primary hover:underline text-sm">Pelajari Lebih Lanjut →</button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-2">Saham</h3>
              <p className="text-sm text-gray-600 mb-3">Kepemilikan perusahaan dengan potensi return tinggi</p>
              <button className="text-primary hover:underline text-sm">Pelajari Lebih Lanjut →</button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-2">Obligasi</h3>
              <p className="text-sm text-gray-600 mb-3">Surat utang dengan bunga tetap dan risiko rendah</p>
              <button className="text-primary hover:underline text-sm">Pelajari Lebih Lanjut →</button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-2">Emas</h3>
              <p className="text-sm text-gray-600 mb-3">Aset safe haven untuk lindung nilai inflasi</p>
              <button className="text-primary hover:underline text-sm">Pelajari Lebih Lanjut →</button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout >
  );
};

export default Investment;