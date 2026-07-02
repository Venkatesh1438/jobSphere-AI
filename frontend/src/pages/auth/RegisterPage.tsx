import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Briefcase, User, Building2, ChevronRight, ChevronLeft, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'

type Steps = 'ROLE' | 'CREDENTIALS' | 'COMPANY'

export default function RegisterPage() {
  const { registerCandidate, registerRecruiter } = useAuth()
  const navigate = useNavigate()
  
  // State for Step Wizard
  const [step, setStep] = useState<Steps>('ROLE')
  const [role, setRole] = useState<'CANDIDATE' | 'RECRUITER'>('CANDIDATE')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirm_password: '',
      phone_number: '',
      company_name: '',
      designation: '',
    },
  })

  const passwordValue = watch('password')

  // Multi-step validation triggers
  const handleNextStep = async () => {
    if (step === 'ROLE') {
      setStep('CREDENTIALS')
      return
    }

    if (step === 'CREDENTIALS') {
      // Validate credentials step fields
      const isValid = await trigger([
        'first_name',
        'last_name',
        'email',
        'password',
        'confirm_password',
      ])
      if (!isValid) return

      if (role === 'CANDIDATE') {
        // Candidates do not need Step 3, they can submit directly!
        handleSubmit(onSubmit)()
      } else {
        setStep('COMPANY')
      }
    }
  }

  const handlePrevStep = () => {
    if (step === 'CREDENTIALS') setStep('ROLE')
    if (step === 'COMPANY') setStep('CREDENTIALS')
  }

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      const payload: any = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        confirm_password: data.confirm_password,
        phone_number: data.phone_number,
      }

      if (role === 'CANDIDATE') {
        await registerCandidate(payload)
        toast.success('Registration successful! Please login to start matching.')
        navigate('/login')
      } else {
        payload.company_name = data.company_name
        payload.designation = data.designation
        await registerRecruiter(payload)
        toast.success('Registration successful! Please login to create your company profile.')
        navigate('/login')
      }
    } catch (err: any) {
      console.error(err)
      const errData = err.response?.data
      if (errData && typeof errData === 'object') {
        Object.keys(errData).forEach((key) => {
          if (Array.isArray(errData[key])) {
            errData[key].forEach((msg: string) => toast.error(`${key}: ${msg}`))
          } else if (typeof errData[key] === 'string') {
            toast.error(errData[key])
          }
        })
      } else {
        toast.error('Registration failed. Please verify credentials and try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Get progress bar percentage
  const getProgressPercentage = () => {
    if (step === 'ROLE') return 33
    if (step === 'CREDENTIALS') return 66
    return 100
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-slate-50">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        <Card className="bg-white border border-slate-100 shadow-xl p-8 sm:p-10 space-y-6 rounded-3xl">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto bg-gradient-to-tr from-blue-600 to-indigo-650 p-2.5 rounded-2xl text-white shadow-md shadow-blue-500/10 w-fit">
              <Briefcase className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Create an Account
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              Onboard in seconds to unlock career opportunities.
            </p>
          </div>

          {/* Progress Tracker */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              <span className={step === 'ROLE' ? 'text-blue-650' : 'text-slate-500'}>1. Account Role</span>
              <span className={step === 'CREDENTIALS' ? 'text-blue-650' : 'text-slate-500'}>2. Credentials</span>
              <span className={step === 'COMPANY' ? 'text-blue-650' : 'text-slate-500'}>3. Organization</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-600 rounded-full"
                animate={{ width: `${getProgressPercentage()}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          {/* Form Content Steps */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <AnimatePresence mode="wait">
              {step === 'ROLE' && (
                <motion.div
                  key="role-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                    Choose Your JobBoard Portal
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Candidate Select Card */}
                    <div
                      onClick={() => setRole('CANDIDATE')}
                      className={`p-6 border-2 rounded-2xl cursor-pointer flex flex-col items-center text-center space-y-3 transition-all ${
                        role === 'CANDIDATE'
                          ? 'border-blue-600 bg-blue-50/20 shadow-md'
                          : 'border-slate-100 hover:border-slate-350 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className={`p-3 rounded-xl ${role === 'CANDIDATE' ? 'bg-blue-100 text-blue-605' : 'bg-slate-100 text-slate-500'}`}>
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">Join as Candidate</h4>
                        <p className="text-xs text-slate-550 leading-relaxed mt-1">
                          Build profile, parse resumes, and match to jobs.
                        </p>
                      </div>
                    </div>

                    {/* Recruiter Select Card */}
                    <div
                      onClick={() => setRole('RECRUITER')}
                      className={`p-6 border-2 rounded-2xl cursor-pointer flex flex-col items-center text-center space-y-3 transition-all ${
                        role === 'RECRUITER'
                          ? 'border-blue-600 bg-blue-50/20 shadow-md'
                          : 'border-slate-100 hover:border-slate-350 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className={`p-3 rounded-xl ${role === 'RECRUITER' ? 'bg-blue-100 text-blue-605' : 'bg-slate-100 text-slate-500'}`}>
                        <Building2 className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">Join as Recruiter</h4>
                        <p className="text-xs text-slate-555 leading-relaxed mt-1">
                          Publish jobs, screen talent, and build pipelines.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 'CREDENTIALS' && (
                <motion.div
                  key="credentials-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      placeholder="Jane"
                      error={errors.first_name?.message}
                      {...register('first_name', { required: 'First name is required' })}
                    />
                    <Input
                      label="Last Name"
                      placeholder="Doe"
                      error={errors.last_name?.message}
                      {...register('last_name', { required: 'Last name is required' })}
                    />
                  </div>

                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="jane.doe@example.com"
                    error={errors.email?.message}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Password"
                      type="password"
                      placeholder="••••••••"
                      error={errors.password?.message}
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters',
                        },
                      })}
                    />
                    <Input
                      label="Confirm Password"
                      type="password"
                      placeholder="••••••••"
                      error={errors.confirm_password?.message}
                      {...register('confirm_password', {
                        required: 'Confirm password is required',
                        validate: (value) =>
                          value === passwordValue || 'Passwords do not match',
                      })}
                    />
                  </div>

                  <Input
                    label="Phone Number (Optional)"
                    placeholder="+1 (555) 123-4567"
                    error={errors.phone_number?.message}
                    {...register('phone_number')}
                  />
                </motion.div>
              )}

              {step === 'COMPANY' && (
                <motion.div
                  key="company-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex items-start gap-2.5">
                    <ShieldCheck className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                      Recruiter accounts require manual verification. Please input your official designation and registered company details below.
                    </p>
                  </div>

                  <Input
                    label="Company Name"
                    placeholder="Stripe"
                    error={errors.company_name?.message}
                    {...register('company_name', {
                      required: role === 'RECRUITER' ? 'Company name is required' : false,
                    })}
                  />
                  
                  <Input
                    label="Designation / HR Role"
                    placeholder="Principal HR Recruiter"
                    error={errors.designation?.message}
                    {...register('designation', {
                      required: role === 'RECRUITER' ? 'Designation is required' : false,
                    })}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
              {step !== 'ROLE' ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  className="font-bold border-slate-200"
                >
                  <ChevronLeft className="h-4.5 w-4.5 mr-1" />
                  <span>Back</span>
                </Button>
              ) : (
                <div />
              )}

              <Button
                type="button"
                variant="primary"
                onClick={
                  (step === 'CREDENTIALS' && role === 'CANDIDATE') || step === 'COMPANY'
                    ? handleSubmit(onSubmit)
                    : handleNextStep
                }
                isLoading={loading}
                className="font-bold ml-auto shadow-md shadow-blue-500/10 gap-1.5"
              >
                <span>
                  {(step === 'CREDENTIALS' && role === 'CANDIDATE') || step === 'COMPANY'
                    ? 'Register'
                    : 'Next'}
                </span>
                {!((step === 'CREDENTIALS' && role === 'CANDIDATE') || step === 'COMPANY') && (
                  <ChevronRight className="h-4.5 w-4.5" />
                )}
              </Button>
            </div>
          </form>

          {/* Footer Info */}
          <div className="text-center text-xs font-semibold text-slate-500 pt-3 border-t border-slate-50 flex items-center justify-center gap-1.5">
            <span>Already have an account?</span>
            <Link to="/login" className="text-blue-600 hover:text-blue-750 hover:underline">
              Sign in
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
