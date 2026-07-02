import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useNotifications } from '../../context/NotificationContext'
import PageHeader from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { User, Lock, ShieldCheck, Settings, Mail, UserCheck } from 'lucide-react'

export default function ProfilePage() {
  const { user, changePassword } = useAuth()
  const { addNotification } = useNotifications()
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)

  const activeTab = searchParams.get('tab') === 'settings' ? 'settings' : 'profile'

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      old_password: '',
      new_password: '',
      confirm_password: '',
    }
  })

  const onSubmit = async (data: any) => {
    if (data.new_password !== data.confirm_password) {
      addNotification('Password Mismatch', 'New password and confirm password do not match.', 'error')
      return
    }

    setLoading(true)
    try {
      await changePassword({
        old_password: data.old_password,
        new_password: data.new_password,
        confirm_password: data.confirm_password
      })
      
      // Success Notification & Toast
      addNotification('Password Changed', 'Your account credentials have been successfully updated.', 'success')
      reset()
    } catch (err: any) {
      console.error(err)
      const msg = err.response?.data?.detail || err.response?.data?.message || 'Verification failed. Please check your credentials.'
      addNotification('Failed to change password', msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  const userFullName = user ? `${user.first_name} ${user.last_name || ''}` : 'User Profile'

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Profile & Settings"
        subtitle="Manage your personal account credentials, security preferences, and portal configurations."
      />

      {/* Modern Horizontal Tabs */}
      <div className="flex border-b border-slate-100 space-x-2">
        <button
          onClick={() => setSearchParams({ tab: 'profile' })}
          className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <User className="h-4 w-4" />
          <span>Profile Details</span>
        </button>
        <button
          onClick={() => setSearchParams({ tab: 'settings' })}
          className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Settings className="h-4 w-4" />
          <span>Security & Settings</span>
        </button>
      </div>

      <div className="pt-2 animate-in fade-in duration-200">
        {activeTab === 'profile' ? (
          /* Tab 1: Profile Details Card */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <Card className="bg-white border-slate-100 p-6 shadow-sm flex flex-col items-center text-center space-y-4 md:col-span-1">
              <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-650 rounded-full flex items-center justify-center font-bold text-white shadow-md text-2xl">
                {user?.first_name?.charAt(0) || 'U'}
              </div>
              
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                  {userFullName}
                </h3>
                <p className="text-xs text-slate-400 font-semibold truncate max-w-[200px]">
                  {user?.email}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-50 w-full space-y-3 text-xs text-slate-655 font-semibold text-left">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Account Role</span>
                  <Badge variant="primary" styleType="soft" className="scale-90 origin-right">
                    {user?.role}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Email Status</span>
                  {user?.is_email_verified ? (
                    <span className="flex items-center gap-1 text-emerald-600">
                      <ShieldCheck className="h-4 w-4" />
                      Verified
                    </span>
                  ) : (
                    <span className="text-amber-500">Unverified</span>
                  )}
                </div>
              </div>
            </Card>

            <Card className="bg-white border-slate-100 p-8 shadow-sm space-y-6 md:col-span-2">
              <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-55 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-blue-650" />
                <span>General Information</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">First Name</span>
                  <span className="font-semibold text-slate-800">{user?.first_name || 'N/A'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Last Name</span>
                  <span className="font-semibold text-slate-800">{user?.last_name || 'N/A'}</span>
                </div>
                <div className="space-y-1 col-span-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Email Address</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-slate-450" />
                    {user?.email}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Contact Number</span>
                  <span className="font-semibold text-slate-800">{user?.phone_number || 'Not provided'}</span>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          /* Tab 2: Security & Change Password Card */
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white border-slate-100 p-8 shadow-sm space-y-6">
              <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-55 flex items-center gap-2">
                <Lock className="h-5 w-5 text-blue-650" />
                <span>Security Configuration</span>
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="relative">
                  <Input
                    label="Current Password"
                    type="password"
                    placeholder="••••••••"
                    error={errors.old_password?.message}
                    className="pl-10"
                    {...register('old_password', { required: 'Current password is required' })}
                  />
                  <Lock className="absolute left-3.5 bottom-3.5 h-4.5 w-4.5 text-slate-400" />
                </div>

                <div className="relative">
                  <Input
                    label="New Password"
                    type="password"
                    placeholder="••••••••"
                    error={errors.new_password?.message}
                    className="pl-10"
                    {...register('new_password', {
                      required: 'New password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' }
                    })}
                  />
                  <Lock className="absolute left-3.5 bottom-3.5 h-4.5 w-4.5 text-slate-400" />
                </div>

                <div className="relative">
                  <Input
                    label="Confirm New Password"
                    type="password"
                    placeholder="••••••••"
                    error={errors.confirm_password?.message}
                    className="pl-10"
                    {...register('confirm_password', { required: 'Please confirm your new password' })}
                  />
                  <Lock className="absolute left-3.5 bottom-3.5 h-4.5 w-4.5 text-slate-400" />
                </div>

                <div className="pt-3 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    className="font-bold px-6 shadow-md shadow-blue-500/10"
                    isLoading={loading}
                  >
                    Change Password
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
