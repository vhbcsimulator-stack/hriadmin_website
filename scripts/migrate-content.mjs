// Migrates saved `site_content` rows to the current content shapes:
//
//   legal   — section bodies `copy: '…'`      -> `blocks: [{type:'paragraph'}]`
//   sitemap — group bodies   `links: [{…}]`   -> `blocks: [{type:'bullets'}]`
//   both    — adds `heroParagraphs: []` where the banner has none
//
// The apps already normalise these on read, so this is not required for the
// site to work — it just stops rows drifting further from the code model.
//
//   node admin/scripts/migrate-content.mjs           # dry run, read-only
//   node admin/scripts/migrate-content.mjs --apply   # writes, after a backup
//
// Reads from admin/.env (or the process environment):
//   VITE_SUPABASE_URL
//   VITE_SUPABASE_ANON_KEY        <- enough for the dry run (rows are public)
//   SUPABASE_SERVICE_ROLE_KEY     <- required for --apply; server-only secret
//
// --apply always writes a timestamped backup of the current rows to
// admin/backups/ before touching anything, so a bad run can be restored.

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import { withBlocks } from '../../shared/content/blocks.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const envFile = path.join(here, '..', '.env')
const backupDir = path.join(here, '..', 'backups')

const apply = process.argv.includes('--apply')

// Minimal .env reader so the script needs no extra dependency.
async function loadEnvFile(file) {
  let raw
  try {
    raw = await fs.readFile(file, 'utf8')
  } catch {
    return
  }
  for (const line of raw.split('\n')) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/)
    if (!match || line.trim().startsWith('#')) continue
    const value = match[2].replace(/^["']|["']$/g, '')
    if (!(match[1] in process.env)) process.env[match[1]] = value
  }
}

await loadEnvFile(envFile)

const url = process.env.VITE_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const anonKey = process.env.VITE_SUPABASE_ANON_KEY
const key = apply ? serviceKey : (serviceKey || anonKey)

if (!url || !key) {
  console.error(apply
    ? 'Writing needs VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in admin/.env.'
    : 'Reading needs VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in admin/.env.')
  process.exit(1)
}

const withHeroParagraphs = (doc) => (
  Array.isArray(doc?.heroParagraphs) ? doc : { ...doc, heroParagraphs: [] }
)

// Returns the migrated content for a page, or null when nothing would change.
function migratePage(pageId, content) {
  if (pageId === 'legal') {
    const next = Object.fromEntries(Object.entries(content || {}).map(([type, doc]) => [
      type,
      { ...withHeroParagraphs(doc), sections: (doc?.sections || []).map(withBlocks) },
    ]))
    return JSON.stringify(next) === JSON.stringify(content) ? null : next
  }

  if (pageId === 'sitemap') {
    const next = {
      ...withHeroParagraphs(content),
      groups: (content?.groups || []).map(withBlocks),
    }
    return JSON.stringify(next) === JSON.stringify(content) ? null : next
  }

  return null // every other page is untouched by this migration
}

const supabase = createClient(url, key, { auth: { persistSession: false } })

const { data, error } = await supabase
  .from('site_content')
  .select('page_id, content, updated_at')

if (error) {
  console.error(`Could not read site_content: ${error.message}`)
  process.exit(1)
}

const rows = data || []
console.log(`Read ${rows.length} row(s): ${rows.map((r) => r.page_id).join(', ') || '(none)'}\n`)

const changes = []
for (const row of rows) {
  const next = migratePage(row.page_id, row.content)
  if (!next) {
    console.log(`  ${row.page_id.padEnd(10)} no change`)
    continue
  }
  changes.push({ page_id: row.page_id, content: next })

  // Describe what actually differs, so a dry run is reviewable.
  const notes = []
  if (row.page_id === 'legal') {
    for (const [type, doc] of Object.entries(row.content || {})) {
      const legacy = (doc?.sections || []).filter((s) => !Array.isArray(s?.blocks)).length
      if (legacy) notes.push(`${type}: ${legacy} section(s) copy -> blocks`)
      if (!Array.isArray(doc?.heroParagraphs)) notes.push(`${type}: + heroParagraphs`)
    }
  } else {
    const legacy = (row.content?.groups || []).filter((g) => !Array.isArray(g?.blocks)).length
    if (legacy) notes.push(`${legacy} group(s) links -> blocks`)
    if (!Array.isArray(row.content?.heroParagraphs)) notes.push('+ heroParagraphs')
  }
  console.log(`  ${row.page_id.padEnd(10)} WOULD CHANGE — ${notes.join('; ')}`)
}

if (changes.length === 0) {
  console.log('\nNothing to migrate.')
  process.exit(0)
}

if (!apply) {
  console.log(`\nDry run only. ${changes.length} row(s) would be written.`)
  console.log('Re-run with --apply (and SUPABASE_SERVICE_ROLE_KEY set) to write them.')
  process.exit(0)
}

await fs.mkdir(backupDir, { recursive: true })
const stamp = new Date().toISOString().replace(/[:.]/g, '-')
const backupFile = path.join(backupDir, `site_content-${stamp}.json`)
await fs.writeFile(backupFile, JSON.stringify(rows, null, 2))
console.log(`\nBacked up ${rows.length} row(s) to ${backupFile}`)

const { error: writeError } = await supabase
  .from('site_content')
  .upsert(
    changes.map((c) => ({ ...c, updated_at: new Date().toISOString() })),
    { onConflict: 'page_id' },
  )

if (writeError) {
  console.error(`Migration failed: ${writeError.message}`)
  console.error(`Rows are unchanged where the write did not land. Backup: ${backupFile}`)
  process.exit(1)
}

console.log(`Migrated ${changes.length} row(s): ${changes.map((c) => c.page_id).join(', ')}`)
