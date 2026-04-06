/* ═══════════════════════════════════════════════════
   main.js — BRLO Shared Utilities
   Runs on every page. Handles nav active state
   and hamburger menu for mobile.
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── ACTIVE NAV LINK ──────────────────────────────
     Matches the current page filename against each
     link's data-page attribute. Falls back to
     index.html when the path ends in "/" or is empty.
  ─────────────────────────────────────────────────── */
  function setActiveNavLink() {
    const path     = window.location.pathname;
    const parts    = path.split('/').filter(Boolean);
    const filename = parts.length ? parts[parts.length - 1] : 'index.html';

    // Normalise: treat bare "/" or "" as index.html
    const current = (filename === '' || !filename.includes('.'))
      ? 'index.html'
      : filename;

    document.querySelectorAll('.nav-links a[data-page]').forEach(link => {
      link.classList.remove('active');
      if (link.dataset.page === current) {
        link.classList.add('active');
      }
    });
  }

  /* ── HAMBURGER MENU ───────────────────────────────
     Injects the toggle button into the existing <nav>
     and wires open / close / outside-click behaviour.
  ─────────────────────────────────────────────────── */
  function initHamburger() {
    const nav      = document.querySelector('nav');
    const navLinks = nav && nav.querySelector('.nav-links');
    if (!nav || !navLinks) return;

    // Create button
    const btn = document.createElement('button');
    btn.className    = 'nav-hamburger';
    btn.setAttribute('aria-label', 'Toggle navigation');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = `
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    `;

    // Insert before the nav-links list
    nav.insertBefore(btn, navLinks);

    // Toggle
    btn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('mobile-open');
      btn.classList.toggle('is-open', isOpen);
      btn.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        btn.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close when clicking outside
    document.addEventListener('click', e => {
      if (!nav.contains(e.target) && navLinks.classList.contains('mobile-open')) {
        navLinks.classList.remove('mobile-open');
        btn.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setActiveNavLink();
    initHamburger();
  });

})();