import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Briefcase, ShieldCheck } from 'lucide-react'
import { Card } from './Card'
import { Avatar } from './Avatar'
import { Badge } from './Badge'
import { Company } from '../../api/companies'

interface CompanyCardProps {
  company: Company
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  return (
    <Card
      hoverEffect={true}
      className="bg-white dark:bg-darkCard border border-slate-100 dark:border-darkBorder flex flex-col justify-between h-[340px] overflow-hidden p-0 relative group"
    >
      {/* Cover image or gradient header */}
      <div className="h-28 w-full bg-gradient-to-r from-blue-600/90 to-indigo-600/90 relative flex-shrink-0">
        {company.cover_image_url && (
          <img
            src={company.cover_image_url}
            alt={`${company.company_name} Cover`}
            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none'
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Profile Logo positioning */}
      <div className="px-6 relative -mt-9 flex-1">
        <div className="flex justify-between items-end mb-3">
          <Avatar
            src={company.logo_url}
            name={company.company_name}
            size="lg"
            className="border-4 border-white dark:border-darkBorder shadow-md bg-white dark:bg-darkCard rounded-3xl"
          />
          {company.verified && (
            <Badge variant="success" styleType="soft" className="mb-2 shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5 mr-1" />
              <span>Verified</span>
            </Badge>
          )}
        </div>

        {/* Company Title & Details */}
        <div className="space-y-1.5 min-w-0">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight group-hover:text-blue-600 transition-colors truncate">
            {company.company_name}
          </h3>
          <p className="text-xs font-semibold text-blue-650 dark:text-blue-400 truncate uppercase tracking-wider">
            {company.industry}
          </p>
          {company.company_tagline ? (
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed pt-1.5">
              {company.company_tagline}
            </p>
          ) : (
            <p className="text-xs font-medium text-slate-400 italic line-clamp-2 leading-relaxed pt-1.5">
              No tagline available for this employer.
            </p>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-slate-100 dark:bg-darkBorder mt-4" />

      {/* Card Footer */}
      <div className="px-6 py-4 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-darkBg/30 flex-shrink-0">
        <span className="flex items-center space-x-1.5 max-w-[55%]">
          <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
          <span className="truncate text-slate-600 dark:text-slate-400">{company.location}</span>
        </span>

        <Link
          to={`/companies/${company.id}`}
          className="flex items-center text-blue-600 hover:text-indigo-600 font-bold transition-colors"
        >
          <Briefcase className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
          <span>
            {company.active_jobs_count} job{company.active_jobs_count !== 1 && 's'} &rarr;
          </span>
        </Link>
      </div>
    </Card>
  )
}
