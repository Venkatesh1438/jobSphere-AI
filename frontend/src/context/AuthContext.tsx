import { createContext, useState, useEffect, ReactNode } from 'react'
import { api } from '../services/api'

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  role: 'CANDIDATE' | 'RECRUITER' | 'ADMIN'
  profile_completed?: boolean
  phone_number?: string
  is_email_verified?: boolean
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<any>
  logout: () => Promise<void>
  loadUser: () => Promise<void>
  registerCandidate: (data: any) => Promise<any>
  registerRecruiter: (data: any) => Promise<any>
  changePassword: (data: any) => Promise<any>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const ensureGuestSession = async () => {
    if (localStorage.getItem('guest_token')) return

    try {
      // Try logging in first
      const loginRes = await api.post('/auth/login/', {
        email: 'guest.user@jobboard.com',
        password: 'GuestUserPassword123!',
      })
      if (loginRes.data?.success && loginRes.data?.data) {
        localStorage.setItem('guest_token', loginRes.data.data.access)
      }
    } catch (err) {
      // If login fails, try registering the guest user
      try {
        await api.post('/auth/register/candidate/', {
          first_name: 'Guest',
          last_name: 'User',
          email: 'guest.user@jobboard.com',
          password: 'GuestUserPassword123!',
          confirm_password: 'GuestUserPassword123!',
        })
        
        // Log in after successful registration
        const loginRes = await api.post('/auth/login/', {
          email: 'guest.user@jobboard.com',
          password: 'GuestUserPassword123!',
        })
        if (loginRes.data?.success && loginRes.data?.data) {
          localStorage.setItem('guest_token', loginRes.data.data.access)
        }
      } catch (regErr) {
        console.error('Failed to initialize guest session', regErr)
      }
    }
  }

  const loadUser = async () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      await ensureGuestSession()
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const response = await api.get('/auth/me/')
      if (response.data?.success && response.data?.data) {
        const userData = response.data.data
        if (userData.email === 'guest.user@jobboard.com') {
          setUser(null)
        } else {
          setUser(userData)
        }
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Failed to load user profile', error)
      // Clear token since me failed (most likely expired/invalid)
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      setUser(null)
      await ensureGuestSession()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUser()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await api.post('/auth/login/', { email, password })

      // Validate the expected nested response shape from the backend:
      // { success: true, data: { access, refresh, user } }
      if (response.data?.success && response.data?.data) {
        const { access, refresh, user: userData } = response.data.data

        if (!access || !refresh || !userData) {
          // Backend returned 200 + success=true but fields are missing
          const err: any = new Error('Incomplete authentication data received from server.')
          err.response = { data: { message: 'Incomplete authentication data received from server.' } }
          throw err
        }

        localStorage.setItem('access_token', access)
        localStorage.setItem('refresh_token', refresh)
        setUser(userData)
        return response.data
      }

      // Backend returned 200 but success flag is false or data is absent
      const message =
        response.data?.message ||
        response.data?.detail ||
        'Login failed. Please check your credentials.'
      const err: any = new Error(message)
      err.response = { data: { message } }
      throw err
    } catch (error) {
      setUser(null)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    const refreshToken = localStorage.getItem('refresh_token')
    
    // We attempt backend logout, but we clear client session regardless
    try {
      if (refreshToken) {
        await api.post('/auth/logout/', { refresh: refreshToken })
      }
    } catch (error) {
      console.error('Logout error on backend', error)
    } finally {
      localStorage.clear()
      setUser(null)
      window.location.href = '/'
    }
  }

  const registerCandidate = async (data: any) => {
    try {
      const response = await api.post('/auth/register/candidate/', data)
      return response.data
    } catch (error) {
      throw error
    }
  }

  const registerRecruiter = async (data: any) => {
    try {
      const response = await api.post('/auth/register/recruiter/', data)
      return response.data
    } catch (error) {
      throw error
    }
  }

  const changePassword = async (data: any) => {
    try {
      const response = await api.post('/auth/change-password/', data)
      return response.data
    } catch (error) {
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    loadUser,
    registerCandidate,
    registerRecruiter,
    changePassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
