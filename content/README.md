# Local content template

`site-content.json` is the fallback content store for the public and admin Vite
apps. Do not put secrets or API keys in this file.

**Before Supabase is configured** (no `VITE_SUPABASE_URL` /
`VITE_SUPABASE_ANON_KEY` in `.env`) this file is the live content store: the
Vite content middleware reads and writes it during local development, and the
public production build imports it as a snapshot — so rebuild the public site
after changing content before deploying static files.

**Once Supabase is configured** the `site_content` table takes over. Both apps
read from it, the admin writes to it, and this file is demoted to the offline
fallback the public site falls back on if Supabase is unreachable. Seed the
table from this file with `npm --prefix admin run seed:content`.

The page document shape is the same either way: `pages[pageId]` holds exactly
what the editor produces. See [../SUPABASE.md](../SUPABASE.md).
