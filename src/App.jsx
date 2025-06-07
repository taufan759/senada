import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register'
import Investment from './pages/Investment';
import Transaction from './pages/Transaction';
import Budget from './pages/Budget';
import AppLayout from './components/AppLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/investment" element={<Investment />} />
        <Route path="/transactions" element={<Transaction />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/budget" element={<Budget />} />
        {/* Placeholder pages using AppLayout */}
        <Route path="/goals" element={
          <AppLayout>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold">Tujuan Keuangan - Coming Soon</h1>
            </div>
          </AppLayout>
        } />
        <Route path="/reports" element={
          <AppLayout>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold">Laporan - Coming Soon</h1>
            </div>
          </AppLayout>
        } />
        <Route path="/settings" element={
          <AppLayout>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold">Pengaturan - Coming Soon</h1>
            </div>
          </AppLayout>
        } />
        <Route path="/profile" element={
          <AppLayout>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-bold">Profile</h1>
              <div className="mt-6 flex items-center space-x-4">
                <img
                  src="https://randomuser.me/api/portraits/men/1.jpg"
                  alt="User"
                  className="h-20 w-20 rounded-full"
                />
                <div>
                  <p className="text-xl font-medium">John Doe</p>
                  <p className="text-gray-600">john.doe@example.com</p>
                  <p className="text-sm text-gray-500">Free Plan</p>
                </div>
              </div>
            </div>
          </AppLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;