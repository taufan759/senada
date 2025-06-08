import { useState } from "react";
import { Link } from "react-router-dom";
import AppSettings from "../../AppSettings";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${AppSettings.api}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
      console.log("Response:", response);
      if (!response.ok) {
        throw new Error("Gagal mendaftar, silakan coba lagi.");
      }

      const data = await response.json();
      console.log("Pendaftaran berhasil:", data);
      alert("Pendaftaran berhasil! Silakan masuk.");

    } catch (error) {
      console.error("Error during registration:", error);
      alert(error.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 font-sans">
      <div className="container mx-auto w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Daftar akun baru</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block mb-1 font-medium text-gray-700">
              Nama Lengkap
            </label>
            <input type="text" id="name"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan nama lengkapmu"
              onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
              Email
            </label>
            <input type="email" id="email"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: email@example.com"
              onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-medium text-gray-700">
              Kata Sandi
            </label>
            <input type="password" id="password"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan kata sandi anda"
              onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block mb-1 font-medium text-gray-700">
              Kata Sandi
            </label>
            <input type="password" id="confirm-password"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan kata sandi anda"
              onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>

          <button type="submit"
            className="w-full bg-blue-900 hover:bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
            Register
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            sudah punya akun? {''}
            <Link to="/login" className="text-blue-600 hover:underline">
              Masuk
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register;
