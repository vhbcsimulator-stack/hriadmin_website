import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import contentSnapshot from '../../content/site-content.json'
import './content-manager.css'

const EDITABLE_SELECTOR = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'button', 'label',
  'a', 'li', '[role="button"]', '.MuiChip-label',
].join(',')

const cleanPath = (pathname) => pathname.replace(/\/+$/, '') || '/'

function getEditableElements() {
  return [...document.querySelectorAll(EDITABLE_SELECTOR)].filter((element) => {
    if (element.closest('[data-cms-ui]')) return false
    if (!element.textContent.trim()) return false
    return element.children.length === 0
  })
}

function indexPageElements() {
  return getEditableElements().map((element, index) => {
    element.dataset.cmsKey = String(index)
    return element
  })
}

function indexPageImages() {
  return [...document.querySelectorAll('img, body *')].filter((element) => {
    if (element.closest('[data-cms-ui]')) return false
    return element.tagName === 'IMG' || window.getComputedStyle(element).backgroundImage.includes('url(')
  }).map((element, index) => {
    element.dataset.cmsImageKey = String(index)
    return element
  })
}

function applyPageContent(content, pathname) {
  const page = content.pages?.[pathname]
  if (!page) return
  indexPageElements().forEach((element) => {
    const replacement = page[element.dataset.cmsKey]
    if (typeof replacement === 'string') element.textContent = replacement
  })
  indexPageImages().forEach((element) => {
    const replacement = page.__images?.[element.dataset.cmsImageKey]
    if (!replacement) return
    if (element.tagName === 'IMG') element.src = replacement
    else element.style.backgroundImage = `url("${replacement}")`
  })
}

async function loadContent() {
  try {
    const response = await fetch('/api/content', { cache: 'no-store' })
    if (response.ok) return response.json()
  } catch {
    // A static deployment uses the snapshot imported during the build.
  }
  return contentSnapshot
}

export default function ContentManager() {
  const location = useLocation()
  const pathname = cleanPath(location.pathname)
  const editMode = new URLSearchParams(location.search).get('edit') === '1'
  const contentRef = useRef(contentSnapshot)
  const [status, setStatus] = useState('')

  useEffect(() => {
    let cancelled = false
    const timer = window.setTimeout(async () => {
      const content = await loadContent()
      if (cancelled) return
      contentRef.current = content
      applyPageContent(content, pathname)
      if (editMode) {
        indexPageElements().forEach((element) => {
          element.contentEditable = 'true'
          element.spellcheck = true
          element.classList.add('cms-editable')
        })
        indexPageImages().forEach((element) => {
          element.classList.add('cms-editable-image')
          element.ondblclick = () => {
            const current = element.tagName === 'IMG'
              ? element.src
              : window.getComputedStyle(element).backgroundImage.replace(/^url\(["']?|["']?\)$/g, '')
            const replacement = window.prompt('Paste the new image URL:', current)
            if (!replacement) return
            if (element.tagName === 'IMG') element.src = replacement
            else element.style.backgroundImage = `url("${replacement}")`
          }
        })
      }
    }, 120)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      document.querySelectorAll('.cms-editable').forEach((element) => {
        element.contentEditable = 'false'
        element.classList.remove('cms-editable')
      })
      document.querySelectorAll('.cms-editable-image').forEach((element) => {
        element.classList.remove('cms-editable-image')
        element.ondblclick = null
      })
    }
  }, [pathname, editMode])

  useEffect(() => {
    if (editMode) return undefined
    let lastUpdated = contentRef.current.updatedAt
    const interval = window.setInterval(async () => {
      const content = await loadContent()
      if (content.updatedAt === lastUpdated) return
      lastUpdated = content.updatedAt
      contentRef.current = content
      applyPageContent(content, pathname)
    }, 2000)
    return () => window.clearInterval(interval)
  }, [pathname, editMode])

  if (!editMode) return null

  const save = async () => {
    const next = structuredClone(contentRef.current)
    const page = {}
    indexPageElements().forEach((element) => {
      page[element.dataset.cmsKey] = element.textContent.trim()
    })
    page.__images = {}
    indexPageImages().forEach((element) => {
      const value = element.tagName === 'IMG'
        ? element.src
        : window.getComputedStyle(element).backgroundImage.replace(/^url\(["']?|["']?\)$/g, '')
      page.__images[element.dataset.cmsImageKey] = value
    })
    next.pages[pathname] = page
    setStatus('Saving…')

    try {
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      })
      if (!response.ok) throw new Error('The local content service is unavailable.')
      contentRef.current = await response.json()
      setStatus('Saved')
      window.parent.postMessage({ type: 'hri-content-saved', pathname }, '*')
    } catch (error) {
      setStatus(error.message)
    }
  }

  return (
    <aside className="cms-toolbar" data-cms-ui>
      <div>
        <strong>Editing {pathname === '/' ? 'Home' : pathname}</strong>
        <span>Edit highlighted text. Double-click outlined images to replace their URL.</span>
      </div>
      {status && <span className="cms-status">{status}</span>}
      <button type="button" onClick={() => window.location.reload()}>Discard</button>
      <button type="button" className="cms-save" onClick={save}>Save changes</button>
    </aside>
  )
}
