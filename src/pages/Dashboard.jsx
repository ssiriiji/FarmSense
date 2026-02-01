// src/pages/Dashboard.jsx
import { useNavigate } from 'react-router-dom';
import { 
  CloudRain, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  ArrowRight,
  Sprout,
  Bell,
  User,
  LogOut,
  Menu
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { mockWeatherData } from '../data/weather';
import { mockMarketPrices } from '../data/marketPrices';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useFarm();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = (trend) => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sprout className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl font-bold">
                Farm<span className="text-green-600">Sense</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-6 h-6 text-gray-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <User className="w-6 h-6 text-gray-700" />
                </button>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">ออกจากระบบ</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">ภาพรวมวันนี้</h2>
          <p className="text-gray-600">{mockWeatherData.current.date}</p>
        </div>

        {/* Weather Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CloudRain className="w-12 h-12" />
                <div>
                  <h3 className="text-4xl font-bold">{mockWeatherData.current.temperature}°C</h3>
                  <p className="text-blue-100">{mockWeatherData.current.condition}</p>
                </div>
              </div>
              <div className="flex gap-6 mt-4 text-sm">
                <div>
                  <p className="text-blue-100">ความชื้น</p>
                  <p className="font-semibold">{mockWeatherData.current.humidity}%</p>
                </div>
                <div>
                  <p className="text-blue-100">ปริมาณฝน</p>
                  <p className="font-semibold">{mockWeatherData.current.rainfall} มม.</p>
                </div>
              </div>
            </div>
            
            {/* Forecast */}
            <div className="hidden lg:flex gap-4">
              {mockWeatherData.forecast.map((day, index) => (
                <div key={index} className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                  <p className="text-sm mb-2">{day.date}</p>
                  <p className="text-2xl font-bold mb-1">{day.temp}°</p>
                  <p className="text-xs text-blue-100">{day.condition}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Market Prices Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-800">ราคาตลาดวันนี้</h3>
            <button 
              onClick={() => navigate('/calculator')}
              className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
            >
              เลือกพืชเพื่อคำนวณ
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockMarketPrices.map((item) => (
              <div 
                key={item.id}
                onClick={() => navigate('/calculator', { state: { selectedCrop: item.cropId } })}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer group"
              >
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.crop}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                      item.trend === 'up' ? 'bg-green-500' : 
                      item.trend === 'down' ? 'bg-red-500' : 
                      'bg-gray-500'
                    } text-white text-xs font-semibold`}>
                      {getTrendIcon(item.trend)}
                      {item.changePercent !== 0 && `${Math.abs(item.changePercent)}%`}
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{item.crop}</h4>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {item.price.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">บาท/{item.unit}</p>
                    </div>
                    <p className="text-xs text-gray-400">{item.lastUpdate}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/calculator')}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition text-left group"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition">
              <Sprout className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-2">วางแผนการปลูก</h4>
            <p className="text-sm text-gray-600">คำนวณผลผลิตและกำไรที่คาดหวัง</p>
          </button>

          <button
            onClick={() => navigate('/price-trend')}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition text-left group"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-2">ดูแนวโน้มราคา</h4>
            <p className="text-sm text-gray-600">วิเคราะห์ราคาย้อนหลัง 5 ปี</p>
          </button>

          <button
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition text-left group"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition">
              <CloudRain className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-800 mb-2">พยากรณ์อากาศ</h4>
            <p className="text-sm text-gray-600">ดูพยากรณ์อากาศ 7 วันข้างหน้า</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
