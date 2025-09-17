/**
 * Advanced Search Functionality for CocoPilot
 * Provides intelligent search capabilities across repository content
 */

class AdvancedSearch {
  constructor() {
    this.searchData = {
      features: [
        { title: 'Auto-Updates', description: 'Daily AI-driven improvements', category: 'automation' },
        { title: 'GitHub Actions', description: 'Automated workflow management', category: 'automation' },
        { title: 'Focused Goals', description: 'Incremental, thoughtful changes', category: 'strategy' },
        { title: 'PWA Support', description: 'Progressive Web App capabilities', category: 'technology' },
        { title: 'Dark Theme', description: 'Toggle between light and dark themes', category: 'ui' },
        { title: 'Internationalization', description: 'Multi-language support', category: 'accessibility' },
        { title: 'Performance Monitoring', description: 'Real-time performance metrics', category: 'analytics' },
        { title: 'RSS Feed', description: 'Subscribe to repository updates', category: 'integration' }
      ],
      documentation: [
        { title: 'Getting Started', url: '#', description: 'Quick start guide for CocoPilot' },
        { title: 'Development Guide', url: 'https://github.com/acbart/cocopilot/blob/main/docs/DEVELOPMENT.md', description: 'Complete development setup' },
        { title: 'API Documentation', url: '#', description: 'Comprehensive API reference' },
        { title: 'Changelog', url: 'https://github.com/acbart/cocopilot/blob/main/CHANGELOG.md', description: 'Version history and changes' }
      ],
      shortcuts: [
        { key: 'T', action: 'Toggle Theme', description: 'Switch between light and dark modes' },
        { key: 'R', action: 'RSS Feed', description: 'Access RSS feed options' },
        { key: 'G', action: 'GitHub', description: 'Go to GitHub repository' },
        { key: 'I', action: 'Issues', description: 'View repository issues' },
        { key: '?', action: 'Help', description: 'Show keyboard shortcuts' }
      ]
    };

    this.searchHistory = this.loadSearchHistory();
    this.init();
  }

  init() {
    this.createSearchInterface();
    this.bindEvents();
  }

  createSearchInterface() {
    // Create search container
    const searchContainer = document.createElement('div');
    searchContainer.className = 'advanced-search-container';
    searchContainer.innerHTML = `
            <div class="search-header">
                <button type="button" class="search-toggle" aria-label="Open search" data-i18n-aria="search.open">
                    🔍
                </button>
            </div>
            <div class="search-modal" id="searchModal" style="display: none;">
                <div class="search-modal-content">
                    <div class="search-input-container">
                        <input type="text" class="search-input" placeholder="Search CocoPilot features, docs, shortcuts..." 
                               aria-label="Search input" data-i18n-placeholder="search.placeholder">
                        <button type="button" class="search-close" aria-label="Close search" data-i18n-aria="search.close">×</button>
                    </div>
                    <div class="search-filters">
                        <button type="button" class="filter-btn active" data-filter="all" data-i18n="search.all">All</button>
                        <button type="button" class="filter-btn" data-filter="features" data-i18n="search.features">Features</button>
                        <button type="button" class="filter-btn" data-filter="docs" data-i18n="search.docs">Docs</button>
                        <button type="button" class="filter-btn" data-filter="shortcuts" data-i18n="search.shortcuts">Shortcuts</button>
                    </div>
                    <div class="search-results" id="searchResults">
                        <div class="search-suggestions">
                            <div class="suggestion-section">
                                <h4 data-i18n="search.recent">Recent Searches</h4>
                                <div class="recent-searches" id="recentSearches"></div>
                            </div>
                            <div class="suggestion-section">
                                <h4 data-i18n="search.popular">Popular Searches</h4>
                                <div class="popular-searches">
                                    <span class="search-tag" data-search="dark theme">dark theme</span>
                                    <span class="search-tag" data-search="RSS">RSS</span>
                                    <span class="search-tag" data-search="performance">performance</span>
                                    <span class="search-tag" data-search="GitHub Actions">GitHub Actions</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

    // Add to container
    document.querySelector('.container').appendChild(searchContainer);
    this.addSearchStyles();
    this.updateRecentSearches();
  }

  addSearchStyles() {
    const style = document.createElement('style');
    style.textContent = `
            .advanced-search-container {
                position: relative;
            }

            .search-toggle {
                position: absolute;
                top: -50px;
                right: 120px;
                background: none;
                border: 2px solid var(--border-color);
                border-radius: 50%;
                width: 40px;
                height: 40px;
                cursor: pointer;
                font-size: 1.2rem;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--text-primary);
                transition: all 0.3s ease;
                z-index: 998;
            }

            .search-toggle:hover,
            .search-toggle:focus {
                transform: scale(1.1);
                border-color: var(--button-gradient-start);
                outline: none;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
                background: var(--feature-bg);
            }

            .search-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(5px);
                z-index: 9999;
                display: flex;
                align-items: flex-start;
                justify-content: center;
                padding-top: 80px;
                animation: fadeIn 0.3s ease-out;
            }

            .search-modal-content {
                background: var(--container-bg);
                border: 2px solid var(--border-color);
                border-radius: 15px;
                width: 90%;
                max-width: 600px;
                max-height: 80vh;
                overflow: hidden;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                animation: slideInDown 0.3s ease-out;
            }

            .search-input-container {
                display: flex;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid var(--border-color);
            }

            .search-input {
                flex: 1;
                background: none;
                border: none;
                font-size: 1.2rem;
                color: var(--text-primary);
                outline: none;
                padding: 10px 0;
            }

            .search-input::placeholder {
                color: var(--text-tertiary);
            }

            .search-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                color: var(--text-secondary);
                cursor: pointer;
                padding: 5px;
                margin-left: 10px;
                border-radius: 50%;
                transition: all 0.2s ease;
            }

            .search-close:hover {
                background: var(--feature-bg);
                color: var(--text-primary);
            }

            .search-filters {
                display: flex;
                gap: 8px;
                padding: 15px 20px;
                border-bottom: 1px solid var(--border-color);
                overflow-x: auto;
            }

            .filter-btn {
                background: var(--feature-bg);
                border: 1px solid var(--border-color);
                border-radius: 20px;
                padding: 6px 15px;
                font-size: 0.9rem;
                color: var(--text-secondary);
                cursor: pointer;
                transition: all 0.2s ease;
                white-space: nowrap;
            }

            .filter-btn.active,
            .filter-btn:hover {
                background: var(--button-gradient-start);
                color: white;
                border-color: var(--button-gradient-start);
            }

            .search-results {
                max-height: 400px;
                overflow-y: auto;
                padding: 20px;
            }

            .search-suggestions .suggestion-section {
                margin-bottom: 25px;
            }

            .search-suggestions h4 {
                color: var(--text-primary);
                margin-bottom: 12px;
                font-size: 1rem;
                font-weight: 600;
            }

            .recent-searches {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .recent-search-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px 12px;
                background: var(--feature-bg);
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .recent-search-item:hover {
                background: var(--border-color);
                transform: translateX(4px);
            }

            .popular-searches {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }

            .search-tag {
                background: var(--feature-bg);
                border: 1px solid var(--border-color);
                border-radius: 15px;
                padding: 6px 12px;
                font-size: 0.85rem;
                color: var(--text-secondary);
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .search-tag:hover {
                background: var(--button-gradient-start);
                color: white;
                border-color: var(--button-gradient-start);
                transform: translateY(-1px);
            }

            .search-result-item {
                padding: 12px;
                border-radius: 8px;
                margin-bottom: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                border: 1px solid transparent;
            }

            .search-result-item:hover {
                background: var(--feature-bg);
                border-color: var(--border-color);
                transform: translateX(4px);
            }

            .search-result-title {
                font-weight: 600;
                color: var(--text-primary);
                margin-bottom: 4px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .search-result-description {
                color: var(--text-secondary);
                font-size: 0.9rem;
                line-height: 1.4;
            }

            .search-result-category {
                display: inline-block;
                background: var(--button-gradient-start);
                color: white;
                padding: 2px 8px;
                border-radius: 10px;
                font-size: 0.75rem;
                margin-left: auto;
            }

            .no-results {
                text-align: center;
                color: var(--text-secondary);
                padding: 40px 20px;
            }

            .no-results-icon {
                font-size: 3rem;
                margin-bottom: 15px;
                opacity: 0.5;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideInDown {
                from { 
                    transform: translateY(-30px);
                    opacity: 0;
                }
                to { 
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            @media (max-width: 768px) {
                .search-toggle {
                    top: -45px;
                    right: 110px;
                    width: 35px;
                    height: 35px;
                    font-size: 1rem;
                }

                .search-modal {
                    padding-top: 60px;
                }

                .search-modal-content {
                    width: 95%;
                    margin: 0 10px;
                }

                .search-input-container {
                    padding: 15px;
                }

                .search-input {
                    font-size: 1rem;
                }

                .search-filters {
                    padding: 12px 15px;
                }

                .search-results {
                    padding: 15px;
                }
            }
        `;
    document.head.appendChild(style);
  }

  bindEvents() {
    const searchToggle = document.querySelector('.search-toggle');
    const searchModal = document.getElementById('searchModal');
    const searchClose = document.querySelector('.search-close');
    const searchInput = document.querySelector('.search-input');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchTags = document.querySelectorAll('.search-tag');

    // Open search modal
    searchToggle.addEventListener('click', () => this.openSearch());

    // Close search modal
    searchClose.addEventListener('click', () => this.closeSearch());

    // Close on backdrop click
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) {
        this.closeSearch();
      }
    });

    // Search input
    searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeSearch();
      }
    });

    // Filter buttons
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => this.handleFilter(btn.dataset.filter));
    });

    // Popular search tags
    searchTags.forEach(tag => {
      tag.addEventListener('click', () => {
        searchInput.value = tag.dataset.search;
        this.handleSearch(tag.dataset.search);
      });
    });

    // Keyboard shortcut
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.openSearch();
      }
    });
  }

  openSearch() {
    const modal = document.getElementById('searchModal');
    const input = document.querySelector('.search-input');

    modal.style.display = 'flex';
    setTimeout(() => input.focus(), 100);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  closeSearch() {
    const modal = document.getElementById('searchModal');
    modal.style.display = 'none';

    // Restore body scroll
    document.body.style.overflow = '';
  }

  handleFilter(filter) {
    // Update active filter
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });

    // Perform search with current input and new filter
    const searchValue = document.querySelector('.search-input').value;
    this.performSearch(searchValue, filter);
  }

  handleSearch(query) {
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;

    if (query.trim()) {
      this.addToSearchHistory(query);
      this.performSearch(query, activeFilter);
    } else {
      this.showSuggestions();
    }
  }

  performSearch(query, filter = 'all') {
    const results = this.searchContent(query, filter);
    this.displayResults(results, query);
  }

  searchContent(query, filter) {
    const searchTerm = query.toLowerCase();
    const results = [];

    // Search features
    if (filter === 'all' || filter === 'features') {
      const featureResults = this.searchData.features
        .filter(item =>
          item.title.toLowerCase().includes(searchTerm) ||
                    item.description.toLowerCase().includes(searchTerm) ||
                    item.category.toLowerCase().includes(searchTerm)
        )
        .map(item => ({ ...item, type: 'feature' }));
      results.push(...featureResults);
    }

    // Search documentation
    if (filter === 'all' || filter === 'docs') {
      const docResults = this.searchData.documentation
        .filter(item =>
          item.title.toLowerCase().includes(searchTerm) ||
                    item.description.toLowerCase().includes(searchTerm)
        )
        .map(item => ({ ...item, type: 'documentation' }));
      results.push(...docResults);
    }

    // Search shortcuts
    if (filter === 'all' || filter === 'shortcuts') {
      const shortcutResults = this.searchData.shortcuts
        .filter(item =>
          item.key.toLowerCase().includes(searchTerm) ||
                    item.action.toLowerCase().includes(searchTerm) ||
                    item.description.toLowerCase().includes(searchTerm)
        )
        .map(item => ({ ...item, type: 'shortcut' }));
      results.push(...shortcutResults);
    }

    return results;
  }

  displayResults(results, query) {
    const resultsContainer = document.getElementById('searchResults');

    if (results.length === 0) {
      resultsContainer.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">🔍</div>
                    <h4>No results found</h4>
                    <p>Try adjusting your search terms or browse popular searches below.</p>
                </div>
            `;
      return;
    }

    const resultsHTML = results.map(result => {
      const icon = this.getResultIcon(result.type);
      return `
                <div class="search-result-item" data-type="${result.type}" onclick="advancedSearch.handleResultClick('${result.type}', ${JSON.stringify(result).replace(/"/g, '&quot;')})">
                    <div class="search-result-title">
                        ${icon} ${result.title || result.action}
                        <span class="search-result-category">${result.type}</span>
                    </div>
                    <div class="search-result-description">${result.description}</div>
                </div>
            `;
    }).join('');

    resultsContainer.innerHTML = `
            <div class="search-results-header">
                <h4>Search Results (${results.length})</h4>
            </div>
            ${resultsHTML}
        `;
  }

  getResultIcon(type) {
    const icons = {
      feature: '⚡',
      documentation: '📚',
      shortcut: '⌨️'
    };
    return icons[type] || '🔍';
  }

  handleResultClick(type, result) {
    switch (type) {
    case 'feature':
      this.highlightFeature(result.title);
      break;
    case 'documentation':
      if (result.url && result.url !== '#') {
        window.open(result.url, '_blank');
      }
      break;
    case 'shortcut':
      this.executeShortcut(result.key);
      break;
    }
    this.closeSearch();
  }

  highlightFeature(featureTitle) {
    // Find and highlight the feature on the page
    const features = document.querySelectorAll('.feature-title');
    features.forEach(feature => {
      if (feature.textContent.includes(featureTitle)) {
        feature.closest('.feature').scrollIntoView({ behavior: 'smooth', block: 'center' });
        feature.closest('.feature').style.animation = 'highlight 2s ease-out';
      }
    });
  }

  executeShortcut(key) {
    // Simulate keyboard shortcut
    const event = new KeyboardEvent('keydown', { key: key.toLowerCase() });
    document.dispatchEvent(event);
  }

  showSuggestions() {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = `
            <div class="search-suggestions">
                <div class="suggestion-section">
                    <h4 data-i18n="search.recent">Recent Searches</h4>
                    <div class="recent-searches" id="recentSearches"></div>
                </div>
                <div class="suggestion-section">
                    <h4 data-i18n="search.popular">Popular Searches</h4>
                    <div class="popular-searches">
                        <span class="search-tag" data-search="dark theme">dark theme</span>
                        <span class="search-tag" data-search="RSS">RSS</span>
                        <span class="search-tag" data-search="performance">performance</span>
                        <span class="search-tag" data-search="GitHub Actions">GitHub Actions</span>
                    </div>
                </div>
            </div>
        `;
    this.updateRecentSearches();
  }

  addToSearchHistory(query) {
    if (!this.searchHistory.includes(query)) {
      this.searchHistory.unshift(query);
      this.searchHistory = this.searchHistory.slice(0, 5); // Keep only 5 recent searches
      this.saveSearchHistory();
    }
  }

  updateRecentSearches() {
    const container = document.getElementById('recentSearches');
    if (!container) {
      return;
    }

    if (this.searchHistory.length === 0) {
      container.innerHTML = '<p style="color: var(--text-tertiary); font-style: italic;">No recent searches</p>';
      return;
    }

    container.innerHTML = this.searchHistory.map(search => `
            <div class="recent-search-item" onclick="document.querySelector('.search-input').value='${search}'; advancedSearch.handleSearch('${search}')">
                <span>🕒</span>
                <span>${search}</span>
            </div>
        `).join('');
  }

  loadSearchHistory() {
    try {
      return JSON.parse(localStorage.getItem('cocopilot-search-history') || '[]');
    } catch {
      return [];
    }
  }

  saveSearchHistory() {
    try {
      localStorage.setItem('cocopilot-search-history', JSON.stringify(this.searchHistory));
    } catch {
      // Ignore storage errors
    }
  }
}

// Initialize advanced search when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.advancedSearch = new AdvancedSearch();
  });
} else {
  window.advancedSearch = new AdvancedSearch();
}

// Add highlight animation CSS
const highlightStyle = document.createElement('style');
highlightStyle.textContent = `
    @keyframes highlight {
        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7); }
        50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(102, 126, 234, 0.3); }
        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(102, 126, 234, 0); }
    }
`;
document.head.appendChild(highlightStyle);