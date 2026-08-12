import { createClient } from '@supabase/supabase-js'

// The admin app's own Supabase client. Deliberately separate from the public
// site's client (src/lib/supabaseClient.js): this one persists a signed-in
// session, the public one never authenticates at all.
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Until .env is filled in, this stays false and the app falls back to the local
// JSON content service and the temporary login below in auth.js.
export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'hri-admin-auth',
      },
    })
  : null

// See admin/sql/schema.sql for the schema, RLS policies and storage bucket.
export const CONTENT_TABLE = 'site_content'
export const IMAGE_BUCKET = 'site-images'
