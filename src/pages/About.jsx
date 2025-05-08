import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const About = () => {
  const teamMembers = [
    { 
      name: 'Nama Anggota 1', 
      role: 'ML Engineer', 
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      description: 'Bertanggung jawab dalam pengembangan model klasifikasi transaksi dan rekomendasi literasi keuangan.'
    },
    { 
      name: 'Nama Anggota 2', 
      role: 'ML Engineer', 
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      description: 'Bertanggung jawab dalam pengembangan model clustering dan prediksi pencapaian tujuan keuangan.'
    },
    { 
      name: 'Nama Anggota 3', 
      role: 'Backend Developer', 
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
      description: 'Bertanggung jawab dalam pengembangan API dan integrasi dengan model machine learning.'
    },
    { 
      name: 'Nama Anggota 4', 
      role: 'Frontend Developer', 
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
      description: 'Bertanggung jawab dalam pengembangan antarmuka pengguna yang intuitif dan responsif.'
    },
    { 
      name: 'Nama Anggota 5', 
      role: 'UI/UX Designer', 
      image: 'https://randomuser.me/api/portraits/men/3.jpg',
      description: 'Bertanggung jawab dalam merancang pengalaman pengguna dan tampilan visual aplikasi.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <section className="bg-primary text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">Tentang SENADA</h1>
            <p className="text-xl">
              Sistem Pencatatan dan Analisis Data Keuangan
            </p>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Kisah Kami</h2>
            
            <div className="max-w-3xl mx-auto">
              <p className="mb-4">
                SENADA (Sistem Pencatatan dan Analisis Data Keuangan) adalah aplikasi yang dirancang untuk mengatasi masalah rendahnya literasi keuangan, terutama di kalangan generasi muda.
              </p>
              <p className="mb-4">
                Berdasarkan data dari Otoritas Jasa Keuangan (OJK) tahun 2023, tingkat literasi keuangan untuk remaja sebesar 43,28%, lebih rendah dari tingkat literasi nasional (49,28%) sebagaimana dilaporkan dalam "Survei Nasional Literasi dan Inklusi Keuangan" (SNLIK).
              </p>
              <p className="mb-4">
                Rendahnya edukasi keuangan sejak dini, tekanan sosial, dan budaya konsumtif menyebabkan banyak generasi muda kesulitan mengelola keuangan pribadi. Itulah mengapa kami menciptakan SENADA.
              </p>
              <p className="mb-4">
                Aplikasi ini menawarkan solusi komprehensif melalui tiga fitur utama: Literasi Keuangan (konten edukasi yang dinamis), Personal Finance (pencatatan keuangan dan perencanaan untuk mencapai tujuan finansial), dan Investment Planner (panduan investasi sesuai profil risiko dan tujuan keuangan pengguna).
              </p>
              <p>
                Dengan dukungan machine learning, SENADA memberikan personalisasi melalui klasifikasi otomatis transaksi, clustering profil keuangan, prediksi pencapaian tujuan, deteksi anomali pengeluaran, rekomendasi investasi, dan analisis trend pengeluaran.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Tim Kami</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-64 object-cover object-center"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-secondary font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600">{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Visi & Misi</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              <div>
                <div className="bg-primary text-white p-4 rounded-lg mb-4">
                  <h3 className="text-xl font-bold">Visi</h3>
                </div>
                <p>
                  Menjadi platform keuangan personal terdepan yang membantu masyarakat Indonesia membangun keamanan finansial dan kemandirian ekonomi melalui literasi keuangan dan pengelolaan dana yang bijak.
                </p>
              </div>
              
              <div>
                <div className="bg-secondary text-white p-4 rounded-lg mb-4">
                  <h3 className="text-xl font-bold">Misi</h3>
                </div>
                <ul className="text-left space-y-2">
                  <li>• Meningkatkan literasi keuangan di kalangan generasi muda</li>
                  <li>• Menyediakan platform pencatatan keuangan yang mudah digunakan</li>
                  <li>• Membantu pengguna mencapai tujuan keuangan dengan pendekatan berbasis data</li>
                  <li>• Memberikan rekomendasi investasi yang sesuai dengan profil risiko pengguna</li>
                  <li>• Mendorong budaya menabung dan berinvestasi sejak dini</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;