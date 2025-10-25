
import axios from 'axios';
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/v1/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token'); 
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

    // axiosInstance.interceptors.response.use(
    //   (response) => {
    //     return response;
    //   },
    //   (error) => {
    //     const { response } = error;

    //     if (response && response.status === 401) {
    //       localStorage.removeItem('token');
    //       window.location.href = '/login';
    //     } else if (response && response.status === 500) {
    //       console.error('Server error', response);
    //     } else {
    //       console.error('API Error', error);
    //     }

    //     return Promise.reject(error);
    //   }
    // );

export default axiosInstance;