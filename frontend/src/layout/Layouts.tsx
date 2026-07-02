import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import TopNavigation from './TopNavigation'
import Sidebar from './Sidebar'
import Footer from './Footer'
import ContentWrapper from './ContentWrapper'
import ResponsiveDrawer from './ResponsiveDrawer'

// Public-Facing Layout
export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-darkBg text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navbar */}
      <TopNavigation />

      {/* Main Content */}
      <main className="flex-grow">
        <ContentWrapper layout="public">
          <Outlet />
        </ContentWrapper>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

// Protected Dashboard Layout Base (used by Candidate and Recruiter)
interface DashboardLayoutProps {
  role: 'CANDIDATE' | 'RECRUITER'
}

function DashboardLayout({ role: _role }: DashboardLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-darkBg text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Sidebar for Desktop (large screens) */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Responsive mobile drawer containing the Sidebar */}
      <ResponsiveDrawer
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      >
        <Sidebar onClose={() => setMobileSidebarOpen(false)} />
      </ResponsiveDrawer>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with hamburger menu trigger */}
        <TopNavigation
          showMenuButton={true}
          onMenuClick={() => setMobileSidebarOpen(true)}
        />

        {/* Scrollable Viewport and content */}
        <main className="flex-1 overflow-y-auto">
          <ContentWrapper layout="dashboard">
            <Outlet />
          </ContentWrapper>
        </main>
      </div>
    </div>
  )
}

export function CandidateLayout() {
  return <DashboardLayout role="CANDIDATE" />
}

export function RecruiterLayout() {
  return <DashboardLayout role="RECRUITER" />
}
