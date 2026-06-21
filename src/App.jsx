import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
// import ProtectedRoute from './components/ProtectedRoute';

// Pages
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
// import CreatePostPage from './pages/CreatePostPage';
// import EditPostPage from './pages/EditPostPage';

function App() {
  return (
    // <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Закомментировано - страницы авторизации */}
              {/* <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} /> */}
              <Route path="/" element={<HomePage />} />
              <Route path="/posts/:id" element={<PostDetailPage />} />
              {/* Закомментировано - защищенные маршруты */}
              {/* <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/posts/create"
                element={
                  <ProtectedRoute>
                    <CreatePostPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/posts/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditPostPage />
                  </ProtectedRoute>
                }
              /> */}
            </Routes>
          </main>
        </div>
      </Router>
    // </AuthProvider>
  );
}

export default App;
