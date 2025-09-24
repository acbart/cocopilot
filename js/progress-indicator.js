/**
 * Interactive Progress Indicator System
 * Provides visual feedback for module loading, page transitions, and system status
 */

class ProgressIndicator {
  constructor() {
    this.progressContainer = null;
    this.progressBar = null;
    this.progressText = null;
    this.currentProgress = 0;
    this.targetProgress = 0;
    this.isActive = false;
    this.animationId = null;
    
    // Configuration
    this.config = {
      animationSpeed: 0.02,
      hideDelay: 1000,
      showDelay: 300,
      colors: {
        primary: '#667eea',
        secondary: '#764ba2',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
      }
    };
    
    this.initialize();
  }

  initialize() {
    console.log('📊 Initializing Progress Indicator...');
    
    this.createProgressIndicator();
    this.attachEventListeners();
    
    // Monitor module loading if module loader is available
    if (window.moduleLoader) {
      this.monitorModuleLoading();
    }
    
    console.log('✅ Progress Indicator initialized');
  }

  createProgressIndicator() {
    // Create progress container
    this.progressContainer = document.createElement('div');
    this.progressContainer.className = 'progress-indicator-container';
    this.progressContainer.innerHTML = `
      <div class="progress-indicator">
        <div class="progress-bar">
          <div class="progress-fill"></div>
          <div class="progress-glow"></div>
        </div>
        <div class="progress-text">Loading...</div>
        <div class="progress-details"></div>
      </div>
    `;
    
    // Add styles
    this.addProgressStyles();
    
    // Add to DOM but keep hidden initially
    document.body.appendChild(this.progressContainer);
    
    // Get references to elements
    this.progressBar = this.progressContainer.querySelector('.progress-fill');
    this.progressText = this.progressContainer.querySelector('.progress-text');
    this.progressDetails = this.progressContainer.querySelector('.progress-details');
  }

  addProgressStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
      .progress-indicator-container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: var(--container-bg, rgba(255, 255, 255, 0.95));
        backdrop-filter: blur(10px);
        border-bottom: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
        z-index: 9999;
        transform: translateY(-100%);
        transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .progress-indicator-container.show {
        transform: translateY(0);
      }

      .progress-indicator {
        padding: 16px 20px;
        max-width: 800px;
        margin: 0 auto;
      }

      .progress-bar {
        position: relative;
        height: 6px;
        background: var(--border-color, rgba(102, 126, 234, 0.1));
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 12px;
      }

      .progress-fill {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 0%;
        background: linear-gradient(90deg, 
          ${this.config.colors.primary}, 
          ${this.config.colors.secondary}
        );
        border-radius: 3px;
        transition: width 0.3s ease;
        box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
      }

      .progress-glow {
        position: absolute;
        top: -2px;
        left: -10px;
        right: -10px;
        bottom: -2px;
        background: linear-gradient(90deg, 
          transparent, 
          rgba(102, 126, 234, 0.3), 
          transparent
        );
        border-radius: 6px;
        opacity: 0;
        animation: progressGlow 2s infinite;
      }

      @keyframes progressGlow {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
      }

      .progress-text {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--text-primary, #333);
        text-align: center;
        margin-bottom: 4px;
      }

      .progress-details {
        font-size: 0.8rem;
        color: var(--text-secondary, #666);
        text-align: center;
        opacity: 0.7;
      }

      /* Success state */
      .progress-indicator-container.success .progress-fill {
        background: linear-gradient(90deg, ${this.config.colors.success}, #22c55e);
        box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
      }

      .progress-indicator-container.success .progress-text {
        color: ${this.config.colors.success};
      }

      /* Error state */
      .progress-indicator-container.error .progress-fill {
        background: linear-gradient(90deg, ${this.config.colors.error}, #f87171);
        box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
      }

      .progress-indicator-container.error .progress-text {
        color: ${this.config.colors.error};
      }

      /* Warning state */
      .progress-indicator-container.warning .progress-fill {
        background: linear-gradient(90deg, ${this.config.colors.warning}, #fbbf24);
        box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
      }

      .progress-indicator-container.warning .progress-text {
        color: ${this.config.colors.warning};
      }

      /* Dark mode support */
      [data-theme="dark"] .progress-indicator-container {
        background: rgba(30, 30, 30, 0.95);
        border-bottom-color: rgba(102, 126, 234, 0.3);
      }

      [data-theme="dark"] .progress-bar {
        background: rgba(102, 126, 234, 0.15);
      }

      /* Mobile responsiveness */
      @media (max-width: 480px) {
        .progress-indicator {
          padding: 12px 16px;
        }

        .progress-text {
          font-size: 0.8rem;
        }

        .progress-details {
          font-size: 0.7rem;
        }
      }

      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        .progress-indicator-container {
          transition: none !important;
        }
        
        .progress-fill {
          transition: none !important;
        }
        
        .progress-glow {
          animation: none !important;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  show(text = 'Loading...', details = '') {
    this.isActive = true;
    this.currentProgress = 0;
    this.targetProgress = 0;
    
    this.updateText(text, details);
    this.progressContainer.classList.add('show');
    this.progressContainer.classList.remove('success', 'error', 'warning');
    
    // Start animation
    this.startAnimation();
  }

  hide() {
    this.isActive = false;
    this.stopAnimation();
    
    setTimeout(() => {
      this.progressContainer.classList.remove('show');
    }, this.config.hideDelay);
  }

  updateProgress(progress, text = null, details = null) {
    this.targetProgress = Math.max(0, Math.min(100, progress));
    
    if (text) {
      this.updateText(text, details);
    }
    
    // If we're at 100%, show success state briefly
    if (progress >= 100) {
      setTimeout(() => {
        this.setSuccessState();
        setTimeout(() => this.hide(), 1000);
      }, 300);
    }
  }

  updateText(text, details = null) {
    if (this.progressText) {
      this.progressText.textContent = text;
    }
    
    if (details && this.progressDetails) {
      this.progressDetails.textContent = details;
    }
  }

  setSuccessState(text = 'Complete!', details = '') {
    this.progressContainer.classList.add('success');
    this.updateText(text, details);
    this.updateProgress(100);
  }

  setErrorState(text = 'Error occurred', details = '') {
    this.progressContainer.classList.add('error');
    this.updateText(text, details);
  }

  setWarningState(text = 'Warning', details = '') {
    this.progressContainer.classList.add('warning');
    this.updateText(text, details);
  }

  startAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    this.animate();
  }

  stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  animate() {
    if (!this.isActive) return;
    
    // Smooth progress animation
    const diff = this.targetProgress - this.currentProgress;
    if (Math.abs(diff) > 0.1) {
      this.currentProgress += diff * this.config.animationSpeed;
      this.progressBar.style.width = this.currentProgress + '%';
    }
    
    this.animationId = requestAnimationFrame(this.animate.bind(this));
  }

  attachEventListeners() {
    // Monitor page load progress
    this.monitorPageLoad();
    
    // Monitor navigation changes
    this.monitorNavigation();
    
    // Listen for custom progress events
    document.addEventListener('progress:start', (e) => {
      this.show(e.detail.text, e.detail.details);
    });
    
    document.addEventListener('progress:update', (e) => {
      this.updateProgress(e.detail.progress, e.detail.text, e.detail.details);
    });
    
    document.addEventListener('progress:complete', (e) => {
      this.setSuccessState(e.detail.text, e.detail.details);
    });
    
    document.addEventListener('progress:error', (e) => {
      this.setErrorState(e.detail.text, e.detail.details);
    });
  }

  monitorPageLoad() {
    if (document.readyState === 'loading') {
      this.show('Loading page...', 'Initializing CocoPilot');
      
      let progress = 0;
      const loadingInterval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 90) progress = 90;
        
        this.updateProgress(progress, 'Loading page...', 'Preparing content');
        
        if (document.readyState === 'complete') {
          clearInterval(loadingInterval);
          this.updateProgress(100, 'Page loaded!', 'Ready to explore');
        }
      }, 100);
    }
  }

  monitorNavigation() {
    // Monitor hash changes
    window.addEventListener('hashchange', () => {
      this.show('Navigating...', 'Loading section');
      setTimeout(() => {
        this.updateProgress(100, 'Navigation complete!');
      }, 500);
    });
    
    // Monitor form submissions
    document.addEventListener('submit', (e) => {
      this.show('Processing...', 'Submitting form');
    });
  }

  monitorModuleLoading() {
    if (!window.moduleLoader) return;
    
    // Hook into module loader events
    const originalLoadModule = window.moduleLoader.loadModule.bind(window.moduleLoader);
    
    window.moduleLoader.loadModule = async (moduleName) => {
      this.show('Loading modules...', `Loading ${moduleName}`);
      
      try {
        const result = await originalLoadModule(moduleName);
        const status = window.moduleLoader.getLoadingStatus();
        const progress = (status.loaded / (status.loaded + status.loading + status.queued)) * 100;
        
        this.updateProgress(progress, 'Loading modules...', `${status.loaded} modules loaded`);
        
        if (status.loading === 0 && status.queued === 0) {
          this.setSuccessState('All modules loaded!', `${status.loaded} modules ready`);
        }
        
        return result;
      } catch (error) {
        this.setErrorState('Module loading failed', `Failed to load ${moduleName}`);
        throw error;
      }
    };
  }

  // Public API methods
  showCustomProgress(config) {
    const { text, details, progress = 0, type = 'default' } = config;
    
    this.show(text, details);
    this.updateProgress(progress);
    
    if (type === 'success') this.setSuccessState(text, details);
    else if (type === 'error') this.setErrorState(text, details);
    else if (type === 'warning') this.setWarningState(text, details);
  }

  // Utility methods for common operations
  showLoadingOperation(operation, estimatedTime = 2000) {
    this.show(`${operation}...`, 'Please wait');
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += (100 / estimatedTime) * 100;
      this.updateProgress(Math.min(progress, 95));
      
      if (progress >= 95) {
        clearInterval(interval);
      }
    }, 100);
    
    return {
      complete: (successText = 'Complete!') => {
        clearInterval(interval);
        this.setSuccessState(successText);
      },
      error: (errorText = 'Operation failed') => {
        clearInterval(interval);
        this.setErrorState(errorText);
      }
    };
  }

  // Analytics
  reportUsage() {
    if (window.gtag) {
      gtag('event', 'progress_indicator_used', {
        current_progress: this.currentProgress,
        is_active: this.isActive
      });
    }
  }
}

// Helper function to create progress events
function dispatchProgressEvent(type, detail) {
  document.dispatchEvent(new CustomEvent(`progress:${type}`, { detail }));
}

// Initialize progress indicator
function initializeProgressIndicator() {
  if (window.progressIndicator) {
    return;
  }
  
  window.progressIndicator = new ProgressIndicator();
  
  // Add global helper functions
  window.showProgress = (text, details, progress) => {
    window.progressIndicator.showCustomProgress({ text, details, progress });
  };
  
  window.hideProgress = () => {
    window.progressIndicator.hide();
  };
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeProgressIndicator);
} else {
  initializeProgressIndicator();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProgressIndicator;
}