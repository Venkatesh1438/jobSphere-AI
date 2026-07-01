import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { 
  Sun, Moon, LayoutDashboard, Users, Building2, Briefcase, 
  FileSpreadsheet, BarChart, Settings, LogOut, Menu, X, ShieldAlert 
} from 'lucide-react'

export default function AdminLayout() {
  const { theme, toggleTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manage Users', path: '/admin/users', icon: Users },
    { name: 'Manage Recruiters', path: '/admin/recruiters', icon: ShieldAlert },
    { name: 'Manage Companies', path: '/admin/companies', icon: Building2 },
    { name: 'Manage Jobs', path: '/admin/jobs', icon: Briefcase },
    { name: 'System Reports', path: '/admin/reports', icon: FileSpreadsheet },
    { name: 'System Analytics', path: '/admin/analytics', icon: BarChart },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
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
        fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-slate-900 text-slate-400 border-r border-slate-850
        transform lg:transform-none lg:opacity-100 lg:relative transition-all duration-300
        ${sidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <Link to="/" className="flex items-center space-x-2 text-white">
            <Briefcase className="h-6 w-6 text-primary-500" />
            <span className="font-bold text-lg tracking-tight">JobSphere <span className="text-primary-500">Admin</span></span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded-lg hover:bg-slate-850 text-white">
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
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-950/20 transition-all"
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
                placeholder="Search system logs, users, companies..." 
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
              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center font-bold text-red-650">A</div>
              <span className="text-sm font-medium hidden md:inline-block">System Root Admin</span>
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
