// Refreshes admin/src/shared/content from the monorepo's shared/content.
//
//   node admin/scripts/sync-shared.mjs
//
// The admin app deploys as a standalone folder, so it carries a committed copy
// of shared/content rather than importing across the repo root. That copy is
// the build input; this script is how it gets updated after shared/content
// changes. It is deliberately NOT wired into `npm run build` — a deploy that
// only has the admin folder has no shared/ to read, and the build must still
// work there.
//
// Exits quietly when shared/ is absent, so it is safe to run anywhere.

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const source = path.join(here, '..', '..', 'shared', 'content')
const target = path.join(here, '..', 'src', 'shared', 'content')

let entries
try {
  entries = await fs.readdir(source)
} catch {
  console.log(`No shared/content at ${source} — nothing to sync.`)
  process.exit(0)
}

const files = entries.filter((name) => name.endsWith('.js') || name.endsWith('.jsx'))
if (files.length === 0) {
  console.error(`No .js/.jsx files found in ${source}.`)
  process.exit(1)
}

await fs.mkdir(target, { recursive: true })

const changed = []
for (const name of files) {
  const from = path.join(source, name)
  const to = path.join(target, name)
  const next = await fs.readFile(from, 'utf8')
  const current = await fs.readFile(to, 'utf8').catch(() => null)
  if (current !== next) {
    await fs.writeFile(to, next, 'utf8')
    changed.push(name)
  }
}

// Anything in the vendored copy that no longer exists upstream is stale. The
// directory's own README is local documentation, not vendored content.
const stale = (await fs.readdir(target))
  .filter((name) => name !== 'README.md' && !files.includes(name))

console.log(
  changed.length === 0
    ? `Already up to date (${files.length} file(s)).`
    : `Updated ${changed.length} file(s): ${changed.join(', ')}`,
)
if (stale.length > 0) console.warn(`Stale, no longer in shared/: ${stale.join(', ')}`)
