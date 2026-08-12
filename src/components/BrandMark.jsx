import { Box } from '@mui/material'
import logo from '../assets/images/logo/hri_logo.png'

// Brand logo. Pass `light` when placed on a dark background so the
// white-background wordmark gets a legible rounded backing.
export default function BrandMark({ light = false, clickable = true, large = false, nav = false }) {
  return (
    <Box
      component={clickable ? 'a' : 'span'}
      {...(clickable && { href: '#home' })}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        ...(large && {
          width: { xs: 210, sm: 240 },
          height: { xs: 96, sm: 110 },
          overflow: 'hidden',
        }),
        ...(nav && {
          width: { xs: 145, md: 90 },
          height: { xs: 56, md: 66 },
          overflow: 'hidden',
        }),
      }}
    >
      <Box
        component="img"
        src={logo}
        alt="Hermosa Residences Inc."
        sx={{
          height: large || nav ? 'auto' : { xs: 48, md: 56 },
          width: large || nav ? '100%' : 'auto',
          display: 'block',
          ...((large || nav) && {
            transform: 'scale(1.25)',
            transformOrigin: 'center',
          }),
          ...(light && {
            bgcolor: '#fff',
            px: 1,
            py: 0.5,
          }),
        }}
      />
    </Box>
  )
}
