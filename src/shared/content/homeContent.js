import { fetchPageContent, persistPageContent } from '@content-backend'

export const HOME_PAGE_ID = 'home'

export const homeContentData = {
  hero: {
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1920&q=80',
    eyebrow: 'Hermosa Residences Inc.',
    title: 'A Property for Today.',
    titleHighlight: 'An Investment for Tomorrow.',
    subtitle:
      'Explore residential and commercial property opportunities designed to support your lifestyle, business, and long-term goals.',
    primaryCta: 'Explore Properties',
    secondaryCta: 'Learn More',
  },
  featured: {
    eyebrow: 'Curated Collection',
    title: 'Featured Projects',
    items: [
      {
        // Must match a `slug` in projectsContent.js — it picks which project
        // the card opens.
        slug: 'residential-communities',
        tag: 'Exclusive',
        title: 'Residential Communities',
        copy: 'Build the home you envision in a thoughtfully planned community designed for comfortable living and future growth.',
        tint: '#006600',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
        linkLabel: 'Explore',
      },
      {
        slug: 'commercial-opportunities',
        tag: '',
        title: 'Commercial Opportunities',
        copy: 'Discover strategically positioned commercial lots suitable for businesses, rental developments, and future ventures.',
        tint: '#0000FF',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
        linkLabel: 'Explore',
      },
    ],
  },
  whyChooseUs: {
    eyebrow: 'Why Choose Us?',
    description:
      'Finding the right property requires more than simply choosing a location. Our team provides clear information, professional assistance, and personalized guidance throughout your property journey.',
    reasons: [
      {
        icon: 'forum',
        title: 'Clear Communication',
        copy: 'Straightforward information at every step of your property journey.',
      },
      {
        icon: 'verified',
        title: 'Dependable Assistance',
        copy: 'Professional guidance you can count on from start to close.',
      },
      {
        icon: 'place',
        title: 'Purposeful Locations',
        copy: 'Sites selected for lifestyle, value, and long-term potential.',
      },
    ],
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    quote:
      'We provide a personalized property experience based on your lifestyle, priorities, and long-term plans.',
  },
  propertyFeatures: {
    watermark: 'ELITE',
    title: 'Property Features',
    description:
      'Whether you are planning a future home, a nature-inspired retreat, or a business development, HRI offers property categories suited to different needs and aspirations.',
    featuresLabel: 'Key Features',
    features: [
      { title: 'Thoughtful Design', copy: 'Functional spaces created for everyday comfort.' },
      { title: 'Refined Interiors', copy: 'Elegant details that enhance the living experience.' },
      { title: 'Peaceful Community', copy: 'A welcoming environment surrounded by natural scenery.' },
    ],
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
  },
  testimonials: {
    title: 'Testimonials',
    subtitle:
      'Every property journey is different. Here are experiences shared by clients who received assistance from our property specialists.',
    items: [
      {
        quote: 'The team answered our questions clearly and kept us updated throughout the process. Their prompt assistance made everything easier to understand.',
        name: 'Juan Dela Cruz',
        role: 'Homeowner',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
      },
      {
        quote: 'From choosing a property to completing the required documents, the process was organized and straightforward. We felt supported at every step.',
        name: 'Maria Santos',
        role: 'Investor',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
      },
      {
        quote: 'Our property specialist listened to our needs and explained the available options professionally. The guidance helped us make a more informed decision.',
        name: 'Ramon Reyes',
        role: 'First-time Buyer',
        avatar: '',
      },
    ],
  },
  cta: {
    title: 'Find the property that matches your lifestyle and investment goals.',
    text: 'Explore property opportunities for your future home, personal retreat, business plans, or long-term goals.',
    button: 'Explore our projects',
  },
}

export const getHomeContent = () => fetchPageContent(HOME_PAGE_ID, homeContentData)

export const saveHomeContent = (content) => persistPageContent(HOME_PAGE_ID, content)
