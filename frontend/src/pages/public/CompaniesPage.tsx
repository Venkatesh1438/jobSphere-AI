import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X, Building2 } from 'lucide-react'
import { ShowcaseCompanyCard } from '../../components/ui/ShowcaseCompanyCard'
import { CompanyCard } from '../../components/ui/CompanyCard'
import { showcaseCompanies } from '../../components/ui/showcaseData'
import EmptyState from '../../components/ui/EmptyState'
import { motion } from 'framer-motion'
import { useCompanies } from '../../api/companies'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
}

// Industry filter options derived from showcase data
const industries = ['All', ...Array.from(new Set(showcaseCompanies.map((c) => c.industry)))]

export default function CompaniesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialSearchQuery = searchParams.get('search') || ''

  const [search, setSearch] = useState(initialSearchQuery)
  const [selectedIndustry, setSelectedIndustry] = useState('All')

  // Sync state if URL changes (e.g. searching from navbar)
  useEffect(() => {
    const q = searchParams.get('search') || ''
    setSearch(q)
  }, [searchParams])

  // Fetch backend companies from API
  const { data: apiCompaniesData } = useCompanies({
    search: search || undefined,
  })
  const backendCompanies = apiCompaniesData?.data ?? []

  const handleClearSearch = () => {
    setSearchParams({})
    setSearch('')
    setSelectedIndustry('All')
  }

  const handleSearchChange = (val: string) => {
    setSearch(val)
    setSearchParams(val ? { search: val } : {})
  }

  // Client-side filter over the curated showcase companies
  const displayedShowcaseCompanies = showcaseCompanies.filter((c) => {
    const matchesSearch =
      !search ||
      c.company_name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase()) ||
      c.company_tagline.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase())

    const matchesIndustry = selectedIndustry === 'All' || c.industry === selectedIndustry

    return matchesSearch && matchesIndustry
  })

  // Client-side filter over database companies (as fallback filter)
  const displayedBackendCompanies = backendCompanies.filter((c) => {
    const matchesSearch =
      !search ||
      c.company_name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase()) ||
      (c.company_tagline || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.location || '').toLowerCase().includes(search.toLowerCase())

    const matchesIndustry = selectedIndustry === 'All' || c.industry === selectedIndustry

    return matchesSearch && matchesIndustry
  })

  const totalItems = displayedShowcaseCompanies.length + displayedBackendCompanies.length

  return (
    <div className="space-y-8">
      {/* Page Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-lg shadow-indigo-900/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-3 max-w-2xl">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full uppercase tracking-wider">
            <Building2 className="h-3.5 w-3.5 mr-1" />
            Partner Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Explore Top Hiring Companies
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Browse {showcaseCompanies.length}+ verified enterprise tech companies actively recruiting engineers and developers on JobBoard.
          </p>
        </div>
      </div>

      {/* Search + Industry Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3 max-w-4xl mx-auto w-full">
        {/* Search Input */}
        <div className="flex-1 bg-white border border-slate-100 rounded-2xl p-2.5 shadow-md flex items-center gap-3">
          <Search className="h-5 w-5 text-blue-600 ml-2 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by company, industry, or location..."
            className="w-full py-1.5 text-sm bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          {search && (
            <button
              onClick={() => handleSearchChange('')}
              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full mr-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Industry Filter Dropdown */}
        <select
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
          className="sm:w-52 py-3 px-4 bg-white border border-slate-200 rounded-2xl shadow-md text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {industries.map((ind) => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      {!search && selectedIndustry === 'All' ? (
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
          Showing all {totalItems} verified partner companies
        </p>
      ) : (
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-slate-500">
            {totalItems} {totalItems === 1 ? 'company' : 'companies'} found
            {search && <> for <span className="text-blue-600">"{search}"</span></>}
            {selectedIndustry !== 'All' && <> in <span className="text-blue-600">{selectedIndustry}</span></>}
          </p>
          <button
            onClick={handleClearSearch}
            className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1"
          >
            <X className="h-3.5 w-3.5" /> Clear filters
          </button>
        </div>
      )}

      {/* Company Grid */}
      {totalItems === 0 ? (
        <EmptyState
          title="No Companies Found"
          description={`No companies matched "${search}"${selectedIndustry !== 'All' ? ` in ${selectedIndustry}` : ''}. Try a different search or industry.`}
          actionLabel="Clear Filters"
          onActionClick={handleClearSearch}
        />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {displayedBackendCompanies.map((company) => (
            <motion.div key={company.id} variants={itemVariants}>
              <CompanyCard company={company} />
            </motion.div>
          ))}
          {displayedShowcaseCompanies.map((company) => (
            <motion.div key={company.id} variants={itemVariants}>
              <ShowcaseCompanyCard company={company} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
