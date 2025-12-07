import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import './Auth.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('farmer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password, role);

    if (result.success) {
      navigate(role === 'admin' ? '/admin' : '/farmer');
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
          <h2 className="auth-subtitle">Nilesh Seeds</h2>
          <p className="auth-tagline">किसानों के साथ, किसानों के लिए</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="role-selector">
            <button
              type="button"
              className={`role-btn ${role === 'farmer' ? 'active' : ''}`}
              onClick={() => setRole('farmer')}
            >
              <span className="role-icon">🌾</span>
              <span>{t('farmer')}</span>
            </button>
            <button
              type="button"
              className={`role-btn ${role === 'admin' ? 'active' : ''}`}
              onClick={() => setRole('admin')}
            >
              <span className="role-icon">👨‍💼</span>
              <span>{t('admin')}</span>
            </button>
          </div>

          <div className="form-group">
            <label>{t('username')}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={role === 'farmer' ? 'आपका नाम (Your Name)' : 'Nilesh Seeds'}
              required
              autoComplete="username"
            />
            {role === 'farmer' && (
              <small className="form-hint">अपना पूरा नाम दर्ज करें</small>
            )}
          </div>

          <div className="form-group">
            <label>{t('password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={role === 'farmer' ? 'फोन नंबर (Phone Number)' : '1008'}
              required
              autoComplete="current-password"
            />
            {role === 'farmer' && (
              <small className="form-hint">अपना 10 अंकों का फोन नंबर दर्ज करें</small>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'लॉगिन हो रहा है...' : t('login')}
          </button>

          {role === 'farmer' && (
            <div className="auth-footer">
              <p>
                {t('newUser')} <Link to="/register" className="auth-link">{t('register')}</Link>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
