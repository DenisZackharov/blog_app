import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          📝 Blog App
        </Link>
        <div className="navbar-links">
          <Link to="/" className="nav-link">Главная</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/posts/create" className="nav-link">Создать пост</Link>
              <Link to="/profile" className="nav-link">
                {user?.username || 'Профиль'}
              </Link>
              <button onClick={handleLogout} className="nav-button logout">
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Войти</Link>
              <Link to="/register" className="nav-link">Регистрация</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
