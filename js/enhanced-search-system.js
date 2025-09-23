/**
 * Enhanced Search and Filter System for CocoPilot
 * Provides intelligent search capabilities across all content and features
 */

class EnhancedSearchSystem {
  constructor() {
    this.searchIndex = new Map();
    this.searchHistory = [];
    this.isInitialized = false;
    this.filters = {
      category: 'all',
      type: 'all',
      recency: 'all'
    };

    this.init();
  }

  async init() {
    try {
      await this.addSearchStyles();
      await this.createSearchInterface();
      await this.buildSearchIndex();
      this.setupEventHandlers();
      this.loadSearchHistory();

      this.isInitialized = true;
      console.log('🔍 Enhanced Search System initialized');
    } catch (error) {
      console.error('Search system initialization failed:', error);
    }
  }

  async addSearchStyles() {
    const styles = `
      <style id="enhanced-search-styles">
        .enhanced-search-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          z-index: 9999;
          display: none;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .enhanced-search-container.active {
          display: flex;
        }

        .search-modal {
          background: var(--container-bg);
          border-radius: 20px;
          padding: 0;
          max-width: 800px;
          width: 100%;
          max-height: 80vh;
          overflow: hidden;
          border: 1px solid var(--border-color);
          box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
          transform: scale(0.9);
          opacity: 0;
          transition: all 0.3s ease;
        }

        .enhanced-search-container.active .search-modal {
          transform: scale(1);
          opacity: 1;
        }

        .search-header {
          padding: 25px 30px 20px 30px;
          border-bottom: 1px solid var(--border-color);
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
        }

        .search-input-container {
          position: relative;
          margin-bottom: 20px;
        }

        .search-input {
          width: 100%;
          padding: 15px 50px 15px 20px;
          border: 2px solid var(--border-color);
          border-radius: 15px;
          font-size: 1.1rem;
          background: var(--container-bg);
          color: var(--text-primary);
          transition: all 0.3s ease;
          outline: none;
        }

        .search-input:focus {
          border-color: var(--button-gradient-start);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .search-icon {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.2rem;
          color: var(--text-secondary);
        }

        .search-filters {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-label {
          font-size: 0.9rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .filter-select {
          padding: 6px 12px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: var(--container-bg);
          color: var(--text-primary);
          font-size: 0.9rem;
          outline: none;
          transition: all 0.3s ease;
        }

        .filter-select:focus {
          border-color: var(--button-gradient-start);
        }

        .search-body {
          max-height: 400px;
          overflow-y: auto;
          padding: 0;
        }

        .search-results {
          padding: 20px 30px;
        }

        .search-section {
          margin-bottom: 25px;
        }

        .search-section-title {
          font-size: 1.1rem;
          font-weight: bold;
          color: var(--text-primary);
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border-color);
        }

        .search-result-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 12px 15px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 8px;
          border: 1px solid transparent;
        }

        .search-result-item:hover {
          background: var(--feature-bg);
          border-color: var(--border-color);
          transform: translateX(5px);
        }

        .result-icon {
          font-size: 1.3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: var(--feature-bg);
          border-radius: 10px;
          flex-shrink: 0;
        }

        .result-content {
          flex: 1;
          min-width: 0;
        }

        .result-title {
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 3px;
          font-size: 0.95rem;
        }

        .result-description {
          color: var(--text-secondary);
          font-size: 0.85rem;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .result-badge {
          background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
          color: white;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: bold;
          flex-shrink: 0;
        }

        .search-suggestions {
          padding: 20px 30px;
          border-top: 1px solid var(--border-color);
          background: rgba(102, 126, 234, 0.02);
        }

        .suggestions-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 10px;
        }

        .suggestion-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .suggestion-tag {
          padding: 6px 12px;
          background: var(--feature-bg);
          border: 1px solid var(--border-color);
          border-radius: 15px;
          font-size: 0.8rem;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .suggestion-tag:hover {
          background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
          color: white;
          transform: scale(1.05);
        }

        .search-history {
          padding: 15px 30px;
          border-top: 1px solid var(--border-color);
        }

        .history-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 10px;
        }

        .history-items {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .history-item {
          padding: 4px 10px;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 12px;
          font-size: 0.8rem;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .history-item:hover {
          background: rgba(102, 126, 234, 0.2);
        }

        .no-results {
          text-align: center;
          padding: 40px 20px;
          color: var(--text-secondary);
        }

        .no-results-icon {
          font-size: 3rem;
          margin-bottom: 15px;
        }

        .search-close {
          position: absolute;
          top: 25px;
          right: 25px;
          background: none;
          border: none;
          font-size: 1.5rem;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 5px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .search-close:hover {
          background: var(--feature-bg);
          color: var(--text-primary);
        }

        .search-trigger {
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
          color: white;
          border: none;
          padding: 12px 16px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 0.9rem;
          z-index: 1000;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .search-trigger:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
        }

        .search-kbd {
          background: rgba(255, 255, 255, 0.2);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-family: monospace;
        }

        @media (max-width: 768px) {
          .enhanced-search-container {
            padding: 10px;
          }

          .search-modal {
            max-height: 90vh;
          }

          .search-header {
            padding: 20px;
          }

          .search-results {
            padding: 15px 20px;
          }

          .search-filters {
            flex-direction: column;
            gap: 15px;
          }

          .filter-group {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }

          .search-trigger {
            top: 10px;
            right: 10px;
            padding: 10px 12px;
          }

          .search-kbd {
            display: none;
          }
        }

        [data-theme="dark"] .search-modal {
          background: rgba(42, 42, 42, 0.95);
        }

        [data-theme="dark"] .search-input {
          background: rgba(255, 255, 255, 0.05);
        }

        [data-theme="dark"] .filter-select {
          background: rgba(255, 255, 255, 0.05);
        }

        [data-theme="dark"] .result-icon {
          background: rgba(255, 255, 255, 0.05);
        }

        [data-theme="dark"] .suggestion-tag {
          background: rgba(255, 255, 255, 0.05);
        }

        [data-theme="dark"] .search-close:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      </style>
    `;

    if (!document.getElementById('enhanced-search-styles')) {
      document.head.insertAdjacentHTML('beforeend', styles);
    }
  }

  async createSearchInterface() {
    const searchHTML = `
      <!-- Search Trigger Button -->
      <button class="search-trigger" id="searchTrigger" aria-label="Open search">
        🔍 Search
        <span class="search-kbd">Ctrl+K</span>
      </button>

      <!-- Search Modal -->
      <div class="enhanced-search-container" id="enhancedSearchContainer" role="dialog" aria-labelledby="searchTitle" aria-modal="true">
        <div class="search-modal">
          <button class="search-close" id="searchClose" aria-label="Close search">&times;</button>
          
          <div class="search-header">
            <div class="search-input-container">
              <input 
                type="text" 
                class="search-input" 
                id="searchInput"
                placeholder="Search features, documentation, or content..."
                aria-label="Search CocoPilot content"
                autocomplete="off"
              >
              <span class="search-icon">🔍</span>
            </div>
            
            <div class="search-filters">
              <div class="filter-group">
                <label class="filter-label" for="categoryFilter">Category:</label>
                <select class="filter-select" id="categoryFilter">
                  <option value="all">All Categories</option>
                  <option value="features">Features</option>
                  <option value="documentation">Documentation</option>
                  <option value="analytics">Analytics</option>
                  <option value="community">Community</option>
                </select>
              </div>
              
              <div class="filter-group">
                <label class="filter-label" for="typeFilter">Type:</label>
                <select class="filter-select" id="typeFilter">
                  <option value="all">All Types</option>
                  <option value="interactive">Interactive</option>
                  <option value="information">Information</option>
                  <option value="navigation">Navigation</option>
                </select>
              </div>
            </div>
          </div>
          
          <div class="search-body">
            <div class="search-results" id="searchResults">
              <!-- Results will be populated here -->
            </div>
          </div>
          
          <div class="search-suggestions" id="searchSuggestions">
            <div class="suggestions-title">Popular searches:</div>
            <div class="suggestion-tags">
              <span class="suggestion-tag" data-search="analytics">Analytics</span>
              <span class="suggestion-tag" data-search="AI improvements">AI Improvements</span>
              <span class="suggestion-tag" data-search="documentation">Documentation</span>
              <span class="suggestion-tag" data-search="accessibility">Accessibility</span>
              <span class="suggestion-tag" data-search="themes">Themes</span>
              <span class="suggestion-tag" data-search="contributors">Contributors</span>
            </div>
          </div>
          
          <div class="search-history" id="searchHistory" style="display: none;">
            <div class="history-title">Recent searches:</div>
            <div class="history-items" id="historyItems">
              <!-- History items will be populated here -->
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', searchHTML);
  }

  async buildSearchIndex() {
    const searchableContent = [
      // Features
      { id: 'analytics', title: 'Interactive Analytics Dashboard', description: 'View repository insights, commit patterns, and AI improvement metrics', category: 'features', type: 'interactive', icon: '📊', action: () => this.scrollToElement('#analyticsDashboard') },
      { id: 'visualizations', title: 'Data Visualizations', description: 'Interactive charts showing repository evolution and statistics', category: 'analytics', type: 'interactive', icon: '📈', action: () => this.scrollToElement('#dataVisualization') },
      { id: 'community', title: 'Community & Contributors', description: 'Explore contributor highlights and community engagement', category: 'community', type: 'information', icon: '🤝', action: () => this.scrollToElement('#communitySection') },
      { id: 'themes', title: 'Dark/Light Theme Toggle', description: 'Switch between dark and light themes with smooth transitions', category: 'features', type: 'interactive', icon: '🌙', action: () => this.toggleTheme() },
      { id: 'help', title: 'Help System', description: 'Get contextual help and keyboard shortcuts', category: 'features', type: 'interactive', icon: '❓', action: () => this.openHelp() },

      // Documentation
      { id: 'docs', title: 'Complete Documentation', description: 'Comprehensive guide to CocoPilot features and usage', category: 'documentation', type: 'information', icon: '📖', action: () => window.open('docs.html', '_blank') },
      { id: 'readme', title: 'README', description: 'Project overview and getting started guide', category: 'documentation', type: 'information', icon: '📚', action: () => window.open('https://github.com/acbart/cocopilot/blob/main/README.md', '_blank') },
      { id: 'changelog', title: 'Changelog', description: 'Detailed history of changes and improvements', category: 'documentation', type: 'information', icon: '📜', action: () => window.open('https://github.com/acbart/cocopilot/blob/main/CHANGELOG.md', '_blank') },
      { id: 'future-plans', title: 'Future Plans', description: 'Roadmap and upcoming features', category: 'documentation', type: 'information', icon: '🔮', action: () => window.open('https://github.com/acbart/cocopilot/blob/main/tomorrow.md', '_blank') },

      // Navigation
      { id: 'github', title: 'GitHub Repository', description: 'View source code and contribute to the project', category: 'navigation', type: 'navigation', icon: '💻', action: () => window.open('https://github.com/acbart/cocopilot', '_blank') },
      { id: 'issues', title: 'Daily Issues', description: 'Browse AI-generated improvement issues', category: 'navigation', type: 'navigation', icon: '📋', action: () => window.open('https://github.com/acbart/cocopilot/issues', '_blank') },

      // Features
      { id: 'accessibility', title: 'Accessibility Features', description: 'WCAG compliant with screen reader support and keyboard navigation', category: 'features', type: 'information', icon: '♿', action: () => this.showAccessibilityInfo() },
      { id: 'pwa', title: 'Progressive Web App', description: 'Install as an app with offline functionality', category: 'features', type: 'interactive', icon: '📱', action: () => this.showPWAInfo() },
      { id: 'ai-improvements', title: 'AI-Driven Improvements', description: 'Learn about autonomous daily improvements by GitHub Copilot', category: 'features', type: 'information', icon: '🤖', action: () => this.scrollToElement('.about-section') },
      { id: 'performance', title: 'Performance Optimization', description: 'Lighthouse-optimized with advanced caching strategies', category: 'features', type: 'information', icon: '⚡', action: () => this.showPerformanceInfo() }
    ];

    searchableContent.forEach(item => {
      this.searchIndex.set(item.id, item);
    });

    console.log(`🔍 Search index built with ${this.searchIndex.size} items`);
  }

  setupEventHandlers() {
    const searchTrigger = document.getElementById('searchTrigger');
    const searchContainer = document.getElementById('enhancedSearchContainer');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const typeFilter = document.getElementById('typeFilter');

    // Open search modal
    searchTrigger?.addEventListener('click', () => this.openSearch());

    // Keyboard shortcut
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.openSearch();
      }

      if (e.key === 'Escape' && searchContainer?.classList.contains('active')) {
        this.closeSearch();
      }
    });

    // Close search modal
    searchClose?.addEventListener('click', () => this.closeSearch());
    searchContainer?.addEventListener('click', (e) => {
      if (e.target === searchContainer) {
        this.closeSearch();
      }
    });

    // Search input
    searchInput?.addEventListener('input', (e) => {
      this.performSearch(e.target.value);
    });

    // Filters
    categoryFilter?.addEventListener('change', (e) => {
      this.filters.category = e.target.value;
      this.performSearch(searchInput?.value || '');
    });

    typeFilter?.addEventListener('change', (e) => {
      this.filters.type = e.target.value;
      this.performSearch(searchInput?.value || '');
    });

    // Suggestion tags
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('suggestion-tag')) {
        const searchTerm = e.target.getAttribute('data-search');
        if (searchInput) {
          searchInput.value = searchTerm;
          this.performSearch(searchTerm);
        }
      }
    });

    // History items
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('history-item')) {
        const searchTerm = e.target.textContent;
        if (searchInput) {
          searchInput.value = searchTerm;
          this.performSearch(searchTerm);
        }
      }
    });
  }

  openSearch() {
    const searchContainer = document.getElementById('enhancedSearchContainer');
    const searchInput = document.getElementById('searchInput');

    if (searchContainer) {
      searchContainer.classList.add('active');
      document.body.style.overflow = 'hidden';

      setTimeout(() => {
        searchInput?.focus();
      }, 100);

      this.showDefaultResults();
      this.updateSearchHistory();
    }
  }

  closeSearch() {
    const searchContainer = document.getElementById('enhancedSearchContainer');

    if (searchContainer) {
      searchContainer.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  performSearch(query) {
    const searchResults = document.getElementById('searchResults');
    const searchSuggestions = document.getElementById('searchSuggestions');

    if (!searchResults) {
      return;
    }

    if (!query.trim()) {
      this.showDefaultResults();
      searchSuggestions.style.display = 'block';
      return;
    }

    searchSuggestions.style.display = 'none';

    const results = this.searchContent(query);
    this.renderSearchResults(results);

    // Add to search history
    if (query.length > 2) {
      this.addToSearchHistory(query);
    }
  }

  searchContent(query) {
    const queryLower = query.toLowerCase();
    const results = [];

    for (const [id, item] of this.searchIndex) {
      let score = 0;

      // Title match (highest priority)
      if (item.title.toLowerCase().includes(queryLower)) {
        score += 10;
      }

      // Description match
      if (item.description.toLowerCase().includes(queryLower)) {
        score += 5;
      }

      // Category/type match
      if (item.category.toLowerCase().includes(queryLower) ||
          item.type.toLowerCase().includes(queryLower)) {
        score += 3;
      }

      // Apply filters
      if (this.filters.category !== 'all' && item.category !== this.filters.category) {
        score = 0;
      }

      if (this.filters.type !== 'all' && item.type !== this.filters.type) {
        score = 0;
      }

      if (score > 0) {
        results.push({ ...item, score });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }

  renderSearchResults(results) {
    const searchResults = document.getElementById('searchResults');

    if (!searchResults) {
      return;
    }

    if (results.length === 0) {
      searchResults.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">🔍</div>
          <h3>No results found</h3>
          <p>Try adjusting your search terms or filters</p>
        </div>
      `;
      return;
    }

    // Group results by category
    const groupedResults = this.groupResultsByCategory(results);

    let html = '';
    for (const [category, items] of Object.entries(groupedResults)) {
      html += `
        <div class="search-section">
          <h3 class="search-section-title">${this.formatCategoryName(category)}</h3>
          ${items.map(item => `
            <div class="search-result-item" data-action="${item.id}">
              <div class="result-icon">${item.icon}</div>
              <div class="result-content">
                <div class="result-title">${item.title}</div>
                <div class="result-description">${item.description}</div>
              </div>
              <div class="result-badge">${this.formatTypeName(item.type)}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    searchResults.innerHTML = html;

    // Add click handlers
    searchResults.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', () => {
        const actionId = item.getAttribute('data-action');
        const searchItem = this.searchIndex.get(actionId);
        if (searchItem && searchItem.action) {
          searchItem.action();
          this.closeSearch();
        }
      });
    });
  }

  groupResultsByCategory(results) {
    const grouped = {};

    results.forEach(result => {
      if (!grouped[result.category]) {
        grouped[result.category] = [];
      }
      grouped[result.category].push(result);
    });

    return grouped;
  }

  formatCategoryName(category) {
    const names = {
      'features': '✨ Features',
      'documentation': '📚 Documentation',
      'analytics': '📊 Analytics',
      'community': '🤝 Community',
      'navigation': '🧭 Navigation'
    };
    return names[category] || category;
  }

  formatTypeName(type) {
    const names = {
      'interactive': 'Interactive',
      'information': 'Info',
      'navigation': 'Link'
    };
    return names[type] || type;
  }

  showDefaultResults() {
    const featured = [
      'analytics', 'visualizations', 'community', 'docs', 'themes', 'help'
    ];

    const results = featured.map(id => this.searchIndex.get(id)).filter(Boolean);
    this.renderSearchResults(results);
  }

  addToSearchHistory(query) {
    const maxHistory = 5;
    const index = this.searchHistory.indexOf(query);

    if (index > -1) {
      this.searchHistory.splice(index, 1);
    }

    this.searchHistory.unshift(query);
    this.searchHistory = this.searchHistory.slice(0, maxHistory);

    this.saveSearchHistory();
  }

  loadSearchHistory() {
    try {
      const saved = localStorage.getItem('cocopilot_search_history');
      if (saved) {
        this.searchHistory = JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to load search history:', error);
    }
  }

  saveSearchHistory() {
    try {
      localStorage.setItem('cocopilot_search_history', JSON.stringify(this.searchHistory));
    } catch (error) {
      console.warn('Failed to save search history:', error);
    }
  }

  updateSearchHistory() {
    const searchHistory = document.getElementById('searchHistory');
    const historyItems = document.getElementById('historyItems');

    if (this.searchHistory.length > 0 && historyItems) {
      historyItems.innerHTML = this.searchHistory.map(term =>
        `<span class="history-item">${term}</span>`
      ).join('');
      searchHistory.style.display = 'block';
    } else {
      searchHistory.style.display = 'none';
    }
  }

  // Action methods
  scrollToElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  toggleTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.click();
    }
  }

  openHelp() {
    const helpButton = document.querySelector('[onclick*="showHelp"]');
    if (helpButton) {
      helpButton.click();
    }
  }

  showAccessibilityInfo() {
    // Could trigger accessibility panel or scroll to accessibility section
    alert('CocoPilot is fully WCAG 2.1 AA compliant with screen reader support, keyboard navigation, and high contrast mode.');
  }

  showPWAInfo() {
    // Could trigger PWA installation prompt or show info
    alert('CocoPilot is a Progressive Web App! You can install it on your device for offline access and native app experience.');
  }

  showPerformanceInfo() {
    // Could show performance metrics
    alert('CocoPilot is Lighthouse-optimized with advanced caching, lazy loading, and performance monitoring for the best user experience.');
  }
}

// Initialize the enhanced search system
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new EnhancedSearchSystem();
  });
} else {
  new EnhancedSearchSystem();
}

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnhancedSearchSystem;
}