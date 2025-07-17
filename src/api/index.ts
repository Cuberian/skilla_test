import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.skilla.ru',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
    },
});

export default api;