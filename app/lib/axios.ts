import axios from 'axios'

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE,
    withCredentials: true,
})

api.interceptors.response.use(
    res => res,
    async err => {
        const original = err.config
        if (err.response?.status === 401 && !original._retry) {
            original._retry = true
            try {
                await axios.post('/api/refresh', null, { withCredentials: true })
                return api(original)
            } catch (refreshError) {
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(err)
    }
)

export default api
