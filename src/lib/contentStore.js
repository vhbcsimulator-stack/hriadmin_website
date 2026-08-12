import { supabase, isSupabaseConfigured, CONTENT_TABLE } from './supabaseClient'

// The admin app's content backend — the read/write counterpart to the public
// site's read-only store. `shared/content/*.js` reaches this through the
// `@content-backend` alias declared in admin/vite.config.js.
//
// Without Supabase configured it keeps talking to the dev-only /api/content
// middleware over content/site-content.json, so the editor works before .env
// is filled in.
const LS_KEY = 'hri_site_content'

// Fill any fields missing from stored content with the code defaults, so pages
// keep working when new sections are added after content was saved.
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

const emptyDocument = () => ({ version: 1, updatedAt: null, pages: {} })

// Exported for useSiteContent, which merges against the cached document.
export { mergeWithDefaults }

const readLocal = () => {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const writeLocal = (document) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(document))
  } catch (error) {
    console.error('Failed to cache site content in localStorage:', error)
  }
}

const rowsToDocument = (rows) => ({
  version: 1,
  updatedAt: rows.reduce((latest, row) => (row.updated_at > latest ? row.updated_at : latest), ''),
  pages: Object.fromEntries(rows.map((row) => [row.page_id, row.content])),
})

// Newest available copy of the whole content document.
export const loadDocument = async () => {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from(CONTENT_TABLE)
      .select('page_id, content, updated_at')
    if (error) {
      console.error('Failed to load site content from Supabase:', error.message)
      return readLocal() || emptyDocument()
    }
    const document = rowsToDocument(data || [])
    writeLocal(document)
    return document
  }

  try {
    const response = await fetch('/api/content', { cache: 'no-store' })
    if (response.ok) {
      const document = await response.json()
      writeLocal(document)
      return document
    }
  } catch {
    // No content service — fall through to whatever the browser cached.
  }
  return readLocal() || emptyDocument()
}

export const fetchPageContent = async (pageId, defaults) => {
  try {
    const document = await loadDocument()
    return mergeWithDefaults(defaults, document.pages?.[pageId])
  } catch (error) {
    console.error(`Failed to load site content "${pageId}":`, error)
    return defaults
  }
}

export const persistPageContent = async (pageId, content) => {
  if (isSupabaseConfigured) {
    // One row per page, so saving a page can never clobber another page.
    const { error } = await supabase
      .from(CONTENT_TABLE)
      .upsert({ page_id: pageId, content, updated_at: new Date().toISOString() }, { onConflict: 'page_id' })
    if (error) throw new Error(error.message)

    const cached = readLocal() || emptyDocument()
    writeLocal({ ...cached, pages: { ...(cached.pages || {}), [pageId]: content } })
    return
  }

  // Re-read first so saving one page never clobbers another page's content.
  const current = await loadDocument()
  const next = {
    ...emptyDocument(),
    ...current,
    pages: { ...(current.pages || {}), [pageId]: content },
  }
  writeLocal(next)

  const response = await fetch('/api/content', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(next),
  })
  if (!response.ok) throw new Error('The local content service is unavailable.')
  writeLocal(await response.json())
}
