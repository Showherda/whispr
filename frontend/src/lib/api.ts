import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000', // point to FastAPI backend
    withCredentials: true,
});

api.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 422) {
            alert('Your session has expired. Please log in again.');
            window.location.href = '/login';
        }
        return Promise.reject(err);
    }
);

export default api;
