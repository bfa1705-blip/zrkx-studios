'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { translations } from '@/lib/translations';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function AddLeakPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    message: '',
    link: '',
    image: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    fetchUser();
    fetchCategories();
  }, []);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=47a856b786346083403463d03a007bce`,
        formData
      );
      return response.data.data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.categoryId || !formData.message || !formData.link) {
      alert(t('all_fields_required'));
      return;
    }

    setLoading(true);

    try {
      let imageUrl = formData.image;
      
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      await axios.post('/api/leaks', {
        ...formData,
        image: imageUrl
      });

      router.push('/home');
    } catch (error: any) {
      console.error('Error creating leak:', error);
      alert(error.response?.data?.error || 'Error creating leak');
    } finally {
      setLoading(false);
    }
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
            <i className="fas fa-plus-circle"></i> {t('add_leak_title')}
          </h1>
          <button className="btn btn-secondary" onClick={() => router.push('/home')}>
            <i className="fas fa-arrow-left"></i> {t('back')}
          </button>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">
                <i className="fas fa-heading"></i> {t('leak_title')}
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={t('leak_title')}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">
                <i className="fas fa-tag"></i> {t('category')}
              </label>
              <select
                id="category"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                required
              >
                <option value="">{t('category')}</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">
                <i className="fas fa-align-left"></i> {t('description')}
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={t('description')}
                rows={6}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="link">
                <i className="fas fa-link"></i> {t('download_link')}
              </label>
              <input
                type="url"
                id="link"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="image">
                <i className="fas fa-image"></i> Image (optional)
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-large" disabled={loading || uploading}>
              {loading || uploading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> {uploading ? 'Uploading...' : 'Publishing...'}
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i> {t('publish_btn')}
                </>
              )}
            </button>
          </form>
        </div>
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

        .btn-secondary {
          background: rgba(138, 43, 226, 0.1);
          color: white;
          border: 1px solid rgba(138, 43, 226, 0.3);
        }

        .btn-secondary:hover {
          background: rgba(138, 43, 226, 0.2);
          border-color: #8a2be2;
        }

        .form-container {
          max-width: 800px;
          margin: 0 auto;
          background: rgba(20, 20, 20, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 40px;
          border: 1px solid rgba(138, 43, 226, 0.2);
        }

        .form-group {
          margin-bottom: 25px;
        }

        .form-group label {
          display: block;
          margin-bottom: 10px;
          font-weight: 600;
          color: #8a2be2;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .file-input {
          padding: 10px;
          cursor: pointer;
        }

        .image-preview {
          margin-top: 15px;
          border-radius: 10px;
          overflow: hidden;
          max-width: 400px;
          border: 1px solid rgba(138, 43, 226, 0.3);
        }

        .image-preview img {
          width: 100%;
          height: auto;
          display: block;
        }

        .btn-large {
          width: 100%;
          padding: 15px;
          font-size: 16px;
          margin-top: 10px;
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
