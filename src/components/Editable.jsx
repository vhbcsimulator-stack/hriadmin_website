import { useEffect, useRef, useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Tooltip,
  Stack,
  Button,
  Popover,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import { ICON_GALLERY_URL, SUGGESTED_ICONS } from '../shared/content/icons'
import MaterialSymbol from '../shared/content/MaterialSymbol'
import { ACCEPT_ATTR, imageFromDataTransfer, uploadImage } from '../content/imageUpload'

// Set a value at a dot-separated path inside a nested object/array structure.
// Returns a structural clone with the value applied — safe for React state updates.
export function setDeep(obj, path, value) {
  const next = structuredClone(obj)
  const keys = path.split('.')
  let current = next
  for (let i = 0; i < keys.length - 1; i += 1) {
    current = current[keys[i]]
  }
  current[keys[keys.length - 1]] = value
  return next
}

export const getDeep = (obj, path) => path.split('.').reduce((cur, key) => cur[key], obj)

// Inline text editor. In preview mode it renders a plain Typography, so the
// editor looks exactly like the live page; in edit mode the text gets a dashed
// hover outline and a pencil button that swaps it for a field.
export function EditableText({
  value,
  onChange,
  editorMode,
  multiline = false,
  placeholder = 'Enter text…',
  sx,
  ...typographyProps
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  useEffect(() => {
    setDraft(value)
  }, [value])

  if (editorMode !== 'edit') {
    return <Typography sx={sx} {...typographyProps}>{value}</Typography>
  }

  if (isEditing) {
    const commit = () => {
      onChange(draft)
      setIsEditing(false)
    }
    const cancel = () => {
      setDraft(value)
      setIsEditing(false)
    }

    return (
      <Box
        onClick={(event) => event.stopPropagation()}
        // `color` is set explicitly: this panel opens over the dark banners too,
        // where it would otherwise inherit white text onto its white background.
        sx={{ position: 'relative', zIndex: 5, my: 0.5, p: 1, borderRadius: 2, bgcolor: '#fff', color: 'text.primary', boxShadow: 6, zIndex: 5, }}
      >
        <TextField
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={placeholder}
          multiline={multiline}
          minRows={multiline ? 3 : 1}
          size="small"
          fullWidth
          autoFocus
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !multiline) commit()
            if (event.key === 'Escape') cancel()
          }}
        />
        <Stack direction="row" spacing={1} sx={{ mt: 1, justifyContent: 'flex-end' }}>
          <Button size="small" variant="contained" onClick={commit}>
            Save
          </Button>
          <Button
            size="small"
            color="#000"
            onClick={cancel}
            sx={{ color: 'text.secondary', '&:hover': { bgcolor: 'action.hover' } }}
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 1.5,
        border: '1px dashed transparent',
        transition: 'border-color .2s ease, background .2s ease',
        '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(0,102,0,.06)' },
        '&:hover .editPencil': { opacity: 1 },
      }}
    >
      <Typography sx={sx} {...typographyProps}>
        {value || <Box component="span" sx={{ opacity: .6, fontStyle: 'italic' }}>{placeholder}</Box>}
      </Typography>
      {/* Rendered as a span: CTA labels put this control inside a real
          <button>, and a nested <button> is invalid HTML. */}
      <IconButton
        className="editPencil"
        component="span"
        role="button"
        tabIndex={0}
        size="small"
        onClick={(event) => {
          event.stopPropagation()
          setIsEditing(true)
        }}
        sx={{
          position: 'absolute', top: 2, right: 2, zIndex: 4,
          opacity: 0, transition: 'opacity .2s ease',
          bgcolor: 'primary.main', color: '#fff', boxShadow: 3,
          '&:hover': { bgcolor: 'primary.dark' },
        }}
      >
        <EditIcon sx={{ fontSize: 15 }} />
      </IconButton>
    </Box>
  )
}

// Floating "Change image" control for the page's photography. HRI's sections
// paint their imagery as CSS background layers, so rather than replacing the
// markup this drops a button on top of whichever box owns the image — the
// parent just needs position: relative.
export function ImageEditButton({
  value,
  onChange,
  editorMode,
  label = 'Change image',
  className,
  sx,
}) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [draft, setDraft] = useState(value)
  const [isDropTarget, setIsDropTarget] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    setDraft(value)
  }, [value])

  if (editorMode !== 'edit') return null

  const close = () => {
    setAnchorEl(null)
    setUploadError('')
    setIsDropTarget(false)
  }

  // Uploads through the storage seam and previews the result — the popover's
  // Apply button is still what commits it, so a mis-drop costs nothing.
  const takeFile = async (file) => {
    setUploadError('')
    setIsUploading(true)
    try {
      setDraft(await uploadImage(file))
    } catch (err) {
      setUploadError(err.message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDropTarget(false)
    const { file, url } = imageFromDataTransfer(event.dataTransfer)
    if (file) takeFile(file)
    else if (url) setDraft(url)
    else setUploadError('That drop had no image in it.')
  }

  return (
    <>
      <Button
        className={className}
        size="small"
        variant="contained"
        startIcon={<ImageOutlinedIcon />}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        sx={{
          position: 'absolute', top: 12, right: 12, zIndex: 6,
          py: .6, px: 2, fontSize: 12, whiteSpace: 'nowrap', minWidth: 'max-content',
          bgcolor: 'rgba(255,255,255,.94)', color: 'primary.dark',
          '&:hover': { bgcolor: '#fff' },
          ...sx,
        }}
      >
        {label}
      </Button>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ p: 2, width: 380 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 1 }}>Paste an image URL</Typography>
          <TextField
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="https://…"
            size="small"
            fullWidth
            autoFocus
          />
          <Box
            onDragOver={(event) => { event.preventDefault(); setIsDropTarget(true) }}
            onDragLeave={() => setIsDropTarget(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            sx={{
              mt: 1.5, p: 2, borderRadius: 1.5, textAlign: 'center', cursor: 'pointer',
              border: '1.5px dashed', borderColor: isDropTarget ? 'primary.main' : 'brand.line',
              bgcolor: isDropTarget ? 'rgba(0,102,0,.06)' : 'transparent',
              transition: 'border-color .2s ease, background .2s ease',
              '&:hover': { borderColor: 'primary.main' },
            }}
          >
            <CloudUploadOutlinedIcon sx={{ color: 'primary.main', fontSize: 26 }} />
            <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
              {isUploading ? 'Uploading…' : 'Drop an image here'}
            </Typography>
            <Typography sx={{ fontSize: 12, opacity: .7 }}>or</Typography>
            <Button
              size="small"
              variant="outlined"
              startIcon={<CloudUploadOutlinedIcon />}
              disabled={isUploading}
              sx={{ mt: .75 }}
              // The zone already opens the picker; don't let it fire twice.
              onClick={(event) => { event.stopPropagation(); fileInputRef.current?.click() }}
            >
              Upload image
            </Button>
            <Box
              component="input"
              ref={fileInputRef}
              type="file"
              accept={ACCEPT_ATTR}
              sx={{ display: 'none' }}
              onChange={(event) => {
                const file = event.target.files?.[0]
                // Reset so re-picking the same file still fires onChange.
                event.target.value = ''
                if (file) takeFile(file)
              }}
            />
          </Box>

          {uploadError ? (
            <Typography sx={{ mt: 1, fontSize: 12, color: 'error.main' }}>{uploadError}</Typography>
          ) : null}

          {draft ? (
            <Box
              sx={{
                mt: 1.5, height: 130, borderRadius: 1.5, border: '1px solid', borderColor: 'brand.line',
                backgroundImage: `url("${draft}")`, backgroundSize: 'cover', backgroundPosition: 'center',
              }}
            />
          ) : null}
          <Stack direction="row" spacing={1} sx={{ mt: 1.5, justifyContent: 'flex-end' }}>
            <Button
              size="small"
              variant="contained"
              disabled={isUploading}
              onClick={() => {
                onChange(draft.trim())
                close()
              }}
            >
              Apply
            </Button>
            <Button size="small" color="inherit" onClick={() => { setDraft(value); close() }}>
              Cancel
            </Button>
          </Stack>
        </Box>
      </Popover>
    </>
  )
}

// Icon picker for list items that carry an icon name. Any Google Material
// Symbols name works, so this is a free-text field with the site's existing
// icons offered as suggestions rather than a closed dropdown.
export function IconPicker({ value, onChange, editorMode }) {
  if (editorMode !== 'edit') return null

  return (
    // A self-contained light panel: the picker often sits on dark feature cards,
    // where the label, note, and link would otherwise be unreadable.
    <Box sx={{ mt: 1.25, maxWidth: 320, width: '100%', mx: 'auto', p: 1.5, borderRadius: 1.5, bgcolor: 'brand.surface', border: '1px solid', borderColor: 'brand.line' }}>
      <Stack direction="column" spacing={1} sx={{ alignItems: 'center', width: '100%' }}>
        <Typography sx={{ fontSize: 12.5, fontWeight: 350, letterSpacing: '.5px', color: 'text.primary', flexShrink: 0 }}>
          ICON
        </Typography>
        <TextField
          value={value || ''}
          onChange={(event) => onChange(event.target.value)}
          placeholder="forum"
          size="small"
          fullWidth
          sx={{ bgcolor: '#fff', borderRadius: 1 }}
        />
      </Stack>
      <Typography sx={{ mt: 1, fontSize: 11.5, color: 'text.secondary' }}>
        Find an icon on{' '}
        <Box
          component="a"
          href={ICON_GALLERY_URL}
          target="_blank"
          rel="noreferrer"
          sx={{ color: 'primary.main', fontWeight: 700, textDecoration: 'underline' }}
        >
          Google Fonts Icons
        </Box>
        , then paste its name here.
      </Typography>
    </Box>
  )
}

// Small colour swatch input for accent tints stored on content items.
export function ColorPicker({ value, onChange, editorMode, label = 'Accent' }) {
  const inputRef = useRef(null)
  if (editorMode !== 'edit') return null

  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 1 }}>
      <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'inherit' }}>{label}</Typography>
      <Tooltip title={value}>
        <Box
          onClick={() => inputRef.current?.click()}
          sx={{
            width: 26, height: 26, borderRadius: '50%', cursor: 'pointer',
            bgcolor: value, border: '2px solid rgba(255,255,255,.8)', boxShadow: 2,
          }}
        />
      </Tooltip>
      <input
        ref={inputRef}
        type="color"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{ width: 0, height: 0, opacity: 0, position: 'absolute' }}
      />
    </Stack>
  )
}
