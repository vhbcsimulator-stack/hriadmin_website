import { Box } from '@mui/material'
import { resolveIconName } from './icons'

// Renders a Google Material Symbol by name. The font maps the name to a glyph
// as a ligature, so an unknown name shows as literal text rather than a blank
// box — which is the useful failure for an editor typing a name in.
export default function MaterialSymbol({ name, sx, ...props }) {
  return (
    <Box
      component="span"
      className="material-symbols-outlined"
      aria-hidden
      sx={{ fontSize: 24, lineHeight: 1, userSelect: 'none', ...sx }}
      {...props}
    >
      {resolveIconName(name)}
    </Box>
  )
}
