# 🚀 निलेश सीड्स - Deployment Guide

## Complete Setup Instructions

### Step 1: Clone the Repository

```bash
git clone https://github.com/nsinvoices1008-lang/nilesh-seeds-webapp.git
cd nilesh-seeds-webapp
```

### Step 2: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project named "nilesh-seeds-webapp"
3. Enable the following services:
   - **Authentication** (Email/Password)
   - **Firestore Database**
   - **Realtime Database**
   - **Storage**
   - **Cloud Functions**
   - **Hosting**

4. Get your Firebase configuration:
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Click "Web" icon to add a web app
   - Copy the configuration object

### Step 3: Get API Keys

#### OpenWeatherMap API
1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for free account
3. Get your API key from dashboard

#### Google Maps API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API
3. Create API key with restrictions

### Step 4: Backend Configuration

```bash
cd backend/functions
npm install
```

Create `backend/functions/.env`:
```env
SHOP_LATITUDE=19.8762
SHOP_LONGITUDE=75.3433
PROXIMITY_THRESHOLD=100
```

### Step 5: Frontend Configuration

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=nilesh-seeds-webapp.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=nilesh-seeds-webapp
REACT_APP_FIREBASE_STORAGE_BUCKET=nilesh-seeds-webapp.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_DATABASE_URL=https://nilesh-seeds-webapp.firebaseio.com
REACT_APP_API_URL=https://your-region-nilesh-seeds-webapp.cloudfunctions.net/api
REACT_APP_OPENWEATHER_API_KEY=your_openweather_key
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### Step 6: Deploy Backend

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init

# Deploy Cloud Functions
firebase deploy --only functions
```

After deployment, copy the Cloud Functions URL and update `REACT_APP_API_URL` in frontend `.env`

### Step 7: Build and Deploy Frontend

```bash
cd frontend
npm run build
cd ..
firebase deploy --only hosting
```

### Step 8: Configure Firestore Security Rules

Go to Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Step 9: Configure Realtime Database Rules

Go to Firebase Console > Realtime Database > Rules:

```json
{
  "rules": {
    "locations": {
      "$userId": {
        ".read": true,
        ".write": true
      }
    },
    "chats": {
      "$chatId": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

### Step 10: Test the Application

1. Open your deployed URL (from Firebase Hosting)
2. Register a new farmer account
3. Login as Admin (Username: `Nilesh Seeds`, Password: `1008`)
4. Test all features:
   - Farmer registration
   - Location tracking
   - Weather updates
   - Chat functionality
   - Video/Voice calls
   - Ledger assignment

## 📱 Local Development

### Run Backend Locally

```bash
cd backend/functions
npm run serve
```

### Run Frontend Locally

```bash
cd frontend
npm start
```

Visit `http://localhost:3000`

## 🔧 Troubleshooting

### Issue: Location not tracking
- Ensure HTTPS is enabled (required for geolocation)
- Check browser permissions
- Verify location service is enabled on device

### Issue: Video/Voice calls not working
- Check WebRTC compatibility
- Ensure camera/microphone permissions granted
- Verify STUN/TURN servers are accessible

### Issue: Weather not loading
- Verify OpenWeatherMap API key is valid
- Check API quota limits
- Ensure location coordinates are valid

### Issue: Firebase errors
- Verify all Firebase services are enabled
- Check security rules are properly configured
- Ensure API keys are correct in `.env` files

## 📊 Database Indexes

Create these indexes in Firestore for better performance:

1. **users collection**:
   - Field: `role`, Order: Ascending
   - Field: `createdAt`, Order: Descending

2. **notifications collection**:
   - Field: `userId`, Order: Ascending
   - Field: `read`, Order: Ascending
   - Field: `createdAt`, Order: Descending

## 🔐 Security Checklist

- [ ] Firebase security rules configured
- [ ] API keys restricted to specific domains
- [ ] HTTPS enabled for production
- [ ] Environment variables not committed to Git
- [ ] Admin credentials secured on server-side
- [ ] Rate limiting enabled on Cloud Functions

## 📈 Performance Optimization

1. Enable Firebase Performance Monitoring
2. Use Firebase Analytics for user tracking
3. Implement lazy loading for components
4. Optimize images and assets
5. Enable caching for static resources

## 🌐 Custom Domain (Optional)

1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Follow the verification steps
4. Update DNS records as instructed

## 📞 Support

For issues or questions:
- Email: nileshseeds1008@gmail.com
- GitHub Issues: [Create an issue](https://github.com/nsinvoices1008-lang/nilesh-seeds-webapp/issues)

---

**निलेश सीड्स - किसानों के साथ, किसानों के लिए** 🌾
