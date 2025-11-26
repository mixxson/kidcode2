import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:4000/api' })

// Attach token from localStorage if present
api.interceptors.request.use(cfg => {
	try{
		const token = localStorage.getItem('kidcode_token')
		if (token) cfg.headers = { ...cfg.headers, Authorization: 'Bearer ' + token }
	}catch(e){}
	return cfg
})

// Progress API methods
export const progressAPI = {
	getUserProgress: () => api.get('/progress'),
	getLessonProgress: (lessonId) => api.get(`/progress/${lessonId}`),
	updateLessonProgress: (lessonId, status) => api.put(`/progress/${lessonId}`, { status }),
	getStatistics: () => api.get('/progress/statistics')
}

export default api
