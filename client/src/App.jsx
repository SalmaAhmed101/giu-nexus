import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
//Member 1
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

// Member 2 pages
import JobListPage from './pages/JobListPage'
import JobDetailPage from './pages/JobDetailPage'
import SavedJobsPage from './pages/SavedJobsPage'
import MyApplicationsPage from './pages/MyApplicationsPage'

// ⚠️ STUB placeholders for other members' pages
// Replace each one with the real import when teammates submit
const HomePage = () => <div style={{padding:32}}><h1>Home Page — M3 will implement this</h1></div>

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />. 
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          {/* ⚠️ IMPORTANT: /jobs/saved and /jobs/recommended MUST come
              BEFORE /jobs/:id — otherwise React Router matches
              "saved" and "recommended" as job IDs */}
          <Route path="/jobs/saved" element={<SavedJobsPage />} />
          <Route path="/jobs/recommended" element={<div style={{padding:32}}>Recommended — M3</div>} />
          <Route path="/jobs" element={<JobListPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />

          {/* Job seeker protected routes */}
          <Route path="/applications/my" element={<MyApplicationsPage />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App