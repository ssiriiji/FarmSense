// src/pages/Results.jsx
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp,
  DollarSign,
  Sprout,
  Calendar,
  MapPin,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Package,
  ShoppingBag,
  Leaf,
  Users
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useFarm } from '../context/FarmContext';

const Results = () => {
  const navigate = useNavigate();
  const { calculationResult } = useFarm();

  // ถ้าไม่มีข้อมูล redirect กลับไปหน้า calculator
  if (!calculationResult) {
    navigate('/calculator');
    return null;
  }

  const result = calculationResult;

  // ข้อมูลสำหรับกราฟเปรียบเทียบ
  const comparisonData = [
    {
      name: 'ปัจจุบัน',
      รายได้: Math.round(result.totalRevenue),
      ต้นทุน: Math.round(result.totalCost),
      กำไร: Math.round(result.profit)
    },
    {
      name: 'คาดการณ์',
      รายได้: Math.round(result.forecastRevenue),
      ต้นทุน: Math.round(result.totalCost),
      กำไร: Math.round(result.forecastProfit)
    }
  ];

  // ข้อมูลสำหรับกราฟต้นทุน (ถ้ามี costBreakdown)
  const costBreakdownData = result.costBreakdown ? [
    { name: 'เมล็ดพันธุ์', value: result.costBreakdown.seeds, icon: '🌱' },
    { name: 'ปุ๋ย', value: result.costBreakdown.fertilizer, icon: '🍃' },
    { name: 'ค่าแรง', value: result.costBreakdown.labor, icon: '👷' },
    { name: 'อื่นๆ', value: result.costBreakdown.other, icon: '📦' }
  ] : [];

  // ข้อมูลสำหรับกราฟแนวโน้มราคา (สมมติ)
  const priceData = [
    { month: 'ม.ค.', price: result.currentPrice * 0.95 },
    { month: 'ก.พ.', price: result.currentPrice * 0.97 },
    { month: 'มี.ค.', price: result.currentPrice },
    { month: 'เม.ย.', price: result.forecastPrice }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'excellent':
        return 'bg-green-50 border-green-500 text-green-800';
      case 'good':
        return 'bg-blue-50 border-blue-500 text-blue-800';
      case 'caution':
        return 'bg-yellow-50 border-yellow-500 text-yellow-800';
      default:
        return 'bg-gray-50 border-gray-500 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'excellent':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'good':
        return <AlertCircle className="w-8 h-8 text-blue-600" />;
      case 'caution':
        return <AlertTriangle className="w-8 h-8 text-yellow-600" />;
      default:
        return <AlertCircle className="w-8 h-8 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/calculator')}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-green-600" />
            <h1 className="text-xl font-bold text-gray-800">ผลการคำนวณ</h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <DollarSign className="w-10 h-10 opacity-80" />
              {result.profit > 0 ? (
                <TrendingUp className="w-8 h-8" />
              ) : (
                <AlertTriangle className="w-8 h-8" />
              )}
            </div>
            <p className="text-sm opacity-90 mb-1">กำไรสุทธิ</p>
            <p className="text-3xl font-bold mb-1">
              {result.profit > 0 ? '+' : ''}{Math.round(result.profit).toLocaleString()}
            </p>
            <p className="text-xs opacity-75">บาท</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <Sprout className="w-10 h-10 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">ผลผลิตรวม</p>
            <p className="text-3xl font-bold text-gray-800 mb-1">
              {Math.round(result.totalYield).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">กิโลกรัม</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-10 h-10 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">รายได้รวม</p>
            <p className="text-3xl font-bold text-gray-800 mb-1">
              {Math.round(result.totalRevenue).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">บาท</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-200">
            <div className="flex items-center justify-between mb-3">
              <Calendar className="w-10 h-10 text-orange-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">ระยะเวลา</p>
            <p className="text-3xl font-bold text-gray-800 mb-1">
              {result.duration}
            </p>
            <p className="text-xs text-gray-500">วัน</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Recommendation Alert */}
            <div className={`rounded-2xl border-2 p-6 shadow-lg ${getStatusColor(result.recommendation.status)}`}>
              <div className="flex items-start gap-4">
                {getStatusIcon(result.recommendation.status)}
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{result.recommendation.message}</h3>
                  <ul className="space-y-2">
                    {result.recommendation.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-lg">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Comparison Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-green-600" />
                เปรียบเทียบรายได้-ต้นทุน-กำไร
              </h3>
              
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 14, fontWeight: 'bold' }}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                    tickFormatter={(value) => (value / 1000).toFixed(0) + 'k'}
                  />
                  <Tooltip 
                    formatter={(value) => value.toLocaleString() + ' บาท'}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '2px solid #10b981',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="รายได้" fill="#10b981" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="ต้นทุน" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="กำไร" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Price Trend Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                แนวโน้มราคา (คาดการณ์)
              </h3>
              
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                    tickFormatter={(value) => (value / 1000).toFixed(1) + 'k'}
                  />
                  <Tooltip 
                    formatter={(value) => [value.toLocaleString() + ' บาท/ตัน', 'ราคา']}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '2px solid #3b82f6',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Cost Breakdown - ใหม่! */}
            {costBreakdownData.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                  รายละเอียดต้นทุน (ต่อไร่)
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {costBreakdownData.map((item, index) => (
                    <div key={index} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{item.icon}</span>
                        <span className="font-semibold text-gray-700">{item.name}</span>
                      </div>
                      <p className="text-2xl font-bold text-orange-600">
                        {item.value.toLocaleString()} บาท
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t-2 border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">รวมต้นทุนต่อไร่</span>
                    <span className="text-3xl font-bold text-orange-600">
                      {result.costPerRai.toLocaleString()} บาท
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - 1 column */}
          <div className="space-y-6">
            
            {/* Calculation Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">รายละเอียดการคำนวณ</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Sprout className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-1">พืชที่ปลูก</p>
                    <p className="font-semibold text-gray-800">{result.crop}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-1">พื้นที่</p>
                    <p className="font-semibold text-gray-800">{result.area} ไร่</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-1">ฤดูการปลูก</p>
                    <p className="font-semibold text-gray-800">
                      {result.season === 'main' ? 'นาปี' : 'นาปรัง'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-1">จังหวัด</p>
                    <p className="font-semibold text-gray-800">{result.province}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Sprout className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-1">ผลผลิตต่อไร่</p>
                    <p className="font-semibold text-gray-800">{result.yieldPerRai} กก.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-1">ราคาขายต่อกก.</p>
                    <p className="font-semibold text-gray-800">{result.pricePerKg.toFixed(2)} บาท</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cost & Revenue Card */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-6 border-2 border-blue-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">ต้นทุนและรายได้</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-blue-200">
                  <span className="text-sm text-gray-600">ต้นทุนต่อไร่</span>
                  <span className="font-bold text-orange-600">
                    {Math.round(result.costPerRai).toLocaleString()} บาท
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-blue-200">
                  <span className="text-sm text-gray-600">ต้นทุนรวม ({result.area} ไร่)</span>
                  <span className="font-bold text-red-600">
                    {Math.round(result.totalCost).toLocaleString()} บาท
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-blue-200">
                  <span className="text-sm text-gray-600">รายได้รวม</span>
                  <span className="font-bold text-green-600">
                    {Math.round(result.totalRevenue).toLocaleString()} บาท
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 bg-white rounded-lg px-3 mt-2">
                  <span className="font-semibold text-gray-800">กำไรสุทธิ</span>
                  <span className={`font-bold text-xl ${result.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {result.profit > 0 ? '+' : ''}{Math.round(result.profit).toLocaleString()} บาท
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">กำไรต่อไร่</span>
                  <span className={`font-bold ${result.profitPerRai > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.round(result.profitPerRai).toLocaleString()} บาท
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate('/calculator')}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-md hover:shadow-lg"
              >
                คำนวณใหม่
              </button>
              
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-gray-600 text-white py-3 rounded-xl font-bold hover:bg-gray-700 transition shadow-md hover:shadow-lg"
              >
                กลับหน้าหลัก
              </button>

              <button
                onClick={() => navigate('/price-trend')}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-md hover:shadow-lg"
              >
                ดูแนวโน้มราคา
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
