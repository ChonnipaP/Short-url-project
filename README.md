# Short URL Generator (Business ALive Test)

โปรเจกต์ย่อลิงก์พร้อมระบบ QR Code และตัวนับจำนวนคลิก

## วิธีการติดตั้งและรันโปรเจกต์ (Installation Guide)

### 1. การตั้งค่า Backend
1. เข้าไปที่โฟลเดอร์ `Short-url-backend`
2. รันคำสั่ง `npm install` เพื่อติดตั้ง dependencies
3. สร้างไฟล์ `.env` และเพิ่ม `MONGO_URI` (รหัสเชื่อมต่อ MongoDB)
4. รันคำสั่ง `node index.js` เพื่อเริ่มทำงาน

### 2. การตั้งค่า Frontend
1. เข้าไปที่โฟลเดอร์ `short-url-web`
2. รันคำสั่ง `npm install`
3. แก้ไข `API_BASE_URL` ในไฟล์ `App.js` ให้ตรงกับ URL ของ Backend
4. รันคำสั่ง `npm start` เพื่อเปิดหน้าเว็บ

## สิ่งที่ดิฉันใช้
- React (Frontend)
- Node.js & Express (Backend)
- MongoDB Atlas (Database)
- Vercel & Render (Deployment)
