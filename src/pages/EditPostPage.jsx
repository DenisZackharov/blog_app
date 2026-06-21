import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postsAPI } from '../api';

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await postsAPI.getById(id);
      setFormData({
        title: response.data.title,
        content: response.data.content,
      });
    } catch (err) {
      setError('Ошибка загрузки поста');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await postsAPI.updatePost(id, formData);
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Ошибка обновления поста');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Загрузка поста...</p>
      </div>
    );
  }

  return (
    <div className="form-container" style={{ maxWidth: '700px' }}>
      <h2>Редактировать пост</h2>
      
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
          {loading ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </form>
    </div>
  );
}
