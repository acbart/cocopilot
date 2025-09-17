/**
 * AI Recommendations Engine for CocoPilot
 * Provides intelligent suggestions based on user behavior and repository state
 */

class AIRecommendationsEngine {
  constructor() {
    this.userBehavior = {
      visitCount: 0,
      featuresUsed: new Set(),
      timeSpent: 0,
      lastVisit: null,
      preferences: {}
    };
    this.recommendations = [];
    this.isInitialized = false;
    this.init();
  }

  init() {
    if (this.isInitialized) {
      return;
    }

    try {
      this.loadUserBehavior();
      this.trackUserBehavior();
      this.generateRecommendations();
      this.createRecommendationsPanel();
      this.isInitialized = true;
    } catch (error) {
      console.warn('AI Recommendations Engine initialization failed:', error);
    }
  }

  loadUserBehavior() {
    const stored = localStorage.getItem('cocopilot-user-behavior');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.userBehavior = {
          ...this.userBehavior,
          ...data,
          featuresUsed: new Set(data.featuresUsed || [])
        };
      } catch (error) {
        console.warn('Failed to load user behavior data:', error);
      }
    }

    // Update visit count and last visit
    this.userBehavior.visitCount++;
    this.userBehavior.lastVisit = new Date().toISOString();
    this.saveUserBehavior();
  }

  saveUserBehavior() {
    try {
      const data = {
        ...this.userBehavior,
        featuresUsed: Array.from(this.userBehavior.featuresUsed)
      };
      localStorage.setItem('cocopilot-user-behavior', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save user behavior data:', error);
    }
  }

  trackUserBehavior() {
    // Track theme usage
    document.addEventListener('themeChanged', () => {
      this.userBehavior.featuresUsed.add('theme-toggle');
      this.saveUserBehavior();
    });

    // Track language changes
    document.addEventListener('languageChanged', () => {
      this.userBehavior.featuresUsed.add('language-selector');
      this.saveUserBehavior();
    });

    // Track search usage
    document.addEventListener('searchUsed', () => {
      this.userBehavior.featuresUsed.add('advanced-search');
      this.saveUserBehavior();
    });

    // Track onboarding completion
    document.addEventListener('onboardingCompleted', () => {
      this.userBehavior.featuresUsed.add('onboarding-tour');
      this.saveUserBehavior();
    });

    // Track analytics usage
    document.addEventListener('click', (e) => {
      if (e.target.closest('#toggle-dashboard')) {
        this.userBehavior.featuresUsed.add('analytics-dashboard');
        this.saveUserBehavior();
      }
      if (e.target.closest('#toggle-diff')) {
        this.userBehavior.featuresUsed.add('code-diff-viewer');
        this.saveUserBehavior();
      }
    });

    // Track time spent
    const startTime = Date.now();
    window.addEventListener('beforeunload', () => {
      this.userBehavior.timeSpent += Date.now() - startTime;
      this.saveUserBehavior();
    });
  }

  generateRecommendations() {
    this.recommendations = [];

    // Onboarding recommendation for new users
    if (this.userBehavior.visitCount <= 2 && !this.userBehavior.featuresUsed.has('onboarding-tour')) {
      this.recommendations.push({
        id: 'onboarding',
        type: 'feature',
        priority: 'high',
        title: 'Take the Interactive Tour',
        description: 'Discover all the features CocoPilot has to offer with our guided tour.',
        action: 'Start Tour',
        icon: '🎓',
        category: 'getting-started'
      });
    }

    // Analytics recommendation for engaged users
    if (this.userBehavior.visitCount >= 3 && !this.userBehavior.featuresUsed.has('analytics-dashboard')) {
      this.recommendations.push({
        id: 'analytics',
        type: 'feature',
        priority: 'medium',
        title: 'Explore AI Analytics',
        description: 'See detailed insights into how AI improves this repository over time.',
        action: 'View Analytics',
        icon: '📊',
        category: 'insights'
      });
    }

    // Code diff recommendation for developers
    if (this.userBehavior.featuresUsed.has('analytics-dashboard') && !this.userBehavior.featuresUsed.has('code-diff-viewer')) {
      this.recommendations.push({
        id: 'code-diff',
        type: 'feature',
        priority: 'medium',
        title: 'View Code Evolution',
        description: 'See exactly how AI changes code with our interactive diff viewer.',
        action: 'View Diffs',
        icon: '💻',
        category: 'development'
      });
    }

    // Theme recommendation for users who haven't customized
    if (!this.userBehavior.featuresUsed.has('theme-toggle') && this.userBehavior.visitCount >= 2) {
      this.recommendations.push({
        id: 'theme',
        type: 'customization',
        priority: 'low',
        title: 'Customize Your Experience',
        description: 'Switch to dark mode for a more comfortable viewing experience.',
        action: 'Toggle Theme',
        icon: '🌙',
        category: 'personalization'
      });
    }

    // Language recommendation for international users
    if (!this.userBehavior.featuresUsed.has('language-selector') && this.detectNonEnglishLocale()) {
      this.recommendations.push({
        id: 'language',
        type: 'accessibility',
        priority: 'medium',
        title: 'View in Your Language',
        description: 'CocoPilot is available in multiple languages for better accessibility.',
        action: 'Change Language',
        icon: '🌍',
        category: 'accessibility'
      });
    }

    // Advanced features for power users
    if (this.userBehavior.featuresUsed.size >= 3) {
      this.recommendations.push({
        id: 'advanced',
        type: 'feature',
        priority: 'low',
        title: 'Try Advanced Search',
        description: 'Use Ctrl+K to quickly find features, documentation, and shortcuts.',
        action: 'Open Search',
        icon: '🔍',
        category: 'productivity'
      });
    }

    // Sort by priority
    this.recommendations.sort((a, b) => {
      const priorities = { high: 3, medium: 2, low: 1 };
      return priorities[b.priority] - priorities[a.priority];
    });
  }

  detectNonEnglishLocale() {
    const locale = navigator.language || navigator.userLanguage;
    return locale && !locale.startsWith('en');
  }

  createRecommendationsPanel() {
    if (this.recommendations.length === 0) {
      return;
    }

    const recommendationsHtml = `
      <div class="ai-recommendations" id="ai-recommendations">
        <div class="recommendations-header">
          <div class="ai-avatar">🤖</div>
          <div class="recommendations-title">
            <h4 data-i18n="recommendations.title">AI Suggestions</h4>
            <p data-i18n="recommendations.subtitle">Personalized recommendations to enhance your experience</p>
          </div>
          <button class="recommendations-close" id="close-recommendations" aria-label="Close recommendations">×</button>
        </div>
        
        <div class="recommendations-list" id="recommendations-list">
          ${this.recommendations.slice(0, 3).map(rec => this.createRecommendationCard(rec)).join('')}
        </div>
        
        <div class="recommendations-footer">
          <button class="recommendations-action" id="dismiss-recommendations" data-i18n="recommendations.dismiss">
            Not now
          </button>
          <button class="recommendations-action primary" id="view-all-recommendations" data-i18n="recommendations.view_all">
            View all suggestions
          </button>
        </div>
      </div>
    `;

    // Insert recommendations panel
    document.body.insertAdjacentHTML('beforeend', recommendationsHtml);
    this.addRecommendationsStyles();
    this.bindRecommendationEvents();

    // Show after a delay to avoid overwhelming new users
    setTimeout(() => {
      this.showRecommendations();
    }, 3000);
  }

  createRecommendationCard(recommendation) {
    return `
      <div class="recommendation-card" data-id="${recommendation.id}">
        <div class="recommendation-icon">${recommendation.icon}</div>
        <div class="recommendation-content">
          <div class="recommendation-title">${recommendation.title}</div>
          <div class="recommendation-description">${recommendation.description}</div>
          <div class="recommendation-category">${recommendation.category}</div>
        </div>
        <button class="recommendation-action-btn" data-action="${recommendation.id}">
          ${recommendation.action}
        </button>
      </div>
    `;
  }

  addRecommendationsStyles() {
    const styles = `
      <style id="ai-recommendations-styles">
        .ai-recommendations {
          position: fixed;
          bottom: 20px;
          right: 20px;
          max-width: 400px;
          background: var(--container-bg);
          border-radius: 15px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
          border: 1px solid var(--border-color);
          z-index: 1000;
          transform: translateY(100px);
          opacity: 0;
          transition: all 0.3s ease;
        }

        .ai-recommendations.show {
          transform: translateY(0);
          opacity: 1;
        }

        .recommendations-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 20px 20px 15px;
          border-bottom: 1px solid var(--border-color);
        }

        .ai-avatar {
          font-size: 24px;
          background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .recommendations-title {
          flex: 1;
        }

        .recommendations-title h4 {
          margin: 0 0 5px 0;
          font-size: 16px;
          color: var(--text-primary);
        }

        .recommendations-title p {
          margin: 0;
          font-size: 12px;
          color: var(--text-secondary);
        }

        .recommendations-close {
          background: none;
          border: none;
          font-size: 20px;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .recommendations-close:hover {
          background: rgba(0, 0, 0, 0.1);
          color: var(--text-primary);
        }

        .recommendations-list {
          padding: 15px 20px;
          max-height: 300px;
          overflow-y: auto;
        }

        .recommendation-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 12px;
          margin-bottom: 10px;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .recommendation-card:hover {
          background: rgba(255, 255, 255, 0.8);
          transform: translateY(-1px);
        }

        .recommendation-card:last-child {
          margin-bottom: 0;
        }

        .recommendation-icon {
          font-size: 20px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 8px;
          flex-shrink: 0;
        }

        .recommendation-content {
          flex: 1;
          min-width: 0;
        }

        .recommendation-title {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 14px;
          margin-bottom: 4px;
        }

        .recommendation-description {
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.3;
          margin-bottom: 4px;
        }

        .recommendation-category {
          font-size: 10px;
          color: var(--button-gradient-start);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
        }

        .recommendation-action-btn {
          background: var(--button-gradient-start);
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .recommendation-action-btn:hover {
          background: var(--button-gradient-end);
          transform: scale(1.05);
        }

        .recommendations-footer {
          display: flex;
          gap: 10px;
          padding: 15px 20px 20px;
          border-top: 1px solid var(--border-color);
        }

        .recommendations-action {
          flex: 1;
          padding: 10px 16px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .recommendations-action:hover {
          background: rgba(0, 0, 0, 0.05);
          color: var(--text-primary);
        }

        .recommendations-action.primary {
          background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
          color: white;
          border-color: transparent;
        }

        .recommendations-action.primary:hover {
          background: linear-gradient(135deg, var(--button-gradient-end), var(--button-gradient-start));
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .ai-recommendations {
            bottom: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
          }

          .recommendations-header {
            padding: 15px 15px 12px;
          }

          .recommendations-list {
            padding: 12px 15px;
          }

          .recommendation-card {
            padding: 12px;
          }

          .recommendations-footer {
            padding: 12px 15px 15px;
            flex-direction: column;
          }
        }

        /* Dark theme support */
        [data-theme="dark"] .ai-recommendations {
          --container-bg: rgba(45, 55, 72, 0.95);
          --text-primary: #e2e8f0;
          --text-secondary: #a0aec0;
          --border-color: rgba(255, 255, 255, 0.1);
        }

        [data-theme="dark"] .recommendation-card {
          background: rgba(45, 55, 72, 0.5);
        }

        [data-theme="dark"] .recommendation-card:hover {
          background: rgba(45, 55, 72, 0.8);
        }

        [data-theme="dark"] .recommendation-icon {
          background: rgba(102, 126, 234, 0.2);
        }

        [data-theme="dark"] .recommendations-close:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        [data-theme="dark"] .recommendations-action:hover {
          background: rgba(255, 255, 255, 0.05);
        }
      </style>
    `;

    if (!document.getElementById('ai-recommendations-styles')) {
      document.head.insertAdjacentHTML('beforeend', styles);
    }
  }

  bindRecommendationEvents() {
    const panel = document.getElementById('ai-recommendations');
    const closeBtn = document.getElementById('close-recommendations');
    const dismissBtn = document.getElementById('dismiss-recommendations');
    const viewAllBtn = document.getElementById('view-all-recommendations');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hideRecommendations());
    }

    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => {
        this.hideRecommendations();
        this.setRecommendationsDismissed();
      });
    }

    if (viewAllBtn) {
      viewAllBtn.addEventListener('click', () => {
        this.showAllRecommendations();
      });
    }

    // Handle action buttons
    panel.addEventListener('click', (e) => {
      const actionBtn = e.target.closest('.recommendation-action-btn');
      if (actionBtn) {
        const action = actionBtn.getAttribute('data-action');
        this.executeRecommendationAction(action);
      }
    });
  }

  showRecommendations() {
    const panel = document.getElementById('ai-recommendations');
    if (panel && !this.isRecommendationsDismissed()) {
      panel.classList.add('show');
    }
  }

  hideRecommendations() {
    const panel = document.getElementById('ai-recommendations');
    if (panel) {
      panel.classList.remove('show');
      setTimeout(() => panel.remove(), 300);
    }
  }

  isRecommendationsDismissed() {
    const dismissed = localStorage.getItem('cocopilot-recommendations-dismissed');
    return dismissed === 'true';
  }

  setRecommendationsDismissed() {
    localStorage.setItem('cocopilot-recommendations-dismissed', 'true');
  }

  executeRecommendationAction(action) {
    switch (action) {
    case 'onboarding': {
      // Trigger onboarding tour
      const tourBtn = document.querySelector('[onclick="startOnboardingTour()"]');
      if (tourBtn) {
        tourBtn.click();
      }
      break;
    }

    case 'analytics': {
      // Open analytics dashboard
      const analyticsBtn = document.getElementById('toggle-dashboard');
      if (analyticsBtn) {
        analyticsBtn.click();
      }
      break;
    }

    case 'code-diff': {
      // Open code diff viewer
      const diffBtn = document.getElementById('toggle-diff');
      if (diffBtn) {
        diffBtn.click();
      }
      break;
    }

    case 'theme': {
      // Toggle theme - check if function exists in global scope
      const themeToggle = document.querySelector('.theme-toggle');
      if (themeToggle) {
        themeToggle.click();
      }
      break;
    }

    case 'language': {
      // Open language selector
      const langBtn = document.querySelector('.language-selector');
      if (langBtn) {
        langBtn.click();
      }
      break;
    }

    case 'advanced':
      // Open search
      document.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true
      }));
      break;
    }

    // Track action execution
    this.userBehavior.featuresUsed.add(action);
    this.saveUserBehavior();
    this.hideRecommendations();
  }

  showAllRecommendations() {
    // Create a modal with all recommendations
    const modal = document.createElement('div');
    modal.className = 'recommendations-modal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>All AI Suggestions</h3>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          ${this.recommendations.map(rec => this.createRecommendationCard(rec)).join('')}
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add modal styles and events
    this.addModalStyles();
    this.bindModalEvents(modal);
  }

  addModalStyles() {
    const styles = `
      <style id="recommendations-modal-styles">
        .recommendations-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(5px);
        }

        .modal-content {
          position: relative;
          max-width: 600px;
          max-height: 80vh;
          background: var(--container-bg);
          border-radius: 15px;
          overflow: hidden;
          margin: 20px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid var(--border-color);
        }

        .modal-header h3 {
          margin: 0;
          color: var(--text-primary);
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: var(--text-secondary);
        }

        .modal-body {
          padding: 20px;
          overflow-y: auto;
          max-height: 60vh;
        }
      </style>
    `;

    if (!document.getElementById('recommendations-modal-styles')) {
      document.head.insertAdjacentHTML('beforeend', styles);
    }
  }

  bindModalEvents(modal) {
    const overlay = modal.querySelector('.modal-overlay');
    const closeBtn = modal.querySelector('.modal-close');

    [overlay, closeBtn].forEach(element => {
      element.addEventListener('click', () => {
        modal.remove();
      });
    });

    // Handle action buttons in modal
    modal.addEventListener('click', (e) => {
      const actionBtn = e.target.closest('.recommendation-action-btn');
      if (actionBtn) {
        const action = actionBtn.getAttribute('data-action');
        this.executeRecommendationAction(action);
        modal.remove();
      }
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new AIRecommendationsEngine();
  });
} else {
  new AIRecommendationsEngine();
}

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AIRecommendationsEngine;
}