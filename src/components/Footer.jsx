import { useState, useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Container, Typography, Stack, IconButton } from '@mui/material'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Footer link columns. `to` routes to a page; links without it are placeholders.
const FOOTER_COLS = [
  {
    heading: 'Navigation',
    links: [
      { label: 'Home', to: '/' },
      { label: 'About Us', to: '/about' },
      { label: 'Projects', to: '/projects' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Contact Us', to: '/contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms of Service', to: '/terms-of-service' },
      { label: 'Cookie Policy', to: '/cookie-policy' },
      { label: 'Sitemap', to: '/sitemap' },
    ],
  },
]

// Footer with quick links and back-to-top control.
export default function Footer() {
  const [showTop, setShowTop] = useState(false)
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <Box component="footer" sx={{ position: 'relative', bgcolor: 'brand.greenDeep', color: 'rgba(255,255,255,.72)' }}>
      <Container sx={{ pt: 7, pb: 5 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1.4fr repeat(3, 1fr)' }, gap: 4 }}>
         <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <LocationOnIcon fontSize="large" />
            <Typography sx={{ mt: 2, fontSize: 13.5, lineHeight: 1.6, textAlign: "center" }}>
              Royale Tagaytay Estates,<br />
              Brgy. Upli, Alfonso, Cavite
            </Typography>
          </Box>
          {FOOTER_COLS.map((col) => (
            <Box key={col.heading}>
              <Typography sx={{ color: '#fff', fontSize: 13, textTransform: 'uppercase', letterSpacing: '1.5px', mb: 2 }}>
                {col.heading}
              </Typography>
              <Stack spacing={0.75}>
                {col.links.map((l) => (
                  <Typography
                    key={l.label}
                    {...(l.to ? { component: RouterLink, to: l.to } : { component: 'a', href: '#' })}
                    sx={{ color: 'inherit', textDecoration: 'none', fontSize: 14,
                      transition: 'color .2s ease, padding-left .2s ease',
                      '&:hover': { color: '#a8ffa8', pl: .5 } }}>
                    {l.label}
                  </Typography>
                ))}
              </Stack>
            </Box>
          ))}
        </Box>
      </Container>
      <Box sx={{ borderTop: '1px solid rgba(255,255,255,.1)', py: 2.5, textAlign: 'center' }}>
        <Typography sx={{ fontSize: 13 }}>© {new Date().getFullYear()} Hermosa Residences Inc. All rights reserved.</Typography>
      </Box>
      {showTop && (
        <IconButton onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"
          sx={{
            position: 'fixed', right: 24, bottom: 24, zIndex: 40, bgcolor: '#006600', color: '#fff',
            '&:hover': { bgcolor: '#004100', transform: 'translateY(-4px)' },
            transition: 'transform .2s ease',
          }}>
          <KeyboardArrowUpIcon />
        </IconButton>
      )}
    </Box>
  )
}
