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
  
  // Premium section markers for cinematic storytelling
  const SECTION_MAP = [
    { label: '01 — Entry', name: 'The Arrival Lounge', start: 0.02, end: 0.20, pos: 'bl' },
    { label: '02 — Living', name: 'The Grand Salon', start: 0.20, end: 0.42, pos: 'tr' },
    { label: '03 — Passage', name: 'The Gallery Corridor', start: 0.42, end: 0.62, pos: 'br' },
    { label: '04 — Retreat', name: 'The Private Study', start: 0.62, end: 0.80, pos: 'tl' },
    { label: '05 — Master', name: 'The Signature Penthouse', start: 0.80, end: 0.94, pos: 'bl' },
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
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

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
  let perfMetrics = { fps: 0, frameDrops: 0 };

  function pad(n) {
    return String(n).padStart(5, '0');
  }

  function buildSectionLabels() {
    SECTION_MAP.forEach(function (sec, i) {
      var el = document.createElement('div');
      el.className = 'section-label ' + sec.pos;
      el.setAttribute('data-section', i);
      el.innerHTML =
        '<div class="label-tag">' +
        sec.label +
        '</div><div class="label-name">' +
        sec.name +
        '</div>';
      sectionLabelsContainer.appendChild(el);
    });
  }
  buildSectionLabels();
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
    // Reveal all section titles
    gsap.utils.toArray('.section-title').forEach(title => {
      gsap.fromTo(title, 
        { y: 100, opacity: 0 },
        {
          scrollTrigger: {
            trigger: title,
            start: 'top 95%',
            toggleActions: 'play none none reverse',
            // markers: true, // Uncomment for debugging
          },
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: 'expo.out',
          immediateRender: false
        }
      );
    });

    // Reveal all section subtitles
    gsap.utils.toArray('.section-subtitle').forEach(subtitle => {
      gsap.fromTo(subtitle, 
        { y: 60, opacity: 0 },
        {
          scrollTrigger: {
            trigger: subtitle,
            start: 'top 92%',
            toggleActions: 'play none none reverse',
          },
          y: 0,
          opacity: 1,
          duration: 1.5,
          delay: 0.2,
          ease: 'expo.out',
          immediateRender: false
        }
      );
    });

    // Gallery Items reveal
    gsap.fromTo('.gallery-item', 
      { y: 120, opacity: 0, scale: 0.9 },
      {
        scrollTrigger: {
          trigger: '.gallery-grid',
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.8,
        stagger: 0.2,
        ease: 'expo.out',
        immediateRender: false
      }
    );

    // Final CTA reveal
    gsap.fromTo('.final-content > *', 
      { y: 80, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '#final-section',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.2,
        ease: 'expo.out',
        immediateRender: false
      }
    );

    // Contact Section reveals
    gsap.fromTo('.contact-copy > *', 
      { x: -80, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '.contact-wrapper',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        x: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.2,
        ease: 'expo.out',
        immediateRender: false
      }
    );

    gsap.fromTo('.contact-form', 
      { x: 80, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '.contact-wrapper',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        x: 0,
        opacity: 1,
        duration: 1.5,
        ease: 'expo.out',
        immediateRender: false
      }
    );
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
          promises.push(
            new Promise(function (resolve) {
              var img = new Image();
              img.onload = function () {
                images[idx] = img;
                preloadedCount++;
                resolve();
              };
              img.onerror = function () {
                console.warn('Failed to load image: ' + IMAGE_PATH + pad(idx + 1) + '.webp');
                resolve();
              };
              img.src = IMAGE_PATH + pad(idx + 1) + '.webp';
            })
          );
        })(i);
      }

      Promise.all(promises).then(function () {
        loadCount = preloadedCount;
        var pct = Math.round((loadCount / TOTAL_FRAMES) * 100);

        if (loadingBarFill) loadingBarFill.style.width = pct + '%';
        if (loadingPercent) loadingPercent.textContent = pct + '%';

        // Allow starting experience at 20% loaded for faster initial display
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
    var cx = cw / 2;
    var cy = ch / 2;
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
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = val;
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

    // Optimized image scaling for centered cover fit
    var scale = Math.max(cw / img.width, ch / img.height);
    var ix = (cw - img.width * scale) / 2;
    var iy = (ch - img.height * scale) / 2;

    ctx.drawImage(img, ix, iy, img.width * scale, img.height * scale);
    
    // Layer cinematic effects
    drawVignette(cw, ch);
    drawGrain(cw, ch);
    drawLetterboxBars(cw, ch, progress);

    return ci;
  }

  function updateOverlays(p) {
    // Only show overlays during animation sequence
    if (letterboxTop) letterboxTop.classList.toggle('active', p > 0.85);
    if (letterboxBottom) letterboxBottom.classList.toggle('active', p > 0.85);
    if (imageCredit) imageCredit.classList.toggle('visible', p > 0.93);
    
    if (progressFill) {
      progressFill.style.width = p * 100 + '%';
    }
    if (progressText) {
      progressText.textContent = Math.round(p * 100) + '%';
    }
    if (progressCircleFill) {
      progressCircleFill.style.strokeDashoffset = 100 - p * 100;
    }

    // Show section labels during animation
    for (var i = 0; i < sectionLabels.length; i++) {
      var sec = SECTION_MAP[i];
      var visible = p >= sec.start && p < sec.end;
      sectionLabels[i].classList.toggle('visible', visible);
    }
  }

  function init() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Only animate the scroll container (not hero)
    var scrollDistance = window.innerHeight * SCROLL_HEIGHT_MULTIPLIER;
    scrollContainer.style.height = scrollDistance + window.innerHeight + 'px';


    var lenis = new Lenis({
      duration: 1.4,
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      orientation: 'vertical',
      smoothWheel: true,
      gestureOrientation: 'vertical',
      wheelMultiplier: 0.8,
      touchMultiplier: 1.2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    function loop() {
      var fi = Math.round(progress * (TOTAL_FRAMES - 1));
      if (fi !== lastRenderedFrame) {
        lastRenderedFrame = renderFrame(fi);
      }
      updateOverlays(progress);
      animFrameId = requestAnimationFrame(loop);
    }

    // Create scroll trigger only for animation section
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
        
        // Ensure canvas is active if we reached this point
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

    // Immediately activate canvas once the first frame is ready
    canvasElement.classList.add('active');
    scrollContainer.classList.add('active');
    canvasActive = true;
    
    // Refresh ScrollTrigger after a short delay to ensure layout is settled
    setTimeout(function() {
      ScrollTrigger.refresh();
    }, 200);
  }

  preloadImages();
})();
