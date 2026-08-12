import { useCallback } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { loadDocument, mergeWithDefaults } from '../lib/contentStore'

// One cache entry for the whole content document, exactly as on the public
// site. Every editor page reads its own slice out of this shared copy, so
// moving between editors costs no extra Supabase reads.
export const SITE_CONTENT_KEY = ['site-content']

export const siteContentQuery = {
  queryKey: SITE_CONTENT_KEY,
  queryFn: loadDocument,
}

// The server's copy of one page, merged over the code defaults.
export function usePageContent(pageId, defaults) {
  // Memoised: react-query re-runs `select` whenever the function identity
  // changes, and an inline arrow would rebuild the merged content every render.
  const select = useCallback(
    (document) => mergeWithDefaults(defaults, document.pages?.[pageId]),
    [pageId, defaults],
  )

  return useQuery({ ...siteContentQuery, select })
}

// Saves one page, then writes the result straight into the cached document.
// Patching the cache rather than invalidating it means a save costs one write
// and no follow-up read, and other editor pages see the new content instantly.
export function useSavePageContent(pageId, saveContent) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (content) => saveContent(content),
    onSuccess: (_result, content) => {
      queryClient.setQueryData(SITE_CONTENT_KEY, (document) => ({
        ...(document || { version: 1, pages: {} }),
        updatedAt: new Date().toISOString(),
        pages: { ...(document?.pages || {}), [pageId]: content },
      }))
    },
  })
}
