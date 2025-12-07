import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotification } from '../../contexts/NotificationContext';
import { FaBars, FaTimes, FaBell, FaCog, FaSignOutAlt, FaGlobe } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { language, changeLanguage, t } = useLanguage();
  const { unreadCount, unreadChatCount } = useNotification();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('क्या आप लॉगआउट करना चाहते हैं?')) {
      logout();
      navigate('/login');
    }
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    setLangMenuOpen(false);
    setMenuOpen(false);
  };

  const totalNotifications = unreadCount + unreadChatCount;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>निलेश सीड्स</h1>
          <span className="navbar-subtitle">Nilesh Seeds</span>
        </div>

        <div className="navbar-actions">
          {/* Notification Bell */}
          <button className="navbar-icon-btn" onClick={() => navigate('/notifications')}>
            <FaBell />
            {totalNotifications > 0 && (
              <span className="notification-badge">{totalNotifications}</span>
            )}
          </button>

          {/* Hamburger Menu */}
          <button 
            className="navbar-icon-btn hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="navbar-menu">
          <div className="navbar-menu-header">
            <div className="user-info">
              <div className="user-avatar">
                {user.profilePhotoUrl ? (
                  <img src={user.profilePhotoUrl} alt={user.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="user-details">
                <h3>{user.name}</h3>
                <p>{user.role === 'admin' ? 'व्यवस्थापक' : 'किसान'}</p>
              </div>
            </div>
          </div>

          <div className="navbar-menu-items">
            {/* Language Selector */}
            <button 
              className="menu-item"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
            >
              <FaGlobe />
              <span>{t('language')}</span>
              <span className="menu-item-value">
                {language === 'hi' ? 'हिन्दी' : language === 'en' ? 'English' : 'मराठी'}
              </span>
            </button>

            {langMenuOpen && (
              <div className="submenu">
                <button 
                  className={`submenu-item ${language === 'hi' ? 'active' : ''}`}
                  onClick={() => handleLanguageChange('hi')}
                >
                  हिन्दी (Hindi)
                </button>
                <button 
                  className={`submenu-item ${language === 'en' ? 'active' : ''}`}
                  onClick={() => handleLanguageChange('en')}
                >
                  English
                </button>
                <button 
                  className={`submenu-item ${language === 'mr' ? 'active' : ''}`}
                  onClick={() => handleLanguageChange('mr')}
                >
                  मराठी (Marathi)
                </button>
              </div>
            )}

            {/* Settings */}
            <button 
              className="menu-item"
              onClick={() => {
                navigate('/settings');
                setMenuOpen(false);
              }}
            >
              <FaCog />
              <span>{t('settings')}</span>
            </button>

            {/* Logout */}
            <button 
              className="menu-item logout"
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              <span>{t('logout')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Overlay */}
      {menuOpen && (
        <div 
          className="navbar-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
