import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppSettings from "../../AppSettings";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const login = await fetch(`${AppSettings.api}/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!login.ok) {
        error = await login.json();
        throw new Error(error.message || "Login failed");
      }

      // menyimpan token akses ke localStorage
      const { accessToken } = await login.json();
      localStorage.setItem('accessToken', accessToken);

      navigate('/dashboard');

    } catch (error) {
      console.error("Error during login:", error);
    }
  }
  return (
    <div className="container mx-auto min-h-screen flex items-center justify-center bg-gray px-4 font-sans">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Selamat datang di Senada</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: email@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-medium text-gray-700">
              Kata Sandi
            </label>
            <input
              type="password"
              id="password"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan kata sandi anda"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-900 hover:bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Login
          </button>

          {/* Link untuk daftar akun baru */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Belum punya akun?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Daftar gratis
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login;