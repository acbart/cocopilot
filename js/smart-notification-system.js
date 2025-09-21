/**
 * Smart Notification System
 * Provides intelligent real-time notifications, suggestions, and system updates
 */

class SmartNotificationSystem {
  constructor() {
    this.notifications = [];
    this.isInitialized = false;
    this.settings = this.loadSettings();
    this.notificationQueue = [];
    this.maxNotifications = 5;
    this.autoHideDelay = 5000; // 5 seconds
    this.init();
  }

  async init() {
    try {
      await this.setupUI();
      this.setupEventListeners();
      this.startIntelligentMonitoring();
      this.isInitialized = true;
      
      // Welcome notification for new users
      setTimeout(() => {
        this.showWelcomeNotification();
      }, 1000);

      console.log('Smart Notification System initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Smart Notification System:', error);
    }
  }

  async setupUI() {
    // Create notification container
    const notificationContainer = document.createElement('div');
    notificationContainer.id = 'smart-notifications-container';
    notificationContainer.className = 'smart-notifications-container';
    notificationContainer.setAttribute('aria-live', 'polite');
    notificationContainer.setAttribute('aria-label', 'Notifications');

    document.body.appendChild(notificationContainer);

    // Create notification settings panel
    const settingsPanel = document.createElement('div');
    settingsPanel.id = 'notification-settings-panel';
    settingsPanel.className = 'notification-settings-panel';
    settingsPanel.style.display = 'none';
    settingsPanel.innerHTML = `
      <div class="notification-settings-content">
        <div class="settings-header">
          <h3>🔔 Notification Settings</h3>
          <button class="settings-close" aria-label="Close settings">×</button>
        </div>
        <div class="settings-options">
          <div class="setting-group">
            <label class="setting-label">
              <input type="checkbox" id="enable-notifications" ${this.settings.enabled ? 'checked' : ''}>
              <span>Enable notifications</span>
            </label>
          </div>
          <div class="setting-group">
            <label class="setting-label">
              <input type="checkbox" id="smart-suggestions" ${this.settings.smartSuggestions ? 'checked' : ''}>
              <span>AI-powered smart suggestions</span>
            </label>
          </div>
          <div class="setting-group">
            <label class="setting-label">
              <input type="checkbox" id="system-updates" ${this.settings.systemUpdates ? 'checked' : ''}>
              <span>System and feature updates</span>
            </label>
          </div>
          <div class="setting-group">
            <label class="setting-label">
              <input type="checkbox" id="performance-alerts" ${this.settings.performanceAlerts ? 'checked' : ''}>
              <span>Performance alerts</span>
            </label>
          </div>
          <div class="setting-group">
            <label class="setting-label">
              <span>Auto-hide delay:</span>
              <select id="auto-hide-delay">
                <option value="3000" ${this.settings.autoHideDelay === 3000 ? 'selected' : ''}>3 seconds</option>
                <option value="5000" ${this.settings.autoHideDelay === 5000 ? 'selected' : ''}>5 seconds</option>
                <option value="8000" ${this.settings.autoHideDelay === 8000 ? 'selected' : ''}>8 seconds</option>
                <option value="0" ${this.settings.autoHideDelay === 0 ? 'selected' : ''}>Manual dismiss</option>
              </select>
            </label>
          </div>
        </div>
        <div class="settings-actions">
          <button class="btn-save-settings">Save Settings</button>
          <button class="btn-test-notification">Test Notification</button>
        </div>
      </div>
    `;

    document.body.appendChild(settingsPanel);

    // Add CSS styles
    this.addStyles();
  }

  addStyles() {
    if (document.getElementById('smart-notifications-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'smart-notifications-styles';
    styles.textContent = `
      .smart-notifications-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
        pointer-events: none;
      }

      .smart-notification {
        background: var(--container-bg, rgba(255, 255, 255, 0.95));
        border: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        margin-bottom: 12px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        pointer-events: auto;
        position: relative;
        overflow: hidden;
      }

      .smart-notification.show {
        opacity: 1;
        transform: translateX(0);
      }

      .smart-notification.hide {
        opacity: 0;
        transform: translateX(100%);
      }

      .notification-content {
        padding: 16px;
        display: flex;
        align-items: flex-start;
        gap: 12px;
      }

      .notification-icon {
        font-size: 1.5rem;
        flex-shrink: 0;
        margin-top: 2px;
      }

      .notification-body {
        flex: 1;
        min-width: 0;
      }

      .notification-title {
        font-weight: 600;
        color: var(--text-primary, #333);
        margin: 0 0 4px 0;
        font-size: 0.95rem;
      }

      .notification-message {
        color: var(--text-secondary, #666);
        font-size: 0.9rem;
        line-height: 1.4;
        margin: 0;
      }

      .notification-actions {
        margin-top: 12px;
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .notification-action {
        padding: 4px 12px;
        border: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
        border-radius: 6px;
        background: var(--container-bg, white);
        color: var(--text-primary, #333);
        cursor: pointer;
        font-size: 0.8rem;
        transition: all 0.2s ease;
      }

      .notification-action:hover {
        background: var(--feature-bg, rgba(102, 126, 234, 0.1));
      }

      .notification-action.primary {
        background: linear-gradient(135deg, var(--button-gradient-start, #667eea), var(--button-gradient-end, #764ba2));
        color: white;
        border: none;
      }

      .notification-close {
        position: absolute;
        top: 8px;
        right: 8px;
        background: none;
        border: none;
        color: var(--text-tertiary, #888);
        cursor: pointer;
        font-size: 1.2rem;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s ease;
      }

      .notification-close:hover {
        background: var(--feature-bg, rgba(102, 126, 234, 0.1));
        color: var(--text-primary, #333);
      }

      .notification-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(135deg, var(--button-gradient-start, #667eea), var(--button-gradient-end, #764ba2));
        transition: width linear;
      }

      /* Notification types */
      .smart-notification.success {
        border-left: 4px solid #10b981;
      }

      .smart-notification.info {
        border-left: 4px solid #3b82f6;
      }

      .smart-notification.warning {
        border-left: 4px solid #f59e0b;
      }

      .smart-notification.error {
        border-left: 4px solid #ef4444;
      }

      .smart-notification.ai-suggestion {
        border-left: 4px solid #8b5cf6;
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(168, 85, 247, 0.05));
      }

      /* Settings Panel */
      .notification-settings-panel {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--container-bg, white);
        border: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
        border-radius: 15px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        max-width: 500px;
        width: 90%;
        z-index: 10001;
        backdrop-filter: blur(10px);
      }

      .notification-settings-content {
        padding: 24px;
      }

      .settings-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }

      .settings-header h3 {
        margin: 0;
        color: var(--text-primary, #333);
        font-size: 1.3rem;
      }

      .settings-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--text-secondary, #666);
        cursor: pointer;
        padding: 0;
      }

      .settings-close:hover {
        color: var(--text-primary, #333);
      }

      .setting-group {
        margin-bottom: 16px;
      }

      .setting-label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        color: var(--text-primary, #333);
      }

      .setting-label input[type="checkbox"] {
        margin: 0;
      }

      .setting-label select {
        margin-left: auto;
        padding: 4px 8px;
        border: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
        border-radius: 4px;
        background: var(--container-bg, white);
        color: var(--text-primary, #333);
      }

      .settings-actions {
        display: flex;
        gap: 12px;
        margin-top: 24px;
        justify-content: flex-end;
      }

      .settings-actions button {
        padding: 8px 16px;
        border: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
        border-radius: 6px;
        background: var(--container-bg, white);
        color: var(--text-primary, #333);
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .btn-save-settings {
        background: linear-gradient(135deg, var(--button-gradient-start, #667eea), var(--button-gradient-end, #764ba2)) !important;
        color: white !important;
        border: none !important;
      }

      .settings-actions button:hover {
        background: var(--feature-bg, rgba(102, 126, 234, 0.1));
      }

      .btn-save-settings:hover {
        transform: translateY(-1px);
      }

      /* Responsive design */
      @media (max-width: 768px) {
        .smart-notifications-container {
          left: 20px;
          right: 20px;
          max-width: none;
        }

        .smart-notification {
          transform: translateY(-100%);
        }

        .smart-notification.show {
          transform: translateY(0);
        }

        .smart-notification.hide {
          transform: translateY(-100%);
        }

        .notification-settings-panel {
          max-width: calc(100vw - 40px);
        }
      }

      /* Dark theme support */
      [data-theme="dark"] .smart-notification,
      [data-theme="dark"] .notification-settings-panel {
        background: var(--container-bg, rgba(30, 30, 30, 0.95));
      }

      [data-theme="dark"] .notification-action,
      [data-theme="dark"] .setting-label select,
      [data-theme="dark"] .settings-actions button {
        background: var(--container-bg, rgba(40, 40, 40, 0.8));
        color: var(--text-primary, #fff);
      }

      /* High contrast support */
      @media (prefers-contrast: high) {
        .smart-notification {
          border-width: 2px;
        }
      }

      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        .smart-notification,
        .notification-close,
        .notification-action {
          transition: none !important;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  setupEventListeners() {
    // Settings panel controls
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('settings-close')) {
        this.hideSettings();
      } else if (e.target.classList.contains('btn-save-settings')) {
        this.saveSettings();
      } else if (e.target.classList.contains('btn-test-notification')) {
        this.testNotification();
      }
    });

    // Notification controls
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('notification-close')) {
        const notification = e.target.closest('.smart-notification');
        if (notification) {
          this.hideNotification(notification);
        }
      } else if (e.target.classList.contains('notification-action')) {
        const action = e.target.dataset.action;
        if (action) {
          this.handleNotificationAction(action, e.target);
        }
      }
    });

    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n' && e.shiftKey) {
        e.preventDefault();
        this.showSettings();
      }
    });

    // Page visibility change to pause/resume notifications
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseNotifications();
      } else {
        this.resumeNotifications();
      }
    });
  }

  startIntelligentMonitoring() {
    // Monitor user interactions and provide contextual suggestions
    this.monitorUserBehavior();
    this.monitorPerformance();
    this.monitorFeatureDiscovery();
    
    // Schedule periodic smart suggestions
    setInterval(() => {
      this.generateSmartSuggestions();
    }, 30000); // Every 30 seconds
  }

  monitorUserBehavior() {
    let interactionCount = 0;
    let lastInteractionTime = Date.now();

    document.addEventListener('click', () => {
      interactionCount++;
      lastInteractionTime = Date.now();

      // Suggest shortcuts after many clicks
      if (interactionCount === 10) {
        this.notify({
          type: 'ai-suggestion',
          title: '💡 Pro Tip: Keyboard Shortcuts',
          message: 'Did you know you can use keyboard shortcuts? Press Ctrl+/ for help or Ctrl+K for search.',
          actions: [
            { text: 'Show Shortcuts', action: 'show-shortcuts', primary: true },
            { text: 'Dismiss', action: 'dismiss' }
          ]
        });
      }
    });

    // Check for idle users
    setInterval(() => {
      const idleTime = Date.now() - lastInteractionTime;
      if (idleTime > 60000 && this.settings.smartSuggestions) { // 1 minute idle
        this.suggestEngagementFeature();
      }
    }, 30000);
  }

  monitorPerformance() {
    if (!this.settings.performanceAlerts) return;

    // Monitor page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation && navigation.loadEventEnd > 3000) {
          this.notify({
            type: 'warning',
            title: '⚡ Performance Notice',
            message: 'Page load took longer than expected. Consider checking your internet connection.',
            actions: [
              { text: 'Performance Tips', action: 'performance-tips', primary: true }
            ]
          });
        }
      }, 1000);
    });

    // Monitor memory usage (if available)
    if ('memory' in performance) {
      setInterval(() => {
        const memInfo = performance.memory;
        if (memInfo.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB
          this.notify({
            type: 'info',
            title: '🧠 Memory Usage',
            message: 'High memory usage detected. Refreshing the page might improve performance.',
            actions: [
              { text: 'Refresh Page', action: 'refresh-page', primary: true },
              { text: 'Ignore', action: 'dismiss' }
            ]
          });
        }
      }, 60000); // Check every minute
    }
  }

  monitorFeatureDiscovery() {
    const featureElements = [
      { selector: '.ai-suggestions-panel', feature: 'AI Suggestions' },
      { selector: '.search-system-trigger', feature: 'Universal Search' },
      { selector: '.accessibility-panel-trigger', feature: 'Accessibility Panel' },
      { selector: '.theme-toggle', feature: 'Theme Toggle' }
    ];

    featureElements.forEach(({ selector, feature }) => {
      const element = document.querySelector(selector);
      if (element) {
        let hasInteracted = false;
        
        element.addEventListener('click', () => {
          hasInteracted = true;
        });

        // Suggest unused features after some time
        setTimeout(() => {
          if (!hasInteracted && this.settings.smartSuggestions) {
            this.notify({
              type: 'ai-suggestion',
              title: `✨ Discover ${feature}`,
              message: `You haven't tried ${feature} yet. It's a powerful feature that can enhance your experience!`,
              actions: [
                { text: 'Try It', action: `try-${feature.toLowerCase().replace(' ', '-')}`, primary: true },
                { text: 'Later', action: 'dismiss' }
              ]
            });
          }
        }, 45000); // 45 seconds
      }
    });
  }

  generateSmartSuggestions() {
    if (!this.settings.smartSuggestions || !this.isPageVisible()) return;

    const suggestions = [
      {
        condition: () => !localStorage.getItem('tutorial-progress'),
        notification: {
          type: 'ai-suggestion',
          title: '🎓 New Here?',
          message: 'Take a guided tour to discover all the amazing features CocoPilot has to offer!',
          actions: [
            { text: 'Start Tour', action: 'start-tutorial', primary: true },
            { text: 'Explore Alone', action: 'dismiss' }
          ]
        }
      },
      {
        condition: () => window.innerWidth < 768 && !localStorage.getItem('mobile-tips-shown'),
        notification: {
          type: 'info',
          title: '📱 Mobile Tips',
          message: 'Swipe gestures and touch-friendly features are available for mobile users!',
          actions: [
            { text: 'Show Tips', action: 'mobile-tips', primary: true },
            { text: 'Got It', action: 'dismiss-mobile-tips' }
          ]
        }
      },
      {
        condition: () => this.getTimeOfDay() === 'evening',
        notification: {
          type: 'ai-suggestion',
          title: '🌙 Evening Coding',
          message: 'Consider switching to dark mode for comfortable evening coding.',
          actions: [
            { text: 'Switch to Dark', action: 'toggle-dark-mode', primary: true },
            { text: 'Keep Light', action: 'dismiss' }
          ]
        }
      }
    ];

    const applicableSuggestion = suggestions.find(s => s.condition());
    if (applicableSuggestion) {
      this.notify(applicableSuggestion.notification);
    }
  }

  notify(options) {
    if (!this.settings.enabled) return;

    const notification = this.createNotification(options);
    this.showNotification(notification);
  }

  createNotification(options) {
    const notificationId = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const notification = document.createElement('div');
    notification.className = `smart-notification ${options.type || 'info'}`;
    notification.id = notificationId;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');

    let actionsHtml = '';
    if (options.actions && options.actions.length > 0) {
      actionsHtml = `
        <div class="notification-actions">
          ${options.actions.map(action => `
            <button class="notification-action ${action.primary ? 'primary' : ''}" 
                    data-action="${action.action}">${action.text}</button>
          `).join('')}
        </div>
      `;
    }

    notification.innerHTML = `
      <button class="notification-close" aria-label="Close notification">×</button>
      <div class="notification-content">
        <div class="notification-icon">${this.getNotificationIcon(options.type)}</div>
        <div class="notification-body">
          <div class="notification-title">${options.title}</div>
          <div class="notification-message">${options.message}</div>
          ${actionsHtml}
        </div>
      </div>
      ${options.progress !== false ? '<div class="notification-progress"></div>' : ''}
    `;

    return notification;
  }

  showNotification(notification) {
    const container = document.getElementById('smart-notifications-container');
    if (!container) return;

    // Remove old notifications if we have too many
    const existingNotifications = container.querySelectorAll('.smart-notification');
    if (existingNotifications.length >= this.maxNotifications) {
      this.hideNotification(existingNotifications[0]);
    }

    container.appendChild(notification);

    // Trigger show animation
    requestAnimationFrame(() => {
      notification.classList.add('show');
    });

    // Auto-hide if configured
    if (this.settings.autoHideDelay > 0) {
      this.startAutoHideTimer(notification);
    }

    // Store in history
    this.notifications.push({
      id: notification.id,
      timestamp: new Date().toISOString(),
      content: notification.innerHTML
    });

    // Limit history
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(-25);
    }
  }

  hideNotification(notification) {
    if (!notification) return;

    notification.classList.add('hide');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  startAutoHideTimer(notification) {
    const progressBar = notification.querySelector('.notification-progress');
    
    if (progressBar) {
      progressBar.style.width = '100%';
      progressBar.style.transitionDuration = `${this.settings.autoHideDelay}ms`;
      
      requestAnimationFrame(() => {
        progressBar.style.width = '0%';
      });
    }

    setTimeout(() => {
      this.hideNotification(notification);
    }, this.settings.autoHideDelay);
  }

  getNotificationIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
      'ai-suggestion': '🤖'
    };
    return icons[type] || icons.info;
  }

  handleNotificationAction(action, buttonElement) {
    switch (action) {
      case 'dismiss':
        const notification = buttonElement.closest('.smart-notification');
        this.hideNotification(notification);
        break;
      
      case 'show-shortcuts':
        // Trigger help system
        if (window.helpSystem) {
          window.helpSystem.showShortcuts();
        }
        break;
      
      case 'start-tutorial':
        // Trigger tutorial system
        if (window.interactiveTutorial) {
          window.interactiveTutorial.showLauncher();
        }
        break;
      
      case 'toggle-dark-mode':
        // Toggle theme
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
          themeToggle.click();
        }
        break;
      
      case 'refresh-page':
        window.location.reload();
        break;
      
      case 'performance-tips':
        this.showPerformanceTips();
        break;
      
      case 'mobile-tips':
        this.showMobileTips();
        break;
      
      case 'dismiss-mobile-tips':
        localStorage.setItem('mobile-tips-shown', 'true');
        break;
      
      default:
        console.log('Notification action:', action);
    }
  }

  showPerformanceTips() {
    this.notify({
      type: 'info',
      title: '⚡ Performance Tips',
      message: 'Clear browser cache, close unused tabs, check internet connection, and consider using an ad blocker for better performance.',
      actions: [
        { text: 'Got It', action: 'dismiss', primary: true }
      ]
    });
  }

  showMobileTips() {
    this.notify({
      type: 'info',
      title: '📱 Mobile Features',
      message: 'Use pinch to zoom, swipe gestures for navigation, and tap-and-hold for context menus. All features are touch-optimized!',
      actions: [
        { text: 'Thanks', action: 'dismiss', primary: true }
      ]
    });
  }

  showWelcomeNotification() {
    if (!this.isFirstTimeUser()) return;

    this.notify({
      type: 'ai-suggestion',
      title: '👋 Welcome to CocoPilot!',
      message: 'Discover the future of AI-driven development. This repository evolves and improves itself daily!',
      actions: [
        { text: 'Take Tour', action: 'start-tutorial', primary: true },
        { text: 'Explore', action: 'dismiss' }
      ]
    });
  }

  showSettings() {
    const panel = document.getElementById('notification-settings-panel');
    if (panel) {
      panel.style.display = 'block';
    }
  }

  hideSettings() {
    const panel = document.getElementById('notification-settings-panel');
    if (panel) {
      panel.style.display = 'none';
    }
  }

  saveSettings() {
    const enabled = document.getElementById('enable-notifications')?.checked || false;
    const smartSuggestions = document.getElementById('smart-suggestions')?.checked || false;
    const systemUpdates = document.getElementById('system-updates')?.checked || false;
    const performanceAlerts = document.getElementById('performance-alerts')?.checked || false;
    const autoHideDelay = parseInt(document.getElementById('auto-hide-delay')?.value || '5000');

    this.settings = {
      enabled,
      smartSuggestions,
      systemUpdates,
      performanceAlerts,
      autoHideDelay
    };

    this.autoHideDelay = autoHideDelay;

    this.saveSettingsToStorage();
    this.hideSettings();

    this.notify({
      type: 'success',
      title: '✅ Settings Saved',
      message: 'Your notification preferences have been updated successfully.',
      actions: [
        { text: 'Great', action: 'dismiss', primary: true }
      ]
    });
  }

  testNotification() {
    this.notify({
      type: 'info',
      title: '🧪 Test Notification',
      message: 'This is a test notification to show you how notifications appear and behave.',
      actions: [
        { text: 'Cool!', action: 'dismiss', primary: true }
      ]
    });
  }

  loadSettings() {
    try {
      const stored = localStorage.getItem('smart-notification-settings');
      return stored ? JSON.parse(stored) : {
        enabled: true,
        smartSuggestions: true,
        systemUpdates: true,
        performanceAlerts: true,
        autoHideDelay: 5000
      };
    } catch (error) {
      return {
        enabled: true,
        smartSuggestions: true,
        systemUpdates: true,
        performanceAlerts: true,
        autoHideDelay: 5000
      };
    }
  }

  saveSettingsToStorage() {
    try {
      localStorage.setItem('smart-notification-settings', JSON.stringify(this.settings));
    } catch (error) {
      console.warn('Could not save notification settings:', error);
    }
  }

  // Utility methods
  isFirstTimeUser() {
    return !localStorage.getItem('tutorial-progress') && !localStorage.getItem('user-visited-before');
  }

  isPageVisible() {
    return !document.hidden;
  }

  getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 6) return 'night';
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  }

  pauseNotifications() {
    this.paused = true;
  }

  resumeNotifications() {
    this.paused = false;
  }

  // Public API methods
  showNotificationSettings() {
    this.showSettings();
  }

  createCustomNotification(title, message, type = 'info', actions = []) {
    this.notify({ title, message, type, actions });
  }

  clearAllNotifications() {
    const container = document.getElementById('smart-notifications-container');
    if (container) {
      const notifications = container.querySelectorAll('.smart-notification');
      notifications.forEach(notification => this.hideNotification(notification));
    }
  }

  getNotificationHistory() {
    return [...this.notifications];
  }
}

// Initialize the Smart Notification System when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.smartNotificationSystem = new SmartNotificationSystem();
  });
} else {
  window.smartNotificationSystem = new SmartNotificationSystem();
}

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SmartNotificationSystem;
}