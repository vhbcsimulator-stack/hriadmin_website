import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Box } from '@mui/material'
import Navbar from './Navbar'
import Footer from './Footer'

// App shell: fixed navbar, routed page content, footer.
// Resets scroll position on every navigation.
export default function Layout() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      <Navbar />
      <Box
        key={pathname}
        component="main"
        sx={{
          animation: 'pageEnter .35s ease both',
          '@keyframes pageEnter': {
            from: { opacity: 0, transform: 'translateY(14px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
          '@media (prefers-reduced-motion: reduce)': {
            animation: 'none',
          },
        }}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  )
}
