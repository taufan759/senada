import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="container mx-auto min-h-screen flex items-center justify-center bg-gray px-4 font-sans">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Selamat datang di Senada</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: email@example.com"
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