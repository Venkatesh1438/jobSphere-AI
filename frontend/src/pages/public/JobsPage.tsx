import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, SlidersHorizontal, X, Briefcase, Radio } from 'lucide-react'
import { ShowcaseJobCard } from '../../components/ui/ShowcaseJobCard'
import { JobCard } from '../../components/ui/JobCard'
import { showcaseJobs } from '../../components/ui/showcaseData'
import { FilterSidebar, FilterState } from '../../components/ui/FilterSidebar'
import { SearchBar } from '../../components/ui/SearchBar'
import { Pagination } from '../../components/ui/Pagination'
import { Button } from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import { motion } from 'framer-motion'
import { useJobs } from '../../api/jobs'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
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

const PAGE_SIZE = 10

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialSearchQuery = searchParams.get('search') || ''
  const initialLocationQuery = searchParams.get('location') || ''

  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState(initialSearchQuery)
  const [locationFilter, setLocationFilter] = useState(initialLocationQuery)
  const [filters, setFilters] = useState<FilterState>({
    employment_type: undefined,
    experience_level: undefined,
    location: undefined,
    salary_min: undefined,
    salary_max: undefined,
  })
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [sortBy, setSortBy] = useState<'newest' | 'salary_desc' | 'salary_asc'>('newest')

  // Sync state if URL changes (e.g. searching from navbar)
  useEffect(() => {
    const q = searchParams.get('search') || ''
    const loc = searchParams.get('location') || ''
    setSearch(q)
    setLocationFilter(loc)
  }, [searchParams])

  // ── Fetch backend jobs (recruiter-posted) ────────────────────────────
  const { data: apiJobsData } = useJobs({
    search: search || undefined,
    employment_type: filters.employment_type || undefined,
    experience_level: filters.experience_level || undefined,
    location: filters.location || locationFilter || undefined,
    salary_min: filters.salary_min || undefined,
    salary_max: filters.salary_max || undefined,
  })
  const backendJobs = apiJobsData?.data ?? []

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, locationFilter, filters, sortBy])

  const handleSearchBarSearch = (values: { search: string; location: string }) => {
    setSearchParams({
      search: values.search,
      location: values.location,
    })
  }

  const handleFilterChange = (newFilters: FilterState) => setFilters(newFilters)

  const handleClearFilters = () => {
    setFilters({ employment_type: undefined, experience_level: undefined, location: undefined, salary_min: undefined, salary_max: undefined })
    setLocationFilter('')
    setSearch('')
  }

  // ── Filter showcase jobs (client-side) ───────────────────────────────
  const filteredShowcaseJobs = useMemo(() => showcaseJobs.filter((job) => {
    if (search) {
      const s = search.toLowerCase()
      const match =
        job.title.toLowerCase().includes(s) ||
        job.company_name.toLowerCase().includes(s) ||
        job.skills.some((sk) => sk.toLowerCase().includes(s)) ||
        job.description.toLowerCase().includes(s)
      if (!match) return false
    }
    const loc = filters.location || locationFilter
    if (loc && !job.location.toLowerCase().includes(loc.toLowerCase())) return false
    if (filters.employment_type) {
      const jobType = job.employment_type.toLowerCase().replace(/[^a-z]/g, '')
      const fType  = filters.employment_type.toLowerCase().replace(/[^a-z]/g, '')
      if (jobType !== fType) return false
    }
    if (filters.experience_level) {
      const jl = job.experience_level.toLowerCase()
      const fl = filters.experience_level.toLowerCase()
      let matches = false
      if (fl === 'entry')       matches = jl.includes('junior') || jl.includes('entry')
      else if (fl === 'mid')    matches = jl.includes('mid')
      else if (fl === 'senior') matches = jl.includes('senior')
      else if (fl === 'lead')   matches = jl.includes('lead') || jl.includes('senior')
      else if (fl === 'executive') matches = jl.includes('executive') || jl.includes('lead')
      if (!matches) return false
    }
    const nums   = job.salary_range.replace(/[^0-9-]/g, '').split('-').map(Number)
    const jobMin = nums[0] || 0
    const jobMax = nums[1] || jobMin
    if (filters.salary_min && jobMax < Number(filters.salary_min)) return false
    if (filters.salary_max && jobMin > Number(filters.salary_max)) return false
    return true
  }), [search, locationFilter, filters])

  // ── Filter backend jobs (client-side on already-fetched data) ────────
  const filteredBackendJobs = useMemo(() => backendJobs.filter((job) => {
    if (search) {
      const s = search.toLowerCase()
      const match =
        job.title.toLowerCase().includes(s) ||
        (job.description || '').toLowerCase().includes(s) ||
        (job.location || '').toLowerCase().includes(s) ||
        (job.company?.company_name || '').toLowerCase().includes(s)
      if (!match) return false
    }
    const loc = filters.location || locationFilter
    if (loc && !(job.location || '').toLowerCase().includes(loc.toLowerCase())) return false
    if (filters.employment_type) {
      const jobType = (job.employment_type || '').toLowerCase().replace(/[^a-z]/g, '')
      const fType   = filters.employment_type.toLowerCase().replace(/[^a-z]/g, '')
      if (jobType !== fType) return false
    }
    if (filters.experience_level) {
      const jl = (job.experience_level || '').toLowerCase()
      const fl = filters.experience_level.toLowerCase()
      let matches = false
      if (fl === 'entry')       matches = jl.includes('junior') || jl.includes('entry')
      else if (fl === 'mid')    matches = jl.includes('mid')
      else if (fl === 'senior') matches = jl.includes('senior')
      else if (fl === 'lead')   matches = jl.includes('lead') || jl.includes('senior')
      else if (fl === 'executive') matches = jl.includes('executive') || jl.includes('lead')
      if (!matches) return false
    }
    if (filters.salary_min && job.salary_max !== null && Number(job.salary_max) < Number(filters.salary_min)) return false
    if (filters.salary_max && job.salary_min !== null && Number(job.salary_min) > Number(filters.salary_max)) return false
    return true
  }), [backendJobs, search, locationFilter, filters])

  // ── Sort backend jobs ────────────────────────────────────────────────
  const sortedBackendJobs = useMemo(() => [...filteredBackendJobs].sort((a, b) => {
    const saMin = Number(a.salary_min) || 0
    const saMax = Number(a.salary_max) || saMin
    const sbMin = Number(b.salary_min) || 0
    const sbMax = Number(b.salary_max) || sbMin

    if (sortBy === 'salary_desc') {
      return sbMax - saMax
    }
    if (sortBy === 'salary_asc') {
      return saMin - sbMin
    }
    return 0
  }), [filteredBackendJobs, sortBy])

  // ── Sort showcase jobs ────────────────────────────────────────────────
  const sortedShowcaseJobs = useMemo(() => [...filteredShowcaseJobs].sort((a, b) => {
    if (sortBy === 'salary_desc') {
      const sa = a.salary_range.replace(/[^0-9-]/g, '').split('-').map(Number)
      const sb = b.salary_range.replace(/[^0-9-]/g, '').split('-').map(Number)
      return (sb[1] || sb[0] || 0) - (sa[1] || sa[0] || 0)
    }
    if (sortBy === 'salary_asc') {
      const sa = a.salary_range.replace(/[^0-9-]/g, '').split('-').map(Number)
      const sb = b.salary_range.replace(/[^0-9-]/g, '').split('-').map(Number)
      return (sa[0] || 0) - (sb[0] || 0)
    }
    return 0
  }), [filteredShowcaseJobs, sortBy])

  // ── Total counts ──────────────────────────────────────────────────────
  const totalBackend  = sortedBackendJobs.length
  const totalShowcase = sortedShowcaseJobs.length
  const totalItems    = totalBackend + totalShowcase

  // ── Pagination: backend jobs first, then showcase ─────────────────────
  const allDisplayItems = useMemo(() => [
    ...sortedBackendJobs.map((j) => ({ type: 'backend' as const, job: j })),
    ...sortedShowcaseJobs.map((j) => ({ type: 'showcase' as const, job: j })),
  ], [sortedBackendJobs, sortedShowcaseJobs])

  const displayedItems = allDisplayItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const hasActiveFilters =
    !!search || !!locationFilter ||
    Object.values(filters).some((v) => v !== undefined && v !== '')

  return (
    <div className="space-y-8">
      {/* Page Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-lg shadow-blue-900/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-3 max-w-2xl">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-full uppercase tracking-wider">
            <Briefcase className="h-3.5 w-3.5 mr-1" />
            Explore Openings
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Discover Your Next Dream Job
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {totalBackend > 0
              ? `${totalBackend} live recruiter posting${totalBackend !== 1 ? 's' : ''} + ${showcaseJobs.length}+ curated positions at top tech companies.`
              : `Browse ${showcaseJobs.length}+ curated positions at Google, Microsoft, Apple, Netflix and more top tech companies.`
            }
          </p>
          {totalBackend > 0 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/30">
              <Radio className="h-3 w-3 animate-pulse" />
              {totalBackend} Live Job{totalBackend !== 1 ? 's' : ''} from Recruiters
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-1">
        <SearchBar
          onSearch={handleSearchBarSearch}
          initialSearch={search}
          initialLocation={locationFilter}
        />
      </div>

      {/* Main content: Sidebar + Job list */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <FilterSidebar
            filters={{ ...filters, location: filters.location || locationFilter }}
            onFilterChange={handleFilterChange}
            onClear={handleClearFilters}
          />
        </div>

        {/* Mobile filter trigger */}
        <div className="lg:hidden flex justify-between items-center bg-white px-5 py-3 border border-slate-100 rounded-2xl shadow-sm mx-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {totalItems} positions found
          </span>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 font-bold text-xs px-4 py-2 rounded-xl border border-blue-100 hover:bg-blue-100 transition-all"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Job listing column */}
        <div className="lg:col-span-3 space-y-5">
          {/* Sort bar */}
          {totalItems > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Showing {displayedItems.length} of {totalItems} positions
              </span>
              <div className="flex items-center gap-3">
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <X className="h-3.5 w-3.5" /> Clear filters
                  </button>
                )}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="py-2 px-3 border border-slate-200 bg-white rounded-xl shadow-sm text-xs font-bold text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="newest">Sort: Newest</option>
                  <option value="salary_desc">Salary: High → Low</option>
                  <option value="salary_asc">Salary: Low → High</option>
                </select>
              </div>
            </div>
          )}

          {/* Live recruiter jobs section header */}
          {totalBackend > 0 && (
            <div className="flex items-center gap-2 px-1 pt-1">
              <div className="h-px flex-1 bg-emerald-100" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 flex items-center gap-1">
                <Radio className="h-2.5 w-2.5 animate-pulse" />
                Live Recruiter Postings
              </span>
              <div className="h-px flex-1 bg-emerald-100" />
            </div>
          )}

          {/* Job cards */}
          {displayedItems.length === 0 ? (
            <EmptyState
              title="No Matching Jobs"
              description="No jobs matched your current filters. Try broadening your search criteria or clearing all filters."
              actionLabel="Clear All Filters"
              onActionClick={handleClearFilters}
            />
          ) : (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                {displayedItems.map((item) => (
                  <motion.div key={item.type === 'backend' ? item.job.id : (item.job as any).id} variants={itemVariants}>
                    {item.type === 'backend' ? (
                      <JobCard job={item.job as any} />
                    ) : (
                      <ShowcaseJobCard job={item.job as any} />
                    )}
                  </motion.div>
                ))}
              </motion.div>

              {/* Showcase section divider (if there are backend jobs on this page) */}
              {totalBackend > 0 && displayedItems.some(i => i.type === 'showcase') && (
                <div className="flex items-center gap-2 px-1 pt-2">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                    ✦ Curated Enterprise Showcase
                  </span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>
              )}

              {totalItems > PAGE_SIZE && (
                <div className="pt-2">
                  <Pagination
                    currentPage={currentPage}
                    totalItems={totalItems}
                    pageSize={PAGE_SIZE}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden" aria-modal="true" role="dialog">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <span className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Filter className="h-4.5 w-4.5 text-blue-600" />
                  Filters
                </span>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <FilterSidebar
                  filters={{ ...filters, location: filters.location || locationFilter }}
                  onFilterChange={handleFilterChange}
                  onClear={handleClearFilters}
                />
              </div>
              <div className="border-t border-slate-100 px-6 py-4 bg-slate-50">
                <Button variant="primary" onClick={() => setMobileFiltersOpen(false)} className="w-full font-bold shadow-md">
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
