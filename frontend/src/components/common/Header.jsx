import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-primary text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className="font-bold text-2xl">SENADA</span>
          </Link>

          <div className="flex items-center">
            <Link to="/login" className="flex items-center space-x-1">
              <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
                <span className="text-sm font-medium">U</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;