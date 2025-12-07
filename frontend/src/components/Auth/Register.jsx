import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { validatePhone } from '../../utils/helpers';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    village: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('कृपया अपना नाम दर्ज करें');
      return;
    }

    if (!formData.village.trim()) {
      setError('कृपया अपना गाँव दर्ज करें');
      return;
    }

    if (!validatePhone(formData.phone)) {
      setError('कृपया वैध 10 अंकों का फोन नंबर दर्ज करें');
      return;
    }

    if (!formData.address.trim()) {
      setError('कृपया अपना पता दर्ज करें');
      return;
    }

    setLoading(true);

    const result = await register(formData);

    if (result.success) {
      alert('पंजीकरण सफल! कृपया अपने नाम और फोन नंबर से लॉगिन करें।');
      navigate('/login');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">निलेश सीड्स</h1>
          <h2 className="auth-subtitle">नया पंजीकरण</h2>
          <p className="auth-tagline">New Farmer Registration</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>{t('name')} *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="आपका पूरा नाम (Full Name)"
              required
            />
          </div>

          <div className="form-group">
            <label>{t('village')} *</label>
            <input
              type="text"
              name="village"
              value={formData.village}
              onChange={handleChange}
              placeholder="आपका गाँव (Your Village)"
              required
            />
          </div>

          <div className="form-group">
            <label>{t('phone')} *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10 अंकों का फोन नंबर"
              maxLength="10"
              required
            />
            <small className="form-hint">यह आपका पासवर्ड होगा</small>
          </div>

          <div className="form-group">
            <label>{t('address')} *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="आपका पूरा पता (Complete Address)"
              rows="3"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'पंजीकरण हो रहा है...' : t('register')}
          </button>

          <div className="auth-footer">
            <p>
              पहले से पंजीकृत हैं? <Link to="/login" className="auth-link">{t('login')}</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
