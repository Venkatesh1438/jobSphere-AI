import React, { useState } from 'react'
import { Search, MapPin, X } from 'lucide-react'
import { Button } from './Button'

interface SearchBarProps {
  onSearch: (filters: { search: string; location: string }) => void
  initialSearch?: string
  initialLocation?: string
  placeholder?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  initialSearch = '',
  initialLocation = '',
  placeholder = 'Job title, keywords, or skills...',
}) => {
  const [search, setSearch] = useState(initialSearch)
  const [location, setLocation] = useState(initialLocation)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch({ search, location })
  }

  const handleClear = () => {
    setSearch('')
    setLocation('')
    onSearch({ search: '', location: '' })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white dark:bg-darkCard border border-slate-100 dark:border-darkBorder rounded-2xl sm:rounded-full p-2 shadow-lg dark:shadow-none shadow-slate-100/80 flex flex-col sm:flex-row items-center gap-2 max-w-4xl mx-auto"
    >
      {/* Keywords Input */}
      <div className="flex items-center flex-1 w-full px-3 gap-2">
        <Search className="h-5 w-5 text-blue-600 flex-shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full py-2 bg-transparent text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-darkBorder rounded-full"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Divider line for desktop */}
      <div className="hidden sm:block h-8 w-px bg-slate-100 dark:bg-darkBorder" />

      {/* Location Input */}
      <div className="flex items-center flex-1 w-full px-3 gap-2">
        <MapPin className="h-5 w-5 text-slate-450 flex-shrink-0" />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location (e.g. Remote, New York)"
          className="w-full py-2 bg-transparent text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none"
        />
        {location && (
          <button
            type="button"
            onClick={() => setLocation('')}
            className="p-1 text-slate-400 hover:text-slate-655 hover:bg-slate-50 rounded-full"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Submit Button */}
      <div className="w-full sm:w-auto flex justify-end gap-2 flex-shrink-0">
        {(search || location) && (
          <Button
            type="button"
            variant="ghost"
            onClick={handleClear}
            size="sm"
            className="text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            Clear
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          className="w-full sm:w-auto sm:px-6 rounded-xl sm:rounded-full font-bold shadow-md shadow-blue-500/10"
        >
          Search
        </Button>
      </div>
    </form>
  )
}
