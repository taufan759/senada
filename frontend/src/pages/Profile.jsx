import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
// Coba beberapa kemungkinan path untuk Sidebar:
// import Sidebar from '../components/Sidebar';     // Jika di src/components/Sidebar.jsx
// import Sidebar from '../components/Sidebar.js';  // Jika ekstensi .js
// import Sidebar from './Sidebar';                 // Jika di folder yang sama
// import Sidebar from '../Sidebar';                // Jika di src/Sidebar.jsx

// SEMENTARA: Kita gunakan AppLayout yang sudah ada di App.jsx
import AppLayout from '../components/AppLayouts';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    role: 'user'
  });
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    occupation: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    transactionAlerts: true,
    budgetReminders: true,
    investmentUpdates: false
  });
  const [preferences, setPreferences] = useState({
    currency: 'IDR',
    language: 'id',
    theme: 'light',
    dateFormat: 'dd/mm/yyyy'
  });

  useEffect(() => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const decoded = jwtDecode(token);
        const user = {
          name: decoded.name || '',
          email: decoded.email || '',
          role: decoded.role || 'user'
        };
        setUserInfo(user);
        setProfileData(prev => ({
          ...prev,
          name: user.name,
          email: user.email
        }));
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      navigate('/login');
    }
  }, [navigate]);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    alert('Profil berhasil diperbarui! 🎉');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Password baru tidak cocok!');
      return;
    }
    alert('Password berhasil diubah! 🔐');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const tabs = [
    { id: 'profile', name: 'Detail Profil', icon: '👤' },
    { id: 'security', name: 'Keamanan', icon: '🔐' },
    { id: 'notifications', name: 'Notifikasi', icon: '🔔' },
    { id: 'preferences', name: 'Preferensi', icon: '⚙️' },
    { id: 'subscription', name: 'Langganan', icon: '💎' }
  ];

  const getRoleDisplay = (role) => {
    const roles = {
      'admin': { text: 'Admin', color: 'bg-orange-500', icon: '🛡️' },
      'user': { text: 'Free Plan', color: 'bg-blue-500', icon: '👤' }
    };
    return roles[role] || roles['user'];
  };

  const roleInfo = getRoleDisplay(userInfo.role);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil & Pengaturan</h1>
          <p className="text-gray-600">Kelola informasi akun dan preferensi kamu</p>
        </div>

        {/* Profile Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 mb-8 text-white">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.name)}&background=ffffff&color=6366f1&size=80&rounded=true&bold=true`}
                alt="Profile"
                className="w-20 h-20 rounded-full ring-4 ring-white/30"
              />
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center">
                <span className="text-sm">📷</span>
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{userInfo.name}</h2>
              <p className="text-blue-200 mb-2">{userInfo.email}</p>
              <div className="flex items-center space-x-2">
                <span className="text-sm">{roleInfo.icon}</span>
                <span className={`text-xs px-3 py-1 rounded-full ${roleInfo.color} text-white font-medium`}>
                  {roleInfo.text}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-200 p-1 rounded-2xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden md:block">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          {activeTab === 'profile' && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Detail Profil</h3>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+62 812-3456-7890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Lahir</label>
                    <input
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pekerjaan</label>
                    <input
                      type="text"
                      value={profileData.occupation}
                      onChange={(e) => setProfileData({...profileData, occupation: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Software Engineer"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
                  <textarea
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Jl. Sudirman No. 123, Jakarta"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300"
                >
                  Simpan Perubahan
                </button>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Keamanan Akun</h3>
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password Saat Ini</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password Baru</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password Baru</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300"
                >
                  Ubah Password
                </button>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Pengaturan Notifikasi</h3>
              <div className="space-y-6">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {key === 'emailNotifications' && '📧 Email Notifications'}
                        {key === 'pushNotifications' && '📱 Push Notifications'}
                        {key === 'transactionAlerts' && '💰 Transaction Alerts'}
                        {key === 'budgetReminders' && '📊 Budget Reminders'}
                        {key === 'investmentUpdates' && '📈 Investment Updates'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {key === 'emailNotifications' && 'Terima notifikasi melalui email'}
                        {key === 'pushNotifications' && 'Terima notifikasi push di browser'}
                        {key === 'transactionAlerts' && 'Alert saat ada transaksi baru'}
                        {key === 'budgetReminders' && 'Pengingat batas anggaran'}
                        {key === 'investmentUpdates' && 'Update performa investasi'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange(key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Preferensi Aplikasi</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mata Uang</label>
                  <select
                    value={preferences.currency}
                    onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="IDR">Rupiah (IDR)</option>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bahasa</label>
                  <select
                    value={preferences.language}
                    onChange={(e) => handlePreferenceChange('language', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Format Tanggal</label>
                  <select
                    value={preferences.dateFormat}
                    onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                    <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                    <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subscription' && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Langganan & Billing</h3>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Free Plan</h4>
                    <p className="text-gray-600">Akses fitur dasar Senada</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    Aktif
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="border border-gray-200 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Pro Plan</h4>
                  <p className="text-gray-600 mb-4">Fitur lengkap untuk profesional</p>
                  <div className="text-2xl font-bold text-blue-600 mb-4">Rp 99.000<span className="text-sm text-gray-600">/bulan</span></div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      Unlimited transactions
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      Advanced analytics
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      Investment tracking
                    </li>
                  </ul>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors">
                    Upgrade ke Pro
                  </button>
                </div>
                
                <div className="border border-gray-200 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Business Plan</h4>
                  <p className="text-gray-600 mb-4">Untuk tim dan bisnis</p>
                  <div className="text-2xl font-bold text-indigo-600 mb-4">Rp 299.000<span className="text-sm text-gray-600">/bulan</span></div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      Team collaboration
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      API access
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      Priority support
                    </li>
                  </ul>
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium transition-colors">
                    Upgrade ke Business
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;