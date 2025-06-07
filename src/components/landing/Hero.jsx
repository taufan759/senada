import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-primary to-primary-light text-white">
      <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">SENADA Money</h1>
          <p className="text-lg mb-6">
            Catatkan semua data keuangan pribadimu. 
            Analisis pola keuangan dan akhiri urahura keuangan.
          </p>
          <Link to="/dashboard" className="btn btn-primary">
            Mulai Sekarang
          </Link>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img 
            src="/src/assets/images/hero-image.png" 
            alt="SENADA Money App" 
            className="rounded-lg shadow-lg max-w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;