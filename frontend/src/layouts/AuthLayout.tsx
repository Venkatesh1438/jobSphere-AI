import { Link, Outlet } from 'react-router-dom'
import { Briefcase } from 'lucide-react'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-darkBg px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-200">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-darkCard p-8 rounded-2xl border border-slate-200 dark:border-darkBorder shadow-2xl shadow-slate-100 dark:shadow-none">
        <div className="flex flex-col items-center justify-center">
          <Link to="/" className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 mb-4">
            <Briefcase className="h-8 w-8" />
            <span className="font-bold text-2xl tracking-tight text-slate-800 dark:text-white">JobSphere <span className="text-primary-600 dark:text-primary-400">AI</span></span>
          </Link>
          <h2 className="text-center text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Welcome to the future of recruitment
          </h2>
        </div>
        
        <div className="mt-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
