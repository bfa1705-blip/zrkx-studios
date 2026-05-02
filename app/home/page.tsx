'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { translations } from '@/lib/translations';

interface Leak {
  _id: string;
  title: string;
  message: string;
  image?: string;
  views: number;
  downloads: number;
  username: string;
  categoryName: string;
  categorySlug: string;
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [leaks, setLeaks] = useState<Leak[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (user) {
      fetchLeaks();
    }
  }, [user, selectedCategory, searchQuery]);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      setUser(response.data.user);
    } catch (error) {
      router.push('/login');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchLeaks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);

      const response = await axios.get(`/api/leaks?${params.toString()}`);
      setLeaks(response.data.leaks);
    } catch (error) {
      console.error('Error fetching leaks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeaks();
  };

  if (!user) {
    return <div className="loading"><i className="fas fa-spinner fa-spin"></i></div>;
  }

  const t = (key: string) => translations[user.language as 'fr' | 'en'][key as keyof typeof translations.fr] || key;

  return (
    <>
      <Navbar username={user.username} language={user.language} />
      
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div className="header-section">
          <h1 className="page-title">
            <i className="fas fa-home"></i> {t('home_title')}
          </h1>
          <button className="btn btn-primary" onClick={() => router.push('/add-leak')}>
            <i className="fas fa-plus"></i> {t('add_leak')}
          </button>
        </div>

        <div className="filters-section">
          <div className="filter-group">
            <h3><i className="fas fa-filter"></i> {t('filters')}</h3>
            <div className="category-buttons">
              <button
                className={`category-btn ${selectedCategory === '' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('')}
              >
                {t('all')}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  className={`category-btn ${selectedCategory === cat.slug ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.slug)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder={t('search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn btn-primary">
              <i className="fas fa-search"></i> {t('search_btn')}
            </button>
          </form>
        </div>

        {loading ? (
          <div className="loading"><i className="fas fa-spinner fa-spin"></i></div>
        ) : leaks.length === 0 ? (
          <div className="no-leaks">
            <i className="fas fa-inbox" style={{ fontSize: '64px', color: '#8a2be2', marginBottom: '20px' }}></i>
            <h2>{t('no_leaks')}</h2>
            <p>{t('no_leaks_desc')}</p>
          </div>
        ) : (
          <div className="leaks-grid">
            {leaks.map((leak) => (
              <div key={leak._id} className="leak-card" onClick={() => router.push(`/leak/${leak._id}`)}>
                {leak.image && (
                  <div className="leak-image">
                    <img src={leak.image} alt={leak.title} />
                  </div>
                )}
                <div className="leak-content">
                  <h3 className="leak-title">{leak.title}</h3>
                  <p className="leak-description">{leak.message.substring(0, 100)}...</p>
                  <div className="leak-meta">
                    <span className="category-badge">{leak.categoryName}</span>
                    <span className="leak-stats">
                      <i className="fas fa-eye"></i> {leak.views} {t('views')}
                    </span>
                    <span className="leak-stats">
                      <i className="fas fa-download"></i> {leak.downloads}
                    </span>
                  </div>
                  <div className="leak-footer">
                    <span className="leak-author">
                      <i className="fas fa-user"></i> {t('by')} {leak.username}
                    </span>
                    <button className="view-btn">
                      {t('view_more')} <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }

        .page-title {
          font-size: 32px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, #8a2be2, #9d4edd);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .filters-section {
          background: rgba(20, 20, 20, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 30px;
          border: 1px solid rgba(138, 43, 226, 0.2);
          margin-bottom: 40px;
        }

        .filter-group h3 {
          font-size: 18px;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #8a2be2;
        }

        .category-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .category-btn {
          padding: 10px 20px;
          border-radius: 8px;
          border: 1px solid rgba(138, 43, 226, 0.3);
          background: rgba(138, 43, 226, 0.1);
          color: white;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: 600;
        }

        .category-btn:hover {
          background: rgba(138, 43, 226, 0.2);
          border-color: #8a2be2;
        }

        .category-btn.active {
          background: #8a2be2;
          border-color: #8a2be2;
        }

        .search-form {
          display: flex;
          gap: 10px;
        }

        .search-input {
          flex: 1;
        }

        .leaks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 30px;
        }

        .leak-card {
          background: rgba(20, 20, 20, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          overflow: hidden;
          border: 1px solid rgba(138, 43, 226, 0.2);
          transition: all 0.3s;
          cursor: pointer;
        }

        .leak-card:hover {
          transform: translateY(-5px);
          border-color: #8a2be2;
          box-shadow: 0 8px 30px rgba(138, 43, 226, 0.3);
        }

        .leak-image {
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: rgba(10, 10, 10, 0.5);
        }

        .leak-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .leak-card:hover .leak-image img {
          transform: scale(1.1);
        }

        .leak-content {
          padding: 20px;
        }

        .leak-title {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 10px;
          color: white;
        }

        .leak-description {
          color: #aaa;
          margin-bottom: 15px;
          line-height: 1.5;
        }

        .leak-meta {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 15px;
        }

        .category-badge {
          background: rgba(138, 43, 226, 0.2);
          color: #8a2be2;
          padding: 5px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          border: 1px solid rgba(138, 43, 226, 0.3);
        }

        .leak-stats {
          color: #888;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .leak-stats i {
          color: #8a2be2;
        }

        .leak-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 15px;
          border-top: 1px solid rgba(138, 43, 226, 0.2);
        }

        .leak-author {
          color: #888;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .leak-author i {
          color: #8a2be2;
        }

        .view-btn {
          background: transparent;
          border: none;
          color: #8a2be2;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          transition: all 0.3s;
        }

        .view-btn:hover {
          gap: 10px;
        }

        .no-leaks {
          text-align: center;
          padding: 80px 20px;
          color: #888;
        }

        .no-leaks h2 {
          font-size: 28px;
          margin-bottom: 10px;
          color: white;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
          color: #8a2be2;
          font-size: 32px;
        }
      `}</style>
    </>
  );
}
