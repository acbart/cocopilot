/**
 * Comprehensive Help System for CocoPilot
 * Provides keyboard shortcuts, contextual help, and feature discovery
 */

class HelpSystem {
  constructor() {
    this.isVisible = false;
    this.currentSection = 'shortcuts';
    this.keyboardShortcuts = {
      'Ctrl+K': 'Open search',
      'Ctrl+/': 'Show/hide help',
      'T': 'Toggle theme',
      'H': 'Go to homepage',
      'G': 'Go to GitHub',
      'R': 'Refresh data',
      'Esc': 'Close modals',
      '?': 'Show help',
      'Ctrl+Shift+P': 'Open command palette',
      'Ctrl+D': 'Toggle analytics dashboard',
      'Ctrl+M': 'Toggle mobile view',
      'Tab': 'Navigate between elements',
      'Enter': 'Activate focused element',
      'Space': 'Scroll page down',
      'Shift+Space': 'Scroll page up'
    };
    this.features = [
      {
        id: 'search',
        title: '🔍 Advanced Search',
        description: 'Instantly find features, documentation, and shortcuts with smart search.',
        tips: ['Use Ctrl+K to open search anywhere', 'Search supports fuzzy matching', 'Navigate results with arrow keys']
      },
      {
        id: 'analytics',
        title: '📊 AI Analytics Dashboard',
        description: 'Interactive insights into repository evolution and AI improvements.',
        tips: ['Click "Show Analytics" to expand', 'Hover over charts for details', 'Export data for further analysis']
      },
      {
        id: 'themes',
        title: '🌙 Dynamic Themes',
        description: 'Switch between light and dark themes with smooth transitions.',
        tips: ['Press T for quick toggle', 'Theme preference is saved', 'Respects system preferences']
      },
      {
        id: 'mobile',
        title: '📱 Mobile Features',
        description: 'Optimized touch interactions and mobile-specific enhancements.',
        tips: ['Pull down to refresh', 'Double-tap to toggle theme', 'Swipe for navigation']
      },
      {
        id: 'pwa',
        title: '🚀 Progressive Web App',
        description: 'Install CocoPilot as a native app with offline capabilities.',
        tips: ['Install from browser menu', 'Works offline', 'Automatic updates']
      },
      {
        id: 'ai',
        title: '🤖 AI Recommendations',
        description: 'Personalized suggestions based on your usage patterns.',
        tips: ['Recommendations adapt to behavior', 'Dismiss with X', 'Rate suggestions for better AI']
      }
    ];
    this.init();
  }

  init() {
    this.createHelpInterface();
    this.bindKeyboardShortcuts();
    this.addHelpButton();
    this.createTooltipSystem();
  }

  createHelpInterface() {
    const helpModal = document.createElement('div');
    helpModal.id = 'help-modal';
    helpModal.className = 'help-modal';
    helpModal.setAttribute('role', 'dialog');
    helpModal.setAttribute('aria-labelledby', 'help-title');
    helpModal.setAttribute('aria-hidden', 'true');

    helpModal.innerHTML = `
      <div class="help-overlay"></div>
      <div class="help-content">
        <div class="help-header">
          <h2 id="help-title">CocoPilot Help Center</h2>
          <button class="help-close" aria-label="Close help">×</button>
        </div>
        
        <div class="help-navigation">
          <button class="help-tab active" data-section="shortcuts">
            ⌨️ Keyboard Shortcuts
          </button>
          <button class="help-tab" data-section="features">
            🚀 Features Guide
          </button>
          <button class="help-tab" data-section="tips">
            💡 Tips & Tricks
          </button>
        </div>

        <div class="help-body">
          <div class="help-section" id="shortcuts-section">
            <h3>Keyboard Shortcuts</h3>
            <div class="shortcuts-grid">
              ${this.renderShortcuts()}
            </div>
          </div>

          <div class="help-section" id="features-section" style="display: none;">
            <h3>Feature Guide</h3>
            <div class="features-list">
              ${this.renderFeatures()}
            </div>
          </div>

          <div class="help-section" id="tips-section" style="display: none;">
            <h3>Tips & Tricks</h3>
            <div class="tips-content">
              ${this.renderTips()}
            </div>
          </div>
        </div>

        <div class="help-footer">
          <p>Need more help? <a href="https://github.com/acbart/cocopilot/issues" target="_blank">Open an issue</a></p>
        </div>
      </div>
    `;

    document.body.appendChild(helpModal);
    this.helpModal = helpModal;
    this.bindHelpEvents();
    this.addHelpStyles();
  }

  renderShortcuts() {
    return Object.entries(this.keyboardShortcuts)
      .map(([key, description]) => `
        <div class="shortcut-item">
          <span class="shortcut-key">${key}</span>
          <span class="shortcut-description">${description}</span>
        </div>
      `).join('');
  }

  renderFeatures() {
    return this.features.map(feature => `
      <div class="feature-item">
        <div class="feature-header">
          <h4>${feature.title}</h4>
        </div>
        <p class="feature-description">${feature.description}</p>
        <ul class="feature-tips">
          ${feature.tips.map(tip => `<li>${tip}</li>`).join('')}
        </ul>
      </div>
    `).join('');
  }

  renderTips() {
    return `
      <div class="tips-grid">
        <div class="tip-card">
          <h4>🎯 Quick Navigation</h4>
          <p>Use Tab to navigate between interactive elements. Press Enter to activate buttons and links.</p>
        </div>
        <div class="tip-card">
          <h4>⚡ Performance</h4>
          <p>The app automatically optimizes for your device. Enable reduced motion in your system settings for faster animations.</p>
        </div>
        <div class="tip-card">
          <h4>🔄 Data Refresh</h4>
          <p>Repository data refreshes automatically. Press R to manually refresh if needed.</p>
        </div>
        <div class="tip-card">
          <h4>📱 Mobile Gestures</h4>
          <p>On mobile: pull down to refresh, double-tap to toggle theme, long-press for context menus.</p>
        </div>
        <div class="tip-card">
          <h4>🎨 Customization</h4>
          <p>Your theme preference and settings are saved locally and sync across devices.</p>
        </div>
        <div class="tip-card">
          <h4>🚀 Installation</h4>
          <p>Install CocoPilot as a PWA from your browser's menu for a native app experience.</p>
        </div>
      </div>
    `;
  }

  addHelpButton() {
    // Add help button to the main navigation
    const mainNav = document.querySelector('main');
    if (mainNav) {
      const helpButton = document.createElement('button');
      helpButton.className = 'help-button';
      helpButton.setAttribute('aria-label', 'Open help center');
      helpButton.setAttribute('title', 'Help (Ctrl+/ or ?)');
      helpButton.innerHTML = '❓';
      helpButton.onclick = () => this.toggleHelp();

      // Position it near other navigation buttons
      const themeToggle = document.querySelector('.theme-toggle');
      if (themeToggle && themeToggle.parentNode) {
        themeToggle.parentNode.insertBefore(helpButton, themeToggle.nextSibling);
      } else {
        mainNav.appendChild(helpButton);
      }
    }
  }

  bindKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Don't trigger shortcuts when typing in input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      const key = this.getKeyString(e);

      switch (key) {
      case 'Ctrl+/':
      case '?':
        e.preventDefault();
        this.toggleHelp();
        break;
      case 'Escape':
        if (this.isVisible) {
          e.preventDefault();
          this.hideHelp();
        }
        break;
      case 'Ctrl+K':
        e.preventDefault();
        this.openSearch();
        break;
      case 'T':
        e.preventDefault();
        this.toggleTheme();
        break;
      case 'H':
        e.preventDefault();
        window.location.href = '#';
        break;
      case 'G':
        e.preventDefault();
        window.open('https://github.com/acbart/cocopilot', '_blank');
        break;
      case 'R':
        e.preventDefault();
        this.refreshData();
        break;
      case 'Ctrl+D':
        e.preventDefault();
        this.toggleAnalytics();
        break;
      }
    });
  }

  getKeyString(e) {
    const parts = [];
    if (e.ctrlKey) {
      parts.push('Ctrl');
    }
    if (e.shiftKey) {
      parts.push('Shift');
    }
    if (e.altKey) {
      parts.push('Alt');
    }
    if (e.metaKey) {
      parts.push('Cmd');
    }

    const key = e.key === ' ' ? 'Space' : e.key;
    if (key !== 'Control' && key !== 'Shift' && key !== 'Alt' && key !== 'Meta') {
      parts.push(key);
    }

    return parts.join('+');
  }

  bindHelpEvents() {
    // Close button
    const closeBtn = this.helpModal.querySelector('.help-close');
    closeBtn.addEventListener('click', () => this.hideHelp());

    // Overlay click to close
    const overlay = this.helpModal.querySelector('.help-overlay');
    overlay.addEventListener('click', () => this.hideHelp());

    // Tab navigation
    const tabs = this.helpModal.querySelectorAll('.help-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const section = tab.dataset.section;
        this.switchSection(section);
      });
    });

    // Keyboard navigation within modal
    this.helpModal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideHelp();
      }
    });
  }

  switchSection(section) {
    // Update active tab
    const tabs = this.helpModal.querySelectorAll('.help-tab');
    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.section === section);
    });

    // Show corresponding section
    const sections = this.helpModal.querySelectorAll('.help-section');
    sections.forEach(sec => {
      sec.style.display = sec.id === `${section}-section` ? 'block' : 'none';
    });

    this.currentSection = section;
  }

  toggleHelp() {
    if (this.isVisible) {
      this.hideHelp();
    } else {
      this.showHelp();
    }
  }

  showHelp() {
    this.helpModal.style.display = 'flex';
    this.helpModal.setAttribute('aria-hidden', 'false');
    this.isVisible = true;

    // Focus management
    const firstFocusable = this.helpModal.querySelector('.help-close');
    if (firstFocusable) {
      firstFocusable.focus();
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  hideHelp() {
    this.helpModal.style.display = 'none';
    this.helpModal.setAttribute('aria-hidden', 'true');
    this.isVisible = false;

    // Restore body scroll
    document.body.style.overflow = '';

    // Return focus to help button
    const helpButton = document.querySelector('.help-button');
    if (helpButton) {
      helpButton.focus();
    }
  }

  // Integration with existing features
  openSearch() {
    const searchBtn = document.querySelector('[data-i18n="search.open"]');
    if (searchBtn) {
      searchBtn.click();
    }
  }

  toggleTheme() {
    const themeBtn = document.querySelector('.theme-toggle');
    if (themeBtn) {
      themeBtn.click();
    }
  }

  refreshData() {
    if (typeof window.fetchRepoStats === 'function') {
      window.fetchRepoStats();
    }
    // Trigger a visual indication of refresh
    this.showRefreshIndicator();
  }

  toggleAnalytics() {
    const analyticsBtn = document.getElementById('toggle-dashboard');
    if (analyticsBtn) {
      analyticsBtn.click();
    }
  }

  showRefreshIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'refresh-indicator';
    indicator.textContent = '🔄 Refreshing...';
    document.body.appendChild(indicator);

    setTimeout(() => {
      indicator.remove();
    }, 2000);
  }

  createTooltipSystem() {
    // Add enhanced tooltips to key elements
    const tooltipTargets = [
      { selector: '.theme-toggle', text: 'Toggle theme (T)' },
      { selector: '.language-toggle', text: 'Change language' },
      { selector: '[data-i18n="search.open"]', text: 'Search (Ctrl+K)' },
      { selector: '.help-button', text: 'Help center (Ctrl+/ or ?)' }
    ];

    tooltipTargets.forEach(({ selector, text }) => {
      const element = document.querySelector(selector);
      if (element) {
        this.addTooltip(element, text);
      }
    });
  }

  addTooltip(element, text) {
    element.setAttribute('title', text);
    element.setAttribute('data-tooltip', text);
  }

  addHelpStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
      .help-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: none;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .help-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
      }

      .help-content {
        position: relative;
        background: var(--container-bg, white);
        border-radius: 16px;
        max-width: 90vw;
        max-height: 90vh;
        width: 800px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        overflow: hidden;
        border: 1px solid var(--border-color, #e0e0e0);
      }

      .help-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 24px;
        border-bottom: 1px solid var(--border-color, #e0e0e0);
        background: var(--feature-bg, #f8f9fa);
      }

      .help-header h2 {
        margin: 0;
        color: var(--text-primary, #333);
        font-size: 1.5rem;
      }

      .help-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-secondary, #666);
        padding: 8px;
        border-radius: 8px;
        transition: background-color 0.2s;
      }

      .help-close:hover {
        background: var(--border-color, #e0e0e0);
      }

      .help-navigation {
        display: flex;
        border-bottom: 1px solid var(--border-color, #e0e0e0);
        background: var(--container-bg, white);
      }

      .help-tab {
        flex: 1;
        padding: 16px;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-secondary, #666);
        font-size: 0.9rem;
        font-weight: 500;
        transition: all 0.2s;
        position: relative;
      }

      .help-tab.active {
        color: var(--button-gradient-start, #667eea);
        background: var(--feature-bg, #f8f9fa);
      }

      .help-tab.active::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--button-gradient-start, #667eea);
      }

      .help-body {
        padding: 24px;
        max-height: 60vh;
        overflow-y: auto;
      }

      .help-section h3 {
        margin: 0 0 20px 0;
        color: var(--text-primary, #333);
        font-size: 1.2rem;
      }

      .shortcuts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 12px;
      }

      .shortcut-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: var(--feature-bg, #f8f9fa);
        border-radius: 8px;
        border: 1px solid var(--border-color, #e0e0e0);
      }

      .shortcut-key {
        font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
        background: var(--container-bg, white);
        padding: 4px 8px;
        border-radius: 4px;
        border: 1px solid var(--border-color, #e0e0e0);
        font-size: 0.85rem;
        font-weight: bold;
        color: var(--text-primary, #333);
      }

      .shortcut-description {
        color: var(--text-secondary, #666);
        font-size: 0.9rem;
      }

      .features-list {
        display: grid;
        gap: 20px;
      }

      .feature-item {
        padding: 20px;
        background: var(--feature-bg, #f8f9fa);
        border-radius: 12px;
        border: 1px solid var(--border-color, #e0e0e0);
      }

      .feature-header h4 {
        margin: 0 0 8px 0;
        color: var(--text-primary, #333);
        font-size: 1.1rem;
      }

      .feature-description {
        margin: 0 0 12px 0;
        color: var(--text-secondary, #666);
        line-height: 1.5;
      }

      .feature-tips {
        margin: 0;
        padding-left: 20px;
      }

      .feature-tips li {
        color: var(--text-tertiary, #888);
        font-size: 0.9rem;
        margin-bottom: 4px;
      }

      .tips-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 16px;
      }

      .tip-card {
        padding: 16px;
        background: var(--feature-bg, #f8f9fa);
        border-radius: 12px;
        border: 1px solid var(--border-color, #e0e0e0);
      }

      .tip-card h4 {
        margin: 0 0 8px 0;
        color: var(--text-primary, #333);
        font-size: 1rem;
      }

      .tip-card p {
        margin: 0;
        color: var(--text-secondary, #666);
        font-size: 0.9rem;
        line-height: 1.4;
      }

      .help-footer {
        padding: 16px 24px;
        border-top: 1px solid var(--border-color, #e0e0e0);
        background: var(--feature-bg, #f8f9fa);
        text-align: center;
      }

      .help-footer p {
        margin: 0;
        color: var(--text-secondary, #666);
        font-size: 0.9rem;
      }

      .help-footer a {
        color: var(--button-gradient-start, #667eea);
        text-decoration: none;
      }

      .help-footer a:hover {
        text-decoration: underline;
      }

      .help-button {
        position: fixed;
        top: 20px;
        right: 120px;
        background: var(--button-gradient-start, #667eea);
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        z-index: 1000;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }

      .help-button:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }

      .refresh-indicator {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--button-gradient-start, #667eea);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 0.9rem;
        z-index: 1000;
        animation: slideDown 0.3s ease;
      }

      @keyframes slideDown {
        from {
          transform: translateX(-50%) translateY(-100%);
          opacity: 0;
        }
        to {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
      }

      @media (max-width: 768px) {
        .help-content {
          width: 95vw;
          max-height: 85vh;
        }

        .help-navigation {
          flex-direction: column;
        }

        .help-tab {
          border-bottom: 1px solid var(--border-color, #e0e0e0);
        }

        .shortcuts-grid {
          grid-template-columns: 1fr;
        }

        .tips-grid {
          grid-template-columns: 1fr;
        }

        .help-button {
          right: 20px;
          top: 80px;
        }
      }

      /* Dark theme support */
      [data-theme="dark"] .help-content {
        background: #1a1a1a;
        border-color: #333;
      }

      [data-theme="dark"] .help-header {
        background: #2a2a2a;
        border-color: #333;
      }

      [data-theme="dark"] .help-footer {
        background: #2a2a2a;
        border-color: #333;
      }

      [data-theme="dark"] .shortcut-item,
      [data-theme="dark"] .feature-item,
      [data-theme="dark"] .tip-card {
        background: #2a2a2a;
        border-color: #333;
      }

      [data-theme="dark"] .shortcut-key {
        background: #1a1a1a;
        border-color: #333;
      }
    `;

    document.head.appendChild(styles);
  }
}

// Initialize help system when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new HelpSystem();
  });
} else {
  new HelpSystem();
}

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HelpSystem;
}