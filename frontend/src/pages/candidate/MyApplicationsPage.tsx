import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCandidateApplications, useWithdrawApplication } from '../../api/applications'
import PageHeader from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import { useNotifications } from '../../context/NotificationContext'
import { Calendar, Briefcase, MapPin, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MyApplicationsPage() {
  const { data, isLoading, isError, error, refetch } = useCandidateApplications()
  const withdrawMutation = useWithdrawApplication()
  const { addNotification } = useNotifications()
  const navigate = useNavigate()
  
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const applications = data?.data || []

  const handleWithdrawClick = (id: string) => {
    setSelectedAppId(id)
    setIsConfirmOpen(true)
  }

  const handleConfirmWithdraw = async () => {
    if (!selectedAppId) return
    setIsConfirmOpen(false)
    
    try {
      await withdrawMutation.mutateAsync(selectedAppId)
      addNotification('Application Withdrawn', 'Successfully withdrawn your job application.', 'info')
    } catch (err: any) {
      console.error(err)
      const msg = err.response?.data?.message || 'Failed to withdraw application.'
      addNotification('Withdrawal Failed', msg, 'error')
    } finally {
      setSelectedAppId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPLIED': return <Badge variant="primary" styleType="soft">Applied</Badge>
      case 'REVIEWED': return <Badge variant="warning" styleType="soft">Reviewed</Badge>
      case 'SHORTLISTED': return <Badge variant="primary" styleType="soft">Shortlisted</Badge>
      case 'INTERVIEW': return <Badge variant="success" styleType="solid">Interviewing</Badge>
      case 'REJECTED': return <Badge variant="danger" styleType="soft">Rejected</Badge>
      case 'HIRED': return <Badge variant="success" styleType="solid">Hired</Badge>
      default: return <Badge variant="gray" styleType="soft">{status}</Badge>
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="My Applications"
        subtitle="Manage and track the progress of your submitted job applications."
      />

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-white border-slate-100 p-6 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-3 bg-slate-200 rounded w-1/4" />
                </div>
                <div className="h-6 bg-slate-200 rounded w-16" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Error state */}
      {isError && (
        <ErrorState error={error} onRetry={refetch} title="Failed to retrieve applications" />
      )}

      {/* Empty State */}
      {!isLoading && !isError && applications.length === 0 && (
        <EmptyState
          title="No applications yet"
          description="You haven't submitted any job applications. Browse the job board and find your next tech role!"
          icon={Briefcase}
          actionLabel="Explore Jobs"
          onActionClick={() => navigate('/jobs')}
        />
      )}

      {/* Applications List */}
      {!isLoading && !isError && applications.length > 0 && (
        <div className="space-y-4">
          <AnimatePresence>
            {applications.map((app) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-white border-slate-100 p-6 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  {/* Job details */}
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        to={`/jobs/${app.job.id}`}
                        className="text-base font-extrabold text-slate-950 hover:text-blue-600 truncate transition-colors"
                      >
                        {app.job.title}
                      </Link>
                      {getStatusBadge(app.status)}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-semibold text-slate-500">
                      <span>{app.company?.company_name || 'Verified Employer'}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {app.job.location}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Applied on {formatDate(app.applied_at)}
                      </span>
                    </div>

                    {app.match_score !== null && app.match_score !== undefined && (
                      <div className="pt-2 flex items-center space-x-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Compatibility Match:</span>
                        <Badge variant={app.match_score >= 80 ? 'success' : app.match_score >= 50 ? 'primary' : 'warning'} styleType="soft" className="text-[10px] font-bold">
                          {app.match_score}% Match
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <Link
                      to={`/jobs/${app.job.id}`}
                      className="inline-flex justify-center items-center text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-4 py-2.5 rounded-xl transition-all"
                    >
                      View Job
                    </Link>
                    {app.status !== 'HIRED' && app.status !== 'REJECTED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleWithdrawClick(app.id)}
                        className="text-red-500 border-red-100 hover:bg-red-50 font-bold hover:text-red-650"
                      >
                        <Trash2 className="h-4 w-4 mr-1.5" />
                        Withdraw
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Withdraw Application"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-655 leading-relaxed font-semibold">
            Are you sure you want to withdraw your application? This action is irreversible, and you will need to re-apply if you change your mind.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConfirmOpen(false)}
              className="font-bold border-slate-200"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmWithdraw}
              className="bg-red-600 hover:bg-red-700 text-white border-transparent font-bold shadow-md shadow-red-500/10"
            >
              Confirm Withdrawal
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
