'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', formData);
      if (response.data.success) {
        router.push('/home');
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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">
              <i className="fas fa-user"></i> Username or Email
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              placeholder="Enter your username or email"
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
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Loading...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i> Login
              </>
            )}
          </button>
        </form>

        <div className="auth-links">
          <p>
            No account yet? <a href="/register">Sign up</a>
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
