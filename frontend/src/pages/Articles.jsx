import { useState } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const Articles = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'Semua' },
    { id: 'basics', name: 'Dasar Keuangan' },
    { id: 'saving', name: 'Menabung' },
    { id: 'investment', name: 'Investasi' },
    { id: 'planning', name: 'Perencanaan' },
    { id: 'tips', name: 'Tips & Trik' },
  ];
  
  const articles = [
    {
      id: 1,
      title: '10 Rahasia yang Memudahkan Pengelolaan Keuangan Harian',
      excerpt: 'Temukan cara-cara praktis mengelola keuangan sehari-hari dan membangun kebiasaan baik untuk masa depan finansial yang lebih cerah.',
      image: 'https://via.placeholder.com/300x200',
      category: 'tips',
      date: '8 Mei 2024',
      readTime: '5 menit',
    },
    {
      id: 2,
      title: 'Mengenal Jenis Investasi untuk Pemula',
      excerpt: 'Panduan lengkap memulai investasi pertamamu. Kenali berbagai instrumen investasi yang cocok untuk para pemula.',
      image: 'https://via.placeholder.com/300x200',
      category: 'investment',
      date: '5 Mei 2024',
      readTime: '7 menit',
    },
    {
      id: 3,
      title: '5 TIPS: Anak Muda Bijak Mengelola Keuangan',
      excerpt: 'Strategi pengelolaan keuangan untuk generasi milenial dan Gen Z. Mulai dari budgeting hingga investasi.',
      image: 'https://via.placeholder.com/300x200',
      category: 'tips',
      date: '30 April 2024',
      readTime: '4 menit',
    },
    {
      id: 4,
      title: 'Cara Menabung untuk Dana Darurat',
      excerpt: 'Mengapa dana darurat penting dan bagaimana cara mengumpulkannya secara efektif meski dengan penghasilan terbatas.',
      image: 'https://via.placeholder.com/300x200',
      category: 'saving',
      date: '25 April 2024',
      readTime: '6 menit',
    },
    {
      id: 5,
      title: 'Dasar-dasar Literasi Keuangan yang Perlu Diketahui',
      excerpt: 'Pelajari konsep dasar keuangan yang akan membantu Anda membuat keputusan finansial yang lebih baik setiap hari.',
      image: 'https://via.placeholder.com/300x200',
      category: 'basics',
      date: '20 April 2024',
      readTime: '8 menit',
    },
    {
      id: 6,
      title: 'Merencanakan Pensiun Sejak Muda',
      excerpt: 'Kenapa penting merencanakan pensiun sejak dini dan strategi apa yang bisa dilakukan untuk memastikan masa tua yang nyaman.',
      image: 'https://via.placeholder.com/300x200',
      category: 'planning',
      date: '15 April 2024',
      readTime: '7 menit',
    },
  ];
  
  const filteredArticles = activeCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === activeCategory);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Artikel Literasi Keuangan</h1>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-4 py-2 mx-2 mb-2 rounded-full ${
                  activeCategory === category.id
                    ? 'bg-secondary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                } transition-colors`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <div key={article.id} className="card hover:shadow-lg transition-shadow">
                <img 
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <span className="text-xs font-medium text-gray-500 mr-2">{article.date}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{article.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>
                  <button className="text-secondary font-medium hover:underline">
                    Baca selengkapnya
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <button className="h-8 w-8 rounded-full flex items-center justify-center border border-gray-300 text-gray-600 hover:bg-gray-100">
                1
              </button>
              <button className="h-8 w-8 rounded-full flex items-center justify-center border border-gray-300 text-gray-600 hover:bg-gray-100">
                2
              </button>
              <button className="h-8 w-8 rounded-full flex items-center justify-center border border-gray-300 text-gray-600 hover:bg-gray-100">
                3
              </button>
              <button className="h-8 w-8 rounded-full flex items-center justify-center border border-gray-300 text-gray-600 hover:bg-gray-100">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Articles;