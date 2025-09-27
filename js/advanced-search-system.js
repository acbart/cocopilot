/**
 * Advanced Search System - Comprehensive fuzzy search across all content
 * Provides intelligent search with autocomplete, categories, and contextual results
 */

class AdvancedSearchSystem {
  constructor() {
    this.searchIndex = new Map();
    this.searchHistory = [];
    this.isInitialized = false;
    this.searchModal = null;
    this.searchInput = null;
    this.resultsContainer = null;
    this.categories = {
      pages: [],
      features: [],
      documentation: [],
      code: [],
      insights: []
    };

    this.init();
  }

  async init() {
    if (this.isInitialized) {
      return;
    }

    console.log('🔍 Initializing Advanced Search System...');

    await this.buildSearchIndex();
    this.createSearchInterface();
    this.setupKeyboardShortcuts();
    this.addSearchStyles();

    this.isInitialized = true;
    console.log('✅ Advanced Search System initialized');
  }

  async buildSearchIndex() {
    // Index main pages and their content
    const pages = [
      {
        id: 'home',
        title: 'Home - CocoPilot',
        description: 'Self-updating repository with AI-driven improvements',
        url: 'index.html',
        category: 'pages',
        keywords: ['home', 'main', 'dashboard', 'overview', 'cocopilot', 'ai', 'repository'],
        content: 'self-updating repository ai-driven improvements github copilot automation'
      },
      {
        id: 'features',
        title: 'Features Showcase',
        description: 'Comprehensive gallery of CocoPilot capabilities',
        url: 'features.html',
        category: 'pages',
        keywords: ['features', 'capabilities', 'showcase', 'gallery', 'functionality'],
        content: 'ai education code playground analytics dashboard mobile pwa accessibility'
      },
      {
        id: 'documentation',
        title: 'Documentation Hub',
        description: 'Complete user and developer documentation',
        url: 'documentation.html',
        category: 'pages',
        keywords: ['docs', 'documentation', 'guide', 'help', 'manual', 'api'],
        content: 'user guide developer guide api reference setup deployment testing'
      },
      {
        id: 'timeline',
        title: 'Project Timeline',
        description: 'Evolution roadmap and milestone tracking',
        url: 'timeline.html',
        category: 'pages',
        keywords: ['timeline', 'roadmap', 'history', 'evolution', 'milestones', 'progress'],
        content: 'project evolution milestones roadmap future plans development history'
      },
      {
        id: 'analytics',
        title: 'Analytics Dashboard',
        description: 'Repository performance and engagement metrics',
        url: 'analytics.html',
        category: 'pages',
        keywords: ['analytics', 'metrics', 'dashboard', 'performance', 'stats', 'data'],
        content: 'repository metrics performance analytics engagement tracking statistics'
      },
      {
        id: 'community',
        title: 'Community Hub',
        description: 'Community engagement and collaboration features',
        url: 'community.html',
        category: 'pages',
        keywords: ['community', 'collaboration', 'social', 'engagement', 'contributors'],
        content: 'community hub collaboration contributors engagement social features'
      }
    ];

    // Index features
    const features = [
      {
        id: 'ai-education',
        title: 'AI Education Hub',
        description: 'Interactive learning modules with hands-on tutorials',
        category: 'features',
        keywords: ['education', 'learning', 'tutorials', 'ai', 'lessons', 'training'],
        content: 'interactive learning modules ai development tutorials hands-on examples'
      },
      {
        id: 'code-playground',
        title: 'Code Playground',
        description: 'Live coding environment with AI examples',
        category: 'features',
        keywords: ['playground', 'code', 'editor', 'live', 'interactive', 'examples'],
        content: 'live coding environment ai examples interactive editor real-time execution'
      },
      {
        id: 'health-monitor',
        title: 'Project Health Monitor',
        description: 'Animated dashboard showing real-time project metrics',
        category: 'features',
        keywords: ['health', 'monitor', 'dashboard', 'metrics', 'status', 'quality'],
        content: 'project health monitoring real-time metrics code quality dashboard'
      },
      {
        id: 'accessibility',
        title: 'Accessibility Excellence',
        description: 'WCAG 2.1 AA compliance with comprehensive testing',
        category: 'features',
        keywords: ['accessibility', 'wcag', 'inclusive', 'a11y', 'screen reader', 'keyboard'],
        content: 'wcag compliance accessibility screen reader keyboard navigation inclusive design'
      },
      {
        id: 'pwa',
        title: 'Progressive Web App',
        description: 'Offline support and mobile-first design',
        category: 'features',
        keywords: ['pwa', 'progressive', 'offline', 'mobile', 'app', 'install'],
        content: 'progressive web app offline support mobile-first responsive design'
      },
      {
        id: 'internationalization',
        title: 'Internationalization',
        description: 'Multi-language support with cultural adaptations',
        category: 'features',
        keywords: ['i18n', 'languages', 'international', 'localization', 'translation'],
        content: 'internationalization multi-language support localization translation'
      }
    ];

    // Index documentation topics
    const documentation = [
      {
        id: 'getting-started',
        title: 'Getting Started Guide',
        description: 'Quick setup and introduction to CocoPilot',
        category: 'documentation',
        keywords: ['setup', 'install', 'getting started', 'quick start', 'introduction'],
        content: 'setup guide installation getting started quick start introduction'
      },
      {
        id: 'api-reference',
        title: 'API Reference',
        description: 'Complete API documentation and examples',
        category: 'documentation',
        keywords: ['api', 'reference', 'methods', 'endpoints', 'documentation'],
        content: 'api reference documentation methods endpoints examples integration'
      },
      {
        id: 'development-guide',
        title: 'Development Guide',
        description: 'Developer setup and contribution guidelines',
        category: 'documentation',
        keywords: ['development', 'dev', 'contribute', 'build', 'local', 'setup'],
        content: 'development guide local setup contribution guidelines building testing'
      }
    ];

    // Index code examples and snippets
    const codeExamples = [
      {
        id: 'ai-integration',
        title: 'AI Integration Examples',
        description: 'Code examples for AI-driven development',
        category: 'code',
        keywords: ['ai', 'integration', 'code', 'examples', 'snippets', 'implementation'],
        content: 'ai integration code examples implementation snippets github copilot'
      },
      {
        id: 'module-system',
        title: 'Module System',
        description: 'JavaScript module architecture and loading',
        category: 'code',
        keywords: ['modules', 'javascript', 'architecture', 'loading', 'system'],
        content: 'javascript modules module system architecture dynamic loading'
      }
    ];

    // Build the search index
    [...pages, ...features, ...documentation, ...codeExamples].forEach(item => {
      this.searchIndex.set(item.id, item);
      this.categories[item.category].push(item);
    });

    console.log(`📊 Search index built with ${this.searchIndex.size} items`);
  }

  createSearchInterface() {
    // Create search modal
    this.searchModal = document.createElement('div');
    this.searchModal.id = 'advanced-search-modal';
    this.searchModal.className = 'search-modal hidden';
    this.searchModal.innerHTML = `
      <div class="search-backdrop" onclick="window.advancedSearch?.hideSearch()"></div>
      <div class="search-container">
        <div class="search-header">
          <div class="search-input-wrapper">
            <span class="search-icon">🔍</span>
            <input type="text" 
                   id="advanced-search-input" 
                   class="search-input" 
                   placeholder="Search everything... (try 'ai', 'features', 'docs')"
                   autocomplete="off"
                   spellcheck="false">
            <button class="search-close" onclick="window.advancedSearch?.hideSearch()" aria-label="Close search">✕</button>
          </div>
          <div class="search-filters">
            <button class="filter-btn active" data-category="all">All</button>
            <button class="filter-btn" data-category="pages">Pages</button>
            <button class="filter-btn" data-category="features">Features</button>
            <button class="filter-btn" data-category="documentation">Docs</button>
            <button class="filter-btn" data-category="code">Code</button>
          </div>
        </div>

        <div class="search-body">
          <div class="search-results" id="search-results">
            <div class="search-welcome">
              <div class="welcome-icon">🎯</div>
              <h3>Search CocoPilot</h3>
              <p>Find pages, features, documentation, and code examples instantly</p>
              <div class="search-suggestions">
                <span class="suggestion-label">Try searching for:</span>
                <button class="suggestion-btn" onclick="window.advancedSearch?.performSearch('ai education')">AI Education</button>
                <button class="suggestion-btn" onclick="window.advancedSearch?.performSearch('code playground')">Code Playground</button>
                <button class="suggestion-btn" onclick="window.advancedSearch?.performSearch('documentation')">Documentation</button>
                <button class="suggestion-btn" onclick="window.advancedSearch?.performSearch('accessibility')">Accessibility</button>
              </div>
            </div>
          </div>

          <div class="search-footer">
            <div class="search-shortcuts">
              <div class="shortcut">
                <kbd>↑</kbd><kbd>↓</kbd> Navigate
              </div>
              <div class="shortcut">
                <kbd>Enter</kbd> Select
              </div>
              <div class="shortcut">
                <kbd>Esc</kbd> Close
              </div>
            </div>
            <div class="search-stats" id="search-stats">
              ${this.searchIndex.size} items indexed
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.searchModal);

    // Cache DOM elements
    this.searchInput = document.getElementById('advanced-search-input');
    this.resultsContainer = document.getElementById('search-results');

    // Add search trigger button to existing navigation
    this.addSearchTrigger();

    // Setup event listeners
    this.setupSearchEvents();
  }

  addSearchTrigger() {
    // Add search button to main navigation if it exists
    const quickNav = document.querySelector('.quick-nav');
    if (quickNav) {
      const searchBtn = document.createElement('button');
      searchBtn.className = 'nav-btn search-trigger';
      searchBtn.innerHTML = '🔍';
      searchBtn.title = 'Search (Ctrl+K)';
      searchBtn.setAttribute('aria-label', 'Open search');
      searchBtn.onclick = () => this.showSearch();

      quickNav.insertBefore(searchBtn, quickNav.firstChild);
    }

    // Also add to quick start guide if it exists
    const quickStartGuide = document.querySelector('.quick-start-guide');
    if (quickStartGuide) {
      const trySearchBtn = document.querySelector('.quick-start-guide button[onclick*="search"]');
      if (trySearchBtn) {
        trySearchBtn.onclick = () => this.showSearch();
      }
    }
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+K or Cmd+K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.showSearch();
      }

      // Escape to close search
      if (e.key === 'Escape' && !this.searchModal.classList.contains('hidden')) {
        this.hideSearch();
      }
    });
  }

  setupSearchEvents() {
    // Search input events
    this.searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      if (query.length > 0) {
        this.performSearch(query);
      } else {
        this.showWelcome();
      }
    });

    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const query = this.searchInput.value.trim();
        if (query) {
          this.performSearch(query, btn.dataset.category);
        }
      });
    });

    // Keyboard navigation in results
    this.searchInput.addEventListener('keydown', (e) => {
      const results = document.querySelectorAll('.search-result-item');
      const activeResult = document.querySelector('.search-result-item.active');

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (activeResult) {
          activeResult.classList.remove('active');
          const next = activeResult.nextElementSibling;
          if (next) {
            next.classList.add('active');
          } else {
            results[0]?.classList.add('active');
          }
        } else {
          results[0]?.classList.add('active');
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (activeResult) {
          activeResult.classList.remove('active');
          const prev = activeResult.previousElementSibling;
          if (prev) {
            prev.classList.add('active');
          } else {
            results[results.length - 1]?.classList.add('active');
          }
        } else {
          results[results.length - 1]?.classList.add('active');
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeResult) {
          activeResult.click();
        }
      }
    });
  }

  showSearch() {
    this.searchModal.classList.remove('hidden');
    this.searchInput.focus();
    document.body.style.overflow = 'hidden';

    // Analytics
    if (window.enhancedAnalytics) {
      window.enhancedAnalytics.trackEvent('search_opened', {
        timestamp: Date.now()
      });
    }
  }

  hideSearch() {
    this.searchModal.classList.add('hidden');
    this.searchInput.value = '';
    this.showWelcome();
    document.body.style.overflow = '';

    // Remove active states
    document.querySelectorAll('.search-result-item.active').forEach(item => {
      item.classList.remove('active');
    });
  }

  performSearch(query, category = 'all') {
    const results = this.fuzzySearch(query, category);
    this.displayResults(results, query);

    // Update search history
    if (!this.searchHistory.includes(query)) {
      this.searchHistory.unshift(query);
      this.searchHistory = this.searchHistory.slice(0, 10); // Keep last 10 searches
    }

    // Analytics
    if (window.enhancedAnalytics) {
      window.enhancedAnalytics.trackEvent('search_performed', {
        query,
        category,
        resultCount: results.length,
        timestamp: Date.now()
      });
    }
  }

  fuzzySearch(query, category = 'all') {
    const searchTerms = query.toLowerCase().split(' ');
    const results = [];

    for (const [id, item] of this.searchIndex) {
      if (category !== 'all' && item.category !== category) {
        continue;
      }

      let score = 0;
      const searchableText = `${item.title} ${item.description} ${item.keywords.join(' ')} ${item.content}`.toLowerCase();

      // Calculate relevance score
      searchTerms.forEach(term => {
        // Exact matches in title get highest score
        if (item.title.toLowerCase().includes(term)) {
          score += 100;
        }

        // Matches in keywords get high score
        if (item.keywords.some(keyword => keyword.includes(term))) {
          score += 50;
        }

        // Matches in description get medium score
        if (item.description.toLowerCase().includes(term)) {
          score += 30;
        }

        // Matches in content get lower score
        if (item.content.includes(term)) {
          score += 10;
        }

        // Partial matches (fuzzy)
        const fuzzyMatches = this.findFuzzyMatches(term, searchableText);
        score += fuzzyMatches * 5;
      });

      if (score > 0) {
        results.push({ ...item, score });
      }
    }

    // Sort by relevance score
    return results.sort((a, b) => b.score - a.score);
  }

  findFuzzyMatches(term, text) {
    let matches = 0;
    const termLength = term.length;

    for (let i = 0; i <= text.length - termLength; i++) {
      const substring = text.substr(i, termLength);
      const similarity = this.calculateSimilarity(term, substring);
      if (similarity > 0.7) {
        matches++;
      }
    }

    return matches;
  }

  calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) {
      return 1.0;
    }

    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  levenshteinDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  displayResults(results, query) {
    if (results.length === 0) {
      this.resultsContainer.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">🔍</div>
          <h3>No results found</h3>
          <p>No results for "<strong>${query}</strong>"</p>
          <div class="no-results-suggestions">
            <p>Try searching for:</p>
            <button class="suggestion-btn" onclick="window.advancedSearch?.performSearch('features')">Features</button>
            <button class="suggestion-btn" onclick="window.advancedSearch?.performSearch('documentation')">Documentation</button>
            <button class="suggestion-btn" onclick="window.advancedSearch?.performSearch('ai')">AI</button>
          </div>
        </div>
      `;
      return;
    }

    const resultsHTML = results.map((result, index) => `
      <div class="search-result-item ${index === 0 ? 'active' : ''}" onclick="window.advancedSearch?.selectResult('${result.id}', '${result.url || ''}')">
        <div class="result-header">
          <div class="result-icon">${this.getCategoryIcon(result.category)}</div>
          <div class="result-title">${this.highlightMatches(result.title, query)}</div>
          <div class="result-category">${result.category}</div>
        </div>
        <div class="result-description">${this.highlightMatches(result.description, query)}</div>
        <div class="result-meta">
          <div class="result-score">Score: ${result.score}</div>
          ${result.url ? `<div class="result-url">${result.url}</div>` : ''}
        </div>
      </div>
    `).join('');

    this.resultsContainer.innerHTML = `
      <div class="search-results-header">
        <h3>${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"</h3>
      </div>
      ${resultsHTML}
    `;

    // Update stats
    document.getElementById('search-stats').textContent = `${results.length} of ${this.searchIndex.size} items`;
  }

  highlightMatches(text, query) {
    if (!query) {
      return text;
    }

    const terms = query.split(' ');
    let highlightedText = text;

    terms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
    });

    return highlightedText;
  }

  getCategoryIcon(category) {
    const icons = {
      pages: '📄',
      features: '✨',
      documentation: '📚',
      code: '💻',
      insights: '💡'
    };
    return icons[category] || '📄';
  }

  showWelcome() {
    this.resultsContainer.innerHTML = `
      <div class="search-welcome">
        <div class="welcome-icon">🎯</div>
        <h3>Search CocoPilot</h3>
        <p>Find pages, features, documentation, and code examples instantly</p>
        <div class="search-suggestions">
          <span class="suggestion-label">Try searching for:</span>
          <button class="suggestion-btn" onclick="window.advancedSearch?.performSearch('ai education')">AI Education</button>
          <button class="suggestion-btn" onclick="window.advancedSearch?.performSearch('code playground')">Code Playground</button>
          <button class="suggestion-btn" onclick="window.advancedSearch?.performSearch('documentation')">Documentation</button>
          <button class="suggestion-btn" onclick="window.advancedSearch?.performSearch('accessibility')">Accessibility</button>
        </div>
        ${this.searchHistory.length > 0 ? `
          <div class="search-history">
            <span class="history-label">Recent searches:</span>
            ${this.searchHistory.slice(0, 5).map(term =>
    `<button class="suggestion-btn" onclick="window.advancedSearch?.performSearch('${term}')">${term}</button>`
  ).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  selectResult(id, url) {
    const result = this.searchIndex.get(id);
    if (!result) {
      return;
    }

    // Hide search
    this.hideSearch();

    // Navigate to result
    if (url) {
      if (url.startsWith('#')) {
        // Scroll to element on current page
        const element = document.querySelector(url);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else if (url.startsWith('http')) {
        // External link
        window.open(url, '_blank');
      } else {
        // Internal page
        window.location.href = url;
      }
    }

    // Analytics
    if (window.enhancedAnalytics) {
      window.enhancedAnalytics.trackEvent('search_result_selected', {
        resultId: id,
        resultTitle: result.title,
        resultCategory: result.category,
        url: url,
        timestamp: Date.now()
      });
    }
  }

  addSearchStyles() {
    const styles = `
      <style id="advanced-search-styles">
        .search-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10000;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 10vh;
          opacity: 1;
          visibility: visible;
          transition: all 0.3s ease;
        }

        .search-modal.hidden {
          opacity: 0;
          visibility: hidden;
        }

        .search-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(5px);
        }

        .search-container {
          position: relative;
          width: 90%;
          max-width: 700px;
          max-height: 80vh;
          background: var(--container-bg);
          border: 2px solid var(--border-color);
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
          overflow: hidden;
          transform: translateY(0);
          transition: transform 0.3s ease;
        }

        .search-modal.hidden .search-container {
          transform: translateY(-20px);
        }

        .search-header {
          padding: 20px;
          border-bottom: 1px solid var(--border-color);
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }

        .search-icon {
          position: absolute;
          left: 15px;
          font-size: 1.2rem;
          color: var(--text-secondary);
        }

        .search-input {
          width: 100%;
          padding: 15px 50px 15px 50px;
          border: 2px solid var(--border-color);
          border-radius: 12px;
          background: var(--container-bg);
          color: var(--text-primary);
          font-size: 1.1rem;
          outline: none;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          border-color: var(--button-gradient-start);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
        }

        .search-close {
          position: absolute;
          right: 15px;
          background: none;
          border: none;
          font-size: 1.2rem;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 5px;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .search-close:hover {
          background: var(--feature-bg);
          color: var(--text-primary);
        }

        .search-filters {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 8px 16px;
          border: 1px solid var(--border-color);
          border-radius: 20px;
          background: var(--container-bg);
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .filter-btn:hover {
          background: var(--feature-bg);
          color: var(--text-primary);
        }

        .filter-btn.active {
          background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
          color: white;
          border-color: var(--button-gradient-start);
        }

        .search-body {
          max-height: 50vh;
          overflow-y: auto;
          padding: 0;
        }

        .search-results {
          padding: 20px;
        }

        .search-welcome {
          text-align: center;
          padding: 40px 20px;
        }

        .welcome-icon {
          font-size: 3rem;
          margin-bottom: 15px;
        }

        .search-welcome h3 {
          margin: 0 0 10px 0;
          color: var(--text-primary);
          font-size: 1.5rem;
        }

        .search-welcome p {
          margin: 0 0 25px 0;
          color: var(--text-secondary);
        }

        .search-suggestions, 
        .search-history {
          margin: 20px 0;
        }

        .suggestion-label,
        .history-label {
          display: block;
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 10px;
        }

        .suggestion-btn {
          display: inline-block;
          margin: 4px;
          padding: 6px 12px;
          background: var(--feature-bg);
          border: 1px solid var(--border-color);
          border-radius: 15px;
          color: var(--text-primary);
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.3s ease;
        }

        .suggestion-btn:hover {
          background: var(--button-gradient-start);
          color: white;
          transform: translateY(-1px);
        }

        .search-results-header {
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--border-color);
        }

        .search-results-header h3 {
          margin: 0;
          color: var(--text-primary);
          font-size: 1.2rem;
        }

        .search-result-item {
          padding: 15px;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          margin-bottom: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: var(--container-bg);
        }

        .search-result-item:hover,
        .search-result-item.active {
          background: var(--feature-bg);
          border-color: var(--button-gradient-start);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
        }

        .result-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .result-icon {
          font-size: 1.2rem;
        }

        .result-title {
          flex-grow: 1;
          font-weight: 600;
          color: var(--text-primary);
          font-size: 1.1rem;
        }

        .result-category {
          background: var(--button-gradient-start);
          color: white;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 0.75rem;
          text-transform: uppercase;
        }

        .result-description {
          color: var(--text-secondary);
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .result-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          color: var(--text-tertiary);
        }

        .result-url {
          font-family: monospace;
          background: rgba(102, 126, 234, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .no-results {
          text-align: center;
          padding: 40px 20px;
        }

        .no-results-icon {
          font-size: 3rem;
          margin-bottom: 15px;
          opacity: 0.5;
        }

        .no-results h3 {
          margin: 0 0 10px 0;
          color: var(--text-primary);
        }

        .no-results p {
          margin: 0 0 25px 0;
          color: var(--text-secondary);
        }

        .search-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          border-top: 1px solid var(--border-color);
          background: var(--feature-bg);
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .search-shortcuts {
          display: flex;
          gap: 15px;
        }

        .shortcut {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .shortcut kbd {
          background: var(--container-bg);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          padding: 2px 6px;
          font-size: 0.8rem;
          font-family: monospace;
        }

        .search-trigger {
          background: var(--feature-bg) !important;
          border: 1px solid var(--border-color) !important;
          color: var(--text-primary) !important;
        }

        .search-trigger:hover {
          background: var(--button-gradient-start) !important;
          color: white !important;
        }

        mark {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3));
          color: var(--text-primary);
          padding: 1px 2px;
          border-radius: 2px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .search-container {
            width: 95%;
            max-height: 90vh;
          }

          .search-input {
            font-size: 1rem;
            padding: 12px 45px 12px 45px;
          }

          .search-filters {
            gap: 5px;
          }

          .filter-btn {
            padding: 6px 12px;
            font-size: 0.85rem;
          }

          .search-footer {
            flex-direction: column;
            gap: 10px;
            text-align: center;
          }

          .search-shortcuts {
            justify-content: center;
          }
        }

        /* Dark Theme Support */
        [data-theme="dark"] .search-backdrop {
          background: rgba(0, 0, 0, 0.8);
        }

        [data-theme="dark"] .search-result-item:hover,
        [data-theme="dark"] .search-result-item.active {
          background: rgba(102, 126, 234, 0.2);
        }

        [data-theme="dark"] mark {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.4), rgba(118, 75, 162, 0.4));
          color: var(--text-primary);
        }
      </style>
    `;

    if (!document.getElementById('advanced-search-styles')) {
      document.head.insertAdjacentHTML('beforeend', styles);
    }
  }
}

// Initialize the advanced search system
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
    window.advancedSearch = new AdvancedSearchSystem();
  }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdvancedSearchSystem;
}