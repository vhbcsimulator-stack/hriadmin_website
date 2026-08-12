// Icons are Google Material Symbols, referenced by name. Content stores the
// name string ("home_work", "handshake") exactly as it appears at
// https://fonts.google.com/icons — so an editor can use any icon in the set
// without a code change. The font is loaded in index.html; it renders the name
// as a ligature, which is why the name is the element's text content.

export const ICON_GALLERY_URL = 'https://fonts.google.com/icons'

export const DEFAULT_ICON = 'star'

// A handful of suggestions for the picker. Not a whitelist — any Material
// Symbols name is valid, these are just the ones this site already leans on.
export const SUGGESTED_ICONS = [
  'forum',
  'verified_user',
  'place',
  'handshake',
  'home_work',
  'park',
  'paid',
  'support_agent',
  'star',
  'description',
]

// Content written against the old fixed icon map used camelCase keys that
// don't exist in Material Symbols. Translate them on read so existing
// site-content.json entries keep rendering.
const LEGACY_KEYS = {
  verified: 'verified_user',
  homeWork: 'home_work',
  support: 'support_agent',
  document: 'description',
}

export function resolveIconName(name) {
  if (!name) return DEFAULT_ICON
  return LEGACY_KEYS[name] || name
}
