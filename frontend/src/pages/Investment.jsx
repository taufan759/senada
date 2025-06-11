import { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayouts';
import { jwtDecode } from 'jwt-decode';
import SelectInput from '../components/Element/selectInput';
import InputNumber from '../components/Element/InputNumber';
import CardOption from '../components/Element/CardOption';
import InputRadio from '../components/Element/InputRadio';

const Investment = () => {
  const [riskProfile, setRiskProfile] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [layerQuiz, setLayerQuiz] = useState(0);

  const [tujuan, setTujuan] = useState('');
  const [usia, setUsia] = useState('');
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
  }, []);

  const handleStartQuiz = () => {
    setShowQuiz(true);
    setLayerQuiz(1);
  };

  useEffect(() => {
    // console.log('Layer Quiz berubah:', layerQuiz);
  }, [layerQuiz]);

  const handleCompleteQuiz = (e) => {
    e.preventDefault();

    console.log('Tujuan:', tujuan);
    console.log('Usia:', usia);
    console.log('Target Dana:', targetDana);
    console.log('Jangka Waktu:', jangkaWaktu);
    console.log('Pemahaman:', pemahaman);
    console.log('Behavior:', behavior);
    console.log('Priority:', priority);
    console.log('Jenis Investasi:', jenisInvestasi);

    // setRiskProfile(false);
    // setShowQuiz(false);
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
        {!riskProfile && !showQuiz ? (
          <>
            {/* Risk Profile */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Profil Risiko</h2>
              <p className="text-gray-600 mb-4">Tentukan profil risiko Anda untuk mendapatkan rekomendasi investasi yang sesuai</p>
              <button className="bg-secondary hover:bg-secondary-light text-white px-6 py-2 rounded-md font-medium transition-colors"
                onClick={handleStartQuiz}>
                Mulai Assessment
              </button>
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
                          <label htmlFor="usia" className="text-sm text-gray-600 mb-1">Berapa kira-kira dana yang kamu butuhkan?</label>
                          <InputNumber name="usia" value={targetDana} onChange={(e) => setTargetDana(e.target.value)} />
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
                            <option value="kurang-5jt">&lt; 1 Tahun</option>
                            <option value="5jt-10jt">1 Tahun - 3 Tahun</option>
                            <option value="10jt-20jt">3 Tahun - 5 Tahun</option>
                            <option value="lebih-20jt">&gt; 5 Tahun</option>
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
                          <label htmlFor="tujuan" className="text-sm text-gray-600 mb-1">Berapa kira-kira total pendapatan bulananmu?</label>
                          <SelectInput
                            name="tujuan"
                            options={['Pengembangan Karir', 'Pembelian Rumah', 'Pendidikan Anak', 'Pensiun', 'Pengembangan Usaha']}
                            onChange={(e) => setTujuan(e.target.value)}
                            value={tujuan}
                            placeholder="Pilih Tujuan"
                            className="border border-gray-300 rounded-md p-2"
                          >
                            <option value="kurang-5jt">&lt; Rp 5.000.000</option>
                            <option value="5jt-10jt">Rp 5.000.000 - Rp 10.000.000</option>
                            <option value="10jt-20jt">Rp 10.000.000 - Rp 20.000.000</option>
                            <option value="lebih-20jt">&gt; Rp 20.000.000</option>
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
                              value="Panik"
                              onChange={(e) => setBehavior(e.target.value)} />


                            <InputRadio
                              id="behavior-2"
                              name="behavior"
                              label="Khawatir, tapi saya akan diamkan dan tunggu sampai pulih"
                              value="Khawatir"
                              onChange={(e) => setBehavior(e.target.value)} />

                            <InputRadio
                              id="behavior-3"
                              name="behavior"
                              label="Tenang. Justru ini kesempatan untuk beli lagi di harga murah"
                              value="Tenang"
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
                              value="Keamanan Modal"
                              onChange={(e) => setPriority(e.target.value)} />

                            <InputRadio
                              id="priority-2"
                              name="priority"
                              label="Siap terima risiko tinggi untuk untung besar"
                              value="Potensi Keuntungan Maksimal"
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
                              value="Deposito atau Emas"
                              onChange={(e) => setJenisInvestasi(e.target.value)} />

                            <InputRadio
                              id="jenisInvestasi-2"
                              name="jenisInvestasi"
                              label="Reksa Dana"
                              value="Reksa Dana"
                              onChange={(e) => setJenisInvestasi(e.target.value)} />

                            <InputRadio
                              id="jenisInvestasi-3"
                              name="jenisInvestasi"
                              label="Saham"
                              value="Saham"
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
            {/* <button className="bg-secondary hover:bg-secondary-light text-white px-6 py-2 rounded-md font-medium transition-colors mt-4" onClick={handleCompleteQuiz}>
              Lanjutkan
            </button> */}
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
    </AppLayout>
  );
};

export default Investment;