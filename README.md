# 🌾 निलेश सीड्स (Nilesh Seeds) - Complete Web Application

A full-stack web application for Nilesh Seeds retail agriculture store connecting farmers with the retailer through real-time communication, location tracking, weather updates, and ledger management.

## 🚀 Features

### Farmer Features
- **Real-time Weather** - Weather updates based on GPS location
- **Chat** - Direct 1-to-1 chat with Admin
- **Video/Voice Calls** - High-quality calls with Admin
- **Personal Ledger** - Unique browser link assigned by Admin
- **Location Tracking** - Background GPS tracking
- **Multi-language** - Hindi (default), English, Marathi

### Admin Features
- **Farmer Management** - View and manage all registered farmers
- **Real-time Location** - Track farmer locations on Google Maps
- **Proximity Alerts** - Notifications when farmers are within 50-100m of shop
- **Communication Hub** - Chat and call any farmer
- **Ledger Assignment** - Assign unique ledger links to farmers
- **Profile Management** - Edit farmer profiles

## 🛠️ Tech Stack

- **Frontend**: React.js
- **Backend**: Firebase Cloud Functions (Node.js/Express)
- **Database**: Firebase Firestore + Realtime Database
- **Authentication**: Custom Firebase Auth
- **Video/Voice**: WebRTC (Simple Peer)
- **Maps**: Google Maps API
- **Weather**: OpenWeatherMap API

## 📦 Installation

### Prerequisites
- Node.js 18+
- Firebase CLI
- Google Maps API Key
- OpenWeatherMap API Key

### Backend Setup

```bash
cd backend/functions
npm install
```

Create `backend/functions/.env`:
```env
SHOP_LATITUDE=19.8762
SHOP_LONGITUDE=75.3433
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_DATABASE_URL=your_database_url
REACT_APP_API_URL=your_cloud_functions_url
REACT_APP_OPENWEATHER_API_KEY=your_openweather_key
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

## 🚀 Deployment

### Deploy Backend
```bash
firebase deploy --only functions
```

### Deploy Frontend
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

## 🔐 Default Credentials

**Admin Login:**
- Username: `Nilesh Seeds`
- Password: `1008`

**Farmer Login:**
- Username: Farmer's Name
- Password: Farmer's Phone Number

## 📱 Usage

1. **Farmer Registration**: New farmers can register with Name, Village, Phone, Address
2. **Location Permissions**: App requests Location, Camera, Microphone permissions
3. **Background Tracking**: Farmer location is tracked in background
4. **Proximity Alerts**: Admin gets notified when farmer is near shop (50-100m)
5. **Communication**: Real-time chat and video/voice calls
6. **Ledger Access**: Farmers can access their personal ledger links

## 🗂️ Database Schema

### Firestore Collections

**users/**
```javascript
{
  userId: string,
  name: string,
  username: string,
  phone: string,
  village: string,
  address: string,
  role: 'farmer' | 'admin',
  profilePhotoUrl: string,
  ledgerLink: string,
  createdAt: timestamp
}
```

**notifications/**
```javascript
{
  type: 'message' | 'proximity',
  farmerId: string,
  farmerName: string,
  message: string,
  read: boolean,
  createdAt: timestamp
}
```

### Realtime Database

**locations/{userId}**
```javascript
{
  latitude: number,
  longitude: number,
  timestamp: number
}
```

**chats/{chatRoomId}/messages/{messageId}**
```javascript
{
  senderId: string,
  text: string,
  timestamp: number,
  read: boolean
}
```

## 🌍 Shop Location

Nilesh Seeds Shop: https://maps.app.goo.gl/RnDeJWRBope8LQiF8?g_st=ac

## 📄 License

MIT License

## 👨‍💻 Developer

Built for Nilesh Seeds by NILESH SEEDS

---

**निलेश सीड्स - किसानों के साथ, किसानों के लिए** 🌾
