import { fetchPageContent, persistPageContent } from '@content-backend'

export const ABOUT_PAGE_ID = 'about'

// Editable copy for the public About page. Icons are Google Material Symbols
// names (see fonts.google.com/icons); these are the fallback values the site
// renders before (or without) any saved content.
export const aboutContentData = {
  hero: {
    eyebrow: 'Who We Are',
    titleLead: 'Helping you find a place to',
    titleHighlight: 'call home.',
    para1:
      'At Hermosa Residences Inc. (HRI), we are committed to helping individuals and families find property opportunities that match their lifestyle, priorities, and long-term goals — guiding our clients through every step with professionalism, trust, and personalized service.',
    para2:
      'Whether you are exploring a future home, an investment property, or a space for your next business venture, HRI aims to make the experience clear, reliable, and rewarding.',
    primaryCta: 'View Our Projects',
    secondaryCta: 'Contact Us',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
  },
  coreValues: {
    title: 'Core Values',
    items: [
      { icon: 'verified', title: 'Integrity', copy: 'We uphold honesty, transparency, and accountability in every client interaction and business transaction.' },
      { icon: 'groups', title: 'Client-Focused', copy: 'We put our clients at the center of what we do by understanding their needs and offering tailored property solutions.' },
      { icon: 'shield', title: 'Reliability', copy: 'We are committed to providing dependable service, timely communication, and consistent support throughout the process.' },
      { icon: 'workspace_premium', title: 'Excellence', copy: 'We strive for high standards in service, presentation, and execution to deliver a quality experience in every engagement.' },
      { icon: 'verified_user', title: 'Professionalism', copy: 'We conduct our work with competence, respect, and dedication, ensuring every client receives the attention they deserve.' },
    ],
  },
  missionVision: {
    items: [
      { icon: 'track_changes', title: 'Mission', copy: 'To guide clients toward property opportunities with clarity, integrity, and attentive service — helping them make confident decisions and create lasting value.', tags: 'Service / Transparency / Confidence' },
      { icon: 'visibility', title: 'Vision', copy: 'To become a trusted Philippine real estate brand known for beautiful places, responsible growth, and relationships that endure.', tags: 'Trust / Growth / Opportunity' },
    ],
  },
  whatWeDo: {
    title: 'What We Do',
    description:
      'At HRI, we help clients explore property opportunities that align with their personal and financial goals. Our team provides assistance from initial inquiry to property selection, helping make the process more convenient, informative, and client-friendly.',
    items: [
      { image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80', label: 'Client Relations' },
      { image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80', label: 'Property Consultation' },
      { image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80', label: 'Site Viewing Assistance' },
      { image: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=600&q=80', label: 'Sales Support' },
      { image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80', label: 'Project Presentation' },
    ],
  },
  whyChoose: {
    title: 'Why Choose Us?',
    description:
      "HRI is committed to delivering a property experience built on trust, guidance, and client care. Here's why clients choose to work with us:",
    items: [
      { n: '01', title: 'Trusted Assistance', copy: 'We provide dependable guidance every step of the way.' },
      { n: '02', title: 'Clear Communication', copy: 'We keep clients informed with timely and straightforward updates.' },
      { n: '03', title: 'Professional Service', copy: 'Our team is committed to delivering respectful and efficient support.' },
      { n: '04', title: 'Client-Centered Approach', copy: 'We listen carefully and recommend options based on client needs.' },
      { n: '05', title: 'Quality Property Options', copy: 'We present property opportunities with value, purpose, and potential.' },
      { n: '06', title: 'Smooth Process', copy: 'We help make the property journey more organized and manageable.' },
      { n: '07', title: 'Long-Term Commitment', copy: 'We aim to build lasting relationships through reliable service and trust.' },
    ],
  },
  cta: {
    title: 'Let us help you find the right property for your goals.',
    text:
      'Whether you are looking for a future home, an investment opportunity, or a property for business use, HRI is here to guide you every step of the way.',
    button: 'Contact Us Today',
  },
}

export const getAboutContent = () => fetchPageContent(ABOUT_PAGE_ID, aboutContentData)

export const saveAboutContent = (content) => persistPageContent(ABOUT_PAGE_ID, content)
