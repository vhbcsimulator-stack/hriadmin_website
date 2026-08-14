import { fetchPageContent, persistPageContent } from '@content-backend'
import { newBullets, newParagraph, withBlocks } from './blocks'

export const LEGAL_PAGE_ID = 'legal'

// The three legal pages (Privacy, Terms, Cookies) share one editable document
// keyed by type. Each admin route edits its own branch; the public LegalPage
// renders the branch for its `type`. These are the fallbacks the site shows
// before (or without) any saved content, so they are kept in step with the
// approved copy in Supabase — a field an editor clears must never fall back to
// placeholder text on a legal page. Refresh from the live rows with
// `npm run pull:content`, then re-run this file's generator if the rows change.
//
// A section's body is a list of blocks — see ./blocks.js — so an editor can mix
// paragraphs and bullet lists freely.
export const legalContentData = {
  privacy: {
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    subtitle: 'Hermosa Residences Inc. respects your privacy and is committed to protecting the personal information you share with us through our website and other official communication channels.',
    updated: 'July 30, 2026',
    heroParagraphs: [
      'Hermosa Residences Inc. (“HRI,” “we,” “us,” or “our”) collects and processes personal information in accordance with applicable Philippine data privacy laws.',
      'This Privacy Policy explains what information we collect, how we use and share it, how long we retain it, and the rights available to individuals whose personal information we process.',
      'By using our website or voluntarily submitting your personal information, you acknowledge the practices described in this Privacy Policy.',
    ],
    sections: [
      {
        heading: 'Information We Collect',
        blocks: [
          newParagraph('We may collect information that you voluntarily provide when you:'),
          newBullets([
            'Submit a contact or property inquiry form',
            'Request information about our residential communities',
            'Ask for a property computation',
            'Schedule a consultation or site viewing',
            'Communicate with us through email, telephone, social media, or messaging platforms',
          ]),
          newParagraph('The information we collect may include:'),
          newBullets([
            'Full name',
            'Email address',
            'Mobile or telephone number',
            'Residential address or general location',
            'Preferred residential community or property',
            'Preferred lot type, size, or payment option',
            'Inquiry, message, or appointment details',
            'Documents required for a reservation or property transaction',
            'Other information you voluntarily provide',
          ]),
          newParagraph('When you visit our website, certain technical information may also be collected automatically, including:'),
          newBullets([
            'IP address',
            'Browser and device type',
            'Operating system',
            'Pages viewed',
            'Date and time of access',
            'Referring website or advertisement',
            'Cookie and analytics information',
          ]),
          newParagraph('Please do not submit sensitive personal information unless it is specifically requested and necessary for a legitimate purpose.'),
        ],
      },
      {
        heading: 'How We Use Information',
        blocks: [
          newParagraph('HRI may use your personal information to:'),
          newBullets([
            'Respond to your questions and requests',
            'Provide information about our residential communities',
            'Connect you with an authorized property representative',
            'Prepare requested property estimates or computations',
            'Schedule consultations, presentations, and site viewings',
            'Process reservations, purchases, payments, and documents',
            'Confirm your identity and transaction details',
            'Provide customer service and after-sales assistance',
            'Send project announcements, updates, and promotional communications',
            'Improve our website, content, services, and customer experience',
            'Measure website traffic and advertising performance',
            'Detect fraud, misuse, and security threats',
            'Maintain business, accounting, and transaction records',
            'Comply with legal and regulatory requirements',
            'Establish, exercise, or defend legal claims',
          ]),
          newParagraph('We process personal information only when there is an appropriate basis, such as your consent, the performance of a contract, compliance with a legal obligation, or a legitimate business purpose permitted by law.'),
          newParagraph('You may withdraw your consent to receive promotional communications at any time by using the unsubscribe option provided or by contacting us directly.'),
        ],
      },
      {
        heading: 'Information Sharing',
        blocks: [
          newParagraph('HRI does not sell or rent your personal information.'),
          newParagraph('We may disclose necessary information to:'),
          newBullets([
            'Authorized HRI employees and departments',
            'Authorized property specialists, brokers, and sales representatives',
            'Affiliated companies involved in the selected residential community',
            'Property owners, developers, or project partners involved in a transaction',
            'Website hosting and information technology providers',
            'Customer relationship management and communication platforms',
            'Analytics, advertising, and social media service providers',
            'Banks, payment processors, accountants, auditors, and legal advisers',
            'Other parties when disclosure is required or permitted by law',
          ]),
          newParagraph('We require service providers handling personal information on our behalf to use it only for authorized purposes and to apply appropriate confidentiality and security measures.'),
          newParagraph('Some technology service providers may process or store information outside the Philippines. When applicable, HRI will take reasonable steps to ensure that the transferred information remains appropriately protected.'),
        ],
      },
      {
        heading: 'Data Security',
        blocks: [
          newParagraph('HRI uses reasonable organizational, physical, and technical safeguards designed to protect personal information against:'),
          newBullets([
            'Unauthorized access',
            'Accidental or unlawful disclosure',
            'Alteration or misuse',
            'Loss or destruction',
            'Fraudulent activity',
            'Other unlawful forms of processing',
          ]),
          newParagraph('Our safeguards may include access controls, secured systems, confidentiality requirements, data backups, employee training, and regular reviews of our privacy and security practices.'),
          newParagraph('However, no website, electronic transmission, or storage system can be guaranteed to be completely secure. You are encouraged to protect your devices, accounts, passwords, and personal documents.'),
          newParagraph('Please notify us immediately if you receive suspicious communications, unauthorized payment instructions, or messages from someone falsely claiming to represent HRI.'),
        ],
      },
      {
        heading: 'Data Retention',
        blocks: [
          newParagraph('We retain personal information only for as long as reasonably necessary to:'),
          newBullets([
            'Respond to your inquiry',
            'Complete a property transaction',
            'Provide customer service',
            'Maintain business and transaction records',
            'Resolve disputes',
            'Enforce agreements',
            'Comply with legal, tax, accounting, and regulatory requirements',
          ]),
          newParagraph('When personal information is no longer required, it will be securely deleted, anonymized, destroyed, or disposed of in accordance with our internal procedures and applicable requirements.'),
        ],
      },
      {
        heading: 'Your Rights',
        blocks: [
          newParagraph('Subject to applicable laws and reasonable verification requirements, you may have the right to:'),
          newBullets([
            'Be informed about how your personal information is processed',
            'Request access to personal information held about you',
            'Correct inaccurate, incomplete, or outdated information',
            'Object to certain processing activities',
            'Withdraw previously provided consent',
            'Request the erasure or blocking of information when legally permitted',
            'File a complaint with the National Privacy Commission',
            'Seek compensation when you suffer damage because of unlawful processing',
          ]),
          newParagraph('To exercise any of these rights, please contact our Data Protection Officer.'),
          newParagraph('We may ask for information or documents needed to verify your identity and protect your information from unauthorized requests. Certain requests may be limited or denied when retention or processing is required by law or necessary for valid legal purposes.'),
        ],
      },
      {
        heading: 'Cookies and Tracking Technologies',
        blocks: [
          newParagraph('Our website may use cookies, pixels, analytics tools, and similar technologies to:'),
          newBullets([
            'Operate essential website features',
            'Remember visitor preferences',
            'Understand website activity',
            'Measure page and campaign performance',
            'Improve website content and functionality',
            'Deliver relevant advertising',
          ]),
          newParagraph('You may manage non-essential cookies through our cookie preference tool or your browser settings.'),
          newParagraph('For more information, please review our Cookie Policy.'),
        ],
      },
      {
        heading: 'Third-Party Websites',
        blocks: [
          newParagraph('Our website may contain links to social media platforms, map services, payment providers, partner websites, or other third-party resources.'),
          newParagraph('HRI does not control the privacy, security, or content practices of external websites. We encourage you to review their respective privacy policies before submitting personal information.'),
        ],
      },
      {
        heading: 'Privacy of Minors',
        blocks: [
          newParagraph('The HRI website and property services are not intentionally directed toward individuals below eighteen years old.'),
          newParagraph('When information concerning a minor is required for a legitimate transaction, it must be provided by or with the authority of the minor’s parent, legal guardian, or authorized representative.'),
        ],
      },
      {
        heading: 'Policy Updates',
        blocks: [
          newParagraph('HRI may update this Privacy Policy to reflect changes in:'),
          newBullets([
            'Our website and services',
            'Residential community offerings',
            'Business and data-processing practices',
            'Technology service providers',
            'Legal or regulatory requirements',
          ]),
          newParagraph('The revised policy will be posted on this page with an updated “Last Updated” date.'),
          newParagraph('We encourage you to review this page periodically to remain informed about how we process and protect personal information.'),
        ],
      },
      {
        heading: 'Contact Us',
        blocks: [
          newParagraph('For questions, concerns, requests, or complaints regarding this Privacy Policy or the processing of your personal information, please contact:'),
          newBullets([
            'Hermosa Residences Inc.',
            'Data Protection Officer',
          ]),
          newParagraph('Office Address: '),
          newParagraph('Email Address:'),
          newParagraph('Contact Number:'),
          newParagraph('Please include your full name, contact information, the nature of your request, and any relevant details that will help us address your concern.'),
        ],
      },
    ],
  },
  terms: {
    eyebrow: 'Legal',
    title: 'Terms of Service',
    subtitle: 'These Terms of Service govern your access to and use of the Hermosa Residences Inc. website, including its residential community pages, inquiry forms, digital content, and related online services.',
    updated: 'July 30, 2026',
    heroParagraphs: [],
    sections: [
      {
        heading: 'Acceptance of Terms',
        blocks: [
          newParagraph('By accessing, browsing, or using this website, you confirm that you have read, understood, and agreed to these Terms of Service and our Privacy Policy.'),
          newParagraph('If you do not agree with these Terms, please discontinue your use of the website.'),
          newParagraph('You must be at least eighteen years old or use the website under the supervision of a parent or legal guardian. When submitting information on behalf of another person, business, or organization, you confirm that you are authorized to do so.'),
          newParagraph('Submitting an inquiry, requesting a property computation, or scheduling a site viewing does not automatically create a reservation, buyer-seller relationship, or legally binding property transaction.'),
          newParagraph('A property transaction becomes binding only after the required parties have completed and accepted the applicable official documents, payments, approvals, and transaction requirements.'),
        ],
      },
      {
        heading: 'Use of Our Website',
        blocks: [
          newParagraph('Hermosa Residences Inc. (“HRI,” “we,” “us,” or “our”) grants you a limited, non-exclusive, non-transferable, and revocable right to use this website for lawful and personal purposes.'),
          newParagraph('You may use the website to:'),
          newBullets([
            'Learn more about HRI',
            'Explore our residential communities',
            'Review project information',
            'Request property details or computations',
            'Submit a legitimate inquiry',
            'Schedule a consultation or site viewing',
            'Contact an authorized HRI representative',
            'Apply for available career opportunities',
          ]),
          newParagraph('When using the website, you agree to provide accurate, complete, and current information.'),
          newParagraph('You must not:'),
          newBullets([
            'Use the website for unlawful or fraudulent purposes',
            'Submit false, misleading, or unauthorized information',
            'Impersonate another person or misrepresent your identity',
            'Attempt to access restricted website areas, systems, or databases',
            'Introduce viruses, malware, automated scripts, or harmful code',
            'Copy, scrape, harvest, or extract website content without authorization',
            'Interfere with the security, availability, or proper operation of the website',
            'Use HRI’s name, logo, content, or project materials without permission',
            'Represent yourself as an employee, agent, broker, salesperson, or authorized representative of HRI without written authorization',
            'Use website content to create misleading or unauthorized property advertisements',
          ]),
          newParagraph('HRI may restrict or suspend access when we reasonably believe that a user has violated these Terms or engaged in activities that may harm the website, HRI, our clients, or another party.'),
        ],
      },
      {
        heading: 'Property Information',
        blocks: [
          newParagraph('Information about residential communities and properties displayed on this website is provided for general informational and marketing purposes.'),
          newParagraph('This information may include:'),
          newBullets([
            'Project descriptions',
            'Property locations',
            'Lot sizes and classifications',
            'Community amenities',
            'Development plans',
            'Prices and payment options',
            'Availability',
            'Maps and accessibility information',
            'Photographs, videos, illustrations, and architectural renderings',
            'Estimated property computations',
            'Development and construction updates',
          ]),
          newParagraph('Property information may be corrected, updated, replaced, or changed without prior notice, subject to applicable law.'),
          newParagraph('Prices, discounts, promotions, lot sizes, payment terms, and property availability must be confirmed with an authorized HRI representative. A property shown as available may have already been reserved, placed on hold, sold, or otherwise become unavailable before the website is updated.'),
          newParagraph('Computations provided through the website or in response to an online inquiry are estimates unless they are clearly identified as official and approved computations.'),
        ],
      },
      {
        heading: 'Images, Renderings, and Development Plans',
        blocks: [
          newParagraph('Images, architectural renderings, illustrations, maps, videos, floor plans, and development plans displayed on the website are intended to provide a general representation of a project.'),
          newParagraph('Actual project conditions may differ in terms of:'),
          newBullets([
            'Building design',
            'Materials and finishes',
            'Landscaping',
            'Property dimensions',
            'Views and surroundings',
            'Road layouts',
            'Amenities and facilities',
            'Construction schedules',
            'Furnishings and decorative elements',
          ]),
          newParagraph('Project features may be modified when reasonably necessary to comply with engineering, architectural, safety, legal, regulatory, or operational requirements.'),
          newParagraph('Only information contained in official and approved project documents should be relied upon when completing a property transaction.'),
        ],
      },
      {
        heading: 'No Binding Offer or Reservation',
        blocks: [
          newParagraph('Website content does not constitute a binding offer, reservation agreement, contract to sell, deed of sale, warranty, or guarantee.'),
          newParagraph('The following actions do not automatically reserve or secure a property:'),
          newBullets([
            'Completing an online inquiry form',
            'Requesting a property computation',
            'Sending a message to HRI',
            'Expressing interest in a property',
            'Scheduling a presentation or site viewing',
            'Receiving preliminary project information',
          ]),
          newParagraph('A property may be reserved or purchased only after:'),
          newBullets([
            'Availability has been officially confirmed',
            'The client has completed the required verification process',
            'Applicable reservation or transaction documents have been completed',
            'The required payment has been made through an authorized payment channel',
            'The reservation has been accepted by the authorized seller, project owner, or developer',
            'Other applicable requirements have been satisfied',
          ]),
          newParagraph('In case of any inconsistency between the website and a signed official transaction document, the signed document will govern, subject to applicable law.'),
        ],
      },
      {
        heading: 'Project Ownership and Regulatory Information',
        blocks: [
          newParagraph('The project owner, developer, seller, or other responsible entity for each residential community will be identified in the applicable official project documents.'),
          newParagraph('Where required, regulated real estate projects are subject to government registration, approval, advertising, and licensing requirements.'),
          newParagraph('Before completing a reservation or purchase, prospective buyers should request and review applicable documents, which may include:'),
          newBullets([
            'Certificate of Registration',
            'License to Sell',
            'Approved development plans',
            'Reservation agreement',
            'Contract to Sell',
            'Deed of Absolute Sale',
            'Official property computation',
            'Applicable project disclosures',
          ]),
          newParagraph('You may request available project and regulatory documents from an authorized HRI representative.'),
        ],
      },
      {
        heading: 'Payments and Authorized Representatives',
        blocks: [
          newParagraph('Before making any payment, confirm the identity and authority of the person assisting you and verify the payment instructions through HRI’s official communication channels.'),
          newParagraph('Payments should only be made through authorized accounts and payment methods stated in official transaction documents.'),
          newParagraph('HRI is not responsible for payments sent to unauthorized individuals, personal accounts, or fraudulent parties falsely claiming to represent HRI, except where liability cannot legally be excluded.'),
          newParagraph('Immediately report suspicious payment instructions, unauthorized advertisements, or persons falsely representing themselves as connected with HRI.'),
        ],
      },
      {
        heading: 'Intellectual Property',
        blocks: [
          newParagraph('Unless otherwise stated, the website and its content are owned by, licensed to, or used with permission by HRI.'),
          newParagraph('Protected content may include:'),
          newBullets([
            'Company and project names',
            'Logos and trademarks',
            'Website text and articles',
            'Property photographs and videos',
            'Architectural designs and renderings',
            'Maps, graphics, brochures, and layouts',
            'Marketing and promotional materials',
            'Website design, software, and source code',
          ]),
          newParagraph('You may view or print reasonable portions of publicly available content for personal property evaluation.'),
          newParagraph('You may not reproduce, modify, publish, sell, commercially use, distribute, or present website content as your own without written permission from HRI or the applicable rights holder.'),
        ],
      },
      {
        heading: 'Information Submitted by Users',
        blocks: [
          newParagraph('You are responsible for ensuring that the information you provide through the website is accurate, lawful, and not misleading.'),
          newParagraph('When submitting another person’s personal information, you confirm that you have the appropriate authority or consent to provide it.'),
          newParagraph('Personal information submitted through the website will be processed in accordance with our Privacy Policy and applicable data privacy requirements.'),
        ],
      },
      {
        heading: 'Third-Party Websites and Services',
        blocks: [
          newParagraph('The website may contain links to external websites and services, including:'),
          newBullets([
            'Social media platforms',
            'Interactive maps',
            'Messaging applications',
            'Payment providers',
            'Partner websites',
          ]),
          newParagraph('These links are provided for convenience. HRI does not control the content, availability, security, privacy practices, or terms of third-party websites.'),
          newParagraph('Your use of an external website or service is subject to the policies and terms established by that third party.'),
        ],
      },
      {
        heading: 'Website Availability',
        blocks: [
          newParagraph('HRI aims to keep the website accessible, secure, and accurate. However, we do not guarantee that the website will always be uninterrupted, completely secure, error-free, or available at all times.'),
          newParagraph('Website access may be temporarily suspended or limited because of:'),
          newBullets([
            'System maintenance',
            'Website updates',
            'Technical problems',
            'Security concerns',
            'Internet or service-provider interruptions',
            'Events beyond our reasonable control',
          ]),
          newParagraph('HRI may modify, remove, suspend, or discontinue website content or features when reasonably necessary.'),
        ],
      },
      {
        heading: 'Disclaimer',
        blocks: [
          newParagraph('The website and its content are provided on an “as available” basis.'),
          newParagraph('To the extent permitted by law, HRI does not guarantee that:'),
          newBullets([
            'All website information will always be complete or current',
            'Every displayed property will remain available',
            'Renderings will exactly represent completed project conditions',
            'Estimated prices or computations will remain unchanged',
            'Development or completion schedules will not change',
            'The website will be free from errors or technical interruptions',
            'Website content will meet every visitor’s individual needs',
          ]),
          newParagraph('Nothing on the website should be considered legal, tax, financial, engineering, architectural, or investment advice.'),
          newParagraph('Prospective buyers should conduct appropriate due diligence, review official documents, inspect the property when possible, and seek independent professional advice before entering into a transaction.'),
        ],
      },
      {
        heading: 'Limitation of Liability',
        blocks: [
          newParagraph('To the fullest extent allowed by law, HRI and its directors, officers, employees, authorized representatives, affiliates, contractors, and service providers will not be responsible for indirect, incidental, special, consequential, or punitive damages arising from:'),
          newBullets([
            'Access to or use of the website',
            'Inability to access the website',
            'Reliance on preliminary or unconfirmed website information',
            'Changes in property availability, prices, or project details',
            'Technical interruptions, errors, or data loss beyond our reasonable control',
            'Third-party websites, platforms, or services',
            'Communications or transactions involving unauthorized individuals',
            'Unauthorized access caused by a user’s failure to protect their device or account',
          ]),
          newParagraph('Nothing in these Terms excludes or limits any liability or legal right that cannot be excluded under applicable Philippine law.'),
        ],
      },
      {
        heading: 'Indemnification',
        blocks: [
          newParagraph('To the extent permitted by law, you agree to be responsible for claims, losses, damages, or reasonable expenses directly resulting from:'),
          newBullets([
            'Your unlawful use of the website',
            'Your material violation of these Terms',
            'Your infringement of another person’s rights',
            'False, fraudulent, or unauthorized information submitted by you',
            'Harmful code or deliberate attacks introduced through your device or account',
          ]),
          newParagraph('This provision does not apply to losses caused by HRI’s own fraud, willful misconduct, gross negligence, or violation of applicable law.'),
        ],
      },
      {
        heading: 'Governing Law',
        blocks: [
          newParagraph('These Terms are governed by the laws of the Republic of the Philippines.'),
          newParagraph('The parties are encouraged to attempt to resolve concerns in good faith by contacting HRI before initiating formal proceedings.'),
          newParagraph('Unresolved disputes may be submitted to the court, administrative agency, regulatory authority, or dispute-resolution body with proper jurisdiction.'),
          newParagraph('Nothing in these Terms prevents a buyer, consumer, or website user from exercising rights and remedies available under applicable consumer, real estate, electronic commerce, data privacy, and other mandatory laws.'),
        ],
      },
      {
        heading: 'Changes to These Terms',
        blocks: [
          newParagraph('HRI may update these Terms to reflect changes in:'),
          newBullets([
            'Website features and services',
            'Residential community offerings',
            'Business operations',
            'Technology and security practices',
            'Legal and regulatory requirements',
          ]),
          newParagraph('The revised Terms will be posted on this page with an updated “Last Updated” date.'),
          newParagraph('Your continued use of the website after the revised Terms are published constitutes your acceptance of the updated Terms, to the extent permitted by law.'),
        ],
      },
      {
        heading: 'Contact Us',
        blocks: [
          newParagraph('For questions, concerns, or reports regarding these Terms or your use of the website, please contact:'),
          newBullets([
            'Hermosa Residences Inc.',
          ]),
          newParagraph('Office Address: '),
          newParagraph('Email Address: '),
          newParagraph('Contact Number: '),
          newBullets([

          ]),
          newParagraph('Office Hours: '),
          newParagraph('When submitting a property-related concern, include your full name, contact details, residential community or project name, property information, and a brief explanation of your concern.'),
        ],
      },
    ],
  },
  cookies: {
    eyebrow: 'Legal',
    title: 'Cookie Policy',
    subtitle: 'Hermosa Residences Inc. uses cookies and similar technologies to support essential website functions, understand how visitors use our website, and improve the overall browsing experience.',
    updated: 'July 30, 2026',
    heroParagraphs: [],
    sections: [
      {
        heading: 'What Are Cookies?',
        blocks: [
          newParagraph('Cookies are small text files stored on your computer, mobile phone, tablet, or other device when you visit a website.'),
          newParagraph('They help websites recognize your device, remember certain preferences, maintain website functionality, and collect information about how visitors interact with different pages.'),
          newParagraph('Cookies may be temporary and automatically removed when you close your browser, or they may remain on your device for a specific period until they expire or are manually deleted.'),
          newParagraph('We may also use similar technologies, including tracking pixels, tags, scripts, local storage, and web beacons.'),
        ],
      },
      {
        heading: 'How We Use Cookies',
        blocks: [
          newParagraph('Hermosa Residences Inc. (“HRI,” “we,” “us,” or “our”) may use cookies and similar technologies to:'),
          newBullets([
            'Keep the website operating properly',
            'Maintain website security',
            'Remember visitor preferences',
            'Understand how visitors navigate the website',
            'Measure page visits and website performance',
            'Identify and resolve technical issues',
            'Improve website content, layout, and functionality',
            'Measure the effectiveness of advertisements and marketing campaigns',
            'Understand whether visitors submit inquiry or contact forms',
            'Provide relevant property and residential community information',
            'Prevent the repeated display of the same notices or cookie preferences',
          ]),
          newParagraph('Some cookies are necessary for the website to operate, while other cookies may be used only after you provide your consent.'),
        ],
      },
      {
        heading: 'Types of Cookies',
        blocks: [
          newParagraph('Strictly Necessary Cookies - These cookies are required for the basic operation and security of the website.'),
          newParagraph('They may support functions such as:'),
          newBullets([
            'Loading website pages',
            'Processing online forms',
            'Maintaining secure browsing sessions',
            'Saving cookie preferences',
            'Detecting suspicious or unauthorized activity',
          ]),
          newParagraph('Because these cookies are necessary, they cannot normally be disabled through our website’s cookie settings.'),
          newParagraph('Functional Cookies - Functional cookies allow the website to remember your choices and provide improved features.'),
          newParagraph('They may remember information such as:'),
          newBullets([
            'Language preferences',
            'Display settings',
            'Previously visited pages',
            'Selected residential communities',
            'Communication preferences',
          ]),
          newParagraph('Disabling these cookies may affect some personalized website features.'),
          newParagraph('Analytics and Performance Cookies - These cookies help us understand how visitors use the HRI website.'),
          newParagraph('They may collect information about:'),
          newBullets([
            'Pages visited',
            'Time spent on the website',
            'Buttons or links selected',
            'Website traffic sources',
            'Browser and device type',
            'Website errors and performance issues',
          ]),
          newParagraph('We use this information to improve website performance, usability, and content.'),
          newParagraph('Advertising and Targeting Cookies - Advertising cookies may help us measure the effectiveness of our promotional campaigns and display more relevant advertisements.'),
          newParagraph('They may be used to:'),
          newBullets([
            'Measure visits resulting from advertisements',
            'Understand visitor interests',
            'Create advertising audiences',
            'Limit how often an advertisement is displayed',
            'Measure property inquiries and other website actions',
            'Show relevant HRI advertisements on external platforms',
          ]),
          newParagraph('These cookies may be placed by HRI or by third-party advertising platforms.'),
          newParagraph('Third-Party Cookies - Some website features may be provided by third-party services, including:'),
          newBullets([
            'Website analytics platforms',
            'Social media platforms',
            'Online advertising services',
            'Embedded videos',
            'Interactive maps',
            'Messaging or live-chat services',
            'Website hosting and security providers',
            'Customer relationship management systems',
          ]),
          newParagraph('These third parties may place cookies on your device and process information according to their own privacy and cookie policies.'),
          newParagraph('HRI does not directly control the cookies placed by third-party providers.'),
        ],
      },
      {
        heading: 'Managing Cookies',
        blocks: [
          newParagraph('When you first visit our website, you may be shown a cookie notice or preference tool that allows you to accept, reject, or customize non-essential cookies.'),
          newParagraph('You may choose to:'),
          newBullets([
            'Accept all cookies',
            'Reject non-essential cookies',
            'Allow selected cookie categories',
            'Change or withdraw your consent',
          ]),
          newParagraph('Strictly necessary cookies may remain active because they are required for the website’s operation and security.'),
          newParagraph('You may also manage cookies through your browser settings. Most browsers allow you to:'),
          newBullets([
            'View stored cookies',
            'Block certain cookies',
            'Block third-party cookies',
            'Delete existing cookies',
            'Receive a notification before a cookie is stored',
            'Automatically delete cookies when the browser closes',
          ]),
          newParagraph('Disabling cookies may affect certain website features, including contact forms, videos, maps, saved preferences, and other interactive functions.'),
          newParagraph('Cookie settings may need to be updated separately on each browser and device you use.'),
        ],
      },
      {
        heading: 'Information Collected Through Cookies',
        blocks: [
          newParagraph('Depending on the cookies and technologies used, we may collect:'),
          newBullets([
            'IP address',
            'Browser type',
            'Device type',
            'Operating system',
            'Approximate location',
            'Referring website or advertisement',
            'Pages visited',
            'Links and buttons selected',
            'Date and time of access',
            'Time spent on the website',
            'Inquiry or form-submission activity',
          ]),
          newParagraph('Some of this information may be considered personal information when it can identify or be reasonably associated with a particular individual.'),
          newParagraph('Information collected through cookies will be processed in accordance with our Privacy Policy.'),
        ],
      },
      {
        heading: 'Cookie Retention',
        blocks: [
          newParagraph('Session cookies are generally deleted when you close your browser.'),
          newParagraph('Persistent cookies may remain on your device until they expire, are deleted through your browser settings, or are withdrawn through our cookie preference tool.'),
          newParagraph('We retain information collected through cookies only for as long as reasonably necessary for the purpose for which it was collected, subject to applicable legal, operational, security, and contractual requirements.'),
        ],
      },
      {
        heading: 'Policy Updates',
        blocks: [
          newParagraph('HRI may update this Cookie Policy when:'),
          newBullets([
            'Website features are added, removed, or modified',
            'New cookies or tracking technologies are introduced',
            'Third-party service providers are changed',
            'Our data-processing practices are updated',
            'Applicable legal or regulatory requirements change',
          ]),
          newParagraph('Any revised version will be posted on this page with an updated “Last Updated” date.'),
          newParagraph('We encourage visitors to review this Cookie Policy periodically to remain informed about how cookies and similar technologies are used.'),
        ],
      },
      {
        heading: 'Contact Us',
        blocks: [
          newParagraph('For questions, concerns, or requests regarding this Cookie Policy, please contact:'),
          newBullets([
            'Hermosa Residences Inc.',
            'Data Protection Officer',
          ]),
          newParagraph('Office Address: '),
          newParagraph('Email Address: '),
          newParagraph('Contact Number: '),
          newParagraph('Please include your name, contact details, the browser or device involved, and a brief description of your concern.'),
        ],
      },
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
