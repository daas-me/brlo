/* ═══════════════════════════════════════════════════
   main.js — BRLO Shared Utilities
   Handles hamburger menu for mobile only.
   Active nav styling is handled via hardcoded
   class="active" in each page's HTML.
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  function initHamburger() {
    const nav      = document.querySelector('nav');
    const navLinks = nav && nav.querySelector('.nav-links');
    if (!nav || !navLinks) return;

    const btn = document.createElement('button');
    btn.className    = 'nav-hamburger';
    btn.setAttribute('aria-label', 'Toggle navigation');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = `
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    `;

    nav.insertBefore(btn, navLinks);

    btn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('mobile-open');
      btn.classList.toggle('is-open', isOpen);
      btn.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        btn.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('click', e => {
      if (!nav.contains(e.target) && navLinks.classList.contains('mobile-open')) {
        navLinks.classList.remove('mobile-open');
        btn.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', initHamburger);

})();