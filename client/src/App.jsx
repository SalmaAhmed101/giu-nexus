import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import RoleRoute from './components/RoleRoute'

// Member 1
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Member 2
import JobListPage from './pages/JobListPage'
import JobDetailPage from './pages/JobDetailPage'
import SavedJobsPage from './pages/SavedJobsPage'
import MyApplicationsPage from './pages/MyApplicationsPage'

// Member 4 (you)
import RecruiterDashboard from './pages/RecruiterDashboard'
import CreateJobPage from './pages/CreateJobPage'
import EditJobPage from './pages/EditJobPage'
import ApplicantsPage from './pages/ApplicantsPage'

// ⚠️ STUB placeholders for other members' pages
const HomePage = () => <div style={{padding:32}}><h1>Home Page — M3 will implement this</h1></div>

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          {/* Jobs routes */}
          <Route path="/jobs/saved" element={<SavedJobsPage />} />
          <Route path="/jobs/recommended" element={<div style={{ padding: 32 }}>Recommended — M3</div>} />
          <Route path="/jobs" element={<JobListPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />

          {/* Job seeker routes */}
          <Route path="/applications/my" element={
            <PrivateRoute>
              <MyApplicationsPage />
            </PrivateRoute>
          } />

          {/* Recruiter routes */}
          <Route path="/recruiter/dashboard" element={
            <RoleRoute allowedRoles={["recruiter"]}>
              <RecruiterDashboard />
            </RoleRoute>
          } />
          <Route path="/recruiter/jobs/create" element={
            <RoleRoute allowedRoles={["recruiter"]}>
              <CreateJobPage />
            </RoleRoute>
          } />
          <Route path="/recruiter/jobs/:id/edit" element={
            <RoleRoute allowedRoles={["recruiter"]}>
              <EditJobPage />
            </RoleRoute>
          } />
          <Route path="/recruiter/applicants/:jobId" element={
            <RoleRoute allowedRoles={["recruiter"]}>
              <ApplicantsPage />
            </RoleRoute>
          } />
          
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App