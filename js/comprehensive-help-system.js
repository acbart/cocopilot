/**
 * Comprehensive Help System
 * Provides contextual help, keyboard shortcuts, and feature discovery
 */

class ComprehensiveHelpSystem {
  constructor() {
    this.isInitialized = false;
    this.helpData = new Map();
    this.currentContext = 'general';
    this.searchIndex = [];
    this.userPreferences = this.loadUserPreferences();
    this.init();
  }

  async init() {
    try {
      await this.setupHelpData();
      await this.setupUI();
      this.setupEventListeners();
      this.buildSearchIndex();
      this.isInitialized = true;
      console.log('Comprehensive Help System initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Comprehensive Help System:', error);
    }
  }

  async setupHelpData() {
    // Define comprehensive help content
    this.helpData.set('keyboard-shortcuts', {
      title: '⌨️ Keyboard Shortcuts',
      category: 'navigation',
      content: [
        { key: 'Ctrl + /', action: 'Open/close help system' },
        { key: 'Ctrl + K', action: 'Open universal search' },
        { key: 'Ctrl + Shift + N', action: 'Open notification settings' },
        { key: 'Ctrl + ?', action: 'Show interactive tutorials' },
        { key: 'Alt + 0', action: 'Open accessibility panel' },
        { key: 'T', action: 'Toggle dark/light theme' },
        { key: 'R', action: 'Open RSS feed modal' },
        { key: 'Esc', action: 'Close active modal or panel' },
        { key: '?', action: 'Show context-sensitive help' }
      ]
    });

    this.helpData.set('ai-features', {
      title: '🤖 AI-Powered Features',
      category: 'features',
      content: [
        {
          title: 'AI Code Suggestions',
          description: 'Get intelligent code recommendations and development advice',
          usage: 'Click the AI suggestions panel (top-right) or ask questions directly'
        },
        {
          title: 'Smart Notifications',
          description: 'Receive contextual alerts and performance suggestions',
          usage: 'Notifications appear automatically based on your activity'
        },
        {
          title: 'Interactive Tutorials',
          description: 'Learn features through guided step-by-step tours',
          usage: 'Press Ctrl+? or click tutorial prompts to start learning'
        },
        {
          title: 'AI Education Module',
          description: 'Interactive lessons about AI-driven development',
          usage: 'Scroll down to find the AI Education section with hands-on examples'
        }
      ]
    });

    this.helpData.set('collaboration', {
      title: '👥 Collaboration Features',
      category: 'features',
      content: [
        {
          title: 'Community Hub',
          description: 'Connect with other developers and share experiences',
          usage: 'Open the collaboration hub (bottom-right panel) to join conversations'
        },
        {
          title: 'Session Management',
          description: 'Create or join collaborative development sessions',
          usage: 'Use the Sessions tab in the collaboration hub to manage sessions'
        },
        {
          title: 'Sharing Tools',
          description: 'Share pages, screenshots, and ideas with the community',
          usage: 'Access sharing options in the Share tab of the collaboration hub'
        }
      ]
    });

    this.helpData.set('accessibility', {
      title: '♿ Accessibility Features',
      category: 'accessibility',
      content: [
        {
          title: 'Keyboard Navigation',
          description: 'Full keyboard support for all features',
          usage: 'Use Tab to navigate, Enter to activate, Esc to close'
        },
        {
          title: 'Screen Reader Support',
          description: 'Comprehensive ARIA labels and screen reader compatibility',
          usage: 'All features include proper ARIA labels and live regions'
        },
        {
          title: 'High Contrast Mode',
          description: 'Enhanced contrast for visual accessibility',
          usage: 'Press Alt+0 to access accessibility settings panel'
        },
        {
          title: 'Reduced Motion',
          description: 'Respects user preferences for motion sensitivity',
          usage: 'Set reduced motion in your browser or OS preferences'
        }
      ]
    });

    this.helpData.set('getting-started', {
      title: '🚀 Getting Started',
      category: 'basics',
      content: [
        {
          title: 'Welcome Tour',
          description: 'Take a guided tour to learn the basics',
          usage: 'Press Ctrl+? and select "Welcome Tour" to get started'
        },
        {
          title: 'Theme Customization',
          description: 'Switch between light and dark themes',
          usage: 'Click the theme toggle button or press T'
        },
        {
          title: 'AI Assistance',
          description: 'Get help from AI-powered suggestions',
          usage: 'Open the AI suggestions panel and ask questions'
        },
        {
          title: 'Performance Monitoring',
          description: 'Monitor site performance and get optimization tips',
          usage: 'Performance metrics are displayed automatically in notifications'
        }
      ]
    });

    this.helpData.set('troubleshooting', {
      title: '🔧 Troubleshooting',
      category: 'support',
      content: [
        {
          title: 'Page Loading Issues',
          description: 'If the page loads slowly or incompletely',
          solution: 'Try refreshing the page, clearing browser cache, or checking internet connection'
        },
        {
          title: 'Feature Not Working',
          description: 'If a feature seems unresponsive',
          solution: 'Ensure JavaScript is enabled, try in incognito mode, or refresh the page'
        },
        {
          title: 'Mobile Display Issues',
          description: 'If the site doesn\'t display correctly on mobile',
          solution: 'Try rotating your device, refreshing the page, or using a different browser'
        },
        {
          title: 'Accessibility Problems',
          description: 'If you encounter accessibility barriers',
          solution: 'Press Alt+0 for accessibility options or contact support for assistance'
        }
      ]
    });
  }

  async setupUI() {
    // Create help system modal
    const helpModal = document.createElement('div');
    helpModal.id = 'comprehensive-help-modal';
    helpModal.className = 'comprehensive-help-modal';
    helpModal.style.display = 'none';
    helpModal.innerHTML = `
      <div class="help-modal-overlay" aria-hidden="true"></div>
      <div class="help-modal-content" role="dialog" aria-labelledby="help-modal-title" aria-modal="true">
        <div class="help-modal-header">
          <h2 id="help-modal-title">📖 Comprehensive Help</h2>
          <button class="help-modal-close" aria-label="Close help" title="Close help (Esc)">×</button>
        </div>
        
        <div class="help-modal-body">
          <div class="help-search-section">
            <div class="help-search-container">
              <input type="text" id="help-search-input" placeholder="Search help topics..." 
                     aria-label="Search help topics">
              <button id="help-search-clear" aria-label="Clear search">×</button>
            </div>
            <div class="help-search-results" id="help-search-results"></div>
          </div>
          
          <div class="help-categories">
            <button class="help-category-btn active" data-category="all">All Topics</button>
            <button class="help-category-btn" data-category="basics">Getting Started</button>
            <button class="help-category-btn" data-category="features">Features</button>
            <button class="help-category-btn" data-category="navigation">Navigation</button>
            <button class="help-category-btn" data-category="accessibility">Accessibility</button>
            <button class="help-category-btn" data-category="support">Support</button>
          </div>
          
          <div class="help-content-area" id="help-content-area">
            <!-- Help content will be populated here -->
          </div>
        </div>
        
        <div class="help-modal-footer">
          <div class="help-footer-links">
            <a href="https://github.com/acbart/cocopilot/issues" target="_blank" rel="noopener">
              🐛 Report Issue
            </a>
            <a href="https://github.com/acbart/cocopilot" target="_blank" rel="noopener">
              📚 Documentation
            </a>
            <button class="help-feedback-btn">💬 Send Feedback</button>
          </div>
          <div class="help-footer-tip">
            <strong>Tip:</strong> Press Ctrl+/ anytime to open help
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(helpModal);

    // Create help trigger button
    const helpTrigger = document.createElement('button');
    helpTrigger.id = 'help-trigger-btn';
    helpTrigger.className = 'help-trigger-btn';
    helpTrigger.innerHTML = '❓';
    helpTrigger.title = 'Get Help (Ctrl+/)';
    helpTrigger.setAttribute('aria-label', 'Open help system');

    // Add CSS styles
    this.addStyles();

    // Insert trigger button
    document.body.appendChild(helpTrigger);

    // Populate initial content
    this.populateHelpContent();
  }

  addStyles() {
    if (document.getElementById('comprehensive-help-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'comprehensive-help-styles';
    styles.textContent = `
      .help-trigger-btn {
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--button-gradient-start, #667eea), var(--button-gradient-end, #764ba2));
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .help-trigger-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      }

      .comprehensive-help-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .help-modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(4px);
      }

      .help-modal-content {
        position: relative;
        background: var(--container-bg, white);
        border-radius: 16px;
        max-width: 900px;
        width: 95%;
        max-height: 90vh;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .help-modal-header {
        padding: 20px 24px;
        border-bottom: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .help-modal-header h2 {
        margin: 0;
        color: var(--text-primary, #333);
        font-size: 1.5rem;
      }

      .help-modal-close {
        background: none;
        border: none;
        font-size: 1.8rem;
        color: var(--text-secondary, #666);
        cursor: pointer;
        padding: 0;
        line-height: 1;
        transition: color 0.2s ease;
      }

      .help-modal-close:hover {
        color: var(--text-primary, #333);
      }

      .help-modal-body {
        flex: 1;
        padding: 24px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .help-search-section {
        position: relative;
      }

      .help-search-container {
        position: relative;
        display: flex;
        align-items: center;
      }

      #help-search-input {
        width: 100%;
        padding: 12px 16px;
        padding-right: 40px;
        border: 2px solid var(--border-color, rgba(102, 126, 234, 0.2));
        border-radius: 10px;
        font-size: 1rem;
        background: var(--container-bg, white);
        color: var(--text-primary, #333);
        transition: border-color 0.2s ease;
      }

      #help-search-input:focus {
        outline: none;
        border-color: var(--button-gradient-start, #667eea);
      }

      #help-search-clear {
        position: absolute;
        right: 12px;
        background: none;
        border: none;
        color: var(--text-tertiary, #888);
        cursor: pointer;
        font-size: 1.2rem;
        padding: 0;
        display: none;
      }

      #help-search-clear.visible {
        display: block;
      }

      .help-search-results {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--container-bg, white);
        border: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        z-index: 1001;
        max-height: 300px;
        overflow-y: auto;
        display: none;
      }

      .help-search-results.visible {
        display: block;
      }

      .help-search-result {
        padding: 12px 16px;
        border-bottom: 1px solid var(--border-color, rgba(102, 126, 234, 0.1));
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      .help-search-result:hover,
      .help-search-result.highlighted {
        background: var(--feature-bg, rgba(102, 126, 234, 0.1));
      }

      .help-search-result:last-child {
        border-bottom: none;
      }

      .help-search-result-title {
        font-weight: 600;
        color: var(--text-primary, #333);
        margin-bottom: 4px;
      }

      .help-search-result-description {
        font-size: 0.9rem;
        color: var(--text-secondary, #666);
        line-height: 1.4;
      }

      .help-categories {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .help-category-btn {
        padding: 8px 16px;
        border: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
        border-radius: 20px;
        background: var(--container-bg, white);
        color: var(--text-secondary, #666);
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.2s ease;
      }

      .help-category-btn:hover,
      .help-category-btn.active {
        background: var(--button-gradient-start, #667eea);
        color: white;
        border-color: var(--button-gradient-start, #667eea);
      }

      .help-content-area {
        display: grid;
        gap: 20px;
      }

      .help-section {
        background: var(--feature-bg, rgba(102, 126, 234, 0.05));
        border: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
        border-radius: 12px;
        padding: 20px;
        transition: transform 0.2s ease;
      }

      .help-section:hover {
        transform: translateY(-2px);
      }

      .help-section-title {
        margin: 0 0 16px 0;
        color: var(--text-primary, #333);
        font-size: 1.2rem;
        font-weight: 600;
      }

      .help-section-content {
        color: var(--text-secondary, #666);
        line-height: 1.6;
      }

      .help-shortcut-list {
        display: grid;
        gap: 8px;
      }

      .help-shortcut-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: var(--container-bg, white);
        border-radius: 6px;
        border: 1px solid var(--border-color, rgba(102, 126, 234, 0.1));
      }

      .help-shortcut-key {
        font-family: 'Courier New', monospace;
        background: var(--text-primary, #333);
        color: var(--container-bg, white);
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 600;
      }

      .help-shortcut-action {
        color: var(--text-secondary, #666);
        font-size: 0.9rem;
      }

      .help-feature-list {
        display: grid;
        gap: 16px;
      }

      .help-feature-item {
        padding: 16px;
        background: var(--container-bg, white);
        border-radius: 8px;
        border: 1px solid var(--border-color, rgba(102, 126, 234, 0.1));
      }

      .help-feature-title {
        font-weight: 600;
        color: var(--text-primary, #333);
        margin-bottom: 8px;
      }

      .help-feature-description {
        color: var(--text-secondary, #666);
        margin-bottom: 8px;
        line-height: 1.5;
      }

      .help-feature-usage {
        font-size: 0.9rem;
        color: var(--text-tertiary, #888);
        font-style: italic;
      }

      .help-modal-footer {
        padding: 20px 24px;
        border-top: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
      }

      .help-footer-links {
        display: flex;
        gap: 16px;
        align-items: center;
      }

      .help-footer-links a,
      .help-feedback-btn {
        color: var(--button-gradient-start, #667eea);
        text-decoration: none;
        font-size: 0.9rem;
        transition: color 0.2s ease;
        background: none;
        border: none;
        cursor: pointer;
      }

      .help-footer-links a:hover,
      .help-feedback-btn:hover {
        color: var(--button-gradient-end, #764ba2);
      }

      .help-footer-tip {
        font-size: 0.8rem;
        color: var(--text-tertiary, #888);
      }

      @media (max-width: 768px) {
        .help-modal-content {
          width: 98%;
          max-height: 95vh;
        }

        .help-modal-header,
        .help-modal-body,
        .help-modal-footer {
          padding: 16px;
        }

        .help-categories {
          gap: 6px;
        }

        .help-category-btn {
          padding: 6px 12px;
          font-size: 0.8rem;
        }

        .help-modal-footer {
          flex-direction: column;
          align-items: stretch;
          text-align: center;
        }

        .help-footer-links {
          justify-content: center;
        }
      }

      /* Dark theme support */
      [data-theme="dark"] .help-modal-content,
      [data-theme="dark"] .help-search-results,
      [data-theme="dark"] .help-shortcut-item,
      [data-theme="dark"] .help-feature-item {
        background: var(--container-bg, rgba(30, 30, 30, 0.95));
      }

      [data-theme="dark"] #help-search-input {
        background: var(--container-bg, rgba(40, 40, 40, 0.8));
        color: var(--text-primary, #fff);
      }

      [data-theme="dark"] .help-shortcut-key {
        background: var(--text-primary, #fff);
        color: var(--container-bg, #333);
      }

      /* High contrast support */
      @media (prefers-contrast: high) {
        .help-modal-content,
        .help-section,
        .help-feature-item {
          border-width: 2px;
        }
      }

      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        .help-trigger-btn,
        .help-section,
        .help-category-btn,
        .help-search-result {
          transition: none !important;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  setupEventListeners() {
    // Help trigger button
    const triggerBtn = document.getElementById('help-trigger-btn');
    if (triggerBtn) {
      triggerBtn.addEventListener('click', () => {
        this.showHelp();
      });
    }

    // Close help modal
    const closeBtn = document.querySelector('.help-modal-close');
    const overlay = document.querySelector('.help-modal-overlay');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.hideHelp();
      });
    }

    if (overlay) {
      overlay.addEventListener('click', () => {
        this.hideHelp();
      });
    }

    // Search functionality
    const searchInput = document.getElementById('help-search-input');
    const searchClear = document.getElementById('help-search-clear');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.handleSearch(e.target.value);
      });

      searchInput.addEventListener('keydown', (e) => {
        this.handleSearchKeyboard(e);
      });
    }

    if (searchClear) {
      searchClear.addEventListener('click', () => {
        this.clearSearch();
      });
    }

    // Category filtering
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('help-category-btn')) {
        this.filterByCategory(e.target.dataset.category);
        
        // Update active category
        document.querySelectorAll('.help-category-btn').forEach(btn => {
          btn.classList.toggle('active', btn === e.target);
        });
      }
    });

    // Search result selection
    document.addEventListener('click', (e) => {
      if (e.target.closest('.help-search-result')) {
        const resultElement = e.target.closest('.help-search-result');
        const topicId = resultElement.dataset.topic;
        this.showTopic(topicId);
        this.clearSearch();
      }
    });

    // Feedback button
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('help-feedback-btn')) {
        this.showFeedbackForm();
      }
    });

    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Ctrl+/ or Cmd+/ to toggle help
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        this.toggleHelp();
      }

      // Escape to close help
      if (e.key === 'Escape' && this.isHelpVisible()) {
        this.hideHelp();
      }

      // ? for context-sensitive help
      if (e.key === '?' && !this.isHelpVisible() && !this.isInputFocused()) {
        e.preventDefault();
        this.showContextualHelp();
      }
    });
  }

  buildSearchIndex() {
    this.searchIndex = [];
    
    this.helpData.forEach((section, key) => {
      // Add section to index
      this.searchIndex.push({
        id: key,
        title: section.title,
        content: section.title,
        category: section.category,
        type: 'section'
      });

      // Add individual items to index
      if (Array.isArray(section.content)) {
        section.content.forEach((item, index) => {
          if (item.title) {
            this.searchIndex.push({
              id: `${key}-${index}`,
              title: item.title,
              content: `${item.title} ${item.description || item.action || item.solution || ''}`,
              category: section.category,
              type: 'item',
              parent: key
            });
          }
        });
      }
    });
  }

  populateHelpContent(category = 'all') {
    const contentArea = document.getElementById('help-content-area');
    if (!contentArea) return;

    contentArea.innerHTML = '';

    this.helpData.forEach((section, key) => {
      if (category !== 'all' && section.category !== category) return;

      const sectionElement = document.createElement('div');
      sectionElement.className = 'help-section';
      sectionElement.dataset.section = key;

      let contentHTML = '';

      if (key === 'keyboard-shortcuts') {
        contentHTML = `
          <div class="help-shortcut-list">
            ${section.content.map(shortcut => `
              <div class="help-shortcut-item">
                <span class="help-shortcut-key">${shortcut.key}</span>
                <span class="help-shortcut-action">${shortcut.action}</span>
              </div>
            `).join('')}
          </div>
        `;
      } else {
        contentHTML = `
          <div class="help-feature-list">
            ${section.content.map(item => `
              <div class="help-feature-item">
                ${item.title ? `<div class="help-feature-title">${item.title}</div>` : ''}
                ${item.description ? `<div class="help-feature-description">${item.description}</div>` : ''}
                ${item.usage ? `<div class="help-feature-usage">Usage: ${item.usage}</div>` : ''}
                ${item.solution ? `<div class="help-feature-description">${item.solution}</div>` : ''}
              </div>
            `).join('')}
          </div>
        `;
      }

      sectionElement.innerHTML = `
        <h3 class="help-section-title">${section.title}</h3>
        <div class="help-section-content">
          ${contentHTML}
        </div>
      `;

      contentArea.appendChild(sectionElement);
    });
  }

  handleSearch(query) {
    const searchResults = document.getElementById('help-search-results');
    const searchClear = document.getElementById('help-search-clear');
    
    if (!query.trim()) {
      searchResults.classList.remove('visible');
      searchClear.classList.remove('visible');
      return;
    }

    searchClear.classList.add('visible');

    // Perform fuzzy search
    const results = this.searchIndex.filter(item => {
      return item.content.toLowerCase().includes(query.toLowerCase());
    }).slice(0, 8); // Limit results

    if (results.length > 0) {
      searchResults.innerHTML = results.map(result => `
        <div class="help-search-result" data-topic="${result.id}">
          <div class="help-search-result-title">${result.title}</div>
          <div class="help-search-result-description">${result.content.substring(0, 100)}...</div>
        </div>
      `).join('');
      searchResults.classList.add('visible');
    } else {
      searchResults.innerHTML = `
        <div class="help-search-result">
          <div class="help-search-result-title">No results found</div>
          <div class="help-search-result-description">Try different keywords or browse categories below</div>
        </div>
      `;
      searchResults.classList.add('visible');
    }
  }

  clearSearch() {
    const searchInput = document.getElementById('help-search-input');
    const searchResults = document.getElementById('help-search-results');
    const searchClear = document.getElementById('help-search-clear');

    if (searchInput) searchInput.value = '';
    if (searchResults) searchResults.classList.remove('visible');
    if (searchClear) searchClear.classList.remove('visible');
  }

  filterByCategory(category) {
    this.populateHelpContent(category);
  }

  showTopic(topicId) {
    const [sectionKey, itemIndex] = topicId.split('-');
    const section = document.querySelector(`[data-section="${sectionKey}"]`);
    
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      section.style.background = 'var(--button-gradient-start, #667eea)';
      section.style.color = 'white';
      
      setTimeout(() => {
        section.style.background = '';
        section.style.color = '';
      }, 2000);
    }
  }

  showHelp() {
    const modal = document.getElementById('comprehensive-help-modal');
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      
      // Focus the search input
      setTimeout(() => {
        const searchInput = document.getElementById('help-search-input');
        if (searchInput) searchInput.focus();
      }, 100);
    }
  }

  hideHelp() {
    const modal = document.getElementById('comprehensive-help-modal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
      this.clearSearch();
    }
  }

  toggleHelp() {
    if (this.isHelpVisible()) {
      this.hideHelp();
    } else {
      this.showHelp();
    }
  }

  isHelpVisible() {
    const modal = document.getElementById('comprehensive-help-modal');
    return modal && modal.style.display !== 'none';
  }

  showContextualHelp() {
    // Show help relevant to current context
    this.showHelp();
    this.filterByCategory('basics');
  }

  showFeedbackForm() {
    // Create simple feedback form
    const feedbackForm = `
      <div style="margin-top: 20px; padding: 20px; border: 1px solid var(--border-color); border-radius: 8px;">
        <h4>Send Feedback</h4>
        <textarea placeholder="Tell us how we can improve the help system..." 
                  style="width: 100%; height: 100px; margin: 10px 0; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;"></textarea>
        <button onclick="this.closest('div').innerHTML='<p>Thanks for your feedback!</p>'" 
                style="background: var(--button-gradient-start); color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
          Send Feedback
        </button>
      </div>
    `;
    
    const contentArea = document.getElementById('help-content-area');
    if (contentArea) {
      contentArea.innerHTML = feedbackForm;
    }
  }

  handleSearchKeyboard(e) {
    const results = document.querySelectorAll('.help-search-result');
    const highlighted = document.querySelector('.help-search-result.highlighted');
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (highlighted) {
          const next = highlighted.nextElementSibling;
          highlighted.classList.remove('highlighted');
          if (next) {
            next.classList.add('highlighted');
          } else {
            results[0]?.classList.add('highlighted');
          }
        } else {
          results[0]?.classList.add('highlighted');
        }
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        if (highlighted) {
          const prev = highlighted.previousElementSibling;
          highlighted.classList.remove('highlighted');
          if (prev) {
            prev.classList.add('highlighted');
          } else {
            results[results.length - 1]?.classList.add('highlighted');
          }
        } else {
          results[results.length - 1]?.classList.add('highlighted');
        }
        break;
      
      case 'Enter':
        e.preventDefault();
        if (highlighted) {
          highlighted.click();
        }
        break;
      
      case 'Escape':
        this.clearSearch();
        break;
    }
  }

  isInputFocused() {
    const activeElement = document.activeElement;
    return activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.isContentEditable
    );
  }

  loadUserPreferences() {
    try {
      const stored = localStorage.getItem('help-system-preferences');
      return stored ? JSON.parse(stored) : {
        showOnFirstVisit: true,
        preferredCategory: 'all'
      };
    } catch (error) {
      return {
        showOnFirstVisit: true,
        preferredCategory: 'all'
      };
    }
  }

  // Public API methods
  openHelp(category = null) {
    this.showHelp();
    if (category) {
      this.filterByCategory(category);
    }
  }

  searchHelp(query) {
    this.showHelp();
    const searchInput = document.getElementById('help-search-input');
    if (searchInput) {
      searchInput.value = query;
      this.handleSearch(query);
    }
  }

  showShortcuts() {
    this.showHelp();
    this.filterByCategory('navigation');
  }

  showAccessibilityHelp() {
    this.showHelp();
    this.filterByCategory('accessibility');
  }
}

// Initialize the Comprehensive Help System when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.comprehensiveHelpSystem = new ComprehensiveHelpSystem();
  });
} else {
  window.comprehensiveHelpSystem = new ComprehensiveHelpSystem();
}

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ComprehensiveHelpSystem;
}