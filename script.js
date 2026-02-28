/* ═══════════════════════════════════════════════════════
   OKTYA SALSABELLA — PORTFOLIO
   script.js
═══════════════════════════════════════════════════════ */

'use strict';

/* ── DOM REFS ── */
const hamburgerBtn = document.getElementById('hamburgerBtn');
const menuOverlay  = document.getElementById('menuOverlay');
const menuClose    = document.getElementById('menuClose');
const menuLinks    = document.querySelectorAll('.menu-link');
const navbar       = document.getElementById('navbar');
const navLinksDt   = document.querySelectorAll('.nav-links-desktop a');
const reveals      = document.querySelectorAll('.reveal');
const sections     = document.querySelectorAll('section[id]');

/* ════════════════════════════════════
   1. HAMBURGER MENU
════════════════════════════════════ */
function openMenu() {
  menuOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  menuOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

hamburgerBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (menuOverlay.classList.contains('open')) {
    closeMenu();
  } else {
    openMenu();
  }
});

menuClose.addEventListener('click', closeMenu);

// Close when clicking outside the dropdown (desktop)
document.addEventListener('click', (e) => {
  if (
    menuOverlay.classList.contains('open') &&
    !menuOverlay.contains(e.target) &&
    !hamburgerBtn.contains(e.target)
  ) {
    closeMenu();
  }
});

// Close on link click + smooth-scroll
menuLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    closeMenu();
    if (target) {
      setTimeout(() => {
        const offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-h')) || 68;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }, 300); // wait for overlay to close
    }
  });
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menuOverlay.classList.contains('open')) closeMenu();
});


/* ════════════════════════════════════
   2. NAVBAR SCROLL STYLE
════════════════════════════════════ */
function updateNavbar() {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();


/* ════════════════════════════════════
   3. ACTIVE NAV LINK (desktop + menu)
════════════════════════════════════ */
function updateActiveSection() {
  let current = '';
  const navH = parseInt(getComputedStyle(document.documentElement)
    .getPropertyValue('--nav-h')) || 68;

  sections.forEach((sec) => {
    const top = sec.getBoundingClientRect().top;
    if (top <= navH + 60) current = sec.id;
  });

  // Desktop links
  navLinksDt.forEach((a) => {
    const href = a.getAttribute('href')?.replace('#', '');
    a.style.color = href === current ? 'var(--white)' : '';
  });

  // Menu overlay links
  menuLinks.forEach((a) => {
    const sec = a.dataset.section;
    if (sec === current) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
}

window.addEventListener('scroll', updateActiveSection, { passive: true });
updateActiveSection();


/* ════════════════════════════════════
   4. SCROLL REVEAL
════════════════════════════════════ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      // Stagger siblings inside same parent
      const siblings = Array.from(
        entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')
      );
      const idx = siblings.indexOf(entry.target);
      const delay = Math.min(idx * 90, 360); // cap at 360ms

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

reveals.forEach((el) => revealObserver.observe(el));


/* ════════════════════════════════════
   5. DOC-SLOT EMPTY STATE HELPER
   Automatically adds .doc-empty class when
   image fails to load, revealing the
   placeholder label.
════════════════════════════════════ */
document.querySelectorAll('.skill-doc-slot img, .exp-doc-slot img, .project-doc-slot img, .creator-doc-slot img').forEach((img) => {
  img.addEventListener('error', () => {
    img.parentElement.classList.add('doc-empty');
  });

  // If already broken (cached fail)
  if (img.complete && img.naturalWidth === 0) {
    img.parentElement.classList.add('doc-empty');
  }
});

/* ════════════════════════════════════
   6. HERO PHOTO PLACEHOLDER
════════════════════════════════════ */
const heroImg = document.querySelector('.hero-photo img');
if (heroImg) {
  heroImg.addEventListener('error', () => {
    heroImg.parentElement.classList.add('photo-placeholder');
  });
  if (heroImg.complete && heroImg.naturalWidth === 0) {
    heroImg.parentElement.classList.add('photo-placeholder');
  }
}


/* ════════════════════════════════════
   7. SMOOTH SCROLL for desktop nav links
════════════════════════════════════ */
navLinksDt.forEach((a) => {
  const href = a.getAttribute('href');
  if (!href || !href.startsWith('#')) return;

  a.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;
    const navH = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h')) || 68;
    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* Also handle the hero CTA buttons */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h')) || 68;
    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
