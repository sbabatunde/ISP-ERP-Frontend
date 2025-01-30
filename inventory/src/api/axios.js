import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://10.0.0.253:8000/api', // Laravel API base URL
    headers: {
        'Content-Type': 'application/json',
        // Accept: 'application/json',
    },
    // withCredentials: true, // Required for Laravel Sanctum
});

// Function to fetch CSRF token before making requests
// export const getCsrfToken = async () => {
//     await apiClient.get('/sanctum/csrf-cookie'); // Laravel sets the XSRF-TOKEN cookie
// };

// // Attach CSRF token from cookies (optional)
// apiClient.interceptors.request.use((config) => {
//     const token = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='));
//     if (token) {
//         config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token.split('=')[1]);
//     }
//     return config;
// }, (error) => {
//     return Promise.reject(error);
// });

export default apiClient;
