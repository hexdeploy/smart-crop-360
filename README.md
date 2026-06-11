# 🌾 Smart Crop 360

<div align="center">

![Smart Crop 360](https://img.shields.io/badge/Smart_Crop_360-AI_Farming_Assistant-green?style=for-the-badge&logo=leaf)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Flask](https://img.shields.io/badge/Flask-3-black?style=for-the-badge&logo=flask)
![Gemini](https://img.shields.io/badge/Google_Gemini-AI-orange?style=for-the-badge&logo=google)

**An AI-powered Progressive Web App for Indian Farmers 🇮🇳**

[🌐 Live Demo](https://smart-crop-360.vercel.app) • [📱 Install as App](#pwa-installation) • [📖 Features](#features)

</div>

---

## 📌 Overview

Smart Crop 360 is a full-stack AI-powered farming decision support system built for Indian farmers. It provides personalized crop recommendations, AI-based disease detection, live government mandi prices, a direct farmer-to-buyer marketplace, and a multilingual AI assistant — all in one Progressive Web App accessible on any device.

> Originally built as a final year project (CS&E AI&ML, 2025-26) and evolved into a production-ready application deployed and accessible to farmers across India.

---

## ✨ Features

### 🌾 Crop Recommendation Engine
- 6-step guided wizard covering location, soil, water, season and farming goals
- Covers all 28 Indian states and their districts
- Intelligent scoring algorithm matching crops to farmer conditions
- Supports 70+ crops with profit and duration estimates

### 🔬 AI Disease Detection
- Upload crop leaf/plant images for instant analysis
- Farmer-friendly questions (no technical jargon)
- Dynamic severity based on spread level
- Chemical and organic treatment recommendations
- Auto dosage calculation based on farm size

### 📈 Live Market Prices
- Real-time prices from Government Agmarknet API
- 7000+ mandis across all Indian states
- Estimated earnings calculator
- Google Maps directions to nearest mandis
- Smart fallback caching during API outages

### 🛒 Farmer Marketplace
- List crops for sale with full details
- Search and filter by crop and state
- Direct Call and WhatsApp contact
- Pre-filled WhatsApp message template
- Real database-backed listings visible to all users

### 🤖 AI Farming Assistant
- Powered by Google Gemini 2.5 Flash Lite
- Supports 12 Indian regional languages
- Strictly farming-focused responses
- Session-persisted conversation history
- Suggested questions for quick access

### 🌤️ Weather Widget
- Auto-detects farmer's GPS location
- 5-day forecast with farming advice
- Humidity, wind speed, rainfall alerts
- Actionable tips based on weather conditions

### 👤 User Profile
- Secure JWT authentication
- View and manage crop listings
- Delete listings with confirmation
- Personalized dashboard with real name

### 📱 Progressive Web App
- Installable on Android and iOS home screen
- Works like a native app (no browser bars)
- Offline-ready with service worker caching
- Mobile-first responsive design

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI Framework |
| Tailwind CSS | Styling |
| Vite | Build Tool |
| React Router DOM | Navigation |
| vite-plugin-pwa | PWA Support |

### Backend
| Technology | Purpose |
|---|---|
| Python + Flask | REST API |
| Flask-SQLAlchemy | ORM |
| Flask-Bcrypt | Password Hashing |
| PyJWT | Authentication |
| SQLite | Database |
| Gunicorn | Production Server |

### External APIs
| API | Purpose |
|---|---|
| Google Gemini 2.5 Flash Lite | AI Assistant |
| Agmarknet (data.gov.in) | Live Mandi Prices |
| Open-Meteo | Weather Data (Free) |
| Nominatim (OpenStreetMap) | Reverse Geocoding (Free) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- Git

### Clone the Repository
```bash
git clone https://github.com/hexdeploy/smart-crop-360.git
cd smart-crop-360
```

### Setup Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
```

Create `.env` file in `backend/` folder:
```
GEMINI_API_KEY=your_gemini_api_key
AGMARKNET_API_KEY=your_agmarknet_api_key
```

Run the backend:
```bash
python app.py
# Runs on http://localhost:5000
```

### Setup Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## 📡 API Endpoints

### Authentication
```
POST /api/register    → Create new account
POST /api/login       → Login, returns JWT token
GET  /api/me          → Get current user
```

### Marketplace
```
GET    /api/listings           → Get all listings
POST   /api/listings           → Create listing
DELETE /api/listings/<id>      → Delete listing
```

### Market Prices
```
GET /api/market-prices?commodity=Tomato&state=Karnataka
```

### AI Assistant
```
POST /api/ai-assistant
Body: { system: "...", messages: [...] }
```

---

## 📱 PWA Installation

### Android
1. Open https://smart-crop-360.vercel.app in Chrome
2. Tap three dots menu (⋮)
3. Tap **"Add to Home Screen"**
4. App icon appears on home screen ✅

### iPhone/iPad
1. Open https://smart-crop-360.vercel.app in Safari
2. Tap Share button (⬆️)
3. Tap **"Add to Home Screen"**
4. App icon appears on home screen ✅

---

## 🌍 Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | https://smart-crop-360.vercel.app |
| Backend | Render | https://backend-smart-crop-360.onrender.com |
| Repository | GitHub | https://github.com/hexdeploy/smart-crop-360 |

---

## 🗺️ Roadmap

- [ ] Real CNN model for disease detection (PlantVillage dataset)
- [ ] Voice input for AI assistant
- [ ] Push notifications for price alerts
- [ ] PostgreSQL for production database
- [ ] WhatsApp Business API integration
- [ ] Offline mode for poor connectivity areas
- [ ] Hindi/regional language full UI translation
- [ ] IoT sensor integration
- [ ] Crop insurance information
- [ ] Government scheme alerts

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Anup** ([@hexdeploy](https://github.com/hexdeploy))

---

<div align="center">

**Built with ❤️ for Indian Farmers 🇮🇳🌾**

*Empowering 140 million farming households with AI-powered agricultural intelligence*

⭐ Star this repo if you found it helpful!

</div>
