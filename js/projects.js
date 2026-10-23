/* ============================================================================
   PROJECTS
   ----------------------------------------------------------------------------
   Adding a project = adding one object to this array. Nothing in index.html
   needs to change; the cards, the filter buttons and the detail dialogs are
   all generated from this data.

   Fields
   ------
   id          Unique short string. Used internally only.
   name        Project title.
   tagline     One line shown on the card.
   description Longer text shown in the detail dialog. Array of paragraphs.
   category    One of the CATEGORIES values below. Drives the filter buttons;
               only categories that are actually used get a button.
   featured    true  -> large full-width showcase row
               false -> standard card in the grid
   year        Shown as a small label. null to hide.
   role        Your contribution. null to hide.
   tech        Array of technology tags.
   image       Path to a screenshot. null shows a generated placeholder
               instead of a broken image.
   imageAlt    Alt text for the screenshot.
   mockup      'browser' draws the image inside a browser window frame,
               'phone' draws it inside a phone frame,
               null shows the image plain.
   links       liveUrl   Deployed/live link. null hides the button.
               liveLabel Text for that button. Defaults to 'Live Demo'.
               codeUrl   Source repository. null hides the button.
   gallery     Optional extra screenshots: array of { src, alt }.
   ========================================================================= */

/* The display order of filter buttons. Categories with no projects are
   skipped automatically, so you can leave all of these in place. */
const CATEGORIES = [
  'Websites',
  'Web Applications',
  'Mobile Apps',
  'Games',
  'Software',
  'Academic'
];

const PROJECTS = [
  {
    id: 'emberfall',
    name: 'Emberfall',
    tagline: 'A dungeon awaits beneath the hills. A turn-based RPG that runs in any browser.',
    description: [
      'A complete turn-based role-playing game built as a single HTML file, ' +
        'with no framework, no build step and no external libraries. Choose a ' +
        'class, then fight down through fifteen waves of procedurally ' +
        'assembled enemies and see how far you get.',
      'Combat runs on a four-action loop of attack, skill, defend and item, ' +
        'backed by an experience and levelling system, a running combat log ' +
        'and status effects. Runs are scored and kept on a leaderboard, and ' +
        'the title screen remembers your best wave between sessions.',
      'Character and enemy art is drawn as inline SVG generated at runtime, ' +
        'and the sound is synthesised in the browser with the Web Audio API. ' +
        'A settings screen covers audio and display options, with a controls ' +
        'reference for anyone starting cold.',
      'It was built to work properly on a phone as well as a desktop: a ' +
        'touch-friendly layout, landscape support and fullscreen play.'
    ],
    category: 'Games',
    featured: true,
    year: '2026',
    role: 'Sole developer: design, game systems, art, audio and interface.',
    tech: [
      'JavaScript',
      'HTML5',
      'CSS3',
      'Web Audio API',
      'SVG',
      'Vercel'
    ],
    /* Swapped in over the image on wide screens, unless reduced motion is
       requested. The image above stays as the poster and the fallback. */
    video: 'assets/video/emberfall.mp4',
    image: 'assets/images/projects/emberfall.jpg',
    imageAlt: 'Emberfall title screen: a pixel-art castle at night beneath a crescent moon, with the game menu',
    mockup: 'browser',
    links: {
      liveUrl: 'https://emberfall-rho.vercel.app/',
      liveLabel: 'Play Emberfall',
      codeUrl: null
    },
    gallery: []
  },

  {
    id: 'findit',
    name: 'FindIt',
    tagline: 'A lost and found network for the Philippines. Report an item, search, get reunited.',
    description: [
      'A community lost-and-found platform covering Cebu, Manila, Davao and ' +
        'twenty more cities. Someone who has lost a wallet, a set of keys or ' +
        'a pet posts it in under two minutes; someone who has found one does ' +
        'the same, and the site does the matching that would otherwise rely ' +
        'on a barangay noticeboard or a Facebook group.',
      'Items are filed across thirteen categories, from electronics and ' +
        'documents to school items and pets, and can be searched by category, ' +
        'location or keyword. When a match looks right the claimant submits ' +
        'proof, the owner verifies it, and the two arrange a meetup through ' +
        'the site rather than trading phone numbers in public.',
      'Accounts, a running count of items posted and reunited, and a dark ' +
        'and light theme. Built as a single page with no framework and no ' +
        'build step.'
    ],
    category: 'Web Applications',
    featured: true,
    year: '2026',
    role: 'Sole developer: interface, categories, search and claim flow.',
    /* TODO: add whatever stores the items and accounts, e.g. Supabase. */
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Vercel'],
    video: 'assets/video/findit.mp4',
    image: 'assets/images/projects/findit.jpg',
    imageAlt: 'FindIt home page: “Lost something? Find it here.” over report and search controls',
    mockup: 'browser',
    links: {
      liveUrl: 'https://findit-ph.vercel.app/',
      liveLabel: 'Visit FindIt',
      codeUrl: null
    },
    gallery: []
  },

  {
    id: 'shiftgear',
    name: 'ShiftGear',
    tagline: 'A multi-page car showcase site. Browse the models, send an inquiry.',
    description: [
      'A car showcase website built as a team project for a semi-finals ' +
        'defense. Visitors browse a catalogue of vehicles and read the ' +
        'features of each model, with an inquiry page for getting in touch ' +
        'about one, and a partner brands section covering the marques the ' +
        'site carries.',
      'It is a multi-page static site rather than a single landing page, ' +
        'built with plain HTML, CSS and JavaScript and deployed on Vercel.',
      'I handled the front end: the page layouts, the styling and the ' +
        'behaviour visitors interact with.'
    ],
    category: 'Websites',
    featured: true,
    year: null,
    role: 'Front-end developer: layout, styling and interface behaviour.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Vercel'],
    video: 'assets/video/shiftgear.mp4',
    image: 'assets/images/projects/shiftgear.jpg',
    imageAlt: 'ShiftGear home page: a car lit head-on under the headline “Drive into the Future”',
    mockup: 'browser',
    links: {
      liveUrl: 'https://shiftgear-coral.vercel.app/',
      liveLabel: 'Visit ShiftGear',
      codeUrl: null
    },
    gallery: []
  },

  {
    id: 'barangay-mambaling',
    name: 'Barangay Mambaling E-Service System',
    tagline: 'An online certificate and services portal for a Cebu City barangay.',
    description: [
      'A public e-government portal for Barangay Mambaling in Cebu City, ' +
        'built so residents can request barangay certificates and clearances ' +
        'online instead of queueing at the hall, the kind of errand that ' +
        'normally costs a working person half a day.',
      'Residents sign in to an account, browse the services the barangay ' +
        'offers and submit a request, with an FAQ section covering the ' +
        'requirements and process for each one.',
      'I handled the front end: the resident-facing pages, the layout and ' +
        'the styling of the service and request screens.'
    ],
    category: 'Web Applications',
    featured: false,
    year: null,
    role: 'Front-end developer: resident-facing pages, layout and styling.',
    /* TODO — confirm the stack. PHP and MySQL are inferred from the host
       (InfinityFree runs PHP only); correct these if that is wrong. */
    tech: ['PHP', 'MySQL', 'HTML5', 'CSS3', 'JavaScript'],
    video: 'assets/video/barangay-mambaling.mp4',
    image: 'assets/images/projects/barangay-mambaling.jpg',
    imageAlt: 'Home page of the Barangay Mambaling E-Service System',
    mockup: 'browser',
    links: {
      liveUrl: 'https://barangaymambaling.infinityfree.io/?i=1',
      liveLabel: 'Visit Live Site',
      codeUrl: null
    },
    gallery: []
  },

  {
    id: 'zoki',
    name: 'Zoki Kasal Kain & Beauty',
    tagline: 'A wedding planning marketplace for Cebu, live on the Google Play Store.',
    description: [
      'An Android app that connects engaged couples in Cebu with the vendors ' +
        'they need to plan a wedding: makeup artists, caterers, photographers ' +
        'and videographers, hotels and resorts, flower shops and event ' +
        'stylists, all browsable by province, city and barangay.',
      'It runs as a two-sided marketplace. Couples sign up to search vendors, ' +
        'read ratings and reviews, chat with a vendor directly, track what they ' +
        'are spending against a wedding budget and redeem vouchers. Vendors ' +
        'sign up through a separate flow to list their business under a ' +
        'category and reach couples nearby.',
      'I handled the front end, building the app screens residents and ' +
        'vendors actually use. I also tested releases and troubleshot bugs ' +
        'with the team through the release cycle.'
    ],
    category: 'Mobile Apps',
    featured: false,
    year: null,
    role: 'Front-end developer: app screens, interface and release testing.',
    tech: ['Mobile Development', 'Android', 'Google Play'],
    image: 'assets/images/projects/zoki.jpg',
    imageAlt: 'Zoki Kasal Kain & Beauty welcome screen, offering a Customer or Vendor sign-in',
    mockup: 'phone',
    links: {
      liveUrl: 'https://play.google.com/store/apps/details?id=com.zokikasal.app',
      liveLabel: 'View on Google Play',
      codeUrl: null
    },
    gallery: []
  }
];
