/* ═══════════════════════════════════════════════════
   registry.js — BusinessRegistry Class
   Encapsulates all business registry logic:
   filtering, searching, rendering cards, and the modal.
   Depends on: data.js (BUSINESSES constant)
   ═══════════════════════════════════════════════════ */

class BusinessRegistry {
  constructor({ gridId, searchId, countId, modalId, data }) {
    this._data          = data;
    this._currentFilter = 'All';
    this._currentSearch = '';
    this._currentSort   = 'default';

    this._grid   = document.getElementById(gridId);
    this._search = document.getElementById(searchId);
    this._count  = document.getElementById(countId);
    this._modal  = document.getElementById(modalId);
    this._sortDropdown    = document.querySelector('.sort-dropdown');
    this._sortToggle      = document.querySelector('.sort-toggle');
    this._sortMenu        = document.querySelector('.sort-menu');
    this._sectionDropdown = document.querySelector('.section-dropdown');
    this._sectionToggle   = document.querySelector('.section-toggle');
    this._sectionMenu     = document.querySelector('.section-menu');

    this._bindEvents();
    this.render();
  }

  /* ── PUBLIC ─────────────────────────────────────── */

  setFilter(section, btnEl) {
    this._currentFilter = section;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.section-option').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    if (this._sectionToggle) {
      const label = section === 'All' ? 'All' : section;
      this._sectionToggle.innerHTML = `<i class="fa-solid fa-filter"></i> <span class="toggle-label">Section: ${label}</span> <i class="fa-solid fa-chevron-down"></i>`;
    }
    this._closeSectionMenu();
    this.render();
  }

  setSort(sortMode, btnEl) {
    this._currentSort = sortMode;
    document.querySelectorAll('.sort-option').forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');
    const labels = {
      default: 'Default',
      newest: 'Newest',
      alpha: 'A → Z',
      reverseAlpha: 'Z → A',
    };
    if (this._sortToggle) {
      this._sortToggle.innerHTML = `<i class="fa-solid fa-sort"></i> <span class="toggle-label">Sort: ${labels[sortMode] || 'Default'}</span> <i class="fa-solid fa-chevron-down"></i>`;
    }
    this._closeSortMenu();
    this.render();
  }

  toggleSortMenu() {
    if (!this._sortDropdown) return;
    this._sortDropdown.classList.toggle('open');
  }

  toggleSectionMenu() {
    if (!this._sectionDropdown) return;
    this._sectionDropdown.classList.toggle('open');
  }

  _closeSortMenu() {
    if (!this._sortDropdown) return;
    this._sortDropdown.classList.remove('open');
  }

  _closeSectionMenu() {
    if (!this._sectionDropdown) return;
    this._sectionDropdown.classList.remove('open');
  }

  openModal(index) {
    const b = this._data[index];
    this._populateModal(b);
    this._modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this._modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  render() {
    const filtered = this._filtered();
    this._updateCount(filtered.length);
    this._renderCards(filtered);
  }

  /* ── PRIVATE ────────────────────────────────────── */

  _bindEvents() {
    if (this._search) {
      this._search.addEventListener('input', () => {
        this._currentSearch = this._search.value.toLowerCase().trim();
        this.render();
      });
    }
    if (this._modal) {
      this._modal.addEventListener('click', e => {
        if (e.target === this._modal) this.closeModal();
      });
    }
    document.addEventListener('click', e => {
      if (this._sortDropdown && !this._sortDropdown.contains(e.target)) {
        this._closeSortMenu();
      }
      if (this._sectionDropdown && !this._sectionDropdown.contains(e.target)) {
        this._closeSectionMenu();
      }
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        this.closeModal();
        this._closeSortMenu();
        this._closeSectionMenu();
      }
    });
  }

  _filtered() {
    const filtered = this._data.filter(b => {
      const matchSection =
        this._currentFilter === 'All' || b.section === this._currentFilter;
      const q = this._currentSearch;
      const matchSearch =
        !q ||
        b.businessName.toLowerCase().includes(q) ||
        b.owner.toLowerCase().includes(q) ||
        b.nature.toLowerCase().includes(q) ||
        b.members.some(m => m.name.toLowerCase().includes(q));
      return matchSection && matchSearch;
    });
    return this._sortList(filtered);
  }

  _updateCount(count) {
    if (this._count) {
      this._count.textContent = `${count} business${count !== 1 ? 'es' : ''} found`;
    }
  }

  _sortList(list) {
    if (this._currentSort === 'newest') {
      return list.slice().sort((a, b) => {
        const aDate = new Date(a.dateRegistered).getTime() || 0;
        const bDate = new Date(b.dateRegistered).getTime() || 0;
        return bDate - aDate;
      });
    }
    if (this._currentSort === 'alpha') {
      return list.slice().sort((a, b) => a.businessName.localeCompare(b.businessName));
    }
    if (this._currentSort === 'reverseAlpha') {
      return list.slice().sort((a, b) => b.businessName.localeCompare(a.businessName));
    }
    return list;
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
      
      // Grab the first valid photo from the coverPhotos array, or fallback
      const photos = this._getPhotos(b);
      const firstCover = photos.length > 0 ? photos[0] : null;

      return `
        <div class="biz-card" onclick="registry.openModal(${idx})" role="button" tabindex="0"
             onkeypress="if(event.key==='Enter')registry.openModal(${idx})">

          <div class="card-cover ${firstCover ? '' : 'card-cover--empty'}">
            ${firstCover
              ? `<img src="${firstCover}" alt="${this._esc(b.businessName)} cover"
                   onerror="this.parentElement.classList.add('card-cover--empty');this.remove()">`
              : `<div class="card-cover-placeholder-text">
                   <span style="padding: 0 16px; text-align: center;">${this._esc(b.businessName)}</span>
                 </div>`}
            <div class="card-cover-badge">
              <span class="badge-section ${b.section}">${b.section}</span>
            </div>
          </div>

          <div class="card-identity">
            <div class="biz-logo-wrap">
              ${this._logoTag(b, 'biz-logo-placeholder')}
            </div>
            <div class="card-badges">
              <span class="badge-active">Active</span>
            </div>
          </div>

          <div class="biz-name">${this._esc(b.businessName)}</div>
          ${b.catchphrase
            ? `<div class="biz-catchphrase">"${this._esc(b.catchphrase)}"</div>`
            : ''}
          <div class="biz-nature"><i class="fa-solid fa-shapes"></i> ${this._esc(b.nature)}</div>

          ${b.awards && b.awards.length > 0 ? `
            <div class="card-awards-section">
              <div class="card-awards-title">Awards Earned</div>
              <div class="card-awards-list">
                ${b.awards.map(award => {
                  const awardsByCategory = this._getAwardCategoryMap();
                  const categoryData = Object.values(awardsByCategory).find(cat => cat.awards.includes(award)) || {};
                  const badgeHtml = this._renderIconHtml(categoryData.icon || 'fa-trophy');
                  return `<div class="card-award-badge" data-award="${this._esc(award)}">${badgeHtml}</div>`;
                }).join('')}
              </div>
            </div>
          ` : ''}

          <div class="card-divider"></div>

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

          ${this._socialsRow(b)}

          <div class="card-footer">
            <span class="permit-no">${this._esc(b.permitNo)}</span>
            <span class="view-btn">View Details →</span>
          </div>
        </div>`;
    }).join('');
  }

  _populateModal(b) {
    this._set('modal-biz-name',    b.businessName);
    this._set('m-permit',   b.permitNo);
    this._set('m-date',     b.dateRegistered);
    this._set('m-nature',   b.nature);
    this._set('m-section',  b.section);
    this._set('m-address',  b.address);
    this._set('m-owner',    b.owner);
    this._set('m-payment',  b.payment || '—');
    this._set('m-products', b.products || '—');

    // Hide the catchphrase entirely if it's empty to prevent awkward whitespace
    const catchphraseEl = document.getElementById('modal-catchphrase');
    if (catchphraseEl) {
      if (b.catchphrase && b.catchphrase.trim() !== '') {
        catchphraseEl.textContent = `"${b.catchphrase}"`;
        catchphraseEl.style.display = 'block';
      } else {
        catchphraseEl.textContent = '';
        catchphraseEl.style.display = 'none';
      }
    }

    // Cover photo carousel
    const photos = this._getPhotos(b);
    this._carouselIndex = 0;
    this._carouselPhotos = photos;
    this._buildCarousel(photos, b);

    // Email
    const emailEl = document.getElementById('m-email');
    if (emailEl) {
      emailEl.innerHTML = b.email
        ? `<a href="mailto:${this._esc(b.email)}">${this._esc(b.email)}</a>`
        : '—';
    }

    // Logo
    const logoWrap = document.getElementById('modal-logo-wrap');
    if (logoWrap) {
      const logoSrc = b.logo || '';
      logoWrap.innerHTML = logoSrc
        ? `<img src="${logoSrc}" alt="${this._esc(b.businessName)}"
             style="cursor:zoom-in"
             onclick="event.stopPropagation();registry.openLightbox(-1)"
             onerror="this.parentElement.innerHTML='<div class=modal-logo-placeholder>${this._initials(b.businessName)}</div>'">`
        : `<div class="modal-logo-placeholder">${this._initials(b.businessName)}</div>`;
      this._currentLogoSrc = logoSrc;
    }

    // Badges
    const badges = document.getElementById('modal-badges');
    if (badges) {
      const badgeList = [b.section, b.nature, 'Active 2026'];
      if (b.awards && b.awards.length > 0) {
        badgeList.push(`Awards (${b.awards.length})`);
      }
      badges.innerHTML = badgeList.map(t => `<span class="modal-badge">${this._esc(t)}</span>`).join('');
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

    // Socials
    const socialsEl = document.getElementById('m-socials');
    if (socialsEl) {
      const html = this._socialsHTML(b, 'modal-social-link');
      socialsEl.innerHTML = html || '<span style="font-size:13px;color:var(--muted);">No online profiles listed yet.</span>';
    }

    // Awards
    const awardsSection = document.getElementById('m-awards-section');
    const awardsEl = document.getElementById('m-awards');
    if (awardsEl && b.awards && b.awards.length > 0) {
      if (awardsSection) awardsSection.style.display = 'block';
      const awardsByCategory = this._getAwardCategoryMap();
      
      awardsEl.innerHTML = b.awards.map(award => {
        const categoryData = Object.values(awardsByCategory).find(cat => cat.awards.includes(award)) || {};
        const badgeHtml = this._renderIconHtml(categoryData.icon || 'fa-trophy');
        
        return `
          <div class="modal-award-item">
            <div class="modal-award-badge">${badgeHtml}</div>
            <div class="modal-award-name">${this._esc(award)}</div>
          </div>`;
      }).join('');
    } else {
      if (awardsSection) awardsSection.style.display = 'none';
      if (awardsEl) awardsEl.innerHTML = '';
    }
  }

  _getAwardCategoryMap() {
    return {
      "Core Awards": {
        description: "Best Overall – Top Ranking Businesses",
        icon: "fa-crown",
        awards: ["Best Overall Business", "Top 3 Outstanding Businesses", "Most Successful Business"]
      },
      "Sales & Performance": {
        description: "Sales growth and performance recognition",
        icon: "fa-chart-line",
        awards: ["Top Grossing Business", "Best Sales Performance", "Most In-Demand Business", "Growth Champion"]
      },
      "Branding & Creativity": {
        description: "Creative excellence and brand innovation",
        icon: "fa-palette",
        awards: ["Best Business Concept", "Most Creative Business", "Best Branding", "Most Unique Product"]
      },
      "Product & Food Quality": {
        description: "Excellence in products and services",
        icon: "fa-star",
        awards: ["Best Food Product", "Best Beverage", "Best Menu Variety", "Customer Favorite", "Excellence in Craftsmanship"]
      },
      "Professionalism & Operations": {
        description: "Operations, service, and presentation excellence",
        icon: "fa-handshake",
        awards: ["Most Professional Team", "Best Customer Service Excellence", "Best Booth Setup", "Cleanest Booth"]
      },
      "Innovation & Strategy": {
        description: "Business innovation and strategic thinking",
        icon: "fa-lightbulb",
        awards: ["Most Innovative Business", "Best Marketing Strategy", "Most Sustainable Business", "Innovation Award"]
      },
      "Leadership & Entrepreneurship": {
        description: "Outstanding leadership and entrepreneurial spirit",
        icon: "fa-trophy",
        awards: ["Top Entrepreneur", "Best Startup", "Most Energetic Sellers", "Best Team Spirit"]
      }
    };
  }

  /* ── CAROUSEL ───────────────────────────────────── */

  _getPhotos(b) {
    if (Array.isArray(b.coverPhotos) && b.coverPhotos.length) {
      return b.coverPhotos.filter(p => p && p.trim() !== '');
    }
    if (b.coverPhoto && b.coverPhoto.trim() !== '') {
      return [b.coverPhoto];
    }
    return [];
  }

  _buildCarousel(photos, b) {
    const track = document.getElementById('carousel-track');
    const dots  = document.getElementById('carousel-dots');
    const prev  = document.getElementById('carousel-prev');
    const next  = document.getElementById('carousel-next');
    if (!track) return;

    if (photos.length === 0) {
      track.innerHTML = `
        <div class="carousel-slide carousel-slide--empty">
          <div class="card-cover-placeholder-text">
             <span style="padding: 0 16px; text-align: center;">${this._esc(b.businessName)}</span>
          </div>
        </div>`;
      dots.innerHTML  = '';
      prev.classList.add('hidden');
      next.classList.add('hidden');
      return;
    }

    track.innerHTML = photos.map((src, i) =>
      `<div class="carousel-slide" style="background-image:url('${src}')"
            onclick="event.stopPropagation();registry.openLightbox(${i})"
            title="Click to enlarge"></div>`
    ).join('');

    dots.innerHTML = photos.map((_, i) =>
      `<button class="carousel-dot ${i === 0 ? 'active' : ''}"
               onclick="event.stopPropagation();registry.carouselGo(${i})"></button>`
    ).join('');

    // Hide arrows if only one photo total
    prev.classList.toggle('hidden', photos.length <= 1);
    next.classList.toggle('hidden', photos.length <= 1);

    this._updateCarousel();
  }

  _updateCarousel() {
    const track = document.getElementById('carousel-track');
    const dots  = document.querySelectorAll('.carousel-dot');
    if (!track) return;

    const i = this._carouselIndex;
    track.style.transform = `translateX(-${i * 100}%)`;

    dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
  }

  carouselPrev() {
    if (this._carouselPhotos.length <= 1) return;
    
    if (this._carouselIndex > 0) {
      this._carouselIndex--;
    } else {
      this._carouselIndex = this._carouselPhotos.length - 1; // Loop to end
    }
    this._updateCarousel();
  }

  carouselNext() {
    if (this._carouselPhotos.length <= 1) return;
    
    if (this._carouselIndex < this._carouselPhotos.length - 1) {
      this._carouselIndex++;
    } else {
      this._carouselIndex = 0; // Loop to beginning
    }
    this._updateCarousel();
  }

  carouselGo(index) {
    this._carouselIndex = index;
    this._updateCarousel();
  }

  /* ── LIGHTBOX ───────────────────────────────────── */

  openLightbox(index) {
    this._lightboxIndex  = index;
    this._lightboxImages = index === -1
      ? (this._currentLogoSrc ? [this._currentLogoSrc] : [])
      : this._carouselPhotos;

    if (!this._lightboxImages.length) return;

    const overlay = document.getElementById('lightbox-overlay');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    this._updateLightbox();

    this._lightboxEsc = e => { if (e.key === 'Escape') this.closeLightbox(); };
    document.addEventListener('keydown', this._lightboxEsc);
  }

  closeLightbox() {
    const overlay = document.getElementById('lightbox-overlay');
    overlay.classList.remove('open');
    document.body.style.overflow = 'hidden'; 
    if (this._lightboxEsc) {
      document.removeEventListener('keydown', this._lightboxEsc);
      this._lightboxEsc = null;
    }
  }

  lightboxPrev() {
    if (this._lightboxImages.length <= 1) return;
    if (this._lightboxIndex > 0) {
      this._lightboxIndex--;
    } else {
      this._lightboxIndex = this._lightboxImages.length - 1;
    }
    this._updateLightbox();
  }

  lightboxNext() {
    if (this._lightboxImages.length <= 1) return;
    if (this._lightboxIndex < this._lightboxImages.length - 1) {
      this._lightboxIndex++;
    } else {
      this._lightboxIndex = 0;
    }
    this._updateLightbox();
  }

  _updateLightbox() {
    const img     = document.getElementById('lightbox-img');
    const counter = document.getElementById('lightbox-counter');
    const prev    = document.getElementById('lightbox-prev');
    const next    = document.getElementById('lightbox-next');
    const i       = this._lightboxIndex < 0 ? 0 : this._lightboxIndex;

    img.src = this._lightboxImages[i];

    const total = this._lightboxImages.length;
    counter.textContent = total > 1 ? `${i + 1} / ${total}` : '';

    prev.classList.toggle('hidden', total <= 1);
    next.classList.toggle('hidden', total <= 1);
  }

  /* ── UTILITIES ──────────────────────────────────── */

  _socialsRow(b) {
    if (!b.socials) return '';
    const html = this._socialsHTML(b, 'card-social-link');
    if (!html) return '';
    return `<div class="card-socials">${html}</div>`;
  }

  _socialsHTML(b, linkClass) {
    if (!b.socials) return '';
    const map = [
      { key: 'facebook',  icon: 'fa-brands fa-facebook',  label: 'Facebook'  },
      { key: 'instagram', icon: 'fa-brands fa-instagram',  label: 'Instagram' },
      { key: 'tiktok',    icon: 'fa-brands fa-tiktok',     label: 'TikTok'    },
      { key: 'twitter',   icon: 'fa-brands fa-x-twitter',  label: 'X/Twitter' },
      { key: 'website',   icon: 'fa-solid fa-globe',       label: 'Website'   },
    ];
    return map
      .filter(({ key }) => b.socials[key] && b.socials[key].trim() !== '')
      .map(({ key, icon, label }) =>
        `<a href="${this._esc(b.socials[key])}"
            target="_blank" rel="noopener noreferrer"
            class="${linkClass}" title="${label}"
            onclick="event.stopPropagation()">
           <i class="${icon}"></i>
           <span class="social-label">${label}</span>
         </a>`
      ).join('');
  }

  _initials(name) {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  _renderIconHtml(iconValue) {
    if (!iconValue) return '';
    if (iconValue.startsWith('fa-')) {
      return `<i class="fa-solid ${iconValue}"></i>`;
    } else {
      return `<img src="${iconValue}" alt="badge" style="width: 100%; height: 100%; object-fit: contain;">`;
    }
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