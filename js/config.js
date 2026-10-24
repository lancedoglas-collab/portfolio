/* ============================================================================
   SITE CONFIGURATION
   ----------------------------------------------------------------------------
   This is the main file to edit. Everything personal lives here: your name,
   title, intro, contact details, social links, skills and timeline entries.

   Projects live in their own file: js/projects.js

   Anything set to null is treated as "not provided yet" and the matching
   element is hidden automatically, so the layout never shows an empty slot
   or a dead link.
   ========================================================================= */

const CONFIG = {
  /* --- Identity ----------------------------------------------------------
     Shown in the hero, the navigation brand mark, the footer and the page
     title. */
  name: 'Kit Anthony Z. Lebosada',
  shortName: 'Kit Anthony',
  initials: 'KL',
  title: 'Web & Mobile Developer',
  location: 'Cebu City, Philippines',

  /* Pulsing status badge above your name in the hero. null removes the badge
     entirely; set a string here to bring it back, e.g.
     'Open to internship opportunities'. */
  availability: null,

  /* Small card that overlaps the hero photo. Set to null to remove it. */
  availabilityCard: {
    status: 'Open for Opportunities',
    detail: 'Open to internships and junior developer roles.',
    linkLabel: 'Get in touch',
    linkHref: '#contact'
  },

  /* The hero headline. Keep it short — it is set at a very large size. */
  headline: 'I build things for the web and for the people who use them.',

  /* One or two sentences under the headline. Wrap anything in **double
     asterisks** to emphasise it — useful for technology names. */
  intro:
    'Fourth-year Information Technology student at Cebu Eastern College. ' +
    'I build web applications with **Django** and **JavaScript**, mobile ' +
    'apps, and games, from a published **Google Play** app to a browser ' +
    'RPG that runs on anything with a screen.',

  /* --- Profile photo -----------------------------------------------------
     Drop your photo at the path below (a square image around 800x800 works
     best). Until that file exists, the site shows a styled monogram built
     from `initials` above — no broken image icon. */
  photo: 'assets/images/profile.jpg',
  photoAlt: 'Portrait of Kit Anthony Z. Lebosada',

  /* --- Contact -----------------------------------------------------------
     Set any of these to null to hide them. */
  email: 'lancedoglas@gmail.com',

  /* Shown in the contact section. Set to null if you would rather not
     publish a phone number on a public page. */
  phone: '0994 524 9531',

  /* --- Social links ------------------------------------------------------
     Fill these in and they appear automatically in the hero, contact section
     and footer. Left as null, they are hidden rather than linking nowhere. */
  socials: {
    github: 'https://github.com/lancedoglas-collab',
    linkedin: null,   // e.g. 'https://linkedin.com/in/yourusername'
    facebook: 'https://www.facebook.com/kitanthony.lebosada',
    instagram: null
  },

  /* --- CV ----------------------------------------------------------------
     Replace assets/cv/cv.pdf with an updated file any time; the path stays
     the same so nothing else needs changing. `cvFileName` is the name the
     browser gives the downloaded file. */
  cv: {
    path: 'assets/cv/cv.pdf',
    fileName: 'Kit-Anthony-Lebosada-CV.pdf',
    showPreview: true
  },

  /* --- About section -----------------------------------------------------
     Each string becomes its own paragraph. */
  about: {
    paragraphs: [
      'I am a fourth-year Information Technology student at Cebu Eastern ' +
        'College in Cebu City. Most of what I know about building software ' +
        'I learned by building things that other people actually use, then ' +
        'fixing everything that broke once they did.',
      'That started with mobile development. I built the front end of the ' +
        'Zoki Kasal Kain & Beauty app, which is published on the Google Play ' +
        'Store, working with the team through testing and release. Shipping ' +
        'to a real store teaches you quickly that "works on my machine" is ' +
        'not the finish line.',
      'Since then I have moved further across the stack: Python and Django ' +
        'on the server, and plain HTML, CSS and JavaScript on the front end. ' +
        'Emberfall, my browser RPG, is written in vanilla JavaScript with no ' +
        'framework and no build step, because I wanted to understand what the ' +
        'browser gives you before reaching for something that hides it.',
      'I care about work that holds up on a cheap phone as much as on a ' +
        'desktop, and I would rather ship something small that works properly ' +
        'than something large that almost does.'
    ],

    /* Small highlight cards shown beside the text. Add or remove freely. */
    highlights: [
      { label: 'Based in', value: 'Cebu City, PH' },
      { label: 'Currently', value: 'BSIT, 4th Year' },
      { label: 'Published', value: 'Google Play App' },
      { label: 'Focus', value: 'Web & Mobile' }
    ]
  },

  /* --- Skills ------------------------------------------------------------
     Grouped by category. Only list what you have genuinely worked with —
     these were drawn from your CV and from the projects on your machine.
     Delete anything you would rather not claim, and add anything missing.
     No proficiency percentages: they invite questions you cannot answer. */
  skills: [
    {
      category: 'Languages',
      items: ['JavaScript', 'Python', 'HTML5', 'CSS3', 'SQL']
    },
    {
      category: 'Frontend',
      items: [
        'Vanilla JavaScript',
        'CSS Grid & Flexbox',
        'Responsive Design',
        'DOM APIs',
        'SVG',
        'Web Audio API'
      ]
    },
    {
      category: 'Backend',
      items: ['Django', 'Python', 'REST APIs', 'Server-side templating']
    },
    {
      category: 'Mobile',
      items: ['Mobile app development', 'Google Play releases']
    },
    {
      category: 'Databases',
      items: ['PostgreSQL', 'Supabase', 'SQLite']
    },
    {
      category: 'Tools & Platforms',
      items: ['Git', 'Vercel', 'VS Code', 'Claude Code', 'Microsoft Office']
    }
  ],

  /* --- Experience --------------------------------------------------------
     Rendered as a timeline. `current: true` adds a live indicator. */
  experience: [
    {
      role: 'Front-End Developer',
      organization: 'Zoki Kasal Kain & Beauty',
      meta: 'Published on Google Play Store',
      period: null,
      points: [
        'Built the front end of a wedding-vendor marketplace app now live on the Google Play Store.',
        'Developed the customer and vendor screens, working to the designs agreed with the team.',
        'Tested releases and troubleshot bugs to improve app performance and user experience.'
      ]
    },
    {
      role: 'Sales Agent',
      organization: 'Converge ICT Solutions',
      meta: null,
      period: '2024',
      points: [
        'Handled outbound and inbound calls for internet service subscription sales.',
        'Met monthly sales quotas and conversion targets consistently.',
        'Assisted customers with inquiries, complaints and account concerns.',
        'Maintained accurate records of customer interactions and transactions.'
      ]
    }
  ],

  /* --- Education ---------------------------------------------------------- */
  education: [
    {
      degree: 'Bachelor of Science in Information Technology',
      organization: 'Cebu Eastern College',
      period: '2022 – Present',
      meta: '4th Year, in progress',
      current: true,
      points: []
    },
    {
      degree: 'Senior High School',
      organization: 'Asian College of Technology',
      period: 'Completed',
      meta: null,
      points: []
    },
    {
      degree: 'Junior High School',
      organization: 'Cebu City Don Carlos A. Gothong Memorial National High School',
      period: 'Completed',
      meta: null,
      points: []
    }
  ],

  /* --- Contact section copy ----------------------------------------------
     accessKey turns the form into one that actually delivers. Get a free
     key at https://web3forms.com (enter your email, it is sent to you) and
     paste it below. Left null, the form falls back to opening the
     visitor's own mail app, which many people never complete.

     The key is safe in public code: it only allows sending to the address
     it was issued for. */
  contact: {
    accessKey: 'fa7417fc-112d-42b7-87d7-1d9e7654698e',
    heading: 'Let’s build something',
    blurb:
      'I am currently looking for internship opportunities, and I am also ' +
      'open to junior developer roles and freelance work. If you have a ' +
      'project in mind or a position to fill, my inbox is open.'
  },

  /* --- Footer ------------------------------------------------------------- */
  footer: {
    /* The closing line above the footer's contact details. Keep it short:
       it is set at display size across two lines. */
    headline: 'Have something in mind? Let’s build it.',
    /* Small line beside the copyright. null removes it. */
    tagline: null
  }
};
