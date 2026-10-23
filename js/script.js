/* ============================================================================
   Portfolio behaviour
   ----------------------------------------------------------------------------
   Reads CONFIG (js/config.js) and PROJECTS (js/projects.js) and builds the
   page from them. Nothing here needs editing to add content.

   Everything is defensive: missing data hides its element rather than
   rendering an empty box or a link that goes nowhere.
   ========================================================================= */

(function () {
  'use strict';

  /* --- Tiny helpers ----------------------------------------------------- */
  const $  = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  /** Escapes text before it goes into innerHTML. */
  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Escapes text, then turns **double asterisks** into <strong>. The escape
   * runs first, so the markers are the only markup that can get through.
   */
  function emphasise(value) {
    return esc(value).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }

  const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Social icon paths, drawn inline so there is no icon font to load. */
  const SOCIAL_ICONS = {
    github:
      'M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 ' +
      'l-.01-1.9c-2.78.62-3.37-1.21-3.37-1.21-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 ' +
      '1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.63-1.38 ' +
      '-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 ' +
      '0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71 ' +
      '.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 ' +
      'l-.01 2.82c0 .27.18.59.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z',
    linkedin:
      'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 ' +
      '3.77-1.95C20.5 8.75 21 11 21 14v7h-4v-6.2c0-1.48-.03-3.39-2.07-3.39-2.07 0-2.39 1.61-2.39 ' +
      '3.28V21H9z',
    facebook:
      'M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85 ' +
      'c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78 ' +
      'l-.45 2.9h-2.33V22c4.78-.79 8.44-4.94 8.44-9.94z',
    instagram:
      'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38 ' +
      '.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23 ' +
      '-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07 ' +
      's-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38 ' +
      '-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23 ' +
      '.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07z ' +
      'M12 6.85a5.15 5.15 0 1 0 0 10.3 5.15 5.15 0 0 0 0-10.3zm0 8.49a3.34 3.34 0 1 1 0-6.68 3.34 3.34 ' +
      '0 0 1 0 6.68zm6.56-8.69a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z',
    email:
      'M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.24-8 4.76-8-4.76V6l8 ' +
      '4.76L20 6z'
  };

  const SOCIAL_LABELS = {
    github: 'GitHub',
    linkedin: 'LinkedIn',
    facebook: 'Facebook',
    instagram: 'Instagram'
  };

  /* =========================================================================
     IDENTITY — name, title, intro, photo
     ====================================================================== */
  function renderIdentity() {
    document.title = CONFIG.name + ' | ' + CONFIG.title;

    $$('[data-brand-name]').forEach(el => { el.textContent = CONFIG.shortName; });
    $$('[data-brand-fullname]').forEach(el => { el.textContent = CONFIG.name; });
    $$('[data-brand-initials]').forEach(el => { el.textContent = CONFIG.initials; });

    const name = $('[data-hero-name]');
    if (name) name.textContent = CONFIG.name;

    const title = $('[data-hero-title]');
    if (title) title.textContent = CONFIG.title;

    /* The status badge shows the availability message. With none set the
       whole pill is removed rather than left as an empty dot. */
    const loc = $('[data-hero-location]');
    if (loc) {
      const badge = loc.closest('.hero__eyebrow') || loc;
      if (CONFIG.availability) {
        loc.textContent = CONFIG.availability;
      } else {
        badge.remove();
      }
    }

    const headline = $('[data-hero-headline]');
    if (headline) headline.textContent = CONFIG.headline || '';

    const intro = $('[data-hero-intro]');
    if (intro) intro.innerHTML = emphasise(CONFIG.intro || '');

    const tagline = $('[data-footer-tagline]');
    if (tagline && CONFIG.footer) tagline.textContent = CONFIG.footer.tagline || '';

    const mono = $('[data-photo-mono]');
    if (mono) mono.textContent = CONFIG.initials;

    renderAvailabilityCard();
    renderPhoto();
  }

  /** Small card overlapping the hero photo. Removed when not configured. */
  function renderAvailabilityCard() {
    const host = $('[data-availability-card]');
    if (!host) return;

    const card = CONFIG.availabilityCard;
    if (!card || !card.status) { host.remove(); return; }

    const link = card.linkLabel && card.linkHref
      ? '<a class="availcard__link" href="' + esc(card.linkHref) + '">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
          esc(card.linkLabel) +
        '</a>'
      : '';

    host.innerHTML =
      '<p class="availcard__status"><span class="availcard__dot" aria-hidden="true"></span>' +
        esc(card.status) +
      '</p>' +
      (card.detail ? '<p class="availcard__detail">' + emphasise(card.detail) + '</p>' : '') +
      link;

    host.hidden = false;
  }

  /**
   * Loads the profile photo and swaps out the monogram only once the image
   * has actually decoded, so a missing file leaves the fallback in place
   * instead of showing a broken image.
   */
  function renderPhoto() {
    const frame = $('[data-photo-frame]');
    if (!frame || !CONFIG.photo) return;

    const probe = new Image();
    probe.onload = function () {
      frame.innerHTML = '';
      const img = document.createElement('img');
      img.src = CONFIG.photo;
      img.alt = CONFIG.photoAlt || CONFIG.name;
      img.width = probe.naturalWidth;
      img.height = probe.naturalHeight;
      frame.appendChild(img);
    };
    probe.onerror = function () { /* keep the monogram */ };
    probe.src = CONFIG.photo;
  }

  /* =========================================================================
     SOCIAL LINKS — rendered into every [data-socials] list
     ====================================================================== */
  function renderSocials() {
    const entries = Object.keys(CONFIG.socials || {})
      .filter(key => CONFIG.socials[key] && SOCIAL_ICONS[key]);

    const markup = entries.map(key =>
      '<li><a class="sociallink" href="' + esc(CONFIG.socials[key]) + '" ' +
      'target="_blank" rel="noopener noreferrer" aria-label="' +
      esc(SOCIAL_LABELS[key] || key) + '" title="' + esc(SOCIAL_LABELS[key] || key) + '">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + SOCIAL_ICONS[key] + '"/></svg>' +
      '</a></li>'
    ).join('');

    $$('[data-socials]').forEach(list => {
      if (!entries.length) { list.hidden = true; return; }
      list.innerHTML = markup;
    });
  }

  /* =========================================================================
     ABOUT
     ====================================================================== */
  function renderAbout() {
    const about = CONFIG.about || {};

    const body = $('[data-about-text]');
    if (body && about.paragraphs) {
      body.innerHTML = about.paragraphs.map(p => '<p>' + esc(p) + '</p>').join('');
    }

    const stats = $('[data-about-highlights]');
    if (stats && about.highlights) {
      stats.innerHTML = about.highlights.map(item =>
        '<li><dl><dt>' + esc(item.label) + '</dt><dd>' + esc(item.value) + '</dd></dl></li>'
      ).join('');
    }
  }

  /* =========================================================================
     SKILLS
     ====================================================================== */
  function renderSkills() {
    const host = $('[data-skills]');
    if (!host || !CONFIG.skills) return;

    host.innerHTML = CONFIG.skills
      .filter(group => group.items && group.items.length)
      .map((group, index) =>
        '<article class="skillgroup reveal" data-reveal-delay="' + (index % 3) + '">' +
          '<h3 class="skillgroup__title">' + esc(group.category) + '</h3>' +
          '<ul>' + group.items.map(item => '<li>' + esc(item) + '</li>').join('') + '</ul>' +
        '</article>'
      ).join('');
  }

  /* =========================================================================
     TIMELINE — experience and education share one renderer
     ====================================================================== */
  function timelineItem(entry) {
    const heading = entry.role || entry.degree || '';
    const points = (entry.points || []).length
      ? '<ul class="titem__points">' +
        entry.points.map(p => '<li>' + esc(p) + '</li>').join('') +
        '</ul>'
      : '';

    return '<li class="titem reveal' + (entry.current ? ' is-current' : '') + '">' +
      (entry.period ? '<p class="titem__period">' + esc(entry.period) + '</p>' : '') +
      '<h4 class="titem__role">' + esc(heading) + '</h4>' +
      '<p class="titem__org">' + esc(entry.organization || '') + '</p>' +
      (entry.meta ? '<p class="titem__meta">' + esc(entry.meta) + '</p>' : '') +
      points +
    '</li>';
  }

  function renderTimelines() {
    const exp = $('[data-experience]');
    if (exp && CONFIG.experience) {
      exp.innerHTML = CONFIG.experience.map(timelineItem).join('');
    }

    const edu = $('[data-education]');
    if (edu && CONFIG.education) {
      edu.innerHTML = CONFIG.education.map(timelineItem).join('');
    }
  }

  /* =========================================================================
     PROJECTS
     ====================================================================== */

  /** Screenshot, generated placeholder, or either one inside a mockup frame. */
  function mediaMarkup(project) {
    const inner = project.image
      ? '<img src="' + esc(project.image) + '" alt="' + esc(project.imageAlt || project.name) +
        '" loading="lazy" decoding="async">'
      : '<div class="placeholder">' +
          '<span class="placeholder__text">' + esc(project.name.charAt(0)) + '</span>' +
          '<span class="placeholder__note">Screenshot coming soon</span>' +
        '</div>';

    const shot = '<div class="pmedia__shot">' + inner + '</div>';

    if (project.mockup === 'browser') {
      let host = '';
      try {
        if (project.links && project.links.liveUrl) {
          host = new URL(project.links.liveUrl).hostname.replace(/^www\./, '');
        }
      } catch (e) { host = ''; }

      return '<div class="pmedia mock--browser">' +
        '<div class="mock__bar" aria-hidden="true">' +
          '<span class="mock__dot"></span><span class="mock__dot"></span><span class="mock__dot"></span>' +
          '<span class="mock__url">' + esc(host || project.name.toLowerCase()) + '</span>' +
        '</div>' + shot +
      '</div>';
    }

    if (project.mockup === 'phone') {
      return '<div class="pmedia mock--phone">' + shot + '</div>';
    }

    return '<div class="pmedia">' + shot + '</div>';
  }

  function tagsMarkup(project) {
    if (!project.tech || !project.tech.length) return '';
    return '<ul class="taglist">' +
      project.tech.map(t => '<li class="tag">' + esc(t) + '</li>').join('') +
      '</ul>';
  }

  function metaMarkup(project) {
    const bits = [];
    if (project.category) bits.push(esc(project.category));
    if (project.year) bits.push(esc(project.year));
    if (!bits.length) return '';
    return '<p class="pmeta">' +
      bits.join('<span class="pmeta__sep">/</span>') +
    '</p>';
  }

  /** Live and source buttons, plus "Details" when there is more to read. */
  function linksMarkup(project) {
    const links = project.links || {};
    let html = '<div class="plinks">';

    if (links.liveUrl) {
      html += '<a class="plink plink--primary" href="' + esc(links.liveUrl) + '" ' +
        'target="_blank" rel="noopener noreferrer">' + esc(links.liveLabel || 'Live Demo') +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9"/>' +
        '<path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg></a>';
    }

    if (links.codeUrl) {
      html += '<a class="plink plink--quiet" href="' + esc(links.codeUrl) + '" ' +
        'target="_blank" rel="noopener noreferrer">Source Code' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18l-6-6 6-6M15 6l6 6-6 6"/></svg></a>';
    }

    if ((project.description && project.description.length) || project.role) {
      html += '<button class="plink plink--quiet" type="button" data-project="' +
        esc(project.id) + '">Details' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>';
    }

    return html + '</div>';
  }

  function featuredMarkup(project, index) {
    return '<article class="fproject reveal" data-category="' + esc(project.category) + '">' +
      '<div class="fproject__media">' + mediaMarkup(project) + '</div>' +
      '<div class="fproject__info">' +
        '<p class="fproject__label">Featured ' + String(index + 1).padStart(2, '0') + '</p>' +
        '<h3 class="fproject__title">' + esc(project.name) + '</h3>' +
        metaMarkup(project) +
        '<p class="fproject__tagline">' + esc(project.tagline) + '</p>' +
        tagsMarkup(project) +
        linksMarkup(project) +
      '</div>' +
    '</article>';
  }

  function cardMarkup(project) {
    return '<article class="pcard reveal" data-category="' + esc(project.category) + '">' +
      mediaMarkup(project) +
      '<div class="pcard__body">' +
        metaMarkup(project) +
        '<h3 class="pcard__title">' + esc(project.name) + '</h3>' +
        '<p class="pcard__tagline">' + esc(project.tagline) + '</p>' +
        tagsMarkup(project) +
        linksMarkup(project) +
      '</div>' +
    '</article>';
  }

  function renderProjects(filter) {
    const featuredHost = $('#featured-projects');
    const gridHost = $('#project-grid');
    const empty = $('#projects-empty');
    if (!featuredHost || !gridHost) return;

    const visible = PROJECTS.filter(p => filter === 'All' || p.category === filter);

    const featured = visible.filter(p => p.featured);
    const rest = visible.filter(p => !p.featured);

    featuredHost.innerHTML = featured.map(featuredMarkup).join('');
    gridHost.innerHTML = rest.map(cardMarkup).join('');

    if (empty) empty.hidden = visible.length > 0;

    observeReveals();
  }

  /** Builds filter buttons for categories that actually contain projects. */
  function renderFilters() {
    const host = $('#filters');
    if (!host) return;

    const used = CATEGORIES.filter(cat => PROJECTS.some(p => p.category === cat));

    /* With a single category the filter row is noise, so skip it. */
    if (used.length < 2) { host.hidden = true; return; }

    const all = ['All'].concat(used);
    host.innerHTML = all.map((cat, i) =>
      '<button class="filter' + (i === 0 ? ' is-active' : '') + '" type="button" ' +
      'data-filter="' + esc(cat) + '" aria-pressed="' + (i === 0) + '">' +
      esc(cat === 'All' ? 'All Projects' : cat) + '</button>'
    ).join('');

    host.addEventListener('click', function (event) {
      const button = event.target.closest('.filter');
      if (!button) return;

      $$('.filter', host).forEach(b => {
        const active = b === button;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });

      renderProjects(button.dataset.filter);
    });
  }

  /* =========================================================================
     PROJECT DETAIL MODAL
     ====================================================================== */
  const modal = {
    root: null,
    content: null,
    lastFocus: null,

    init() {
      this.root = $('#modal');
      this.content = $('#modal-content');
      if (!this.root) return;

      /* Delegated: cards are re-rendered whenever the filter changes. */
      document.addEventListener('click', event => {
        const trigger = event.target.closest('[data-project]');
        if (trigger) { this.open(trigger.dataset.project, trigger); return; }
        if (event.target.closest('[data-close-modal]')) this.close();
      });

      document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && this.root.classList.contains('is-open')) {
          this.close();
        }
      });
    },

    open(id, trigger) {
      const project = PROJECTS.find(p => p.id === id);
      if (!project) return;

      this.lastFocus = trigger || null;

      const gallery = (project.gallery || []).length
        ? '<div class="modal__gallery">' +
          project.gallery.map(g =>
            '<img src="' + esc(g.src) + '" alt="' + esc(g.alt || project.name) + '" loading="lazy">'
          ).join('') +
          '</div>'
        : '';

      this.content.innerHTML =
        metaMarkup(project) +
        '<h3 class="modal__title" id="modal-title">' + esc(project.name) + '</h3>' +
        '<div class="modal__body">' +
          (project.description || []).map(p => '<p>' + esc(p) + '</p>').join('') +
        '</div>' +
        gallery +
        (project.role
          ? '<div class="modal__role"><strong>My role</strong>' + esc(project.role) + '</div>'
          : '') +
        tagsMarkup(project) +
        linksMarkup(project);

      /* The Details button inside the modal would be redundant. */
      const nested = this.content.querySelector('[data-project]');
      if (nested) nested.remove();

      this.root.hidden = false;
      document.body.classList.add('is-locked');
      requestAnimationFrame(() => this.root.classList.add('is-open'));

      const close = $('.modal__close', this.root);
      if (close) close.focus();
    },

    close() {
      if (!this.root || this.root.hidden) return;
      this.root.classList.remove('is-open');
      document.body.classList.remove('is-locked');

      const finish = () => {
        this.root.hidden = true;
        if (this.lastFocus && document.contains(this.lastFocus)) this.lastFocus.focus();
      };

      if (prefersReducedMotion) finish();
      else setTimeout(finish, 300);
    }
  };

  /* =========================================================================
     NAVIGATION
     ====================================================================== */
  function initNav() {
    const nav = $('#nav');
    const toggle = $('#nav-toggle');
    const links = $('#nav-links');
    const scrim = $('#nav-scrim');
    const indicator = $('.nav__indicator');

    /* Shrink/blur the bar once the page scrolls. */
    const onScroll = () => {
      if (nav) nav.classList.toggle('is-stuck', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* --- Mobile menu --- */
    function setMenu(open) {
      if (!links || !toggle) return;
      links.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('is-locked', open);

      if (scrim) {
        if (open) {
          scrim.hidden = false;
          requestAnimationFrame(() => scrim.classList.add('is-open'));
        } else {
          scrim.classList.remove('is-open');
          setTimeout(() => { scrim.hidden = true; }, 300);
        }
      }
    }

    if (toggle) {
      toggle.addEventListener('click', () => {
        setMenu(toggle.getAttribute('aria-expanded') !== 'true');
      });
    }
    if (scrim) scrim.addEventListener('click', () => setMenu(false));

    /* Close the menu after tapping a link. */
    if (links) {
      links.addEventListener('click', event => {
        if (event.target.closest('a')) setMenu(false);
      });
    }

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') setMenu(false);
    });

    /* --- Active section highlighting ---
       Direct children only: the mobile panel also holds a CTA and external
       social links, and passing an absolute URL to querySelector below
       throws. */
    const navLinks = $$('#nav-links > a');
    const sections = navLinks
      .map(link => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    function moveIndicator(link) {
      if (!indicator || !link || window.innerWidth <= 820) {
        if (indicator) indicator.style.opacity = '0';
        return;
      }
      indicator.style.width = link.offsetWidth + 'px';
      indicator.style.transform =
        'translate(' + link.offsetLeft + 'px, -50%)';
      indicator.style.opacity = '1';
    }

    function setActive(id) {
      let activeLink = null;
      navLinks.forEach(link => {
        const match = link.getAttribute('href') === '#' + id;
        link.classList.toggle('is-active', match);
        if (match) activeLink = link;
      });
      moveIndicator(activeLink);
    }

    if ('IntersectionObserver' in window && sections.length) {
      const spy = new IntersectionObserver(entries => {
        /* Pick the entry closest to the top of the viewport. */
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) setActive(visible[0].target.id);
      }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

      sections.forEach(section => spy.observe(section));
    }

    window.addEventListener('resize', () => {
      moveIndicator($('#nav-links a.is-active'));
      if (window.innerWidth > 820) setMenu(false);
    });
  }

  /* =========================================================================
     REVEAL ON SCROLL
     ====================================================================== */
  let revealObserver = null;

  function observeReveals() {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      $$('.reveal').forEach(el => el.classList.add('is-visible'));
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    }

    $$('.reveal').forEach(el => {
      if (el.classList.contains('is-visible')) return;
      /* Stagger siblings using the delay attribute set in the markup. */
      const delay = el.dataset.revealDelay;
      if (delay) el.style.setProperty('--d', delay);
      revealObserver.observe(el);
    });
  }

  /* =========================================================================
     THEME
     ====================================================================== */
  function initTheme() {
    const toggle = $('#theme-toggle');
    if (!toggle) return;

    function apply(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      toggle.setAttribute('aria-pressed', String(theme === 'light'));
      toggle.setAttribute(
        'aria-label',
        theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'
      );
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', theme === 'light' ? '#f7f6f9' : '#08080b');
    }

    apply(document.documentElement.getAttribute('data-theme') || 'dark');

    toggle.addEventListener('click', () => {
      const next =
        document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      apply(next);
      try { localStorage.setItem('portfolio-theme', next); } catch (e) { /* private mode */ }
    });
  }

  /* =========================================================================
     BACK TO TOP
     ====================================================================== */
  function initBackToTop() {
    const button = $('#to-top');
    if (!button) return;

    const onScroll = () => {
      const show = window.scrollY > window.innerHeight * 0.7;
      button.hidden = false;
      button.classList.toggle('is-visible', show);
      /* Keep it out of the tab order while invisible. */
      button.tabIndex = show ? 0 : -1;
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  }

  /* =========================================================================
     RESUME / CV
     ====================================================================== */
  function initCV() {
    const cv = CONFIG.cv || {};
    const view = $('#cv-view');
    const download = $('#cv-download');
    const heroCv = $('#hero-cv');

    if (view && cv.path) view.href = cv.path;

    if (download && cv.path) {
      download.href = cv.path;
      /* `download` with a value renames the saved file. */
      download.setAttribute('download', cv.fileName || 'cv.pdf');
    }

    /* The hero button jumps to the resume section rather than downloading
       blind, so the visitor sees the view option too. */
    if (heroCv) heroCv.href = '#resume';

    /* Optional inline preview, desktop only: mobile browsers commonly refuse
       to render a PDF in an iframe and would show an empty box. */
    const preview = $('[data-cv-preview]');
    if (preview && cv.showPreview && cv.path && window.innerWidth >= 900) {
      const frame = document.createElement('iframe');
      frame.src = cv.path + '#view=FitH';
      frame.title = 'Preview of ' + CONFIG.name + "'s CV";
      frame.loading = 'lazy';
      preview.appendChild(frame);
    }

    /* Show the file size when the server reports it. Fails silently on
       file:// where fetch is blocked. */
    const sizeEl = $('[data-cv-size]');
    if (sizeEl && cv.path && window.fetch && location.protocol !== 'file:') {
      fetch(cv.path, { method: 'HEAD' })
        .then(response => {
          const length = response.headers.get('content-length');
          if (response.ok && length) {
            sizeEl.textContent = ' · ' + Math.max(1, Math.round(length / 1024)) + ' KB';
          }
        })
        .catch(() => { /* leave the label as-is */ });
    }
  }

  /* =========================================================================
     CONTACT
     ====================================================================== */
  function initContact() {
    const contact = CONFIG.contact || {};

    const heading = $('[data-contact-heading]');
    if (heading && contact.heading) heading.textContent = contact.heading;

    const blurb = $('[data-contact-blurb]');
    if (blurb && contact.blurb) blurb.textContent = contact.blurb;

    const mail = $('#mail-link');
    const emailValue = $('[data-email]');

    if (CONFIG.email) {
      if (emailValue) emailValue.textContent = CONFIG.email;
      if (mail) mail.href = 'mailto:' + CONFIG.email;
    } else if (mail) {
      mail.hidden = true;
    }

    /* Phone is optional — the card stays hidden when CONFIG.phone is null. */
    const phoneLink = $('#phone-link');
    const phoneValue = $('[data-phone]');
    if (CONFIG.phone && phoneLink) {
      phoneLink.hidden = false;
      phoneLink.href = 'tel:' + CONFIG.phone.replace(/[^\d+]/g, '');
      if (phoneValue) phoneValue.textContent = CONFIG.phone;
    }

    initContactForm();
  }

  function initContactForm() {
    const form = $('#contact-form');
    if (!form) return;

    /* Without an address to send to, the form has nothing to do. */
    if (!CONFIG.email) { form.hidden = true; return; }

    const status = $('#form-status');

    const rules = [
      { id: 'name',    label: 'Please enter your name.' },
      { id: 'email',   label: 'Please enter your email address.' },
      { id: 'subject', label: 'Please enter a subject.' },
      { id: 'message', label: 'Please enter a message.' }
    ];

    function setError(id, message) {
      const input = $('#f-' + id);
      const error = $('#err-' + id);
      if (!input || !error) return;
      input.closest('.field').classList.toggle('has-error', Boolean(message));
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
      error.textContent = message || '';
    }

    /* Clear an error as soon as the visitor starts fixing it. */
    rules.forEach(rule => {
      const input = $('#f-' + rule.id);
      if (input) input.addEventListener('input', () => setError(rule.id, ''));
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      let firstBad = null;

      rules.forEach(rule => {
        const input = $('#f-' + rule.id);
        if (!input) return;
        const value = input.value.trim();

        let message = '';
        if (!value) {
          message = rule.label;
        } else if (rule.id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
          message = 'That does not look like a valid email address.';
        }

        setError(rule.id, message);
        if (message && !firstBad) firstBad = input;
      });

      if (firstBad) {
        if (status) {
          status.textContent = 'Please fix the highlighted fields.';
          status.className = 'cform__status is-bad';
        }
        firstBad.focus();
        return;
      }

      /* Static site: hand the message to the visitor's own mail client
         rather than pretending a server received it. */
      const name = $('#f-name').value.trim();
      const email = $('#f-email').value.trim();
      const subject = $('#f-subject').value.trim();
      const message = $('#f-message').value.trim();

      const body = message + '\n\n--\nFrom: ' + name + ' (' + email + ')';
      const href = 'mailto:' + CONFIG.email +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      window.location.href = href;

      if (status) {
        status.textContent = 'Opening your email app…';
        status.className = 'cform__status is-ok';
      }
    });
  }

  /* =========================================================================
     FOOTER
     ====================================================================== */
  function initFooter() {
    const year = $('#year');
    if (year) year.textContent = new Date().getFullYear();
  }

  /* =========================================================================
     BOOT
     ====================================================================== */
  function init() {
    /* Only hide reveal elements once JS is confirmed running, so the page
       is never left blank if this script fails to load. */
    document.documentElement.classList.add('js-reveal');

    renderIdentity();
    renderSocials();
    renderAbout();
    renderSkills();
    renderTimelines();

    renderFilters();
    renderProjects('All');
    modal.init();

    initNav();
    initTheme();
    initBackToTop();
    initCV();
    initContact();
    initFooter();

    observeReveals();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
