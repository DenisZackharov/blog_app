import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../api';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await postsAPI.getAllPosts();
      setPosts(response.data);
    } catch (err) {
      setError('Ошибка загрузки постов');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Загрузка постов...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Все посты</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      {posts.length === 0 ? (
        <div className="empty-state">
          <h3>Пока нет постов</h3>
          <p>Будьте первым, кто создаст пост!</p>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <h3>
                <Link to={`/posts/${post.id}`}>{post.title}</Link>
              </h3>
              <p className="post-author">
                Автор: {post.author?.username || 'Неизвестный'}
              </p>
              <p className="post-preview">{post.content}</p>
              <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#95a5a6' }}>
                {new Date(post.created_at).toLocaleDateString('ru-RU')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
