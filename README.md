# 🛠️ API Monitoring Dashboard (MERN Stack)

A full-stack dashboard to monitor the health and performance of system APIs in real time. Built with MongoDB, Express.js, React, and Node.js, this project offers visual status indicators, trace logging, analytics, and dynamic configuration controls—all designed for production-grade observability.

---

## 🚀 Features

### 🔍 Status Overview
- Visual indicators for API health:
  - 🟩 Green – HTTP 200 OK  
  - 🟥 Red – HTTP 4xx / 5xx  
  - 🟧 Orange – HTTP 3xx  
  - 🟨 Yellow – HTTP 1xx  
- Configurable API list (e.g., `/api/social`, `/api/weather`, etc.)
- Time range selector with monthly pagination

### 📊 Quick Stats
- Total Request Volume  
- Average Response Time  
- Uptime Percentage  
- Error Rate  
- Most Common Error  
- Last Downtime Timestamp  
- Line chart for uptime trends over time

### 🧠 Tracer Middleware
- Captures `console.log`, `warn`, `error`, `info` per request
- Isolated log buffers with metadata (timestamp, method, endpoint)
- Logs attached to trace records with `traceId`, response time, and status

### ⚙️ Configuration Panel
- Editable API list with:
  - Start date
  - Scheduling (start/end time)
  - Request limits and rate control
- Real-time updates without server restart
- Input validation and conflict prevention

---

## 🧱 Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Mongoose)
- **Deployment**: Vercel (Frontend), Render (Backend)

---

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/your-username/api-monitor-dashboard.git
cd api-monitor-dashboard

# Backend setup
cd apiTracker
npm install
# Create .env file based on .env.example
npm start

# Frontend setup
cd ../apiTrackerUi
npm install
npm run dev


Live Demo
Frontend: https://your-vercel-url.vercel.app

Backend: https://your-render-url.onrender.com
