import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useBlocker, useNavigate } from 'react-router-dom'
import { usePageContent, useSavePageContent } from '../hooks/useSiteContent'
import { createPortal } from 'react-dom'
import {
  Box,
  Chip,
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CheckIcon from '@mui/icons-material/Check'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import useDraftHistory from '../hooks/useDraftHistory'
import UnsavedChangesDialog from './UnsavedChangesDialog'
import { setDeep, getDeep } from './Editable'

// Fallback until the real Navbar is measured (matches its Toolbar minHeight).
const NAV_HEIGHT_FALLBACK = 76
const TOOLBAR_HEIGHT = { xs: 112, sm: 60 }

// The Navbar's Toolbar minHeight is only a minimum — its real height depends on
// the logo and breakpoint — so measure the rendered AppBar rather than
// duplicating a constant that silently drifts and lets the toolbar overlap it.
function useNavHeight() {
  const [height, setHeight] = useState(NAV_HEIGHT_FALLBACK)

  useLayoutEffect(() => {
    const nav = document.querySelector('header.MuiAppBar-root')
    if (!nav) return
    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.target.getBoundingClientRect().height)
    })
    observer.observe(nav)
    return () => observer.disconnect()
  }, [])

  return height
}

// Shared shell for the website page editors. Reads the page's slice of the
// shared content document, keeps the editor's unsaved draft alongside it, hands
// the render function the draft plus update/addItem/removeItem helpers, and
// pins an Edit/Preview + Save toolbar directly under the site navbar.
export default function PageEditorShell({ pageId, title, defaults, saveContent, normalize, children }) {
  const { data: saved, error: loadError } = usePageContent(pageId, defaults)
  const save = useSavePageContent(pageId, saveContent)

  // `content` is the draft being edited — client state, not server state, so it
  // lives outside the query cache. The history hook wraps it in an undo stack;
  // `setContent` still takes a value or an updater, as useState did.
  const {
    content, setContent, resetContent, undo, redo, canUndo, canRedo,
  } = useDraftHistory()
  const [editorMode, setEditorMode] = useState('edit')
  const [dismissedError, setDismissedError] = useState(null)
  // Serialised copy of the last state the server confirmed. Comparing against
  // it — rather than keeping a boolean flag — means undoing back to where you
  // started correctly counts as no longer dirty.
  const [baseline, setBaseline] = useState(null)
  const navHeight = useNavHeight()
  const navigate = useNavigate()

  // Seed the draft once, when the content first arrives. Adjusting state during
  // render rather than in an effect avoids a frame of empty content — see
  // react.dev "You Might Not Need an Effect".
  //
  // Deliberately seeds only once: a background refetch (this client refetches on
  // window focus) must never overwrite what the editor has typed but not saved.
  // The trade-off is that a concurrent edit by someone else won't appear until
  // this page is reopened — losing unsaved work is the worse failure.
  //
  // `normalize` upgrades content saved in an older shape (see blocks.js) before
  // it is edited, so the editor never writes a half-migrated document back.
  if (content === null && saved) {
    const seeded = normalize ? normalize(saved) : saved
    resetContent(seeded)
    setBaseline(JSON.stringify(seeded))
  }

  const saveState = save.isPending ? 'saving' : save.isSuccess ? 'saved' : 'idle'

  // Unsaved-work detection. Serialising the whole page document on each render
  // is cheap next to rendering it, and it is the only comparison that survives
  // undo: structural equality would need a deep walk anyway.
  const isDirty = useMemo(
    () => Boolean(content) && baseline !== null && JSON.stringify(content) !== baseline,
    [content, baseline],
  )

  // A dismissed snackbar stays closed for that failure but reopens for the next.
  const failure = save.error || loadError
  const error = !failure || failure === dismissedError
    ? ''
    : `Failed to ${save.error ? 'save changes' : 'load content'}: ${failure.message}`

  // Drop the "Saved" confirmation back to idle, as the old setTimeout did.
  useEffect(() => {
    if (!save.isSuccess) return undefined
    const timer = window.setTimeout(() => save.reset(), 2000)
    return () => window.clearTimeout(timer)
  }, [save.isSuccess, save])

  const update = (path, value) => {
    setContent((prev) => setDeep(prev, path, value))
  }

  const addItem = (path, template, { prepend = false } = {}) => {
    setContent((prev) => {
      const next = structuredClone(prev)
      const list = getDeep(next, path)
      if (prepend) list.unshift(structuredClone(template))
      else list.push(structuredClone(template))
      return next
    })
  }

  const removeItem = (path, index) => {
    setContent((prev) => {
      const next = structuredClone(prev)
      getDeep(next, path).splice(index, 1)
      return next
    })
  }

  // Kept returning a boolean: callers await it to decide whether to navigate on.
  const handleSave = async () => {
    try {
      await save.mutateAsync(content)
      // The draft is now what the server holds, so it stops counting as dirty.
      setBaseline(JSON.stringify(content))
      return true
    } catch {
      return false // surfaced through the snackbar via save.error
    }
  }

  // Stops in-app navigation while there are unsaved edits. Needs a data router,
  // which is why main.jsx uses createBrowserRouter — this covers link clicks and
  // programmatic navigate() calls alike, including Logout.
  const blocker = useBlocker(isDirty)
  // The blocker resets itself if `isDirty` flips false while it is blocked, which
  // is exactly what saving does — so remember where the user was headed and
  // navigate there ourselves if `proceed` is gone by the time the save lands.
  const pendingPath = useRef(null)
  useEffect(() => {
    if (blocker.state === 'blocked') {
      pendingPath.current = blocker.location.pathname + blocker.location.search
    }
  }, [blocker])

  const leave = () => {
    if (blocker.state === 'blocked') blocker.proceed()
    else if (pendingPath.current) navigate(pendingPath.current)
  }

  const saveAndLeave = async () => {
    if (await handleSave()) leave()
    // On failure the dialog stays open over the error snackbar, so the edits are
    // never thrown away by a navigation the user can't see the outcome of.
  }

  const discardAndLeave = () => {
    if (baseline !== null) resetContent(JSON.parse(baseline))
    leave()
  }

  // The browser's own guard for reloads, tab closes and links out of the app —
  // none of which the router can see. The text is fixed by the browser.
  useEffect(() => {
    if (!isDirty) return undefined
    const warn = (event) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [isDirty])

  // Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z (or Ctrl+Y) drive the undo stack. Skipped
  // while a field has focus: there, the same chord is the browser's own text
  // undo, which is what the user means inside an open editor panel.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (!(event.ctrlKey || event.metaKey)) return
      const tag = event.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || event.target?.isContentEditable) return
      const key = event.key.toLowerCase()
      if (key === 'z' && !event.shiftKey) {
        event.preventDefault()
        undo()
      } else if ((key === 'z' && event.shiftKey) || key === 'y') {
        event.preventDefault()
        redo()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [undo, redo])

  // The Layout animates <main> with a transform, which would make a fixed
  // toolbar inside it scroll away with the page — so it renders into <body>.
  const toolbar = (
    <Box
        sx={{
          position: 'fixed',
          top: navHeight,
          left: 0,
          right: 0,
          zIndex: (theme) => theme.zIndex.appBar - 1,
          minHeight: { xs: TOOLBAR_HEIGHT.xs, sm: TOOLBAR_HEIGHT.sm },
          px: { xs: 2, md: 4 },
          py: 1,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 2 },
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'rgba(255,255,255,.96)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid',
          borderColor: 'brand.line',
          boxShadow: '0 6px 18px -12px rgba(0,0,0,.35)',
        }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ width: { xs: '100%', sm: 'auto' }, alignItems: 'center' }}
        >
          <Chip size="small" color="primary" label={`Editing: ${title}`} sx={{ fontWeight: 500, letterSpacing: '.5px' }} />
          {/* Reserves no space when clean, so the toolbar doesn't jump. */}
          {isDirty && (
            <Chip size="small" variant="outlined" color="warning" label="Unsaved changes" sx={{ fontWeight: 500 }} />
          )}
        </Stack>

        <Stack
          direction="row"
          spacing={1.5}
          sx={{ width: { xs: '100%', sm: 'auto' }, alignItems: 'center', justifyContent: 'flex-end' }}
        >
          {/* Tooltips wrap a span: MUI can't show a tooltip for a disabled
              button, which is most of the time for these two. */}
          <Stack direction="row" spacing={.5}>
            <Tooltip title={canUndo ? 'Undo (Ctrl+Z)' : 'Nothing to undo'}>
              <span>
                <IconButton size="small" onClick={undo} disabled={!canUndo} aria-label="Undo">
                  <UndoIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={canRedo ? 'Redo (Ctrl+Shift+Z)' : 'Nothing to redo'}>
              <span>
                <IconButton size="small" onClick={redo} disabled={!canRedo} aria-label="Redo">
                  <RedoIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>

          <ToggleButtonGroup
            size="small"
            exclusive
            value={editorMode}
            onChange={(event, mode) => mode && setEditorMode(mode)}
          >
            <ToggleButton value="edit" sx={{ px: 2, textTransform: 'none' }}>Edit layout</ToggleButton>
            <ToggleButton value="preview" sx={{ px: 2, textTransform: 'none' }}>Preview</ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saveState === 'saving' || !content}
            startIcon={
              saveState === 'saving' ? <CircularProgress size={15} color="inherit" />
                : saveState === 'saved' ? <CheckIcon />
                : null
            }
            sx={{ py: 1, px: 3.5 }}
          >
            {saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? 'Saved' : 'Save'}
          </Button>
        </Stack>
    </Box>
  )

  return (
    <Box>
      {createPortal(toolbar, document.body)}

      {/* Spacer so the page starts below the fixed navbar and editor toolbar. */}
      <Box sx={{
        height: {
          xs: navHeight + TOOLBAR_HEIGHT.xs,
          sm: navHeight + TOOLBAR_HEIGHT.sm,
        },
      }} />

      {content ? (
        children({ content, editorMode, update, addItem, removeItem, handleSave, saveState })
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}>
          <CircularProgress />
        </Box>
      )}

      <UnsavedChangesDialog
        open={blocker.state === 'blocked'}
        title={title}
        saving={saveState === 'saving'}
        onSave={saveAndLeave}
        onDiscard={discardAndLeave}
        onCancel={() => blocker.reset()}
      />

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => setDismissedError(failure)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setDismissedError(failure)}>{error}</Alert>
      </Snackbar>
    </Box>
  )
}

// Adds an item to an editable list.
export function AddItemButton({ onClick, label, sx }) {
  return (
    <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={onClick} sx={{ py: .8, ...sx }}>
      {label}
    </Button>
  )
}

// Removes a list item. Sits in the item's top-right corner; the parent needs
// position: relative.
export function DeleteItemButton({ onDelete, sx }) {
  return (
    <Tooltip title="Delete item">
      <IconButton
        size="small"
        onClick={(event) => {
          event.stopPropagation()
          event.preventDefault()
          onDelete()
        }}
        sx={{
          position: 'absolute', top: 12, left: 12, zIndex: 6,
          bgcolor: 'rgba(255,255,255,.94)', color: 'error.main', boxShadow: 3,
          '&:hover': { bgcolor: 'error.main', color: '#fff' },
          ...sx,
        }}
      >
        <DeleteOutlineIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Tooltip>
  )
}
