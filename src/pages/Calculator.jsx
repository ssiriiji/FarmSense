// src/pages/Calculator.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Sprout, 
  ArrowLeft, 
  Calculator as CalcIcon,
  TrendingUp,
  Droplets,
  Thermometer,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { cropsData } from '../data/crops';

const Calculator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCalculationResult } = useFarm();
  
  const selectedCropFromDashboard = location.state?.selectedCrop || 'rice';
  
  const [formData, setFormData] = useState({
    crop: selectedCropFromDashboard,
    area: '',
    season: '',
    province: ''
  });

  const cropInfo = cropsData[formData.crop] || cropsData.rice;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const area = parseFloat(formData.area);
    const yieldPerRai = cropInfo.cultivation.yieldPerRai;
    const pricePerKg = cropInfo.prices.daily.price / 1000;
    const costPerRai = cropInfo.cultivation.costPerRai;
    const laborCost = cropInfo.cultivation.laborCost;
    
    const totalYield = area * yieldPerRai;
    const totalRevenue = totalYield * pricePerKg;
    const totalCost = area * (costPerRai + laborCost);
    const profit = totalRevenue - totalCost;
    const profitPerRai = profit / area;
    
    const forecastPrice = cropInfo.prices.daily.price * 1.05;
    const forecastRevenue = totalYield * (forecastPrice / 1000);
    const forecastProfit = forecastRevenue - totalCost;
    
    const result = {
      crop: cropInfo.name,
      cropId: formData.crop,
      area: area,
      season: formData.season,
      province: formData.province,
      yieldPerRai: yieldPerRai,
      totalYield: totalYield,
      costPerRai: costPerRai,
      laborCost: laborCost,
      totalCost: totalCost,
      currentPrice: cropInfo.prices.daily.price,
      pricePerKg: pricePerKg,
      totalRevenue: totalRevenue,
      profit: profit,
      profitPerRai: profitPerRai,
      forecastPrice: forecastPrice,
      forecastRevenue: forecastRevenue,
      forecastProfit: forecastProfit,
      recommendation: generateRecommendation(profit, area, cropInfo),
      duration: cropInfo.cultivation.duration,
      climate: cropInfo.climate
    };
    
    setCalculationResult(result);
    navigate('/results');
  };

  const generateRecommendation = (profit, area, cropInfo) => {
    const profitPerRai = profit / area;
    
    let recommendation = {
      status: '',
      message: '',
      suggestions: []
    };
    
    if (profitPerRai > 5000) {
      recommendation.status = 'excellent';
      recommendation.message = 'ผลกำไรคาดว่าจะดีมาก แนะนำให้ปลูก';
      recommendation.suggestions = [
        'ราคาตลาดอยู่ในเกณฑ์ดี',
        'ควรเตรียมการปลูกในช่วง ' + cropInfo.cultivation.season,
        'คาดว่าจะได้กำไรต่อไร่ประมาณ ' + Math.round(profitPerRai).toLocaleString() + ' บาท'
      ];
    } else if (profitPerRai > 3000) {
      recommendation.status = 'good';
      recommendation.message = 'ผลกำไรอยู่ในเกณฑ์ดี';
      recommendation.suggestions = [
        'สามารถปลูกได้ แต่ควรติดตามราคาตลาด',
        'พิจารณาลดต้นทุนการผลิตเพื่อเพิ่มกำไร',
        'อาจพิจารณาปลูกพืชหมุนเวียนเพื่อกระจายความเสี่ยง'
      ];
    } else {
      recommendation.status = 'caution';
      recommendation.message = 'ควรพิจารณาอีกครั้ง';
      recommendation.suggestions = [
        'กำไรอาจไม่คุ้มค่ากับการลงทุน',
        'ควรรอให้ราคาตลาดดีขึ้น',
        'พิจารณาเลือกปลูกพืชอื่นแทน'
      ];
    }
    
    return recommendation;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <CalcIcon className="w-6 h-6 text-green-600" />
            <h1 className="text-xl font-bold text-gray-800">คำนวณผลผลิต</h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Form Section - ฝั่งซ้าย (3 คอลัมน์) */}
          <div className="lg:col-span-3 space-y-6">
            {/* ฟอร์มหลัก */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">กรอกข้อมูลการปลูก</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* เลือกพืช */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Sprout className="w-4 h-4 text-green-600" />
                    ประเภทพืช
                  </label>
                  <select
                    value={formData.crop}
                    onChange={(e) => setFormData({...formData, crop: e.target.value})}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition font-medium bg-white hover:border-gray-300"
                    required
                  >
                    <option value="rice">ข้าว 🌾</option>
                    <option value="cassava" disabled>มันสำปะหลัง (เร็วๆ นี้)</option>
                    <option value="corn" disabled>ข้าวโพด (เร็วๆ นี้)</option>
                  </select>
                </div>

                {/* พื้นที่ */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <MapPin className="w-4 h-4 text-green-600" />
                    พื้นที่ปลูก (ไร่)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.area}
                    onChange={(e) => setFormData({...formData, area: e.target.value})}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition hover:border-gray-300"
                    placeholder="เช่น 10"
                    required
                  />
                </div>

                {/* ฤดูการปลูก */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Calendar className="w-4 h-4 text-green-600" />
                    ฤดูการปลูก
                  </label>
                  <select
                    value={formData.season}
                    onChange={(e) => setFormData({...formData, season: e.target.value})}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition font-medium bg-white hover:border-gray-300"
                    required
                  >
                    <option value="">เลือกฤดูการปลูก</option>
                    <option value="main">นาปี (มิถุนายน - พฤศจิกายน)</option>
                    <option value="second">นาปรัง (มกราคม - เมษายน)</option>
                  </select>
                </div>

                {/* จังหวัด */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    จังหวัด
                  </label>
                  <input
                    type="text"
                    value={formData.province}
                    onChange={(e) => setFormData({...formData, province: e.target.value})}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition hover:border-gray-300"
                    placeholder="เช่น สุพรรณบุรี"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transform hover:scale-[1.02] transition duration-200 shadow-lg hover:shadow-xl"
                >
                  คำนวณผลผลิต
                </button>
              </form>
            </div>

            {/* ข้อมูลราคาและผลผลิต */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5" />
                  <p className="text-sm font-medium opacity-90">ราคาวันนี้</p>
                </div>
                <p className="text-3xl font-bold mb-1">
                  {cropInfo.prices.daily.price.toLocaleString()}
                </p>
                <p className="text-xs opacity-75">บาท/ตัน</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Sprout className="w-5 h-5" />
                  <p className="text-sm font-medium opacity-90">ผลผลิตเฉลี่ย</p>
                </div>
                <p className="text-3xl font-bold mb-1">
                  {cropInfo.cultivation.yieldPerRai}
                </p>
                <p className="text-xs opacity-75">กก./ไร่</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5" />
                  <p className="text-sm font-medium opacity-90">ระยะเวลา</p>
                </div>
                <p className="text-3xl font-bold mb-1">
                  {cropInfo.cultivation.duration}
                </p>
                <p className="text-xs opacity-75">วัน</p>
              </div>
            </div>
          </div>

          {/* Info Section - ฝั่งขวา (2 คอลัมน์) */}
          <div className="lg:col-span-2 space-y-6">
            {/* ข้อมูลข้าว */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border-2 border-green-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">🌾</span>
                ข้อมูล{cropInfo.name}
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-gray-600 font-medium">ราคารายเดือน</span>
                  <span className="font-bold text-green-600">
                    {cropInfo.prices.monthly.price.toLocaleString()} บาท
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-gray-600 font-medium">ราคาตลาดกลาง</span>
                  <span className="font-bold text-blue-600">
                    {cropInfo.prices.marketCenter.min.toLocaleString()}-{cropInfo.prices.marketCenter.max.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <span className="text-gray-600 font-medium">ต้นทุนต่อไร่</span>
                  <span className="font-bold text-orange-600">
                    {(cropInfo.cultivation.costPerRai + cropInfo.cultivation.laborCost).toLocaleString()} บาท
                  </span>
                </div>
              </div>
            </div>

            {/* ภูมิอากาศที่เหมาะสม */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">ภูมิอากาศที่เหมาะสม</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Thermometer className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-0.5">อุณหภูมิ</p>
                    <p className="text-lg font-bold text-gray-800">
                      {cropInfo.climate.temperature.min}-{cropInfo.climate.temperature.max}°C
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Droplets className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-0.5">ปริมาณฝน</p>
                    <p className="text-lg font-bold text-gray-800">
                      {cropInfo.climate.rainfall.min}-{cropInfo.climate.rainfall.max} มม./ปี
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ประเภทดิน</span>
                    <span className="font-semibold text-gray-800 text-right max-w-[60%]">
                      {cropInfo.climate.soil}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">พื้นที่เหมาะสม</span>
                    <span className="font-semibold text-gray-800">{cropInfo.climate.area}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">สภาพภูมิอากาศ</span>
                    <span className="font-semibold text-gray-800">{cropInfo.climate.type}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;