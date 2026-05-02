'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    language: 'fr'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        language: formData.language
      });

      if (response.data.success) {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>
          <i className="fas fa-code"></i> Zrkx Studios
        </h1>
        
        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            <i className="fas fa-check-circle"></i> {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">
              <i className="fas fa-user"></i> Username
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              placeholder="Choose a username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <i className="fas fa-envelope"></i> Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <i className="fas fa-lock"></i> Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="Choose a password"
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              <i className="fas fa-lock"></i> Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              placeholder="Confirm your password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="language">
              <i className="fas fa-language"></i> Language
            </label>
            <select
              id="language"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            >
              <option value="fr">🇫🇷 Français</option>
              <option value="en">🇬🇧 English</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Loading...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus"></i> Sign up
              </>
            )}
          </button>
        </form>

        <div className="auth-links">
          <p>
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>

      <style jsx>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .auth-box {
          background: rgba(20, 20, 20, 0.9);
          backdrop-filter: blur(20px);
          padding: 50px;
          border-radius: 20px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.6);
          width: 100%;
          max-width: 450px;
          border: 1px solid rgba(138, 43, 226, 0.3);
        }

        h1 {
          text-align: center;
          color: white;
          margin-bottom: 40px;
          font-size: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        h1 i {
          background: linear-gradient(135deg, #8a2be2, #9d4edd);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          color: #aaa;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .form-group label i {
          margin-right: 8px;
          color: #8a2be2;
        }

        .error-message {
          background: rgba(231, 76, 60, 0.2);
          color: #e74c3c;
          padding: 12px;
          border-radius: 10px;
          margin-bottom: 20px;
          border-left: 4px solid #e74c3c;
        }

        .success-message {
          background: rgba(46, 204, 113, 0.2);
          color: #2ecc71;
          padding: 12px;
          border-radius: 10px;
          margin-bottom: 20px;
          border-left: 4px solid #2ecc71;
        }

        .auth-links {
          text-align: center;
          margin-top: 20px;
          color: #aaa;
        }

        .auth-links a {
          color: #8a2be2;
          text-decoration: none;
          font-weight: 600;
        }

        .auth-links a:hover {
          color: #9d4edd;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
