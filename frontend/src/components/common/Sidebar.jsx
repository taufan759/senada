import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { title: 'Dashboard', path: '/dashboard', icon: 'chart-pie' },
    { title: 'Transaksi', path: '/transactions', icon: 'receipt-refund' },
    { title: 'Anggaran', path: '/budget', icon: 'cash' },
    { title: 'Tujuan', path: '/goals', icon: 'flag' },
    { title: 'Investasi', path: '/investment', icon: 'trending-up' },
    { title: 'Laporan', path: '/reports', icon: 'document-report' },
    { title: 'Pengaturan', path: '/settings', icon: 'cog' },
  ];
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-primary text-white w-64 min-h-screen flex flex-col">
      <div className="p-4 border-b border-primary-light">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/src/assets/images/logo.svg" alt="SENADA" className="h-8 w-8" />
          <span className="text-xl font-bold">SENADA</span>
        </Link>
      </div>
      
      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 p-3 rounded-lg ${
                  isActive(item.path)
                    ? 'bg-secondary text-white'
                    : 'hover:bg-primary-light'
                } transition-colors`}
              >
                <span className="text-lg">
                  <i className={`fas fa-${item.icon}`}></i>
                </span>
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-primary-light">
        <div className="flex items-center space-x-3">
          <img
            src="https://randomuser.me/api/portraits/men/1.jpg"
            alt="User"
            className="h-10 w-10 rounded-full"
          />
          <div>
            <p className="font-medium">John Doe</p>
            <p className="text-sm text-gray-300">Free Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;