import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { 
  Sun, Moon, LayoutDashboard, Building, Briefcase, Users, 
  BarChart3, Bell, Settings, LogOut, Menu, X 
} from 'lucide-react'

export default function RecruiterLayout() {
  const { theme, toggleTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const navItems = [
    { name: 'Dashboard', path: '/recruiter/dashboard', icon: LayoutDashboard },
    { name: 'Company Profile', path: '/recruiter/company', icon: Building },
    { name: 'Manage Jobs', path: '/recruiter/jobs', icon: Briefcase },
    { name: 'Applicants', path: '/recruiter/applicants', icon: Users },
    { name: 'Analytics', path: '/recruiter/analytics', icon: BarChart3 },
    { name: 'Notifications', path: '/recruiter/notifications', icon: Bell },
    { name: 'Settings', path: '/recruiter/settings', icon: Settings },
  ]

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    navigate('/auth/login')
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-darkBg text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-white dark:bg-darkCard border-r border-slate-200 dark:border-darkBorder
        transform lg:transform-none lg:opacity-100 lg:relative transition-all duration-300
        ${sidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-darkBorder">
          <Link to="/" className="flex items-center space-x-2 text-primary-600 dark:text-primary-400">
            <Briefcase className="h-6 w-6" />
            <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-white">JobBoard <span className="text-primary-650 dark:text-primary-450">Recruiter</span></span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-darkBorder">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${isActive 
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' 
                  : 'text-slate-600 dark:text-slate-450 hover:bg-slate-100 dark:hover:bg-darkBorder hover:text-slate-900 dark:hover:text-white'}
              `}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-darkBorder">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-darkCard border-b border-slate-200 dark:border-darkBorder sticky top-0 z-30">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg lg:hidden hover:bg-slate-100 dark:hover:bg-darkBorder"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex-grow max-w-md mx-4 hidden sm:block">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search candidates, resumes, or matching lists..." 
                className="w-full pl-4 pr-10 py-2 rounded-xl text-sm border border-slate-250 dark:border-darkBorder bg-slate-50 dark:bg-darkBg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 ml-auto">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-darkBorder transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <div className="flex items-center space-x-3 border-l border-slate-200 dark:border-darkBorder pl-4">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center font-bold text-emerald-650">R</div>
              <span className="text-sm font-medium hidden md:inline-block">Recruiter Access</span>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

    </div>
  )
}
