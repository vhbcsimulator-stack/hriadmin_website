import { QueryClient } from '@tanstack/react-query'

// Deliberately tuned differently from the public site's client. The public site
// optimises for volume — thousands of visitors, content that rarely changes, so
// refetching is switched off outright. The admin app has a handful of users and
// the opposite risk: editing a stale copy silently overwrites someone else's
// work. So it keeps a short staleness window and refetches on focus, while
// still collapsing editor-to-editor navigation into the cache.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // switching between editors inside 30s is free
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: true, // coming back to the tab shows current content
      refetchOnReconnect: true,
      retry: 1,
    },
    mutations: {
      retry: 0, // never silently re-send a save
    },
  },
})
