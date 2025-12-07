import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotification } from '../../contexts/NotificationContext';
import { startLocationTracking, stopLocationTracking, requestLocationPermission } from '../../services/location';
import Weather from './Weather';
import Chat from './Chat';
import VideoCall from './VideoCall';
import Navbar from '../Shared/Navbar';
import { FaCloud, FaComments, FaVideo, FaPhone, FaBook } from 'react-icons/fa';
import './FarmerDashboard.css';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { showNotification } = useNotification();
  const [location, setLocation] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [watchId, setWatchId] = useState(null);

  useEffect(() => {
    // Request permissions and start location tracking
    const initializeLocation = async () => {
      try {
        const hasPermission = await requestLocationPermission();
        
        if (hasPermission) {
          const id = startLocationTracking(user.userId, (loc) => {
            setLocation(loc);
          });
          setWatchId(id);
        } else {
          showNotification('कृपया लोकेशन की अनुमति दें', 'warning');
        }
      } catch (error) {
        console.error('Location initialization error:', error);
      }
    };

    initializeLocation();

    return () => {
      if (watchId) {
        stopLocationTracking(watchId);
      }
    };
  }, [user.userId]);

  const tiles = [
    { 
      id: 'weather', 
      icon: <FaCloud />, 
      label: t('weather'), 
      color: '#4A90E2',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    { 
      id: 'chat', 
      icon: <FaComments />, 
      label: t('chat'), 
      color: '#50C878',
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
    },
    { 
      id: 'video', 
      icon: <FaVideo />, 
      label: t('videoCall'), 
      color: '#E74C3C',
      gradient: 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)'
    },
    { 
      id: 'voice', 
      icon: <FaPhone />, 
      label: t('voiceCall'), 
      color: '#9B59B6',
      gradient: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)'
    },
    { 
      id: 'ledger', 
      icon: <FaBook />, 
      label: t('ledger'), 
      color: '#F39C12',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    }
  ];

  const handleTileClick = (tileId) => {
    if (tileId === 'ledger') {
      if (user.ledgerLink) {
        window.open(user.ledgerLink, '_blank');
      } else {
        showNotification('लेजर लिंक अभी तक असाइन नहीं किया गया है', 'info');
      }
    } else {
      setActiveView(tileId);
    }
  };

  if (activeView === 'weather') {
    return (
      <>
        <Navbar />
        <Weather location={location} onBack={() => setActiveView('dashboard')} />
      </>
    );
  }

  if (activeView === 'chat') {
    return (
      <>
        <Navbar />
        <Chat onBack={() => setActiveView('dashboard')} />
      </>
    );
  }

  if (activeView === 'video' || activeView === 'voice') {
    return (
      <>
        <Navbar />
        <VideoCall 
          isVideoCall={activeView === 'video'} 
          onBack={() => setActiveView('dashboard')} 
        />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="farmer-dashboard">
        <div className="dashboard-header">
          <h1>नमस्ते, {user.name}!</h1>
          <p className="welcome-text">Welcome to Nilesh Seeds</p>
          {user.village && <p className="village-text">📍 {user.village}</p>}
        </div>

        <div className="tiles-grid">
          {tiles.map((tile) => (
            <div
              key={tile.id}
              className="tile"
              style={{ background: tile.gradient }}
              onClick={() => handleTileClick(tile.id)}
            >
              <div className="tile-icon">{tile.icon}</div>
              <div className="tile-label">{tile.label}</div>
            </div>
          ))}
        </div>

        {location && (
          <div className="location-info">
            <p>📍 आपका स्थान ट्रैक हो रहा है</p>
          </div>
        )}
      </div>
    </>
  );
};

export default FarmerDashboard;
