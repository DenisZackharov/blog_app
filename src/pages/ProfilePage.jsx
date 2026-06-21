import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api';

export default function ProfilePage() {
  const { user, updateUser: contextUpdateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }

      const response = await authAPI.updateProfile(updateData);
      setMessage('Профиль успешно обновлен');
      setEditing(false);
      
      // Update user in context
      if (contextUpdateUser) {
        // Reload to get updated user data
        window.location.reload();
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка обновления');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Загрузка профиля...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2 className="page-title">Профиль</h2>
      
      <div className="profile-info">
        <h2>Информация об аккаунте</h2>
        <div className="profile-field">
          <label>ID</label>
          <p>{user.id}</p>
        </div>
        <div className="profile-field">
          <label>Имя пользователя</label>
          <p>{user.username}</p>
        </div>
        <div className="profile-field">
          <label>Email</label>
          <p>{user.email}</p>
        </div>
      </div>

      <h2 style={{ marginBottom: '1rem' }}>Редактировать профиль</h2>
      
      {message && <div className="error-message" style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}>{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Имя пользователя</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={!editing}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!editing}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Новый пароль (оставьте пустым, если не меняете)</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={!editing}
            minLength={6}
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {editing ? (
            <>
              <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={loading}>
                {loading ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button 
                type="button" 
                className="btn-primary" 
                style={{ flex: 1, backgroundColor: '#95a5a6' }} 
                onClick={() => {
                  setEditing(false);
                  setFormData({
                    username: user.username || '',
                    email: user.email || '',
                    password: '',
                  });
                }}
              >
                Отмена
              </button>
            </>
          ) : (
            <button type="button" className="btn-primary" style={{ backgroundColor: '#f39c12' }} onClick={() => setEditing(true)}>
              Редактировать
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
