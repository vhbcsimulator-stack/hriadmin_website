import { Box, Container, Typography, Breadcrumbs, Link as MuiLink } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

// Compact page header used on interior pages. Sits under the fixed navbar
// with a dark green gradient (optionally over a background image) so the
// overlaid navbar text stays readable.
export default function PageBanner({ eyebrow, title, subtitle, image, crumbs = [] }) {
  return (
    <Box
      sx={{
        position: 'relative',
        color: '#fff',
        pt: { xs: 16, md: 20 },
        pb: { xs: 7, md: 9 },
        overflow: 'hidden',
      }}
    >
      <Box aria-hidden sx={{
        position: 'absolute', inset: 0,
        backgroundColor: '#032803',
        ...(image && {
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }),
      }} />
      <Box aria-hidden sx={{
        position: 'absolute', inset: 0,
        background:
          'radial-gradient(120% 100% at 80% 0%, rgba(0,0,255,.25), transparent 55%),' +
          'linear-gradient(160deg, rgba(3,40,3,.92) 0%, rgba(2,20,2,.82) 100%)',
      }} />
      <Container sx={{ position: 'relative', zIndex: 2 }}>
        {eyebrow && (
          <Typography sx={{ textTransform: 'uppercase', letterSpacing: '3px', fontSize: 12.5, fontWeight: 600, color: '#a8ffa8', mb: 1.5 }}>
            {eyebrow}
          </Typography>
        )}
        <Typography variant="h2" sx={{ color: '#fff', fontSize: { xs: 32, md: 48 }, fontWeight: 800 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography sx={{ mt: 2, maxWidth: 620, fontSize: { xs: 15, md: 17 }, fontWeight: 300, color: 'rgba(255,255,255,.85)' }}>
            {subtitle}
          </Typography>
        )}
        <Breadcrumbs sx={{ mt: 3, color: 'rgba(255,255,255,.7)', fontSize: 13.5, '& a': { color: 'rgba(255,255,255,.7)' } }}>
          <MuiLink component={RouterLink} to="/" underline="hover">Home</MuiLink>
          {crumbs.map((c, i) =>
            c.to ? (
              <MuiLink key={i} component={RouterLink} to={c.to} underline="hover">{c.label}</MuiLink>
            ) : (
              <Typography key={i} sx={{ color: '#fff', fontSize: 13.5 }}>{c.label}</Typography>
            ),
          )}
        </Breadcrumbs>
      </Container>
    </Box>
  )
}
