import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Briefcase, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from './Badge'
import { Card } from './Card'
import { ShowcaseCompany } from './showcaseData'

interface ShowcaseCompanyCardProps {
  company: ShowcaseCompany
}

export const ShowcaseCompanyCard: React.FC<ShowcaseCompanyCardProps> = ({ company }) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Card
        className="bg-white dark:bg-darkCard border border-slate-100 dark:border-darkBorder flex flex-col justify-between h-[340px] overflow-hidden p-0 relative group rounded-[24px] shadow-sm hover:shadow-xl transition-all duration-300"
      >
        {/* Cover image or gradient header */}
        <Link to={`/companies/${company.id}`} className="block h-28 w-full relative flex-shrink-0 overflow-hidden">
          <div 
            className="w-full h-full group-hover:scale-105 transition-transform duration-500"
            style={{ background: company.cover_gradient }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </Link>

        {/* Profile Logo positioning */}
        <div className="px-6 relative -mt-9 flex-1">
          <div className="flex justify-between items-end mb-3">
            <Link to={`/companies/${company.id}`} className="block border-4 border-white dark:border-darkBorder shadow-md bg-white dark:bg-darkCard rounded-3xl w-16 h-16 flex items-center justify-center p-1.5 overflow-hidden hover:scale-105 transition-transform relative z-10">
              <img
                src={company.logo}
                alt={`${company.company_name} Logo`}
                className="w-full h-full object-contain"
              />
            </Link>
            {company.verified && (
              <Badge variant="success" styleType="soft" className="mb-2 shadow-sm rounded-full px-2.5 py-0.5 border border-emerald-100 bg-emerald-50 text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Verified</span>
              </Badge>
            )}
          </div>

          {/* Company Title & Details */}
          <div className="space-y-1.5 min-w-0">
            <Link to={`/companies/${company.id}`} className="block">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight group-hover:text-blue-600 transition-colors truncate">
                {company.company_name}
              </h3>
            </Link>
            <p className="text-xs font-semibold text-blue-650 dark:text-blue-400 truncate uppercase tracking-wider">
              {company.industry}
            </p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed pt-1.5">
              {company.company_tagline}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-slate-100 dark:bg-darkBorder" />

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
            <Briefcase className="h-3.5 w-3.5 mr-1 text-blue-500" />
            <span>
              {company.open_jobs_count} open jobs &rarr;
            </span>
          </Link>
        </div>
      </Card>
    </motion.div>
  )
}
export default ShowcaseCompanyCard
