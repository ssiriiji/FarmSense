// src/data/weather.js
export const mockWeatherData = {
  current: {
    temperature: 28,
    humidity: 75,
    rainfall: 15,
    condition: 'ฝนตกปานกลาง',
    date: '1 ก.พ. 2569'
  },
  forecast: [
    {
      date: '2 ก.พ.',
      temp: 29,
      condition: 'มีเมฆบางส่วน',
      rain: 20
    },
    {
      date: '3 ก.พ.',
      temp: 30,
      condition: 'แดดจัด',
      rain: 5
    },
    {
      date: '4 ก.พ.',
      temp: 27,
      condition: 'ฝนฟ้าคะนอง',
      rain: 60
    }
  ]
};
