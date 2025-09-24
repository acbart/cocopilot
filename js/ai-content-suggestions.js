/**
 * AI-Powered Content Suggestions System
 * Provides intelligent content recommendations based on user behavior and context
 */

class AIContentSuggestions {
  constructor() {
    this.suggestions = [];
    this.userPreferences = this.loadUserPreferences();
    this.contextAnalyzer = new ContextAnalyzer();
    this.suggestionProvider = new SuggestionProvider();
    this.isActive = false;
    this.suggestionContainer = null;
    this.currentPage = this.detectCurrentPage();
  }

  async initialize() {
    try {
      console.log('🤖 Initializing AI Content Suggestions System...');
      
      // Create UI components
      this.createSuggestionInterface();
      this.attachEventListeners();
      
      // Analyze current context
      await this.analyzePageContext();
      
      // Generate initial suggestions
      await this.generateSuggestions();
      
      // Start adaptive learning
      this.startBehaviorTracking();
      
      this.isActive = true;
      console.log('✅ AI Content Suggestions System initialized');
      
      // Show welcome suggestion for new users
      if (this.isFirstVisit()) {
        this.showWelcomeSuggestion();
      }
      
    } catch (error) {
      console.error('❌ Error initializing AI Content Suggestions:', error);
    }
  }

  createSuggestionInterface() {
    // Create floating suggestion panel
    this.suggestionContainer = document.createElement('div');
    this.suggestionContainer.className = 'ai-suggestions-panel';
    this.suggestionContainer.innerHTML = `
      <div class="suggestion-header">
        <span class="suggestion-icon">🤖</span>
        <h3>AI Suggestions</h3>
        <button class="close-suggestions" aria-label="Close suggestions">×</button>
      </div>
      <div class="suggestions-content">
        <div class="loading-suggestions">
          <div class="suggestion-spinner"></div>
          <p>Analyzing your interests...</p>
        </div>
      </div>
      <div class="suggestion-controls">
        <button class="refresh-suggestions" data-i18n="suggestions.refresh">
          🔄 Refresh Suggestions
        </button>
        <button class="suggestions-settings" data-i18n="suggestions.settings">
          ⚙️ Settings
        </button>
      </div>
    `;

    // Add trigger button
    this.createTriggerButton();
    
    // Apply styles
    this.addSuggestionStyles();
    
    document.body.appendChild(this.suggestionContainer);
  }

  createTriggerButton() {
    const trigger = document.createElement('button');
    trigger.className = 'ai-suggestions-trigger';
    trigger.innerHTML = '🧠 AI Tips';
    trigger.setAttribute('aria-label', 'Show AI content suggestions');
    trigger.title = 'Get personalized AI suggestions';
    
    trigger.addEventListener('click', () => {
      this.toggleSuggestionPanel();
    });
    
    document.body.appendChild(trigger);
  }

  addSuggestionStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
      .ai-suggestions-trigger {
        position: fixed;
        bottom: 100px;
        right: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        padding: 12px 18px;
        border-radius: 25px;
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        z-index: 1000;
        transition: all 0.3s ease;
        animation: gentlePulse 3s infinite;
      }

      .ai-suggestions-trigger:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }

      @keyframes gentlePulse {
        0%, 100% { box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); }
        50% { box-shadow: 0 4px 15px rgba(102, 126, 234, 0.5), 0 0 0 4px rgba(102, 126, 234, 0.1); }
      }

      .ai-suggestions-panel {
        position: fixed;
        top: 50%;
        right: 20px;
        transform: translateY(-50%) translateX(100%);
        width: 360px;
        max-height: 80vh;
        background: var(--container-bg, rgba(255, 255, 255, 0.95));
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(10px);
        border: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
        z-index: 1001;
        transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        overflow: hidden;
      }

      .ai-suggestions-panel.show {
        transform: translateY(-50%) translateX(0);
      }

      .suggestion-header {
        display: flex;
        align-items: center;
        padding: 16px 20px;
        background: linear-gradient(135deg, var(--button-gradient-start, #667eea), var(--button-gradient-end, #764ba2));
        color: white;
        border-radius: 16px 16px 0 0;
      }

      .suggestion-icon {
        font-size: 1.2rem;
        margin-right: 8px;
      }

      .suggestion-header h3 {
        flex: 1;
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
      }

      .close-suggestions {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s ease;
      }

      .close-suggestions:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }

      .suggestions-content {
        padding: 20px;
        max-height: 400px;
        overflow-y: auto;
      }

      .loading-suggestions {
        text-align: center;
        padding: 20px;
        color: var(--text-secondary, #666);
      }

      .suggestion-spinner {
        width: 24px;
        height: 24px;
        border: 2px solid var(--border-color, #e0e0e0);
        border-top: 2px solid var(--button-gradient-start, #667eea);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 10px;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .suggestion-item {
        background: var(--feature-bg, rgba(102, 126, 234, 0.1));
        border: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .suggestion-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        border-color: var(--button-gradient-start, #667eea);
      }

      .suggestion-type {
        font-size: 0.8rem;
        color: var(--button-gradient-start, #667eea);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 6px;
      }

      .suggestion-title {
        font-weight: 600;
        color: var(--text-primary, #333);
        margin-bottom: 8px;
        font-size: 0.95rem;
      }

      .suggestion-description {
        color: var(--text-secondary, #666);
        font-size: 0.85rem;
        line-height: 1.4;
        margin-bottom: 10px;
      }

      .suggestion-action {
        background: linear-gradient(135deg, var(--button-gradient-start, #667eea), var(--button-gradient-end, #764ba2));
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 0.8rem;
        cursor: pointer;
        transition: opacity 0.2s ease;
      }

      .suggestion-action:hover {
        opacity: 0.9;
      }

      .suggestion-controls {
        display: flex;
        gap: 10px;
        padding: 16px 20px;
        border-top: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
        background: var(--feature-bg, rgba(102, 126, 234, 0.05));
      }

      .suggestion-controls button {
        flex: 1;
        background: transparent;
        border: 1px solid var(--border-color, rgba(102, 126, 234, 0.3));
        color: var(--text-primary, #333);
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 0.8rem;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .suggestion-controls button:hover {
        background: var(--button-gradient-start, #667eea);
        color: white;
        border-color: transparent;
      }

      /* Dark mode support */
      [data-theme="dark"] .ai-suggestions-panel {
        background: rgba(30, 30, 30, 0.95);
      }

      [data-theme="dark"] .suggestion-item {
        background: rgba(102, 126, 234, 0.15);
        color: var(--text-primary, #e0e0e0);
      }

      /* Mobile responsiveness */
      @media (max-width: 480px) {
        .ai-suggestions-panel {
          right: 10px;
          left: 10px;
          width: auto;
          max-width: none;
        }

        .ai-suggestions-trigger {
          bottom: 80px;
          right: 15px;
          font-size: 0.8rem;
          padding: 10px 14px;
        }
      }

      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        .ai-suggestions-trigger {
          animation: none !important;
        }
        
        .suggestion-spinner {
          animation: none !important;
        }
        
        .ai-suggestions-panel {
          transition: none !important;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  async analyzePageContext() {
    const context = {
      page: this.currentPage,
      scrollPosition: window.scrollY,
      timeOnPage: Date.now() - this.pageStartTime,
      elementsInView: this.getVisibleElements(),
      userAgent: navigator.userAgent,
      screenSize: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    this.currentContext = context;
    return context;
  }

  async generateSuggestions() {
    const suggestions = [];
    
    // Page-specific suggestions
    const pageSuggestions = this.getPageSpecificSuggestions();
    suggestions.push(...pageSuggestions);
    
    // Behavioral suggestions
    const behaviorSuggestions = this.getBehavioralSuggestions();
    suggestions.push(...behaviorSuggestions);
    
    // Learning suggestions
    const learningSuggestions = this.getLearningSuggestions();
    suggestions.push(...learningSuggestions);
    
    // Performance suggestions
    const performanceSuggestions = this.getPerformanceSuggestions();
    suggestions.push(...performanceSuggestions);

    this.suggestions = suggestions.slice(0, 6); // Limit to 6 suggestions
    this.displaySuggestions();
  }

  getPageSpecificSuggestions() {
    const suggestions = [];
    
    switch (this.currentPage) {
      case 'home':
        suggestions.push({
          type: 'explore',
          title: 'Discover AI Features',
          description: 'Explore our comprehensive AI-powered features including code playground and educational modules.',
          action: 'View Features',
          link: 'features.html',
          priority: 9
        });
        
        suggestions.push({
          type: 'learn',
          title: 'Check Project Timeline',
          description: 'See how this repository has evolved through daily AI improvements.',
          action: 'View Timeline',
          link: 'timeline.html',
          priority: 8
        });
        break;
        
      case 'features':
        suggestions.push({
          type: 'try',
          title: 'Try Live Demo',
          description: 'Experience interactive features and see AI capabilities in action.',
          action: 'Start Demo',
          onClick: () => this.startInteractiveDemo(),
          priority: 10
        });
        break;
        
      case 'docs':
        suggestions.push({
          type: 'code',
          title: 'Explore Code Examples',
          description: 'See practical implementation examples and best practices.',
          action: 'View Examples',
          onClick: () => this.showCodeExamples(),
          priority: 9
        });
        break;
    }
    
    return suggestions;
  }

  getBehavioralSuggestions() {
    const suggestions = [];
    const preferences = this.userPreferences;
    
    if (preferences.darkMode) {
      suggestions.push({
        type: 'tip',
        title: 'Dark Mode Shortcuts',
        description: 'Press Ctrl+Shift+D to quickly toggle dark mode, or use the theme picker.',
        action: 'Try It',
        onClick: () => this.demonstrateShortcut('darkMode'),
        priority: 6
      });
    }
    
    if (preferences.visitCount > 3) {
      suggestions.push({
        type: 'advanced',
        title: 'Advanced Features',
        description: 'You seem familiar with the basics. Ready to explore advanced AI capabilities?',
        action: 'Show Advanced',
        onClick: () => this.showAdvancedFeatures(),
        priority: 8
      });
    }
    
    return suggestions;
  }

  getLearningSuggestions() {
    return [
      {
        type: 'learn',
        title: 'AI Development Guide',
        description: 'Learn how AI-driven development works and contribute to self-improving code.',
        action: 'Read Guide',
        link: 'docs.html#ai-development',
        priority: 7
      },
      {
        type: 'interactive',
        title: 'Take Interactive Tour',
        description: 'Get a guided walkthrough of all features with hands-on examples.',
        action: 'Start Tour',
        onClick: () => this.startGuidedTour(),
        priority: 8
      }
    ];
  }

  getPerformanceSuggestions() {
    const suggestions = [];
    
    if (this.isSlowConnection()) {
      suggestions.push({
        type: 'performance',
        title: 'Optimize for Your Connection',
        description: 'Enable lightweight mode for faster loading on slower connections.',
        action: 'Enable',
        onClick: () => this.enableLightweightMode(),
        priority: 9
      });
    }
    
    if (this.isMobileDevice()) {
      suggestions.push({
        type: 'mobile',
        title: 'Mobile Experience',
        description: 'Get the best mobile experience with touch-optimized features.',
        action: 'Optimize',
        onClick: () => this.optimizeForMobile(),
        priority: 7
      });
    }
    
    return suggestions;
  }

  displaySuggestions() {
    const content = this.suggestionContainer.querySelector('.suggestions-content');
    
    if (this.suggestions.length === 0) {
      content.innerHTML = `
        <div class="no-suggestions">
          <p>🎯 You're all caught up! Check back later for new AI suggestions.</p>
        </div>
      `;
      return;
    }
    
    // Sort by priority
    this.suggestions.sort((a, b) => b.priority - a.priority);
    
    const suggestionsHTML = this.suggestions.map(suggestion => `
      <div class="suggestion-item" data-type="${suggestion.type}">
        <div class="suggestion-type">${suggestion.type}</div>
        <div class="suggestion-title">${suggestion.title}</div>
        <div class="suggestion-description">${suggestion.description}</div>
        <button class="suggestion-action" 
                ${suggestion.link ? `onclick="window.location.href='${suggestion.link}'"` : ''}
                ${suggestion.onClick ? `onclick="window.aiSuggestions.${suggestion.onClick.name}()"` : ''}>
          ${suggestion.action}
        </button>
      </div>
    `).join('');
    
    content.innerHTML = suggestionsHTML;
    
    // Add click tracking
    content.querySelectorAll('.suggestion-item').forEach((item, index) => {
      item.addEventListener('click', () => {
        this.trackSuggestionClick(this.suggestions[index]);
      });
    });
  }

  toggleSuggestionPanel() {
    if (this.suggestionContainer.classList.contains('show')) {
      this.hideSuggestionPanel();
    } else {
      this.showSuggestionPanel();
    }
  }

  showSuggestionPanel() {
    this.suggestionContainer.classList.add('show');
    this.generateSuggestions(); // Refresh suggestions when showing
  }

  hideSuggestionPanel() {
    this.suggestionContainer.classList.remove('show');
  }

  attachEventListeners() {
    // Close button
    const closeBtn = this.suggestionContainer.querySelector('.close-suggestions');
    closeBtn.addEventListener('click', () => this.hideSuggestionPanel());
    
    // Refresh button
    const refreshBtn = this.suggestionContainer.querySelector('.refresh-suggestions');
    refreshBtn.addEventListener('click', () => this.generateSuggestions());
    
    // Settings button
    const settingsBtn = this.suggestionContainer.querySelector('.suggestions-settings');
    settingsBtn.addEventListener('click', () => this.showSettings());
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.suggestionContainer.classList.contains('show')) {
        this.hideSuggestionPanel();
      }
    });
    
    // Click outside to close
    document.addEventListener('click', (e) => {
      if (!this.suggestionContainer.contains(e.target) && 
          !e.target.classList.contains('ai-suggestions-trigger') &&
          this.suggestionContainer.classList.contains('show')) {
        this.hideSuggestionPanel();
      }
    });
  }

  startBehaviorTracking() {
    // Track page interactions
    document.addEventListener('scroll', () => {
      this.trackScrollBehavior();
    });
    
    document.addEventListener('click', (e) => {
      this.trackClickBehavior(e);
    });
    
    // Track time on sections
    this.observeElementVisibility();
  }

  // Utility methods
  detectCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('features')) return 'features';
    if (path.includes('docs')) return 'docs';
    if (path.includes('timeline')) return 'timeline';
    if (path.includes('analytics')) return 'analytics';
    if (path.includes('community')) return 'community';
    return 'home';
  }

  loadUserPreferences() {
    const prefs = localStorage.getItem('aiSuggestionsPrefs');
    const defaults = {
      visitCount: 0,
      darkMode: document.documentElement.dataset.theme === 'dark',
      lastVisit: null,
      interests: [],
      dismissedSuggestions: []
    };
    
    if (prefs) {
      const parsed = JSON.parse(prefs);
      parsed.visitCount = (parsed.visitCount || 0) + 1;
      this.saveUserPreferences(parsed);
      return { ...defaults, ...parsed };
    }
    
    defaults.visitCount = 1;
    this.saveUserPreferences(defaults);
    return defaults;
  }

  saveUserPreferences(prefs) {
    localStorage.setItem('aiSuggestionsPrefs', JSON.stringify(prefs));
  }

  isFirstVisit() {
    return this.userPreferences.visitCount === 1;
  }

  isSlowConnection() {
    return navigator.connection && navigator.connection.effectiveType === 'slow-2g';
  }

  isMobileDevice() {
    return window.innerWidth < 768;
  }

  getVisibleElements() {
    const elements = document.querySelectorAll('h1, h2, h3, .feature, .section');
    const visible = [];
    
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        visible.push(el.tagName.toLowerCase() + (el.className ? '.' + el.className : ''));
      }
    });
    
    return visible;
  }

  trackSuggestionClick(suggestion) {
    console.log('🎯 Suggestion clicked:', suggestion);
    // Track in analytics if available
    if (window.gtag) {
      gtag('event', 'suggestion_click', {
        suggestion_type: suggestion.type,
        suggestion_title: suggestion.title
      });
    }
  }

  showWelcomeSuggestion() {
    // Show a special welcome suggestion for first-time visitors
    const welcomeModal = document.createElement('div');
    welcomeModal.className = 'welcome-suggestion-modal';
    welcomeModal.innerHTML = `
      <div class="welcome-content">
        <h2>🎉 Welcome to CocoPilot!</h2>
        <p>I'm your AI assistant, ready to help you explore this self-improving repository. 
           I can provide personalized suggestions based on your interests.</p>
        <div class="welcome-actions">
          <button class="start-tour-btn">Take a Tour</button>
          <button class="dismiss-welcome-btn">Explore on My Own</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(welcomeModal);
    
    // Add welcome modal styles
    const styles = document.createElement('style');
    styles.textContent = `
      .welcome-suggestion-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
      }
      
      .welcome-content {
        background: var(--container-bg, white);
        padding: 30px;
        border-radius: 16px;
        max-width: 400px;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      }
      
      .welcome-actions {
        display: flex;
        gap: 10px;
        margin-top: 20px;
      }
      
      .welcome-actions button {
        flex: 1;
        padding: 12px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
      }
      
      .start-tour-btn {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
      }
      
      .dismiss-welcome-btn {
        background: transparent;
        color: var(--text-secondary);
        border: 1px solid var(--border-color);
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
    
    document.head.appendChild(styles);
    
    // Add event listeners
    welcomeModal.querySelector('.start-tour-btn').addEventListener('click', () => {
      document.body.removeChild(welcomeModal);
      this.startGuidedTour();
    });
    
    welcomeModal.querySelector('.dismiss-welcome-btn').addEventListener('click', () => {
      document.body.removeChild(welcomeModal);
      this.showSuggestionPanel();
    });
    
    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      if (document.body.contains(welcomeModal)) {
        document.body.removeChild(welcomeModal);
        this.showSuggestionPanel();
      }
    }, 10000);
  }

  // Feature methods (stubs for now - could be expanded)
  startInteractiveDemo() {
    console.log('🎮 Starting interactive demo...');
    // Implementation would go here
  }

  startGuidedTour() {
    console.log('🗺️ Starting guided tour...');
    // Implementation would go here
  }

  showAdvancedFeatures() {
    console.log('🚀 Showing advanced features...');
    // Implementation would go here
  }

  enableLightweightMode() {
    console.log('⚡ Enabling lightweight mode...');
    document.body.classList.add('lightweight-mode');
    // Implementation would go here
  }

  optimizeForMobile() {
    console.log('📱 Optimizing for mobile...');
    document.body.classList.add('mobile-optimized');
    // Implementation would go here
  }

  showSettings() {
    console.log('⚙️ Showing settings...');
    // Implementation would go here
  }

  trackScrollBehavior() {
    // Track scroll patterns
  }

  trackClickBehavior(e) {
    // Track click patterns
  }

  observeElementVisibility() {
    // Track which elements user spends time viewing
  }
}

// Context Analyzer helper class
class ContextAnalyzer {
  analyzeUserBehavior() {
    // Analyze user interaction patterns
  }

  getContentRelevance() {
    // Determine content relevance based on user behavior
  }
}

// Suggestion Provider helper class
class SuggestionProvider {
  generateContextualSuggestions(context) {
    // Generate suggestions based on context
  }

  prioritizeSuggestions(suggestions) {
    // Sort and prioritize suggestions
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.aiSuggestions = new AIContentSuggestions();
    window.aiSuggestions.initialize();
  });
} else {
  window.aiSuggestions = new AIContentSuggestions();
  window.aiSuggestions.initialize();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AIContentSuggestions;
}