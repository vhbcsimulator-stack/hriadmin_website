import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  Button,
  CircularProgress,
} from '@mui/material'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'

// Shown when the editor tries to leave a page with unsaved edits. Deliberately
// offers all three answers — save, throw away, or stay — so leaving is never a
// guess about what happened to the work.
export default function UnsavedChangesDialog({ open, title, saving, onSave, onDiscard, onCancel }) {
  return (
    <Dialog
      open={open}
      // Staying put is the safe default, so a backdrop click or Escape cancels
      // rather than picking one of the destructive answers.
      onClose={saving ? undefined : onCancel}
      maxWidth="sm"
      fullWidth
      aria-labelledby="unsaved-changes-title"
      slotProps={{
        paper: { sx: { borderRadius: 3, maxWidth: 520 } },
      }}
    >
      <DialogTitle
        id="unsaved-changes-title"
        sx={{ display: 'flex', alignItems: 'center', gap: 1.25, pt: 3, pb: 1, fontWeight: 700, fontSize: 20 }}
      >
        <Box
          aria-hidden
          sx={{
            display: 'grid', placeItems: 'center', flexShrink: 0,
            width: 38, height: 38, borderRadius: '50%',
             color: 'warning.dark',
          }}
        >
          <WarningAmberRoundedIcon sx={{ fontSize: 22 }} />
        </Box>
        Unsaved changes
      </DialogTitle>

      <DialogContent sx={{ pb: 1 }}>
        <DialogContentText sx={{ fontSize: 15, lineHeight: 1.65 }}>
          You have edits on {title ? <strong>{title}</strong> : 'this page'} that
          haven’t been saved yet. Save them before leaving, or discard them?
        </DialogContentText>
      </DialogContent>

      {/* Stacks on phones, where three side-by-side labels wrap mid-word. From
          sm up, "Keep editing" is pushed away from the two committing actions so
          the safe answer can't be hit by muscle memory aimed at the primary. */}
      <DialogActions
        sx={{
          px: 3, pb: 3, pt: 1, gap: 1,
          flexDirection: { xs: 'column-reverse', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          '& > :not(style) ~ :not(style)': { ml: 0 },
        }}
      >
        <Button
          onClick={onCancel}
          disabled={saving}
          sx={{ color: 'text.secondary', whiteSpace: 'nowrap', mr: { sm: 'auto' } }}
        >
          Keep editing
        </Button>
        <Button
          onClick={onDiscard}
          disabled={saving}
          color="error"
          variant="outlined"
          sx={{ whiteSpace: 'nowrap' }}
        >
          Discard changes
        </Button>
        <Button
          onClick={onSave}
          disabled={saving}
          variant="contained"
          startIcon={saving ? <CircularProgress size={15} color="inherit" /> : null}
          sx={{ whiteSpace: 'nowrap', px: 3 }}
        >
          {saving ? 'Saving…' : 'Save and leave'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
