import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import BrandMark from '../components/BrandMark'
import { signIn, usesTemporaryCredentials, temporaryCredentials } from '../auth'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  // Supabase signs in with an email; the pre-Supabase fallback takes a username.
  const identifierLabel = usesTemporaryCredentials ? 'Username' : 'Email'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      await signIn(username, password, true)
      setLoginError('')
      navigate('/home')
    } catch (error) {
      setLoginError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background:
          'radial-gradient(circle at top left, rgba(0,102,0,.18), transparent 34%), radial-gradient(circle at bottom right, rgba(0,0,255,.12), transparent 28%), linear-gradient(135deg, #f5f8f4 0%, #e9efe7 100%)',
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(115deg, rgba(255,255,255,.76) 0%, rgba(255,255,255,.14) 44%, rgba(255,255,255,.05) 100%)',
          backdropFilter: 'blur(3px)',
        }}
      />

      <Container
        maxWidth="sm"
        sx={{
          position: 'relative',
          zIndex: 1,
          py: { xs: 2, sm: 5 },
          minHeight: '100vh',
          display: 'grid',
          alignItems: 'center',
        }}
      >
          <Card
            elevation={0}
            sx={{
              position: 'relative',
              width: '100%',
              borderRadius: { xs: 3, sm: 4 },
              p: { xs: 3, sm: 4.5 },
              border: '1px solid',
              borderColor: 'brand.line',
              bgcolor: 'rgba(255,255,255,.92)',
              boxShadow: '0 24px 70px -40px rgba(0,0,0,.38)',
              backdropFilter: 'blur(14px)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 2.5, sm: 3 } }}>
              <BrandMark clickable={false} large />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box sx={{ width: 44, height: 44, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: 'primary.main', color: '#fff', boxShadow: 3 }}>
                <LockOutlinedIcon />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 20, color: 'primary.dark' }}>Admin Portal</Typography>
                <Typography sx={{ fontSize: 13.5, color: 'text.secondary' }}>Secure access to the admin area</Typography>
              </Box>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label={identifierLabel}
                  type={usesTemporaryCredentials ? 'text' : 'email'}
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value)
                    setLoginError('')
                  }}
                  fullWidth
                  autoComplete={usesTemporaryCredentials ? 'username' : 'email'}
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                    setLoginError('')
                  }}
                  fullWidth
                  autoComplete="current-password"
                  error={Boolean(loginError)}
                  helperText={loginError}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={submitting}
                  startIcon={<ShieldOutlinedIcon />}
                >
                  {submitting ? 'Signing in…' : 'Continue'}
                </Button>
              </Stack>
            </Box>

            {/* Only shown before Supabase is configured — once VITE_SUPABASE_URL
                and VITE_SUPABASE_ANON_KEY are set this disappears and sign-in
                goes through Supabase Auth. */}
            {usesTemporaryCredentials && (
              <Box sx={{ mt: 3, p: 1.5, borderRadius: 2, bgcolor: 'rgba(0,102,0,.06)', textAlign: 'center' }}>
                <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: 'primary.dark' }}>
                  Temporary Credentials
                </Typography>
                <Typography sx={{ mt: 0.5, fontSize: 12.5, color: 'text.secondary' }}>
                  Username: {temporaryCredentials.username} | Password: {temporaryCredentials.password}
                </Typography>
              </Box>
            )}
          </Card>
      </Container>
    </Box>
  )
}
