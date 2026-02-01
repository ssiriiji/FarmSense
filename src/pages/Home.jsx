// src/pages/Home.jsx
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useFarm } from '../context/FarmContext';

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useFarm();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            Farm<span className="text-green-600">Sense</span>
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <User className="w-5 h-5" />
              <span>สวัสดี, {user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              <LogOut className="w-4 h-4" />
              ออกจากระบบ
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">ยินดีต้อนรับ!</h3>
            <p className="text-gray-600">เริ่มวางแผนการเกษตรของคุณ</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
