import { fetchPageContent, persistPageContent } from '@content-backend'

export const PROJECTS_PAGE_ID = 'projects'

// One editable list of projects is the single source of truth: the admin table
// does CRUD over it, the public /projects page lists them, and each
// /project-details?slug=… page renders one entry. Feature icons are Google
// Material Symbols names (see fonts.google.com/icons).

// A full project record. `slug` is the stable id used in the URL; the listing
// fields (cover/title/status/location/summary/type) feed the table and the
// public showcase, and the nested sections feed the detail page.
function makeProject(overrides = {}) {
  return {
    slug: 'new-project',
    type: 'Residential',
    status: 'Pre-Selling',
    location: 'Location, Province',
    title: 'New Project',
    cover: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    summary: 'A short description of this community, shown in the listing and the admin table.',
    hero: {
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      subtitle: 'Explore thoughtfully planned communities designed for comfortable living, peaceful surroundings, and long-term value.',
      primaryCta: 'Book Now',
      secondaryCta: 'Explore Features',
    },
    intro: {
      eyebrow: 'A Place to Call Home',
      description: 'Explore modern homes designed for comfort, functionality, and everyday family living. View the exterior architecture, interior spaces, room layouts, and design details of each residence.',
      quote: 'Thoughtfully designed communities for better everyday living.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      details: [
        { title: 'Designed For', copy: 'Comfortable and modern family living' },
        { title: 'Community Offering', copy: 'Thoughtfully planned residential lots and shared spaces' },
      ],
    },
    gallery: {
      title: 'Gallery',
      description: 'Take a closer look at the community, natural surroundings, available property areas, planned amenities, and ongoing developments.',
      items: [
        { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', label: 'Community Exterior' },
        { src: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80', label: 'Model Home' },
        { src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', label: 'Landscaped Grounds' },
        { src: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80', label: 'Interior Living' },
      ],
    },
    features: {
      title: 'Key Features',
      items: [
        { icon: 'apartment', title: 'Modern Architecture', copy: 'A stylish exterior design with clean lines, balanced proportions, and lasting appeal.', dark: true },
        { icon: 'weekend', title: 'Spacious Interiors', copy: 'Well-planned living, dining, and bedroom areas that provide comfort for the whole family.', dark: false },
        { icon: 'grid_view', title: 'Functional Layout', copy: 'Thoughtfully arranged spaces that support convenient movement and practical daily living.', dark: false },
        { icon: 'auto_awesome', title: 'Quality Finishes', copy: 'Carefully selected materials and refined details that enhance the overall look and feel of the home.', dark: true },
      ],
    },
    inquiry: {
      title: 'Begin Your Journey Today',
      description: 'Interested in learning more about the project? Share your details, and our property specialist will assist you with available options, project information, and site-viewing arrangements.',
    },
    ...overrides,
  }
}

export const projectsContentData = {
  projects: [
    makeProject({
      slug: 'residential-communities',
      type: 'Residential',
      status: 'Ready for Occupancy',
      location: 'Alfonso, Cavite',
      title: 'Residential Communities',
      cover: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      summary: 'Build the home you envision in a thoughtfully planned community designed for comfortable living and future growth.',
    }),
    makeProject({
      slug: 'commercial-opportunities',
      type: 'Commercial',
      status: 'Pre-Selling',
      location: 'Nasugbu, Batangas',
      title: 'Commercial Opportunities',
      cover: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
      summary: 'Discover strategically positioned commercial lots suitable for businesses, rental developments, and future ventures.',
    }),
  ],
}

// Turns a title into a URL-safe slug.
export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'project'
}

// A fresh project with a slug guaranteed unique against the existing list.
export function newProject(existing = []) {
  const taken = new Set(existing.map((p) => p.slug))
  let slug = 'new-project'
  let n = 2
  while (taken.has(slug)) slug = `new-project-${n++}`
  return makeProject({ slug })
}

export const getProjectsContent = () => fetchPageContent(PROJECTS_PAGE_ID, projectsContentData)

export const saveProjectsContent = (content) => persistPageContent(PROJECTS_PAGE_ID, content)
