import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';
import Logo from '../components/Logo';
import { login, DEMO_ACCOUNTS, HOME } from '../services/auth';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const user = login(formData.email, formData.password);
      navigate(HOME[user.role]);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      {/* Panneau Gauche : Bannière */}
      <div className="auth-banner">
        <div className="banner-content">
          <div className="logo-container">
            <Logo size={54} />
          </div>

          <h1 className="banner-title">
            Unlock Your Learning <br /> Potential
          </h1>
          <p className="banner-subtitle">
            Sign in to continue your journey of growth and knowledge. Explore courses, track progress and achieve your goals.
          </p>
        </div>
      </div>

      {/* Panneau Droit : Formulaire */}
      <div className="auth-form-wrapper">
        <div className="auth-form-container">
          <div className="form-header">
            <h2>Welcome 👋</h2>
            <p>Let's Login To Your Account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                Remember Me
              </label>
              <Link to="/activate" className="forgot-password">
                Forgot Password?
              </Link>
            </div>

            {error && <div className="alert alert-err" role="alert" style={{ marginBottom: 12 }}>{error}</div>}

            <div className="demo-accounts" style={{ marginBottom: 14 }}>
              <small style={{ display: 'block', marginBottom: 6, color: '#6b7185' }}>Comptes de démonstration (cliquer pour remplir) :</small>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {DEMO_ACCOUNTS.map((a) => (
                  <button key={a.email} type="button" className="btn-secondary" style={{ flex: 1, padding: '8px 10px', fontSize: '0.8rem' }}
                    onClick={() => { setFormData((f) => ({ ...f, email: a.email, password: a.password })); setError(''); }}>{a.label}</button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary">
              Login
            </button>

            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => navigate('/register')}
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;