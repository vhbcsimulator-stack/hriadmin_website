import { supabase, isSupabaseConfigured } from './lib/supabaseClient'

// Admin authentication. With Supabase configured this is real email/password
// auth against Supabase Auth; the row-level security policies in
// admin/sql/schema.sql are what actually protect the content, so a signed-in
// user who is not in the `admins` table can read but not write.
//
// Without Supabase configured it falls back to the temporary hard-coded login
// that predates this wiring, so the editor still opens before .env is set.

const LEGACY_KEY = 'hri-admin-authenticated'
const TEMP_USERNAME = 'admin'
const TEMP_PASSWORD = 'HRIadmin@2026'

// The login form shows these hints only while running without Supabase.
export const usesTemporaryCredentials = !isSupabaseConfigured
export const temporaryCredentials = { username: TEMP_USERNAME, password: TEMP_PASSWORD }

export async function getSession() {
  if (!isSupabaseConfigured) return null
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function isAuthenticated() {
  if (!isSupabaseConfigured) {
    return localStorage.getItem(LEGACY_KEY) === 'true'
      || sessionStorage.getItem(LEGACY_KEY) === 'true'
  }
  return Boolean(await getSession())
}

// Fires whenever the session appears or disappears (sign in, sign out, a
// refresh that failed). Returns an unsubscribe function.
export function onAuthChange(callback) {
  if (!isSupabaseConfigured) return () => {}
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(Boolean(session))
  })
  return () => data.subscription.unsubscribe()
}

// Resolves on success, throws an Error carrying a user-facing message on failure.
export async function signIn(identifier, password, rememberMe = true) {
  if (!isSupabaseConfigured) {
    if (identifier !== TEMP_USERNAME || password !== TEMP_PASSWORD) {
      throw new Error('Incorrect username or password.')
    }
    localStorage.removeItem(LEGACY_KEY)
    sessionStorage.removeItem(LEGACY_KEY)
    const storage = rememberMe ? localStorage : sessionStorage
    storage.setItem(LEGACY_KEY, 'true')
    return
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: identifier.trim(),
    password,
  })
  if (error) {
    throw new Error(
      error.message === 'Invalid login credentials'
        ? 'Incorrect email or password.'
        : error.message,
    )
  }
}

export async function signOut() {
  localStorage.removeItem(LEGACY_KEY)
  sessionStorage.removeItem(LEGACY_KEY)
  if (isSupabaseConfigured) await supabase.auth.signOut()
}
