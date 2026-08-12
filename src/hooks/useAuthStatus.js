import { useEffect, useState } from 'react'
import { isAuthenticated, onAuthChange } from '../auth'

// Reading a Supabase session is async, so the route guard can't answer
// "signed in?" on the first render. `null` means "still checking" — render a
// placeholder for it rather than bouncing the user to /login by mistake.
export default function useAuthStatus() {
  const [signedIn, setSignedIn] = useState(null)

  useEffect(() => {
    let cancelled = false

    isAuthenticated()
      .then((value) => { if (!cancelled) setSignedIn(value) })
      .catch(() => { if (!cancelled) setSignedIn(false) })

    // Keeps the guard honest after a sign-out in another tab or an expired token.
    const unsubscribe = onAuthChange((value) => { if (!cancelled) setSignedIn(value) })

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [])

  return signedIn
}
