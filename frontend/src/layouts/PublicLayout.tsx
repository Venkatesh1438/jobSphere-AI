import { Link, Outlet } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { Sun, Moon, Briefcase } from 'lucide-react'

export default function PublicLayout() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200 dark:bg-darkBg">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-darkBg/70 border-b border-slate-200 dark:border-darkBorder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-primary-600 dark:text-primary-400">
            <Briefcase className="h-6 w-6" />
            <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-white">JobSphere <span className="text-primary-600 dark:text-primary-400">AI</span></span>
          </Link>
          
          <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Landing Page</Link>
            <Link to="/about" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">About</Link>
            <Link to="/jobs" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Jobs</Link>
            <Link to="/companies" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Companies</Link>
            <Link to="/contact" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Contact</Link>
            <Link to="/pricing" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Pricing</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-darkBorder transition-colors text-slate-600 dark:text-slate-300"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link 
              to="/auth/login" 
              className="hidden sm:inline-block text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/auth/register" 
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-primary-500/20 hover:scale-[1.02]"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="font-bold text-white text-lg flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-primary-500" />
              <span>JobSphere AI</span>
            </span>
            <p className="mt-4 text-sm text-slate-500">Enterprise AI recruiting systems redefining global talent acquisitions.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/jobs" className="hover:text-white transition-colors">Find Jobs</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing Details</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-850 text-center text-xs text-slate-600">
          &copy; {new Date().getFullYear()} JobSphere AI. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
