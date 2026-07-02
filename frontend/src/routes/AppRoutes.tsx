import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import Loader from '../components/ui/Loader'

// Layouts
import { PublicLayout, CandidateLayout, RecruiterLayout } from '../layout/Layouts'

// Pages
const LandingPage = lazy(() => import('../pages/public/LandingPage'))
const JobsPage = lazy(() => import('../pages/public/JobsPage'))
const JobDetailPage = lazy(() => import('../pages/public/JobDetailPage'))
const CompaniesPage = lazy(() => import('../pages/public/CompaniesPage'))
const CompanyDetailPage = lazy(() => import('../pages/public/CompanyDetailPage'))
const LoginPage = lazy(() => import('../pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'))
const CandidateDashboard = lazy(() => import('../pages/candidate/CandidateDashboard'))
const MyApplicationsPage = lazy(() => import('../pages/candidate/MyApplicationsPage'))
const JobApplyPage = lazy(() => import('../pages/candidate/JobApplyPage'))
const RecruiterDashboard = lazy(() => import('../pages/recruiter/RecruiterDashboard'))
const CompanyManagementPage = lazy(() => import('../pages/recruiter/CompanyManagementPage'))
const JobManagementPage = lazy(() => import('../pages/recruiter/JobManagementPage'))
const ApplicantsPage = lazy(() => import('../pages/recruiter/ApplicantsPage'))
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

export default function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader size="lg" label="Loading JobBoard..." />
        </div>
      }
    >
      <Routes>
        {/* Public Pages */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/companies/:id" element={<CompanyDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Helper fallback route for /404 explicitly */}
          <Route path="/404" element={<NotFoundPage />} />
          
          {/* Redirect /apply to /jobs */}
          <Route path="/apply" element={<Navigate to="/jobs" replace />} />
        </Route>

        {/* Candidate Dashboard - Protected */}
        <Route
          path="/candidate"
          element={
            <ProtectedRoute allowedRoles={['CANDIDATE']}>
              <CandidateLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CandidateDashboard />} />
          <Route path="applications" element={<MyApplicationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Candidate Application Submit - Protected with Header/Footer */}
        <Route
          path="/jobs/:id/apply"
          element={
            <ProtectedRoute allowedRoles={['CANDIDATE']}>
              <PublicLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<JobApplyPage />} />
        </Route>

        {/* Recruiter Dashboard - Protected */}
        <Route
          path="/recruiter"
          element={
            <ProtectedRoute allowedRoles={['RECRUITER']}>
              <RecruiterLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<RecruiterDashboard />} />
          <Route path="jobs" element={<JobManagementPage />} />
          <Route path="company" element={<CompanyManagementPage />} />
          <Route path="applicants" element={<ApplicantsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Catch-all Not Found */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  )
}
