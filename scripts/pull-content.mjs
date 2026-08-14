// The reverse of seed-content.mjs: writes the live `site_content` rows back
// into content/site-content.json, for both the public app and the admin app.
//
//   node admin/scripts/pull-content.mjs           # dry run, read-only
//   node admin/scripts/pull-content.mjs --apply   # rewrites both snapshots
//
// Reads from admin/.env (or the process environment):
//   VITE_SUPABASE_URL
//   VITE_SUPABASE_ANON_KEY   <- enough; the rows are world readable
//
// Why this exists: once Supabase is configured it is the live store, and the
// JSON snapshots become the offline fallback the public build imports. If the
// snapshot is never refreshed it drifts, and any deploy that cannot reach
// Supabase — including a Vercel build with the VITE_SUPABASE_* vars unset —
// renders whatever stale (or placeholder) copy the snapshot still holds.
// Run this before shipping the public site so the fallback matches the CMS.

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const here = path.dirname(fileURLToPath(import.meta.url))
const envFile = path.join(here, '..', '.env')

// Both apps keep their own copy; the admin folder deploys standalone.
const targets = [
  path.join(here, '..', '..', 'content', 'site-content.json'),
  path.join(here, '..', 'content', 'site-content.json'),
]

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
const anonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  console.error('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in admin/.env first.')
  process.exit(1)
}

const supabase = createClient(url, anonKey, { auth: { persistSession: false } })

const { data, error } = await supabase
  .from('site_content')
  .select('page_id, content, updated_at')

if (error) {
  console.error(`Read failed: ${error.message}`)
  process.exit(1)
}

const rows = data || []
if (rows.length === 0) {
  console.error('No rows in site_content — refusing to overwrite the snapshots with nothing.')
  process.exit(1)
}

// Same document shape the apps already expect: pages[pageId] is exactly what
// the editor produced.
const document = {
  version: 1,
  updatedAt: rows.reduce((latest, row) => (row.updated_at > latest ? row.updated_at : latest), ''),
  pages: Object.fromEntries(
    rows
      .slice()
      .sort((a, b) => a.page_id.localeCompare(b.page_id))
      .map((row) => [row.page_id, row.content]),
  ),
}

const serialised = `${JSON.stringify(document, null, 2)}\n`

for (const file of targets) {
  let before = ''
  try {
    before = await fs.readFile(file, 'utf8')
  } catch {
    // A missing snapshot is fine — it gets created.
  }
  const relative = path.relative(path.join(here, '..', '..'), file)
  if (before === serialised) {
    console.log(`unchanged  ${relative}`)
    continue
  }
  if (!apply) {
    console.log(`would write ${relative} (${(before.length / 1024).toFixed(1)}KB -> ${(serialised.length / 1024).toFixed(1)}KB)`)
    continue
  }
  await fs.writeFile(file, serialised)
  console.log(`wrote      ${relative} (${(serialised.length / 1024).toFixed(1)}KB)`)
}

console.log(`${apply ? 'Pulled' : 'Found'} ${rows.length} page(s): ${Object.keys(document.pages).join(', ')}`)
if (!apply) console.log('Dry run — re-run with --apply to write.')
