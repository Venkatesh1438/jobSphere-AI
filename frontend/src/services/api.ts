import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach access token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Intercept expired access tokens to run silent Refresh Token validation
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('refresh_token')
      
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/api/auth/token/refresh/`, {
            refresh: refreshToken,
          })
          
          const newAccessToken = response.data.access
          localStorage.setItem('access_token', newAccessToken)
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          }
          return api(originalRequest)
        } catch (refreshError) {
          // Token expired or revoked, flush session and log out
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/auth/login'
          return Promise.reject(refreshError)
        }
      }
    }
    return Promise.reject(error)
  }
)
