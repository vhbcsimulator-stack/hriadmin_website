// Body content for the legal and sitemap pages is a list of blocks, so an
// editor can mix paragraphs and bullet lists in any order within one section.
//
//   { type: 'paragraph', text: '…' }
//   { type: 'bullets',   items: ['…', '…'] }
//
// Both pages predate this model — legal sections held a single `copy` string
// and sitemap groups held a `links` array — and content saved in that shape is
// already live in Supabase. `toBlocks` converts those on read, so old content
// keeps rendering and is migrated the next time an editor saves the page.

export const PARAGRAPH = 'paragraph'
export const BULLETS = 'bullets'

export const newParagraph = (text = 'New paragraph.') => ({ type: PARAGRAPH, text })

export const newBullets = (items = ['First point']) => ({ type: BULLETS, items })

// A section's blocks, converting either legacy shape when `blocks` is absent.
export const toBlocks = (section) => {
  if (Array.isArray(section?.blocks)) return section.blocks
  if (typeof section?.copy === 'string' && section.copy.trim()) {
    return [newParagraph(section.copy)]
  }
  if (Array.isArray(section?.links) && section.links.length) {
    return [newBullets(section.links.map((link) => link.label))]
  }
  return []
}

// The section with a guaranteed `blocks` array and the superseded fields
// dropped, so an edited section is never saved back in a half-migrated shape.
export const withBlocks = (section) => {
  const next = { ...section, blocks: toBlocks(section) }
  delete next.copy
  delete next.links
  return next
}
