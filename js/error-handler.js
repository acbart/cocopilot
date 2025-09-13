/**
 * Enhanced Error Handling and User Feedback System
 * Provides comprehensive error monitoring, reporting, and user-friendly feedback
 */

class ErrorHandler {
  constructor() {
    this.errorQueue = [];
    this.maxErrors = 10;
    this.notificationTimeout = 5000;
    this.retryAttempts = new Map();
    this.maxRetries = 3;
    this.activeNotifications = new Map(); // Track active notifications to prevent duplicates
    this.notificationDelay = 1000; // Minimum delay between notifications
    this.lastNotificationTime = 0;
    
    this.init();
  }

  init() {
    this.setupGlobalErrorHandlers();
    this.setupUnhandledPromiseRejectionHandler();
    this.setupNetworkErrorHandler();
    this.addErrorReportingStyles();
  }

  /**
   * Setup global error handlers
   */
  setupGlobalErrorHandlers() {
    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        timestamp: new Date().toISOString()
      });
    });

    // Handle resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.handleError({
          type: 'resource',
          message: `Failed to load resource: ${event.target.src || event.target.href}`,
          element: event.target.tagName,
          timestamp: new Date().toISOString()
        });
      }
    }, true);
  }

  /**
   * Setup unhandled promise rejection handler
   */
  setupUnhandledPromiseRejectionHandler() {
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: 'promise',
        message: event.reason?.message || String(event.reason),
        stack: event.reason?.stack,
        timestamp: new Date().toISOString()
      });
    });
  }

  /**
   * Setup network error handler for fetch requests
   */
  setupNetworkErrorHandler() {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        // Log failed HTTP requests
        if (!response.ok) {
          this.handleError({
            type: 'network',
            message: `HTTP ${response.status}: ${response.statusText}`,
            url: args[0],
            status: response.status,
            timestamp: new Date().toISOString()
          });
        }
        
        return response;
      } catch (error) {
        this.handleError({
          type: 'network',
          message: `Network request failed: ${error.message}`,
          url: args[0],
          error: error,
          timestamp: new Date().toISOString()
        });
        throw error;
      }
    };
  }

  /**
   * Handle and process errors
   */
  handleError(errorInfo) {
    // Add to error queue
    this.errorQueue.push(errorInfo);
    
    // Limit queue size
    if (this.errorQueue.length > this.maxErrors) {
      this.errorQueue.shift();
    }

    // Log to console in development
    if (this.isDevelopment()) {
      console.error('Error Handler:', errorInfo);
    }

    // Show user-friendly notification for critical errors
    if (this.isCriticalError(errorInfo)) {
      this.showErrorNotification(errorInfo);
    }

    // Attempt automatic recovery for certain errors
    this.attemptErrorRecovery(errorInfo);
  }

  /**
   * Determine if error is critical and should be shown to user
   */
  isCriticalError(errorInfo) {
    const criticalPatterns = [
      /network/i,
      /failed to fetch/i,
      /load resource/i,
      /script error/i
    ];

    return criticalPatterns.some(pattern => 
      pattern.test(errorInfo.message) || pattern.test(errorInfo.type)
    );
  }

  /**
   * Show user-friendly error notification
   */
  showErrorNotification(errorInfo) {
    // Create a unique key for this type of error to prevent duplicates
    const errorKey = `${errorInfo.type}-${this.getErrorTitle(errorInfo)}`;
    const now = Date.now();
    
    // Check if we already have an active notification for this error type
    if (this.activeNotifications.has(errorKey)) {
      console.log('Suppressing duplicate error notification:', errorKey);
      return;
    }
    
    // Rate limit notifications
    if (now - this.lastNotificationTime < this.notificationDelay) {
      console.log('Rate limiting error notification');
      return;
    }
    
    this.lastNotificationTime = now;
    
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.setAttribute('data-error-key', errorKey);
    notification.innerHTML = `
      <div class="error-content">
        <div class="error-icon">⚠️</div>
        <div class="error-details">
          <div class="error-title">${this.getErrorTitle(errorInfo)}</div>
          <div class="error-message">${this.getErrorMessage(errorInfo)}</div>
          ${this.getErrorActions(errorInfo)}
        </div>
        <button class="error-close" onclick="this.parentElement.remove(); window.errorHandler.removeActiveNotification('${errorKey}')">×</button>
      </div>
    `;

    document.body.appendChild(notification);
    
    // Track active notification
    this.activeNotifications.set(errorKey, notification);

    // Auto-remove after timeout
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
        this.removeActiveNotification(errorKey);
      }
    }, this.notificationTimeout);

    // Add animation
    requestAnimationFrame(() => {
      notification.classList.add('error-notification-visible');
    });
  }
  
  /**
   * Remove active notification tracking
   */
  removeActiveNotification(errorKey) {
    this.activeNotifications.delete(errorKey);
  }

  /**
   * Get user-friendly error title
   */
  getErrorTitle(errorInfo) {
    switch (errorInfo.type) {
      case 'network':
        return 'Connection Issue';
      case 'resource':
        return 'Resource Loading Error';
      case 'javascript':
        return 'Application Error';
      case 'promise':
        return 'Processing Error';
      default:
        return 'Unexpected Error';
    }
  }

  /**
   * Get user-friendly error message
   */
  getErrorMessage(errorInfo) {
    switch (errorInfo.type) {
      case 'network':
        if (errorInfo.message.includes('GitHub API') || errorInfo.url?.includes('github.com')) {
          return 'Unable to fetch repository data. This might be due to network restrictions or rate limiting.';
        }
        return 'Network connection issue. Please check your internet connection.';
      
      case 'resource':
        return 'Some resources failed to load. The page may not function correctly.';
      
      case 'javascript':
        return 'A script error occurred. The page should continue to work normally.';
      
      case 'promise':
        return 'A background operation failed. Some features may be temporarily unavailable.';
      
      default:
        return 'An unexpected error occurred. Please try refreshing the page.';
    }
  }

  /**
   * Get error action buttons
   */
  getErrorActions(errorInfo) {
    const actions = [];
    
    if (errorInfo.type === 'network') {
      actions.push('<button class="error-action" onclick="window.errorHandler.retryLastAction()">Retry</button>');
    }
    
    if (errorInfo.type === 'resource' || errorInfo.type === 'javascript') {
      actions.push('<button class="error-action" onclick="window.location.reload()">Refresh Page</button>');
    }

    return actions.length > 0 ? 
      `<div class="error-actions">${actions.join('')}</div>` : 
      '';
  }

  /**
   * Attempt automatic error recovery
   */
  attemptErrorRecovery(errorInfo) {
    switch (errorInfo.type) {
      case 'network':
        this.scheduleNetworkRetry(errorInfo);
        break;
      
      case 'resource':
        this.attemptResourceReload(errorInfo);
        break;
    }
  }

  /**
   * Schedule network request retry
   */
  scheduleNetworkRetry(errorInfo) {
    const url = errorInfo.url;
    if (!url) return;

    const retryCount = this.retryAttempts.get(url) || 0;
    if (retryCount >= this.maxRetries) return;

    this.retryAttempts.set(url, retryCount + 1);
    
    // Exponential backoff
    const delay = Math.pow(2, retryCount) * 1000;
    
    setTimeout(() => {
      if (url.includes('api.github.com')) {
        // Trigger repository stats refresh
        if (window.fetchRepoStats) {
          window.fetchRepoStats();
        }
      }
    }, delay);
  }

  /**
   * Attempt to reload failed resources
   */
  attemptResourceReload(errorInfo) {
    if (errorInfo.element === 'IMG') {
      // Find and retry failed images
      const images = document.querySelectorAll('img[src]');
      images.forEach(img => {
        if (img.src && !img.complete) {
          const originalSrc = img.src;
          img.src = '';
          setTimeout(() => {
            img.src = originalSrc;
          }, 1000);
        }
      });
    }
  }

  /**
   * Retry last failed action
   */
  retryLastAction() {
    const lastError = this.errorQueue[this.errorQueue.length - 1];
    if (lastError && lastError.type === 'network') {
      if (lastError.url?.includes('api.github.com')) {
        if (window.fetchRepoStats) {
          window.fetchRepoStats();
        }
      }
    }
  }

  /**
   * Get error report for debugging
   */
  getErrorReport() {
    return {
      errors: this.errorQueue,
      retryAttempts: Object.fromEntries(this.retryAttempts),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
  }

  /**
   * Clear error queue and active notifications
   */
  clearErrors() {
    this.errorQueue = [];
    this.retryAttempts.clear();
    
    // Remove all active error notifications
    this.activeNotifications.forEach((notification, key) => {
      if (notification.parentElement) {
        notification.remove();
      }
    });
    this.activeNotifications.clear();
  }

  /**
   * Check if running in development mode
   */
  isDevelopment() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' ||
           window.location.hostname.includes('dev');
  }

  /**
   * Add error notification styles
   */
  addErrorReportingStyles() {
    if (document.getElementById('error-handler-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'error-handler-styles';
    style.textContent = `
      .error-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 400px;
        background: #ff4757;
        color: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(255, 71, 87, 0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .error-notification-visible {
        transform: translateX(0);
      }

      .error-content {
        display: flex;
        align-items: flex-start;
        padding: 15px;
        gap: 12px;
      }

      .error-icon {
        font-size: 1.2em;
        flex-shrink: 0;
        margin-top: 2px;
      }

      .error-details {
        flex: 1;
        min-width: 0;
      }

      .error-title {
        font-weight: 600;
        font-size: 0.95em;
        margin-bottom: 4px;
      }

      .error-message {
        font-size: 0.85em;
        opacity: 0.9;
        line-height: 1.4;
        margin-bottom: 8px;
      }

      .error-actions {
        display: flex;
        gap: 8px;
        margin-top: 8px;
      }

      .error-action {
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8em;
        cursor: pointer;
        transition: background 0.2s ease;
      }

      .error-action:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      .error-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2em;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.2s ease;
        flex-shrink: 0;
      }

      .error-close:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      /* Dark theme adjustments */
      [data-theme="dark"] .error-notification {
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      }

      /* Mobile responsiveness */
      @media (max-width: 480px) {
        .error-notification {
          left: 10px;
          right: 10px;
          max-width: none;
        }
      }

      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        .error-notification {
          transition: none;
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Create error boundary for React-like error handling
   */
  createErrorBoundary(element, fallbackContent = 'Something went wrong') {
    try {
      return element;
    } catch (error) {
      this.handleError({
        type: 'boundary',
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      
      const fallback = document.createElement('div');
      fallback.className = 'error-boundary';
      fallback.innerHTML = `
        <div class="error-boundary-content">
          <span class="error-boundary-icon">⚠️</span>
          <span class="error-boundary-message">${fallbackContent}</span>
        </div>
      `;
      return fallback;
    }
  }
}

// Initialize error handler
if (typeof window !== 'undefined') {
  window.errorHandler = new ErrorHandler();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ErrorHandler;
}