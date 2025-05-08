import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const Home = () => {
  const articles = [
    {
      id: 1,
      title: '10 Rahasia yang Memudahkan Pengelolaan Keuangan Harian',
      excerpt: 'Temukan cara-cara praktis mengelola keuangan...',
      image: 'https://via.placeholder.com/300x200',
    },
    {
      id: 2,
      title: 'Mengenal Jenis Investasi untuk Pemula',
      excerpt: 'Panduan lengkap memulai investasi pertamamu...',
      image: 'https://via.placeholder.com/300x200',
    },
    {
      id: 3,
      title: '5 TIPS: Anak Muda Bijak Mengelola Keuangan',
      excerpt: 'Strategi pengelolaan keuangan untuk generasi milenial...',
      image: 'https://via.placeholder.com/300x200',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary-light text-white">
          <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">SENADA Money</h1>
              <p className="text-lg mb-6">
                Catatkan semua data keuangan pribadimu. 
                Analisis pola keuangan dan akhiri urahura keuangan.
              </p>
              <Link to="/dashboard" className="bg-secondary hover:bg-secondary-light text-white px-6 py-3 rounded-md font-medium transition-colors">
                Mulai Sekarang
              </Link>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="https://via.placeholder.com/600x400" 
                alt="SENADA Money App" 
                className="rounded-lg shadow-lg max-w-full h-auto"
              />
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6">Sudahkah kamu mencatat keuanganmu?</h2>
            <p className="max-w-2xl mx-auto mb-8 text-gray-600">
              Mulailah pencatatan keuanganmu dengan langkah perlahan yang praktis! 
              Raih rasa tenang dengan transparansi, pahami pola pengeluaranmu, 
              dan rencanakan masa depan keuangan dengan lebih baik.
            </p>
            <Link to="/dashboard" className="bg-secondary hover:bg-secondary-light text-white px-6 py-3 rounded-md font-medium transition-colors">
              Catat Sekarang
            </Link>
          </div>
        </section>
        
        {/* Articles Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Artikel Terbaru</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {articles.map(article => (
                <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                    <p className="text-gray-600 mb-4">{article.excerpt}</p>
                    <Link 
                      to="#" 
                      className="text-secondary font-medium hover:underline"
                    >
                      Baca selengkapnya
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                <button className="bg-primary text-white h-8 w-8 rounded-full flex items-center justify-center">
                  &lt;
                </button>
                <button className="bg-secondary text-white h-8 w-8 rounded-full flex items-center justify-center">
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;