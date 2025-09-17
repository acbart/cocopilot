/**
 * Enhanced Error Handling and Graceful Degradation System
 * Provides better user experience when features fail or are unavailable
 */

class EnhancedErrorHandler {
  constructor() {
    this.errorQueue = [];
    this.retryAttempts = new Map();
    this.maxRetries = 3;
    this.retryDelay = 1000;
    this.userNotified = new Set();

    this.init();
  }

  init() {
    this.setupGlobalErrorHandling();
    this.setupNetworkErrorHandling();
    this.setupResourceErrorHandling();
    this.createErrorUI();
  }

  setupGlobalErrorHandling() {
    // Enhance existing error handling
    window.addEventListener('error', (event) => {
      this.handleError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: new Date().toISOString()
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: 'promise',
        message: event.reason?.message || 'Unhandled promise rejection',
        reason: event.reason,
        timestamp: new Date().toISOString()
      });
    });
  }

  setupNetworkErrorHandling() {
    // Intercept fetch requests for better error handling
    const originalFetch = window.fetch;
    window.fetch = async(...args) => {
      try {
        const response = await originalFetch(...args);

        if (!response.ok) {
          this.handleNetworkError({
            url: args[0],
            status: response.status,
            statusText: response.statusText
          });
        }

        return response;
      } catch (error) {
        this.handleNetworkError({
          url: args[0],
          error: error.message,
          type: 'fetch-failure'
        });
        throw error;
      }
    };
  }

  setupResourceErrorHandling() {
    // Handle resource loading errors
    document.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.handleResourceError({
          type: 'resource',
          element: event.target.tagName.toLowerCase(),
          source: event.target.src || event.target.href,
          message: 'Resource failed to load'
        });
      }
    }, true);
  }

  handleError(errorInfo) {
    // Prevent duplicate notifications for the same error
    const errorSignature = this.createErrorSignature(errorInfo);

    if (this.userNotified.has(errorSignature)) {
      return; // Already notified user about this error
    }

    console.error('Enhanced Error Handler:', errorInfo);

    // Add to error queue for potential retry
    this.errorQueue.push({
      ...errorInfo,
      signature: errorSignature,
      timestamp: Date.now()
    });

    // Handle specific error types
    switch (errorInfo.type) {
    case 'network':
      this.handleNetworkError(errorInfo);
      break;
    case 'javascript':
      this.handleJavaScriptError(errorInfo);
      break;
    case 'resource':
      this.handleResourceError(errorInfo);
      break;
    default:
      this.handleGenericError(errorInfo);
    }
  }

  handleNetworkError(errorInfo) {
    // Check if it's a known API that we can provide fallbacks for
    if (errorInfo.url?.includes('api.github.com')) {
      this.handleGitHubAPIError(errorInfo);
    } else if (errorInfo.url?.includes('google-analytics.com')) {
      this.handleAnalyticsError(errorInfo);
    } else {
      this.showUserFriendlyError('network', 'Connection Issue',
        'Unable to fetch data. Please check your internet connection.');
    }
  }

  handleGitHubAPIError(errorInfo) {
    // Provide fallback for GitHub API failures
    this.showUserFriendlyError('github', 'GitHub API Unavailable',
      'Repository data temporarily unavailable. Showing cached information.');

    // Use fallback data
    this.useFallbackRepoData();

    // Attempt retry with exponential backoff
    this.scheduleRetry(() => {
      if (typeof fetchRepoStats === 'function') {
        fetchRepoStats();
      }
    }, errorInfo);
  }

  handleAnalyticsError(errorInfo) {
    // Analytics failures shouldn't impact user experience
    console.info('Analytics unavailable - continuing without tracking');

    // Disable analytics gracefully
    if (window.gtag) {
      window.gtag = () => {}; // No-op function
    }
  }

  handleJavaScriptError(errorInfo) {
    // Check if it's a feature that can degrade gracefully
    if (errorInfo.message?.includes('advancedSearch')) {
      this.disableFeatureGracefully('search', 'Advanced search temporarily unavailable');
    } else if (errorInfo.message?.includes('onboardingTour')) {
      this.disableFeatureGracefully('tour', 'Interactive tour temporarily unavailable');
    } else {
      this.handleGenericError(errorInfo);
    }
  }

  handleResourceError(errorInfo) {
    // Handle different resource types
    if (errorInfo.element === 'script') {
      this.handleScriptError(errorInfo);
    } else if (errorInfo.element === 'img') {
      this.handleImageError(errorInfo);
    } else {
      console.warn('Resource failed to load:', errorInfo.source);
    }
  }

  handleScriptError(errorInfo) {
    // Identify which script failed and provide fallbacks
    const scriptName = this.identifyScript(errorInfo.source);

    switch (scriptName) {
    case 'advanced-search':
      this.disableFeatureGracefully('search', 'Search feature temporarily unavailable');
      break;
    case 'enhanced-mobile':
      console.info('Enhanced mobile features unavailable');
      break;
    case 'performance-monitor':
      console.info('Performance monitoring unavailable');
      break;
    default:
      console.warn('Script failed to load:', errorInfo.source);
    }
  }

  handleImageError(errorInfo) {
    // Provide fallback for missing images
    const img = document.querySelector(`img[src="${errorInfo.source}"]`);
    if (img) {
      img.style.display = 'none';

      // Add fallback content
      const fallback = document.createElement('div');
      fallback.className = 'image-fallback';
      fallback.innerHTML = '🖼️';
      fallback.style.cssText = `
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: ${img.offsetWidth || 40}px;
                height: ${img.offsetHeight || 40}px;
                background: var(--feature-bg, #f0f0f0);
                border-radius: 4px;
                font-size: 1.2rem;
            `;
      img.parentNode.insertBefore(fallback, img);
    }
  }

  disableFeatureGracefully(featureName, message) {
    // Hide or disable feature UI elements
    const featureElements = document.querySelectorAll(`[data-feature="${featureName}"], .${featureName}-btn`);
    featureElements.forEach(element => {
      element.style.opacity = '0.5';
      element.style.pointerEvents = 'none';
      element.title = message;
    });

    // Show informational message
    this.showUserFriendlyError('feature', `${featureName} Unavailable`, message);
  }

  useFallbackRepoData() {
    // Provide static fallback data when GitHub API is unavailable
    const fallbackData = {
      stars: '★',
      forks: '⑂',
      issues: '◦',
      description: 'Repository data temporarily unavailable'
    };

    // Update UI with fallback data
    document.getElementById('stars').textContent = fallbackData.stars;
    document.getElementById('forks').textContent = fallbackData.forks;
    document.getElementById('issues').textContent = fallbackData.issues;

    // Update ARIA labels
    const statsElement = document.getElementById('repoStats');
    if (statsElement) {
      statsElement.setAttribute('aria-label', fallbackData.description);
    }
  }

  showUserFriendlyError(category, title, message) {
    const errorSignature = `${category}-${title}`;

    if (this.userNotified.has(errorSignature)) {
      return; // Already shown this error
    }

    this.userNotified.add(errorSignature);

    // Create non-intrusive error notification
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
            <div class="error-content">
                <div class="error-icon">${this.getErrorIcon(category)}</div>
                <div class="error-text">
                    <strong>${title}</strong>
                    <p>${message}</p>
                </div>
                <button class="error-dismiss" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

    // Add styles if not already present
    this.ensureErrorStyles();

    // Add to page
    document.body.appendChild(notification);

    // Auto-remove after delay
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 10000);
  }

  getErrorIcon(category) {
    const icons = {
      network: '🌐',
      github: '🐙',
      feature: '⚙️',
      javascript: '⚠️',
      resource: '📁',
      generic: '❌'
    };
    return icons[category] || icons.generic;
  }

  createErrorUI() {
    // Create error status indicator
    const errorIndicator = document.createElement('div');
    errorIndicator.id = 'error-status-indicator';
    errorIndicator.className = 'error-status-indicator hidden';
    errorIndicator.innerHTML = `
            <div class="indicator-content">
                <span class="indicator-icon">⚠️</span>
                <span class="indicator-text">Issues detected</span>
                <button class="indicator-details" onclick="enhancedErrorHandler.showErrorDetails()">Details</button>
            </div>
        `;
    document.body.appendChild(errorIndicator);
  }

  showErrorDetails() {
    // Show detailed error information for debugging
    const modal = document.createElement('div');
    modal.className = 'error-details-modal';

    const recentErrors = this.errorQueue.slice(-5); // Show last 5 errors

    modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>System Status</h3>
                    <button onclick="this.closest('.error-details-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <h4>Recent Issues (${recentErrors.length})</h4>
                    ${recentErrors.map(error => `
                        <div class="error-item">
                            <strong>${error.type}</strong>: ${error.message}
                            <br><small>${new Date(error.timestamp).toLocaleString()}</small>
                        </div>
                    `).join('')}
                    
                    <div class="error-actions">
                        <button onclick="location.reload()">Refresh Page</button>
                        <button onclick="enhancedErrorHandler.clearErrors()">Clear Errors</button>
                    </div>
                </div>
            </div>
        `;

    document.body.appendChild(modal);
  }

  scheduleRetry(retryFunction, errorInfo) {
    const key = errorInfo.signature || errorInfo.url || 'generic';
    const currentAttempts = this.retryAttempts.get(key) || 0;

    if (currentAttempts >= this.maxRetries) {
      console.warn('Max retry attempts reached for:', key);
      return;
    }

    this.retryAttempts.set(key, currentAttempts + 1);

    // Exponential backoff
    const delay = this.retryDelay * Math.pow(2, currentAttempts);

    setTimeout(() => {
      try {
        retryFunction();
      } catch (error) {
        console.error('Retry failed:', error);
      }
    }, delay);
  }

  createErrorSignature(errorInfo) {
    // Create unique signature for error deduplication
    return `${errorInfo.type}-${errorInfo.message?.substring(0, 50)}-${errorInfo.url || ''}`;
  }

  identifyScript(scriptSrc) {
    if (!scriptSrc) {
      return 'unknown';
    }

    if (scriptSrc.includes('advanced-search')) {
      return 'advanced-search';
    }
    if (scriptSrc.includes('enhanced-mobile')) {
      return 'enhanced-mobile';
    }
    if (scriptSrc.includes('performance-monitor')) {
      return 'performance-monitor';
    }
    if (scriptSrc.includes('onboarding')) {
      return 'onboarding';
    }
    if (scriptSrc.includes('github-activity')) {
      return 'github-activity';
    }

    return 'unknown';
  }

  ensureErrorStyles() {
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
                background: var(--container-bg, white);
                border: 2px solid #ff6b6b;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(255, 107, 107, 0.2);
                z-index: 10000;
                max-width: 400px;
                animation: slideInRight 0.3s ease-out;
            }

            .error-content {
                display: flex;
                align-items: flex-start;
                gap: 10px;
                padding: 15px;
            }

            .error-icon {
                font-size: 1.2rem;
                flex-shrink: 0;
            }

            .error-text {
                flex: 1;
                min-width: 0;
            }

            .error-text strong {
                color: #d63031;
                display: block;
                margin-bottom: 4px;
            }

            .error-text p {
                margin: 0;
                color: var(--text-secondary, #666);
                font-size: 0.9rem;
                line-height: 1.4;
            }

            .error-dismiss {
                background: none;
                border: none;
                font-size: 1.2rem;
                color: var(--text-tertiary, #999);
                cursor: pointer;
                padding: 0;
                margin-left: 5px;
                flex-shrink: 0;
            }

            .error-dismiss:hover {
                color: var(--text-primary, #333);
            }

            .error-status-indicator {
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: #ff6b6b;
                color: white;
                border-radius: 20px;
                padding: 8px 15px;
                font-size: 0.9rem;
                z-index: 9999;
                animation: pulse 2s infinite;
            }

            .error-status-indicator.hidden {
                display: none;
            }

            .indicator-content {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .indicator-details {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                padding: 2px 8px;
                border-radius: 10px;
                font-size: 0.8rem;
                cursor: pointer;
            }

            .error-details-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }

            .modal-content {
                background: var(--container-bg, white);
                border-radius: 10px;
                max-width: 500px;
                width: 100%;
                max-height: 80vh;
                overflow-y: auto;
            }

            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid var(--border-color, #eee);
            }

            .modal-header button {
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
            }

            .modal-body {
                padding: 20px;
            }

            .error-item {
                background: var(--feature-bg, #f8f9fa);
                padding: 10px;
                border-radius: 5px;
                margin-bottom: 10px;
                border-left: 3px solid #ff6b6b;
            }

            .error-actions {
                margin-top: 20px;
                display: flex;
                gap: 10px;
            }

            .error-actions button {
                padding: 8px 16px;
                border: 1px solid var(--border-color, #ddd);
                background: var(--container-bg, white);
                border-radius: 5px;
                cursor: pointer;
            }

            .image-fallback {
                border: 1px dashed var(--border-color, #ddd);
                color: var(--text-tertiary, #999);
            }

            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }

            @media (max-width: 768px) {
                .error-notification {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }

                .error-status-indicator {
                    bottom: 10px;
                    left: 10px;
                }
            }
        `;
    document.head.appendChild(style);
  }

  clearErrors() {
    this.errorQueue = [];
    this.userNotified.clear();
    this.retryAttempts.clear();

    // Remove error notifications
    document.querySelectorAll('.error-notification, .error-details-modal').forEach(el => el.remove());

    // Hide error indicator
    const indicator = document.getElementById('error-status-indicator');
    if (indicator) {
      indicator.classList.add('hidden');
    }

    console.info('Error history cleared');
  }

  getErrorSummary() {
    return {
      totalErrors: this.errorQueue.length,
      recentErrors: this.errorQueue.slice(-5),
      errorTypes: [...new Set(this.errorQueue.map(e => e.type))],
      retryAttempts: Object.fromEntries(this.retryAttempts)
    };
  }
}

// Initialize enhanced error handler
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.enhancedErrorHandler = new EnhancedErrorHandler();
  });
} else {
  window.enhancedErrorHandler = new EnhancedErrorHandler();
}

// Expose for debugging
window.getErrorSummary = () => window.enhancedErrorHandler?.getErrorSummary();