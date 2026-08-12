import { supabase, isSupabaseConfigured, IMAGE_BUCKET } from '../lib/supabaseClient'

// The single seam between "user picked a file" and "content JSON holds a URL".
//
//   async uploadImage(File) -> string (a URL usable as an <img> src)
//   throws Error(message) on failure, with a message fit to show the user
//
// With Supabase configured the file goes to the `site-images` bucket and the
// content document stores its public URL. Without it, the file is inlined as a
// data URL — the editor still works end to end, at the cost of a very fat
// site-content.json.

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024

export const ACCEPTED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/svg+xml',
]

// The `accept` attribute for file inputs.
export const ACCEPT_ATTR = ACCEPTED_IMAGE_TYPES.join(',')

function formatMb(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`
}

// Returns a human-readable problem, or '' when the file is acceptable.
export function validateImageFile(file) {
  if (!file) return 'No file selected.'
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return 'Unsupported file type — use PNG, JPEG, WebP, GIF, AVIF or SVG.'
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return `That image is ${formatMb(file.size)} — the limit is ${formatMb(MAX_UPLOAD_BYTES)}.`
  }
  return ''
}

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Could not read that file.'))
    reader.readAsDataURL(file)
  })
}

// Pulls the first image out of a drag event, whether the browser reports it as
// a file or (dragging between tabs) as a URL.
export function imageFromDataTransfer(dataTransfer) {
  const file = [...(dataTransfer.files || [])].find((f) => f.type.startsWith('image/'))
  if (file) return { file }
  const url = dataTransfer.getData('text/uri-list') || dataTransfer.getData('text/plain')
  return url ? { url: url.trim() } : {}
}

// Object keys are unique per upload, so nothing ever overwrites an image that
// another page might still reference.
function storagePath(file) {
  const extension = (file.name.split('.').pop() || 'jpg').toLowerCase()
  return `${Date.now()}-${crypto.randomUUID()}.${extension}`
}

export async function uploadImage(file) {
  const problem = validateImageFile(file)
  if (problem) throw new Error(problem)

  if (!isSupabaseConfigured) return readAsDataUrl(file)

  const path = storagePath(file)
  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, file, { cacheControl: '31536000', upsert: false, contentType: file.type })
  if (error) throw new Error(`Upload failed: ${error.message}`)

  return supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl
}
