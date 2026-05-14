(function () {
  'use strict';
  gsap.registerPlugin(ScrollTrigger);

  // ============================================
  // CONFIGURATION
  // ============================================
  const TOTAL_FRAMES = 192;
  const IMAGE_PATH = 'interior-room-images/';
  const SCROLL_HEIGHT_MULTIPLIER = 3.5;
  const BATCH_SIZE = 12;
  const ENABLE_FRAME_INTERPOLATION = true;
  const VIGNETTE_INTENSITY = 0.55;
  const GRAIN_OPACITY = 6;

  // 4 rooms only — Private Study removed
  const SECTION_MAP = [
    {
      label: '01 — Entry',
      name: 'The Arrival Lounge',
      start: 0.02,
      end: 0.25,
      pos: 'bl',
      hotspot: { x: 62, y: 48 },
      details: {
        area: '320 sq ft',
        ceiling: '11 ft coffered ceiling',
        flooring: 'Honed Calacatta marble',
        lighting: 'Bespoke brass pendant cluster',
        highlights: [
          'Custom millwork entry console with integrated storage',
          'Architectural arched doorways in aged plaster finish',
          'Climate-controlled art display alcove',
          'Smart home entry panel concealed behind mirrored panel',
        ],
        description:
          'A grand first impression defined by symmetry and restraint. Polished stone underfoot, warm brass overhead — the Arrival Lounge sets an immediate tone of curated luxury before the residence fully reveals itself.',
      },
    },
    {
      label: '02 — Living',
      name: 'The Grand Salon',
      start: 0.25,
      end: 0.50,
      pos: 'tr',
      hotspot: { x: 38, y: 55 },
      details: {
        area: '740 sq ft',
        ceiling: '14 ft double-height with exposed beam',
        flooring: 'Wide-plank European white oak',
        lighting: 'Recessed cove + custom chandelier',
        highlights: [
          'Full-height glazing with motorised solar shades',
          'Bespoke floating fireplace in fluted limestone',
          'Built-in media wall with invisible speaker integration',
          'Curated art lighting on dedicated circuit',
        ],
        description:
          'The social heart of the residence. Proportioned for both intimate evenings and large gatherings, the Grand Salon balances monumental volume with tactile warmth through layered natural materials and carefully considered light.',
      },
    },
    {
      label: '03 — Passage',
      name: 'The Gallery Corridor',
      start: 0.50,
      end: 0.72,
      pos: 'br',
      hotspot: { x: 50, y: 40 },
      details: {
        area: '180 ft linear run',
        ceiling: '10 ft with barrel vault detail',
        flooring: 'Herringbone brushed limestone',
        lighting: 'Museum-grade picture lighting on track',
        highlights: [
          'Dedicated display niches every 4 ft with LED accent',
          'Climate-stable environment for archival artwork',
          'Continuous ash timber handrail at gallery height',
          'Acoustic panel inserts within wainscoting',
        ],
        description:
          'More than a transition — an experience in its own right. The Gallery Corridor is designed as a private museum passage, drawing the eye through a sequence of curated vignettes toward the residence beyond.',
      },
    },
    {
      label: '04 — Master',
      name: 'The Signature Penthouse',
      start: 0.72,
      end: 0.94,
      pos: 'bl',
      hotspot: { x: 45, y: 45 },
      details: {
        area: '1,100 sq ft suite',
        ceiling: '12 ft with sky-light ribbon',
        flooring: 'Honed travertine with radiant underfloor heating',
        lighting: 'Circadian-rhythm lighting system',
        highlights: [
          'Panoramic floor-to-ceiling glazing on three elevations',
          'En-suite with freestanding stone bath and steam enclosure',
          'Walk-in dressing room with island jewellery display',
          'Private terrace with outdoor lounge and fire pit',
        ],
        description:
          'The pinnacle of the collection. Every surface, proportion and view has been orchestrated to deliver an unrivalled living experience — from the morning light that floods the bedroom to the city horizon visible from the private terrace at dusk.',
      },
    },
  ];

  // Icon map for detail cards
  const DETAIL_ICONS = {
    'Area':     `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>`,
    'Ceiling':  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-6 9 6v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    'Flooring': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20M6 20V8l6-4 6 4v12"/><rect x="9" y="14" width="6" height="6"/></svg>`,
    'Lighting': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6M10 22h4"/></svg>`,
  };

  // Signature feature bullet icons cycling
  const BULLET_ICONS = [
    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>`,
    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  ];

  // ============================================
  // DOM REFERENCES
  // ============================================
  const canvas = document.getElementById('cinematic-canvas');
  const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: false });
  const scrollContainer = document.getElementById('scroll-container');
  const loadingBarFill = document.getElementById('loading-bar-fill');
  const loadingPercent = document.getElementById('loading-percent');
  const loadingScreen = document.getElementById('loading-screen');
  const sectionLabelsContainer = document.getElementById('section-labels');
  const letterboxTop = document.getElementById('letterbox-top');
  const letterboxBottom = document.getElementById('letterbox-bottom');

  const progressFill = document.getElementById('scroll-progress-fill');
  const imageCredit = document.getElementById('image-credit');
  const progressText = document.querySelector('.progress-text');
  const progressCircleFill = document.querySelector('.progress-circle-fill');
  const contactForm = document.getElementById('contact-form');
  const contactStatus = document.getElementById('contact-status');
  const bgmAudio = document.getElementById('bgm-audio');
  const bgmToggleButtons = Array.from(document.querySelectorAll('.bgm-toggle-btn'));
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // ============================================
  // BACKGROUND MUSIC CONTROLS
  // ============================================
  let bgmEnabled = true;
  let bgmRequestPending = false;

  function updateBgmButton() {
    if (!bgmToggleButtons.length) return;
    const isPlaying = !bgmAudio.paused && !bgmAudio.ended;
    bgmToggleButtons.forEach(function (button) {
      button.classList.toggle('active', isPlaying);
      button.setAttribute('aria-pressed', String(isPlaying));
      button.innerHTML = isPlaying
        ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M16.85 7.15c1.4 1.4 1.4 3.67 0 5.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><line x1="21" y1="3" x2="3" y2="21"/></svg>`;
    });
  }

  function tryPlayBgm() {
    if (!bgmAudio || !bgmEnabled) return;
    if (bgmAudio.paused || bgmAudio.ended) {
      bgmRequestPending = true;
      bgmAudio.volume = 0.24;
      const playPromise = bgmAudio.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          // Autoplay blocked. Wait for user interaction.
        }).finally(updateBgmButton);
      } else {
        updateBgmButton();
      }
    }
  }

  function toggleBgm() {
    bgmEnabled = !bgmEnabled;
    if (!bgmEnabled) {
      bgmAudio.pause();
    } else {
      tryPlayBgm();
    }
    updateBgmButton();
  }

  function createBgmInteractionListener() {
    function onFirstInteraction() {
      if (bgmEnabled) {
        tryPlayBgm();
      }
      document.body.removeEventListener('pointerdown', onFirstInteraction, { capture: true });
      document.body.removeEventListener('keydown', onFirstInteraction, { capture: true });
    }
    document.body.addEventListener('pointerdown', onFirstInteraction, { capture: true, passive: true });
    document.body.addEventListener('keydown', onFirstInteraction, { capture: true, passive: true });
  }

  bgmToggleButtons.forEach(function (button) {
    button.addEventListener('click', function (event) {
      event.stopPropagation();
      toggleBgm();
    });
  });

  if (bgmAudio) {
    bgmAudio.addEventListener('play', updateBgmButton);
    bgmAudio.addEventListener('pause', updateBgmButton);
  }

  createBgmInteractionListener();
  tryPlayBgm();

  // ============================================
  // STATE VARIABLES
  // ============================================
  const images = [];
  let progress = 0;
  let lastRenderedFrame = -1;
  let allLoaded = false;
  let loadCount = 0;
  let dpr = 1;
  let grainCanvas = null;
  let grainSkipCounter = 0;
  let animFrameId = null;

  function pad(n) {
    return String(n).padStart(5, '0');
  }

  // ============================================
  // HOTSPOT & POPUP SYSTEM
  // ============================================
  function buildHotspotOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'hotspot-overlay';
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 11;
      pointer-events: none;
    `;
    document.body.appendChild(overlay);

    SECTION_MAP.forEach(function (sec, i) {
      const dot = document.createElement('button');
      dot.className = 'hs-dot';
      dot.setAttribute('aria-label', 'Explore ' + sec.name);
      dot.setAttribute('data-section', i);
      dot.style.cssText = `
        position: absolute;
        left: ${sec.hotspot.x}%;
        top: ${sec.hotspot.y}%;
        transform: translate(-50%, -50%);
        width: 56px;
        height: 56px;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.6s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      `;

      dot.innerHTML = `
        <span class="hs-ring hs-ring-1"></span>
        <span class="hs-ring hs-ring-2"></span>
        <span class="hs-core">
          <svg class="hs-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
          </svg>
        </span>
        <span class="hs-label">${sec.label}</span>
      `;

      dot.addEventListener('click', function (e) {
        e.stopPropagation();
        openPopup(i);
      });

      overlay.appendChild(dot);
    });

    return overlay;
  }

  function buildPopup() {
    const backdrop = document.createElement('div');
    backdrop.id = 'hs-backdrop';
    backdrop.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 50;
      background: rgba(0,0,0,0.75);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.4s ease;
      backdrop-filter: blur(8px);
    `;
    backdrop.addEventListener('click', closePopup);

    const panel = document.createElement('div');
    panel.id = 'hs-panel';
    panel.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%) translateY(100%);
      z-index: 51;
      width: min(700px, 96vw);
      max-height: 80vh;
      overflow-y: auto;
      overscroll-behavior: contain;
      background: #080808;
      border: 1px solid rgba(212,175,55,0.2);
      border-bottom: none;
      border-radius: 24px 24px 0 0;
      padding: 0;
      transition: transform 0.48s cubic-bezier(0.32, 0.72, 0, 1);
      pointer-events: none;
    `;

    panel.innerHTML = `<div id="hs-panel-inner" style="padding: 44px 44px 56px;"></div>`;

    document.body.appendChild(backdrop);
    document.body.appendChild(panel);

    // Prevent scroll events inside the panel from propagating to lenis/ScrollTrigger
    panel.addEventListener('wheel', function (e) {
      e.stopPropagation();
    }, { passive: false });

    panel.addEventListener('touchmove', function (e) {
      e.stopPropagation();
    }, { passive: false });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePopup();
    });
  }

  function openPopup(sectionIndex) {
    const sec = SECTION_MAP[sectionIndex];
    const d = sec.details;
    const backdrop = document.getElementById('hs-backdrop');
    const panel = document.getElementById('hs-panel');
    const inner = document.getElementById('hs-panel-inner');

    const highlightsHTML = d.highlights
      .map((h, idx) => {
        const icon = BULLET_ICONS[idx % BULLET_ICONS.length];
        return `<li style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 14px; font-weight: 300; color: rgba(255,255,255,0.75); letter-spacing: 0.4px; list-style: none; display: flex; gap: 14px; align-items: flex-start;">
          <span style="flex-shrink:0; margin-top:2px;">${icon}</span>
          <span>${h}</span>
        </li>`;
      })
      .join('');

    const detailCards = [
      ['Area', d.area, DETAIL_ICONS['Area']],
      ['Ceiling', d.ceiling, DETAIL_ICONS['Ceiling']],
      ['Flooring', d.flooring, DETAIL_ICONS['Flooring']],
      ['Lighting', d.lighting, DETAIL_ICONS['Lighting']],
    ].map(([label, val, icon]) => `
      <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(212,175,55,0.14); border-radius:14px; padding:18px 20px; display:flex; flex-direction:column; gap:10px;">
        <div style="display:flex; align-items:center; gap:8px; color:rgba(212,175,55,0.75);">
          ${icon}
          <span style="font-size:10px; letter-spacing:3px; text-transform:uppercase; font-weight:500;">${label}</span>
        </div>
        <div style="font-size:13px; font-weight:400; color:#fff; line-height:1.5; letter-spacing:0.2px;">${val}</div>
      </div>`
    ).join('');

    inner.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:30px;">
        <div>
          <div style="font-size:9px; letter-spacing:6px; text-transform:uppercase; color:#d4af37; margin-bottom:12px; opacity:0.85;">${sec.label}</div>
          <h2 style="font-family:'Cormorant Garamond',serif; font-size:clamp(24px,4vw,38px); font-weight:300; color:#fff; letter-spacing:3px; margin:0; line-height:1.15;">${sec.name}</h2>
        </div>
        <button id="hs-close-btn" aria-label="Close" style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); border-radius:50%; width:42px; height:42px; cursor:pointer; color:rgba(255,255,255,0.8); font-size:16px; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:6px; transition: all 0.2s ease;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div style="width:40px; height:1px; background:linear-gradient(90deg,#d4af37,transparent); margin-bottom:24px;"></div>

      <p style="font-family:'Cormorant Garamond',serif; font-size:17px; font-weight:300; line-height:1.9; color:rgba(255,255,255,0.65); margin-bottom:36px; letter-spacing:0.4px; font-style:italic;">${d.description}</p>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px,1fr)); gap:14px; margin-bottom:36px;">
        ${detailCards}
      </div>

      <div style="border-top:1px solid rgba(255,255,255,0.07); padding-top:28px;">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:18px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" stroke-linecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span style="font-size:9px; letter-spacing:5px; text-transform:uppercase; color:rgba(255,255,255,0.3);">Signature Features</span>
        </div>
        <ul style="margin:0; padding:0;">${highlightsHTML}</ul>
      </div>

      <div style="margin-top:36px; text-align:center;">
        <a href="#contact-section" id="hs-cta" style="display:inline-flex; align-items:center; gap:10px; padding:15px 40px; background:linear-gradient(135deg,#d4af37,#c5a47e); color:#000; font-family:'Cormorant Garamond',serif; font-size:15px; font-weight:600; letter-spacing:4px; text-transform:uppercase; border-radius:50px; text-decoration:none; transition:opacity 0.2s ease;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
          Arrange a Viewing
        </a>
      </div>
    `;

    document.getElementById('hs-close-btn').addEventListener('click', closePopup);
    document.getElementById('hs-cta').addEventListener('click', closePopup);

    backdrop.style.opacity = '1';
    backdrop.style.pointerEvents = 'auto';
    panel.style.pointerEvents = 'auto';

    requestAnimationFrame(function () {
      panel.style.transform = 'translateX(-50%) translateY(0)';
    });

    // Lock body scroll but keep panel scrollable
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  function closePopup() {
    const backdrop = document.getElementById('hs-backdrop');
    const panel = document.getElementById('hs-panel');

    backdrop.style.opacity = '0';
    backdrop.style.pointerEvents = 'none';
    panel.style.transform = 'translateX(-50%) translateY(100%)';
    panel.style.pointerEvents = 'none';

    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }

  function updateHotspots(p) {
    const dots = document.querySelectorAll('.hs-dot');
    dots.forEach(function (dot, i) {
      const sec = SECTION_MAP[i];
      const visible = p >= sec.start && p < sec.end;
      dot.style.opacity = visible ? '1' : '0';
      dot.style.pointerEvents = visible ? 'auto' : 'none';
    });
  }

  function buildSectionLabels() {
    SECTION_MAP.forEach(function (sec, i) {
      var el = document.createElement('div');
      el.className = 'section-label ' + sec.pos;
      el.setAttribute('data-section', i);
      el.innerHTML =
        '<div class="label-tag">' + sec.label + '</div><div class="label-name">' + sec.name + '</div>';
      sectionLabelsContainer.appendChild(el);
    });
  }
  buildSectionLabels();
  buildHotspotOverlay();
  buildPopup();
  setupNavbar();
  setupContactForm();

  var sectionLabels = document.querySelectorAll('.section-label');

  function setupNavbar() {
    if (!hamburger || !navMenu) return;
    hamburger.addEventListener('click', function () {
      navMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
      });
    });
  }

  function setupContactForm() {
    if (!contactForm || !contactStatus) return;
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var name = contactForm.name.value.trim();
      var email = contactForm.email.value.trim();
      var message = contactForm.message.value.trim();
      var emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !email || !message) {
        contactStatus.textContent = 'Please complete all fields before sending.';
        contactStatus.classList.add('error');
        contactStatus.classList.remove('success');
        return;
      }
      if (!emailIsValid) {
        contactStatus.textContent = 'Please enter a valid email address.';
        contactStatus.classList.add('error');
        contactStatus.classList.remove('success');
        return;
      }

      contactStatus.textContent = 'Thank you! Your message has been received. We will reply shortly.';
      contactStatus.classList.remove('error');
      contactStatus.classList.add('success');
      contactForm.reset();
    });
  }

  function initScrollAnimations() {
    gsap.utils.toArray('.section-title').forEach(title => {
      gsap.fromTo(title, { y: 100, opacity: 0 }, {
        scrollTrigger: { trigger: title, start: 'top 95%', toggleActions: 'play none none reverse' },
        y: 0, opacity: 1, duration: 1.5, ease: 'expo.out', immediateRender: false
      });
    });
    gsap.utils.toArray('.section-subtitle').forEach(subtitle => {
      gsap.fromTo(subtitle, { y: 60, opacity: 0 }, {
        scrollTrigger: { trigger: subtitle, start: 'top 92%', toggleActions: 'play none none reverse' },
        y: 0, opacity: 1, duration: 1.5, delay: 0.2, ease: 'expo.out', immediateRender: false
      });
    });
    gsap.fromTo('.gallery-item', { y: 120, opacity: 0, scale: 0.9 }, {
      scrollTrigger: { trigger: '.gallery-grid', start: 'top 90%', toggleActions: 'play none none reverse' },
      y: 0, opacity: 1, scale: 1, duration: 1.8, stagger: 0.2, ease: 'expo.out', immediateRender: false
    });
    gsap.fromTo('.final-content > *', { y: 80, opacity: 0 }, {
      scrollTrigger: { trigger: '#final-section', start: 'top 85%', toggleActions: 'play none none reverse' },
      y: 0, opacity: 1, duration: 1.5, stagger: 0.2, ease: 'expo.out', immediateRender: false
    });
    gsap.fromTo('.contact-copy > *', { x: -80, opacity: 0 }, {
      scrollTrigger: { trigger: '.contact-wrapper', start: 'top 85%', toggleActions: 'play none none reverse' },
      x: 0, opacity: 1, duration: 1.5, stagger: 0.2, ease: 'expo.out', immediateRender: false
    });
    gsap.fromTo('.contact-form', { x: 80, opacity: 0 }, {
      scrollTrigger: { trigger: '.contact-wrapper', start: 'top 80%', toggleActions: 'play none none reverse' },
      x: 0, opacity: 1, duration: 1.5, ease: 'expo.out', immediateRender: false
    });
  }

  function animateHeroText() {
    const tl = gsap.timeline({
      defaults: { ease: 'power4.out', duration: 1.8 }
    });

    tl.fromTo('#hero-image', { scale: 1.1, filter: 'blur(10px) brightness(0.5)' }, { 
      scale: 1, 
      filter: 'blur(0px) brightness(1)', 
      duration: 3 
    }, 0);

    tl.fromTo('.hero-content', { 
      opacity: 0, 
      y: 40,
      scale: 0.98,
      backgroundColor: 'rgba(0,0,0,0)',
      backdropFilter: 'blur(0px)'
    }, { 
      opacity: 1, 
      y: 0,
      scale: 1, 
      backgroundColor: 'rgba(0,0,0,0.55)',
      backdropFilter: 'blur(18px)',
      duration: 2.5 
    }, 0.3);

    tl.to('.hero-label span', {
      y: 0,
      duration: 1.5,
    }, 0.8);

    tl.to('.hero-title-line span', {
      y: 0,
      stagger: 0.2,
      duration: 2,
    }, 1.1);

    tl.to('.scroll-indicator', {
      opacity: 1,
      y: 0,
      duration: 1.5
    }, 1.5);
  }

  function preloadImages() {
    var start = 0;
    var preloadedCount = 0;

    function loadBatch() {
      if (start >= TOTAL_FRAMES) return;
      var end = Math.min(start + BATCH_SIZE, TOTAL_FRAMES);
      var promises = [];

      for (var i = start; i < end; i++) {
        (function (idx) {
          promises.push(new Promise(function (resolve) {
            var img = new Image();
            img.onload = function () { images[idx] = img; preloadedCount++; resolve(); };
            img.onerror = function () { resolve(); };
            img.src = IMAGE_PATH + pad(idx + 1) + '.webp';
          }));
        })(i);
      }

      Promise.all(promises).then(function () {
        loadCount = preloadedCount;
        var pct = Math.round((loadCount / TOTAL_FRAMES) * 100);
        if (loadingBarFill) loadingBarFill.style.width = pct + '%';
        if (loadingPercent) loadingPercent.textContent = pct + '%';

        if (loadCount >= TOTAL_FRAMES && !allLoaded) {
          allLoaded = true;
          setTimeout(function () {
            if (loadingScreen) loadingScreen.classList.add('hidden');
            init();
          }, 600);
        } else if (loadCount >= TOTAL_FRAMES * 0.2 && !allLoaded) {
          setTimeout(function () {
            if (loadingScreen) loadingScreen.classList.add('hidden');
            allLoaded = true;
            init();
          }, 400);
        }
        start = end;
        loadBatch();
      });
    }
    loadBatch();
  }

  function resizeCanvas() {
    dpr = window.devicePixelRatio || 1;
    var w = window.innerWidth;
    var h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    lastRenderedFrame = -1;
  }

  function drawVignette(cw, ch) {
    var cx = cw / 2, cy = ch / 2;
    var r = Math.max(cw, ch) * 0.75;
    var grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(0.5, 'rgba(0,0,0,0.02)');
    grad.addColorStop(0.85, 'rgba(0,0,0,0.15)');
    grad.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cw, ch);
  }

  function drawGrain(cw, ch) {
    grainSkipCounter++;
    if (grainSkipCounter % 4 !== 0) return;
    if (!grainCanvas || grainCanvas.width !== cw || grainCanvas.height !== ch) {
      grainCanvas = document.createElement('canvas');
      grainCanvas.width = cw;
      grainCanvas.height = ch;
    }
    var gCtx = grainCanvas.getContext('2d');
    var imageData = gCtx.createImageData(cw, ch);
    var data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
      var noise = Math.random();
      var val = noise > 0.97 ? 6 : noise > 0.94 ? 3 : 0;
      data[i] = 255; data[i+1] = 255; data[i+2] = 255; data[i+3] = val;
    }
    gCtx.putImageData(imageData, 0, 0);
    ctx.drawImage(grainCanvas, 0, 0, cw, ch);
  }

  function drawLetterboxBars(cw, ch, p) {
    if (p <= 0.85) return;
    var bh = 48;
    var bp = Math.min(1, Math.max(0, (p - 0.85) / 0.15));
    var tp = Math.min(1, Math.max(0, (p - 0.88) / 0.12));
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, cw, bh * tp);
    ctx.fillRect(0, ch - bh * bp, cw, bh * bp);
  }

  function renderFrame(frameIndex) {
    var ci = Math.max(0, Math.min(frameIndex, TOTAL_FRAMES - 1));
    var img = images[ci];
    if (!img) return -1;
    var cw = canvas.width / dpr;
    var ch = canvas.height / dpr;
    ctx.clearRect(0, 0, cw, ch);
    var scale = Math.max(cw / img.width, ch / img.height);
    var ix = (cw - img.width * scale) / 2;
    var iy = (ch - img.height * scale) / 2;
    ctx.drawImage(img, ix, iy, img.width * scale, img.height * scale);
    drawVignette(cw, ch);
    drawGrain(cw, ch);
    drawLetterboxBars(cw, ch, progress);
    return ci;
  }

  function updateOverlays(p) {
    if (letterboxTop) letterboxTop.classList.toggle('active', p > 0.85);
    if (letterboxBottom) letterboxBottom.classList.toggle('active', p > 0.85);
    if (imageCredit) imageCredit.classList.toggle('visible', p > 0.93);
    if (progressFill) progressFill.style.width = p * 100 + '%';
    if (progressText) progressText.textContent = Math.round(p * 100) + '%';
    if (progressCircleFill) progressCircleFill.style.strokeDashoffset = 100 - p * 100;
    for (var i = 0; i < sectionLabels.length; i++) {
      var sec = SECTION_MAP[i];
      var visible = p >= sec.start && p < sec.end;
      sectionLabels[i].classList.toggle('visible', visible);
    }
    updateHotspots(p);
  }

  function init() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    var scrollDistance = window.innerHeight * SCROLL_HEIGHT_MULTIPLIER;
    scrollContainer.style.height = scrollDistance + window.innerHeight + 'px';

    var lenis = new Lenis({
      duration: 1.4,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      orientation: 'vertical',
      smoothWheel: true,
      gestureOrientation: 'vertical',
      wheelMultiplier: 0.8,
      touchMultiplier: 1.2,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    function loop() {
      var fi = Math.round(progress * (TOTAL_FRAMES - 1));
      if (fi !== lastRenderedFrame) {
        lastRenderedFrame = renderFrame(fi);
      }
      updateOverlays(progress);
      animFrameId = requestAnimationFrame(loop);
    }

    var canvasElement = document.getElementById('cinematic-canvas');
    var canvasActive = false;

    ScrollTrigger.create({
      trigger: scrollContainer,
      start: 'top top',
      end: '+=' + scrollDistance,
      scrub: 2.0,
      anticipatePin: 1,
      onUpdate: function (self) {
        progress = self.progress;
        if (!canvasActive && progress > 0) {
          canvasActive = true;
          canvasElement.classList.add('active');
          scrollContainer.classList.add('active');
        }
      },
    });

    animFrameId = requestAnimationFrame(loop);
    renderFrame(0);
    initScrollAnimations();
    animateHeroText();

    canvasElement.classList.add('active');
    scrollContainer.classList.add('active');
    canvasActive = true;

    setTimeout(function () { ScrollTrigger.refresh(); }, 200);
  }

  preloadImages();
})();