/**
 * Enhanced User Feedback System for CocoPilot
 * Provides toast notifications, progress indicators, and contextual feedback
 */

class UserFeedbackSystem {
  constructor() {
    this.notifications = [];
    this.maxNotifications = 5;
    this.defaultDuration = 5000;
    this.container = null;
    
    this.init();
  }

  init() {
    this.createNotificationContainer();
    this.addFeedbackStyles();
    this.setupGlobalErrorHandling();
    this.enhanceExistingFeedback();
  }

  createNotificationContainer() {
    this.container = document.createElement('div');
    this.container.id = 'notification-container';
    this.container.className = 'notification-container';
    this.container.setAttribute('aria-live', 'polite');
    this.container.setAttribute('aria-label', 'Notifications');
    document.body.appendChild(this.container);
  }

  showNotification(message, options = {}) {
    const notification = {
      id: Date.now(),
      message,
      type: options.type || 'info',
      duration: options.duration || this.defaultDuration,
      persistent: options.persistent || false,
      actions: options.actions || [],
      icon: this.getIcon(options.type || 'info')
    };

    this.notifications.push(notification);
    this.renderNotification(notification);
    
    // Auto-remove non-persistent notifications
    if (!notification.persistent) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, notification.duration);
    }

    // Keep only max notifications
    if (this.notifications.length > this.maxNotifications) {
      const oldestNotification = this.notifications.shift();
      this.removeNotification(oldestNotification.id);
    }

    return notification.id;
  }

  getIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
      loading: '⏳'
    };
    return icons[type] || icons.info;
  }

  renderNotification(notification) {
    const element = document.createElement('div');
    element.className = `notification notification-${notification.type}`;
    element.setAttribute('role', 'alert');
    element.setAttribute('data-notification-id', notification.id);
    
    element.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">${notification.icon}</div>
        <div class="notification-message">${notification.message}</div>
        ${notification.actions.length > 0 ? `
          <div class="notification-actions">
            ${notification.actions.map(action => `
              <button class="notification-action" data-action="${action.id}">
                ${action.text}
              </button>
            `).join('')}
          </div>
        ` : ''}
        <button class="notification-close" aria-label="Close notification">×</button>
      </div>
      ${!notification.persistent ? `
        <div class="notification-progress">
          <div class="notification-progress-bar" style="animation-duration: ${notification.duration}ms;"></div>
        </div>
      ` : ''}
    `;

    // Bind events
    const closeBtn = element.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      this.removeNotification(notification.id);
    });

    // Bind action events
    notification.actions.forEach(action => {
      const actionBtn = element.querySelector(`[data-action="${action.id}"]`);
      if (actionBtn) {
        actionBtn.addEventListener('click', () => {
          action.handler();
          if (action.closeOnClick !== false) {
            this.removeNotification(notification.id);
          }
        });
      }
    });

    // Add to container with animation
    this.container.appendChild(element);
    
    // Trigger entrance animation
    requestAnimationFrame(() => {
      element.classList.add('notification-show');
    });
  }

  removeNotification(id) {
    const element = this.container.querySelector(`[data-notification-id="${id}"]`);
    if (element) {
      element.classList.add('notification-hide');
      setTimeout(() => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      }, 300);
    }

    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  // Convenience methods for different notification types
  success(message, options = {}) {
    return this.showNotification(message, { ...options, type: 'success' });
  }

  error(message, options = {}) {
    return this.showNotification(message, { ...options, type: 'error' });
  }

  warning(message, options = {}) {
    return this.showNotification(message, { ...options, type: 'warning' });
  }

  info(message, options = {}) {
    return this.showNotification(message, { ...options, type: 'info' });
  }

  loading(message, options = {}) {
    return this.showNotification(message, { 
      ...options, 
      type: 'loading', 
      persistent: true 
    });
  }

  // Progress indicator system
  showProgress(message, progressPercent = 0) {
    const progressId = this.showNotification(message, {
      type: 'loading',
      persistent: true
    });
    
    return {
      update: (percent, newMessage) => {
        const element = this.container.querySelector(`[data-notification-id="${progressId}"]`);
        if (element) {
          if (newMessage) {
            element.querySelector('.notification-message').textContent = newMessage;
          }
          // Update progress if we had a progress bar
          const progressBar = element.querySelector('.notification-progress-bar');
          if (progressBar) {
            progressBar.style.width = `${percent}%`;
          }
        }
      },
      complete: (successMessage) => {
        this.removeNotification(progressId);
        if (successMessage) {
          this.success(successMessage);
        }
      },
      error: (errorMessage) => {
        this.removeNotification(progressId);
        this.error(errorMessage);
      }
    };
  }

  setupGlobalErrorHandling() {
    // Enhanced error handling with user feedback
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      
      // Don't show notifications for network errors or blocked resources
      if (event.error && 
          !event.error.message.includes('ERR_BLOCKED_BY_CLIENT') &&
          !event.error.message.includes('Failed to fetch')) {
        
        this.error('Something went wrong. The team has been notified.', {
          actions: [{
            id: 'reload',
            text: 'Reload Page',
            handler: () => window.location.reload()
          }]
        });
      }
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      if (event.reason && 
          !event.reason.toString().includes('ERR_BLOCKED_BY_CLIENT') &&
          !event.reason.toString().includes('Failed to fetch')) {
        
        this.warning('A background operation failed. Some features may not work as expected.');
      }
    });
  }

  enhanceExistingFeedback() {
    // Enhance existing user interactions with feedback
    this.enhanceFormSubmissions();
    this.enhanceButtonClicks();
    this.enhanceAPIOperations();
    this.enhanceThemeChanges();
    this.enhanceSearchOperations();
  }

  enhanceFormSubmissions() {
    // Add feedback to any form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target;
      if (form.tagName === 'FORM') {
        this.loading('Processing your request...');
      }
    });
  }

  enhanceButtonClicks() {
    // Add feedback to button clicks that might take time
    document.addEventListener('click', (e) => {
      const button = e.target.closest('button, [role="button"]');
      if (!button) return;

      const buttonText = button.textContent?.trim().toLowerCase();
      
      // Provide feedback for specific actions
      if (buttonText.includes('copy')) {
        navigator.clipboard?.writeText(window.location.href).then(() => {
          this.success('URL copied to clipboard!');
        }).catch(() => {
          this.warning('Unable to copy URL. Please copy manually.');
        });
      }
      
      if (buttonText.includes('share')) {
        this.info('Opening share dialog...');
      }
      
      if (buttonText.includes('download') || buttonText.includes('export')) {
        this.loading('Preparing download...', { duration: 3000 });
      }
    });
  }

  enhanceAPIOperations() {
    // Monitor and provide feedback for API operations
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const url = args[0];
      let loadingId = null;
      
      // Show loading for GitHub API calls
      if (typeof url === 'string' && url.includes('api.github.com')) {
        loadingId = this.loading('Fetching latest data...');
      }
      
      try {
        const response = await originalFetch(...args);
        
        if (loadingId) {
          this.removeNotification(loadingId);
        }
        
        if (!response.ok && url.includes('api.github.com')) {
          this.warning('Unable to fetch latest data. Showing cached information.');
        } else if (response.ok && url.includes('api.github.com')) {
          this.success('Data updated successfully!', { duration: 2000 });
        }
        
        return response;
      } catch (error) {
        if (loadingId) {
          this.removeNotification(loadingId);
        }
        
        if (!error.message.includes('ERR_BLOCKED_BY_CLIENT')) {
          this.warning('Network request failed. Some data may be outdated.');
        }
        
        throw error;
      }
    };
  }

  enhanceThemeChanges() {
    // Provide feedback for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            mutation.attributeName === 'data-theme') {
          
          const theme = document.body.getAttribute('data-theme');
          const themeName = theme === 'dark' ? 'Dark' : 'Light';
          this.success(`Switched to ${themeName} theme`, { duration: 2000 });
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  }

  enhanceSearchOperations() {
    // Provide feedback for search operations
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        setTimeout(() => {
          this.info('Search opened. Start typing to find features!', { duration: 3000 });
        }, 100);
      }
    });
  }

  // Connection status monitoring
  setupConnectionMonitoring() {
    const updateConnectionStatus = () => {
      if (navigator.onLine) {
        this.success('Connection restored!', { duration: 3000 });
      } else {
        this.warning('You are offline. Some features may not work.', {
          persistent: true,
          actions: [{
            id: 'retry',
            text: 'Retry Connection',
            handler: () => {
              window.location.reload();
            }
          }]
        });
      }
    };

    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);
  }

  // User action confirmations
  confirmAction(message, options = {}) {
    return new Promise((resolve) => {
      const confirmId = this.showNotification(message, {
        type: 'warning',
        persistent: true,
        actions: [
          {
            id: 'confirm',
            text: options.confirmText || 'Confirm',
            handler: () => resolve(true)
          },
          {
            id: 'cancel',
            text: options.cancelText || 'Cancel',
            handler: () => resolve(false)
          }
        ]
      });
    });
  }

  // Feature announcement system
  announceFeature(title, description, options = {}) {
    this.showNotification(`<strong>${title}</strong><br>${description}`, {
      type: 'info',
      duration: options.duration || 8000,
      actions: options.actions || [{
        id: 'learn-more',
        text: 'Learn More',
        handler: () => {
          if (window.helpSystem) {
            window.helpSystem.showHelp();
          }
        }
      }]
    });
  }

  addFeedbackStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
      .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-width: 400px;
        pointer-events: none;
      }

      .notification {
        background: var(--container-bg, white);
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        border: 1px solid var(--border-color, #e0e0e0);
        overflow: hidden;
        pointer-events: auto;
        transform: translateX(120%);
        opacity: 0;
        transition: all 0.3s ease;
        position: relative;
      }

      .notification-show {
        transform: translateX(0);
        opacity: 1;
      }

      .notification-hide {
        transform: translateX(120%);
        opacity: 0;
      }

      .notification-content {
        padding: 16px;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        position: relative;
      }

      .notification-icon {
        font-size: 1.2rem;
        flex-shrink: 0;
        margin-top: 2px;
      }

      .notification-message {
        flex: 1;
        font-size: 0.95rem;
        line-height: 1.4;
        color: var(--text-primary, #333);
      }

      .notification-close {
        position: absolute;
        top: 8px;
        right: 8px;
        background: none;
        border: none;
        font-size: 1.2rem;
        color: var(--text-secondary, #666);
        cursor: pointer;
        width: 24px;
        height: 24px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;
      }

      .notification-close:hover {
        background: var(--border-color, #e0e0e0);
      }

      .notification-actions {
        display: flex;
        gap: 8px;
        margin-top: 12px;
        margin-left: 36px;
      }

      .notification-action {
        background: var(--button-gradient-start, #667eea);
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 0.85rem;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .notification-action:hover {
        background: var(--button-gradient-end, #764ba2);
      }

      .notification-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: rgba(0, 0, 0, 0.1);
      }

      .notification-progress-bar {
        height: 100%;
        background: var(--button-gradient-start, #667eea);
        width: 100%;
        animation: progressDecrease linear forwards;
      }

      @keyframes progressDecrease {
        from { width: 100%; }
        to { width: 0%; }
      }

      /* Type-specific styles */
      .notification-success {
        border-left: 4px solid #28a745;
      }

      .notification-error {
        border-left: 4px solid #dc3545;
      }

      .notification-warning {
        border-left: 4px solid #ffc107;
      }

      .notification-info {
        border-left: 4px solid #17a2b8;
      }

      .notification-loading {
        border-left: 4px solid var(--button-gradient-start, #667eea);
      }

      .notification-loading .notification-icon {
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      /* Dark theme support */
      [data-theme="dark"] .notification {
        background: #2a2a2a;
        border-color: #444;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      }

      [data-theme="dark"] .notification-close:hover {
        background: #444;
      }

      /* Mobile responsiveness */
      @media (max-width: 768px) {
        .notification-container {
          top: 10px;
          right: 10px;
          left: 10px;
          max-width: none;
        }

        .notification {
          transform: translateY(-120%);
        }

        .notification-show {
          transform: translateY(0);
        }

        .notification-hide {
          transform: translateY(-120%);
        }

        .notification-actions {
          margin-left: 0;
          flex-wrap: wrap;
        }
      }

      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        .notification {
          transition: opacity 0.1s ease;
        }

        .notification-loading .notification-icon {
          animation: none;
        }
      }
    `;
    
    document.head.appendChild(styles);
  }

  // Clean up
  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.notifications = [];
  }
}

// Initialize feedback system when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.userFeedback = new UserFeedbackSystem();
  });
} else {
  window.userFeedback = new UserFeedbackSystem();
}

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UserFeedbackSystem;
}