import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './hooks/useTheme'

// Layouts
import PublicLayout from './layouts/PublicLayout'
import AuthLayout from './layouts/AuthLayout'
import CandidateLayout from './layouts/CandidateLayout'
import RecruiterLayout from './layouts/RecruiterLayout'
import AdminLayout from './layouts/AdminLayout'

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<div className="p-8">Landing Page Content</div>} />
            <Route path="about" element={<div className="p-8">About Us</div>} />
            <Route path="jobs" element={<div className="p-8">Job Board</div>} />
            <Route path="companies" element={<div className="p-8">Companies Directory</div>} />
            <Route path="contact" element={<div className="p-8">Contact Support</div>} />
            <Route path="pricing" element={<div className="p-8">Pricing Plans</div>} />
          </Route>

          {/* Auth Routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route index element={<Navigate to="/auth/login" replace />} />
            <Route path="login" element={<div className="p-4">Login Form</div>} />
            <Route path="register" element={<div className="p-4">Registration Form</div>} />
            <Route path="forgot-password" element={<div className="p-4">Forgot Password Form</div>} />
            <Route path="reset-password" element={<div className="p-4">Reset Password Form</div>} />
          </Route>

          {/* Candidate Dashboard Routes */}
          <Route path="/candidate" element={<CandidateLayout />}>
            <Route index element={<Navigate to="/candidate/dashboard" replace />} />
            <Route path="dashboard" element={<div className="p-6">Candidate Dashboard Overview</div>} />
            <Route path="jobs" element={<div className="p-6">Browse Jobs</div>} />
            <Route path="saved" element={<div className="p-6">Saved Jobs</div>} />
            <Route path="applications" element={<div className="p-6">Job Applications</div>} />
            <Route path="recommendations" element={<div className="p-6">AI Recommendations</div>} />
            <Route path="resume" element={<div className="p-6">Resume Parsing Panel</div>} />
            <Route path="profile" element={<div className="p-6">Candidate Profile Edit</div>} />
            <Route path="notifications" element={<div className="p-6">Candidate Notifications</div>} />
            <Route path="settings" element={<div className="p-6">Candidate Account Settings</div>} />
          </Route>

          {/* Recruiter Dashboard Routes */}
          <Route path="/recruiter" element={<RecruiterLayout />}>
            <Route index element={<Navigate to="/recruiter/dashboard" replace />} />
            <Route path="dashboard" element={<div className="p-6">Recruiter Dashboard Overview</div>} />
            <Route path="company" element={<div className="p-6">Company Profile Edit</div>} />
            <Route path="jobs" element={<div className="p-6">Manage Jobs</div>} />
            <Route path="applicants" element={<div className="p-6">Applicant Pipelines</div>} />
            <Route path="analytics" element={<div className="p-6">Recruiting Analytics</div>} />
            <Route path="notifications" element={<div className="p-6">Recruiter Notifications</div>} />
            <Route path="settings" element={<div className="p-6">Recruiter Account Settings</div>} />
          </Route>

          {/* Admin Dashboard Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<div className="p-6">System Admin Dashboard</div>} />
            <Route path="users" element={<div className="p-6">Manage Platform Users</div>} />
            <Route path="recruiters" element={<div className="p-6">Manage Platform Recruiters</div>} />
            <Route path="companies" element={<div className="p-6">Manage Platform Companies</div>} />
            <Route path="jobs" element={<div className="p-6">Manage Platform Jobs</div>} />
            <Route path="reports" element={<div className="p-6">System Reports</div>} />
            <Route path="analytics" element={<div className="p-6">System-wide Analytics</div>} />
            <Route path="settings" element={<div className="p-6">System Configurations</div>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<div className="p-12 text-center text-xl font-bold">404 - Page Not Found</div>} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}
