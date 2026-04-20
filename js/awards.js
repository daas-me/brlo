/* ═══════════════════════════════════════════════════
   awards.js — Awards Page Logic (Enhanced Version)
   Handles featured section, categorized awards, search/filter, and winners display.
   ═══════════════════════════════════════════════════ */

class AwardsPage {
  constructor() {
    this._data = BUSINESSES;
    this._allAwards = this._extractAllAwards();
    this._awardsByCategory = this._categorizeAwards();
    this._allCategories = Object.keys(this._awardsByCategory);
    this._selectedCategories = new Set(this._allCategories);
    this._searchTerm = '';
  }

  // ═════════ AWARD CATEGORIZATION ═════════
  _categorizeAwards() {
    return {
      "Core Awards": {
        description: "Best Overall – Top Ranking Businesses",
        icon: "fa-crown",
        color: "#ffd700",
        awards: ["Best Overall Business", "Top 3 Outstanding Businesses", "Most Successful Business"]
      },
      "Sales & Performance": {
        description: "Sales growth and performance recognition",
        icon: "fa-chart-line",
        color: "#6f6df5",
        awards: ["Top Grossing Business", "Best Sales Performance", "Most In-Demand Business", "Growth Champion"]
      },
      "Branding & Creativity": {
        description: "Creative excellence and brand innovation",
        icon: "fa-palette",
        color: "#ff6a9e",
        awards: ["Best Business Concept", "Most Creative Business", "Best Branding", "Most Unique Product"]
      },
      "Product & Food Quality": {
        description: "Excellence in products and services",
        icon: "fa-star",
        color: "#ff926d",
        awards: ["Best Food Product", "Best Beverage", "Best Menu Variety", "Customer Favorite", "Excellence in Craftsmanship"]
      },
      "Professionalism & Operations": {
        description: "Operations, service, and presentation excellence",
        icon: "fa-handshake",
        color: "#3c8dff",
        awards: ["Most Professional Team", "Best Customer Service Excellence", "Best Booth Setup", "Cleanest Booth"]
      },
      "Innovation & Strategy": {
        description: "Business innovation and strategic thinking",
        icon: "fa-lightbulb",
        color: "#40c66e",
        awards: ["Most Innovative Business", "Best Marketing Strategy", "Most Sustainable Business", "Innovation Award"]
      },
      "Leadership & Entrepreneurship": {
        description: "Outstanding leadership and entrepreneurial spirit",
        icon: "fa-trophy",
        color: "#56e1d2",
        awards: ["Top Entrepreneur", "Best Startup", "Most Energetic Sellers", "Best Team Spirit"]
      }
    };
  }

  // Extract unique awards from all businesses
  _extractAllAwards() {
    const awards = new Set();
    this._data.forEach(b => {
      if (b.awards && Array.isArray(b.awards)) {
        b.awards.forEach(a => awards.add(a));
      }
    });
    return Array.from(awards).sort();
  }

  // Initialize entire page
  init() {
    this._renderFeaturedSection();
    this._renderCategoryFilters();
    this._renderAwardsGrid();
    this._initEventListeners();
  }

  // ═════════ FEATURED SECTION ═════════
  _renderFeaturedSection() {
    const grid = document.getElementById('featured-grid');
    if (!grid) return;

    const topBusinesses = this._getTopThreeBusinesses();

    grid.innerHTML = topBusinesses.map((b, idx) => {
      const rank = idx + 1;
      let rankBadge = '';
      if (rank === 1) rankBadge = '<i class="fa-solid fa-medal" style="color: #FFD700;"></i>';
      else if (rank === 2) rankBadge = '<i class="fa-solid fa-medal" style="color: #C0C0C0;"></i>';
      else rankBadge = '<i class="fa-solid fa-medal" style="color: #CD7F32;"></i>';
      const rankClass = `rank-${idx + 1}`;

      const logoHtml = b.logo
        ? `<img src="${b.logo}" alt="${this._esc(b.businessName)}">`
        : `<div class="featured-logo-placeholder">${this._initials(b.businessName)}</div>`;

      const awardsList = b.awards && b.awards.length > 0
        ? b.awards.join(', ')
        : 'No awards';

      return `
        <div class="featured-card ${rankClass}">
          <div class="featured-rank-badge">${rankBadge}</div>
          <div class="featured-logo">${logoHtml}</div>
          <h3 class="featured-name">${this._esc(b.businessName)}</h3>
          <div class="featured-tags">
            <span class="featured-section-tag">${b.section}</span>
          </div>
          <p style="font-size: 0.85rem; color: #666; margin: 0; flex: 1; line-height: 1.5;">
            ${awardsList}
          </p>
        </div>`;
    }).join('');
  }

  // Get top 3 businesses by award count
  _getTopThreeBusinesses() {
    return this._data
      .filter(b => b.awards && b.awards.length > 0)
      .sort((a, b) => (b.awards?.length || 0) - (a.awards?.length || 0))
      .slice(0, 3);
  }

  // ═════════ BADGE RENDERING HELPERS ═════════
  // Render icon HTML - supports both Font Awesome and custom images
  _renderIconHtml(iconValue) {
    if (!iconValue) return '';
    
    // Check if it's a Font Awesome icon (starts with "fa-") or an image path
    if (iconValue.startsWith('fa-')) {
      // Font Awesome icon
      return `<i class="fa-solid ${iconValue}"></i>`;
    } else {
      // Custom badge image
      return `<img src="${iconValue}" alt="badge" class="custom-badge-icon">`;
    }
  }

  // Check if icon is a custom badge path
  _isCustomBadge(iconValue) {
    return iconValue && !iconValue.startsWith('fa-');
  }

  // ═════════ CATEGORY FILTERS ═════════
  _renderCategoryFilters() {
    const container = document.getElementById('category-filters');
    if (!container) return;

    const html = [
      `<button class="filter-btn active" data-category="all">All Categories</button>`,
      ...this._allCategories.map(cat => 
        `<button class="filter-btn" data-category="${this._esc(cat)}">${cat.split(' ')[0]}</button>`
      )
    ].join('');

    container.innerHTML = html;
  }

  // ═════════ AWARDS GRID ═════════
  _renderAwardsGrid() {
    const container = document.getElementById('awards-container');
    if (!container) return;

    let html = '';

    this._allCategories.forEach(categoryName => {
      if (!this._selectedCategories.has(categoryName)) return;

      const categoryData = this._awardsByCategory[categoryName];
      const awards = categoryData.awards;
      const filteredAwards = this._filterAwards(awards);

      if (filteredAwards.length === 0) return;

      html += `
        <div class="award-category-section">
          <div class="award-section-header">
            <span class="award-section-icon">${this._renderIconHtml(categoryData.icon)}</span>
            <div>
              <h2 class="award-section-title">${this._esc(categoryName)}</h2>
              <p class="award-section-description">${categoryData.description}</p>
            </div>
          </div>
          <div class="awards-grid">
            ${filteredAwards.map(award => this._renderAwardCard(award)).join('')}
          </div>
        </div>`;
    });

    container.innerHTML = html || '<p style="text-align: center; padding: 2rem; color: #999;">No awards match your search.</p>';
  }

  // Filter awards based on search term
  _filterAwards(awards) {
    if (!this._searchTerm) return awards;
    const term = this._searchTerm.toLowerCase();
    return awards.filter(award => award.toLowerCase().includes(term));
  }

  // Render individual award card
  _renderAwardCard(award) {
    const count = this._getWinnersForAward(award).length;
    const categoryData = Object.values(this._awardsByCategory)
      .find(cat => cat.awards.includes(award)) || {};

    return `
      <div class="award-category" data-award="${this._esc(award)}" onclick="awardsPage.showCategoryWinners('${this._esc(award)}')">  
        <div class="award-icon">${this._renderIconHtml(categoryData.icon)}</div>
        <div class="award-content">
          <h3>${this._esc(award)}</h3>
          <p class="award-description">${award} recognizes outstanding achievements in the business community.</p>
          <div class="award-winner-badge">
            <strong>${count}</strong>
            <span>${count === 1 ? 'Winner' : 'Winners'}</span>
          </div>
        </div>
      </div>`;
  }

  // ═════════ EVENT LISTENERS ═════════
  _initEventListeners() {
    const searchBox = document.getElementById('search-awards');
    const filterBtns = document.querySelectorAll('[data-category]');

    if (searchBox) {
      searchBox.addEventListener('input', (e) => {
        this._searchTerm = e.target.value;
        this._renderAwardsGrid();
      });
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.category;

        if (category === 'all') {
          // Show all categories
          this._selectedCategories = new Set(this._allCategories);
          filterBtns.forEach(b => {
            b.classList.toggle('active', b.dataset.category === 'all' || this._allCategories.includes(b.dataset.category));
          });
        } else {
          // Show only this category
          this._selectedCategories = new Set([category]);
          filterBtns.forEach(b => {
            b.classList.toggle('active', b.dataset.category === category);
          });
        }

        this._renderAwardsGrid();
      });
    });
  }

  // ═════════ WINNERS DISPLAY ═════════
  showCategoryWinners(awardName) {
    const winners = this._getWinnersForAward(awardName);
    const winnersSection = document.getElementById('winners-section');
    const winnersGrid = document.getElementById('winners-grid');
    const winnersTitle = document.getElementById('winners-title');
    const featuredSection = document.querySelector('.featured-section');
    const filterSection = document.querySelector('.awards-filter');
    const awardsContainer = document.getElementById('awards-container');

    if (!winnersSection || !winnersGrid || !winnersTitle) return;

    winnersTitle.textContent = `${awardName} — ${winners.length} ${winners.length === 1 ? 'Winner' : 'Winners'}`;
    winnersGrid.innerHTML = winners.length > 0
      ? winners.map(b => this._winnerCard(b, awardName)).join('')
      : '<div class="no-winners">No businesses have won this award yet.</div>';

    if (featuredSection) featuredSection.style.display = 'none';
    if (filterSection) filterSection.style.display = 'none';
    if (awardsContainer) awardsContainer.style.display = 'none';
    winnersSection.style.display = 'block';
    winnersSection.scrollIntoView({ behavior: 'smooth' });
  }

  // Hide winners section
  hideWinners() {
    const winnersSection = document.getElementById('winners-section');
    const featuredSection = document.querySelector('.featured-section');
    const filterSection = document.querySelector('.awards-filter');
    const awardsContainer = document.getElementById('awards-container');

    if (winnersSection) winnersSection.style.display = 'none';
    if (featuredSection) featuredSection.style.display = 'block';
    if (filterSection) filterSection.style.display = 'block';
    if (awardsContainer) awardsContainer.style.display = 'block';

    document.querySelector('.page-header').scrollIntoView({ behavior: 'smooth' });
  }

  // Get winners for a specific award
  _getWinnersForAward(awardName) {
    return this._data.filter(b => b.awards && b.awards.includes(awardName));
  }

  // Render individual winner card
  _winnerCard(b, awardName) {
    const logoHtml = b.logo
      ? `<img src="${b.logo}" alt="${this._esc(b.businessName)}" onerror="this.style.display='none'">`
      : `<div class="winner-logo-placeholder">${this._initials(b.businessName)}</div>`;

    const memberList = b.members && b.members.length > 0
      ? `<div class="winner-members">
           <strong><i class="fa-solid fa-people-group"></i> Business Partners (${b.members.length})</strong>
           <ul>${b.members.map(m => `<li class="member-chip">${this._esc(m.name)}${m.isLeader ? ' <span class="member-leader">Leader</span>' : ''}</li>`).join('')}</ul>
         </div>`
      : '';

    return `
      <div class="winner-card">
        <div class="winner-card-left">
          <div class="winner-logo">${logoHtml}</div>
        </div>
        <div class="winner-card-right">
          <div class="winner-card-top">
            <div class="winner-info">
              <h4>${this._esc(b.businessName)}</h4>
              <p class="winner-owner"><strong>Proprietor:</strong> ${this._esc(b.owner)}</p>
            </div>
            <div class="winner-tags">
              <span class="winner-award-badge">${this._esc(awardName)}</span>
              <span class="winner-section">${b.section}</span>
            </div>
          </div>
          ${memberList}
        </div>
      </div>`;
  }

  // Utility: Escape HTML characters
  _esc(str) {
    return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  // Utility: Get initials from name
  _initials(name) {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }
}

// Initialize page on load
const awardsPage = new AwardsPage();
document.addEventListener('DOMContentLoaded', () => awardsPage.init());

