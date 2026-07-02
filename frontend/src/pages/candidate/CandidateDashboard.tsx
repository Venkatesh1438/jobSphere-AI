import { Link } from 'react-router-dom'
import { FileText, Sparkles, TrendingUp, Compass, User, ClipboardList, ChevronRight } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import PageHeader from '../../components/ui/PageHeader'
import { useAuth } from '../../hooks/useAuth'
import { useCandidateApplications } from '../../api/applications'
import { useJobs } from '../../api/jobs'
import { Badge } from '../../components/ui/Badge'
import AnimatedCounter from '../../components/ui/AnimatedCounter'
import { motion } from 'framer-motion'

export default function CandidateDashboard() {
  const { user } = useAuth()
  const { data: appData, isLoading: isAppLoading, isError: isAppError } = useCandidateApplications()
  const { data: jobsData, isLoading: isJobsLoading } = useJobs({ page: 1 })

  const applications = appData?.data || []
  const jobs = jobsData?.data || []

  // Derived stats
  const totalApplied = applications.length
  const savedJobsCount = 5 // UI-only mock count
  const interviewStageCount = applications.filter(a => a.status === 'INTERVIEW').length
  const profileCompletion = user?.profile_completed ? 100 : 75

  // Recent applications (last 3)
  const recentApps = [...applications]
    .sort((a, b) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime())
    .slice(0, 3)

  // Recommended Jobs: Jobs from the list that candidate hasn't applied to yet
  const appliedJobIds = new Set(applications.map(a => a.job.id))
  const recommendedJobs = jobs
    .filter(j => j.status === 'PUBLISHED' && !appliedJobIds.has(j.id))
    .slice(0, 3)

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

  // Formatting helper
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-8"
    >
      <PageHeader
        title={`Welcome back, ${user?.first_name || 'Candidate'}!`}
        subtitle="Track your submissions, explore curated match recommendations, and manage your profile."
      />

      {/* Analytics widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-slate-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-400 font-bold text-xs uppercase tracking-wider block">Total Applications</span>
              {isAppLoading ? (
                <div className="h-9 w-12 bg-slate-100 animate-pulse rounded mt-2" />
              ) : (
                <span className="text-3xl font-black text-slate-800 mt-2 block">
                  <AnimatedCounter value={totalApplied} />
                </span>
              )}
            </div>
            <div className="p-3 bg-blue-50 text-blue-650 rounded-2xl">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="text-slate-500 text-xs font-semibold mt-4">
            Across all job listings
          </div>
        </Card>

        <Card className="bg-white border-slate-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-400 font-bold text-xs uppercase tracking-wider block">Saved Jobs</span>
              <span className="text-3xl font-black text-slate-800 mt-2 block">
                <AnimatedCounter value={savedJobsCount} />
              </span>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <div className="text-indigo-600 text-xs font-bold mt-4 flex items-center space-x-1">
            <span>UI-Only Saved Jobs</span>
          </div>
        </Card>

        <Card className="bg-white border-slate-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-400 font-bold text-xs uppercase tracking-wider block">Interview Invites</span>
              {isAppLoading ? (
                <div className="h-9 w-12 bg-slate-100 animate-pulse rounded mt-2" />
              ) : (
                <span className="text-3xl font-black text-slate-800 mt-2 block">
                  <AnimatedCounter value={interviewStageCount} />
                </span>
              )}
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="text-slate-500 text-xs font-semibold mt-4">
            Active meeting invites
          </div>
        </Card>

        <Card className="bg-white border-slate-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-400 font-bold text-xs uppercase tracking-wider block">Profile Strength</span>
              <span className="text-3xl font-black text-slate-800 mt-2 block">
                <AnimatedCounter value={profileCompletion} />%
              </span>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <User className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-amber-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Recent Applications & Recommended Jobs */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Applications Card */}
          <Card className="bg-white border-slate-100 p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-50">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <ClipboardList className="h-4.5 w-4.5" />
                </div>
                <h2 className="text-base font-extrabold text-slate-800">Recent Applications</h2>
              </div>
              <Link 
                to="/candidate/applications" 
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
              >
                <span>View All</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {isAppLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-16 bg-slate-50 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : isAppError ? (
              <div className="text-center py-6 text-sm text-red-500 font-semibold">
                Failed to load applications.
              </div>
            ) : recentApps.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <span className="block text-sm text-slate-400 font-semibold">No applications submitted yet.</span>
                <Link
                  to="/jobs"
                  className="inline-flex items-center justify-center font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/10"
                >
                  Explore job board
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentApps.map((app) => (
                  <div 
                    key={app.id} 
                    className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-all duration-205"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-extrabold text-slate-900 truncate">{app.job.title}</h4>
                      <p className="text-xs font-semibold text-slate-500 mt-1">
                        {app.company?.company_name || 'Verified Employer'} • {app.job.location}
                      </p>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-1.5">
                        Applied on {formatDate(app.applied_at)}
                      </span>
                    </div>
                    <div>
                      {getStatusBadge(app.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Recommended Jobs Card */}
          <Card className="bg-white border-slate-100 p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-50">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Compass className="h-4.5 w-4.5" />
                </div>
                <h2 className="text-base font-extrabold text-slate-800">Recommended Openings</h2>
              </div>
              <Link 
                to="/jobs" 
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
              >
                <span>Explore Board</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {isJobsLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-16 bg-slate-50 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : recommendedJobs.length === 0 ? (
              <div className="text-center py-6 text-sm text-slate-400 font-semibold">
                No new job recommendations available.
              </div>
            ) : (
              <div className="space-y-4">
                {recommendedJobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="p-4 border border-slate-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-all duration-200"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-extrabold text-slate-900 truncate">{job.title}</h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs font-semibold text-slate-550">
                        <span>{job.location}</span>
                        <span>•</span>
                        <span className="capitalize">{job.employment_type.toLowerCase().replace('_', ' ')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {job.salary_min && (
                        <span className="text-xs font-extrabold text-slate-800 hidden sm:inline">
                          ${Number(job.salary_min).toLocaleString()}
                        </span>
                      )}
                      <Link
                        to={`/jobs/${job.id}`}
                        className="inline-flex justify-center items-center text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition-all"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Side: Quick Actions */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-650 p-6 text-white shadow-lg shadow-blue-500/10 rounded-3xl space-y-5">
            <h3 className="text-base font-extrabold tracking-tight">Quick Actions</h3>
            <p className="text-xs text-blue-100/90 leading-relaxed font-semibold">
              Leverage JobBoard features to accelerate your developer recruitment search.
            </p>
            <div className="space-y-3 pt-2">
              <Link
                to="/jobs"
                className="flex items-center justify-between w-full p-3 bg-white/10 hover:bg-white/15 rounded-2xl text-xs font-bold transition-all"
              >
                <span>Browse Active Jobs</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                to="/candidate/profile"
                className="flex items-center justify-between w-full p-3 bg-white/10 hover:bg-white/15 rounded-2xl text-xs font-bold transition-all"
              >
                <span>Complete / View Profile</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                to="/candidate/applications"
                className="flex items-center justify-between w-full p-3 bg-white/10 hover:bg-white/15 rounded-2xl text-xs font-bold transition-all"
              >
                <span>My Applications</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </Card>

          {/* Simple static card showing parsing benefits */}
          <Card className="bg-slate-50 border border-slate-200/50 p-6 rounded-3xl space-y-3.5">
            <span className="block text-[10px] font-bold text-blue-600 uppercase tracking-widest">JobBoard Tip</span>
            <h4 className="text-xs font-extrabold text-slate-800 leading-tight">Match Compatibility Scoring</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              When applying to jobs, our backend automatically computes a compatibility score based on your matching core stack. Keep your credentials updated in your profile!
            </p>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
