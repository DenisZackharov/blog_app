import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postsAPI, commentsAPI } from '../api';
// import { useAuth } from '../context/AuthContext';

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  // const { user, isAuthenticated } = useAuth();
  const user = null;
  const isAuthenticated = false;
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Comment form state
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // Edit comment state
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [postResponse, commentsResponse] = await Promise.all([
        postsAPI.getById(id),
        commentsAPI.getAllByPost(id),
      ]);
      setPost(postResponse.data);
      setComments(commentsResponse.data);
    } catch (err) {
      setError('Ошибка загрузки поста');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Вы уверены, что хотите удалить этот пост?')) {
      try {
        await postsAPI.delete(id);
        navigate('/');
      } catch (err) {
        setError(err.response?.data?.detail || 'Ошибка удаления поста');
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setSubmitting(true);
    setSubmitError('');
    
    try {
      const response = await commentsAPI.create(id, { content: newComment });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (err) {
      setSubmitError('Ошибка отправки комментария');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот комментарий?')) {
      try {
        await commentsAPI.delete(id, commentId);
        setComments(comments.filter(c => c.id !== commentId));
        if (editingComment === commentId) {
          setEditingComment(null);
        }
      } catch (err) {
        setError(err.response?.data?.detail || 'Ошибка удаления комментария');
      }
    }
  };

  const handleEditComment = async (commentId) => {
    try {
      await commentsAPI.update(id, commentId, { content: editCommentText });
      setComments(comments.map(c => 
        c.id === commentId ? { ...c, content: editCommentText } : c
      ));
      setEditingComment(null);
      setEditCommentText('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка обновления комментария');
    }
  };

  const canEditPost = user && post && user.id === post.author_id;
  const canEditComment = (comment) => user && comment.author_id === user.id;

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Загрузка поста...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="empty-state">
        <h3>Пост не найден</h3>
        <Link to="/" style={{ color: '#3498db' }}>Вернуться на главную</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="post-detail">
        <Link to="/" style={{ color: '#3498db', textDecoration: 'none' }}>← Назад к постам</Link>
        
        <h1>{post.title}</h1>
        <div className="post-meta">
          Автор: <strong>{post.author?.username || 'Неизвестный'}</strong> | 
          Опубликовано: {new Date(post.created_at).toLocaleDateString('ru-RU')}
        </div>
        
        <div className="post-body">{post.content}</div>
        
        {canEditPost && (
          <div className="post-actions">
            <Link to={`/posts/${id}/edit`}>
              <button className="btn-edit">Редактировать</button>
            </Link>
            <button className="btn-delete" onClick={handleDeletePost}>Удалить</button>
          </div>
        )}
      </div>

      <div className="comments-section">
        <h2>Комментарии ({comments.length})</h2>

        {isAuthenticated ? (
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Напишите комментарий..."
              required
            />
            {submitError && <div className="error-message">{submitError}</div>}
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Отправка...' : 'Отправить комментарий'}
            </button>
          </form>
        ) : (
          <p style={{ marginBottom: '1.5rem', color: '#7f8c8d' }}>
            <Link to="/login" style={{ color: '#3498db' }}>Войдите</Link> чтобы оставить комментарий.
          </p>
        )}

        {comments.length === 0 ? (
          <p style={{ color: '#95a5a6' }}>Пока нет комментариев. Будьте первым!</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="comment">
              <div className="comment-author">{comment.author?.username || 'Неизвестный'}</div>
              <div className="comment-date">
                {new Date(comment.created_at).toLocaleString('ru-RU')}
              </div>
              
              {editingComment === comment.id ? (
                <div>
                  <textarea
                    value={editCommentText}
                    onChange={(e) => setEditCommentText(e.target.value)}
                    style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="comment-btn comment-btn-edit" 
                      onClick={() => handleEditComment(comment.id)}
                    >
                      Сохранить
                    </button>
                    <button 
                      className="comment-btn" 
                      style={{ backgroundColor: '#95a5a6', color: '#fff' }}
                      onClick={() => setEditingComment(null)}
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="comment-body">{comment.content}</div>
                  {canEditComment(comment) && (
                    <div className="comment-actions">
                      <button 
                        className="comment-btn comment-btn-edit" 
                        onClick={() => {
                          setEditingComment(comment.id);
                          setEditCommentText(comment.content);
                        }}
                      >
                        Редактировать
                      </button>
                      <button 
                        className="comment-btn comment-btn-delete" 
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        Удалить
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
