import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Container, Typography, Stack, Button, Chip, IconButton, CircularProgress,
  Table, TableBody, TableCell, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Snackbar, Alert,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { PROJECTS_PAGE_ID, projectsContentData, saveProjectsContent, newProject } from '../shared/content/projectsContent'
import { usePageContent, useSavePageContent } from '../hooks/useSiteContent'
import ContentLoadError from '../components/ContentLoadError'

// Admin workspace: manage the project list that feeds the public /projects
// showcase and every /project-details page. CRUD persists through the shared
// content store; editing a single project's page happens in ProjectDetailsPage.
export default function ProjectsPage() {
  const navigate = useNavigate()
  // This page adds and deletes whole projects, which are saved immediately —
  // there is no draft to protect, so it reads the cached content directly
  // instead of copying it into state.
  const { data: content, error: loadError, refetch } = usePageContent(PROJECTS_PAGE_ID, projectsContentData)
  const save = useSavePageContent(PROJECTS_PAGE_ID, saveProjectsContent)
  const [dismissedError, setDismissedError] = useState(null)
  const [confirm, setConfirm] = useState(null) // index pending deletion

  const busy = save.isPending
  const failure = save.error || loadError
  const error = !failure || failure === dismissedError
    ? ''
    : `Failed to ${save.error ? 'save' : 'load projects'}: ${failure.message}`

  // The mutation writes the saved content into the shared cache, so `content`
  // updates on success without a re-read.
  const persist = async (next) => {
    try {
      await save.mutateAsync(next)
      return true
    } catch {
      return false
    }
  }

  const handleAdd = async () => {
    const project = newProject(content.projects)
    const next = { ...content, projects: [...content.projects, project] }
    if (await persist(next)) navigate(`/project-details?slug=${project.slug}`)
  }

  const handleDelete = async () => {
    const index = confirm
    setConfirm(null)
    const next = { ...content, projects: content.projects.filter((_, i) => i !== index) }
    await persist(next)
  }

  // There is no offline copy to fall back to, so a failed read is terminal
  // rather than a spinner that never resolves.
  if (!content && loadError) {
    return <ContentLoadError error={loadError} onRetry={() => refetch()} />
  }

  if (!content) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}>
        <CircularProgress />
      </Box>
    )
  }

  const { projects } = content

  return (
    <Container sx={{ py: { xs: 12, md: 14 } }}>
      {/* Header */}
      <Stack direction={{ xs: 'column', md: 'row' }} sx={{ mb: 5, gap: 2, alignItems: { md: 'flex-end' }, justifyContent: 'space-between' }}>
        <Box>
          <Typography sx={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: 12.5, fontWeight: 700, color: 'primary.main', mb: 1 }}>
            Admin Workspace
          </Typography>
          <Typography variant="h2" sx={{ color: 'primary.dark', fontSize: { xs: 30, md: 40 }, textTransform: 'none', mb: 1.5 }}>
            Project Portfolio Management
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: 16, maxWidth: 560 }}>
            Create new communities, edit content structures dynamically, configure bento elements, or delete
            properties from the public listings.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          disabled={busy}
          sx={{ py: 1.2, px: 3, whiteSpace: 'nowrap', flexShrink: 0 }}
        >
          Add New Project
        </Button>
      </Stack>

      {/* Table */}
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'brand.line', borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 760 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: 'brand.surface' }}>
                <TableCell sx={{ fontWeight: 700, color: 'primary.dark' }}>Project Cover</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'primary.dark' }}>Community Details</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'primary.dark' }}>Status/Location</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.dark' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>
                      No projects yet. Click “Add New Project” to create one.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {projects.map((p, index) => (
                <TableRow key={p.slug} hover>
                  <TableCell>
                    <Box sx={{
                      width: 110, height: 74, borderRadius: 1.5, flexShrink: 0,
                      backgroundImage: `url(${p.cover})`, backgroundSize: 'cover', backgroundPosition: 'center',
                      bgcolor: 'brand.surface',
                    }} />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 420 }}>
                    <Typography variant="h3" sx={{ fontSize: 18, fontWeight: 700, color: 'primary.dark', mb: .25 }}>
                      {p.title}
                    </Typography>
                    <Box component="code" sx={{ fontSize: 12.5, color: 'text.secondary', fontFamily: 'monospace' }}>
                      /{p.slug}
                    </Box>
                    <Typography sx={{ mt: .75, fontSize: 14, color: 'primary.main', maxWidth: 440, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.summary}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={String(p.status || '').toUpperCase()}
                      size="small"
                      sx={{ bgcolor: 'rgba(0,102,0,.1)', color: 'primary.dark', fontWeight: 700, letterSpacing: '.5px', borderRadius: 1, mb: 1 }}
                    />
                    <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>{p.location}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditOutlinedIcon />}
                        onClick={() => navigate(`/project-details?slug=${p.slug}`)}
                        sx={{ textTransform: 'none', whiteSpace: 'nowrap' }}
                      >
                        Edit Details
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteOutlineIcon />}
                        onClick={() => setConfirm(index)}
                        sx={{ textTransform: 'none' }}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>

      {/* Delete confirmation */}
      <Dialog open={confirm !== null} onClose={() => setConfirm(null)}>
        <DialogTitle>Delete this project?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirm !== null && projects[confirm]
              ? `“${projects[confirm].title}” will be removed from the public listings. This cannot be undone.`
              : ''}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm(null)} color="inherit">Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setDismissedError(failure)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="error" onClose={() => setDismissedError(failure)}>{error}</Alert>
      </Snackbar>
    </Container>
  )
}
