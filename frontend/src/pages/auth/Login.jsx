import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppSettings from "../../AppSettings";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const login = await fetch(`${AppSettings.api}/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!login.ok) {
        const error = await login.json();
        throw new Error(error.message || "Login failed");
      }

      const { accessToken } = await login.json();
      localStorage.setItem('accessToken', accessToken);

      navigate('/dashboard');

    } catch (error) {
      console.error("Error during login:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-cyan-500/10"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-md mx-4 relative z-10">
        {/* Header Card */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">S</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
              SENADA
            </h1>
          </div>
          <p className="text-blue-200 text-lg">Kelola keuangan dengan mudah</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Selamat Datang Kembali! 👋</h2>
            <p className="text-blue-200">Masuk ke akun Senada kamu</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-lg">📧</span>
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                  placeholder="nama@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-blue-200 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-lg">🔐</span>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                  placeholder="Masukkan password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-300 hover:text-blue-200 transition-colors"
                >
                  <span className="text-lg">{showPassword ? "🙈" : "👁️"}</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                  <span>Masuk...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Masuk ke Senada</span>
                  <span>🚀</span>
                </div>
              )}
            </button>
          </form>

          <div className="text-center mt-8 pt-6 border-t border-white/10">
            <p className="text-blue-200">
              Belum punya akun?{' '}
              <Link 
                to="/register" 
                className="text-blue-300 hover:text-blue-200 font-semibold transition-colors duration-300"
              >
                Daftar gratis di sini 🎉
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="text-center mt-6">
          <p className="text-blue-300 text-sm">
            Dengan masuk, kamu setuju dengan syarat & ketentuan kami
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login;