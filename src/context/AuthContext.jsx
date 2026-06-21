import { createContext, useContext, useState } from 'react';
// import { authAPI } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Закомментировано - авторизация отключена
  // const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   checkAuth();
  // }, []);

  // const checkAuth = async () => {
  //   try {
  //     const response = await authAPI.getMe();
  //     setUser(response.data);
  //   } catch (err) {
  //     setUser(null);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const login = async (credentials) => {
  //   try {
  //     setError(null);
  //     const response = await authAPI.login(credentials);
  //     setUser(response.data.user || response.data);
  //     return true;
  //   } catch (err) {
  //     const message = err.response?.data?.detail || 'Ошибка входа';
  //     setError(message);
  //     throw err;
  //   }
  // };

  // const register = async (data) => {
  //   try {
  //     setError(null);
  //     const response = await authAPI.register(data);
  //     setUser(response.data.user || response.data);
  //     return true;
  //   } catch (err) {
  //     const message = err.response?.data?.detail || 'Ошибка регистрации';
  //     setError(message);
  //     throw err;
  //   }
  // };

  // const logout = async () => {
  //   try {
  //     await authAPI.logout();
  //   } catch (err) {
  //     // Ignore logout errors
  //   } finally {
  //     setUser(null);
  //   }
  // };

  // const updateUser = async (data) => {
  //   try {
  //     setError(null);
  //     const response = await authAPI.updateProfile(data);
  //     setUser(response.data);
  //     return true;
  //   } catch (err) {
  //     const message = err.response?.data?.detail || 'Ошибка обновления';
  //     setError(message);
  //     throw err;
  //   }
  // };

  return (
    <AuthContext.Provider value={{
      user: null,
      loading: false,
      error: null,
      login: async () => { throw new Error('Auth disabled'); },
      register: async () => { throw new Error('Auth disabled'); },
      logout: async () => {},
      updateUser: async () => { throw new Error('Auth disabled'); },
      isAuthenticated: false,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
