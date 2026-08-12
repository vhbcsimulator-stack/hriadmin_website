import { supabase, isSupabaseConfigured, CONTENT_TABLE } from './supabaseClient'

// The admin app's content backend — the read/write counterpart to the public
// site's read-only store. `src/shared/content/*.js` reaches this through the
// `@content-backend` alias declared in admin/vite.config.js.
//
// Supabase is the only source of content here. Every read either reaches the
// table or fails loudly; the only cache in front of it is react-query's, in
// src/lib/queryClient.js. There is deliberately no localStorage mirror and no
// code-defaults fallback for a page that is missing from the table: an editor
// that silently shows something other than the live row invites the user to
// save it back, overwriting real content with a stale or invented copy.

// Fill any fields missing from stored content with the code defaults, so pages
// keep working when new sections are added to a page after its content was
// saved. This only ever tops up a row that exists — it is a schema backfill,
// not a stand-in for content that failed to load.
const mergeWithDefaults = (defaults, stored) => {
  if (stored === undefined || stored === null) return defaults
  if (Array.isArray(stored)) return stored
  if (typeof stored === 'object' && defaults && typeof defaults === 'object' && !Array.isArray(defaults)) {
    const merged = { ...defaults }
    for (const key of Object.keys(stored)) {
      merged[key] = mergeWithDefaults(defaults[key], stored[key])
    }
    return merged
  }
  return stored
}

// Exported for useSiteContent, which merges against the cached document.
export { mergeWithDefaults }

// Thrown when a page has no row in the table. Carries a marker so callers can
// tell "nothing saved for this page yet" apart from a transport failure.
export class MissingPageError extends Error {
  constructor(pageId) {
    super(`No saved content for “${pageId}”. This page has no row in Supabase yet.`)
    this.name = 'MissingPageError'
    this.pageId = pageId
  }
}

const requireSupabase = () => {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in admin/.env.',
    )
  }
}

const rowsToDocument = (rows) => ({
  version: 1,
  updatedAt: rows.reduce((latest, row) => (row.updated_at > latest ? row.updated_at : latest), ''),
  pages: Object.fromEntries(rows.map((row) => [row.page_id, row.content])),
})

// The whole content document, straight from Supabase. Throws rather than
// returning a fallback, so react-query records the failure and the editors show
// it instead of rendering content that isn't really there.
export const loadDocument = async () => {
  requireSupabase()

  const { data, error } = await supabase
    .from(CONTENT_TABLE)
    .select('page_id, content, updated_at')
  if (error) throw new Error(`Could not load site content: ${error.message}`)

  return rowsToDocument(data || [])
}

// One page, merged over the code defaults. Kept for the `@content-backend`
// contract that src/shared/content/*.js is written against; the editors read
// through usePageContent instead.
export const fetchPageContent = async (pageId, defaults) => {
  const document = await loadDocument()
  const stored = document.pages?.[pageId]
  if (stored === undefined || stored === null) throw new MissingPageError(pageId)
  return mergeWithDefaults(defaults, stored)
}

export const persistPageContent = async (pageId, content) => {
  requireSupabase()

  // One row per page, so saving a page can never clobber another page.
  const { error } = await supabase
    .from(CONTENT_TABLE)
    .upsert({ page_id: pageId, content, updated_at: new Date().toISOString() }, { onConflict: 'page_id' })
  if (error) throw new Error(`Could not save site content: ${error.message}`)
}
