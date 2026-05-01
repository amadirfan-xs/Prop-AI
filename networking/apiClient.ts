import axios from 'axios';


const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('Unauthorized access - potential token expiration');
        } else if (error.response?.status === 403) {
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('api:error:403', { detail: error.response?.data }));
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
