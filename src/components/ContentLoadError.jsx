import { Box, Button, Container, Typography, Stack } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import CloudOffIcon from '@mui/icons-material/CloudOff'

// Shown in place of an editor when its content could not be read from Supabase.
// The editors have no offline copy to fall back on by design, so this state is
// the whole story: there is nothing safe to edit until the read succeeds.
export default function ContentLoadError({ error, onRetry }) {
  const isMissing = error?.name === 'MissingPageError'

  return (
    <Container sx={{ py: 16, textAlign: 'center' }}>
      <CloudOffIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h2" sx={{ fontSize: 26, mb: 1.5, textTransform: 'none' }}>
        {isMissing ? 'Nothing saved for this page yet' : 'Couldn’t load this page’s content'}
      </Typography>
      <Box sx={{ maxWidth: 520, mx: 'auto' }}>
        <Typography sx={{ color: 'text.secondary', fontSize: 15.5, mb: 1.5 }}>
          {error?.message}
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: 14, mb: 4 }}>
          {isMissing
            ? 'Nothing is shown here rather than sample content, so a save can’t overwrite the live site with placeholder text.'
            : 'The editor stays empty rather than showing an older copy, so a save can’t overwrite newer content with stale text.'}
        </Typography>
      </Box>
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
        <Button variant="contained" startIcon={<RefreshIcon />} onClick={onRetry}>
          Try again
        </Button>
      </Stack>
    </Container>
  )
}
