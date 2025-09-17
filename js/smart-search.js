/**
 * Smart Search System for CocoPilot
 * Advanced search with fuzzy matching, smart suggestions, and contextual results
 */

class SmartSearch {
  constructor() {
    this.isVisible = false;
    this.searchIndex = [];
    this.recentSearches = JSON.parse(localStorage.getItem('cocopilot-recent-searches') || '[]');
    this.searchHistory = JSON.parse(localStorage.getItem('cocopilot-search-history') || '[]');
    this.popularSearches = [
      'help',
      'keyboard shortcuts',
      'theme',
      'analytics',
      'features',
      'accessibility',
      'mobile',
      'GitHub',
      'RSS',
      'tour',
      'documentation',
      'API',
      'performance',
      'PWA'
    ];

    this.init();
  }

  init() {
    this.buildSearchIndex();
    this.createSearchInterface();
    this.bindKeyboardShortcuts();
    this.setupSearchAnalytics();
  }

  buildSearchIndex() {
    // Index all searchable content on the page
    this.searchIndex = [
      // Features
      {
        title: 'Help Center',
        description: 'Comprehensive help with keyboard shortcuts and tips',
        category: 'Help',
        keywords: ['help', 'shortcuts', 'guide', 'tutorial', 'support'],
        action: () => window.helpSystem?.showHelp(),
        icon: '❓'
      },
      {
        title: 'Accessibility Options',
        description: 'Customize accessibility settings and preferences',
        category: 'Accessibility',
        keywords: ['accessibility', 'a11y', 'contrast', 'focus', 'screen reader'],
        action: () => window.accessibilityEnhancer?.showAccessibilityPanel(),
        icon: '♿'
      },
      {
        title: 'Analytics Dashboard',
        description: 'View repository analytics and AI insights',
        category: 'Analytics',
        keywords: ['analytics', 'dashboard', 'metrics', 'insights', 'data'],
        action: () => document.getElementById('toggle-dashboard')?.click(),
        icon: '📊'
      },
      {
        title: 'Toggle Theme',
        description: 'Switch between light and dark themes',
        category: 'Appearance',
        keywords: ['theme', 'dark', 'light', 'appearance', 'mode'],
        action: () => document.querySelector('.theme-toggle')?.click(),
        icon: '🌙'
      },
      {
        title: 'Language Settings',
        description: 'Change interface language',
        category: 'Language',
        keywords: ['language', 'locale', 'translation', 'i18n', 'international'],
        action: () => document.querySelector('.language-toggle')?.click(),
        icon: '🌐'
      },
      {
        title: 'Performance Metrics',
        description: 'View performance monitoring and optimization',
        category: 'Performance',
        keywords: ['performance', 'speed', 'optimization', 'metrics', 'monitoring'],
        action: () => document.querySelector('.performance-toggle')?.click(),
        icon: '⚡'
      },

      // Navigation
      {
        title: 'GitHub Repository',
        description: 'View source code on GitHub',
        category: 'Navigation',
        keywords: ['github', 'source', 'code', 'repository', 'repo'],
        action: () => window.open('https://github.com/acbart/cocopilot', '_blank'),
        icon: '🐙'
      },
      {
        title: 'Issues & Discussions',
        description: 'Browse daily improvement issues',
        category: 'Navigation',
        keywords: ['issues', 'discussions', 'problems', 'bugs', 'suggestions'],
        action: () => window.open('https://github.com/acbart/cocopilot/issues', '_blank'),
        icon: '📋'
      },
      {
        title: 'Documentation',
        description: 'Read project documentation',
        category: 'Documentation',
        keywords: ['docs', 'documentation', 'readme', 'guide', 'manual'],
        action: () => window.open('https://github.com/acbart/cocopilot/blob/main/README.md', '_blank'),
        icon: '📖'
      },
      {
        title: 'Development Guide',
        description: 'Setup and development instructions',
        category: 'Documentation',
        keywords: ['development', 'setup', 'install', 'build', 'dev'],
        action: () => window.open('https://github.com/acbart/cocopilot/blob/main/docs/DEVELOPMENT.md', '_blank'),
        icon: '⚙️'
      },
      {
        title: 'RSS Feed',
        description: 'Subscribe to repository updates',
        category: 'Updates',
        keywords: ['rss', 'feed', 'updates', 'notifications', 'subscribe'],
        action: () => document.querySelector('button[onclick*="rss"]')?.click(),
        icon: '📡'
      },

      // Actions
      {
        title: 'Take Interactive Tour',
        description: 'Guided tour of CocoPilot features',
        category: 'Getting Started',
        keywords: ['tour', 'guide', 'tutorial', 'walkthrough', 'introduction'],
        action: () => document.querySelector('[onclick*="startOnboardingTour"]')?.click(),
        icon: '🎓'
      },
      {
        title: 'Share on Social Media',
        description: 'Share CocoPilot on Twitter or LinkedIn',
        category: 'Social',
        keywords: ['share', 'social', 'twitter', 'linkedin', 'spread'],
        action: () => document.querySelector('.social-share')?.scrollIntoView(),
        icon: '🔗'
      },
      {
        title: 'Mobile Features',
        description: 'Explore mobile-specific functionality',
        category: 'Mobile',
        keywords: ['mobile', 'touch', 'gestures', 'responsive', 'phone'],
        action: () => document.querySelector('[onclick*="showMobileFeatures"]')?.click(),
        icon: '📱'
      },

      // Content sections
      {
        title: 'Recent Activity',
        description: 'View recent commits and changes',
        category: 'Activity',
        keywords: ['activity', 'commits', 'changes', 'recent', 'history'],
        action: () => document.querySelector('#recent-activity')?.scrollIntoView(),
        icon: '🕐'
      },
      {
        title: 'Technology Stack',
        description: 'Learn about technologies used',
        category: 'Technical',
        keywords: ['technology', 'stack', 'tech', 'tools', 'framework'],
        action: () => document.querySelector('.tech-stack')?.scrollIntoView(),
        icon: '🛠️'
      }
    ];

    // Add page content to index
    this.indexPageContent();
  }

  indexPageContent() {
    // Index headings
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
      const text = heading.textContent.trim();
      if (text && text.length > 2) {
        this.searchIndex.push({
          title: text,
          description: `Navigate to ${text} section`,
          category: 'Navigation',
          keywords: text.toLowerCase().split(' '),
          action: () => heading.scrollIntoView({ behavior: 'smooth' }),
          icon: '📍'
        });
      }
    });

    // Index buttons and links with meaningful text
    const interactive = document.querySelectorAll('button, a[href]');
    interactive.forEach(element => {
      const text = element.textContent?.trim();
      const ariaLabel = element.getAttribute('aria-label');
      const title = element.getAttribute('title');

      const displayText = ariaLabel || title || text;
      if (displayText && displayText.length > 2 && !displayText.includes('×')) {
        this.searchIndex.push({
          title: displayText,
          description: `Activate: ${displayText}`,
          category: 'Action',
          keywords: displayText.toLowerCase().split(' '),
          action: () => {
            element.scrollIntoView({ behavior: 'smooth' });
            element.focus();
          },
          icon: '🎯'
        });
      }
    });
  }

  createSearchInterface() {
    const searchModal = document.createElement('div');
    searchModal.id = 'smart-search-modal';
    searchModal.className = 'smart-search-modal';
    searchModal.setAttribute('role', 'dialog');
    searchModal.setAttribute('aria-labelledby', 'search-title');
    searchModal.setAttribute('aria-hidden', 'true');

    searchModal.innerHTML = `
      <div class="search-overlay"></div>
      <div class="search-content">
        <div class="search-header">
          <div class="search-input-container">
            <span class="search-icon">🔍</span>
            <input 
              type="text" 
              id="smart-search-input" 
              placeholder="Search features, help, actions..."
              aria-label="Search CocoPilot"
              autocomplete="off"
              spellcheck="false"
            >
            <button class="search-clear" aria-label="Clear search">×</button>
          </div>
          <div class="search-shortcuts">
            <kbd>↑↓</kbd> navigate <kbd>↵</kbd> select <kbd>esc</kbd> close
          </div>
        </div>
        
        <div class="search-body">
          <div class="search-suggestions" id="search-suggestions">
            ${this.renderInitialSuggestions()}
          </div>
          
          <div class="search-results" id="search-results" style="display: none;">
            <!-- Results will be populated here -->
          </div>
        </div>

        <div class="search-footer">
          <div class="search-stats">
            <span id="search-stats-text">Start typing to search</span>
          </div>
          <div class="search-help">
            <span>💡 Try: "help", "theme", "analytics", or "shortcuts"</span>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(searchModal);
    this.searchModal = searchModal;
    this.bindSearchEvents();
    this.addSearchStyles();
  }

  renderInitialSuggestions() {
    const recentSearches = this.recentSearches.slice(0, 3);
    const popularSearches = this.popularSearches.slice(0, 6);

    return `
      ${recentSearches.length > 0 ? `
        <div class="suggestion-section">
          <h4>Recent Searches</h4>
          <div class="suggestion-list">
            ${recentSearches.map(search => `
              <button class="suggestion-item recent" data-query="${search}">
                <span class="suggestion-icon">🕐</span>
                <span class="suggestion-text">${search}</span>
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      <div class="suggestion-section">
        <h4>Popular Searches</h4>
        <div class="suggestion-list">
          ${popularSearches.map(search => `
            <button class="suggestion-item popular" data-query="${search}">
              <span class="suggestion-icon">🔥</span>
              <span class="suggestion-text">${search}</span>
            </button>
          `).join('')}
        </div>
      </div>
      
      <div class="suggestion-section">
        <h4>Quick Actions</h4>
        <div class="suggestion-list">
          <button class="suggestion-item action" data-action="help">
            <span class="suggestion-icon">❓</span>
            <span class="suggestion-text">Open Help Center</span>
          </button>
          <button class="suggestion-item action" data-action="theme">
            <span class="suggestion-icon">🌙</span>
            <span class="suggestion-text">Toggle Theme</span>
          </button>
          <button class="suggestion-item action" data-action="analytics">
            <span class="suggestion-icon">📊</span>
            <span class="suggestion-text">View Analytics</span>
          </button>
        </div>
      </div>
    `;
  }

  bindSearchEvents() {
    const input = this.searchModal.querySelector('#smart-search-input');
    const clearBtn = this.searchModal.querySelector('.search-clear');
    const overlay = this.searchModal.querySelector('.search-overlay');

    // Input events
    input.addEventListener('input', (e) => this.handleSearch(e.target.value));
    input.addEventListener('keydown', (e) => this.handleKeyNavigation(e));

    // Clear button
    clearBtn.addEventListener('click', () => {
      input.value = '';
      this.showSuggestions();
      input.focus();
    });

    // Close on overlay click
    overlay.addEventListener('click', () => this.hideSearch());

    // Suggestion clicks
    this.searchModal.addEventListener('click', (e) => {
      const suggestionItem = e.target.closest('.suggestion-item');
      if (suggestionItem) {
        const query = suggestionItem.dataset.query;
        const action = suggestionItem.dataset.action;

        if (query) {
          input.value = query;
          this.handleSearch(query);
        } else if (action) {
          this.executeQuickAction(action);
        }
      }

      const resultItem = e.target.closest('.result-item');
      if (resultItem) {
        const index = parseInt(resultItem.dataset.index);
        this.selectResult(index);
      }
    });

    // Modal keyboard events
    this.searchModal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideSearch();
      }
    });
  }

  bindKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+K or Cmd+K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.toggleSearch();
      }

      // Forward slash to open search (like GitHub)
      if (e.key === '/' && !this.isInputFocused()) {
        e.preventDefault();
        this.showSearch();
      }
    });
  }

  isInputFocused() {
    const activeElement = document.activeElement;
    return activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.contentEditable === 'true'
    );
  }

  handleSearch(query) {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length === 0) {
      this.showSuggestions();
      return;
    }

    if (trimmedQuery.length < 2) {
      this.showMinimalResults(trimmedQuery);
      return;
    }

    const results = this.searchInIndex(trimmedQuery);
    this.displayResults(results, trimmedQuery);
    this.updateSearchStats(results.length, trimmedQuery);
  }

  searchInIndex(query) {
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(word => word.length > 0);

    const results = this.searchIndex.map(item => {
      let score = 0;
      let titleMatch = false;
      let exactMatch = false;

      // Exact title match (highest priority)
      if (item.title.toLowerCase() === queryLower) {
        score += 1000;
        exactMatch = true;
      }

      // Title contains query
      if (item.title.toLowerCase().includes(queryLower)) {
        score += 500;
        titleMatch = true;
      }

      // Title starts with query
      if (item.title.toLowerCase().startsWith(queryLower)) {
        score += 300;
      }

      // Description contains query
      if (item.description?.toLowerCase().includes(queryLower)) {
        score += 200;
      }

      // Keyword matches
      queryWords.forEach(word => {
        item.keywords?.forEach(keyword => {
          if (keyword === word) {
            score += 150;
          } else if (keyword.includes(word)) {
            score += 75;
          } else if (this.fuzzyMatch(keyword, word)) {
            score += 25;
          }
        });
      });

      // Category match
      if (item.category?.toLowerCase().includes(queryLower)) {
        score += 100;
      }

      // Fuzzy title match
      if (!titleMatch && this.fuzzyMatch(item.title.toLowerCase(), queryLower)) {
        score += 50;
      }

      return {
        ...item,
        score,
        exactMatch,
        titleMatch
      };
    }).filter(item => item.score > 0);

    // Sort by score (descending)
    return results.sort((a, b) => b.score - a.score);
  }

  fuzzyMatch(text, pattern) {
    const textLower = text.toLowerCase();
    const patternLower = pattern.toLowerCase();

    let textIndex = 0;
    let patternIndex = 0;

    while (textIndex < textLower.length && patternIndex < patternLower.length) {
      if (textLower[textIndex] === patternLower[patternIndex]) {
        patternIndex++;
      }
      textIndex++;
    }

    return patternIndex === patternLower.length;
  }

  displayResults(results, query) {
    const resultsContainer = document.getElementById('search-results');
    const suggestionsContainer = document.getElementById('search-suggestions');

    suggestionsContainer.style.display = 'none';
    resultsContainer.style.display = 'block';

    if (results.length === 0) {
      resultsContainer.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">🔍</div>
          <div class="no-results-text">No results found for "${query}"</div>
          <div class="no-results-suggestion">Try a different search term or browse suggestions above</div>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = `
      <div class="results-list">
        ${results.slice(0, 8).map((result, index) => `
          <button class="result-item${index === 0 ? ' selected' : ''}" data-index="${index}">
            <div class="result-icon">${result.icon}</div>
            <div class="result-content">
              <div class="result-title">${this.highlightMatch(result.title, query)}</div>
              <div class="result-description">${result.description}</div>
              <div class="result-category">${result.category}</div>
            </div>
            <div class="result-shortcut">
              ${index < 9 ? `<kbd>${index + 1}</kbd>` : ''}
            </div>
          </button>
        `).join('')}
      </div>
    `;

    this.selectedIndex = 0;
  }

  highlightMatch(text, query) {
    if (!query) {
      return text;
    }

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  showSuggestions() {
    const resultsContainer = document.getElementById('search-results');
    const suggestionsContainer = document.getElementById('search-suggestions');

    resultsContainer.style.display = 'none';
    suggestionsContainer.style.display = 'block';

    const statsText = document.getElementById('search-stats-text');
    statsText.textContent = 'Start typing to search';
  }

  showMinimalResults(query) {
    // For very short queries, show filtered suggestions
    const filteredSuggestions = this.popularSearches.filter(suggestion =>
      suggestion.toLowerCase().startsWith(query.toLowerCase())
    );

    if (filteredSuggestions.length > 0) {
      const suggestionsContainer = document.getElementById('search-suggestions');
      suggestionsContainer.innerHTML = `
        <div class="suggestion-section">
          <h4>Matching Suggestions</h4>
          <div class="suggestion-list">
            ${filteredSuggestions.map(suggestion => `
              <button class="suggestion-item popular" data-query="${suggestion}">
                <span class="suggestion-icon">🔥</span>
                <span class="suggestion-text">${this.highlightMatch(suggestion, query)}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }
  }

  updateSearchStats(count, query) {
    const statsText = document.getElementById('search-stats-text');
    statsText.textContent = `${count} result${count !== 1 ? 's' : ''} for "${query}"`;
  }

  handleKeyNavigation(e) {
    const resultsContainer = document.getElementById('search-results');
    const resultItems = resultsContainer.querySelectorAll('.result-item');

    if (resultItems.length === 0) {
      return;
    }

    switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      this.selectedIndex = Math.min(this.selectedIndex + 1, resultItems.length - 1);
      this.updateSelection();
      break;

    case 'ArrowUp':
      e.preventDefault();
      this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
      this.updateSelection();
      break;

    case 'Enter':
      e.preventDefault();
      this.selectResult(this.selectedIndex);
      break;

    case 'Tab':
      e.preventDefault();
      if (e.shiftKey) {
        this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
      } else {
        this.selectedIndex = Math.min(this.selectedIndex + 1, resultItems.length - 1);
      }
      this.updateSelection();
      break;
    }

    // Number key shortcuts (1-9)
    if (e.key >= '1' && e.key <= '9') {
      const index = parseInt(e.key) - 1;
      if (index < resultItems.length) {
        e.preventDefault();
        this.selectResult(index);
      }
    }
  }

  updateSelection() {
    const resultItems = document.querySelectorAll('.result-item');
    resultItems.forEach((item, index) => {
      item.classList.toggle('selected', index === this.selectedIndex);
    });

    // Scroll selected item into view
    const selectedItem = resultItems[this.selectedIndex];
    if (selectedItem) {
      selectedItem.scrollIntoView({ block: 'nearest' });
    }
  }

  selectResult(index) {
    const resultsContainer = document.getElementById('search-results');
    const results = this.getSearchResults();

    if (results && results[index]) {
      const result = results[index];

      // Save to search history
      this.addToSearchHistory(result.title);

      // Execute action
      if (result.action) {
        result.action();
      }

      // Hide search
      this.hideSearch();

      // Analytics
      this.trackSearchSelection(result);
    }
  }

  executeQuickAction(action) {
    const actions = {
      help: () => window.helpSystem?.showHelp(),
      theme: () => document.querySelector('.theme-toggle')?.click(),
      analytics: () => document.getElementById('toggle-dashboard')?.click()
    };

    if (actions[action]) {
      actions[action]();
      this.hideSearch();
    }
  }

  getSearchResults() {
    // Store current results for selection
    return this.currentResults || [];
  }

  addToSearchHistory(term) {
    // Add to recent searches
    this.recentSearches = [term, ...this.recentSearches.filter(s => s !== term)].slice(0, 5);
    localStorage.setItem('cocopilot-recent-searches', JSON.stringify(this.recentSearches));

    // Add to search history with timestamp
    this.searchHistory.unshift({
      term,
      timestamp: Date.now()
    });

    // Keep only last 50 searches
    this.searchHistory = this.searchHistory.slice(0, 50);
    localStorage.setItem('cocopilot-search-history', JSON.stringify(this.searchHistory));
  }

  setupSearchAnalytics() {
    // Track search usage patterns
    this.searchAnalytics = {
      totalSearches: parseInt(localStorage.getItem('search-total') || '0'),
      popularTerms: JSON.parse(localStorage.getItem('search-popular-terms') || '{}')
    };
  }

  trackSearchSelection(result) {
    // Update analytics
    this.searchAnalytics.totalSearches++;
    localStorage.setItem('search-total', this.searchAnalytics.totalSearches.toString());

    // Track popular terms
    const term = result.title.toLowerCase();
    this.searchAnalytics.popularTerms[term] = (this.searchAnalytics.popularTerms[term] || 0) + 1;
    localStorage.setItem('search-popular-terms', JSON.stringify(this.searchAnalytics.popularTerms));

    // Send to analytics if available
    if (typeof gtag === 'function') {
      gtag('event', 'search_select', {
        search_term: result.title,
        result_category: result.category
      });
    }
  }

  toggleSearch() {
    if (this.isVisible) {
      this.hideSearch();
    } else {
      this.showSearch();
    }
  }

  showSearch() {
    this.searchModal.style.display = 'flex';
    this.searchModal.setAttribute('aria-hidden', 'false');
    this.isVisible = true;

    const input = this.searchModal.querySelector('#smart-search-input');
    setTimeout(() => {
      input.focus();
      input.select();
    }, 100);

    this.showSuggestions();
    document.body.style.overflow = 'hidden';

    // Analytics
    if (typeof gtag === 'function') {
      gtag('event', 'search_open');
    }
  }

  hideSearch() {
    this.searchModal.style.display = 'none';
    this.searchModal.setAttribute('aria-hidden', 'true');
    this.isVisible = false;

    document.body.style.overflow = '';

    // Clear search input
    const input = this.searchModal.querySelector('#smart-search-input');
    input.value = '';

    this.selectedIndex = 0;
  }

  addSearchStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
      .smart-search-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10001;
        display: none;
        align-items: flex-start;
        justify-content: center;
        padding-top: 10vh;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .search-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(8px);
      }

      .search-content {
        position: relative;
        background: var(--container-bg, white);
        border-radius: 16px;
        max-width: 90vw;
        width: 600px;
        max-height: 80vh;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        overflow: hidden;
        border: 1px solid var(--border-color, #e0e0e0);
        display: flex;
        flex-direction: column;
      }

      .search-header {
        padding: 20px 24px 16px;
        border-bottom: 1px solid var(--border-color, #e0e0e0);
      }

      .search-input-container {
        position: relative;
        display: flex;
        align-items: center;
        margin-bottom: 12px;
      }

      .search-icon {
        position: absolute;
        left: 16px;
        font-size: 1.2rem;
        color: var(--text-secondary, #666);
        z-index: 1;
      }

      #smart-search-input {
        width: 100%;
        padding: 16px 48px 16px 48px;
        border: 2px solid var(--border-color, #e0e0e0);
        border-radius: 12px;
        font-size: 1.1rem;
        background: var(--container-bg, white);
        color: var(--text-primary, #333);
        outline: none;
        transition: border-color 0.2s;
      }

      #smart-search-input:focus {
        border-color: var(--button-gradient-start, #667eea);
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .search-clear {
        position: absolute;
        right: 12px;
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--text-secondary, #666);
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        opacity: 0.7;
        transition: opacity 0.2s;
      }

      .search-clear:hover {
        opacity: 1;
        background: var(--border-color, #e0e0e0);
      }

      .search-shortcuts {
        display: flex;
        gap: 12px;
        font-size: 0.85rem;
        color: var(--text-secondary, #666);
        align-items: center;
      }

      .search-shortcuts kbd {
        background: var(--feature-bg, #f8f9fa);
        border: 1px solid var(--border-color, #e0e0e0);
        border-radius: 4px;
        padding: 2px 6px;
        font-family: monospace;
        font-size: 0.8rem;
      }

      .search-body {
        flex: 1;
        overflow-y: auto;
        padding: 0;
        min-height: 200px;
      }

      .search-suggestions,
      .search-results {
        padding: 16px 24px;
      }

      .suggestion-section {
        margin-bottom: 24px;
      }

      .suggestion-section:last-child {
        margin-bottom: 0;
      }

      .suggestion-section h4 {
        margin: 0 0 12px 0;
        font-size: 0.9rem;
        color: var(--text-secondary, #666);
        text-transform: uppercase;
        font-weight: 600;
        letter-spacing: 0.5px;
      }

      .suggestion-list {
        display: grid;
        gap: 6px;
      }

      .suggestion-item,
      .result-item {
        display: flex;
        align-items: center;
        padding: 12px;
        background: none;
        border: 1px solid transparent;
        border-radius: 8px;
        cursor: pointer;
        text-align: left;
        width: 100%;
        transition: all 0.2s;
        color: var(--text-primary, #333);
      }

      .suggestion-item:hover,
      .result-item:hover,
      .result-item.selected {
        background: var(--feature-bg, #f8f9fa);
        border-color: var(--border-color, #e0e0e0);
      }

      .suggestion-icon {
        font-size: 1.1rem;
        margin-right: 12px;
        opacity: 0.8;
      }

      .suggestion-text {
        font-size: 0.95rem;
      }

      .result-item {
        padding: 16px 12px;
      }

      .result-icon {
        font-size: 1.3rem;
        margin-right: 16px;
        min-width: 24px;
      }

      .result-content {
        flex: 1;
        min-width: 0;
      }

      .result-title {
        font-weight: 600;
        font-size: 1rem;
        margin-bottom: 4px;
        color: var(--text-primary, #333);
      }

      .result-title mark {
        background: rgba(102, 126, 234, 0.2);
        color: var(--button-gradient-start, #667eea);
        padding: 0;
        border-radius: 2px;
      }

      .result-description {
        font-size: 0.85rem;
        color: var(--text-secondary, #666);
        margin-bottom: 4px;
        line-height: 1.4;
      }

      .result-category {
        font-size: 0.75rem;
        color: var(--text-tertiary, #888);
        text-transform: uppercase;
        font-weight: 500;
        letter-spacing: 0.5px;
      }

      .result-shortcut {
        margin-left: 12px;
      }

      .result-shortcut kbd {
        background: var(--button-gradient-start, #667eea);
        color: white;
        border: none;
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 0.8rem;
        font-weight: bold;
      }

      .no-results {
        text-align: center;
        padding: 48px 24px;
        color: var(--text-secondary, #666);
      }

      .no-results-icon {
        font-size: 3rem;
        margin-bottom: 16px;
        opacity: 0.5;
      }

      .no-results-text {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 8px;
        color: var(--text-primary, #333);
      }

      .no-results-suggestion {
        font-size: 0.9rem;
        color: var(--text-secondary, #666);
      }

      .search-footer {
        padding: 12px 24px;
        border-top: 1px solid var(--border-color, #e0e0e0);
        background: var(--feature-bg, #f8f9fa);
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.8rem;
        color: var(--text-secondary, #666);
      }

      .search-help {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      @media (max-width: 768px) {
        .smart-search-modal {
          padding-top: 5vh;
        }

        .search-content {
          width: 95vw;
          max-height: 85vh;
        }

        .search-header {
          padding: 16px 20px;
        }

        .search-suggestions,
        .search-results {
          padding: 12px 20px;
        }

        .search-footer {
          flex-direction: column;
          gap: 8px;
          text-align: center;
        }

        .result-shortcut {
          display: none;
        }
      }

      /* Dark theme support */
      [data-theme="dark"] .search-content {
        background: #1a1a1a;
        border-color: #333;
      }

      [data-theme="dark"] #smart-search-input {
        background: #2a2a2a;
        border-color: #333;
        color: #fff;
      }

      [data-theme="dark"] .search-footer {
        background: #2a2a2a;
        border-color: #333;
      }

      [data-theme="dark"] .suggestion-item:hover,
      [data-theme="dark"] .result-item:hover,
      [data-theme="dark"] .result-item.selected {
        background: #2a2a2a;
        border-color: #444;
      }

      [data-theme="dark"] .search-shortcuts kbd {
        background: #2a2a2a;
        border-color: #444;
      }
    `;

    document.head.appendChild(styles);
  }
}

// Initialize smart search when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.smartSearch = new SmartSearch();
  });
} else {
  window.smartSearch = new SmartSearch();
}

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SmartSearch;
}