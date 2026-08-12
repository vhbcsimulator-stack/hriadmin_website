import { fetchPageContent, persistPageContent } from '@content-backend'
import { newBullets, newParagraph, withBlocks } from './blocks'

export const LEGAL_PAGE_ID = 'legal'

// The three legal pages (Privacy, Terms, Cookies) share one editable document
// keyed by type. Each admin route edits its own branch; the public LegalPage
// renders the branch for its `type`. These are the fallbacks the site shows
// before (or without) any saved content.
//
// A section's body is a list of blocks — see ./blocks.js — so an editor can mix
// paragraphs and bullet lists freely.
export const legalContentData = {
  privacy: {
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    updated: 'Lorem ipsum dolor sit amet',
    // Extra hero paragraphs added in the admin editor. Empty by default so no
    // unapproved copy reaches a live banner.
    heroParagraphs: [],
    sections: [
      {
        heading: 'Information We Collect',
        blocks: [
          newParagraph('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'),
          newBullets([
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'Sed do eiusmod tempor incididunt ut labore et dolore.',
            'Ut enim ad minim veniam, quis nostrud exercitation.',
          ]),
        ],
      },
      { heading: 'How We Use Information', blocks: [newParagraph('Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.')] },
      { heading: 'Information Sharing', blocks: [newParagraph('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.')] },
      { heading: 'Your Rights', blocks: [newParagraph('Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.')] },
      { heading: 'Contact Us', blocks: [newParagraph('Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit.')] },
    ],
  },
  terms: {
    eyebrow: 'Legal',
    title: 'Terms of Service',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    updated: 'Lorem ipsum dolor sit amet',
    // Extra hero paragraphs added in the admin editor. Empty by default so no
    // unapproved copy reaches a live banner.
    heroParagraphs: [],
    sections: [
      { heading: 'Acceptance of Terms', blocks: [newParagraph('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')] },
      { heading: 'Use of Our Website', blocks: [newParagraph('Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.')] },
      { heading: 'Property Information', blocks: [newParagraph('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.')] },
      { heading: 'Limitation of Liability', blocks: [newParagraph('Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.')] },
      { heading: 'Changes to These Terms', blocks: [newParagraph('Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit.')] },
    ],
  },
  cookies: {
    eyebrow: 'Legal',
    title: 'Cookie Policy',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    updated: 'Lorem ipsum dolor sit amet',
    // Extra hero paragraphs added in the admin editor. Empty by default so no
    // unapproved copy reaches a live banner.
    heroParagraphs: [],
    sections: [
      { heading: 'What Are Cookies?', blocks: [newParagraph('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')] },
      { heading: 'How We Use Cookies', blocks: [newParagraph('Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.')] },
      { heading: 'Types of Cookies', blocks: [newParagraph('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.')] },
      { heading: 'Managing Cookies', blocks: [newParagraph('Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.')] },
      { heading: 'Policy Updates', blocks: [newParagraph('Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit.')] },
    ],
  },
}

// Content saved before the block model still has `copy` strings on its
// sections. Normalising on read means both the public page and the editor only
// ever deal in blocks.
export const normalizeLegalDoc = (doc) => ({
  ...doc,
  sections: (doc?.sections || []).map(withBlocks),
})

export const normalizeLegalContent = (content) => Object.fromEntries(
  Object.entries(content || {}).map(([type, doc]) => [type, normalizeLegalDoc(doc)]),
)

export const getLegalContent = () => fetchPageContent(LEGAL_PAGE_ID, legalContentData)

export const saveLegalContent = (content) => persistPageContent(LEGAL_PAGE_ID, content)
