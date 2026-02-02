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
  Menu,
  Cloud,
  AlertTriangle,
  CheckCircle,
  Newspaper,
  ExternalLink
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { mockWeatherData } from '../data/weather';
import { mockMarketPrices } from '../data/marketPrices';
import { agricultureNews } from '../data/news';

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

  const getCategoryColor = (category) => {
    switch(category) {
      case 'นโยบาย':
        return 'bg-blue-100 text-blue-700';
      case 'ราคาสินค้า':
        return 'bg-green-100 text-green-700';
      case 'เทคโนโลยี':
        return 'bg-purple-100 text-purple-700';
      case 'สภาพอากาศ':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
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

        {/* Weather Card - Mini Version (Green Theme) */}
        <div className="mb-8">
          <div 
            onClick={() => navigate('/weather')}
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg cursor-pointer hover:shadow-2xl transform hover:scale-[1.01] transition duration-200"
          >
            {/* Current Weather */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <CloudRain className="w-10 h-10" />
                <div>
                  <h3 className="text-3xl font-bold">{mockWeatherData.current.temperature}°C</h3>
                  <p className="text-sm text-green-100">{mockWeatherData.current.condition}</p>
                </div>
                <div className="hidden md:flex gap-4 text-xs ml-6">
                  <div>
                    <p className="text-green-100">ความชื้น</p>
                    <p className="font-semibold">{mockWeatherData.current.humidity}%</p>
                  </div>
                  <div>
                    <p className="text-green-100">ปริมาณฝน</p>
                    <p className="font-semibold">{mockWeatherData.current.rainfall} มม.</p>
                  </div>
                </div>
              </div>
              
              {/* Forecast - Mini */}
              <div className="hidden lg:flex gap-2">
                {mockWeatherData.forecast.slice(0, 4).map((day, index) => (
                  <div key={index} className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center min-w-[60px]">
                    <p className="text-[10px] mb-1">{day.date}</p>
                    <p className="text-lg font-bold">{day.temp}°</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ENSO Status - Single Line (Hidden on Mobile) */}
            <div className="hidden md:flex items-center justify-between pt-4 border-t border-white/30">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌊</span>
                <p className="text-xs font-semibold">ENSO:</p>
              </div>

              <div className="flex items-center gap-2 flex-1 justify-center">
                <div className="flex items-center gap-1 bg-white/15 rounded-full px-3 py-1 hover:bg-white/20 transition">
                  <span className="text-sm">🌧️</span>
                  <p className="text-xs">ลานีญา</p>
                  <CheckCircle className="w-3 h-3 text-green-300" />
                </div>

                <div className="flex items-center gap-1 bg-white/25 rounded-full px-3 py-1 border border-white/40 hover:bg-white/30 transition">
                  <span className="text-sm">⚖️</span>
                  <p className="text-xs font-semibold">เป็นกลาง</p>
                </div>

                <div className="flex items-center gap-1 bg-orange-500/40 rounded-full px-3 py-1 border border-orange-300/60 hover:bg-orange-500/50 transition">
                  <span className="text-sm">🔥</span>
                  <p className="text-xs font-semibold">→ เอลนีโญ</p>
                  <AlertTriangle className="w-3 h-3 text-orange-200" />
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs opacity-75 hover:opacity-100 transition">
                <span>ดูเพิ่ม</span>
                <ArrowRight className="w-3 h-3" />
              </div>
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
                <div className="relative h-40 overflow-hidden bg-gradient-to-br from-green-100 to-green-200">
                  {item.image && item.image.startsWith('http') ? (
                    <img 
                      src={item.image} 
                      alt={item.crop}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `
                          <div class="flex items-center justify-center h-full">
                            <span class="text-6xl">${item.emoji || '🌾'}</span>
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-6xl">{item.image || item.emoji || '🌾'}</span>
                    </div>
                  )}
                  
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

        {/* Agriculture News Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Newspaper className="w-6 h-6 text-blue-600" />
              ข่าวสารเกษตรกร
            </h3>
            <button 
              onClick={() => window.open('https://www.prachachat.net/economy', '_blank')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              ดูข่าวทั้งหมด
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {agricultureNews.map((news) => (
              <a
                key={news.id}
                href={news.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition group"
              >
                <div className="relative h-40 overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100">
                  {news.image.startsWith('http') ? (
                    <img 
                      src={news.image} 
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `
                          <div class="flex items-center justify-center h-full bg-gradient-to-br from-blue-100 to-cyan-100">
                            <span class="text-6xl">📰</span>
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-6xl group-hover:scale-110 transition duration-300">{news.image}</span>
                    </div>
                  )}
                  
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(news.category)}`}>
                      {news.category}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2 bg-white/80 rounded-full p-1">
                    <ExternalLink className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition">
                    {news.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {news.description}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{news.source}</span>
                    <span>{news.date}</span>
                  </div>
                </div>
              </a>
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
            onClick={() => navigate('/weather')}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition text-left group"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition">
              <Cloud className="w-6 h-6 text-purple-600" />
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
