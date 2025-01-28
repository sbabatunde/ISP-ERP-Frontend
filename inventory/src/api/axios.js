import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://10.0.0.253:8000/api', // Laravel API base URL
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    withCredentials: true, // If you use Laravel Sanctum for authentication
});

export default apiClient;
