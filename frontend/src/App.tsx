import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { ThemeProvider } from './hooks/useTheme'
import AppRoutes from './routes/AppRoutes'
import ToastProvider from './components/ui/ToastProvider'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <AppRoutes />
            {/* Custom configured Toaster container */}
            <ToastProvider />
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
