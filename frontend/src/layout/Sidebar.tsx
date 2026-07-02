import { NavLink, Link } from 'react-router-dom'
import { Briefcase, LayoutDashboard, Building2, LogOut, X, Users, FileText, User } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

interface SidebarProps {
  onClose?: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { user, logout } = useAuth()

  const getNavItems = () => {
    if (user?.role === 'CANDIDATE') {
      return [
        { name: 'Dashboard Overview', path: '/candidate', icon: LayoutDashboard },
        { name: 'My Applications', path: '/candidate/applications', icon: FileText },
        { name: 'Browse Jobs', path: '/jobs', icon: Briefcase },
        { name: 'Companies Directory', path: '/companies', icon: Building2 },
        { name: 'Profile & Settings', path: '/candidate/profile', icon: User },
      ]
    }
    if (user?.role === 'RECRUITER') {
      return [
        { name: 'Recruiter Dashboard', path: '/recruiter', icon: LayoutDashboard },
        { name: 'Manage Jobs', path: '/recruiter/jobs', icon: Briefcase },
        { name: 'Manage Company', path: '/recruiter/company', icon: Building2 },
        { name: 'Applicants Pipeline', path: '/recruiter/applicants', icon: Users },
        { name: 'Profile & Settings', path: '/recruiter/profile', icon: User },
      ]
    }
    return []
  }

  const navItems = getNavItems()

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-darkBg border-r border-slate-100 dark:border-darkBorder w-64 transition-colors duration-200">
      {/* Brand Logo Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-darkBorder bg-white dark:bg-darkCard">
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-1.5 rounded-lg text-white shadow-md shadow-blue-500/10">
            <Briefcase className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-lg text-slate-800 dark:text-white tracking-tight">
            Job<span className="text-blue-600 dark:text-blue-400">Board</span>
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-darkBorder text-slate-500 dark:text-slate-400 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto bg-white dark:bg-darkCard">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end
            className={({ isActive }) => `
              flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
              ${isActive
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/10'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-darkBg/50 hover:text-slate-900 dark:hover:text-white'}
            `}
            onClick={onClose}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Session Info / Logout */}
      <div className="p-4 border-t border-slate-100 dark:border-darkBorder bg-white dark:bg-darkCard">
        <div className="flex items-center space-x-3 mb-4 px-3 py-2 bg-slate-50 dark:bg-darkBg/50 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-blue-500 flex items-center justify-center font-bold text-white shadow-sm text-sm">
            {user?.first_name?.charAt(0) || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 truncate uppercase tracking-wider">
              {user?.role}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}
