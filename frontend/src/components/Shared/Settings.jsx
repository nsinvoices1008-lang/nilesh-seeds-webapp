import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotification } from '../../contexts/NotificationContext';
import { validatePhone, validateUsername } from '../../utils/helpers';
import Navbar from './Navbar';
import { FaArrowLeft, FaUser, FaPhone, FaMapMarkerAlt, FaLock, FaCamera } from 'react-icons/fa';
import './Settings.css';

const Settings = () => {
  const { user, updateProfile, checkUsernameAvailability } = useAuth();
  const { t } = useLanguage();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user.name || '',
    username: user.username || '',
    phone: user.phone || '',
    village: user.village || '',
    address: user.address || '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Check username availability
    if (name === 'username' && value !== user.username) {
      checkUsername(value);
    }
  };

  const checkUsername = async (username) => {
    if (!validateUsername(username)) {
      setUsernameAvailable(false);
      return;
    }

    setUsernameChecking(true);
    const available = await checkUsernameAvailability(username);
    setUsernameAvailable(available);
    setUsernameChecking(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      showNotification('कृपया नाम दर्ज करें', 'error');
      return;
    }

    if (!validateUsername(formData.username)) {
      showNotification('अवैध उपयोगकर्ता नाम', 'error');
      return;
    }

    if (!usernameAvailable) {
      showNotification('यह उपयोगकर्ता नाम पहले से उपयोग में है', 'error');
      return;
    }

    if (!validatePhone(formData.phone)) {
      showNotification('अवैध फोन नंबर', 'error');
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      showNotification('पासवर्ड मेल नहीं खाते', 'error');
      return;
    }

    setLoading(true);

    const updateData = {
      name: formData.name,
      username: formData.username,
      phone: formData.phone,
      village: formData.village,
      address: formData.address
    };

    // Only include password if it's being changed
    if (formData.password) {
      updateData.password = formData.password;
    }

    const result = await updateProfile(user.userId, updateData);

    if (result.success) {
      showNotification('प्रोफ़ाइल अपडेट हो गई', 'success');
      navigate(user.role === 'admin' ? '/admin' : '/farmer');
    } else {
      showNotification(result.message || 'अपडेट विफल', 'error');
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="settings-container">
        <div className="settings-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft /> {t('back')}
          </button>
          <h1>{t('settings')}</h1>
        </div>

        <div className="settings-card">
          <div className="profile-photo-section">
            <div className="profile-photo">
              {user.profilePhotoUrl ? (
                <img src={user.profilePhotoUrl} alt={user.name} />
              ) : (
                <div className="photo-placeholder">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <button className="photo-upload-btn">
                <FaCamera />
              </button>
            </div>
            <p className="photo-hint">प्रोफ़ाइल फोटो बदलें</p>
          </div>

          <form onSubmit={handleSubmit} className="settings-form">
            <div className="form-group">
              <label>
                <FaUser /> {t('name')} *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <FaUser /> {t('username')} *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              {usernameChecking && (
                <small className="form-hint">जाँच हो रही है...</small>
              )}
              {!usernameChecking && formData.username !== user.username && (
                <small className={usernameAvailable ? 'form-hint success' : 'form-hint error'}>
                  {usernameAvailable ? '✓ उपलब्ध है' : '✗ पहले से उपयोग में है'}
                </small>
              )}
            </div>

            <div className="form-group">
              <label>
                <FaPhone /> {t('phone')} *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                maxLength="10"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <FaMapMarkerAlt /> {t('village')}
              </label>
              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                <FaMapMarkerAlt /> {t('address')}
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="form-divider">
              <span>पासवर्ड बदलें (वैकल्पिक)</span>
            </div>

            <div className="form-group">
              <label>
                <FaLock /> नया पासवर्ड
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="खाली छोड़ें यदि नहीं बदलना है"
              />
            </div>

            <div className="form-group">
              <label>
                <FaLock /> पासवर्ड की पुष्टि करें
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="नया पासवर्ड दोबारा दर्ज करें"
              />
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate(-1)}
              >
                {t('cancel')}
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading || !usernameAvailable}
              >
                {loading ? 'सहेजा जा रहा है...' : t('save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Settings;
