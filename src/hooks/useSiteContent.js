import { useCallback, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { loadDocument, mergeWithDefaults, MissingPageError } from '../lib/contentStore'

// One cache entry for the whole content document, exactly as on the public
// site. Every editor page reads its own slice out of this shared copy, so
// moving between editors costs no extra Supabase reads.
export const SITE_CONTENT_KEY = ['site-content']

export const siteContentQuery = {
  queryKey: SITE_CONTENT_KEY,
  queryFn: loadDocument,
}

// Distinguishes "this page has no row" from "the row is there but empty".
const MISSING = Symbol('missing-page')

// The server's copy of one page, merged over the code defaults.
//
// A page with no row in Supabase resolves as an error, not as the code
// defaults. Showing the defaults would put sample content in front of the user
// as though it were live, and saving it would write that invention into the
// table. The defaults still top up individual fields of a row that does exist,
// which is what keeps older content working after a section is added.
export function usePageContent(pageId, defaults) {
  // Memoised: react-query re-runs `select` whenever the function identity
  // changes, and an inline arrow would rebuild the merged content every render.
  const select = useCallback(
    (document) => {
      const stored = document.pages?.[pageId]
      if (stored === undefined || stored === null) return MISSING
      return mergeWithDefaults(defaults, stored)
    },
    [pageId, defaults],
  )

  const query = useQuery({ ...siteContentQuery, select })

  // Stable identity: the editors keep a dismissed error snackbar closed by
  // comparing the failure they showed against the current one, so a fresh
  // Error object each render would reopen it forever.
  const missingError = useMemo(() => new MissingPageError(pageId), [pageId])

  // Reported through `error` rather than thrown from `select`, so the failure
  // reaches callers the same way a transport failure does.
  if (query.data === MISSING) {
    return { ...query, data: undefined, error: missingError, isError: true, isSuccess: false }
  }

  return query
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
