# Daily Vocab Project

## 🚀 Quick Start (วิธีรันโปรเจกต์)

ก๊อปปี้คำสั่งด้านล่างไปวางใน Terminal เพื่อเริ่มใช้งานได้ทันที:

### 1. Start Backend (API & Database)
```bash
cd daily_vocab_api
docker-compose up --build -d
cd ..
```
> รอสักครู่ให้ Database เริ่มทำงาน (API จะอยู่ที่ Port `8000`, MySQL Port `3307`)

### 2. Start Frontend (Web App)
```bash
cd daily_vocab_web
npm install
npm run dev
```
> เปิดเว็บได้ที่: [http://localhost:3000](http://localhost:3000)

---

## 📋 รายละเอียดโปรเจกต์

### Backend (`daily_vocab_api`)
- **Technology**: Python (FastAPI), MySQL, Docker
- **API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Database**: MySQL (Host Port: 3307, Container Port: 3306)

### Frontend (`daily_vocab_web`)
- **Technology**: Next.js, TypeScript, Tailwind CSS
- **URL**: [http://localhost:3000](http://localhost:3000)
- **Features**:
  - Custom Fonts: `Folio Std` (Logo), `Merriweather` (Content)
  - Responsive Design
  - Word of the Day Challenge

## 🛑 วิธีหยุดการทำงาน
```bash
# หยุด Backend
cd daily_vocab_api && docker-compose down

# หยุด Frontend
# กด Ctrl + C ใน Terminal
```
