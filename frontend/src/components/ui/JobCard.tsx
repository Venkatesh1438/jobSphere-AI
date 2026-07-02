import { useState, FC, MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, DollarSign, Calendar, Heart } from 'lucide-react'
import { Card } from './Card'
import { Avatar } from './Avatar'
import { Badge } from './Badge'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Job } from '../../api/jobs'
import { useCompanies } from '../../api/companies'

interface JobCardProps {
  job: Job
}

export const JobCard: FC<JobCardProps> = ({ job }) => {
  const [isSaved, setIsSaved] = useState(false)
  
  // Retrieve company info from react-query cache by matching recruiter ID
  const { data: companiesResponse } = useCompanies()
  
  const company = companiesResponse?.data?.find(
    (c) => c.recruiter?.id === job.recruiter?.id
  )

  const companyName = company?.company_name || 'Verified Employer'
  const companyLogo = company?.logo_url

  const handleSaveToggle = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const nextSaved = !isSaved
    setIsSaved(nextSaved)
    if (nextSaved) {
      toast.success('Job saved to your bookmarks!')
    } else {
      toast.success('Job removed from bookmarks.')
    }
  }

  // Format date helper
  const getRelativeDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const diffTime = Math.abs(Date.now() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    return `${diffDays} days ago`
  }

  return (
    <Card hoverEffect={true} className="border border-slate-100 bg-white p-6 relative group transition-all duration-300">
      <div className="flex flex-col sm:flex-row gap-5 justify-between">
        {/* Left Section: Logo & Details */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <Avatar
            src={companyLogo}
            name={companyName}
            size="md"
            className="border border-slate-100 shadow-sm"
          />
          
          <div className="space-y-1.5 flex-grow min-w-0">
            <div className="flex flex-wrap gap-1.5 items-center">
              <Link
                to={`/jobs/${job.id}`}
                className="text-lg font-extrabold text-slate-900 hover:text-blue-600 transition-colors tracking-tight block truncate pr-4"
              >
                {job.title}
              </Link>
            </div>

            <div className="text-sm font-semibold text-slate-600 flex items-center space-x-1.5">
              <span>{companyName}</span>
              {company?.verified && (
                <Badge variant="success" styleType="soft" className="scale-[0.8] origin-left py-0 px-1.5">
                  Verified
                </Badge>
              )}
            </div>

            {/* Tags (Employment & Experience) */}
            <div className="flex flex-wrap gap-2 pt-1.5">
              <Badge variant="primary" styleType="soft">
                {job.employment_type.replace('_', ' ')}
              </Badge>
              <Badge variant="gray" styleType="soft">
                {job.experience_level.toLowerCase()}
              </Badge>
            </div>

            {/* Core Job Details Footer info */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-3.5 text-xs font-semibold text-slate-500">
              <span className="flex items-center space-x-1.5">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span>{job.location}</span>
              </span>
              
              {(job.salary_min || job.salary_max) && (
                <span className="flex items-center space-x-1.5">
                  <DollarSign className="h-4 w-4 text-slate-400" />
                  <span>
                    {job.salary_min && `$${Number(job.salary_min).toLocaleString()}`}
                    {job.salary_min && job.salary_max && ' - '}
                    {job.salary_max && `$${Number(job.salary_max).toLocaleString()}`}
                  </span>
                </span>
              )}
              
              <span className="flex items-center space-x-1.5">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>Posted {getRelativeDate(job.created_at)}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Actions & Save Button */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 flex-shrink-0">
          {/* Heart Save Button */}
          <button
            onClick={handleSaveToggle}
            className={`p-2.5 rounded-xl border border-slate-100 hover:border-rose-100 hover:bg-rose-50/50 group/save transition-all shadow-sm`}
          >
            <motion.div
              animate={{ scale: isSaved ? [1, 1.25, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heart
                className={`h-4.5 w-4.5 transition-colors ${
                  isSaved
                    ? 'fill-rose-500 text-rose-500'
                    : 'text-slate-400 group-hover/save:text-rose-500'
                }`}
              />
            </motion.div>
          </button>

          {/* Details CTA Link */}
          <Link
            to={`/jobs/${job.id}`}
            className="inline-flex items-center justify-center font-bold text-xs bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-600 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-blue-200 transition-all ml-auto sm:ml-0"
          >
            Details
          </Link>
        </div>
      </div>
    </Card>
  )
}
