import { createTheme } from '@mui/material/styles'

// Bright Hermosa Realty Inc. — brand palette & typography
const GREEN = '#006600'
const GREEN_DARK = '#032803'
const BLUE = '#0000FF'
const INK = '#0d1f0d'
const BUTTON = '#024A01' // primary button colour
const BUTTON_HOVER = '#013600'
// Same pairing as the public site — the editor has to preview the visitor's type.
const HEADING_FONT = '"Cormorant Garamond", "Times New Roman", serif'
const BODY_FONT = '"Manrope", system-ui, "Segoe UI", Roboto, sans-serif'

const theme = createTheme({
  palette: {
    primary: { main: GREEN, dark: GREEN_DARK, contrastText: '#ffffff' },
    secondary: { main: BLUE, contrastText: '#ffffff' },
    text: { primary: INK, secondary: '#55605a' },
    background: { default: '#ffffff', paper: '#ffffff' },
    brand: {
      green: GREEN,
      greenDark: GREEN_DARK,
      greenDeep: '#021c02',
      blue: BLUE,
      surface: '#f4f6f4',
      line: '#e6e8e6',
    },
  },
  typography: {
    fontFamily: BODY_FONT,
    // Only h1/h2 take the serif — the display sizes it was chosen for. h3 and h4
    // are small uppercase labels here, where Cormorant reads as blurry rather
    // than elegant. Weights stay within what index.css loads (500/600/700).
    h1: { fontFamily: HEADING_FONT, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 0.95 },
    h2: { fontFamily: HEADING_FONT, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.05, textTransform: 'uppercase' },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.2px' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: 26, paddingBlock: 12 },
        // All solid buttons use the brand green #024A01.
        contained: {
          backgroundColor: BUTTON,
          color: '#ffffff',
          '&:hover': { backgroundColor: BUTTON_HOVER },
        },
        // Outlined buttons follow the same green (except where overridden inline).
        outlinedPrimary: {
          color: BUTTON,
          borderColor: BUTTON,
          '&:hover': { borderColor: BUTTON_HOVER, backgroundColor: 'rgba(2,74,1,0.06)' },
        },
      },
    },
    MuiContainer: {
      defaultProps: { maxWidth: 'lg' },
    },
  },
})

export default theme
