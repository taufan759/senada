import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import AppLayout from '../components/AppLayouts';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
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

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:3000/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (response.ok) {
        alert('Profil berhasil diperbarui! 🎉');
        // Update userInfo jika diperlukan
        setUserInfo(prev => ({
          ...prev,
          name: profileData.name,
          email: profileData.email
        }));
      } else {
        alert(`Error: ${data.msg || data.message}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Gagal memperbarui profil. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Password baru tidak cocok!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password baru minimal 6 karakter!');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:3000/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Password berhasil diubah! 🔐');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        alert(`Error: ${data.msg || data.message}`);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Gagal mengubah password. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDisplay = (role) => {
    const roles = {
      'admin': { text: 'Admin', color: 'bg-orange-500', icon: '🛡️' },
      'user': { text: 'User', color: 'bg-blue-500', icon: '👤' }
    };
    return roles[role] || roles['user'];
  };

  const roleInfo = getRoleDisplay(userInfo.role);

  // Mobile Tab Component
  const MobileTab = ({ id, label, icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center justify-center p-3 rounded-lg transition-all duration-300 ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'bg-white text-gray-600 hover:bg-gray-50'
      }`}
    >
      <span className="text-lg mr-2">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  return (
    <AppLayout>
      {/* MOBILE FIRST DESIGN */}
      <div className="p-4 space-y-4">
        
        {/* Header */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Profil & Pengaturan</h1>
          <p className="text-sm text-gray-600">Kelola informasi akun dan keamanan kamu</p>
        </div>

        {/* Profile Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.name)}&background=ffffff&color=6366f1&size=60&rounded=true&bold=true`}
                alt="Profile"
                className="w-15 h-15 rounded-full ring-4 ring-white/30"
              />
              <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center">
                <span className="text-xs">📷</span>
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold">{userInfo.name}</h2>
              <p className="text-blue-200 text-sm mb-2">{userInfo.email}</p>
              <div className="flex items-center space-x-2">
                <span className="text-sm">{roleInfo.icon}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${roleInfo.color} text-white font-medium`}>
                  {roleInfo.text}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="grid grid-cols-2 gap-2">
          <MobileTab
            id="profile"
            label="Detail Profil"
            icon="👤"
            isActive={activeTab === 'profile'}
            onClick={setActiveTab}
          />
          <MobileTab
            id="security"
            label="Keamanan"
            icon="🔐"
            isActive={activeTab === 'security'}
            onClick={setActiveTab}
          />
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          {activeTab === 'profile' && (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-lg">👤</span>
                <h3 className="text-lg font-bold text-gray-900">Detail Profil</h3>
              </div>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="+62 812-3456-7890"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pekerjaan</label>
                  <input
                    type="text"
                    value={profileData.occupation}
                    onChange={(e) => setProfileData({...profileData, occupation: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Software Engineer"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                  <textarea
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Jl. Sudirman No. 123, Jakarta"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-medium transition-colors text-sm"
                >
                  {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-lg">🔐</span>
                <h3 className="text-lg font-bold text-gray-900">Keamanan Akun</h3>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <div className="flex items-start">
                  <span className="text-yellow-600 mr-2">⚠️</span>
                  <p className="text-sm text-yellow-800">
                    Pastikan password baru minimal 6 karakter dan berbeda dari password lama.
                  </p>
                </div>
              </div>
              
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password Saat Ini</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    minLength={6}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    minLength={6}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-medium transition-colors text-sm"
                >
                  {isLoading ? 'Mengubah...' : 'Ubah Password'}
                </button>
              </form>

              {/* Security Tips */}
              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">💡 Tips Keamanan</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Gunakan kombinasi huruf besar, kecil, angka, dan simbol</li>
                  <li>• Jangan gunakan password yang sama di aplikasi lain</li>
                  <li>• Ganti password secara berkala (3-6 bulan sekali)</li>
                  <li>• Jangan bagikan password kepada siapapun</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;