'use client';

import { useRouter } from 'next/navigation';
import axios from 'axios';

interface NavbarProps {
  username: string;
  language: 'fr' | 'en';
}

export default function Navbar({ username, language }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const t = (key: string) => {
    const translations: any = {
      fr: {
        home: 'Accueil',
        logout: 'Déconnexion',
        join_discord: 'Rejoindre notre Discord'
      },
      en: {
        home: 'Home',
        logout: 'Logout',
        join_discord: 'Join our Discord'
      }
    };
    return translations[language][key] || key;
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <h1 onClick={() => router.push('/home')} style={{ cursor: 'pointer' }}>
            <i className="fas fa-code"></i> Zrkx Studios
          </h1>
        </div>

        <div className="navbar-center">
          <button onClick={() => router.push('/home')} className="nav-btn home-btn">
            <i className="fas fa-home"></i> {t('home')}
          </button>
        </div>

        <div className="navbar-right">
          <a
            href="https://discord.gg/z8UWsQ3Ze7"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-btn discord-btn"
          >
            <i className="fab fa-discord"></i> {t('join_discord')}
          </a>
          <span className="user-info">
            <i className="fas fa-user-circle"></i> {username}
          </span>
          <button onClick={handleLogout} className="nav-btn logout-btn">
            <i className="fas fa-sign-out-alt"></i> {t('logout')}
          </button>
        </div>
      </nav>

      <style jsx>{`
        .navbar {
          background: rgba(15, 15, 15, 0.95);
          backdrop-filter: blur(10px);
          color: white;
          padding: 15px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 30px rgba(0,0,0,0.5);
          border-bottom: 2px solid rgba(138, 43, 226, 0.4);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .navbar-left,
        .navbar-center,
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .navbar-center {
          flex: 1;
          justify-content: center;
        }

        h1 {
          font-size: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          background: linear-gradient(135deg, #8a2be2, #9d4edd);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
          transition: all 0.3s;
        }

        h1:hover {
          transform: scale(1.05);
        }

        h1 i {
          background: linear-gradient(135deg, #8a2be2, #9d4edd);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nav-btn {
          color: white;
          text-decoration: none;
          padding: 8px 18px;
          border-radius: 20px;
          transition: all 0.3s;
          background: rgba(138, 43, 226, 0.1);
          font-weight: 600;
          border: 1px solid rgba(138, 43, 226, 0.3);
          cursor: pointer;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
        }

        .nav-btn:hover {
          background: rgba(138, 43, 226, 0.2);
          border-color: #8a2be2;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(138, 43, 226, 0.3);
        }

        .home-btn {
          background: linear-gradient(135deg, rgba(138, 43, 226, 0.2), rgba(157, 78, 221, 0.2));
          border-color: rgba(138, 43, 226, 0.5);
          font-size: 14px;
          padding: 8px 20px;
          border-radius: 25px;
        }

        .home-btn:hover {
          background: linear-gradient(135deg, rgba(138, 43, 226, 0.3), rgba(157, 78, 221, 0.3));
          border-color: #8a2be2;
        }

        .discord-btn {
          background: #5865F2 !important;
          border-color: #5865F2 !important;
          border-radius: 20px;
        }

        .discord-btn:hover {
          background: #4752C4 !important;
          border-color: #4752C4 !important;
          box-shadow: 0 4px 15px rgba(88, 101, 242, 0.4) !important;
        }

        .discord-btn i {
          color: white !important;
        }

        .logout-btn {
          background: rgba(220, 38, 38, 0.1);
          border-color: rgba(220, 38, 38, 0.3);
          border-radius: 20px;
        }

        .logout-btn:hover {
          background: rgba(220, 38, 38, 0.2);
          border-color: #dc2626;
          box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
        }

        .user-info {
          color: #aaa;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: rgba(138, 43, 226, 0.05);
          border-radius: 20px;
          border: 1px solid rgba(138, 43, 226, 0.2);
          font-size: 13px;
        }

        .user-info i {
          color: #8a2be2;
          font-size: 16px;
        }

        @media (max-width: 1024px) {
          .navbar {
            flex-wrap: wrap;
            gap: 12px;
          }

          .navbar-center {
            order: 3;
            width: 100%;
            justify-content: flex-start;
          }
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 12px 20px;
          }

          h1 {
            font-size: 20px;
          }

          .nav-btn {
            padding: 7px 14px;
            font-size: 12px;
          }

          .home-btn {
            padding: 7px 16px;
            font-size: 13px;
          }

          .user-info {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
