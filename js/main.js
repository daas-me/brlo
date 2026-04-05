/* ═══════════════════════════════════════════════════
   main.js — BRLO Shared Utilities
   Runs on every page. Handles nav active state.
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /**
   * Highlights the correct nav link based on the current page filename.
   * Nav links use data-page="<filename>" to declare their identity.
   */
  function setActiveNavLink() {
    const path     = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';

    document.querySelectorAll('.nav-links a[data-page]').forEach(link => {
      link.classList.remove('active');
      if (link.dataset.page === filename) {
        link.classList.add('active');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', setActiveNavLink);
})();