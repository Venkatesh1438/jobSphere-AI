import { useParams, Link, useNavigate } from 'react-router-dom'
import { MapPin, DollarSign, ArrowLeft, Briefcase, CheckCircle2, Sparkles, Award, Users, BookOpen, Clock } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { SkeletonLoader } from '../../components/ui/SkeletonLoader'
import ErrorState from '../../components/ui/ErrorState'
import { useJobDetails, useJobs } from '../../api/jobs'
import { useCompanies } from '../../api/companies'
import { showcaseCompanies, showcaseJobs } from '../../components/ui/showcaseData'
import { toast } from 'react-hot-toast'
import { useAuth } from '../../hooks/useAuth'

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()

  const isShowcase = id?.startsWith('sj-')

  // Disable API call for showcase job details
  const { data, isLoading: apiLoading, isError: apiError, error, refetch } = useJobDetails(
    isShowcase ? '' : (id || '')
  )
  
  const job = (isShowcase 
    ? showcaseJobs.find((j) => j.id === id) 
    : data?.data) as any

  const isLoading = isShowcase ? false : apiLoading
  const isError = isShowcase ? !job : apiError

  // Fetch companies to map logo and name
  const { data: companiesResponse } = useCompanies()
  
  const company = (isShowcase
    ? showcaseCompanies.find((c) => c.company_name.toLowerCase() === job?.company_name?.toLowerCase())
    : companiesResponse?.data?.find(
        (c) => c.recruiter?.id === job?.recruiter?.id
      )) as any

  const companyName = isShowcase
    ? job?.company_name || 'Verified Employer'
    : company?.company_name || 'Verified Employer'
    
  const companyLogo = isShowcase
    ? job?.company_logo
    : company?.logo_url

  // Fetch related jobs (recent jobs from the same recruiter or general recent jobs)
  const { data: jobsResponse } = useJobs({ page: 1 })
  
  const relatedJobs = isShowcase
    ? showcaseJobs.filter((j) => j.id !== id).slice(0, 3)
    : jobsResponse?.data
    ? jobsResponse.data
        .filter((j) => j.id !== id) // exclude current job
        .slice(0, 3)
    : []

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in as a candidate to apply for this position.')
      navigate('/login', { state: { from: `/jobs/${id}` } })
      return
    }

    if (user?.role !== 'CANDIDATE') {
      toast.error('Only Candidate accounts can apply for jobs. Please sign in with your candidate profile.')
      return
    }

    if (isShowcase) {
      toast.success(
        `🎉 Application Submitted!\nYour profile has been sent to ${job?.company_name} for the ${job?.title} role. They'll be in touch within 3–5 business days.`,
        { duration: 5000, style: { maxWidth: '420px' } }
      )
      return
    }

    navigate(`/jobs/${id}/apply`)
  }

  // Format date helper
  const getRelativeDate = (dateStr: string) => {
    if (isShowcase) return dateStr
    const date = new Date(dateStr)
    const diffTime = Math.abs(Date.now() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    return `${diffDays} days ago`
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Back Link */}
      <Link
        to="/jobs"
        className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-blue-655 transition-colors"
      >
        <ArrowLeft className="h-4.5 w-4.5 mr-1.5" />
        <span>Back to Job Openings</span>
      </Link>

      {/* Loading State */}
      {isLoading && <SkeletonLoader type="detail-page" />}

      {/* Error state */}
      {isError && (
        <ErrorState error={error} onRetry={refetch} title="Failed to load job details" />
      )}

      {/* Success View */}
      {!isLoading && !isError && job && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main details body */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white border border-slate-100 p-8 space-y-6 rounded-[24px] shadow-sm">
              {/* Header section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pb-6 border-b border-slate-100">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="border border-slate-100 shadow-sm rounded-2xl w-16 h-16 flex items-center justify-center p-2 bg-slate-50 flex-shrink-0">
                    <img
                      src={companyLogo || undefined}
                      alt={`${companyName} Logo`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                      {job.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-600">
                      {company?.id ? (
                        <Link to={`/companies/${company.id}`} className="hover:text-blue-650 hover:underline">
                          {companyName}
                        </Link>
                      ) : isShowcase && company?.id ? (
                        <Link to={`/companies/${company.id}`} className="hover:text-blue-650 hover:underline">
                          {companyName}
                        </Link>
                      ) : (
                        <span>{companyName}</span>
                      )}
                      {company?.verified && (
                        <Badge variant="success" styleType="soft" className="scale-[0.8] origin-left rounded-full border border-emerald-100 bg-emerald-50 text-emerald-700">
                          Verified Partner
                        </Badge>
                      )}
                      {isShowcase && (
                        <Badge variant="primary" styleType="soft" className="scale-[0.8] origin-left rounded-full border border-blue-100 bg-blue-50 text-blue-700">
                          <Sparkles className="h-3 w-3 mr-1" />
                          <span>Showcase Role</span>
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-2">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Location
                  </span>
                  <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span>{job.location}</span>
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Experience band
                  </span>
                  <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-slate-400" />
                    <span className="capitalize">{job.experience_level.toLowerCase()} level</span>
                  </span>
                </div>

                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Salary Band (Yearly)
                  </span>
                  <span className="text-sm font-bold text-slate-850 flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-slate-400" />
                    <span>
                      {isShowcase ? (
                        job.salary_range
                      ) : (
                        <>
                          {job.salary_min && `$${Number(job.salary_min).toLocaleString()}`}
                          {job.salary_min && job.salary_max && ' - '}
                          {job.salary_max && `$${Number(job.salary_max).toLocaleString()}`}
                        </>
                      )}
                    </span>
                  </span>
                </div>
              </div>

              {/* Showcase specific metadata parameters */}
              {isShowcase && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-2 border-t border-slate-100 pt-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                      Department
                    </span>
                    <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-slate-400" />
                      <span>{(job as any).department}</span>
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                      Team Size
                    </span>
                    <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-slate-400" />
                      <span>{(job as any).team_size} members</span>
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                      Work Mode
                    </span>
                    <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span>{(job as any).work_mode}</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Required Skills list */}
              {((isShowcase && (job as any).skills) || (!isShowcase && job.skills_required)) && (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Required Core Stack & Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(isShowcase ? (job as any).skills : job.skills_required).map((skill: string, index: number) => (
                      <Badge key={index} variant="primary" styleType="soft" className="px-3 py-1 text-xs rounded-full">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <h3 className="text-base font-extrabold text-slate-900">Job Description Overview</h3>
                <p className="text-sm text-slate-655 leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>

              {/* Responsibilities list */}
              {isShowcase && (job as any).responsibilities && (
                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <h3 className="text-base font-extrabold text-slate-900">Primary Responsibilities</h3>
                  <ul className="space-y-3 text-sm text-slate-650 font-medium">
                    {(job as any).responsibilities.map((resp: string, idx: number) => (
                      <li key={idx} className="flex items-start space-x-2.5">
                        <CheckCircle2 className="h-4.5 w-4.5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements & Qualifications */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <h3 className="text-base font-extrabold text-slate-900">Qualifications & Requirements</h3>
                <ul className="space-y-3 text-sm text-slate-655 font-medium">
                  {isShowcase && (job as any).requirements ? (
                    (job as any).requirements.map((req: string, idx: number) => (
                      <li key={idx} className="flex items-start space-x-2.5">
                        <CheckCircle2 className="h-4.5 w-4.5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-start space-x-2.5">
                        <CheckCircle2 className="h-4.5 w-4.5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Demonstrated commercial expertise matching the required skills above.</span>
                      </li>
                      <li className="flex items-start space-x-2.5">
                        <CheckCircle2 className="h-4.5 w-4.5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Strong communication skills and comfortable working in sync/async teams.</span>
                      </li>
                      <li className="flex items-start space-x-2.5">
                        <CheckCircle2 className="h-4.5 w-4.5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Proactive problem-solver with clean, testable coding practices.</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Nice to Have Section (Showcase Specific) */}
              {isShowcase && (job as any).nice_to_have && (
                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <h3 className="text-base font-extrabold text-slate-900">Nice to Have</h3>
                  <ul className="space-y-3 text-sm text-slate-650 font-medium">
                    {(job as any).nice_to_have.map((nice: string, idx: number) => (
                      <li key={idx} className="flex items-start space-x-2.5">
                        <CheckCircle2 className="h-4.5 w-4.5 text-indigo-500 mt-0.5 flex-shrink-0" />
                        <span>{nice}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits Section */}
              {isShowcase && (job as any).benefits && (
                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <h3 className="text-base font-extrabold text-slate-900">Benefits & Perks</h3>
                  <div className="flex flex-wrap gap-2">
                    {(job as any).benefits.map((benefit: string, index: number) => (
                      <Badge key={index} variant="primary" styleType="soft" className="px-3 py-1 text-xs rounded-full">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar widget - Sticky Application card */}
          <div className="space-y-6">
            <Card className="bg-white border border-slate-100 p-6 space-y-6 sticky top-24 shadow-sm rounded-[24px]">
              <div className="space-y-2">
                <h3 className="text-base font-extrabold text-slate-900">Interested in this role?</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Submit your matching developer profile and credentials directly to the hiring manager.
                </p>
              </div>

              <div className="space-y-4 py-2 border-y border-slate-100 text-xs text-slate-500 font-semibold">
                <div className="flex justify-between">
                  <span>Job Status</span>
                  <Badge variant="primary" styleType="soft" className="text-[10px] py-0.5 rounded-full px-2">
                    {isShowcase ? 'Open' : job.status.toLowerCase()}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Employment</span>
                  <span>{job.employment_type.replace('_', ' ')}</span>
                </div>
                {isShowcase && (
                  <>
                    <div className="flex justify-between">
                      <span>Work Mode</span>
                      <span>{(job as any).work_mode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Education</span>
                      <span className="max-w-[60%] text-right truncate">{(job as any).education}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span>Posted Date</span>
                  <span>{getRelativeDate(job.created_at || '')}</span>
                </div>
              </div>

              <Button
                variant="primary"
                onClick={handleApplyClick}
                className={`w-full font-bold shadow-md rounded-xl ${
                  isAuthenticated && user?.role === 'CANDIDATE'
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                    : 'bg-slate-800 hover:bg-slate-900 shadow-slate-500/10'
                }`}
              >
                {isAuthenticated && user?.role === 'CANDIDATE'
                  ? '🚀 Apply Now'
                  : 'Sign In to Apply'
                }
              </Button>

              <div className="text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                  {isAuthenticated && user?.role === 'CANDIDATE'
                    ? 'Your profile will be sent to the hiring team'
                    : 'Requires candidate portal login'
                  }
                </span>
              </div>
            </Card>

            {/* Hiring Process Steps (Showcase Specific) */}
            {isShowcase && (job as any).hiring_process && (
              <Card className="bg-white border border-slate-100 p-6 space-y-4 rounded-[24px] shadow-sm">
                <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-1.5">
                  <BookOpen className="h-4.5 w-4.5 text-blue-600" />
                  <span>Hiring Pipeline</span>
                </h3>
                <div className="space-y-4 pt-1">
                  {(job as any).hiring_process.map((step: string, idx: number) => (
                    <div key={idx} className="flex gap-3 text-xs">
                      <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 font-extrabold flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <div className="space-y-0.5">
                        <span className="block font-bold text-slate-800">Stage {idx + 1}</span>
                        <span className="block text-slate-500 font-medium leading-relaxed">{step}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Related Jobs Section */}
            {relatedJobs.length > 0 && (
              <div className="space-y-4 pt-2">
                <h3 className="text-lg font-extrabold text-slate-900 mx-1">Other Open Positions</h3>
                <div className="space-y-4">
                  {relatedJobs.map((related: any) => (
                    <Card key={related.id} hoverEffect={true} className="p-4 border border-slate-100 bg-white flex justify-between items-center gap-4 rounded-[20px] shadow-sm">
                      <div className="min-w-0">
                        <Link to={`/jobs/${related.id}`} className="text-sm font-bold text-slate-900 hover:text-blue-600 block truncate">
                          {related.title}
                        </Link>
                        <span className="text-xs text-slate-500 font-medium mt-0.5 block">{related.location}</span>
                      </div>
                      <Link
                        to={`/jobs/${related.id}`}
                        className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition-all"
                      >
                        View
                      </Link>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
