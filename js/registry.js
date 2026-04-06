/* ═══════════════════════════════════════════════════
   registry.js — BusinessRegistry Class
   Encapsulates all business registry logic:
   filtering, searching, rendering cards, and the modal.
   Depends on: data.js (BUSINESSES constant)
   ═══════════════════════════════════════════════════ */

class BusinessRegistry {
  /**
   * @param {Object} options
   * @param {string} options.gridId       — ID of the card grid container
   * @param {string} options.searchId     — ID of the search input
   * @param {string} options.countId      — ID of the result count element
   * @param {string} options.modalId      — ID of the modal overlay
   * @param {Array}  options.data         — The businesses array (from data.js)
   */
  constructor({ gridId, searchId, countId, modalId, data }) {
    this._data          = data;
    this._currentFilter = 'All';
    this._currentSearch = '';

    // DOM references
    this._grid   = document.getElementById(gridId);
    this._search = document.getElementById(searchId);
    this._count  = document.getElementById(countId);
    this._modal  = document.getElementById(modalId);

    this._bindEvents();
    this.render();
  }

  /* ── PUBLIC ─────────────────────────────────────── */

  /** Set the section filter and re-render. */
  setFilter(section, btnEl) {
    this._currentFilter = section;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');
    this.render();
  }

  /** Open the detail modal for a business by its index. */
  openModal(index) {
    const b = this._data[index];
    this._populateModal(b);
    this._modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  /** Close the detail modal. */
  closeModal() {
    this._modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  /** Apply current search + filter and re-render cards. */
  render() {
    const filtered = this._filtered();
    this._updateCount(filtered.length);
    this._renderCards(filtered);
  }

  /* ── PRIVATE ────────────────────────────────────── */

  _bindEvents() {
    // Search
    if (this._search) {
      this._search.addEventListener('input', () => {
        this._currentSearch = this._search.value.toLowerCase().trim();
        this.render();
      });
    }

    // Modal — close when clicking the backdrop
    if (this._modal) {
      this._modal.addEventListener('click', e => {
        if (e.target === this._modal) this.closeModal();
      });
    }

    // Modal — close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.closeModal();
    });
  }

  _filtered() {
    return this._data.filter(b => {
      const matchSection =
        this._currentFilter === 'All' ||
        b.section === this._currentFilter;

      const q = this._currentSearch;
      const matchSearch =
        !q ||
        b.businessName.toLowerCase().includes(q) ||
        b.owner.toLowerCase().includes(q) ||
        b.nature.toLowerCase().includes(q) ||
        b.members.some(m => m.name.toLowerCase().includes(q));

      return matchSection && matchSearch;
    });
  }

  _updateCount(count) {
    if (this._count) {
      this._count.textContent = `${count} business${count !== 1 ? 'es' : ''} found`;
    }
  }

  _renderCards(list) {
    if (list.length === 0) {
      this._grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
          <p>No registered businesses found.</p>
        </div>`;
      return;
    }

    this._grid.innerHTML = list.map(b => {
      const idx = this._data.indexOf(b);
      return `
        <div class="biz-card" onclick="registry.openModal(${idx})" role="button" tabindex="0"
             onkeypress="if(event.key==='Enter')registry.openModal(${idx})">
          <div class="card-top">
            <div class="biz-logo-wrap">
              ${this._logoTag(b, 'biz-logo-placeholder')}
            </div>
            <div class="card-badges">
              <span class="badge-section ${b.section}">${b.section}</span>
              <span class="badge-active">Active</span>
            </div>
          </div>

          <div class="biz-name">${this._esc(b.businessName)}</div>
          ${b.catchphrase
            ? `<div class="biz-catchphrase">"${this._esc(b.catchphrase)}"</div>`
            : ''}
          <div class="biz-nature"><i class="fa-solid fa-shapes"></i> ${this._esc(b.nature)}</div>

          <hr class="card-divider">

          <div class="card-meta">
            <div class="meta-row">
              <strong>Proprietor</strong>
              <span>${this._esc(b.owner)}</span>
            </div>
            <div class="meta-row">
              <strong>Address</strong>
              <span>${this._esc(b.address)}</span>
            </div>
            <div class="meta-row">
              <strong>Email</strong>
              <span>${this._esc(b.email || '—')}</span>
            </div>
          </div>

          <div class="card-footer">
            <span class="permit-no">${this._esc(b.permitNo)}</span>
            <span class="view-btn">View Details →</span>
          </div>
        </div>`;
    }).join('');
  }

  _populateModal(b) {
    this._set('modal-biz-name',   b.businessName);
    this._set('modal-catchphrase', b.catchphrase ? `"${b.catchphrase}"` : '');
    this._set('m-permit',   b.permitNo);
    this._set('m-date',     b.dateRegistered);
    this._set('m-nature',   b.nature);
    this._set('m-section',  b.section);
    this._set('m-address',  b.address);
    this._set('m-owner',    b.owner);
    this._set('m-payment',  b.payment || '—');
    this._set('m-products', b.products || '—');

    // Email with mailto link
    const emailEl = document.getElementById('m-email');
    if (emailEl) {
      emailEl.innerHTML = b.email
        ? `<a href="mailto:${this._esc(b.email)}">${this._esc(b.email)}</a>`
        : '—';
    }

    // Logo
    const logoWrap = document.getElementById('modal-logo-wrap');
    if (logoWrap) {
      logoWrap.innerHTML = b.logo
        ? `<img src="${b.logo}" alt="${this._esc(b.businessName)}"
             onerror="this.parentElement.innerHTML='<div class=modal-logo-placeholder>${this._initials(b.businessName)}</div>'">`
        : `<div class="modal-logo-placeholder">${this._initials(b.businessName)}</div>`;
    }

    // Badges
    const badges = document.getElementById('modal-badges');
    if (badges) {
      badges.innerHTML = [
        b.section,
        b.nature,
        'Active 2026',
      ].map(t => `<span class="modal-badge">${this._esc(t)}</span>`).join('');
    }

    // Members
    const membersList = document.getElementById('m-members');
    if (membersList) {
      membersList.innerHTML = b.members.map(m =>
        `<span class="member-chip ${m.isLeader ? 'leader' : ''}">
          ${this._esc(m.name)}${m.isLeader ? ' <i class="fa-solid fa-star" style="font-size:10px;"></i>' : ''}
        </span>`
      ).join('');
    }
  }

  /* ── UTILITIES ──────────────────────────────────── */

  _initials(name) {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  _esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  _set(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  _logoTag(b, placeholderClass) {
    if (b.logo) {
      return `<img src="${b.logo}" alt="${this._esc(b.businessName)}"
        onerror="this.parentElement.innerHTML='<div class=&quot;${placeholderClass}&quot;>${this._initials(b.businessName)}</div>'">`;
    }
    return `<div class="${placeholderClass}">${this._initials(b.businessName)}</div>`;
  }
}