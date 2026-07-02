import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Loader from '../components/ui/Loader'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: ('CANDIDATE' | 'RECRUITER' | 'ADMIN')[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader size="lg" label="Checking credentials..." />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    // Redirect to login but save the current location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // User is logged in but doesn't have the required role to access this route.
    // Redirect them to their role's default dashboard homepage.
    if (user.role === 'CANDIDATE') {
      return <Navigate to="/candidate" replace />
    } else if (user.role === 'RECRUITER') {
      return <Navigate to="/recruiter" replace />
    } else if (user.role === 'ADMIN') {
      return <Navigate to="/admin" replace />
    }
    // Fallback to home page
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
