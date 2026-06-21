import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data for development without backend
const mockUsers = [
  { id: 1, username: 'admin', email: 'admin@example.com', password: 'admin123' },
  { id: 2, username: 'user1', email: 'user1@example.com', password: 'user1234' },
];

const mockPosts = [
  {
    id: 1,
    title: 'Первый пост',
    content: 'Это первый тестовый пост в нашем блоге. Здесь вы можете увидеть, как выглядит основной контент статьи.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    author_id: 1,
    author: { id: 1, username: 'admin' },
    created_at: '2024-01-15T10:00:00',
    updated_at: '2024-01-15T10:00:00',
  },
  {
    id: 2,
    title: 'React - отличная библиотека',
    content: 'React - это декларативная, эффективная и гибкая библиотека JavaScript для создания пользовательских интерфейсов. Она позволяет создавать переиспользуемые UI-компоненты.',
    author_id: 1,
    author: { id: 1, username: 'admin' },
    created_at: '2024-01-20T14:30:00',
    updated_at: '2024-01-20T14:30:00',
  },
  {
    id: 3,
    title: 'FastAPI - быстрый фреймворк',
    content: 'FastAPI - это современный, быстрый (высокопроизводительный) фреймворк для создания API на Python. Он основан на типичных средствах Python 3.7+ и использует типизацию для автоматической валидации данных и генерации документации.',
    author_id: 2,
    author: { id: 2, username: 'user1' },
    created_at: '2024-02-01T09:15:00',
    updated_at: '2024-02-01T09:15:00',
  },
];

const mockComments = [
  { id: 1, post_id: 1, author_id: 2, content: 'Отличный первый пост!', author: { id: 2, username: 'user1' }, created_at: '2024-01-15T11:00:00' },
  { id: 2, post_id: 1, author_id: 1, content: 'Спасибо!', author: { id: 1, username: 'admin' }, created_at: '2024-01-15T12:00:00' },
  { id: 3, post_id: 2, author_id: 2, content: 'Согласен, React действительно удобен', author: { id: 2, username: 'user1' }, created_at: '2024-01-21T09:00:00' },
];

let currentUser = null;
let posts = [...mockPosts];
let comments = [...mockComments];
let nextPostId = 4;
let nextCommentId = 4;

// Mock API functions
const mockAPI = {
  // Auth
  register: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const existingUser = mockUsers.find(u => u.username === data.username || u.email === data.email);
    if (existingUser) {
      const error = new Error('Пользователь уже существует');
      error.response = { data: { detail: 'Пользователь уже существует' } };
      throw error;
    }
    const newUser = {
      id: mockUsers.length + 1,
      username: data.username,
      email: data.email,
    };
    mockUsers.push({ ...newUser, password: data.password });
    currentUser = newUser;
    return { data: newUser };
  },

  login: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = mockUsers.find(u => 
      (u.username === data.username || u.email === data.username) && u.password === data.password
    );
    if (!user) {
      const error = new Error('Неверное имя пользователя или пароль');
      error.response = { data: { detail: 'Неверное имя пользователя или пароль' } };
      throw error;
    }
    const { password: _, ...userWithoutPassword } = user;
    currentUser = userWithoutPassword;
    return { data: { user: userWithoutPassword } };
  },

  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    currentUser = null;
    return { data: { message: 'Вы вышли из системы' } };
  },

  getMe: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (!currentUser) {
      const error = new Error('Не авторизован');
      error.response = { data: { detail: 'Не авторизован' }, status: 401 };
      throw error;
    }
    return { data: currentUser };
  },

  updateProfile: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (!currentUser) {
      const error = new Error('Не авторизован');
      error.response = { data: { detail: 'Не авторизован' }, status: 401 };
      throw error;
    }
    if (data.username) {
      const existing = mockUsers.find(u => u.username === data.username && u.id !== currentUser.id);
      if (existing) {
        throw new Error('Пользователь уже существует');
      }
      currentUser.username = data.username;
    }
    if (data.email) {
      const existing = mockUsers.find(u => u.email === data.email && u.id !== currentUser.id);
      if (existing) {
        throw new Error('Email уже используется');
      }
      currentUser.email = data.email;
    }
    return { data: currentUser };
  },

  // Posts
  getAllPosts: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { data: posts };
  },

  getPostById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const post = posts.find(p => p.id === parseInt(id));
    if (!post) {
      const error = new Error('Пост не найден');
      error.response = { data: { detail: 'Пост не найден' }, status: 404 };
      throw error;
    }
    return { data: post };
  },

  createPost: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (!currentUser) {
      const error = new Error('Не авторизован');
      error.response = { data: { detail: 'Не авторизован' }, status: 401 };
      throw error;
    }
    const newPost = {
      id: nextPostId++,
      title: data.title,
      content: data.content,
      author_id: currentUser.id,
      author: { id: currentUser.id, username: currentUser.username },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    posts.unshift(newPost);
    return { data: newPost };
  },

  updatePost: async (id, data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (!currentUser) {
      const error = new Error('Не авторизован');
      error.response = { data: { detail: 'Не авторизован' }, status: 401 };
      throw error;
    }
    const postIndex = posts.findIndex(p => p.id === parseInt(id));
    if (postIndex === -1) {
      const error = new Error('Пост не найден');
      error.response = { data: { detail: 'Пост не найден' }, status: 404 };
      throw error;
    }
    if (posts[postIndex].author_id !== currentUser.id) {
      const error = new Error('Нет прав для редактирования');
      error.response = { data: { detail: 'Нет прав для редактирования' }, status: 403 };
      throw error;
    }
    posts[postIndex] = {
      ...posts[postIndex],
      title: data.title,
      content: data.content,
      updated_at: new Date().toISOString(),
    };
    return { data: posts[postIndex] };
  },

  deletePost: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (!currentUser) {
      const error = new Error('Не авторизован');
      error.response = { data: { detail: 'Не авторизован' }, status: 401 };
      throw error;
    }
    const postIndex = posts.findIndex(p => p.id === parseInt(id));
    if (postIndex === -1) {
      const error = new Error('Пост не найден');
      error.response = { data: { detail: 'Пост не найден' }, status: 404 };
      throw error;
    }
    if (posts[postIndex].author_id !== currentUser.id) {
      const error = new Error('Нет прав для удаления');
      error.response = { data: { detail: 'Нет прав для удаления' }, status: 403 };
      throw error;
    }
    comments = comments.filter(c => c.post_id !== parseInt(id));
    posts.splice(postIndex, 1);
    return { data: { message: 'Пост удален' } };
  },

  // Comments
  getCommentsByPost: async (postId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { data: comments.filter(c => c.post_id === parseInt(postId)) };
  },

  createComment: async (postId, data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (!currentUser) {
      const error = new Error('Не авторизован');
      error.response = { data: { detail: 'Не авторизован' }, status: 401 };
      throw error;
    }
    const newComment = {
      id: nextCommentId++,
      post_id: parseInt(postId),
      author_id: currentUser.id,
      content: data.content,
      author: { id: currentUser.id, username: currentUser.username },
      created_at: new Date().toISOString(),
    };
    comments.push(newComment);
    return { data: newComment };
  },

  updateComment: async (postId, commentId, data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (!currentUser) {
      const error = new Error('Не авторизован');
      error.response = { data: { detail: 'Не авторизован' }, status: 401 };
      throw error;
    }
    const commentIndex = comments.findIndex(c => c.id === parseInt(commentId) && c.post_id === parseInt(postId));
    if (commentIndex === -1) {
      const error = new Error('Комментарий не найден');
      error.response = { data: { detail: 'Комментарий не найден' }, status: 404 };
      throw error;
    }
    if (comments[commentIndex].author_id !== currentUser.id) {
      const error = new Error('Нет прав для редактирования');
      error.response = { data: { detail: 'Нет прав для редактирования' }, status: 403 };
      throw error;
    }
    comments[commentIndex] = {
      ...comments[commentIndex],
      content: data.content,
    };
    return { data: comments[commentIndex] };
  },

  deleteComment: async (postId, commentId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (!currentUser) {
      const error = new Error('Не авторизован');
      error.response = { data: { detail: 'Не авторизован' }, status: 401 };
      throw error;
    }
    const commentIndex = comments.findIndex(c => c.id === parseInt(commentId) && c.post_id === parseInt(postId));
    if (commentIndex === -1) {
      const error = new Error('Комментарий не найден');
      error.response = { data: { detail: 'Комментарий не найден' }, status: 404 };
      throw error;
    }
    if (comments[commentIndex].author_id !== currentUser.id) {
      const error = new Error('Нет прав для удаления');
      error.response = { data: { detail: 'Нет прав для удаления' }, status: 403 };
      throw error;
    }
    comments.splice(commentIndex, 1);
    return { data: { message: 'Комментарий удален' } };
  },
};

// Determine if we should use mock data
const useMock = import.meta.env.VITE_USE_MOCK === 'true';

// Auth endpoints
export const authAPI = useMock ? mockAPI : {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Posts endpoints
export const postsAPI = useMock ? mockAPI : {
  getAll: () => api.get('/posts'),
  getById: (id) => api.get(`/posts/${id}`),
  create: (data) => api.post('/posts', data),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
};

// Comments endpoints
export const commentsAPI = useMock ? mockAPI : {
  getAllByPost: (postId) => api.get(`/posts/${postId}/comments`),
  create: (postId, data) => api.post(`/posts/${postId}/comments`, data),
  update: (postId, commentId, data) => api.put(`/posts/${postId}/comments/${commentId}`, data),
  delete: (postId, commentId) => api.delete(`/posts/${postId}/comments/${commentId}`),
};

// Get current mock user (for testing)
export const getMockUser = () => currentUser;

// Reset mock data
export const resetMockData = () => {
  posts = [...mockPosts];
  comments = [...mockComments];
  nextPostId = 4;
  nextCommentId = 4;
  currentUser = null;
};

export default api;
