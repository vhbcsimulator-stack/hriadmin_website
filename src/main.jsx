import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient.js'
import theme from './styles/theme.js'
import './index.css'
import App from './App.jsx'

// A data router, rather than <BrowserRouter>, because useBlocker only works
// inside one — that is what lets the editor stop a navigation and ask about
// unsaved changes. App keeps its own <Routes> as a descendant route: the routes
// themselves need no loaders or actions, only the navigation blocking.
const router = createBrowserRouter([{ path: '*', element: <App /> }])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
