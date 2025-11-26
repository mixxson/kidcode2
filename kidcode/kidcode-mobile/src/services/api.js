import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../config';

const api = axios.create({ 
  baseURL: Config.API_URL,
  timeout: Config.API_TIMEOUT,
});

// Attach token from AsyncStorage if present
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('kidcode_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Progress API methods
export const progressAPI = {
  getUserProgress: () => api.get('/progress'),
  getLessonProgress: (lessonId) => api.get(`/progress/${lessonId}`),
  updateLessonProgress: (lessonId, status) => api.put(`/progress/${lessonId}`, { status }),
  getStatistics: () => api.get('/progress/statistics')
};

export default api;
