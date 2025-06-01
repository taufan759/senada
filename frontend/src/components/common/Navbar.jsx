
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isActive = (path) => {
    return location.pathname === path ? 'text-secondary font-medium' : 'text-white';
  };

  return (
    <nav className="bg-primary">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/src/assets/images/logo.svg" alt="SENADA" className="h-8 w-8" />
            <span className="text-white text-xl font-bold">SENADA</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`${isActive('/')} hover:text-secondary transition-colors`}>
              Beranda
            </Link>
            <Link to="/dashboard" className={`${isActive('/dashboard')} hover:text-secondary transition-colors`}>
              Dashboard
            </Link>
            <Link to="/personal-finance" className={`${isActive('/personal-finance')} hover:text-secondary transition-colors`}>
              Keuangan Pribadi
            </Link>
            <Link to="/investment" className={`${isActive('/investment')} hover:text-secondary transition-colors`}>
              Investasi
            </Link>
            <Link to="/articles" className={`${isActive('/articles')} hover:text-secondary transition-colors`}>
              Artikel
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-700">
            <Link to="/" className="block py-2 text-white hover:text-secondary">
              Beranda
            </Link>
            <Link to="/dashboard" className="block py-2 text-white hover:text-secondary">
              Dashboard
            </Link>
            <Link to="/personal-finance" className="block py-2 text-white hover:text-secondary">
              Keuangan Pribadi
            </Link>
            <Link to="/investment" className="block py-2 text-white hover:text-secondary">
              Investasi
            </Link>
            <Link to="/articles" className="block py-2 text-white hover:text-secondary">
              Artikel
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;