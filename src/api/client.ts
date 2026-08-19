import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || (
    import.meta.env.DEV ? 'http://localhost:3001/api' : '/api'
);

const api = axios.create({
    baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('cm_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;
