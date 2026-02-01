// src/pages/PriceTrend.jsx
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  BarChart3,
  Info
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { cropsData } from '../data/crops';

const PriceTrend = () => {
  const navigate = useNavigate();
  const cropData = cropsData.rice;

  // ข้อมูลราคาย้อนหลัง 5 ปี
  const priceHistory = cropData.historicalPrices;

  // คำนวณสถิติ
  const currentPrice = priceHistory[priceHistory.length - 1].price;
  const previousPrice = priceHistory[priceHistory.length - 2].price;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = ((priceChange / previousPrice) * 100).toFixed(2);

  const averagePrice = Math.round(
    priceHistory.reduce((sum, item) => sum + item.price, 0) / priceHistory.length
  );

  const minPrice = Math.min(...priceHistory.map(item => item.price));
  const maxPrice = Math.max(...priceHistory.map(item => item.price));
  const minYear = priceHistory.find(item => item.price === minPrice).year;
  const maxYear = priceHistory.find(item => item.price === maxPrice).year;

  // คำนวณอัตราการเติบโตเฉลี่ยต่อปี
  const firstPrice = priceHistory[0].price;
  const lastPrice = priceHistory[priceHistory.length - 1].price;
  const years = priceHistory.length - 1;
  const cagr = (((lastPrice / firstPrice) ** (1 / years)) - 1) * 100;
  
  // คำนวณราคาเพิ่มขึ้นรวม
  const totalIncrease = lastPrice - firstPrice;

  // เตรียมข้อมูลสำหรับกราฟ
  const chartData = priceHistory.map(item => ({
    year: item.year.toString(),
    price: item.price,
    displayYear: item.year.toString() // ใช้ ค.ศ. ตรงๆ
  }));

  // ข้อมูลเปรียบเทียบปีต่อปี
  const yearToYearData = priceHistory.slice(1).map((item, index) => {
    const change = item.price - priceHistory[index].price;
    return {
      year: item.year.toString(),
      displayYear: item.year.toString(),
      change: change,
      changePercent: ((change / priceHistory[index].price) * 100).toFixed(2)
    };
  });

  return (
    <div className="min-h-screen bg-gray-50">
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
            <BarChart3 className="w-6 h-6 text-green-600" />
            <h1 className="text-xl font-bold text-gray-800">แนวโน้มราคา - ข้าว</h1>
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
              {priceChange > 0 ? (
                <TrendingUp className="w-8 h-8" />
              ) : (
                <TrendingDown className="w-8 h-8" />
              )}
            </div>
            <p className="text-sm opacity-90 mb-1">ราคาปี 2567</p>
            <p className="text-3xl font-bold mb-1">
              {currentPrice.toLocaleString()}
            </p>
            <p className="text-xs opacity-75">บาท/ตัน</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-10 h-10 text-blue-600" />
              <span className={`text-2xl font-bold ${priceChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {priceChange > 0 ? '+' : ''}{priceChangePercent}%
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">เปลี่ยนแปลงจากปีก่อน</p>
            <p className="text-2xl font-bold text-gray-800">
              {priceChange > 0 ? '+' : ''}{priceChange.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">บาท</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <BarChart3 className="w-10 h-10 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">ราคาเฉลี่ย 5 ปี</p>
            <p className="text-3xl font-bold text-gray-800">
              {averagePrice.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">บาท/ตัน</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-200">
            <div className="flex items-center justify-between mb-3">
              <Calendar className="w-10 h-10 text-orange-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">อัตราเติบโตเฉลี่ย/ปี</p>
            <p className="text-3xl font-bold text-orange-600">
              +{cagr.toFixed(2)}%
            </p>
            <p className="text-xs text-gray-500">CAGR</p>
          </div>
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Line Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              แนวโน้มราคา 2563 - 2567
            </h3>
            
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="displayYear" 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                  domain={[10000, 16000]}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip 
                  formatter={(value) => [value.toLocaleString() + ' บาท/ตัน', 'ราคา']}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '2px solid #10b981',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fill="url(#colorPrice)"
                  dot={{ fill: '#10b981', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart - การเปลี่ยนแปลงปีต่อปี */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              การเปลี่ยนแปลงปีต่อปี
            </h3>
            
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={yearToYearData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="displayYear" 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip 
                  formatter={(value) => [
                    (value > 0 ? '+' : '') + value.toLocaleString() + ' บาท',
                    'เปลี่ยนแปลง'
                  ]}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '2px solid #3b82f6',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="change" 
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Price History Table */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">ตารางราคาย้อนหลัง 5 ปี</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">ปี (พ.ศ.)</th>
                  <th className="text-right py-4 px-4 font-semibold text-gray-700">ราคา (บาท/ตัน)</th>
                  <th className="text-right py-4 px-4 font-semibold text-gray-700">เปลี่ยนแปลง</th>
                  <th className="text-right py-4 px-4 font-semibold text-gray-700">% เปลี่ยนแปลง</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-700">แนวโน้ม</th>
                </tr>
              </thead>
              <tbody>
                {priceHistory.map((item, index) => {
                  const prevPrice = index > 0 ? priceHistory[index - 1].price : null;
                  const change = prevPrice ? item.price - prevPrice : 0;
                  const changePercent = prevPrice ? ((change / prevPrice) * 100).toFixed(2) : 0;
                  
                  return (
                    <tr key={item.year} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="py-4 px-4 font-medium">{item.year}</td>
                      <td className="py-4 px-4 text-right font-bold text-lg">
                        {item.price.toLocaleString()}
                      </td>
                      <td className={`py-4 px-4 text-right font-semibold ${
                        change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {index > 0 ? (change > 0 ? '+' : '') + change.toLocaleString() : '-'}
                      </td>
                      <td className={`py-4 px-4 text-right font-semibold ${
                        change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {index > 0 ? (change > 0 ? '+' : '') + changePercent + '%' : '-'}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {index > 0 && (
                          change > 0 ? (
                            <TrendingUp className="w-6 h-6 text-green-600 mx-auto" />
                          ) : change < 0 ? (
                            <TrendingDown className="w-6 h-6 text-red-600 mx-auto" />
                          ) : (
                            <div className="w-6 h-0.5 bg-gray-400 mx-auto"></div>
                          )
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
            <div className="flex items-start gap-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Info className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-1">ข้อมูลเชิงลึก</h4>
                <p className="text-sm text-gray-600">จากข้อมูล 5 ปีที่ผ่านมา (2563-2567)</p>
              </div>
            </div>
            
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>ราคาข้าวเพิ่มขึ้นอย่างต่อเนื่องทุกปี ตั้งแต่ปี 2563-2567</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>อัตราการเติบโตเฉลี่ยอยู่ที่ {cagr.toFixed(2)}% ต่อปี</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>ราคาสูงสุดในรอบ 5 ปี คือ {maxPrice.toLocaleString()} บาท/ตัน (ปี {maxYear})</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>ราคาต่ำสุดในรอบ 5 ปี คือ {minPrice.toLocaleString()} บาท/ตัน (ปี {minYear})</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>ราคาเพิ่มขึ้นรวม {totalIncrease.toLocaleString()} บาท ใน 5 ปี</span>
              </li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
            <div className="flex items-start gap-3 mb-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-1">คำแนะนำ</h4>
                <p className="text-sm text-gray-600">สำหรับการวางแผนการผลิต</p>
              </div>
            </div>
            
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>แนวโน้มราคาเป็นบวกอย่างต่อเนื่อง เหมาะสำหรับการลงทุนปลูกข้าว</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>ควรวางแผนการผลิตล่วงหน้า โดยคาดการณ์ราคาจะเพิ่มขึ้นต่อเนื่อง</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>พิจารณาเก็บสต็อกผลผลิตหากราคามีแนวโน้มเพิ่มขึ้น</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>ติดตามข่าวสารและปัจจัยที่มีผลต่อราคาอย่างสม่ำเสมอ</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>การเติบโตของราคาเฉลี่ย {cagr.toFixed(2)}%/ปี สูงกว่าอัตราเงินเฟ้อ</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceTrend;
