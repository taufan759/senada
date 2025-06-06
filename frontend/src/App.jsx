import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register'
import Investment from './pages/Investment';
import Transaction from './pages/Transaction';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/investment" element={<Investment />} />
        <Route path="/transactions" element={<Transaction />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;