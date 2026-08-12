import { useState } from 'react'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Box,
  Container,
  Typography,
  Button,
  Stack,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  useMediaQuery,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import LogoutIcon from '@mui/icons-material/Logout'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import BrandMark from './BrandMark'
import { signOut } from '../auth'

// Top navigation links (route paths).
const NAV = [
  { label: 'Home', to: '/home' },
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Contact Us', to: '/contact' },
]

// Editable pages not in the main nav — reached via the "Pages" dropdown.
const MORE_PAGES = [
  { label: 'Sitemap', to: '/sitemap' },
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms of Service', to: '/terms-of-service' },
  { label: 'Cookie Policy', to: '/cookie-policy' },
]

// Sticky header with desktop and mobile navigation.
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [pagesAnchor, setPagesAnchor] = useState(null)
  const isMobile = useMediaQuery((t) => t.breakpoints.down('md'))
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const morePageActive = MORE_PAGES.some((p) => p.to === pathname)

  const handleLogout = async () => {
    await signOut()
    setOpen(false)
    navigate('/login', { replace: true })
  }

  return (
    <>
      <AppBar
        elevation={0}
        position="fixed"
        sx={{
          bgcolor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(100px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          zIndex: (t) => t.zIndex.drawer + 1,
        }}
      >
        <Container>
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: 68, md: 82 },
              gap: 2,
              display: { xs: 'flex', md: 'grid' },
              gridTemplateColumns: { md: '1fr auto 1fr' },
            }}
          >
            <Box sx={{ justifySelf: 'start', display: 'flex' }}>
              <BrandMark nav />
            </Box>
            {!isMobile && (
              <Stack direction="row" spacing={4} sx={{ justifySelf: 'center' }}>
                {NAV.map((n) => {
                  const active = n.to === pathname
                  return (
                    <Typography
                      key={n.label}
                      component={RouterLink}
                      to={n.to}
                      sx={{
                        color: 'text.primary',
                        textDecoration: 'none',
                        fontSize: 14,
                        fontWeight: active ? 700 : 500,
                        position: 'relative',
                        '&::after': {
                          content: '""', position: 'absolute', left: 0, bottom: -4, height: 2,
                          width: active ? '100%' : 0,
                          bgcolor: 'primary.main', transition: 'width .25s ease',
                        },
                        '&:hover::after': { width: '100%' },
                      }}
                    >
                      {n.label}
                    </Typography>
                  )
                })}

                {/* Editable pages that don't warrant a top-level slot. */}
                <Box
                  component="button"
                  type="button"
                  onClick={(event) => setPagesAnchor(event.currentTarget)}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: .25,
                    background: 'none', border: 0, p: 0, cursor: 'pointer', fontFamily: 'inherit',
                    color: 'text.primary', fontSize: 14, fontWeight: morePageActive ? 700 : 500,
                    position: 'relative',
                    '&::after': {
                      content: '""', position: 'absolute', left: 0, bottom: -4, height: 2,
                      width: morePageActive ? '100%' : 0,
                      bgcolor: 'primary.main', transition: 'width .25s ease',
                    },
                    '&:hover::after': { width: '100%' },
                  }}
                >
                  Legal
                  <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />
                </Box>
                <Menu
                  anchorEl={pagesAnchor}
                  open={Boolean(pagesAnchor)}
                  onClose={() => setPagesAnchor(null)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                  {MORE_PAGES.map((p) => (
                    <MenuItem
                      key={p.to}
                      component={RouterLink}
                      to={p.to}
                      selected={p.to === pathname}
                      onClick={() => setPagesAnchor(null)}
                    >
                      {p.label}
                    </MenuItem>
                  ))}
                </Menu>
              </Stack>
            )}
            <Box sx={{ ml: isMobile ? 'auto' : 0, justifySelf: 'end', display: 'flex', alignItems: 'center', gap: 1 }}>
              {!isMobile && (
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Typography sx={{ color: '#686868', fontStyle: 'italic', fontSize: 12 }}>Logged in as Admin</Typography>
                <Button
                  
                  color="primary"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
                </Stack>
              )}
              {isMobile && (
                <IconButton onClick={() => setOpen(true)} sx={{ color: 'text.primary' }}>
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}
        PaperProps={{ sx: { width: 280 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <BrandMark nav />
          <IconButton onClick={() => setOpen(false)}><CloseIcon /></IconButton>
        </Box>
        <List>
          {NAV.map((n) => (
            <ListItemButton key={n.label} component={RouterLink} to={n.to} onClick={() => setOpen(false)}
              selected={n.to === pathname}>
              <ListItemText primary={n.label} />
            </ListItemButton>
          ))}
          <Typography sx={{ px: 2, pt: 2, pb: .5, fontSize: 11.5, fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', color: 'text.secondary' }}>
            Pages
          </Typography>
          {MORE_PAGES.map((p) => (
            <ListItemButton key={p.to} component={RouterLink} to={p.to} onClick={() => setOpen(false)}
              selected={p.to === pathname}>
              <ListItemText primary={p.label} />
            </ListItemButton>
          ))}
          <ListItemButton onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 2, color: 'primary.main' }} />
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Drawer>

    </>
  )
}
