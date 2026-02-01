// src/data/marketPrices.js
import { cropsData } from './crops';

export const mockMarketPrices = [
  {
    id: 1,
    crop: 'ข้าว',
    cropId: 'rice',
    price: cropsData.rice.prices.daily.price,
    unit: 'ตัน',
    trend: 'up',
    changePercent: 5.2,
    lastUpdate: '23 ม.ค. 2569',
    image: 'https://img.kapook.com/u/2024/Jarosphan/Home/Cleaning/159982/r02.jpg'
  },
  {
    id: 2,
    crop: 'มันสำปะหลัง',
    cropId: 'cassava',
    price: 2800,
    unit: 'ตัน',
    trend: 'down',
    changePercent: -2.1,
    lastUpdate: '1 ก.พ. 2569',
    image: 'https://s.isanook.com/he/0/ud/7/37461/cassava.jpg?ip/crop/w1200h700/q80/jpg'
  },
  {
    id: 3,
    crop: 'ข้าวโพด',
    cropId: 'corn',
    price: 8500,
    unit: 'ตัน',
    trend: 'up',
    changePercent: 3.8,
    lastUpdate: '1 ก.พ. 2569',
    image: 'https://s.isanook.com/ca/0/ud/284/1423643/istock-1485792634.jpg?ip/resize/w728/q80/jpg'
  },
  {
    id: 4,
    crop: 'อ้อย',
    cropId: 'sugarcane',
    price: 1200,
    unit: 'ตัน',
    trend: 'stable',
    changePercent: 0,
    lastUpdate: '1 ก.พ. 2569',
    image: 'https://www.prachachat.net/wp-content/uploads/2025/10/cover-2025-10-16T093842.713.jpg'
  }
];
