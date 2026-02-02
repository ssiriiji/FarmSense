// src/pages/WeatherForecast.jsx
import { useState } from 'react';
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
  AlertCircle,
  Info,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { weatherForecast } from '../data/weatherForecast';

const WeatherForecast = () => {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(weatherForecast.forecast[0]);

  // เตรียมข้อมูลสำหรับกราฟ
  const tempChartData = weatherForecast.forecast.map(day => ({
    date: day.date,
    high: day.tempHigh,
    low: day.tempLow,
    avg: (day.tempHigh + day.tempLow) / 2
  }));

  const rainChartData = weatherForecast.forecast.map(day => ({
    date: day.date,
    chance: day.rainChance,
    humidity: day.humidity
  }));

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
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
          <div className="ml-auto flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">{weatherForecast.location}</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Current Weather - Hero Section */}
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl shadow-2xl p-6 md:p-12 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                <Calendar className="w-4 h-4 md:w-5 md:h-5 opacity-90" />
                <p className="text-sm md:text-lg opacity-90">{weatherForecast.current.date} - {selectedDay.day}</p>
              </div>
              <h2 className="text-5xl md:text-8xl font-bold mb-2 md:mb-4">
                {selectedDay.tempHigh}°C
              </h2>
              <p className="text-xl md:text-2xl mb-1 md:mb-2 opacity-90">{selectedDay.condition}</p>
              <p className="text-base md:text-lg opacity-75">ต่ำสุด {selectedDay.tempLow}°C</p>
            </div>
            
            <div className="text-6xl md:text-9xl">{selectedDay.icon}</div>
            
            <div className="grid grid-cols-3 md:grid-cols-2 gap-3 md:gap-6 w-full md:w-auto">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4 text-center">
                <Droplets className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2" />
                <p className="text-xs md:text-sm opacity-90">ความชื้น</p>
                <p className="text-xl md:text-2xl font-bold">{selectedDay.humidity}%</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4 text-center">
                <CloudRain className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2" />
                <p className="text-xs md:text-sm opacity-90">โอกาสฝน</p>
                <p className="text-xl md:text-2xl font-bold">{selectedDay.rainChance}%</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4 text-center col-span-3 md:col-span-2">
                <Wind className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2" />
                <p className="text-xs md:text-sm opacity-90">ความเร็วลม</p>
                <p className="text-xl md:text-2xl font-bold">{weatherForecast.current.windSpeed} กม./ชม.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 7-Day Forecast Cards */}
        <div className="mb-8">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            พยากรณ์อากาศ 7 วัน
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
            {weatherForecast.forecast.map((day, index) => (
              <div
                key={index}
                onClick={() => setSelectedDay(day)}
                className={`bg-white rounded-xl p-3 md:p-4 shadow-lg cursor-pointer transition-all hover:shadow-xl hover:scale-105 ${
                  selectedDay.date === day.date ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
              >
                <p className="text-xs md:text-sm font-semibold text-gray-600 mb-1">{day.day}</p>
                <p className="text-[10px] md:text-xs text-gray-500 mb-2 md:mb-3">{day.date}</p>
                <div className="text-3xl md:text-4xl mb-2 md:mb-3 text-center">{day.icon}</div>
                <div className="text-center">
                  <p className="text-xl md:text-2xl font-bold text-gray-800">{day.tempHigh}°</p>
                  <p className="text-xs md:text-sm text-gray-500">{day.tempLow}°</p>
                </div>
                <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-1 text-blue-600">
                    <CloudRain className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="text-xs font-semibold">{day.rainChance}%</span>
                  </div>
                  <p className="text-[10px] md:text-xs text-gray-600 mt-1 text-center truncate">{day.rainStatus}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Temperature Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
              <span className="text-sm md:text-base">แนวโน้มอุณหภูมิ 7 วัน</span>
            </h3>
            
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={tempChartData}>
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
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10 }}
                  stroke="#6b7280"
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  stroke="#6b7280"
                  domain={[20, 40]}
                  label={{ value: '°C', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }}
                />
                <Tooltip 
                  formatter={(value) => [value + '°C']}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '2px solid #3b82f6',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="high" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  fill="url(#colorHigh)"
                  name="อุณหภูมิสูงสุด"
                />
                <Area 
                  type="monotone" 
                  dataKey="low" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fill="url(#colorLow)"
                  name="อุณหภูมิต่ำสุด"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Rain & Humidity Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center gap-2">
              <CloudRain className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              <span className="text-sm md:text-base">โอกาสฝนและความชื้น</span>
            </h3>
            
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={rainChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10 }}
                  stroke="#6b7280"
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  stroke="#6b7280"
                  label={{ value: '%', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }}
                />
                <Tooltip 
                  formatter={(value) => [value + '%']}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '2px solid #3b82f6',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="chance" fill="#3b82f6" radius={[8, 8, 0, 0]} name="โอกาสฝน" />
                <Bar dataKey="humidity" fill="#06b6d4" radius={[8, 8, 0, 0]} name="ความชื้น" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* El Niño / La Niña Section */}
        <div className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 rounded-2xl shadow-lg p-6 md:p-8 border-2 border-orange-200 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange-100 p-2 md:p-3 rounded-xl">
              <span className="text-3xl md:text-4xl">🌊</span>
            </div>
            <div>
              <h3 className="text-lg md:text-2xl font-bold text-gray-800">สภาวะเอลนีโญ/ลานีญา (ENSO)</h3>
              <p className="text-xs md:text-sm text-gray-600">El Niño-Southern Oscillation</p>
            </div>
          </div>

          {/* Current Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 md:p-5 border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <span className="text-2xl md:text-3xl">🌧️</span>
                <div>
                  <p className="text-[10px] md:text-xs text-gray-600">สภาวะก่อนหน้า</p>
                  <p className="text-sm md:text-base font-bold text-gray-800">{weatherForecast.enso.previousStatusThai}</p>
                </div>
              </div>
              <p className="text-xs md:text-sm text-gray-600">{weatherForecast.enso.status}</p>
            </div>

            <div className="bg-white rounded-xl p-4 md:p-5 border-2 border-green-200">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <span className="text-2xl md:text-3xl">⚖️</span>
                <div>
                  <p className="text-[10px] md:text-xs text-gray-600">สภาวะปัจจุบัน</p>
                  <p className="text-sm md:text-base font-bold text-gray-800">{weatherForecast.enso.currentStatusThai}</p>
                </div>
              </div>
              <p className="text-xs md:text-sm text-gray-600">อยู่ในช่วงเปลี่ยนผ่าน</p>
            </div>

            <div className="bg-white rounded-xl p-4 md:p-5 border-2 border-red-200">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <span className="text-2xl md:text-3xl">🔥</span>
                <div>
                  <p className="text-[10px] md:text-xs text-gray-600">แนวโน้ม</p>
                  <p className="text-sm md:text-base font-bold text-gray-800">{weatherForecast.enso.trendThai}</p>
                </div>
              </div>
              <p className="text-xs md:text-sm text-gray-600">{weatherForecast.enso.forecast}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl p-4 md:p-6 mb-6">
            <h4 className="text-sm md:text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
              ช่วงเวลาการเปลี่ยนแปลง
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {weatherForecast.enso.timeline.map((item, index) => (
                <div key={index} className="relative">
                  <div className={`rounded-lg p-3 md:p-4 border-2 ${
                    item.status === 'la-nina' ? 'bg-blue-50 border-blue-300' :
                    item.status === 'neutral' ? 'bg-gray-50 border-gray-300' :
                    'bg-red-50 border-red-300'
                  }`}>
                    <div className="text-center mb-2 md:mb-3">
                      <span className="text-3xl md:text-4xl">{item.icon}</span>
                    </div>
                    <p className="text-[10px] md:text-xs text-gray-600 text-center mb-1">{item.period}</p>
                    <p className="text-sm md:text-base font-bold text-center text-gray-800 mb-2">{item.statusThai}</p>
                    <p className="text-[10px] md:text-xs text-gray-600 text-center">{item.description}</p>
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
          <div className={`rounded-xl p-4 md:p-6 border-2 ${
            weatherForecast.enso.impact.severity === 'danger' ? 'bg-red-50 border-red-300' :
            weatherForecast.enso.impact.severity === 'warning' ? 'bg-orange-50 border-orange-300' :
            'bg-blue-50 border-blue-300'
          }`}>
            <div className="flex items-start gap-3 md:gap-4">
              <div className="text-4xl md:text-5xl">{weatherForecast.enso.impact.icon}</div>
              <div className="flex-1">
                <h4 className="text-base md:text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <AlertCircle className={`w-4 h-4 md:w-5 md:h-5 ${
                    weatherForecast.enso.impact.severity === 'danger' ? 'text-red-600' :
                    weatherForecast.enso.impact.severity === 'warning' ? 'text-orange-600' :
                    'text-blue-600'
                  }`} />
                  {weatherForecast.enso.impact.title}
                </h4>
                <p className="text-sm md:text-base text-gray-700 font-semibold mb-3">
                  {weatherForecast.enso.impact.description}
                </p>
                <ul className="space-y-2">
                  {weatherForecast.enso.impact.details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs md:text-sm text-gray-700">
                      <span className="text-orange-500 font-bold mt-0.5">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations for Farmers */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 mb-8">
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center gap-2">
            <Sun className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            คำแนะนำสำหรับเกษตรกร
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {weatherForecast.recommendations.map((rec, index) => (
              <div
                key={index}
                className={`${getRecommendationStyle(rec.type)} rounded-xl p-4 md:p-5 border-2 transition-all hover:shadow-md`}
              >
                <div className="flex items-start gap-2 md:gap-3 mb-2 md:mb-3">
                  <div className="text-2xl md:text-3xl">{rec.icon}</div>
                  <div className="flex-1">
                    {rec.date && (
                      <p className="text-[10px] md:text-xs font-semibold mb-1">{rec.date}</p>
                    )}
                    <h4 className="text-sm md:text-lg font-bold mb-1">{rec.title}</h4>
                  </div>
                  <div className="flex-shrink-0">
                    {getRecommendationIcon(rec.type)}
                  </div>
                </div>
                <p className="text-xs md:text-sm leading-relaxed">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Detail Table - Hidden on Mobile */}
        <div className="hidden md:block bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">ตารางรายละเอียดพยากรณ์อากาศ</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">วันที่</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-700">สภาพอากาศ</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-700">อุณหภูมิสูง/ต่ำ</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-700">โอกาสฝน</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-700">สภาพฝน</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-700">ความชื้น</th>
                </tr>
              </thead>
              <tbody>
                {weatherForecast.forecast.map((day, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-blue-50 transition">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-semibold text-gray-800">{day.date}</p>
                        <p className="text-sm text-gray-500">{day.day}</p>
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
                      <span className="text-sm text-gray-700">{day.rainStatus}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-cyan-600">
                        <Droplets className="w-4 h-4" />
                        <span className="font-semibold">{day.humidity}%</span>
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