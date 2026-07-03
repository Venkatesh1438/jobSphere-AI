import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Briefcase, Lock, Mail, ArrowRight } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Determine redirection path safely supporting both strings and location objects
  const fromState = location.state?.from
  const from = typeof fromState === 'string' ? fromState : fromState?.pathname || '/'

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      const res = await login(data.email, data.password)
      toast.success('Welcome back! Successfully signed in.')
      
      const role = res?.data?.user?.role
      
      // Role protection during redirection
      const isCandidatePage = from.startsWith('/candidate') || from.includes('/apply')
      const isRecruiterPage = from.startsWith('/recruiter')

      if (role === 'CANDIDATE' && isRecruiterPage) {
        navigate('/candidate', { replace: true })
      } else if (role === 'RECRUITER' && isCandidatePage) {
        navigate('/recruiter', { replace: true })
      } else if (from !== '/' && from !== '/candidate' && from !== '/recruiter' && from !== '/login' && from !== '/register' && from !== '/404') {
        navigate(from, { replace: true })
      } else {
        // Otherwise redirect based on role
        if (role === 'CANDIDATE') {
          navigate('/candidate', { replace: true })
        } else if (role === 'RECRUITER') {
          navigate('/recruiter', { replace: true })
        } else {
          navigate('/', { replace: true })
        }
      }
    } catch (err: any) {
      console.error(err)
      // Check Axios error body first, then plain Error message, then fall back to generic message
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        (err.message && err.message !== 'Network Error' ? err.message : null) ||
        'Authentication failed. Please verify your email and password.'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-slate-50">
      {/* Background ambient mesh glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="bg-white border border-slate-100 shadow-xl shadow-slate-200/50 p-8 sm:p-10 space-y-8 rounded-3xl">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="mx-auto bg-gradient-to-tr from-blue-600 to-indigo-650 p-3 rounded-2xl text-white shadow-md shadow-blue-500/10 w-fit">
              <Briefcase className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Sign in to JobBoard
            </h2>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-xs mx-auto">
              Access the recruiter portal or developer matching dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-4">
              <div className="relative">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@company.com"
                  error={errors.email?.message}
                  className="pl-10"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
                <Mail className="absolute left-3.5 bottom-3.5 h-4.5 w-4.5 text-slate-400" />
              </div>

              <div className="relative">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  className="pl-10"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />
                <Lock className="absolute left-3.5 bottom-3.5 h-4.5 w-4.5 text-slate-400" />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full font-bold shadow-md shadow-blue-500/15 gap-2"
                isLoading={loading}
              >
                <span>Continue</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </Button>
            </div>
          </form>

          {/* Footer Navigation */}
          <div className="text-center text-xs font-semibold text-slate-500 pt-5 border-t border-slate-100 flex items-center justify-center gap-1.5">
            <span>New to JobBoard?</span>
            <Link to="/register" className="text-blue-600 hover:text-blue-750 hover:underline">
              Create an account
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
