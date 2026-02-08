const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const weatherService = {
  // ดึงสภาพอากาศปัจจุบัน
  getCurrentWeather: async (city = 'Bangkok') => {
    try {
      const response = await fetch(
        `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=th`
      );
      if (!response.ok) throw new Error('API Error');
      return await response.json();
    } catch (error) {
      console.error('Error fetching weather:', error);
      throw error;
    }
  },

  // ดึงพยากรณ์อากาศ 7 วัน (ใช้ 5 day/3 hour forecast)
  getForecast: async (city = 'Bangkok') => {
    try {
      const response = await fetch(
        `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=th`
      );
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      
      // จัดกลุ่มข้อมูลตามวัน
      const dailyData = {};
      
      data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toLocaleDateString('th-TH', { 
          day: '2-digit', 
          month: '2-digit' 
        });
        
        if (!dailyData[dateKey]) {
          dailyData[dateKey] = {
            temps: [],
            conditions: [],
            humidity: [],
            rain: [],
            wind: [],
            weather: item.weather[0]
          };
        }
        
        dailyData[dateKey].temps.push(item.main.temp);
        dailyData[dateKey].humidity.push(item.main.humidity);
        dailyData[dateKey].rain.push(item.pop * 100); // Probability of precipitation
        dailyData[dateKey].wind.push(item.wind.speed);
      });
      
      // แปลงเป็น array และคำนวณค่าเฉลี่ย
      const forecast = Object.entries(dailyData).slice(0, 7).map(([date, data]) => {
        const avgTemp = data.temps.reduce((a, b) => a + b, 0) / data.temps.length;
        const maxTemp = Math.max(...data.temps);
        const minTemp = Math.min(...data.temps);
        const avgHumidity = Math.round(data.humidity.reduce((a, b) => a + b, 0) / data.humidity.length);
        const avgRain = Math.round(data.rain.reduce((a, b) => a + b, 0) / data.rain.length);
        const avgWind = (data.wind.reduce((a, b) => a + b, 0) / data.wind.length * 3.6).toFixed(1); // m/s to km/h
        
        return {
          date: date,
          tempHigh: Math.round(maxTemp),
          tempLow: Math.round(minTemp),
          humidity: avgHumidity,
          rainChance: avgRain,
          windSpeed: avgWind,
          condition: data.weather.description,
          weatherCode: data.weather.id,
          icon: getWeatherIcon(data.weather.id)
        };
      });
      
      return forecast;
    } catch (error) {
      console.error('Error fetching forecast:', error);
      throw error;
    }
  },

  // ดึงตำแหน่งปัจจุบันจาก Geolocation
  getCurrentLocation: async () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=th`
            );
            const data = await response.json();
            resolve(data);
          } catch (error) {
            reject(error);
          }
        },
        (error) => reject(error)
      );
    });
  }
};

// ฟังก์ชันแปลง Weather Code เป็น Emoji
function getWeatherIcon(code) {
  if (code >= 200 && code < 300) return '⛈️'; // Thunderstorm
  if (code >= 300 && code < 500) return '🌦️'; // Drizzle
  if (code >= 500 && code < 600) return '🌧️'; // Rain
  if (code >= 600 && code < 700) return '❄️'; // Snow
  if (code >= 700 && code < 800) return '🌫️'; // Atmosphere
  if (code === 800) return '☀️'; // Clear
  if (code === 801) return '🌤️'; // Few clouds
  if (code === 802) return '⛅'; // Scattered clouds
  if (code >= 803) return '☁️'; // Clouds
  return '🌈';
}

// ฟังก์ชันแปลชื่อสภาพอากาศเป็นไทย
export function translateWeatherCondition(condition) {
  const translations = {
    'clear sky': 'ท้องฟ้าแจ่มใส',
    'few clouds': 'มีเมฆบางส่วน',
    'scattered clouds': 'มีเมฆกระจาย',
    'broken clouds': 'เมฆเป็นหย่อม',
    'overcast clouds': 'เมฆมาก',
    'light rain': 'ฝนตกเล็กน้อย',
    'moderate rain': 'ฝนตกปานกลาง',
    'heavy rain': 'ฝนตกหนัก',
    'thunderstorm': 'พายุฝนฟ้าคะนอง',
    'mist': 'มีหมอก',
    'fog': 'หมอกหนา'
  };
  
  return translations[condition.toLowerCase()] || condition;
}

export default weatherService;
