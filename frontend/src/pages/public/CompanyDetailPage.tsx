import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Globe, ExternalLink, ArrowLeft, ShieldCheck, Users, Briefcase, Mail, Building2, User, Sparkles, Calendar, BookOpen, Eye, Target } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Avatar } from '../../components/ui/Avatar'
import { JobCard } from '../../components/ui/JobCard'
import { ShowcaseJobCard } from '../../components/ui/ShowcaseJobCard'
import { SkeletonLoader } from '../../components/ui/SkeletonLoader'
import ErrorState from '../../components/ui/ErrorState'
import { useCompanyDetails } from '../../api/companies'
import { useJobs } from '../../api/jobs'
import { showcaseCompanies, showcaseJobs } from '../../components/ui/showcaseData'
import { toast } from 'react-hot-toast'

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<'about' | 'jobs'>('about')

  const isShowcase = id?.startsWith('sc-')

  // Disable API fetch if it is a showcase ID
  const { data, isLoading: apiLoading, isError: apiError, error, refetch } = useCompanyDetails(
    isShowcase ? '' : (id || '')
  )

  const company = (isShowcase
    ? showcaseCompanies.find((c) => c.id === id)
    : data?.data) as any

  const isLoading = isShowcase ? false : apiLoading
  const isError = isShowcase ? !company : apiError

  // Fetch open jobs (using showcase data if showcase company, or API if backend)
  const { data: jobsResponse, isLoading: jobsLoading } = useJobs(
    isShowcase ? undefined : { page: 1 }
  )

  const openJobs = isShowcase
    ? showcaseJobs.filter(
        (job) => job.company_name.toLowerCase() === company?.company_name.toLowerCase()
      )
    : jobsResponse?.data && company?.recruiter?.id
    ? jobsResponse.data.filter(
        (job) => job.recruiter?.id === company.recruiter?.id && job.status === 'PUBLISHED'
      )
    : []

  const handleSocialClick = (e: React.MouseEvent) => {
    e.preventDefault()
    toast.success('This is a featured showcase company. Sign in to explore live companies.', {
      icon: '✨',
      duration: 4000,
    })
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Back Link */}
      <Link
        to="/companies"
        className="inline-flex items-center text-sm font-semibold text-slate-550 hover:text-blue-650 transition-colors"
      >
        <ArrowLeft className="h-4.5 w-4.5 mr-1.5" />
        <span>Back to Companies</span>
      </Link>

      {/* Loading state */}
      {isLoading && <SkeletonLoader type="detail-page" />}

      {/* Error state */}
      {isError && (
        <ErrorState error={error} onRetry={refetch} title="Failed to load company profile" />
      )}

      {/* Profile Detail Content */}
      {!isLoading && !isError && company && (
        <div className="space-y-8">
          {/* Header Banner & Logo Card */}
          <Card className="p-0 border border-slate-100 bg-white overflow-hidden shadow-sm rounded-[24px]">
            {/* Cover Banner */}
            <div 
              className="h-40 sm:h-52 w-full relative"
              style={isShowcase ? { background: company.cover_gradient } : undefined}
            >
              {!isShowcase && company.cover_image_url && (
                <img
                  src={company.cover_image_url}
                  alt={`${company.company_name} Cover`}
                  className="w-full h-full object-cover opacity-85"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none'
                  }}
                />
              )}
              {!isShowcase && !company.cover_image_url && (
                <div className="w-full h-full bg-gradient-to-r from-blue-700 to-indigo-700" />
              )}
            </div>
            
            {/* Logo, title and badges overlay positioning */}
            <div className="px-6 sm:px-8 pb-8 pt-4 relative flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 -mt-16 sm:-mt-20">
                <Avatar
                  src={isShowcase ? company.logo : company.logo_url}
                  name={company.company_name}
                  size="xl"
                  className="border-4 border-white shadow-md bg-white rounded-[32px] relative z-10"
                />
                
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                      {company.company_name}
                    </h1>
                    {company.verified && (
                      <Badge variant="success" styleType="soft" className="shadow-sm rounded-full border border-emerald-100 bg-emerald-50 text-emerald-700">
                        <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                        <span>Verified</span>
                      </Badge>
                    )}
                    {isShowcase && (
                      <Badge variant="primary" styleType="soft" className="shadow-sm rounded-full border border-blue-100 bg-blue-50 text-blue-700">
                        <Sparkles className="h-3.5 w-3.5 mr-1" />
                        <span>Showcase Partner</span>
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-blue-650 uppercase tracking-wider">
                    {company.industry}
                  </p>
                  
                  {/* Location, Size, URL details */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 pt-2 text-xs font-semibold text-slate-500">
                    <span className="flex items-center space-x-1.5">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span>{company.location}</span>
                    </span>
                    {(company.company_size || isShowcase) && (
                      <span className="flex items-center space-x-1.5">
                        <Users className="h-4 w-4 text-slate-400" />
                        <span>{isShowcase ? company.employee_count : `${company.company_size} Employees`}</span>
                      </span>
                    )}
                    {(company.website || isShowcase) && (
                      <span className="flex items-center space-x-1.5">
                        <Globe className="h-4 w-4 text-slate-400" />
                        {isShowcase ? (
                          <button
                            onClick={handleSocialClick}
                            className="hover:text-blue-600 flex items-center space-x-1 text-blue-550 hover:underline font-bold"
                          >
                            <span>{company.website?.replace(/(^\w+:|^)\/\//, '')}</span>
                            <ExternalLink className="h-3 w-3" />
                          </button>
                        ) : (
                          <a
                            href={company.website?.startsWith('http') ? company.website : `https://${company.website}`}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-blue-600 flex items-center space-x-1 text-blue-500 hover:underline"
                          >
                            <span>{company.website?.replace(/(^\w+:|^)\/\//, '')}</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-t border-slate-100 px-6 sm:px-8 bg-slate-50/50">
              <button
                onClick={() => setActiveTab('about')}
                className={`py-4 px-4 border-b-2 text-sm font-bold transition-all ${
                  activeTab === 'about'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                About Company
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`py-4 px-4 border-b-2 text-sm font-bold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'jobs'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Open Openings</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeTab === 'jobs' ? 'bg-blue-100 text-blue-700' : 'bg-slate-150 text-slate-600'
                }`}>
                  {openJobs.length}
                </span>
              </button>
            </div>
          </Card>

          {/* Tab content wrapper */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {activeTab === 'about' ? (
              <>
                {/* Main profile description */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="bg-white border border-slate-100 p-8 space-y-6 shadow-sm rounded-[24px]">
                    <div className="space-y-4">
                      <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        <span>Company Overview</span>
                      </h2>
                      <p className="text-sm text-slate-650 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {company.about || 'No company overview details have been provided yet.'}
                      </p>
                    </div>

                    {/* Mission and Vision (Showcase Specific) */}
                    {isShowcase && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                        <div className="bg-slate-50/50 dark:bg-darkBg/50 p-5 rounded-2xl border border-slate-100 dark:border-darkBorder space-y-2">
                          <h4 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                            <Target className="h-4.5 w-4.5 text-blue-500" />
                            <span>Corporate Mission</span>
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            {company.mission}
                          </p>
                        </div>
                        <div className="bg-slate-50/50 dark:bg-darkBg/50 p-5 rounded-2xl border border-slate-100 dark:border-darkBorder space-y-2">
                          <h4 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                            <Eye className="h-4.5 w-4.5 text-indigo-500" />
                            <span>Corporate Vision</span>
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            {company.vision}
                          </p>
                        </div>
                      </div>
                    )}

                    {company.company_culture && (
                      <div className="pt-6 border-t border-slate-100 space-y-4">
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                          <span>Culture & Working Environment</span>
                        </h3>
                        <p className="text-sm text-slate-655 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {company.company_culture}
                        </p>
                      </div>
                    )}

                    {company.benefits && company.benefits.length > 0 && (
                      <div className="pt-6 border-t border-slate-100 space-y-4">
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Benefits & Perks</h3>
                        <div className="flex flex-wrap gap-2">
                          {company.benefits.map((benefit: string, index: number) => (
                            <Badge key={index} variant="primary" styleType="soft" className="px-3 py-1 text-xs rounded-full">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                </div>

                {/* Sidebar overview details */}
                <div className="space-y-6">
                  <Card className="bg-white border border-slate-100 p-6 space-y-5 shadow-sm rounded-[24px]">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 pb-3">
                      Corporate Summary
                    </h3>
                    
                    <div className="space-y-3.5 text-sm">
                      {company.founded_year && (
                        <div className="flex justify-between font-semibold">
                          <span className="text-slate-500">Founded Year</span>
                          <span className="text-slate-800 dark:text-slate-200">{company.founded_year}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-500">HQ Location</span>
                        <span className="text-slate-850 dark:text-slate-200">{company.location}</span>
                      </div>
                      {isShowcase ? (
                        <>
                          <div className="flex justify-between font-semibold">
                            <span className="text-slate-500">Employee Count</span>
                            <span className="text-slate-800 dark:text-slate-200">{company.employee_count}</span>
                          </div>
                          <div className="flex justify-between font-semibold">
                            <span className="text-slate-500">Company Size</span>
                            <span className="text-slate-800 dark:text-slate-200">{company.company_size} Employees</span>
                          </div>
                        </>
                      ) : (
                        company.company_size && (
                          <div className="flex justify-between font-semibold">
                            <span className="text-slate-500">Company Size</span>
                            <span className="text-slate-800 dark:text-slate-200">{company.company_size} Employees</span>
                          </div>
                        )
                      )}
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-500">Industry</span>
                        <span className="text-slate-800 dark:text-slate-200">{company.industry}</span>
                      </div>
                    </div>
                  </Card>

                  {/* Core Technologies Stack (Showcase Specific) */}
                  {isShowcase && company.technologies && (
                    <Card className="bg-white border border-slate-100 p-6 space-y-4 shadow-sm rounded-[24px]">
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 pb-3">
                        Tech Stack
                      </h3>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {company.technologies.map((tech: string) => (
                          <Badge key={tech} variant="gray" styleType="soft" className="rounded-full text-xs font-semibold px-2.5 py-1">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Hiring Process Card (Showcase Specific) */}
                  {isShowcase && company.hiring_process && (
                    <Card className="bg-white border border-slate-100 p-6 space-y-4 shadow-sm rounded-[24px]">
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 pb-3 flex items-center gap-1.5">
                        <Calendar className="h-4.5 w-4.5 text-blue-600" />
                        <span>Hiring Process</span>
                      </h3>
                      <div className="space-y-3 pt-1">
                        {company.hiring_process.map((step: string, idx: number) => (
                          <div key={idx} className="flex gap-3 text-xs">
                            <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-extrabold flex items-center justify-center flex-shrink-0">
                              {idx + 1}
                            </span>
                            <span className="text-slate-650 dark:text-slate-300 font-medium leading-relaxed mt-0.5">{step}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Social Buttons (Showcase) */}
                  {isShowcase && (
                    <Card className="bg-white border border-slate-100 p-6 space-y-4 shadow-sm rounded-[24px]">
                      <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-1.5">
                        <Users className="h-4.5 w-4.5 text-blue-600" />
                        <span>Connect</span>
                      </h3>
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <button
                          onClick={handleSocialClick}
                          className="flex items-center justify-center font-bold text-xs bg-slate-100 dark:bg-darkBg hover:bg-slate-150 dark:hover:bg-darkBorder text-slate-800 dark:text-slate-200 py-3 rounded-xl border border-slate-200 dark:border-darkBorder gap-1.5 transition-all"
                        >
                          <Globe className="h-3.5 w-3.5" />
                          <span>Website</span>
                        </button>
                        <button
                          onClick={handleSocialClick}
                          className="flex items-center justify-center font-bold text-xs bg-slate-100 dark:bg-darkBg hover:bg-slate-150 dark:hover:bg-darkBorder text-slate-800 dark:text-slate-200 py-3 rounded-xl border border-slate-200 dark:border-darkBorder gap-1.5 transition-all"
                        >
                          <Users className="h-3.5 w-3.5" />
                          <span>LinkedIn</span>
                        </button>
                      </div>
                    </Card>
                  )}

                  {/* Recruiter Details Card (Real Backend) */}
                  {!isShowcase && company.recruiter && (
                    <Card className="bg-white border border-slate-100 p-6 space-y-4 shadow-sm rounded-[24px]">
                      <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-1.5">
                        <User className="h-4.5 w-4.5 text-blue-650" />
                        <span>Hiring Manager</span>
                      </h3>
                      
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-650 text-white flex items-center justify-center font-bold shadow-sm">
                          {company.recruiter.first_name?.charAt(0) || 'R'}
                        </div>
                        <div className="min-w-0">
                          <span className="block text-sm font-extrabold text-slate-900 truncate">
                            {company.recruiter.first_name} {company.recruiter.last_name || ''}
                          </span>
                          <span className="block text-xs font-semibold text-slate-500 mt-0.5 truncate">
                            Hiring Team Recruiter
                          </span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <a
                          href={`mailto:${company.recruiter.email}`}
                          className="w-full inline-flex items-center justify-center font-bold text-xs bg-slate-150 dark:bg-darkBg hover:bg-slate-200 dark:hover:bg-darkBorder text-slate-800 dark:text-slate-200 py-2.5 rounded-xl border border-slate-200 dark:border-darkBorder gap-2 transition-all"
                        >
                          <Mail className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                          <span>Contact Email</span>
                        </a>
                      </div>
                    </Card>
                  )}
                </div>
              </>
            ) : (
              // Open Positions Tab
              <div className="col-span-full space-y-4">
                {jobsLoading ? (
                  <SkeletonLoader type="job-card" count={2} />
                ) : openJobs.length === 0 ? (
                  <Card className="p-8 border border-slate-100 text-center bg-white rounded-[24px]">
                    <Briefcase className="h-10 w-10 text-slate-400 mx-auto stroke-[1.5] mb-3" />
                    <h3 className="font-extrabold text-slate-950 text-base">No Open Openings</h3>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed">
                      This company currently has no active published job openings. Check back soon for new listings.
                    </p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {openJobs.map((job: any) => (
                      isShowcase ? (
                        <ShowcaseJobCard key={job.id} job={job} />
                      ) : (
                        <JobCard key={job.id} job={job} />
                      )
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
