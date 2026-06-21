import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../api';

export default function CreatePostPage() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await postsAPI.createPost(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Ошибка создания поста');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: '700px' }}>
      <h2>Создать пост</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Название</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            minLength={5}
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Тело поста</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            minLength={20}
            style={{ minHeight: '250px' }}
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Создание...' : 'Создать пост'}
        </button>
      </form>
    </div>
  );
}
