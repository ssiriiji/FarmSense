// src/pages/Results.jsx
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Sprout,
  Calendar,
  MapPin,
  LineChart as LineChartIcon
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { cropsData } from '../data/crops';

const Results = () => {
  const navigate = useNavigate();
  const { calculationResult } = useFarm();

  if (!calculationResult) {
    navigate('/calculator');
    return null;
  }

  const result = calculationResult;
  const cropData = cropsData[result.cropId];

  // เตรียมข้อมูลกราฟราคาย้อนหลัง
  const priceHistoryData = cropData.historicalPrices.map(item => ({
    year: item.year.toString(),
    price: item.price
  }));

  // เตรียมข้อมูลกราฟเปรียบเทียบ
  const comparisonData = [
    {
      name: 'รายได้',
      ปัจจุบัน: Math.round(result.totalRevenue),
      คาดการณ์: Math.round(result.forecastRevenue)
    },
    {
      name: 'ต้นทุน',
      ปัจจุบัน: Math.round(result.totalCost),
      คาดการณ์: Math.round(result.totalCost)
    },
    {
      name: 'กำไร',
      ปัจจุบัน: Math.round(result.profit),
      คาดการณ์: Math.round(result.forecastProfit)
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-300';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'caution': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'excellent': return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'good': return <CheckCircle className="w-6 h-6 text-blue-600" />;
      case 'caution': return <AlertCircle className="w-6 h-6 text-yellow-600" />;
      default: return <AlertCircle className="w-6 h-6 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/calculator')}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h1 className="text-xl font-bold text-gray-800">ผลการคำนวณ</h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
            <DollarSign className="w-10 h-10 mb-3 opacity-80" />
            <p className="text-sm opacity-90 mb-1">กำไรสุทธิ</p>
            <p className="text-3xl font-bold">
              {result.profit > 0 ? '+' : ''}{Math.round(result.profit).toLocaleString()}
            </p>
            <p className="text-xs opacity-75 mt-1">บาท</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-200">
            <Sprout className="w-10 h-10 mb-3 text-blue-600" />
            <p className="text-sm text-gray-600 mb-1">ผลผลิตรวม</p>
            <p className="text-3xl font-bold text-gray-800">
              {Math.round(result.totalYield).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">กก.</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-200">
            <TrendingUp className="w-10 h-10 mb-3 text-purple-600" />
            <p className="text-sm text-gray-600 mb-1">รายได้</p>
            <p className="text-3xl font-bold text-gray-800">
              {Math.round(result.totalRevenue).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">บาท</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-200">
            <Calendar className="w-10 h-10 mb-3 text-orange-600" />
            <p className="text-sm text-gray-600 mb-1">ระยะเวลา</p>
            <p className="text-3xl font-bold text-gray-800">
              {result.duration}
            </p>
            <p className="text-xs text-gray-500 mt-1">วัน</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* คำแนะนำ */}
            <div className={`rounded-xl p-6 shadow-lg border-2 ${getStatusColor(result.recommendation.status)}`}>
              <div className="flex items-start gap-4 mb-4">
                {getStatusIcon(result.recommendation.status)}
                <div>
                  <h3 className="text-xl font-bold mb-2">{result.recommendation.message}</h3>
                  <p className="text-sm opacity-90">
                    การปลูก{result.crop} พื้นที่ {result.area} ไร่ จังหวัด{result.province}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                {result.recommendation.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* กราฟเปรียบเทียบ */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <LineChartIcon className="w-6 h-6 text-green-600" />
                เปรียบเทียบราคาปัจจุบันและคาดการณ์
              </h3>
              
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => value.toLocaleString() + ' บาท'}
                  />
                  <Bar dataKey="ปัจจุบัน" fill="#10b981" />
                  <Bar dataKey="คาดการณ์" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* กราฟราคาย้อนหลัง */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-6">แนวโน้มราคาย้อนหลัง</h3>
              
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={priceHistoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => value.toLocaleString() + ' บาท/ตัน'}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* รายละเอียดการคำนวณ */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-6">รายละเอียด</h3>
              
              <div className="space-y-4">
                <div className="pb-3 border-b">
                  <p className="text-sm text-gray-600 mb-1">พืชที่ปลูก</p>
                  <p className="font-bold text-lg">{result.crop}</p>
                </div>

                <div className="pb-3 border-b">
                  <p className="text-sm text-gray-600 mb-1">พื้นที่</p>
                  <p className="font-bold text-lg">{result.area} ไร่</p>
                </div>

                <div className="pb-3 border-b">
                  <p className="text-sm text-gray-600 mb-1">ฤดูการปลูก</p>
                  <p className="font-semibold">{result.season === 'main' ? 'นาปี' : 'นาปรัง'}</p>
                </div>

                <div className="pb-3 border-b">
                  <p className="text-sm text-gray-600 mb-1">จังหวัด</p>
                  <p className="font-semibold">{result.province}</p>
                </div>

                <div className="pb-3 border-b">
                  <p className="text-sm text-gray-600 mb-1">ผลผลิตต่อไร่</p>
                  <p className="font-semibold">{result.yieldPerRai} กก./ไร่</p>
                </div>

                <div className="pb-3 border-b">
                  <p className="text-sm text-gray-600 mb-1">ราคาปัจจุบัน</p>
                  <p className="font-semibold text-green-600">
                    {result.currentPrice.toLocaleString()} บาท/ตัน
                  </p>
                </div>

                <div className="pb-3 border-b">
                  <p className="text-sm text-gray-600 mb-1">ราคาคาดการณ์</p>
                  <p className="font-semibold text-blue-600">
                    {Math.round(result.forecastPrice).toLocaleString()} บาท/ตัน
                  </p>
                </div>
              </div>
            </div>

            {/* ต้นทุนและรายได้ */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-6">ต้นทุนและรายได้</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">ต้นทุนต่อไร่</span>
                  <span className="font-semibold">{result.costPerRai.toLocaleString()} บาท</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">ค่าแรง</span>
                  <span className="font-semibold">{result.laborCost.toLocaleString()} บาท</span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t-2">
                  <span className="font-medium">ต้นทุนรวม</span>
                  <span className="font-bold text-red-600">
                    {Math.round(result.totalCost).toLocaleString()} บาท
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t-2">
                  <span className="font-medium">รายได้รวม</span>
                  <span className="font-bold text-green-600">
                    {Math.round(result.totalRevenue).toLocaleString()} บาท
                  </span>
                </div>

                <div className="flex justify-between items-center pt-3 border-t-2 border-gray-400">
                  <span className="font-bold text-lg">กำไรสุทธิ</span>
                  <span className={`font-bold text-xl ${result.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {result.profit > 0 ? '+' : ''}{Math.round(result.profit).toLocaleString()} บาท
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-gray-600">กำไรต่อไร่</span>
                  <span className="font-semibold text-green-600">
                    {Math.round(result.profitPerRai).toLocaleString()} บาท/ไร่
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => navigate('/calculator')}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                คำนวณใหม่
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                กลับหน้าหลัก
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
