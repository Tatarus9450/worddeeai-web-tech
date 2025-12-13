# worddee.ai - Daily Vocab Project

## 🚀 Quick Start

### 1. Start Backend (API, Database & n8n)
```bash
cd daily_vocab_api
docker compose up -d
```
> Services: API (`8000`), MySQL (`3307`), n8n (`5678`)

### 2. Start Frontend✨
```bash
cd daily_vocab_web
npm install
npm run dev
```
> เปิดเว็บ: [http://localhost:3000](http://localhost:3000)

---

## 🔗 Services

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Next.js Web App |
| **Backend API** | http://localhost:8000 | FastAPI |
| **API Docs** | http://localhost:8000/docs | Swagger UI |
| **n8n** | http://localhost:5678 | AI Workflow Automation |
| **MySQL** | localhost:3307 | Database |

---

## 🗄️ Database Connection

### Connection Details
| Parameter | Value |
|-----------|-------|
| **Host** | `localhost` |
| **Port** | `3307` |
| **Database** | `vocabulary_db` |
| **Username** | `vocabuser` |
| **Password** | `vocabpass123` |

### Connection String
```
mysql://vocabuser:vocabpass123@localhost:3307/vocabulary_db
```

### Connect via MySQL CLI
```bash
mysql -h 127.0.0.1 -P 3307 -u vocabuser -pvocabpass123 vocabulary_db
```

### Connect via DBeaver / DataGrip / MySQL Workbench
- Host: `localhost` หรือ `127.0.0.1`
- Port: `3307`
- Database: `vocabulary_db`
- User: `vocabuser`
- Password: `vocabpass123`

---

## 🏗️ Tech Stack

### Backend (`daily_vocab_api`)
- **Framework**: Python (FastAPI)
- **Database**: MySQL 8.0
- **AI Integration**: n8n + Google Gemini API (สามารถใช้ OpenAI API แทนได้)
- **Container**: Docker Compose

### Frontend (`daily_vocab_web`)
- **Framework**: Next.js 14, TypeScript
- **Styling**: Tailwind CSS
- **Fonts**: Folio Std (Logo), Merriweather (Content)
- **Image API**: Pexels API

---

## ✨ Features

- 🎯 **Word of the Day** - ฝึกเขียนประโยคจากคำศัพท์ (คำศัพท์ 150 คำ พร้อม pronunciation & example)
- 🤖 **AI Scoring** - ให้คะแนนและคำแนะนำจาก Gemini AI เป็นภาษาไทย
- 📊 **Dashboard** - ติดตามความก้าวหน้า (Day Streak, Time Learned)
- 🖼️ **Dynamic Images** - รูปภาพเปลี่ยนตามคำศัพท์จาก Pexels
- 📱 **Responsive UI** - รองรับทุกหน้าจอ

---

## 🛑 Stop Services

```bash
# Stop Backend
cd daily_vocab_api && docker compose down

# Stop Frontend
# Press Ctrl + C in Terminal
```

---

## 📋 n8n Setup (First Time Only)

1. เปิด http://localhost:5678
2. สร้าง account
3. เพิ่ม Google Gemini Credentials (API Key)
4. Import workflow จากไฟล์ `n8n-workflow.json`
5. Activate workflow

---
## 📁 Project Structure

```
web-tech/
├── daily_vocab_api/          # Backend
│   ├── api/                  # FastAPI Application
│   ├── docker-compose.yml    # Docker Services
│   ├── init.sql              # Database Schema + 150 Words
│   └── n8n-workflow.json     # n8n Workflow Template
│
├── daily_vocab_web/          # Frontend
   └── src/
       ├── app/              # Next.js Pages
       │   ├── word-of-the-day/
       │   └── dashboard/
       └── components/       # React Components
```

