import { Navigate, Outlet, Routes, Route } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailsPage from './pages/ProjectDetailsPage'
import ContactPage from './pages/ContactPage'
import LegalPage from './pages/LegalPage'
import SitemapPage from './pages/SitemapPage'
import useAuthStatus from './hooks/useAuthStatus'

// Reading a Supabase session is async, so `null` means "still checking" —
// showing a spinner beats bouncing a signed-in admin to /login on first paint.
function AuthPending() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <CircularProgress />
    </Box>
  )
}

function ProtectedRoute() {
  const signedIn = useAuthStatus()
  if (signedIn === null) return <AuthPending />
  return signedIn ? <Outlet /> : <Navigate to="/login" replace />
}

function UnknownRoute() {
  const signedIn = useAuthStatus()
  if (signedIn === null) return <AuthPending />
  return <Navigate to={signedIn ? '/home' : '/login'} replace />
}

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
      <Route element={<Layout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        {/* Static details page for now — no :id yet (frontend first). */}
        <Route path="/project-details" element={<ProjectDetailsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy-policy" element={<LegalPage type="privacy" />} />
        <Route path="/terms-of-service" element={<LegalPage type="terms" />} />
        <Route path="/cookie-policy" element={<LegalPage type="cookies" />} />
        <Route path="/sitemap" element={<SitemapPage />} />
      </Route>
      </Route>
      <Route path="*" element={<UnknownRoute />} />
    </Routes>
    </>
  )
}

export default App
  
