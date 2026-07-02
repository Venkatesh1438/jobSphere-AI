import { Link } from 'react-router-dom'
import { Users, Briefcase, Building2, ChevronRight, PlusCircle, PenTool, ClipboardCheck, AlertCircle } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import PageHeader from '../../components/ui/PageHeader'
import { useAuth } from '../../hooks/useAuth'
import { useRecruiterJobs } from '../../api/jobs'
import { useRecruiterCompany } from '../../api/companies'
import { useQueries } from '@tanstack/react-query'
import { api } from '../../services/api'
import { Badge } from '../../components/ui/Badge'
import AnimatedCounter from '../../components/ui/AnimatedCounter'
import { motion } from 'framer-motion'

export default function RecruiterDashboard() {
  const { user } = useAuth()
  
  // Fetch recruiter's jobs
  const { data: jobsRes, isLoading: isJobsLoading } = useRecruiterJobs(user?.id)
  const jobs = jobsRes?.data || []

  // Fetch recruiter's company details
  const { data: companyRes, isLoading: isCompanyLoading } = useRecruiterCompany(user?.id)
  const company = companyRes?.data || null

  // Concurrently fetch applications for all recruiter's jobs using TanStack useQueries
  const applicationsQueries = useQueries({
    queries: jobs.map((job) => ({
      queryKey: ['applications', 'job', job.id],
      queryFn: async () => {
        const response = await api.get(`/jobs/${job.id}/applications/`)
        return {
          jobId: job.id,
          jobTitle: job.title,
          applications: response.data?.data || []
        }
      },
      enabled: jobs.length > 0
    }))
  })

  const isAppsLoading = applicationsQueries.some(q => q.isLoading)
  
  // Consolidate all applications
  const allApplications = applicationsQueries.flatMap((q) => {
    if (!q.data) return []
    return q.data.applications.map((app: any) => ({
      ...app,
      jobTitle: q.data.jobTitle
    }))
  })

  // Aggregated stats
  const totalJobsCount = jobs.length
  const publishedJobsCount = jobs.filter(j => j.status === 'PUBLISHED').length
  const totalApplicantsCount = allApplications.length

  // Sort and take last 3 recent applicants
  const recentApplicants = [...allApplications]
    .sort((a, b) => new Date(b.applied_at || b.created_at).getTime() - new Date(a.applied_at || a.created_at).getTime())
    .slice(0, 3)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPLIED': return <Badge variant="primary" styleType="soft">New</Badge>
      case 'REVIEWED': return <Badge variant="warning" styleType="soft">Reviewed</Badge>
      case 'SHORTLISTED': return <Badge variant="primary" styleType="soft">Shortlisted</Badge>
      case 'INTERVIEW': return <Badge variant="success" styleType="solid">Interview</Badge>
      case 'REJECTED': return <Badge variant="danger" styleType="soft">Rejected</Badge>
      case 'HIRED': return <Badge variant="success" styleType="solid">Hired</Badge>
      default: return <Badge variant="gray" styleType="soft">{status}</Badge>
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-8"
    >
      <PageHeader
        title={`Welcome back, ${user?.first_name || 'Recruiter'}!`}
        subtitle="Manage your company listings, post job openings, and track candidate applications."
      />

      {/* Analytics widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-slate-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-400 font-bold text-xs uppercase tracking-wider block">Total Jobs</span>
              {isJobsLoading ? (
                <div className="h-9 w-12 bg-slate-100 animate-pulse rounded mt-2" />
              ) : (
                <span className="text-3xl font-black text-slate-800 mt-2 block">
                  <AnimatedCounter value={totalJobsCount} />
                </span>
              )}
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
          <div className="text-slate-550 text-xs font-semibold mt-4">
            Created job openings
          </div>
        </Card>

        <Card className="bg-white border-slate-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-400 font-bold text-xs uppercase tracking-wider block">Published Jobs</span>
              {isJobsLoading ? (
                <div className="h-9 w-12 bg-slate-100 animate-pulse rounded mt-2" />
              ) : (
                <span className="text-3xl font-black text-slate-800 mt-2 block">
                  <AnimatedCounter value={publishedJobsCount} />
                </span>
              )}
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <ClipboardCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="text-emerald-600 text-xs font-bold mt-4 flex items-center space-x-1">
            <span>Actively hiring</span>
          </div>
        </Card>

        <Card className="bg-white border-slate-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-400 font-bold text-xs uppercase tracking-wider block">Total Applicants</span>
              {isJobsLoading || isAppsLoading ? (
                <div className="h-9 w-12 bg-slate-100 animate-pulse rounded mt-2" />
              ) : (
                <span className="text-3xl font-black text-slate-800 mt-2 block">
                  <AnimatedCounter value={totalApplicantsCount} />
                </span>
              )}
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="text-slate-500 text-xs font-semibold mt-4">
            Candidates applied
          </div>
        </Card>

        <Card className="bg-white border-slate-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-400 font-bold text-xs uppercase tracking-wider block">Company Status</span>
              {isCompanyLoading ? (
                <div className="h-9 w-12 bg-slate-100 animate-pulse rounded mt-2" />
              ) : company ? (
                <span className="text-lg font-black text-slate-800 mt-4 block truncate max-w-[130px]">
                  {company.company_name}
                </span>
              ) : (
                <span className="text-sm font-bold text-red-500 mt-5 block">No Profile</span>
              )}
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <Building2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            {company ? (
              <Badge variant="success" styleType="soft" className="text-[10px] font-bold">Completed</Badge>
            ) : (
              <Badge variant="danger" styleType="soft" className="text-[10px] font-bold">Setup Required</Badge>
            )}
          </div>
        </Card>
      </div>

      {/* Warning if company details do not exist */}
      {!isCompanyLoading && !company && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex items-start space-x-3.5 max-w-4xl">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-extrabold text-amber-900">Missing Company Profile</h4>
            <p className="text-xs text-amber-700 leading-relaxed font-semibold">
              You must create your company profile before publishing jobs. Candidates view company information to learn about your culture, industry, and benefits.
            </p>
            <Link
              to="/recruiter/company"
              className="inline-block text-xs font-extrabold text-blue-600 hover:text-blue-750 pt-2"
            >
              Complete Company Setup &rarr;
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Recent Candidates & Recent Jobs */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Recent Applicants */}
          <Card className="bg-white border-slate-100 p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-50">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Users className="h-4.5 w-4.5" />
                </div>
                <h2 className="text-base font-extrabold text-slate-800">Recent Applicants</h2>
              </div>
              <Link 
                to="/recruiter/applicants" 
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
              >
                <span>Manage pipeline</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {isJobsLoading || isAppsLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-16 bg-slate-50 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : recentApplicants.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <span className="block text-sm text-slate-400 font-semibold">No candidates have applied yet.</span>
                <Link
                  to="/recruiter/jobs"
                  className="inline-flex items-center justify-center font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/10"
                >
                  Manage Jobs
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentApplicants.map((app: any) => (
                  <div 
                    key={app.id} 
                    className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-all duration-200"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-extrabold text-slate-900 truncate">
                        {app.candidate.first_name} {app.candidate.last_name || ''}
                      </h4>
                      <p className="text-xs font-semibold text-slate-500 mt-1">
                        Applied for: <span className="font-bold text-slate-700">{app.jobTitle}</span>
                      </p>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-1.5">
                        Submitted {formatDate(app.applied_at || app.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(app.status)}
                      <Link
                        to="/recruiter/applicants"
                        className="p-1 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Recent Jobs */}
          <Card className="bg-white border-slate-100 p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-50">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Briefcase className="h-4.5 w-4.5" />
                </div>
                <h2 className="text-base font-extrabold text-slate-800">Recent Jobs</h2>
              </div>
              <Link 
                to="/recruiter/jobs" 
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
              >
                <span>Manage jobs</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {isJobsLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-16 bg-slate-50 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-6 text-sm text-slate-400 font-semibold">
                No jobs published yet.
              </div>
            ) : (
              <div className="space-y-4">
                {[...jobs]
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .slice(0, 3)
                  .map((job) => {
                    const appCount = allApplications.filter(app => app.job === job.id).length
                    return (
                      <div 
                        key={job.id} 
                        className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-all duration-200"
                      >
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-extrabold text-slate-900 truncate">
                            {job.title}
                          </h4>
                          <p className="text-xs font-semibold text-slate-500 mt-1">
                            {job.location} • {job.employment_type.replace('_', ' ')}
                          </p>
                          <span className="text-[10px] text-slate-450 font-bold block mt-1.5">
                            Created on {formatDate(job.created_at)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={job.status === 'PUBLISHED' ? 'success' : 'gray'} styleType="soft">
                            {job.status.toLowerCase()}
                          </Badge>
                          <Badge variant="primary" styleType="solid" className="text-xs font-extrabold">
                            {appCount} {appCount === 1 ? 'applicant' : 'applicants'}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </Card>
        </div>

        {/* Right Side: Quick Actions */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-650 p-6 text-white shadow-lg shadow-blue-500/10 rounded-3xl space-y-5">
            <h3 className="text-base font-extrabold tracking-tight">Quick Actions</h3>
            <p className="text-xs text-blue-100/90 leading-relaxed font-semibold">
              Publish job listings, manage applications, and keep your company details up to date.
            </p>
            <div className="space-y-3 pt-2">
              <Link
                to="/recruiter/jobs"
                className="flex items-center justify-between w-full p-3 bg-white/10 hover:bg-white/15 rounded-2xl text-xs font-bold transition-all"
              >
                <div className="flex items-center space-x-2">
                  <PlusCircle className="h-4 w-4" />
                  <span>Post Job / Manage Jobs</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                to="/recruiter/company"
                className="flex items-center justify-between w-full p-3 bg-white/10 hover:bg-white/15 rounded-2xl text-xs font-bold transition-all"
              >
                <div className="flex items-center space-x-2">
                  <PenTool className="h-4 w-4" />
                  <span>Manage Company Details</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                to="/recruiter/applicants"
                className="flex items-center justify-between w-full p-3 bg-white/10 hover:bg-white/15 rounded-2xl text-xs font-bold transition-all"
              >
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Manage Pipeline / Applicants</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
