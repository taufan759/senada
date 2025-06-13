import { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayouts';
import { jwtDecode } from 'jwt-decode';
import SelectInput from '../components/Element/selectInput';
import InputNumber from '../components/Element/InputNumber';
import CardOption from '../components/Element/CardOption';
import InputRadio from '../components/Element/InputRadio';
import AppSettings from '../AppSettings';

const Investment = () => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [layerQuiz, setLayerQuiz] = useState(0);

  // Quiz states
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

  const getRecommend = async () => {
    try {
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

  const handleStartQuiz = () => {
    setShowQuiz(true);
    setLayerQuiz(1);
  };

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
      
      fetch(`${AppSettings.api}/recommend/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ ...data, profile_risiko: profileResiko })
      })

      setRecommend([{ ...data, profile_risiko: profileResiko }]);
      setShowQuiz(false);
      setLayerQuiz(0);

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Kategori investasi yang diupdate - lebih modern dan trending
  const getInvestmentCategories = () => {
    if (!recommend || recommend.length === 0) {
      // Kategori umum jika belum ada profil risiko
      return [
        {
          name: 'Bitcoin & Crypto',
          description: 'Aset digital dengan potensi return tinggi namun volatil',
          icon: '₿',
          gradient: 'from-orange-500 to-yellow-500',
          riskLevel: 'Tinggi',
          minInvestment: 'Rp 50.000',
          platform: 'Indodax, Pintu, Tokocrypto',
          trending: true,
          links: [
            { name: 'Indodax', url: 'https://indodax.com/' },
            { name: 'Pintu', url: 'https://pintu.co.id/' },
            { name: 'Tokocrypto', url: 'https://tokocrypto.com/' }
          ]
        },
        {
          name: 'Reksa Dana Index',
          description: 'Investasi pasif mengikuti indeks dengan biaya rendah',
          icon: '📊',
          gradient: 'from-blue-500 to-cyan-500',
          riskLevel: 'Menengah',
          minInvestment: 'Rp 10.000',
          platform: 'Bibit, Bareksa, Ajaib',
          popular: true,
          links: [
            { name: 'Bibit', url: 'https://bibit.id/' },
            { name: 'Bareksa', url: 'https://www.bareksa.com/' },
            { name: 'Ajaib', url: 'https://ajaib.co.id/' }
          ]
        },
        {
          name: 'P2P Lending',
          description: 'Pinjam meminjam dengan return 10-18% per tahun',
          icon: '🤝',
          gradient: 'from-green-500 to-emerald-500',
          riskLevel: 'Menengah-Tinggi',
          minInvestment: 'Rp 100.000',
          platform: 'Investree, Modalku, Akseleran',
          featured: true,
          links: [
            { name: 'Investree', url: 'https://www.investree.id/' },
            { name: 'Modalku', url: 'https://modalku.co.id/' },
            { name: 'Akseleran', url: 'https://www.akseleran.co.id/' }
          ]
        },
        {
          name: 'Robo Advisor',
          description: 'Investasi otomatis berbasis AI dan algoritma',
          icon: '🤖',
          gradient: 'from-purple-500 to-pink-500',
          riskLevel: 'Menengah',
          minInvestment: 'Rp 100.000',
          platform: 'Ajaib Robo, Bibit Robo, TMRW',
          modern: true,
          links: [
            { name: 'Ajaib Robo', url: 'https://ajaib.co.id/robo-advisor' },
            { name: 'Bibit', url: 'https://bibit.id/' },
            { name: 'TMRW by UOB', url: 'https://www.tmrwbankid.com/' }
          ]
        },
        {
          name: 'Saham Blue Chip',
          description: 'Saham perusahaan besar dengan fundamental kuat',
          icon: '🏢',
          gradient: 'from-indigo-500 to-blue-600',
          riskLevel: 'Menengah',
          minInvestment: 'Rp 100.000',
          platform: 'Stockbit, Ajaib, IPOT',
          stable: true,
          links: [
            { name: 'Stockbit', url: 'https://stockbit.com/' },
            { name: 'Ajaib', url: 'https://ajaib.co.id/' },
            { name: 'IPOT', url: 'https://www.indopremier.com/' }
          ]
        },
        {
          name: 'SBN & Sukuk Retail',
          description: 'Obligasi pemerintah dengan risiko rendah dan return stabil',
          icon: '🏛️',
          gradient: 'from-teal-500 to-cyan-600',
          riskLevel: 'Rendah',
          minInvestment: 'Rp 1.000.000',
          platform: 'e-SBN, Bareksa, BNI Sekuritas',
          safe: true,
          links: [
            { name: 'e-SBN Kemenkeu', url: 'https://www.kemenkeu.go.id/sbn' },
            { name: 'Bareksa', url: 'https://www.bareksa.com/' },
            { name: 'BNI Sekuritas', url: 'https://www.bnisekuritas.co.id/' }
          ]
        }
      ];
    }

    // Filter kategori berdasarkan profil risiko
    const userRiskProfile = recommend[0]?.profile_risiko || 'Moderat';
    const allCategories = [
      {
        name: 'Bitcoin & Crypto',
        description: 'Aset digital dengan potensi return tinggi namun volatil',
        icon: '₿',
        gradient: 'from-orange-500 to-yellow-500',
        riskLevel: 'Tinggi',
        suitableFor: ['Agresif'],
        minInvestment: 'Rp 50.000',
        platform: 'Indodax, Pintu, Tokocrypto',
        trending: true,
        links: [
          { name: 'Indodax', url: 'https://indodax.com/' },
          { name: 'Pintu', url: 'https://pintu.co.id/' }
        ]
      },
      {
        name: 'Reksa Dana Index',
        description: 'Investasi pasif mengikuti indeks dengan biaya rendah',
        icon: '📊',
        gradient: 'from-blue-500 to-cyan-500',
        riskLevel: 'Menengah',
        suitableFor: ['Konservatif', 'Moderat', 'Agresif'],
        minInvestment: 'Rp 10.000',
        platform: 'Bibit, Bareksa, Ajaib',
        popular: true,
        links: [
          { name: 'Bibit', url: 'https://bibit.id/' },
          { name: 'Bareksa', url: 'https://www.bareksa.com/' }
        ]
      },
      {
        name: 'P2P Lending',
        description: 'Pinjam meminjam dengan return 10-18% per tahun',
        icon: '🤝',
        gradient: 'from-green-500 to-emerald-500',
        riskLevel: 'Menengah-Tinggi',
        suitableFor: ['Moderat', 'Agresif'],
        minInvestment: 'Rp 100.000',
        platform: 'Investree, Modalku, Akseleran',
        featured: true,
        links: [
          { name: 'Investree', url: 'https://www.investree.id/' },
          { name: 'Modalku', url: 'https://modalku.co.id/' }
        ]
      },
      {
        name: 'Robo Advisor',
        description: 'Investasi otomatis berbasis AI dan algoritma',
        icon: '🤖',
        gradient: 'from-purple-500 to-pink-500',
        riskLevel: 'Menengah',
        suitableFor: ['Konservatif', 'Moderat', 'Agresif'],
        minInvestment: 'Rp 100.000',
        platform: 'Ajaib Robo, Bibit Robo',
        modern: true,
        links: [
          { name: 'Ajaib Robo', url: 'https://ajaib.co.id/robo-advisor' },
          { name: 'Bibit', url: 'https://bibit.id/' }
        ]
      },
      {
        name: 'Saham Growth',
        description: 'Saham perusahaan teknologi dengan pertumbuhan tinggi',
        icon: '🚀',
        gradient: 'from-indigo-500 to-purple-600',
        riskLevel: 'Tinggi',
        suitableFor: ['Agresif'],
        minInvestment: 'Rp 100.000',
        platform: 'Stockbit, Ajaib',
        growth: true,
        links: [
          { name: 'Stockbit', url: 'https://stockbit.com/' },
          { name: 'Ajaib', url: 'https://ajaib.co.id/' }
        ]
      },
      {
        name: 'SBN & Sukuk Retail',
        description: 'Obligasi pemerintah dengan risiko rendah dan return stabil',
        icon: '🏛️',
        gradient: 'from-teal-500 to-cyan-600',
        riskLevel: 'Rendah',
        suitableFor: ['Konservatif', 'Moderat'],
        minInvestment: 'Rp 1.000.000',
        platform: 'e-SBN, Bareksa',
        safe: true,
        links: [
          { name: 'e-SBN Kemenkeu', url: 'https://www.kemenkeu.go.id/sbn' },
          { name: 'Bareksa', url: 'https://www.bareksa.com/' }
        ]
      }
    ];

    return allCategories.filter(category => 
      category.suitableFor.includes(userRiskProfile)
    );
  };

  const investmentCategories = getInvestmentCategories();

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">🎯 Smart Investment Hub</h1>
              <p className="text-blue-100">Investasi cerdas berdasarkan profil risiko Anda</p>
            </div>
            <div className="text-6xl opacity-20">💰</div>
          </div>
        </div>

        {!showQuiz ? (
          <>
            {/* Risk Profile Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Profil Risiko Investasi</h2>
              </div>

              {!recommend || recommend.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">🤔</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum Ada Profil Risiko</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Yuk, kenali profil risiko investasi kamu dulu! Dengan begini, kami bisa kasih rekomendasi investasi yang pas banget buat kamu.
                  </p>
                  <button 
                    onClick={handleStartQuiz}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    🚀 Mulai Assessment Risiko
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {recommend[0]?.profile_risiko || 'Moderat'}
                      </div>
                      <div className="text-sm text-gray-600">Profil Risiko Anda</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {recommend?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Rekomendasi Tersedia</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {investmentCategories.length}
                      </div>
                      <div className="text-sm text-gray-600">Kategori Cocok</div>
                    </div>
                  </div>

                  {/* Rekomendasi Produk */}
                  {recommend && recommend.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Rekomendasi Khusus Untuk Anda</h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {recommend.map((rec, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-indigo-50"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                  {rec.nama_produk}
                                </h4>
                                <p className="text-sm text-gray-600 mb-2">
                                  {rec.jenis_produk}
                                </p>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium
                                  ${rec.tingkat_risiko === 'Rendah' ? 'bg-green-100 text-green-800' :
                                    rec.tingkat_risiko === 'Menengah' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'}`}>
                                  Risiko: {rec.tingkat_risiko}
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-500 mb-1">Match Score</div>
                                <div className="text-xl font-bold text-blue-600">
                                  {(rec.skor_kecocokan * 100).toFixed(0)}%
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-center">
                    <button 
                      onClick={handleStartQuiz}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      🔄 Ulang Assessment
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Investment Categories */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {recommend && recommend.length > 0 
                      ? `Kategori Investasi untuk Profil ${recommend[0]?.profile_risiko}`
                      : 'Jelajahi Kategori Investasi Trending'
                    }
                  </h2>
                  <p className="text-gray-600">Platform terpercaya untuk mulai investasi</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {investmentCategories.map((category, index) => (
                  <div key={index} className="group border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${category.gradient} opacity-10 rounded-full transform translate-x-6 -translate-y-6`}></div>
                    
                    {/* Badges */}
                    <div className="absolute top-4 right-4 flex flex-col gap-1">
                      {category.trending && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                          🔥 TRENDING
                        </span>
                      )}
                      {category.popular && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                          ⭐ POPULAR
                        </span>
                      )}
                      {category.modern && (
                        <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                          🤖 AI-POWERED
                        </span>
                      )}
                      {category.safe && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                          🛡️ AMAN
                        </span>
                      )}
                    </div>

                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${category.gradient} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          {category.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {category.riskLevel}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        {category.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Min. Investasi:</span>
                          <span className="font-medium">{category.minInvestment}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Platform:</span>
                          <span className="font-medium text-right">{category.platform}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Platform Terpercaya:</p>
                        {category.links.map((link, linkIndex) => (
                          <a
                            key={linkIndex}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-blue-600 hover:text-blue-800 text-sm hover:underline transition-colors duration-200 flex items-center gap-2 group/link"
                          >
                            <span className="group-hover/link:scale-110 transition-transform">🔗</span>
                            {link.name}
                            <span className="text-xs opacity-60 group-hover/link:opacity-100">↗</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Section */}
              <div className="mt-8 text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">🎯 Siap Mulai Investasi?</h3>
                <p className="text-gray-600 mb-4">
                  Ingat, diversifikasi adalah kunci! Jangan taruh semua telur di satu keranjang.
                </p>
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => window.open('https://www.instagram.com/ojk.id/', '_blank')}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                  >
                    📚 Belajar di OJK
                  </button>
                  <button 
                    onClick={() => window.open('https://sikapiuangmu.ojk.go.id/', '_blank')}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                  >
                    💡 Tips Investasi
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Quiz Section */
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🧠</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Assessment Profil Risiko</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex space-x-1">
                    {[1,2,3,4,5].map((step) => (
                      <div 
                        key={step}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          step <= layerQuiz ? 'bg-purple-500' : 'bg-gray-300'
                        }`}
                      ></div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">Langkah {layerQuiz} dari 5</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleCompleteQuiz}>
              {(() => {
                switch (layerQuiz) {
                  case 1:
                    return (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Hai {user.name}! 👋 Apa tujuan keuangan utamamu saat ini?
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <CardOption tujuan={tujuan} icon="🏠" onClick={() => setTujuan("Beli Properti Pertama")} title="Beli Properti Pertama" description="Investasi properti untuk hunian pertama" />
                            <CardOption tujuan={tujuan} icon="🚗" onClick={() => setTujuan("Beli Kendaraan")} title="Beli Kendaraan" description="Kebutuhan transportasi pribadi" />
                            <CardOption tujuan={tujuan} icon="💒" onClick={() => setTujuan("Dana Menikah")} title="Dana Menikah" description="Persiapan pernikahan" />
                            <CardOption tujuan={tujuan} icon="🛕" onClick={() => setTujuan("Dana Haji/Umrah")} title="Dana Haji/Umrah" description="Persiapan ibadah haji/umrah" />
                            <CardOption tujuan={tujuan} icon="🎓" onClick={() => setTujuan("Dana Pendidikan Anak")} title="Dana Pendidikan Anak" description="Persiapan biaya pendidikan" />
                            <CardOption tujuan={tujuan} icon="🚨" onClick={() => setTujuan("Dana Darurat")} title="Dana Darurat" description="Persiapan untuk keadaan darurat" />
                            <CardOption tujuan={tujuan} icon="🏆" onClick={() => setTujuan("Dana Pensiun")} title="Dana Pensiun" description="Persiapan masa pensiun" />
                            <CardOption tujuan={tujuan} icon="💰" onClick={() => setTujuan("Mengembangkan Aset")} title="Mengembangkan Aset" description="Pengembangan kekayaan" />
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button 
                            disabled={!tujuan}
                            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 disabled:cursor-not-allowed" 
                            onClick={(e) => { e.preventDefault(); setLayerQuiz(2); }}
                          >
                            Lanjutkan →
                          </button>
                        </div>
                      </div>
                    );
                  case 2:
                    return (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              💰 Berapa kira-kira dana yang kamu butuhkan? (dalam juta)
                            </label>
                            <InputNumber 
                              name="targetDana" 
                              value={targetDana} 
                              onChange={(e) => setTargetDana(e.target.value)}
                              placeHolder="Contoh: 100"
                            />
                            <p className="text-xs text-gray-500 mt-1">Masukkan angka tanpa kata "juta"</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              ⏰ Kapan kamu ingin tujuan ini tercapai?
                            </label>
                            <SelectInput
                              name="jangkaWaktu"
                              onChange={(e) => setJangkaWaktu(e.target.value)}
                              value={jangkaWaktu}
                            >
                              <option value="">Pilih Jangka Waktu</option>
                              <option value="1">&lt; 1 Tahun</option>
                              <option value="2">1 Tahun - 3 Tahun</option>
                              <option value="4">3 Tahun - 5 Tahun</option>
                              <option value="5">&gt; 5 Tahun</option>
                            </SelectInput>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <button className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors" onClick={(e) => { e.preventDefault(); setLayerQuiz(1) }}>
                            ← Kembali
                          </button>
                          <button 
                            disabled={!targetDana || !jangkaWaktu}
                            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 disabled:cursor-not-allowed" 
                            onClick={(e) => { e.preventDefault(); setLayerQuiz(3) }}
                          >
                            Lanjutkan →
                          </button>
                        </div>
                      </div>
                    );
                  case 3:
                    return (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              🎂 Berapa usia kamu saat ini?
                            </label>
                            <InputNumber 
                              name="usia" 
                              value={usia} 
                              onChange={(e) => setUsia(e.target.value)}
                              placeHolder="Contoh: 25"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              💵 Berapa kira-kira total pendapatan bulananmu?
                            </label>
                            <SelectInput
                              name="pendapatan"
                              onChange={(e) => setPendapatan(e.target.value)}
                              value={pendapatan}
                            >
                              <option value="">Pilih rentang pendapatan</option>
                              <option value="5">&lt; Rp 5.000.000</option>
                              <option value="7.5">Rp 5.000.000 - Rp 10.000.000</option>
                              <option value="15">Rp 10.000.000 - Rp 20.000.000</option>
                              <option value="20">&gt; Rp 20.000.000</option>
                            </SelectInput>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <button className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors" onClick={(e) => { e.preventDefault(); setLayerQuiz(2) }}>
                            ← Kembali
                          </button>
                          <button 
                            disabled={!usia || !pendapatan}
                            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 disabled:cursor-not-allowed" 
                            onClick={(e) => { e.preventDefault(); setLayerQuiz(4) }}
                          >
                            Lanjutkan →
                          </button>
                        </div>
                      </div>
                    );
                  case 4:
                    return (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-lg font-semibold text-gray-900 mb-4">
                            🧠 Seberapa jauh pemahamanmu tentang investasi?
                          </label>
                          <div className="space-y-3">
                            <div className="border rounded-lg p-4 hover:bg-blue-50 transition-colors cursor-pointer" 
                                 onClick={() => setPemahaman('Pemula')}>
                              <InputRadio id="pemahaman-1" name="pemahaman" label="Baru mau coba, istilahnya aja masih asing 🤷‍♂️" value="Pemula" onChange={(e) => setPemahaman(e.target.value)} />
                            </div>
                            <div className="border rounded-lg p-4 hover:bg-blue-50 transition-colors cursor-pointer"
                                 onClick={() => setPemahaman('Menengah')}>
                              <InputRadio id="pemahaman-2" name="pemahaman" label="Sudah pernah investasi, tahu bedanya saham dan reksa dana 📊" value="Menengah" onChange={(e) => setPemahaman(e.target.value)} />
                            </div>
                            <div className="border rounded-lg p-4 hover:bg-blue-50 transition-colors cursor-pointer"
                                 onClick={() => setPemahaman('Mahir')}>
                              <InputRadio id="pemahaman-3" name="pemahaman" label="Cukup paham, saya rutin memantau kondisi pasar 📈" value="Mahir" onChange={(e) => setPemahaman(e.target.value)} />
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-lg font-semibold text-gray-900 mb-4">
                            😱 Bayangkan nilai investasimu tiba-tiba anjlok 20% dalam sebulan. Apa yang akan kamu lakukan?
                          </label>
                          <div className="space-y-3">
                            <div className="border rounded-lg p-4 hover:bg-red-50 transition-colors cursor-pointer"
                                 onClick={() => setBehavior('1')}>
                              <InputRadio id="behavior-1" name="behavior" label="Panik! Saya akan jual sebagian besar agar tidak rugi lebih banyak 😰" value="1" onChange={(e) => setBehavior(e.target.value)} />
                            </div>
                            <div className="border rounded-lg p-4 hover:bg-yellow-50 transition-colors cursor-pointer"
                                 onClick={() => setBehavior('3')}>
                              <InputRadio id="behavior-2" name="behavior" label="Khawatir, tapi saya akan diamkan dan tunggu sampai pulih 😐" value="3" onChange={(e) => setBehavior(e.target.value)} />
                            </div>
                            <div className="border rounded-lg p-4 hover:bg-green-50 transition-colors cursor-pointer"
                                 onClick={() => setBehavior('5')}>
                              <InputRadio id="behavior-3" name="behavior" label="Tenang. Justru ini kesempatan untuk beli lagi di harga murah 😎" value="5" onChange={(e) => setBehavior(e.target.value)} />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <button className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors" onClick={(e) => { e.preventDefault(); setLayerQuiz(3) }}>
                            ← Kembali
                          </button>
                          <button 
                            disabled={!pemahaman || !behavior}
                            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 disabled:cursor-not-allowed" 
                            onClick={(e) => { e.preventDefault(); setLayerQuiz(5) }}
                          >
                            Lanjutkan →
                          </button>
                        </div>
                      </div>
                    );
                  case 5:
                    return (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-lg font-semibold text-gray-900 mb-4">
                            🎯 Dalam berinvestasi, mana yang lebih penting untukmu?
                          </label>
                          <div className="space-y-3">
                            <div className="border rounded-lg p-4 hover:bg-green-50 transition-colors cursor-pointer"
                                 onClick={() => setPriority('1')}>
                              <InputRadio id="priority-1" name="priority" label="Pokoknya uangku aman, untung sedikit tidak apa-apa 🛡️" value="1" onChange={(e) => setPriority(e.target.value)} />
                            </div>
                            <div className="border rounded-lg p-4 hover:bg-red-50 transition-colors cursor-pointer"
                                 onClick={() => setPriority('5')}>
                              <InputRadio id="priority-2" name="priority" label="Siap terima risiko tinggi untuk untung besar 🚀" value="5" onChange={(e) => setPriority(e.target.value)} />
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-lg font-semibold text-gray-900 mb-4">
                            💼 Jika diberi pilihan, produk mana yang paling membuatmu merasa 'aman' untuk dicoba?
                          </label>
                          <div className="space-y-3">
                            <div className="border rounded-lg p-4 hover:bg-green-50 transition-colors cursor-pointer"
                                 onClick={() => setJenisInvestasi('1')}>
                              <InputRadio id="jenisInvestasi-1" name="jenisInvestasi" label="Deposito atau Emas 🥇" value="1" onChange={(e) => setJenisInvestasi(e.target.value)} />
                            </div>
                            <div className="border rounded-lg p-4 hover:bg-blue-50 transition-colors cursor-pointer"
                                 onClick={() => setJenisInvestasi('3')}>
                              <InputRadio id="jenisInvestasi-2" name="jenisInvestasi" label="Reksa Dana 📊" value="3" onChange={(e) => setJenisInvestasi(e.target.value)} />
                            </div>
                            <div className="border rounded-lg p-4 hover:bg-red-50 transition-colors cursor-pointer"
                                 onClick={() => setJenisInvestasi('5')}>
                              <InputRadio id="jenisInvestasi-3" name="jenisInvestasi" label="Saham 📈" value="5" onChange={(e) => setJenisInvestasi(e.target.value)} />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <button className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors" onClick={(e) => { e.preventDefault(); setLayerQuiz(4) }}>
                            ← Kembali
                          </button>
                          <button
                            disabled={!priority || !jenisInvestasi}
                            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 disabled:cursor-not-allowed"
                            type='submit'
                          >
                            🎉 Selesai Assessment
                          </button>
                        </div>
                      </div>
                    );
                  default:
                    return null;
                }
              })()}
            </form>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Investment;