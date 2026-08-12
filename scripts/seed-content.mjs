// One-off migration: push content/site-content.json into the Supabase
// `site_content` table, one row per page.
//
//   node admin/scripts/seed-content.mjs
//
// Reads from admin/.env (or the process environment):
//   VITE_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY   <- server-only secret, never in a VITE_ var
//
// The service-role key bypasses row-level security, so this runs without
// signing in. Get it from Dashboard > Project Settings > API.
//
// Note: any images currently inlined as data: URLs are copied across as-is.
// Re-uploading them through the editor moves them to Supabase Storage and
// shrinks the rows.

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const here = path.dirname(fileURLToPath(import.meta.url))
const envFile = path.join(here, '..', '.env')
const contentFile = path.join(here, '..', 'content', 'site-content.json')

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

if (!url || !serviceKey) {
  console.error('Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in admin/.env first.')
  process.exit(1)
}

const document = JSON.parse(await fs.readFile(contentFile, 'utf8'))
const pages = Object.entries(document.pages || {})

if (pages.length === 0) {
  console.error(`No pages found in ${contentFile}.`)
  process.exit(1)
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

const rows = pages.map(([pageId, content]) => ({ page_id: pageId, content }))
const { error } = await supabase.from('site_content').upsert(rows, { onConflict: 'page_id' })

if (error) {
  console.error(`Seeding failed: ${error.message}`)
  process.exit(1)
}

console.log(`Seeded ${rows.length} page(s): ${rows.map((row) => row.page_id).join(', ')}`)
