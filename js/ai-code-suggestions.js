/**
 * AI-Powered Code Suggestions System
 * Provides intelligent code completion, suggestions, and AI-driven improvements
 */

class AICodeSuggestions {
  constructor() {
    this.isInitialized = false;
    this.currentContext = 'website';
    this.suggestionHistory = [];
    this.userPreferences = this.loadUserPreferences();
    this.apiCache = new Map();
    this.init();
  }

  async init() {
    try {
      await this.setupUI();
      await this.loadSuggestionTemplates();
      this.setupEventListeners();
      this.startContextAnalysis();
      this.isInitialized = true;
      console.log('AI Code Suggestions system initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AI Code Suggestions:', error);
      this.handleError(error);
    }
  }

  async setupUI() {
    // Create the AI suggestions panel
    const suggestionsPanel = document.createElement('div');
    suggestionsPanel.id = 'ai-suggestions-panel';
    suggestionsPanel.className = 'ai-suggestions-panel';
    suggestionsPanel.innerHTML = `
      <div class="ai-suggestions-header">
        <h3>
          <span class="ai-icon">🤖</span>
          AI Code Suggestions
        </h3>
        <div class="ai-controls">
          <button class="ai-toggle-btn" title="Toggle AI Suggestions" aria-label="Toggle AI Suggestions">
            <span class="toggle-icon">👁️</span>
          </button>
          <button class="ai-settings-btn" title="AI Settings" aria-label="AI Settings">
            <span class="settings-icon">⚙️</span>
          </button>
        </div>
      </div>
      <div class="ai-suggestions-content">
        <div class="suggestion-context">
          <span class="context-label">Context:</span>
          <span class="context-value">${this.currentContext}</span>
        </div>
        <div class="suggestions-list" id="suggestions-list">
          <div class="suggestion-item">
            <div class="suggestion-icon">💡</div>
            <div class="suggestion-content">
              <strong>Welcome to AI Suggestions!</strong>
              <p>I'll analyze your context and provide intelligent recommendations.</p>
            </div>
          </div>
        </div>
        <div class="suggestion-input">
          <input type="text" id="ai-query-input" placeholder="Ask AI for suggestions..." 
                 aria-label="Ask AI for suggestions">
          <button id="ai-query-submit" aria-label="Submit AI query">Ask AI</button>
        </div>
      </div>
    `;

    // Add CSS styles
    this.addStyles();

    // Insert panel into the page
    const targetContainer = document.querySelector('.container') || document.body;
    targetContainer.appendChild(suggestionsPanel);

    // Initially hide the panel (can be toggled)
    if (!this.userPreferences.showByDefault) {
      suggestionsPanel.classList.add('minimized');
    }
  }

  addStyles() {
    if (document.getElementById('ai-suggestions-styles')) {
      return;
    }

    const styles = document.createElement('style');
    styles.id = 'ai-suggestions-styles';
    styles.textContent = `
      .ai-suggestions-panel {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 320px;
        max-height: 500px;
        background: var(--container-bg, rgba(255, 255, 255, 0.95));
        border: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        z-index: 1000;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
      }

      .ai-suggestions-panel.minimized {
        height: 60px;
        overflow: hidden;
      }

      .ai-suggestions-panel.minimized .ai-suggestions-content {
        display: none;
      }

      .ai-suggestions-header {
        padding: 15px;
        border-bottom: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
      }

      .ai-suggestions-header h3 {
        margin: 0;
        font-size: 1rem;
        color: var(--text-primary, #333);
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .ai-icon {
        font-size: 1.2rem;
      }

      .ai-controls {
        display: flex;
        gap: 8px;
      }

      .ai-toggle-btn, .ai-settings-btn {
        background: none;
        border: none;
        padding: 6px;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      .ai-toggle-btn:hover, .ai-settings-btn:hover {
        background: var(--feature-bg, rgba(102, 126, 234, 0.1));
      }

      .ai-suggestions-content {
        padding: 15px;
        flex: 1;
        overflow-y: auto;
      }

      .suggestion-context {
        margin-bottom: 15px;
        padding: 8px 12px;
        background: var(--feature-bg, rgba(102, 126, 234, 0.1));
        border-radius: 8px;
        font-size: 0.9rem;
      }

      .context-label {
        color: var(--text-secondary, #666);
        font-weight: 600;
      }

      .context-value {
        color: var(--text-primary, #333);
        margin-left: 8px;
      }

      .suggestions-list {
        margin-bottom: 15px;
        max-height: 250px;
        overflow-y: auto;
      }

      .suggestion-item {
        display: flex;
        gap: 12px;
        padding: 12px;
        border: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
        border-radius: 10px;
        margin-bottom: 10px;
        transition: all 0.2s ease;
        cursor: pointer;
      }

      .suggestion-item:hover {
        background: var(--feature-bg, rgba(102, 126, 234, 0.05));
        transform: translateY(-1px);
      }

      .suggestion-icon {
        font-size: 1.2rem;
        flex-shrink: 0;
      }

      .suggestion-content {
        flex: 1;
      }

      .suggestion-content strong {
        color: var(--text-primary, #333);
        display: block;
        margin-bottom: 4px;
      }

      .suggestion-content p {
        color: var(--text-secondary, #666);
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.4;
      }

      .suggestion-input {
        display: flex;
        gap: 8px;
      }

      #ai-query-input {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
        border-radius: 8px;
        font-size: 0.9rem;
        background: var(--container-bg, white);
        color: var(--text-primary, #333);
      }

      #ai-query-input:focus {
        outline: none;
        border-color: var(--button-gradient-start, #667eea);
      }

      #ai-query-submit {
        padding: 8px 12px;
        background: linear-gradient(135deg, var(--button-gradient-start, #667eea), var(--button-gradient-end, #764ba2));
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: transform 0.2s ease;
      }

      #ai-query-submit:hover {
        transform: translateY(-1px);
      }

      @media (max-width: 768px) {
        .ai-suggestions-panel {
          position: relative;
          top: auto;
          right: auto;
          width: 100%;
          margin: 20px 0;
        }
      }

      /* Dark theme support */
      [data-theme="dark"] .ai-suggestions-panel {
        background: var(--container-bg, rgba(30, 30, 30, 0.95));
      }

      [data-theme="dark"] #ai-query-input {
        background: var(--container-bg, rgba(40, 40, 40, 0.8));
        color: var(--text-primary, #fff);
      }
    `;

    document.head.appendChild(styles);
  }

  async loadSuggestionTemplates() {
    // Load contextual suggestion templates
    this.suggestionTemplates = {
      website: [
        {
          icon: '🎨',
          title: 'Enhance Visual Design',
          description: 'Add animations, improve color schemes, or enhance typography',
          action: 'design'
        },
        {
          icon: '⚡',
          title: 'Optimize Performance',
          description: 'Implement lazy loading, code splitting, or caching strategies',
          action: 'performance'
        },
        {
          icon: '♿',
          title: 'Improve Accessibility',
          description: 'Add ARIA labels, improve keyboard navigation, or enhance screen reader support',
          action: 'accessibility'
        },
        {
          icon: '📱',
          title: 'Mobile Experience',
          description: 'Enhance responsive design and mobile-specific features',
          action: 'mobile'
        }
      ],
      development: [
        {
          icon: '🔧',
          title: 'Code Refactoring',
          description: 'Suggest modern patterns, reduce complexity, or improve maintainability',
          action: 'refactor'
        },
        {
          icon: '🧪',
          title: 'Add Testing',
          description: 'Create unit tests, integration tests, or end-to-end testing',
          action: 'testing'
        },
        {
          icon: '📖',
          title: 'Documentation',
          description: 'Improve code comments, add JSDoc, or create user guides',
          action: 'documentation'
        }
      ]
    };
  }

  setupEventListeners() {
    // Toggle panel visibility
    const toggleBtn = document.querySelector('.ai-toggle-btn');
    const _panel = document.getElementById('ai-suggestions-panel');
    const header = document.querySelector('.ai-suggestions-header');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.togglePanel();
      });
    }

    if (header) {
      header.addEventListener('click', () => {
        this.togglePanel();
      });
    }

    // Handle AI query submission
    const queryInput = document.getElementById('ai-query-input');
    const submitBtn = document.getElementById('ai-query-submit');

    if (queryInput && submitBtn) {
      submitBtn.addEventListener('click', () => {
        this.handleAIQuery(queryInput.value);
      });

      queryInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleAIQuery(queryInput.value);
        }
      });
    }

    // Handle suggestion clicks
    document.addEventListener('click', (e) => {
      const suggestionItem = e.target.closest('.suggestion-item');
      if (suggestionItem && suggestionItem.dataset.action) {
        this.handleSuggestionClick(suggestionItem.dataset.action);
      }
    });

    // Settings button
    const settingsBtn = document.querySelector('.ai-settings-btn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showSettings();
      });
    }
  }

  togglePanel() {
    const panel = document.getElementById('ai-suggestions-panel');
    if (panel) {
      panel.classList.toggle('minimized');
      this.userPreferences.showByDefault = !panel.classList.contains('minimized');
      this.saveUserPreferences();
    }
  }

  async handleAIQuery(query) {
    if (!query.trim()) {
      return;
    }

    const input = document.getElementById('ai-query-input');
    if (input) {
      input.value = '';
    }

    // Add user query to suggestions list
    this.addSuggestion({
      icon: '👤',
      title: 'Your Question',
      description: query,
      type: 'user-query'
    });

    // Simulate AI processing
    this.addSuggestion({
      icon: '🤔',
      title: 'AI is thinking...',
      description: 'Analyzing your request and generating suggestions',
      type: 'loading'
    });

    try {
      // Simulate AI response (in a real implementation, this would call an AI API)
      await new Promise(resolve => setTimeout(resolve, 1500));

      const aiResponse = await this.generateAIResponse(query);
      this.removeSuggestionsByType('loading');

      this.addSuggestion({
        icon: '🤖',
        title: 'AI Suggestion',
        description: aiResponse,
        type: 'ai-response'
      });

    } catch (_error) {
      this.removeSuggestionsByType('loading');
      this.addSuggestion({
        icon: '❌',
        title: 'Error',
        description: 'Sorry, I encountered an error processing your request.',
        type: 'error'
      });
    }
  }

  async generateAIResponse(query) {
    // Simulate intelligent AI responses based on query content
    const queryLower = query.toLowerCase();

    if (queryLower.includes('performance') || queryLower.includes('speed') || queryLower.includes('optimize')) {
      return 'Consider implementing lazy loading for images, minifying CSS/JS files, using a CDN, and optimizing your service worker caching strategy.';
    } else if (queryLower.includes('accessibility') || queryLower.includes('a11y')) {
      return 'Add ARIA labels to interactive elements, ensure proper heading hierarchy, implement keyboard navigation, and test with screen readers.';
    } else if (queryLower.includes('mobile') || queryLower.includes('responsive')) {
      return 'Implement touch-friendly interfaces, optimize for various screen sizes, add mobile-specific gestures, and test on actual devices.';
    } else if (queryLower.includes('design') || queryLower.includes('ui') || queryLower.includes('visual')) {
      return 'Consider adding micro-animations, improving color contrast, using consistent spacing, and implementing a design system.';
    } else if (queryLower.includes('security')) {
      return 'Implement Content Security Policy (CSP), validate all inputs, use HTTPS everywhere, and regularly update dependencies.';
    } else {
      return `Great question! For "${query}", I suggest exploring the latest web development best practices, considering user experience improvements, and ensuring your code follows accessibility guidelines.`;
    }
  }

  addSuggestion(suggestion) {
    const suggestionsList = document.getElementById('suggestions-list');
    if (!suggestionsList) {
      return;
    }

    const suggestionElement = document.createElement('div');
    suggestionElement.className = 'suggestion-item';
    if (suggestion.action) {
      suggestionElement.dataset.action = suggestion.action;
    }
    if (suggestion.type) {
      suggestionElement.dataset.type = suggestion.type;
    }

    suggestionElement.innerHTML = `
      <div class="suggestion-icon">${suggestion.icon}</div>
      <div class="suggestion-content">
        <strong>${suggestion.title}</strong>
        <p>${suggestion.description}</p>
      </div>
    `;

    suggestionsList.appendChild(suggestionElement);

    // Auto-scroll to show new suggestion
    suggestionElement.scrollIntoView({ behavior: 'smooth', block: 'end' });

    // Store in history
    this.suggestionHistory.push({
      ...suggestion,
      timestamp: new Date().toISOString()
    });

    // Limit history size
    if (this.suggestionHistory.length > 50) {
      this.suggestionHistory = this.suggestionHistory.slice(-25);
    }
  }

  removeSuggestionsByType(type) {
    const suggestionsList = document.getElementById('suggestions-list');
    if (!suggestionsList) {
      return;
    }

    const suggestions = suggestionsList.querySelectorAll(`[data-type="${type}"]`);
    suggestions.forEach(suggestion => suggestion.remove());
  }

  startContextAnalysis() {
    // Analyze current page context and provide relevant suggestions
    this.analyzePageContext();

    // Update context every 30 seconds
    setInterval(() => {
      this.analyzePageContext();
    }, 30000);
  }

  analyzePageContext() {
    let newContext = 'website';

    // Analyze current page elements and content
    if (document.querySelector('.code-playground') || document.querySelector('code')) {
      newContext = 'development';
    } else if (document.querySelector('.documentation') || document.querySelector('.user-guide')) {
      newContext = 'documentation';
    } else if (document.querySelector('.analytics') || document.querySelector('.dashboard')) {
      newContext = 'analytics';
    }

    if (newContext !== this.currentContext) {
      this.currentContext = newContext;
      this.updateContextDisplay();
      this.loadContextualSuggestions();
    }
  }

  updateContextDisplay() {
    const contextValue = document.querySelector('.context-value');
    if (contextValue) {
      contextValue.textContent = this.currentContext;
    }
  }

  loadContextualSuggestions() {
    const templates = this.suggestionTemplates[this.currentContext] || this.suggestionTemplates.website;

    // Clear existing contextual suggestions
    this.removeSuggestionsByType('contextual');

    // Add relevant suggestions
    templates.forEach(template => {
      this.addSuggestion({
        ...template,
        type: 'contextual'
      });
    });
  }

  handleSuggestionClick(action) {
    // Handle different suggestion actions
    switch (action) {
    case 'design':
      this.showDesignSuggestions();
      break;
    case 'performance':
      this.showPerformanceSuggestions();
      break;
    case 'accessibility':
      this.showAccessibilitySuggestions();
      break;
    case 'mobile':
      this.showMobileSuggestions();
      break;
    default:
      console.log('Suggestion clicked:', action);
    }
  }

  showDesignSuggestions() {
    this.addSuggestion({
      icon: '🎨',
      title: 'Design Recommendations',
      description: 'Consider adding subtle animations on hover, improving color contrast ratios, and using consistent spacing throughout the interface.',
      type: 'detailed'
    });
  }

  showPerformanceSuggestions() {
    this.addSuggestion({
      icon: '⚡',
      title: 'Performance Tips',
      description: 'Implement image lazy loading, compress assets, use efficient selectors, and consider implementing virtual scrolling for large lists.',
      type: 'detailed'
    });
  }

  showAccessibilitySuggestions() {
    this.addSuggestion({
      icon: '♿',
      title: 'Accessibility Improvements',
      description: 'Add proper ARIA labels, ensure keyboard navigation works throughout the site, and test with screen readers.',
      type: 'detailed'
    });
  }

  showMobileSuggestions() {
    this.addSuggestion({
      icon: '📱',
      title: 'Mobile Enhancements',
      description: 'Optimize touch targets to be at least 44px, implement swipe gestures, and test on various device sizes.',
      type: 'detailed'
    });
  }

  showSettings() {
    // Create a simple settings modal
    const modal = document.createElement('div');
    modal.className = 'ai-settings-modal';
    modal.innerHTML = `
      <div class="ai-settings-content">
        <h3>AI Suggestions Settings</h3>
        <div class="setting-item">
          <label>
            <input type="checkbox" ${this.userPreferences.showByDefault ? 'checked' : ''} id="show-by-default">
            Show panel by default
          </label>
        </div>
        <div class="setting-item">
          <label>
            <input type="checkbox" ${this.userPreferences.autoSuggestions ? 'checked' : ''} id="auto-suggestions">
            Enable automatic suggestions
          </label>
        </div>
        <div class="settings-actions">
          <button class="save-settings">Save</button>
          <button class="cancel-settings">Cancel</button>
        </div>
      </div>
    `;

    // Add modal styles
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
      .ai-settings-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1001;
      }
      .ai-settings-content {
        background: var(--container-bg, white);
        padding: 20px;
        border-radius: 10px;
        max-width: 400px;
        width: 90%;
      }
      .setting-item {
        margin: 15px 0;
      }
      .settings-actions {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 20px;
      }
      .settings-actions button {
        padding: 8px 16px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
      .save-settings {
        background: var(--button-gradient-start, #667eea);
        color: white;
      }
      .cancel-settings {
        background: #ccc;
      }
    `;

    document.head.appendChild(modalStyles);
    document.body.appendChild(modal);

    // Handle settings actions
    modal.querySelector('.save-settings').addEventListener('click', () => {
      this.userPreferences.showByDefault = modal.querySelector('#show-by-default').checked;
      this.userPreferences.autoSuggestions = modal.querySelector('#auto-suggestions').checked;
      this.saveUserPreferences();
      document.body.removeChild(modal);
      document.head.removeChild(modalStyles);
    });

    modal.querySelector('.cancel-settings').addEventListener('click', () => {
      document.body.removeChild(modal);
      document.head.removeChild(modalStyles);
    });
  }

  loadUserPreferences() {
    try {
      const stored = localStorage.getItem('ai-suggestions-preferences');
      return stored ? JSON.parse(stored) : {
        showByDefault: true,
        autoSuggestions: true
      };
    } catch (error) {
      return {
        showByDefault: true,
        autoSuggestions: true
      };
    }
  }

  saveUserPreferences() {
    try {
      localStorage.setItem('ai-suggestions-preferences', JSON.stringify(this.userPreferences));
    } catch (error) {
      console.warn('Could not save user preferences:', error);
    }
  }

  handleError(error) {
    console.error('AI Suggestions Error:', error);
    this.addSuggestion({
      icon: '⚠️',
      title: 'System Notice',
      description: 'AI suggestions are running in limited mode. Some features may be unavailable.',
      type: 'error'
    });
  }
}

// Initialize the AI Code Suggestions system when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new AICodeSuggestions();
  });
} else {
  new AICodeSuggestions();
}

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AICodeSuggestions;
}