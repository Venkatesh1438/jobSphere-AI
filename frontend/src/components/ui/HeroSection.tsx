import React from 'react'
import { Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SearchBar } from './SearchBar'
import { Button } from './Button'
import { motion } from 'framer-motion'

interface HeroSectionProps {
  onSearch: (filters: { search: string; location: string }) => void
  initialSearch?: string
  initialLocation?: string
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  initialSearch = '',
  initialLocation = '',
}) => {
  return (
    <div className="relative overflow-hidden bg-slate-50/60 py-20 sm:py-24 rounded-[32px] border border-slate-100/80 shadow-sm">
      {/* Decorative Animated Blur Elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 1],
          x: [0, 10, 0],
          y: [0, -10, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          x: [0, -15, 0],
          y: [0, 15, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" 
      />

      <div className="relative max-w-5xl mx-auto px-6 text-center space-y-8">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-blue-50 text-blue-800 text-xs font-bold rounded-full tracking-wide uppercase border border-blue-100 shadow-sm"
        >
          <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
          <span>AI-Powered Global Recruitment Platform</span>
        </motion.div>
 
        {/* Animated Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto"
        >
          Connecting Elite Software Talent with{' '}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Verified Enterprise Brands
          </span>
        </motion.h1>

        {/* Animated Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
        >
          JobBoard matches top global developers with verified SaaS and enterprise companies using intelligent compatibility filters.
        </motion.p>

        {/* Search Bar container with transition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-4"
        >
          <SearchBar
            onSearch={onSearch}
            initialSearch={initialSearch}
            initialLocation={initialLocation}
          />
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <Link to="/jobs">
            <Button variant="primary" className="font-bold shadow-md shadow-blue-500/10 rounded-xl px-6 py-3">
              Browse Jobs
            </Button>
          </Link>
          <Link to="/companies">
            <Button variant="outline" className="font-bold border-slate-200 hover:bg-slate-50 rounded-xl px-6 py-3 bg-white text-slate-700">
              Explore Companies
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
export default HeroSection
