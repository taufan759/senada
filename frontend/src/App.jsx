import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register'
import Investment from './pages/Investment';
import Transaction from './pages/Transaction';
import ProtectedRoute from './components/ProtectedRoute';
import Budget from './pages/Budget';
import AppLayout from './components/AppLayouts';
import Articles from './pages/Articles';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/investment" element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <Investment />
          </ProtectedRoute>
        } />
        <Route path="/transactions" element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <Transaction />
          </ProtectedRoute>
        } />
        <Route path="/budget" element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <Budget />
          </ProtectedRoute>
        } />
        {/* Placeholder pages using AppLayout */}
        <Route path="/goals" element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <AppLayout>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold">Tujuan Keuangan - Coming Soon</h1>
              </div>
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <AppLayout>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold">Laporan - Coming Soon</h1>
              </div>
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <AppLayout>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold">Pengaturan - Coming Soon</h1>
              </div>
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
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
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;