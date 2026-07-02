import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, Briefcase, ChevronDown, User, LayoutDashboard, LogOut, Search, Building2, Bell, Settings, X, Sun, Moon } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { Avatar } from '../components/ui/Avatar'
import { useJobs } from '../api/jobs'
import { useCompanies } from '../api/companies'
import { useNotifications } from '../context/NotificationContext'
import { useTheme } from '../hooks/useTheme'

interface TopNavigationProps {
  onMenuClick?: () => void
  showMenuButton?: boolean
}

export default function TopNavigation({ onMenuClick, showMenuButton = false }: TopNavigationProps) {
  const { user, isAuthenticated, logout } = useAuth()
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  
  // Dropdown states
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // Search state variables
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 150)
    return () => clearTimeout(handler)
  }, [searchQuery])

  // Fetch search lists only when search query is typed (performance optimization)
  const { data: jobsResponse } = useJobs(
    { search: debouncedQuery },
    { enabled: debouncedQuery.trim().length > 0 }
  )
  
  const { data: companiesResponse } = useCompanies(
    undefined,
    { enabled: debouncedQuery.trim().length > 0 }
  )

  const filteredCompanies = debouncedQuery
    ? (companiesResponse?.data || []).filter(c =>
        c.company_name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        c.industry.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        (c.location && c.location.toLowerCase().includes(debouncedQuery.toLowerCase()))
      ).slice(0, 5)
    : []

  const filteredJobs = debouncedQuery ? (jobsResponse?.data || []).slice(0, 5) : []

  const searchResults = [
    ...filteredJobs.map(j => ({ id: j.id, type: 'job' as const, title: j.title, subtitle: j.location, url: `/jobs/${j.id}` })),
    ...filteredCompanies.map(c => ({ id: c.id, type: 'company' as const, title: c.company_name, subtitle: c.industry, url: `/companies/${c.id}` }))
  ]

  useEffect(() => {
    setActiveIndex(-1)
  }, [searchResults.length])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      if (searchResults.length === 0) return
      e.preventDefault()
      setActiveIndex(prev => (prev + 1) % searchResults.length)
    } else if (e.key === 'ArrowUp') {
      if (searchResults.length === 0) return
      e.preventDefault()
      setActiveIndex(prev => (prev - 1 + searchResults.length) % searchResults.length)
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && activeIndex < searchResults.length) {
        e.preventDefault()
        const selected = searchResults[activeIndex]
        setSearchQuery('')
        setIsSearchFocused(false)
        setMobileSearchOpen(false)
        navigate(selected.url)
      } else if (searchQuery.trim().length > 0) {
        e.preventDefault()
        const query = searchQuery
        setSearchQuery('')
        setIsSearchFocused(false)
        setMobileSearchOpen(false)
        navigate(`/jobs?search=${encodeURIComponent(query)}`)
      }
    } else if (e.key === 'Escape') {
      setIsSearchFocused(false)
    }
  }

  const userFullName = user ? `${user.first_name} ${user.last_name || ''}` : ''
  const dashboardLink = user?.role === 'RECRUITER' ? '/recruiter' : '/candidate'

  const renderSearchResultsDropdown = () => {
    if (!isSearchFocused || searchQuery.trim().length === 0) return null

    return (
      <div className="absolute left-0 mt-2 w-full bg-white dark:bg-darkCard border border-slate-200 dark:border-darkBorder rounded-2xl shadow-xl py-2 z-55 max-h-[350px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
        {searchResults.length === 0 ? (
          <div className="px-4 py-3 text-center text-xs font-semibold text-slate-400 dark:text-slate-500">
            No matching results found
          </div>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-darkBorder">
            {/* Jobs Section */}
            {filteredJobs.length > 0 && (
              <div className="px-1.5 py-1">
                <span className="block px-3 py-1 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Jobs
                </span>
                {filteredJobs.map((j) => {
                  const absoluteIndex = searchResults.findIndex(r => r.id === j.id && r.type === 'job')
                  const isActive = absoluteIndex === activeIndex
                  return (
                    <Link
                      key={j.id}
                      to={`/jobs/${j.id}`}
                      onClick={() => {
                        setSearchQuery('')
                        setIsSearchFocused(false)
                        setMobileSearchOpen(false)
                      }}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-left transition-colors ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400'
                          : 'hover:bg-slate-50 dark:hover:bg-darkBg/50 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Briefcase className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="block text-xs font-bold truncate leading-tight text-slate-800 dark:text-white">
                          {j.title}
                        </span>
                        <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-semibold truncate mt-0.5">
                          {j.location} • {j.employment_type.replace('_', ' ')}
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}

            {/* Companies Section */}
            {filteredCompanies.length > 0 && (
              <div className="px-1.5 py-1">
                <span className="block px-3 py-1 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Companies
                </span>
                {filteredCompanies.map((c) => {
                  const absoluteIndex = searchResults.findIndex(r => r.id === c.id && r.type === 'company')
                  const isActive = absoluteIndex === activeIndex
                  return (
                    <Link
                      key={c.id}
                      to={`/companies/${c.id}`}
                      onClick={() => {
                        setSearchQuery('')
                        setIsSearchFocused(false)
                        setMobileSearchOpen(false)
                      }}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-left transition-colors ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400'
                          : 'hover:bg-slate-50 dark:hover:bg-darkBg/50 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Building2 className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="block text-xs font-bold truncate leading-tight text-slate-800 dark:text-white">
                          {c.company_name}
                        </span>
                        <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-semibold truncate mt-0.5">
                          {c.industry} • {c.location}
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}

            {/* Footer hints */}
            <div className="px-4 py-1.5 bg-slate-50/50 dark:bg-darkBg/50 rounded-b-2xl border-t border-slate-100 dark:border-darkBorder flex justify-between text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
              <span>↑↓ Navigate</span>
              <span>Enter Select</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-darkCard border-b border-slate-100 dark:border-darkBorder sticky top-0 z-30 shadow-sm relative transition-colors duration-200">
      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="absolute inset-0 bg-white dark:bg-darkCard z-40 flex items-center px-4 space-x-3">
          <div className="flex-1 relative" ref={searchRef}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setIsSearchFocused(true)
              }}
              onFocus={() => setIsSearchFocused(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search jobs or companies..."
              className="w-full h-10 pl-10 pr-10 bg-slate-50 dark:bg-darkBg border border-slate-200 dark:border-darkBorder rounded-full text-sm font-semibold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-darkCard focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
              autoFocus
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {renderSearchResultsDropdown()}
          </div>
          <button
            onClick={() => {
              setMobileSearchOpen(false)
              setSearchQuery('')
            }}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Left side: Hamburger or Logo */}
      <div className="flex items-center space-x-4">
        {showMenuButton && onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg lg:hidden hover:bg-slate-50 dark:hover:bg-darkBorder text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-1.5 rounded-lg text-white shadow-md shadow-blue-500/10">
            <Briefcase className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-lg text-slate-800 dark:text-white tracking-tight">
            Job<span className="text-blue-600 dark:text-blue-400">Board</span>
          </span>
        </Link>
      </div>

      {/* Navigation directory links */}
      <div className="hidden sm:flex items-center space-x-6 ml-8">
        <Link
          to="/jobs"
          className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-650 dark:hover:text-blue-400 transition-colors"
        >
          Jobs
        </Link>
        <Link
          to="/companies"
          className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-650 dark:hover:text-blue-400 transition-colors"
        >
          Companies
        </Link>
      </div>

      {/* Desktop Global Search Bar */}
      <div ref={searchRef} className="hidden md:block flex-1 max-w-sm lg:max-w-md mx-6 relative">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setIsSearchFocused(true)
            }}
            onFocus={() => setIsSearchFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search jobs or companies..."
            className="w-full h-10 pl-10 pr-4 bg-slate-50 dark:bg-darkBg border border-slate-200/80 dark:border-darkBorder rounded-full text-sm font-semibold text-slate-800 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-darkCard focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200"
          />
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        </div>
        {renderSearchResultsDropdown()}
      </div>

      {/* Right side: Actions / Notifications / Profile */}
      <div className="flex items-center space-x-3.5 ml-auto">
        {/* Mobile Search Button Trigger */}
        <button
          onClick={() => setMobileSearchOpen(true)}
          className="md:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-darkBorder transition-colors"
        >
          <Search className="h-5 w-5" />
        </button>

        {!isAuthenticated ? (
          <div className="flex items-center space-x-2">
            <Link
              to="/jobs"
              className="sm:hidden text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-650 dark:hover:text-blue-400 transition-colors mr-2"
            >
              Jobs
            </Link>

            {/* Guest Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-darkBorder transition-colors flex items-center justify-center mr-1"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/login')}
              className="font-bold border-slate-200 dark:border-darkBorder text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-darkBorder text-xs"
            >
              Sign In
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/register')}
              className="font-bold text-xs"
            >
              Get Started
            </Button>
          </div>
        ) : (
          <>
            {/* Notification Bell Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-darkBorder transition-colors flex items-center justify-center"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-extrabold text-white scale-90 border border-white dark:border-darkCard">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-darkCard border border-slate-100 dark:border-darkBorder rounded-2xl shadow-xl py-2 z-55 animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="px-4 py-2 border-b border-slate-50 dark:border-darkBorder flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-800 dark:text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAllAsRead()}
                        className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-50 dark:divide-darkBorder">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-xs font-semibold text-slate-400 dark:text-slate-500">
                        No new notifications
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markAsRead(n.id)}
                          className={`px-4 py-3 cursor-pointer transition-colors text-left ${
                            n.read
                              ? 'bg-white dark:bg-darkCard hover:bg-slate-50/50 dark:hover:bg-darkBg/50'
                              : 'bg-blue-50/15 dark:bg-blue-950/10 hover:bg-blue-50/25 dark:hover:bg-blue-950/20'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-xs mt-0.5">
                              {n.type === 'success' ? '✅' : n.type === 'error' ? '❌' : '🔔'}
                            </span>
                            <div className="flex-1 min-w-0">
                              <span className={`block text-xs truncate ${n.read ? 'font-semibold text-slate-700 dark:text-slate-350' : 'font-extrabold text-slate-900 dark:text-white'}`}>
                                {n.title}
                              </span>
                              <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                {n.description}
                              </span>
                              <span className="block text-[8px] text-slate-400 dark:text-slate-500 font-bold mt-1">
                                {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="px-4 pt-2 border-t border-slate-50 dark:border-darkBorder flex justify-between">
                      <button
                        onClick={() => clearAll()}
                        className="text-[10px] font-bold text-red-500 dark:text-red-400 hover:text-red-655 dark:hover:text-red-300"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Theme Toggle Button (Authenticated) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-darkBorder transition-colors flex items-center justify-center"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-darkBorder transition-colors text-left"
              >
                <Avatar
                  src={null}
                  name={userFullName}
                  size="sm"
                  className="shadow-sm border border-slate-100 dark:border-darkBorder"
                />
                
                <div className="hidden md:flex flex-col items-start pr-1 max-w-[120px]">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate w-full leading-tight">
                    {user?.first_name}
                  </span>
                  <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                    {user?.role.toLowerCase()}
                  </span>
                </div>
                
                <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-darkCard border border-slate-100 dark:border-darkBorder rounded-2xl shadow-xl py-2 z-55 animate-in fade-in slide-in-from-top-3 duration-200">
                  {/* User details header (Name & Role) */}
                  <div className="px-4 py-2.5 border-b border-slate-100 dark:border-darkBorder mb-1.5">
                    <span className="block text-sm font-extrabold text-slate-900 dark:text-white truncate">
                      {userFullName}
                    </span>
                    <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate mt-0.5">
                      {user?.role} Role
                    </span>
                  </div>

                  {/* Navigation items */}
                  <Link
                    to={dashboardLink}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center space-x-2.5 px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-darkBg/50 hover:text-blue-650 dark:hover:text-blue-400 transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4 text-slate-400" />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    to={`${dashboardLink}/profile?tab=profile`}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center space-x-2.5 px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-darkBg/50 hover:text-blue-650 dark:hover:text-blue-400 transition-colors"
                  >
                    <User className="h-4 w-4 text-slate-400" />
                    <span>Profile</span>
                  </Link>

                  <Link
                    to={`${dashboardLink}/profile?tab=settings`}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center space-x-2.5 px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-darkBg/50 hover:text-blue-650 dark:hover:text-blue-400 transition-colors"
                  >
                    <Settings className="h-4 w-4 text-slate-400" />
                    <span>Settings</span>
                  </Link>

                  {/* Divider */}
                  <div className="h-px bg-slate-100 dark:bg-darkBorder my-1.5" />

                  {/* Logout action */}
                  <button
                    onClick={async () => {
                      setDropdownOpen(false)
                      await logout()
                    }}
                    className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-sm font-bold text-red-500 dark:text-red-400 hover:bg-red-55 dark:hover:bg-red-950/20 hover:text-red-655 dark:hover:text-red-300 transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  )
}
