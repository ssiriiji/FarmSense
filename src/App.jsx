// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FarmProvider } from './context/FarmContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Calculator from './pages/Calculator';
import Results from './pages/Results';
import PriceTrend from './pages/PriceTrend';
import WeatherForecast from './pages/WeatherForecast'; // เพิ่มบรรทัดนี้

function App() {
  return (
    <FarmProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/results" element={<Results />} />
          <Route path="/price-trend" element={<PriceTrend />} />
          <Route path="/weather" element={<WeatherForecast />} /> {/* เพิ่มบรรทัดนี้ */}
        </Routes>
      </Router>
    </FarmProvider>
  );
}

export default App;
