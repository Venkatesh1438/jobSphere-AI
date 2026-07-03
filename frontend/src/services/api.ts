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
    // Prevent attaching auth header for public login and register endpoints
    const publicUrls = ['/auth/login/', '/auth/register/candidate/', '/auth/register/recruiter/']
    const isPublic = config.url && publicUrls.some(url => config.url?.endsWith(url))

    if (!isPublic) {
      const token = localStorage.getItem('access_token') || localStorage.getItem('guest_token')
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
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
    
    // Do not attempt token refresh for public login and register requests
    const isAuthRequest = originalRequest.url && (
      originalRequest.url.includes('/auth/login/') ||
      originalRequest.url.includes('/auth/register/')
    )

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
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
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      }
    }
    return Promise.reject(error)
  }
)
