'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { translations } from '@/lib/translations';

interface Leak {
  _id: string;
  title: string;
  message: string;
  link: string;
  image?: string;
  views: number;
  downloads: number;
  username: string;
  categoryName: string;
  categorySlug: string;
  createdAt: string;
}

interface Comment {
  _id: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function LeakDetailPage() {
  const router = useRouter();
  const params = useParams();
  const leakId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [leak, setLeak] = useState<Leak | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [similarLeaks, setSimilarLeaks] = useState<Leak[]>([]);
  const [loading, setLoading] = useState(true);

  const [newComment, setNewComment] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user && leakId) {
      fetchLeak();
      fetchComments();
    }
  }, [user, leakId]);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      setUser(response.data.user);
    } catch (error) {
      router.push('/login');
    }
  };

  const fetchLeak = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/leaks/${leakId}`);
      setLeak(response.data.leak);
      setSimilarLeaks(response.data.similarLeaks || []);
    } catch (error) {
      console.error('Error fetching leak:', error);
      alert('Leak not found');
      router.push('/home');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/comments?leakId=${leakId}`);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleDownload = async () => {
    if (!leak) return;
    
    try {
      await axios.post(`/api/leaks/${leakId}/download`);
      window.open(leak.link, '_blank');
      setLeak({ ...leak, downloads: leak.downloads + 1 });
    } catch (error) {
      console.error('Error tracking download:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.comment.trim()) {
      alert('Please enter a comment');
      return;
    }

    try {
      await axios.post('/api/comments', {
        leakId,
        rating: newComment.rating,
        comment: newComment.comment
      });

      setNewComment({ rating: 5, comment: '' });
      fetchComments();
    } catch (error: any) {
      console.error('Error posting comment:', error);
      alert(error.response?.data?.error || 'Error posting comment');
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, onChange?: (rating: number) => void) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <i
            key={star}
            className={`fas fa-star ${star <= rating ? 'filled' : ''}`}
            onClick={() => interactive && onChange && onChange(star)}
            style={{ cursor: interactive ? 'pointer' : 'default' }}
          ></i>
        ))}
      </div>
    );
  };

  if (loading || !user || !leak) {
    return (
      <>
        {user && <Navbar username={user.username} language={user.language} />}
        <div className="loading"><i className="fas fa-spinner fa-spin"></i></div>
      </>
    );
  }

  const t = (key: string) => translations[user.language as 'fr' | 'en'][key as keyof typeof translations.fr] || key;

  const averageRating = comments.length > 0
    ? comments.reduce((sum, c) => sum + c.rating, 0) / comments.length
    : 0;

  return (
    <>
      <Navbar username={user.username} language={user.language} />
      
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <button className="btn btn-secondary" onClick={() => router.push('/home')} style={{ marginBottom: '20px' }}>
          <i className="fas fa-arrow-left"></i> {t('back_to_leaks')}
        </button>

        <div className="leak-detail-container">
          <div className="leak-main">
            {leak.image && (
              <div className="leak-detail-image">
                <img src={leak.image} alt={leak.title} />
              </div>
            )}

            <div className="leak-header">
              <h1 className="leak-detail-title">{leak.title}</h1>
              <span className="category-badge">{leak.categoryName}</span>
            </div>

            <div className="leak-info">
              <div className="info-item">
                <i className="fas fa-user"></i>
                <span>{t('published_by')} <strong>{leak.username}</strong></span>
              </div>
              <div className="info-item">
                <i className="fas fa-calendar"></i>
                <span>{new Date(leak.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="info-item">
                <i className="fas fa-eye"></i>
                <span>{leak.views} {t('views')}</span>
              </div>
              <div className="info-item">
                <i className="fas fa-download"></i>
                <span>{leak.downloads} {t('downloads')}</span>
              </div>
              {comments.length > 0 && (
                <div className="info-item">
                  {renderStars(Math.round(averageRating))}
                  <span>({comments.length})</span>
                </div>
              )}
            </div>

            <div className="leak-description">
              <h3><i className="fas fa-align-left"></i> Description</h3>
              <p>{leak.message}</p>
            </div>

            <button className="btn btn-primary btn-large download-btn" onClick={handleDownload}>
              <i className="fas fa-download"></i> {t('download_now')}
            </button>
          </div>

          <div className="leak-sidebar">
            {similarLeaks.length > 0 && (
              <div className="similar-leaks">
                <h3><i className="fas fa-layer-group"></i> {t('similar_leaks')}</h3>
                {similarLeaks.map((similar) => (
                  <div
                    key={similar._id}
                    className="similar-leak-card"
                    onClick={() => router.push(`/leak/${similar._id}`)}
                  >
                    {similar.image && (
                      <img src={similar.image} alt={similar.title} />
                    )}
                    <div className="similar-leak-info">
                      <h4>{similar.title}</h4>
                      <div className="similar-leak-stats">
                        <span><i className="fas fa-eye"></i> {similar.views}</span>
                        <span><i className="fas fa-download"></i> {similar.downloads}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="comments-section">
          <h2><i className="fas fa-comments"></i> {t('comments')} ({comments.length})</h2>

          <div className="add-comment">
            <h3><i className="fas fa-pen"></i> {t('leave_comment')}</h3>
            <form onSubmit={handleSubmitComment}>
              <div className="rating-input">
                <label>{t('your_rating')}</label>
                {renderStars(newComment.rating, true, (rating) => setNewComment({ ...newComment, rating }))}
              </div>
              <textarea
                value={newComment.comment}
                onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
                placeholder={t('leave_comment')}
                rows={4}
                required
              />
              <button type="submit" className="btn btn-primary">
                <i className="fas fa-paper-plane"></i> {t('post')}
              </button>
            </form>
          </div>

          <div className="comments-list">
            {comments.length === 0 ? (
              <div className="no-comments">
                <i className="fas fa-comment-slash"></i>
                <p>{t('no_comments')}</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="comment-card">
                  <div className="comment-header">
                    <div className="comment-author">
                      <i className="fas fa-user-circle"></i>
                      <strong>{comment.username}</strong>
                    </div>
                    <div className="comment-rating">
                      {renderStars(comment.rating)}
                    </div>
                  </div>
                  <p className="comment-text">{comment.comment}</p>
                  <div className="comment-date">
                    <i className="fas fa-clock"></i>
                    {new Date(comment.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .btn-secondary {
          background: rgba(138, 43, 226, 0.1);
          color: white;
          border: 1px solid rgba(138, 43, 226, 0.3);
        }

        .btn-secondary:hover {
          background: rgba(138, 43, 226, 0.2);
          border-color: #8a2be2;
        }

        .leak-detail-container {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 30px;
          margin-bottom: 40px;
        }

        @media (max-width: 968px) {
          .leak-detail-container {
            grid-template-columns: 1fr;
          }
        }

        .leak-main {
          background: rgba(20, 20, 20, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 30px;
          border: 1px solid rgba(138, 43, 226, 0.2);
        }

        .leak-detail-image {
          width: 100%;
          max-height: 400px;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 25px;
          border: 1px solid rgba(138, 43, 226, 0.3);
        }

        .leak-detail-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .leak-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 20px;
        }

        .leak-detail-title {
          font-size: 32px;
          font-weight: 700;
          color: white;
          flex: 1;
        }

        .category-badge {
          background: rgba(138, 43, 226, 0.2);
          color: #8a2be2;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          border: 1px solid rgba(138, 43, 226, 0.3);
          white-space: nowrap;
        }

        .leak-info {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(138, 43, 226, 0.2);
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #aaa;
          font-size: 14px;
        }

        .info-item i {
          color: #8a2be2;
        }

        .leak-description {
          margin-bottom: 25px;
        }

        .leak-description h3 {
          font-size: 20px;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #8a2be2;
        }

        .leak-description p {
          color: #ccc;
          line-height: 1.8;
          white-space: pre-wrap;
        }

        .download-btn {
          width: 100%;
          padding: 18px;
          font-size: 18px;
          font-weight: 700;
        }

        .leak-sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .similar-leaks {
          background: rgba(20, 20, 20, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 20px;
          border: 1px solid rgba(138, 43, 226, 0.2);
        }

        .similar-leaks h3 {
          font-size: 18px;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #8a2be2;
        }

        .similar-leak-card {
          display: flex;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          background: rgba(10, 10, 10, 0.5);
          border: 1px solid rgba(138, 43, 226, 0.1);
          cursor: pointer;
          transition: all 0.3s;
          margin-bottom: 10px;
        }

        .similar-leak-card:hover {
          border-color: #8a2be2;
          transform: translateX(5px);
        }

        .similar-leak-card img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 6px;
        }

        .similar-leak-info {
          flex: 1;
        }

        .similar-leak-info h4 {
          font-size: 14px;
          margin-bottom: 8px;
          color: white;
        }

        .similar-leak-stats {
          display: flex;
          gap: 12px;
          font-size: 12px;
          color: #888;
        }

        .similar-leak-stats i {
          color: #8a2be2;
        }

        .comments-section {
          background: rgba(20, 20, 20, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 30px;
          border: 1px solid rgba(138, 43, 226, 0.2);
        }

        .comments-section h2 {
          font-size: 24px;
          margin-bottom: 25px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #8a2be2;
        }

        .add-comment {
          background: rgba(10, 10, 10, 0.5);
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 30px;
          border: 1px solid rgba(138, 43, 226, 0.1);
        }

        .add-comment h3 {
          font-size: 18px;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #8a2be2;
        }

        .rating-input {
          margin-bottom: 15px;
        }

        .rating-input label {
          display: block;
          margin-bottom: 8px;
          color: #aaa;
          font-weight: 600;
        }

        .stars {
          display: flex;
          gap: 5px;
          font-size: 24px;
        }

        .stars i {
          color: #333;
          transition: color 0.2s;
        }

        .stars i.filled {
          color: #ffd700;
        }

        .stars i:hover {
          color: #ffd700;
        }

        .comments-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .comment-card {
          background: rgba(10, 10, 10, 0.5);
          padding: 20px;
          border-radius: 10px;
          border: 1px solid rgba(138, 43, 226, 0.1);
        }

        .comment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .comment-author {
          display: flex;
          align-items: center;
          gap: 8px;
          color: white;
          font-weight: 600;
        }

        .comment-author i {
          color: #8a2be2;
          font-size: 20px;
        }

        .comment-rating .stars {
          font-size: 16px;
        }

        .comment-text {
          color: #ccc;
          line-height: 1.6;
          margin-bottom: 10px;
        }

        .comment-date {
          color: #666;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .no-comments {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .no-comments i {
          font-size: 48px;
          margin-bottom: 15px;
          display: block;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
          color: #8a2be2;
          font-size: 32px;
        }

        .btn-large {
          padding: 15px;
          font-size: 16px;
        }
      `}</style>
    </>
  );
}
