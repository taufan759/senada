import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import '../styles/homeAnimations.css';

const Home = () => {
  const features = [
    {
      icon: '📊',
      title: 'Dashboard Finansial',
      description: 'Pantau kondisi keuangan Anda secara real-time dengan visualisasi yang mudah dipahami'
    },
    {
      icon: '💰',
      title: 'Pencatatan Transaksi',
      description: 'Catat setiap pemasukan dan pengeluaran dengan kategori yang terorganisir'
    },
    {
      icon: '📈',
      title: 'Analisis Keuangan',
      description: 'Dapatkan insight mendalam tentang pola pengeluaran dan kebiasaan finansial Anda'
    },
    {
      icon: '🎯',
      title: 'Target Keuangan',
      description: 'Tetapkan dan pantau progress target tabungan atau investasi Anda'
    },
    {
      icon: '💡',
      title: 'Rekomendasi Cerdas',
      description: 'Terima saran personal untuk mengoptimalkan kesehatan finansial Anda'
    },
    {
      icon: '🔒',
      title: 'Keamanan Terjamin',
      description: 'Data keuangan Anda dilindungi dengan enkripsi tingkat bank'
    }
  ];

  const statistics = [
    { number: '10K+', label: 'Pengguna Aktif' },
    { number: '50M+', label: 'Transaksi Tercatat' },
    { number: '98%', label: 'Kepuasan Pengguna' },
    { number: '4.8', label: 'Rating Aplikasi' }
  ];

  const testimonials = [
    {
      name: 'Rina Susanti',
      role: 'Entrepreneur',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      quote: 'SENADA membantu saya mengelola keuangan bisnis dan pribadi dengan lebih teratur. Sekarang saya bisa fokus mengembangkan usaha!'
    },
    {
      name: 'Budi Hartono',
      role: 'Karyawan Swasta',
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
      quote: 'Fitur analisis pengeluaran sangat membantu saya mengetahui kemana uang saya pergi. Jadi bisa lebih hemat!'
    },
    {
      name: 'Maya Putri',
      role: 'Fresh Graduate',
      image: 'https://randomuser.me/api/portraits/women/3.jpg',
      quote: 'Sebagai fresh graduate, SENADA mengajarkan saya cara mengelola gaji pertama dengan bijak. Recommended!'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-primary-light to-secondary text-white">
          <div className="container mx-auto px-4 py-20 md:py-32">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
                Kelola Keuangan Anda dengan <span className="text-yellow-400">Cerdas</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                SENADA (Sistem Pencatatan dan Analisis Data Keuangan) adalah solusi lengkap
                untuk mencatat, menganalisis, dan mengoptimalkan keuangan pribadi Anda.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-yellow-400 hover:bg-yellow-500 text-primary px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  Mulai Gratis Sekarang
                </Link>
                <Link
                  to="/login"
                  className="bg-white/20 backdrop-blur hover:bg-white/30 text-white px-8 py-4 rounded-full font-bold text-lg transition-all border border-white/50"
                >
                  Sudah Punya Akun
                </Link>
              </div>
            </div>
          </div>

          {/* Wave Separator */}
          <div className="relative">
            <svg className="absolute bottom-0 w-full h-16 -mb-1 text-gray-50" preserveAspectRatio="none" viewBox="0 0 1440 54">
              <path fill="currentColor" d="M0 22L120 16.7C240 11 480 1.00001 720 0.700012C960 1.00001 1200 11 1320 16.7L1440 22V54H1320C1200 54 960 54 720 54C480 54 240 54 120 54H0V22Z"></path>
            </svg>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {statistics.map((stat, index) => (
                <div key={index} className="text-center">
                  <h3 className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</h3>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Fitur Unggulan SENADA</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Nikmati berbagai fitur canggih yang dirancang untuk memudahkan pengelolaan keuangan Anda
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
                >
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Cara Kerja SENADA</h2>
              <p className="text-xl text-gray-600">Mulai kelola keuangan Anda dalam 3 langkah mudah</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Daftar Akun</h3>
                <p className="text-gray-600">Buat akun gratis dan lengkapi profil keuangan Anda</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">Catat Transaksi</h3>
                <p className="text-gray-600">Input pemasukan dan pengeluaran harian Anda</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Analisis & Optimalkan</h3>
                <p className="text-gray-600">Dapatkan insight dan rekomendasi untuk keuangan lebih baik</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Apa Kata Pengguna Kami</h2>
              <p className="text-xl text-gray-600">Ribuan pengguna telah merasakan manfaat SENADA</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Siap Mengambil Kontrol Keuangan Anda?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Bergabung dengan ribuan pengguna yang telah mengubah cara mereka mengelola uang
            </p>
            <Link
              to="/register"
              className="bg-white hover:bg-gray-100 text-primary px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg inline-block"
            >
              Daftar Gratis Sekarang
            </Link>
            <p className="mt-4 text-sm opacity-75">
              Tidak perlu kartu kredit • Gratis selamanya untuk fitur dasar
            </p>
          </div>
        </section>

        {/* Articles Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Artikel & Tips Keuangan</h2>
              <p className="text-xl text-gray-600">Pelajari cara mengelola keuangan lebih baik</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
                <img
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop"
                  alt="Financial Planning"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">10 Tips Menabung untuk Milenial</h3>
                  <p className="text-gray-600 mb-4">Strategi praktis untuk memulai kebiasaan menabung di usia muda...</p>
                  <Link to="#" className="text-primary font-medium hover:underline">
                    Baca Selengkapnya →
                  </Link>
                </div>
              </article>

              <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
                <img
                  src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=250&fit=crop"
                  alt="Investment"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Investasi untuk Pemula: Panduan Lengkap</h3>
                  <p className="text-gray-600 mb-4">Mulai perjalanan investasi Anda dengan langkah yang tepat...</p>
                  <Link to="#" className="text-primary font-medium hover:underline">
                    Baca Selengkapnya →
                  </Link>
                </div>
              </article>

              <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
                <img
                  src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop"
                  alt="Budget Planning"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Cara Membuat Anggaran Bulanan yang Efektif</h3>
                  <p className="text-gray-600 mb-4">Panduan step-by-step untuk merencanakan keuangan bulanan...</p>
                  <Link to="#" className="text-primary font-medium hover:underline">
                    Baca Selengkapnya →
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;