const express = require('express');
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const QRCode = require('qrcode');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// เชื่อมต่อ MongoDB (ดึงค่าจากไฟล์ .env)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Schema สำหรับเก็บข้อมูลใน MongoDB
const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortCode: String,
  qrCode: String,
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Url = mongoose.model('Url', urlSchema);

// API สำหรับสร้างลิงก์สั้น
// API สำหรับสร้างลิงก์สั้น (แบบป้องกันการกรอกซ้ำ)
app.post('/api/shorten', async (req, res) => {
  const { originalUrl } = req.body;

  try {
    // 1. ค้นหาในฐานข้อมูลก่อนว่าเคยมีลิ้งก์นี้หรือยัง
    const existingUrl = await Url.findOne({ originalUrl });
    
    if (existingUrl) {
      // ถ้าเจอลิ้งก์เดิม ให้ส่งข้อมูลเดิมกลับไปที่หน้าบ้านทันที
      return res.json(existingUrl);
    }

    // 2. ถ้ายังไม่มีในฐานข้อมูล ให้สร้างใหม่ตามปกติ
    const shortCode = nanoid(6); 
    const shortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;
    const qrCodeImage = await QRCode.toDataURL(shortUrl);

    const newUrl = new Url({ originalUrl, shortCode, qrCode: qrCodeImage });
    await newUrl.save();
    
    res.json(newUrl);
  } catch (err) {
    res.status(500).json('Server error');
  }
});

// API สำหรับ Redirect เมื่อมีคนกดลิงก์สั้น
app.get('/:code', async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.code });
    if (url) {
      url.clicks++;
      await url.save();
      return res.redirect(url.originalUrl);
    }
    return res.status(404).send('URL not found');
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// เพิ่มส่วนนี้เข้าไปเพื่อให้หน้า React ดึงข้อมูลประวัติมาโชว์ในตารางได้
app.get('/api/history', async (req, res) => {
  try {
    const history = await Url.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json('Server error');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));