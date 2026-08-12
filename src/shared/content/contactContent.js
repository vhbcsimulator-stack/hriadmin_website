import { fetchPageContent, persistPageContent } from '@content-backend'

export const CONTACT_PAGE_ID = 'contact'

// Editable copy for the public Contact page. Contact-info icons are Google
// Material Symbols names (see fonts.google.com/icons). Social links keep their
// brand logos (mapped from `network` in code, since Material Symbols has no
// brand marks) and only expose the URL for editing.
export const contactContentData = {
  hero: {
    eyebrow: 'Contact Us',
    title: 'Get in Touch',
    subtitle:
      'Have a question about a property or want to speak with a specialist? Send us a message and our team will get back to you.',
  },
  inquiry: {
    heading: 'Send an Inquiry',
    description:
      'Tell us what you are looking for, and one of our property specialists will assist you with available homes, project details, and site-viewing options.',
    info: [
      { icon: 'place', label: 'Office', value: 'Royale Tagaytay Estates, Brgy. Upli, Alfonso, Cavite' },
      { icon: 'call', label: 'Direct Line', value: '+63 912 xxx xxxx' },
      { icon: 'mail', label: 'Email', value: 'info@hermosaresidences.com' },
      { icon: 'schedule', label: 'Office Hours', value: 'Mon – Sat, 9:00 AM – 6:00 PM' },
    ],
    socialsLabel: 'Connect with Us',
    socials: [
      { network: 'facebook', href: '#' },
      { network: 'instagram', href: '#' },
    ],
  },
  map: {
    embedSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3869.9969170953236!2d120.86333407610086!3d14.077359189670728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd9db752ac4c17%3A0x7742a43ec20c6334!2sVHBC%20Office!5e0!3m2!1sen!2sph!4v1784881206140!5m2!1sen!2sph',
  },
  faq: {
    title: 'Frequently Asked Questions',
    items: [
      { q: 'How can I inquire about a property?', a: 'Simply fill out the inquiry form above or reach us through our direct line. One of our property specialists will get back to you with available options and details.' },
      { q: 'Can I schedule a property viewing?', a: 'Yes. Let us know your preferred date and property in your message, and our team will coordinate a convenient site-viewing schedule with you.' },
      { q: 'What property options are available?', a: 'We offer residential, commercial, farm, and leisure properties across selected locations in Batangas, Cavite, and Pangasinan.' },
      { q: 'What information should I prepare before inquiring?', a: 'It helps to have your preferred location, property type, budget range, and intended timeline ready so we can recommend the best-suited options.' },
    ],
  },
}

export const getContactContent = () => fetchPageContent(CONTACT_PAGE_ID, contactContentData)

export const saveContactContent = (content) => persistPageContent(CONTACT_PAGE_ID, content)
