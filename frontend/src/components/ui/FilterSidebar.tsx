import { FC } from 'react'
import { Briefcase, MapPin, DollarSign, Filter, X } from 'lucide-react'

export interface FilterState {
  employment_type?: string
  experience_level?: string
  location?: string
  salary_min?: string
  salary_max?: string
}

interface FilterSidebarProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  onClear: () => void
}

const employmentTypes = [
  { value: 'FULL_TIME', label: 'Full-time' },
  { value: 'PART_TIME', label: 'Part-time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'OTHER', label: 'Other' },
]

const experienceLevels = [
  { value: 'ENTRY', label: 'Entry Level' },
  { value: 'MID', label: 'Mid Level' },
  { value: 'SENIOR', label: 'Senior Level' },
  { value: 'LEAD', label: 'Lead' },
  { value: 'EXECUTIVE', label: 'Executive' },
]

export const FilterSidebar: FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onClear,
}) => {
  const handleChange = (key: keyof FilterState, value: string | undefined) => {
    onFilterChange({
      ...filters,
      [key]: value === '' ? undefined : value,
    })
  }

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined && v !== '')

  return (
    <div className="bg-white dark:bg-darkCard border border-slate-100 dark:border-darkBorder rounded-2xl p-6 space-y-6 shadow-sm sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-darkBorder pb-4">
        <div className="flex items-center space-x-2 text-slate-800 dark:text-white font-extrabold">
          <Filter className="h-4.5 w-4.5 text-blue-600" />
          <span>Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="text-xs font-bold text-red-500 hover:text-red-750 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Employment Type */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Briefcase className="h-3.5 w-3.5" />
          <span>Employment Type</span>
        </h4>
        <div className="space-y-2">
          {employmentTypes.map((type) => (
            <label key={type.value} className="flex items-center space-x-2.5 cursor-pointer select-none">
              <input
                type="radio"
                name="employment_type"
                checked={filters.employment_type === type.value}
                onChange={() => handleChange('employment_type', type.value)}
                className="h-4.5 w-4.5 rounded-full border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className={`text-sm ${filters.employment_type === type.value ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}>
                {type.label}
              </span>
            </label>
          ))}
          {filters.employment_type && (
            <button
              onClick={() => handleChange('employment_type', undefined)}
              className="text-[10px] text-slate-400 hover:text-slate-600 flex items-center gap-1 mt-1 font-bold"
            >
              <X className="h-3 w-3" /> Clear selection
            </button>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100" />

      {/* Experience Level */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5" />
          <span>Experience Level</span>
        </h4>
        <div className="space-y-2">
          {experienceLevels.map((lvl) => (
            <label key={lvl.value} className="flex items-center space-x-2.5 cursor-pointer select-none">
              <input
                type="radio"
                name="experience_level"
                checked={filters.experience_level === lvl.value}
                onChange={() => handleChange('experience_level', lvl.value)}
                className="h-4.5 w-4.5 rounded-full border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className={`text-sm ${filters.experience_level === lvl.value ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}>
                {lvl.label}
              </span>
            </label>
          ))}
          {filters.experience_level && (
            <button
              onClick={() => handleChange('experience_level', undefined)}
              className="text-[10px] text-slate-400 hover:text-slate-600 flex items-center gap-1 mt-1 font-bold"
            >
              <X className="h-3 w-3" /> Clear selection
            </button>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100 dark:bg-darkBorder" />

      {/* Location Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          <span>Location</span>
        </h4>
        <div className="relative">
          <input
            type="text"
            value={filters.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="e.g. Remote, San Francisco"
            className="w-full pl-3 pr-8 py-2 text-sm bg-slate-50 dark:bg-darkBg border border-slate-200 dark:border-darkBorder rounded-xl focus:bg-white dark:focus:bg-darkCard focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white"
          />
          {filters.location && (
            <button
              onClick={() => handleChange('location', undefined)}
              className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100 dark:bg-darkBorder" />

      {/* Salary Filters */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <DollarSign className="h-3.5 w-3.5" />
          <span>Salary (USD / year)</span>
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={filters.salary_min || ''}
            onChange={(e) => handleChange('salary_min', e.target.value)}
            placeholder="Min"
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-darkBg border border-slate-200 dark:border-darkBorder rounded-xl focus:bg-white dark:focus:bg-darkCard focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white"
          />
          <input
            type="number"
            value={filters.salary_max || ''}
            onChange={(e) => handleChange('salary_max', e.target.value)}
            placeholder="Max"
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-darkBg border border-slate-200 dark:border-darkBorder rounded-xl focus:bg-white dark:focus:bg-darkCard focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white"
          />
        </div>
      </div>
    </div>
  )
}
