/**
 * Johnny's Evolution — Nail Salon
 * script.js — Interactions & Animations
 */

'use strict';

/* ============================================================
   1. STICKY HEADER — scroll-triggered class
   ============================================================ */
(function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const SCROLL_THRESHOLD = 60;

  function onScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load in case user refreshes mid-page
})();


/* ============================================================
   2. MOBILE NAV — toggle open/close + close on link click
   ============================================================ */
(function initMobileNav() {
  const toggle  = document.getElementById('nav-toggle');
  const navMobile = document.getElementById('nav-mobile');
  if (!toggle || !navMobile) return;

  function openMenu() {
    toggle.classList.add('open');
    navMobile.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    navMobile.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // prevent scroll behind menu
  }

  function closeMenu() {
    toggle.classList.remove('open');
    navMobile.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    navMobile.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', function () {
    const isOpen = navMobile.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  // Close on link click
  navMobile.querySelectorAll('.mobile-link').forEach(function (link) {
    link.addEventListener('click', function () {
      closeMenu();
    });
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (
      navMobile.classList.contains('open') &&
      !navMobile.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMobile.classList.contains('open')) {
      closeMenu();
      toggle.focus();
    }
  });
})();


/* ============================================================
   3. SMOOTH SCROLL — for anchor links
   (CSS scroll-behavior handles most of it; this handles edge
   cases like offset for the sticky header)
   ============================================================ */
(function initSmoothScroll() {
  const HEADER_HEIGHT = 72;

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const targetTop = target.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth',
      });
    });
  });
})();


/* ============================================================
   4. INTERSECTION OBSERVER — fade-up & reveal animations
   ============================================================ */
(function initRevealAnimations() {
  // Animate hero elements that use .fade-up class
  function activateFadeUps() {
    document.querySelectorAll('.fade-up').forEach(function (el, i) {
      // Slight timeout so CSS transition has a chance to be parsed
      setTimeout(function () {
        el.classList.add('in');
      }, 120 + i * 80);
    });
  }

  // Observer for scroll-triggered .reveal elements
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  // Kick off hero animation after a brief delay
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(activateFadeUps, 200);
    });
  } else {
    setTimeout(activateFadeUps, 200);
  }
})();


/* ============================================================
   5. BACK TO TOP BUTTON
   ============================================================ */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const SHOW_AT = 500;

  function onScroll() {
    if (window.scrollY > SHOW_AT) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ============================================================
   6. HERO PARALLAX — subtle depth effect on scroll
   ============================================================ */
(function initHeroParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  // Only run on non-reduced-motion devices and desktop
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  function onScroll() {
    const scrollY = window.scrollY;
    if (scrollY > window.innerHeight) return; // stop after hero
    const offset = scrollY * 0.22;
    heroBg.style.transform = 'scale(1.04) translateY(' + offset + 'px)';
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ============================================================
   7. SERVICE CARDS — staggered entry animation
   ============================================================ */
(function initServiceCards() {
  const cards = document.querySelectorAll('.service-card');
  if (!cards.length) return;

  const cardObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const card = entry.target;
          const idx = Array.from(cards).indexOf(card);
          setTimeout(function () {
            card.classList.add('in');
          }, idx * 80);
          cardObserver.unobserve(card);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );

  cards.forEach(function (card) {
    cardObserver.observe(card);
  });
})();


/* ============================================================
   8. GALLERY LIGHTBOX — accessible simple lightbox
   ============================================================ */
(function initGalleryLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;

  // Build lightbox DOM
  const overlay = document.createElement('div');
  overlay.id = 'gallery-lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Image viewer');
  overlay.setAttribute('tabindex', '-1');
  overlay.style.cssText = [
    'position:fixed',
    'inset:0',
    'z-index:9999',
    'background:rgba(30,15,10,0.92)',
    'display:flex',
    'align-items:center',
    'justify-content:center',
    'padding:24px',
    'opacity:0',
    'pointer-events:none',
    'transition:opacity 0.3s ease',
    'cursor:zoom-out',
  ].join(';');

  const lightboxImg = document.createElement('img');
  lightboxImg.style.cssText = [
    'max-width:90vw',
    'max-height:88vh',
    'object-fit:contain',
    'border-radius:8px',
    'box-shadow:0 24px 80px rgba(0,0,0,0.6)',
    'transform:scale(0.94)',
    'transition:transform 0.3s ease',
    'cursor:default',
  ].join(';');
  lightboxImg.setAttribute('alt', '');

  const closeBtn = document.createElement('button');
  closeBtn.setAttribute('aria-label', 'Close image viewer');
  closeBtn.style.cssText = [
    'position:absolute',
    'top:20px',
    'right:20px',
    'width:44px',
    'height:44px',
    'background:rgba(255,255,255,0.12)',
    'border:1px solid rgba(255,255,255,0.2)',
    'border-radius:50%',
    'color:#fff',
    'font-size:1.4rem',
    'display:flex',
    'align-items:center',
    'justify-content:center',
    'cursor:pointer',
    'transition:background 0.2s ease',
    'line-height:1',
  ].join(';');
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('mouseenter', function () {
    closeBtn.style.background = 'rgba(255,255,255,0.22)';
  });
  closeBtn.addEventListener('mouseleave', function () {
    closeBtn.style.background = 'rgba(255,255,255,0.12)';
  });

  overlay.appendChild(lightboxImg);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';
    lightboxImg.style.transform = 'scale(1)';
    document.body.style.overflow = 'hidden';
    overlay.focus();
  }

  function closeLightbox() {
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    lightboxImg.style.transform = 'scale(0.94)';
    document.body.style.overflow = '';
  }

  items.forEach(function (item) {
    const img = item.querySelector('img');
    if (!img) return;
    item.style.cursor = 'zoom-in';
    item.addEventListener('click', function () {
      openLightbox(img.src, img.alt);
    });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(img.src, img.alt);
      }
    });
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', 'View image: ' + (img.alt || 'Gallery image'));
  });

  overlay.addEventListener('click', function (e) {
    if (e.target !== lightboxImg) closeLightbox();
  });
  closeBtn.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });
})();


/* ============================================================
   9. ACTIVE NAV LINK HIGHLIGHT — scroll spy
   ============================================================ */
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-desktop a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            link.style.color = '';
            if (link.getAttribute('href') === '#' + id) {
              link.style.color = 'var(--clr-primary)';
            }
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });
})();


/* ============================================================
   10. LAZY IMAGE LOADING — polyfill / enhance native lazy
   ============================================================ */
(function initLazyImages() {
  // If native lazy loading is not supported, use IntersectionObserver
  if ('loading' in HTMLImageElement.prototype) return;

  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if (!lazyImages.length) return;

  const imgObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        imgObserver.unobserve(img);
      }
    });
  });

  lazyImages.forEach(function (img) {
    imgObserver.observe(img);
  });
})();
