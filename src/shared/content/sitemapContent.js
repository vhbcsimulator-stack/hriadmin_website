import { fetchPageContent, persistPageContent } from '@content-backend'
import { newBullets, withBlocks } from './blocks'

export const SITEMAP_PAGE_ID = 'sitemap'

// Editable content for the Sitemap page. Each group's body is a list of blocks
// — see ./blocks.js — so an editor can mix paragraphs and bullet lists. These
// are the fallbacks the site renders before (or without) any saved content.
export const sitemapContentData = {
  eyebrow: 'Explore',
  title: 'Sitemap',
  subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  // Extra hero paragraphs added in the admin editor. Empty by default so no
  // unapproved copy reaches a live banner.
  heroParagraphs: [],
  intro: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  groups: [
    {
      title: 'Main Pages',
      blocks: [newBullets(['Home', 'About Us', 'Projects', 'Contact Us'])],
    },
    {
      title: 'Legal',
      blocks: [newBullets(['Privacy Policy', 'Terms of Service', 'Cookie Policy'])],
    },
  ],
}

// Content saved before the block model still has `links` arrays on its groups.
// Normalising on read means both the public page and the editor only ever deal
// in blocks.
export const normalizeSitemapContent = (content) => ({
  ...content,
  groups: (content?.groups || []).map(withBlocks),
})

export const getSitemapContent = () => fetchPageContent(SITEMAP_PAGE_ID, sitemapContentData)

export const saveSitemapContent = (content) => persistPageContent(SITEMAP_PAGE_ID, content)
