import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    name: 'User',
    email: '',
    role: 'user'
  });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = [
    { title: 'Dashboard', path: '/dashboard', icon: '🏠', gradient: 'from-blue-500 to-cyan-400' },
    { title: 'Transaksi', path: '/transactions', icon: '💰', gradient: 'from-green-500 to-emerald-400' },
    { title: 'Anggaran', path: '/budget', icon: '📊', gradient: 'from-purple-500 to-pink-400' },
    { title: 'Tujuan', path: '/goals', icon: '🎯', gradient: 'from-orange-500 to-red-400' },
    { title: 'Investasi', path: '/investment', icon: '📈', gradient: 'from-indigo-500 to-purple-400' },
    { title: 'Laporan', path: '/reports', icon: '📋', gradient: 'from-teal-500 to-cyan-400' },
  ];

  // Get user info from JWT token
  useEffect(() => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const decoded = jwtDecode(token);
        setUserInfo({
          name: decoded.name || 'User',
          email: decoded.email || '',
          role: decoded.role || 'user'
        });
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      handleLogout();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setUserInfo({
      name: 'User',
      email: '',
      role: 'user'
    });
    navigate('/login');
    setShowLogoutConfirm(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getRoleDisplay = (role) => {
    const roles = {
      'admin': { text: 'Admin', color: 'bg-orange-500', icon: '🛡️' },
      'user': { text: 'Free Plan', color: 'bg-blue-500', icon: '👤' }
    };
    return roles[role] || roles['user'];
  };

  const roleInfo = getRoleDisplay(userInfo.role);

  return (
    <>
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white w-72 min-h-screen flex flex-col shadow-2xl relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-cyan-500/10"></div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-tl from-cyan-400/20 to-blue-600/20 blur-3xl"></div>

        {/* Header */}
        <div className="relative z-10 p-6 border-b border-white/10 backdrop-blur-sm">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg">
              {/* <span className="text-2xl font-bold text-white">S</span> */}
              <img src="Asset 2.png" alt="" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
                SENADA
              </span>
              <p className="text-xs text-gray-300 -mt-1">Financial Manager</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-grow p-4 relative z-10">
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <div key={index} className="relative group">
                <Link
                  to={item.path}
                  className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 relative overflow-hidden ${isActive(item.path)
                    ? 'bg-white/20 backdrop-blur-md shadow-lg transform scale-105 border border-white/20'
                    : 'hover:bg-white/10 hover:backdrop-blur-md hover:transform hover:scale-102 hover:shadow-md'
                    }`}
                >
                  {/* Icon container */}
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300`}>
                    <span className="text-lg">{item.icon}</span>
                  </div>

                  {/* Text */}
                  <span className="font-medium text-white group-hover:text-blue-300 transition-colors duration-300">
                    {item.title}
                  </span>

                  {/* Active indicator */}
                  {isActive(item.path) && (
                    <div className="absolute right-3 w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
                  )}

                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-400/5 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                </Link>
              </div>
            ))}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="relative z-10 p-4 border-t border-white/10 backdrop-blur-sm">
          {/* Profile Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-3 border border-white/20 shadow-lg">
            <Link to="/profile" className="block group">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.name)}&background=6366f1&color=ffffff&size=40&rounded=true&bold=true`}
                    alt="User"
                    className="w-12 h-12 rounded-full ring-2 ring-blue-400/50 group-hover:ring-blue-400 transition-all duration-300"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-blue-900 animate-pulse"></div>
                </div>
                <div className="flex-grow">
                  <p className="font-semibold text-white group-hover:text-blue-300 transition-colors duration-300 truncate">
                    {userInfo.name}
                  </p>
                  <div className="flex items-center space-x-1 mt-1">
                    <span className="text-xs">{roleInfo.icon}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${roleInfo.color} text-white font-medium`}>
                      {roleInfo.text}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center space-x-3 p-4 rounded-2xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 transition-all duration-300 group backdrop-blur-md"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
              <span className="text-lg">🚪</span>
            </div>
            <span className="font-medium text-red-300 group-hover:text-red-200 transition-colors duration-300">
              Logout
            </span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 m-4 max-w-sm w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👋</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Yakin mau logout?
              </h3>
              <p className="text-gray-600 mb-6">
                Kamu akan keluar dari akun <strong>{userInfo.name}</strong>
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-medium text-gray-700 transition-colors duration-200"
                >
                  Batal
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-xl font-medium text-white transition-all duration-200 shadow-lg"
                >
                  Ya, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;