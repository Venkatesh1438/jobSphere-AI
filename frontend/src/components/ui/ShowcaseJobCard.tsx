import { FC } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, DollarSign, Calendar, Eye, Send, LogIn } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { Card } from './Card'
import { Badge } from './Badge'
import { ShowcaseJob } from './showcaseData'
import { useAuth } from '../../hooks/useAuth'

interface ShowcaseJobCardProps {
  job: ShowcaseJob
}

export const ShowcaseJobCard: FC<ShowcaseJobCardProps> = ({ job }) => {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  const isCandidate = isAuthenticated && user?.role === 'CANDIDATE'

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/jobs/${job.id}` } })
      return
    }
    if (user?.role !== 'CANDIDATE') {
      toast.error('Only candidates can apply for jobs. Please log in with a candidate account.')
      return
    }
    // Simulate a successful application for showcase jobs
    toast.success(
      `🎉 Application submitted to ${job.company_name}!\nThe hiring team will review your profile within 3–5 business days.`,
      { duration: 5000, style: { maxWidth: '400px' } }
    )
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card
        className="border border-slate-100 dark:border-darkBorder bg-white dark:bg-darkCard p-6 relative group transition-all duration-300 rounded-[24px] shadow-sm hover:shadow-xl"
      >
        <div className="flex flex-col sm:flex-row gap-5 justify-between">
          {/* Left: Logo & Details */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="border border-slate-100 dark:border-darkBorder shadow-sm rounded-2xl w-14 h-14 flex items-center justify-center p-2 bg-slate-50 dark:bg-darkBg flex-shrink-0">
              <img
                src={job.company_logo}
                alt={`${job.company_name} Logo`}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-1.5 flex-grow min-w-0">
              <Link
                to={`/jobs/${job.id}`}
                className="text-lg font-extrabold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors tracking-tight block truncate pr-4"
              >
                {job.title}
              </Link>

              <div className="text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
                <span>{job.company_name}</span>
                <Badge variant="success" styleType="soft" className="scale-[0.8] origin-left py-0 px-1.5 border border-emerald-100 bg-emerald-50 text-emerald-700 rounded-full">
                  Verified Partner
                </Badge>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-1.5">
                <Badge variant="primary" styleType="soft" className="rounded-full">{job.employment_type}</Badge>
                <Badge variant="gray" styleType="soft" className="rounded-full">{job.experience_level}</Badge>
                <Badge variant="gray" styleType="soft" className="rounded-full text-[10px]">{job.work_mode}</Badge>
                {job.skills.slice(0, 2).map((skill) => (
                  <Badge key={skill} variant="gray" styleType="outline" className="rounded-full border-slate-200 dark:border-darkBorder text-slate-500 dark:text-slate-400 bg-transparent text-[10px]">
                    {skill}
                  </Badge>
                ))}
              </div>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="flex items-center space-x-1.5">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span>{job.location}</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <DollarSign className="h-4 w-4 text-slate-400" />
                  <span>{job.salary_range}</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>Posted {job.posted_time}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 flex-shrink-0">
            {/* Details link — always visible */}
            <Link
              to={`/jobs/${job.id}`}
              className="inline-flex items-center justify-center font-bold text-xs bg-white dark:bg-darkCard hover:bg-slate-50 dark:hover:bg-darkBg/50 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-darkBorder transition-all gap-1.5"
            >
              <Eye className="h-3.5 w-3.5 text-slate-500" />
              <span>Details</span>
            </Link>

            {/* Apply button — changes based on auth state */}
            {isCandidate ? (
              <button
                onClick={handleApply}
                className="inline-flex items-center justify-center font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md gap-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Apply Now</span>
              </button>
            ) : (
              <button
                onClick={handleApply}
                className="inline-flex items-center justify-center font-bold text-xs bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md gap-1.5"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Login to Apply</span>
              </button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
export default ShowcaseJobCard
