import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Cloud,
  CloudRain,
  Sun,
  Droplets,
  Wind,
  MapPin,
  Calendar,
  TrendingUp,
  Loader,
  AlertCircle,
  Navigation,
  Sunrise,
  Sunset,
  Eye,
  Gauge,
  Info,
  AlertTriangle,
  ArrowRight,
  Search,
  X
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { weatherService, translateWeatherCondition } from '../services/weatherService';
import { weatherForecast } from '../data/weatherForecast';


const WeatherForecast = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [city, setCity] = useState('Bangkok');
  const [searchInput, setSearchInput] = useState('');


  // ฟังก์ชันโหลดข้อมูล
  const loadWeatherData = async (cityName = 'Bangkok') => {
    try {
      setLoading(true);
      setError(null);
      
      const [current, forecastData] = await Promise.all([
        weatherService.getCurrentWeather(cityName),
        weatherService.getForecast(cityName)
      ]);
      
      setCurrentWeather(current);
      setForecast(forecastData);
      setSelectedDay(forecastData[0]);
      setCity(current.name);
    } catch (err) {
      setError('ไม่สามารถโหลดข้อมูลอากาศได้ กรุณาตรวจสอบชื่อเมืองหรือ API Key');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  // ฟังก์ชันใช้ตำแหน่งปัจจุบัน
  const useCurrentLocation = async () => {
    try {
      setLoading(true);
      const data = await weatherService.getCurrentLocation();
      setCity(data.name);
      await loadWeatherData(data.name);
    } catch (err) {
      alert('ไม่สามารถเข้าถึงตำแหน่งได้ กรุณาอนุญาตการเข้าถึงตำแหน่ง');
      setLoading(false);
    }
  };


  // โหลดข้อมูลครั้งแรก
  useEffect(() => {
    loadWeatherData();
  }, []);


  // ค้นหาเมือง
  const handleSearch = (e) => {
    e.preventDefault();
    console.log('🔍 Searching for:', searchInput);
    
    if (searchInput.trim()) {
      loadWeatherData(searchInput.trim());
      setSearchInput('');
    } else {
      alert('กรุณาใส่ชื่อเมืองที่ต้องการค้นหา (ภาษาอังกฤษ)');
    }
  };


  // แปลงเวลา Unix เป็นชั่วโมง:นาที
  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  // แปลงวันที่
  const getDayName = (dateString) => {
    const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    const [day, month] = dateString.split('/');
    const year = new Date().getFullYear();
    const date = new Date(`${year}-${month}-${day}`);
    return days[date.getDay()];
  };


  const getRecommendationStyle = (type) => {
    switch(type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'danger':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };


  const getRecommendationIcon = (type) => {
    switch(type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'danger':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">กำลังโหลดข้อมูลอากาศ...</p>
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">เกิดข้อผิดพลาด</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => loadWeatherData()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            ลองอีกครั้ง
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div className="flex items-center gap-2">
              <Cloud className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-800">พยากรณ์อากาศ</h1>
            </div>
            
            {/* Search Bar - แก้ไขแล้ว */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearch(e);
                      }
                    }}
                    placeholder="ค้นหาเมือง... (เช่น Bangkok, Chiang Mai)"
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => setSearchInput('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">ค้นหา</span>
                </button>
              </div>
            </form>


            <button
              onClick={useCurrentLocation}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Navigation className="w-4 h-4" />
              <span className="hidden sm:inline">ตำแหน่งของฉัน</span>
            </button>
          </div>
        </div>
      </nav>


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Current Weather Hero */}
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                <MapPin className="w-5 h-5" />
                <p className="text-lg font-semibold">{city}, {currentWeather.sys.country}</p>
              </div>
              <h2 className="text-7xl font-bold mb-4">
                {Math.round(currentWeather.main.temp)}°C
              </h2>
              <p className="text-2xl mb-2">{translateWeatherCondition(currentWeather.weather[0].description)}</p>
              <p className="text-lg opacity-90">รู้สึกเหมือน {Math.round(currentWeather.main.feels_like)}°C</p>
            </div>
            
            <div className="text-8xl">
              {selectedDay?.icon || '🌈'}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Droplets className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm">ความชื้น</p>
                <p className="text-2xl font-bold">{currentWeather.main.humidity}%</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Wind className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm">ลม</p>
                <p className="text-2xl font-bold">{(currentWeather.wind.speed * 3.6).toFixed(1)} km/h</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Gauge className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm">ความกดอากาศ</p>
                <p className="text-xl font-bold">{currentWeather.main.pressure} hPa</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Eye className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm">ทัศนวิสัย</p>
                <p className="text-xl font-bold">{(currentWeather.visibility / 1000).toFixed(1)} km</p>
              </div>
            </div>
          </div>


          {/* Sunrise/Sunset */}
          <div className="mt-6 pt-6 border-t border-white/30 grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <Sunrise className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-80">พระอาทิตย์ขึ้น</p>
                <p className="text-lg font-bold">{formatTime(currentWeather.sys.sunrise)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Sunset className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-80">พระอาทิตย์ตก</p>
                <p className="text-lg font-bold">{formatTime(currentWeather.sys.sunset)}</p>
              </div>
            </div>
          </div>
        </div>


        {/* 7-Day Forecast - แก้ไขแล้ว */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            พยากรณ์อากาศ 7 วัน
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {forecast.map((day, index) => (
              <div
                key={index}
                onClick={() => setSelectedDay(day)}
                className={`bg-white rounded-xl p-4 shadow-lg cursor-pointer transition-all hover:shadow-xl hover:scale-105 ${
                  selectedDay?.date === day.date ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
              >
                <p className="text-sm font-semibold text-gray-600 mb-1 truncate">{getDayName(day.date)}</p>
                <p className="text-xs text-gray-500 mb-3">{day.date}</p>
                <div className="text-4xl mb-3 text-center">{day.icon}</div>
                <div className="text-center mb-3">
                  <p className="text-2xl font-bold text-orange-600">{day.tempHigh}°</p>
                  <p className="text-sm text-blue-600">{day.tempLow}°</p>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-1 text-blue-600 mb-2">
                    <CloudRain className="w-4 h-4" />
                    <span className="text-xs font-semibold">{day.rainChance}%</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-gray-600">
                    <Droplets className="w-3 h-3" />
                    <span className="text-xs">{day.humidity}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-orange-600" />
              แนวโน้มอุณหภูมิ 7 วัน
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={forecast}>
                <defs>
                  <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
                <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                <Tooltip />
                <Area type="monotone" dataKey="tempHigh" stroke="#f97316" strokeWidth={2} fill="url(#colorHigh)" name="สูงสุด" />
                <Area type="monotone" dataKey="tempLow" stroke="#3b82f6" strokeWidth={2} fill="url(#colorLow)" name="ต่ำสุด" />
              </AreaChart>
            </ResponsiveContainer>
          </div>


          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <CloudRain className="w-6 h-6 text-blue-600" />
              โอกาสฝนและความชื้น
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={forecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
                <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="rainChance" fill="#3b82f6" radius={[8, 8, 0, 0]} name="โอกาสฝน %" />
                <Bar dataKey="humidity" fill="#06b6d4" radius={[8, 8, 0, 0]} name="ความชื้น %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>


        {/* El Niño / La Niña Section */}
        <div className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 rounded-2xl shadow-lg p-8 border-2 border-orange-200 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange-100 p-3 rounded-xl">
              <span className="text-4xl">🌊</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">สภาวะเอลนีโญ/ลานีญา (ENSO)</h3>
              <p className="text-sm text-gray-600">El Niño-Southern Oscillation</p>
            </div>
          </div>


          {/* Current Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-5 border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl">🌧️</span>
                <div>
                  <p className="text-xs text-gray-600">สภาวะก่อนหน้า</p>
                  <p className="text-base font-bold text-gray-800">{weatherForecast.enso.previousStatusThai}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">{weatherForecast.enso.status}</p>
            </div>


            <div className="bg-white rounded-xl p-5 border-2 border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl">⚖️</span>
                <div>
                  <p className="text-xs text-gray-600">สภาวะปัจจุบัน</p>
                  <p className="text-base font-bold text-gray-800">{weatherForecast.enso.currentStatusThai}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">อยู่ในช่วงเปลี่ยนผ่าน</p>
            </div>


            <div className="bg-white rounded-xl p-5 border-2 border-red-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl">🔥</span>
                <div>
                  <p className="text-xs text-gray-600">แนวโน้ม</p>
                  <p className="text-base font-bold text-gray-800">{weatherForecast.enso.trendThai}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">{weatherForecast.enso.forecast}</p>
            </div>
          </div>


          {/* Timeline */}
          <div className="bg-white rounded-xl p-6 mb-6">
            <h4 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              ช่วงเวลาการเปลี่ยนแปลง
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {weatherForecast.enso.timeline.map((item, index) => (
                <div key={index} className="relative">
                  <div className={`rounded-lg p-4 border-2 ${
                    item.status === 'la-nina' ? 'bg-blue-50 border-blue-300' :
                    item.status === 'neutral' ? 'bg-gray-50 border-gray-300' :
                    'bg-red-50 border-red-300'
                  }`}>
                    <div className="text-center mb-3">
                      <span className="text-4xl">{item.icon}</span>
                    </div>
                    <p className="text-xs text-gray-600 text-center mb-1">{item.period}</p>
                    <p className="text-base font-bold text-center text-gray-800 mb-2">{item.statusThai}</p>
                    <p className="text-xs text-gray-600 text-center">{item.description}</p>
                  </div>
                  {index < weatherForecast.enso.timeline.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 transform translate-x-1/2 -translate-y-1/2">
                      <ArrowRight className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>


          {/* Impact Section */}
          <div className={`rounded-xl p-6 border-2 ${
            weatherForecast.enso.impact.severity === 'danger' ? 'bg-red-50 border-red-300' :
            weatherForecast.enso.impact.severity === 'warning' ? 'bg-orange-50 border-orange-300' :
            'bg-blue-50 border-blue-300'
          }`}>
            <div className="flex items-start gap-4">
              <div className="text-5xl">{weatherForecast.enso.impact.icon}</div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <AlertCircle className={`w-5 h-5 ${
                    weatherForecast.enso.impact.severity === 'danger' ? 'text-red-600' :
                    weatherForecast.enso.impact.severity === 'warning' ? 'text-orange-600' :
                    'text-blue-600'
                  }`} />
                  {weatherForecast.enso.impact.title}
                </h4>
                <p className="text-base text-gray-700 font-semibold mb-3">
                  {weatherForecast.enso.impact.description}
                </p>
                <ul className="space-y-2">
                  {weatherForecast.enso.impact.details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-orange-500 font-bold mt-0.5">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>


        {/* Recommendations */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Sun className="w-6 h-6 text-green-600" />
            คำแนะนำสำหรับเกษตรกร
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {weatherForecast.recommendations.map((rec, index) => (
              <div
                key={index}
                className={`${getRecommendationStyle(rec.type)} rounded-xl p-5 border-2 transition-all hover:shadow-md`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-3xl">{rec.icon}</div>
                  <div className="flex-1">
                    {rec.date && (
                      <p className="text-xs font-semibold mb-1">{rec.date}</p>
                    )}
                    <h4 className="text-lg font-bold mb-1">{rec.title}</h4>
                  </div>
                  <div className="flex-shrink-0">
                    {getRecommendationIcon(rec.type)}
                  </div>
                </div>
                <p className="text-sm leading-relaxed">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>


        {/* Detail Table */}
        <div className="hidden md:block bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">ตารางรายละเอียดพยากรณ์อากาศ</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">วันที่</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-700">สภาพอากาศ</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-700">อุณหภูมิสูง/ต่ำ</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-700">โอกาสฝน</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-700">ความชื้น</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-700">ความเร็วลม</th>
                </tr>
              </thead>
              <tbody>
                {forecast.map((day, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-blue-50 transition">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-semibold text-gray-800">{day.date}</p>
                        <p className="text-sm text-gray-500">{getDayName(day.date)}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-3xl">{day.icon}</span>
                        <span className="text-xs text-gray-600">{day.condition}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <p className="text-lg font-bold text-orange-600">{day.tempHigh}°C</p>
                      <p className="text-sm text-blue-600">{day.tempLow}°C</p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${
                        day.rainChance > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <CloudRain className="w-4 h-4" />
                        <span className="font-semibold">{day.rainChance}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-cyan-600">
                        <Droplets className="w-4 h-4" />
                        <span className="font-semibold">{day.humidity}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-600">
                        <Wind className="w-4 h-4" />
                        <span className="font-semibold">{day.windSpeed} km/h</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};


export default WeatherForecast;
