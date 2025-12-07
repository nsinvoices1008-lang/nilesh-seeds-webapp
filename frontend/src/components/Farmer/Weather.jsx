import React, { useEffect, useState } from 'react';
import { getWeatherByLocation } from '../../services/weather';
import { useLanguage } from '../../contexts/LanguageContext';
import { FaArrowLeft, FaThermometerHalf, FaTint, FaWind, FaEye, FaCompress } from 'react-icons/fa';
import './Weather.css';

const Weather = ({ location, onBack }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { language, t } = useLanguage();

  useEffect(() => {
    const fetchWeather = async () => {
      if (location && location.latitude && location.longitude) {
        try {
          setLoading(true);
          const weatherData = await getWeatherByLocation(
            location.latitude,
            location.longitude,
            language
          );
          setWeather(weatherData);
          setError(null);
        } catch (err) {
          console.error('Weather fetch error:', err);
          setError('मौसम की जानकारी लोड नहीं हो सकी');
        } finally {
          setLoading(false);
        }
      } else {
        setError('स्थान की जानकारी उपलब्ध नहीं है');
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location, language]);

  if (loading) {
    return (
      <div className="weather-container">
        <div className="weather-header">
          <button className="back-btn" onClick={onBack}>
            <FaArrowLeft /> {t('back')}
          </button>
          <h2>{t('weather')}</h2>
        </div>
        <div className="loading">मौसम की जानकारी लोड हो रही है...</div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="weather-container">
        <div className="weather-header">
          <button className="back-btn" onClick={onBack}>
            <FaArrowLeft /> {t('back')}
          </button>
          <h2>{t('weather')}</h2>
        </div>
        <div className="error">{error || 'मौसम की जानकारी उपलब्ध नहीं है'}</div>
      </div>
    );
  }

  return (
    <div className="weather-container">
      <div className="weather-header">
        <button className="back-btn" onClick={onBack}>
          <FaArrowLeft /> {t('back')}
        </button>
        <h2>{t('weather')}</h2>
      </div>

      <div className="weather-card">
        <div className="weather-main">
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
            alt={weather.description}
            className="weather-icon"
          />
          <div className="temperature">{weather.temperature}°C</div>
          <div className="description">{weather.description}</div>
          <div className="city">📍 {weather.city}</div>
        </div>

        <div className="weather-details">
          <div className="detail-item">
            <div className="detail-icon">
              <FaThermometerHalf />
            </div>
            <div className="detail-info">
              <div className="detail-label">महसूस होता है</div>
              <div className="detail-value">{weather.feelsLike}°C</div>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <FaTint />
            </div>
            <div className="detail-info">
              <div className="detail-label">{t('humidity')}</div>
              <div className="detail-value">{weather.humidity}%</div>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <FaWind />
            </div>
            <div className="detail-info">
              <div className="detail-label">{t('windSpeed')}</div>
              <div className="detail-value">{weather.windSpeed} m/s</div>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <FaCompress />
            </div>
            <div className="detail-info">
              <div className="detail-label">{t('pressure')}</div>
              <div className="detail-value">{weather.pressure} hPa</div>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <FaEye />
            </div>
            <div className="detail-info">
              <div className="detail-label">{t('visibility')}</div>
              <div className="detail-value">{weather.visibility} km</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
