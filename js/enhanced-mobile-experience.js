/**
 * Enhanced Mobile Experience System
 * Provides optimized mobile interactions, gestures, and touch-friendly features
 */

class EnhancedMobileExperience {
  constructor() {
    this.isMobile = this.detectMobileDevice();
    this.touchStartTime = 0;
    this.touchStartPos = { x: 0, y: 0 };
    this.swipeThreshold = 50;
    this.tapThreshold = 200;
    this.isActive = false;
    
    // Mobile-specific UI elements
    this.mobileToolbar = null;
    this.swipeIndicators = null;
    this.touchFeedback = null;
    
    // Configuration
    this.config = {
      enableSwipeNavigation: true,
      enableTouchFeedback: true,
      enableMobileToolbar: true,
      enablePullToRefresh: true,
      optimizeScrolling: true,
      enhanceTouchTargets: true
    };
    
    if (this.isMobile) {
      this.initialize();
    }
  }

  async initialize() {
    try {
      console.log('📱 Initializing Enhanced Mobile Experience...');
      
      // Apply mobile optimizations
      this.applyMobileOptimizations();
      
      // Set up touch interactions
      this.setupTouchInteractions();
      
      // Create mobile UI elements
      this.createMobileUI();
      
      // Optimize for mobile performance
      this.optimizeMobilePerformance();
      
      // Setup mobile-specific event listeners
      this.setupMobileEventListeners();
      
      this.isActive = true;
      console.log('✅ Enhanced Mobile Experience initialized');
      
    } catch (error) {
      console.error('❌ Error initializing Enhanced Mobile Experience:', error);
    }
  }

  detectMobileDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
    const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
    const isMobileViewport = window.innerWidth <= 768;
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    return isMobileUA || (isMobileViewport && hasTouchScreen);
  }

  applyMobileOptimizations() {
    // Add mobile-specific CSS class
    document.body.classList.add('mobile-optimized');
    
    // Optimize viewport
    this.optimizeViewport();
    
    // Enhance touch targets
    if (this.config.enhanceTouchTargets) {
      this.enhanceTouchTargets();
    }
    
    // Optimize scrolling
    if (this.config.optimizeScrolling) {
      this.optimizeScrolling();
    }
    
    // Add mobile styles
    this.addMobileStyles();
  }

  optimizeViewport() {
    // Ensure proper viewport meta tag
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }
    
    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
    
    // Prevent zoom on input focus (iOS)
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (!input.style.fontSize) {
        input.style.fontSize = '16px';
      }
    });
  }

  enhanceTouchTargets() {
    // Ensure touch targets are at least 44px (iOS HIG recommendation)
    const minTouchSize = 44;
    const touchElements = document.querySelectorAll('button, a, input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])');
    
    touchElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      if (rect.width < minTouchSize || rect.height < minTouchSize) {
        element.style.minWidth = minTouchSize + 'px';
        element.style.minHeight = minTouchSize + 'px';
        element.style.display = element.style.display || 'inline-flex';
        element.style.alignItems = 'center';
        element.style.justifyContent = 'center';
      }
    });
  }

  optimizeScrolling() {
    // Enable momentum scrolling on iOS
    document.body.style.webkitOverflowScrolling = 'touch';
    document.body.style.overflowScrolling = 'touch';
    
    // Improve scroll performance
    const scrollableElements = document.querySelectorAll('.scroll, .overflow-auto, [style*="overflow"]');
    scrollableElements.forEach(element => {
      element.style.webkitOverflowScrolling = 'touch';
      element.style.overflowScrolling = 'touch';
    });
  }

  addMobileStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
      .mobile-optimized {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        touch-action: manipulation;
      }

      .mobile-optimized * {
        -webkit-tap-highlight-color: rgba(102, 126, 234, 0.3);
        -webkit-touch-callout: none;
      }

      .mobile-optimized a,
      .mobile-optimized button,
      .mobile-optimized [role="button"] {
        -webkit-tap-highlight-color: rgba(102, 126, 234, 0.3);
        tap-highlight-color: rgba(102, 126, 234, 0.3);
      }

      /* Mobile toolbar */
      .mobile-toolbar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: var(--container-bg, rgba(255, 255, 255, 0.95));
        backdrop-filter: blur(10px);
        border-top: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
        padding: 8px 16px;
        z-index: 1000;
        transform: translateY(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
      }

      .mobile-toolbar.show {
        transform: translateY(0);
      }

      .mobile-toolbar-content {
        display: flex;
        justify-content: space-around;
        align-items: center;
        max-width: 400px;
        margin: 0 auto;
      }

      .mobile-toolbar-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 8px 12px;
        background: none;
        border: none;
        color: var(--text-secondary, #666);
        text-decoration: none;
        border-radius: 8px;
        transition: all 0.2s ease;
        min-width: 60px;
        font-size: 0.7rem;
      }

      .mobile-toolbar-btn:hover,
      .mobile-toolbar-btn:active {
        background: var(--feature-bg, rgba(102, 126, 234, 0.1));
        color: var(--text-primary, #333);
        transform: scale(1.05);
      }

      .mobile-toolbar-btn .icon {
        font-size: 1.2rem;
        margin-bottom: 2px;
      }

      /* Touch feedback */
      .touch-feedback {
        position: fixed;
        pointer-events: none;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
        z-index: 10000;
        animation: touchRipple 0.6s ease-out;
      }

      @keyframes touchRipple {
        0% {
          transform: scale(0);
          opacity: 1;
        }
        100% {
          transform: scale(4);
          opacity: 0;
        }
      }

      /* Swipe indicators */
      .swipe-indicator {
        position: fixed;
        top: 50%;
        transform: translateY(-50%);
        background: var(--container-bg, rgba(255, 255, 255, 0.9));
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .swipe-indicator.left {
        left: 20px;
      }

      .swipe-indicator.right {
        right: 20px;
      }

      .swipe-indicator.show {
        opacity: 1;
      }

      /* Pull to refresh indicator */
      .pull-to-refresh {
        position: fixed;
        top: -60px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--container-bg, rgba(255, 255, 255, 0.9));
        backdrop-filter: blur(10px);
        border-radius: 0 0 12px 12px;
        padding: 12px 20px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        z-index: 1001;
        transition: top 0.3s ease;
      }

      .pull-to-refresh.show {
        top: 0;
      }

      .pull-to-refresh .spinner {
        width: 20px;
        height: 20px;
        border: 2px solid var(--border-color, #e0e0e0);
        border-top: 2px solid var(--button-gradient-start, #667eea);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 8px;
      }

      /* Mobile-specific feature cards */
      @media (max-width: 768px) {
        .features-showcase-section {
          padding: 1rem;
        }

        .showcase-features {
          gap: 1rem;
        }

        .showcase-feature {
          padding: 1.25rem;
          border-radius: 12px;
        }

        .showcase-feature:active {
          transform: scale(0.98);
          background: var(--feature-bg, rgba(102, 126, 234, 0.15));
        }
      }

      /* Dark mode support */
      [data-theme="dark"] .mobile-toolbar {
        background: rgba(30, 30, 30, 0.95);
        border-top-color: rgba(102, 126, 234, 0.3);
      }

      [data-theme="dark"] .swipe-indicator,
      [data-theme="dark"] .pull-to-refresh {
        background: rgba(30, 30, 30, 0.9);
      }
    `;

    document.head.appendChild(styles);
  }

  setupTouchInteractions() {
    let startX, startY, startTime;
    
    document.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
      
      // Show touch feedback
      if (this.config.enableTouchFeedback) {
        this.showTouchFeedback(e.touches[0]);
      }
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
      if (!startX || !startY) return;
      
      const deltaX = e.touches[0].clientX - startX;
      const deltaY = e.touches[0].clientY - startY;
      
      // Handle pull to refresh
      if (this.config.enablePullToRefresh && window.scrollY === 0 && deltaY > 0) {
        this.handlePullToRefresh(deltaY);
      }
      
      // Handle swipe navigation hints
      if (this.config.enableSwipeNavigation) {
        this.handleSwipeHints(deltaX, deltaY);
      }
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
      if (!startX || !startY || !startTime) return;
      
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const endTime = Date.now();
      
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const deltaTime = endTime - startTime;
      
      // Detect swipe gestures
      if (this.config.enableSwipeNavigation && deltaTime < 300) {
        this.handleSwipeGesture(deltaX, deltaY);
      }
      
      // Reset values
      startX = startY = startTime = null;
      this.hideSwipeIndicators();
      this.hidePullToRefresh();
    }, { passive: true });
  }

  showTouchFeedback(touch) {
    const feedback = document.createElement('div');
    feedback.className = 'touch-feedback';
    feedback.style.left = (touch.clientX - 25) + 'px';
    feedback.style.top = (touch.clientY - 25) + 'px';
    feedback.style.width = '50px';
    feedback.style.height = '50px';
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
      if (feedback.parentNode) {
        feedback.parentNode.removeChild(feedback);
      }
    }, 600);
  }

  handleSwipeHints(deltaX, deltaY) {
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    // Only show hints for horizontal swipes
    if (absX > absY && absX > 30) {
      if (deltaX > 0) {
        this.showSwipeIndicator('left', '← Previous');
      } else {
        this.showSwipeIndicator('right', 'Next →');
      }
    }
  }

  showSwipeIndicator(side, text) {
    let indicator = document.querySelector(`.swipe-indicator.${side}`);
    
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = `swipe-indicator ${side}`;
      indicator.innerHTML = `<div class="swipe-text">${text}</div>`;
      document.body.appendChild(indicator);
    }
    
    indicator.classList.add('show');
  }

  hideSwipeIndicators() {
    const indicators = document.querySelectorAll('.swipe-indicator');
    indicators.forEach(indicator => {
      indicator.classList.remove('show');
    });
  }

  handleSwipeGesture(deltaX, deltaY) {
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    // Only handle horizontal swipes that are significant
    if (absX > this.swipeThreshold && absX > absY) {
      if (deltaX > 0) {
        this.handleSwipeRight();
      } else {
        this.handleSwipeLeft();
      }
    }
  }

  handleSwipeRight() {
    console.log('📱 Swipe right detected');
    
    // Navigate to previous section or page
    const sections = document.querySelectorAll('section, .section, [id]');
    const currentSection = this.getCurrentSection();
    const currentIndex = Array.from(sections).indexOf(currentSection);
    
    if (currentIndex > 0) {
      sections[currentIndex - 1].scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    
    // Track swipe gesture
    if (window.enhancedAnalytics) {
      window.enhancedAnalytics.trackCustomEvent('swipe_gesture', {
        direction: 'right',
        context: 'navigation'
      });
    }
  }

  handleSwipeLeft() {
    console.log('📱 Swipe left detected');
    
    // Navigate to next section or page
    const sections = document.querySelectorAll('section, .section, [id]');
    const currentSection = this.getCurrentSection();
    const currentIndex = Array.from(sections).indexOf(currentSection);
    
    if (currentIndex < sections.length - 1) {
      sections[currentIndex + 1].scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    
    // Track swipe gesture
    if (window.enhancedAnalytics) {
      window.enhancedAnalytics.trackCustomEvent('swipe_gesture', {
        direction: 'left',
        context: 'navigation'
      });
    }
  }

  getCurrentSection() {
    const sections = document.querySelectorAll('section, .section, [id]');
    let currentSection = sections[0];
    
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
        currentSection = section;
      }
    });
    
    return currentSection;
  }

  handlePullToRefresh(deltaY) {
    if (deltaY > 100) {
      this.showPullToRefresh();
    }
    
    if (deltaY > 150) {
      this.triggerRefresh();
    }
  }

  showPullToRefresh() {
    let indicator = document.querySelector('.pull-to-refresh');
    
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'pull-to-refresh';
      indicator.innerHTML = `
        <div class="spinner"></div>
        <div>Pull to refresh</div>
      `;
      document.body.appendChild(indicator);
    }
    
    indicator.classList.add('show');
  }

  hidePullToRefresh() {
    const indicator = document.querySelector('.pull-to-refresh');
    if (indicator) {
      indicator.classList.remove('show');
    }
  }

  triggerRefresh() {
    console.log('📱 Pull to refresh triggered');
    
    // Show loading state
    const indicator = document.querySelector('.pull-to-refresh');
    if (indicator) {
      indicator.innerHTML = `
        <div class="spinner"></div>
        <div>Refreshing...</div>
      `;
    }
    
    // Simulate refresh (reload page after delay)
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    
    // Track refresh action
    if (window.enhancedAnalytics) {
      window.enhancedAnalytics.trackCustomEvent('pull_to_refresh', {
        trigger: 'gesture'
      });
    }
  }

  createMobileUI() {
    if (!this.config.enableMobileToolbar) return;
    
    // Create mobile toolbar
    this.mobileToolbar = document.createElement('div');
    this.mobileToolbar.className = 'mobile-toolbar';
    this.mobileToolbar.innerHTML = `
      <div class="mobile-toolbar-content">
        <a href="#" class="mobile-toolbar-btn" onclick="scrollToTop()">
          <span class="icon">⬆️</span>
          <span>Top</span>
        </a>
        <button class="mobile-toolbar-btn" onclick="window.startTour?.()">
          <span class="icon">🎯</span>
          <span>Tour</span>
        </button>
        <button class="mobile-toolbar-btn" onclick="window.aiSuggestions?.toggleSuggestionPanel()">
          <span class="icon">🧠</span>
          <span>AI Tips</span>
        </button>
        <button class="mobile-toolbar-btn" onclick="document.querySelector('.theme-toggle')?.click()">
          <span class="icon">🌗</span>
          <span>Theme</span>
        </button>
        <a href="https://github.com/acbart/cocopilot" class="mobile-toolbar-btn" target="_blank">
          <span class="icon">📂</span>
          <span>GitHub</span>
        </a>
      </div>
    `;
    
    document.body.appendChild(this.mobileToolbar);
    
    // Show toolbar after page load
    setTimeout(() => {
      this.mobileToolbar.classList.add('show');
    }, 2000);
  }

  setupMobileEventListeners() {
    // Hide toolbar when scrolling
    let scrollTimer = null;
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;
      
      if (this.mobileToolbar) {
        if (scrollingDown) {
          this.mobileToolbar.classList.remove('show');
        } else {
          this.mobileToolbar.classList.add('show');
        }
      }
      
      lastScrollY = currentScrollY;
      
      // Clear existing timer
      clearTimeout(scrollTimer);
      
      // Show toolbar again after scrolling stops
      scrollTimer = setTimeout(() => {
        if (this.mobileToolbar) {
          this.mobileToolbar.classList.add('show');
        }
      }, 1000);
    }, { passive: true });
    
    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.optimizeViewport();
        this.enhanceTouchTargets();
      }, 500);
    });
    
    // Handle focus events for better form interaction
    document.addEventListener('focusin', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        // Hide toolbar when keyboard appears
        if (this.mobileToolbar) {
          this.mobileToolbar.classList.remove('show');
        }
      }
    });
    
    document.addEventListener('focusout', (e) => {
      // Show toolbar when keyboard disappears
      setTimeout(() => {
        if (this.mobileToolbar) {
          this.mobileToolbar.classList.add('show');
        }
      }, 300);
    });
  }

  optimizeMobilePerformance() {
    // Disable hover effects on mobile
    const hoverStyles = document.createElement('style');
    hoverStyles.textContent = `
      @media (hover: none) {
        *:hover {
          transition: none !important;
        }
      }
    `;
    document.head.appendChild(hoverStyles);
    
    // Optimize images for mobile
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.loading) {
        img.loading = 'lazy';
      }
    });
    
    // Reduce animation complexity on lower-end devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      document.body.classList.add('reduced-animations');
      
      const reducedAnimationStyles = document.createElement('style');
      reducedAnimationStyles.textContent = `
        .reduced-animations * {
          animation-duration: 0.1s !important;
          transition-duration: 0.1s !important;
        }
      `;
      document.head.appendChild(reducedAnimationStyles);
    }
  }

  // Public API
  showMobileToolbar() {
    if (this.mobileToolbar) {
      this.mobileToolbar.classList.add('show');
    }
  }

  hideMobileToolbar() {
    if (this.mobileToolbar) {
      this.mobileToolbar.classList.remove('show');
    }
  }

  enableFeature(featureName) {
    this.config[featureName] = true;
  }

  disableFeature(featureName) {
    this.config[featureName] = false;
  }

  getConfig() {
    return { ...this.config };
  }

  // Analytics
  reportUsage() {
    if (window.enhancedAnalytics) {
      window.enhancedAnalytics.trackCustomEvent('mobile_experience_used', {
        is_mobile: this.isMobile,
        features_enabled: Object.entries(this.config)
          .filter(([key, value]) => value)
          .map(([key]) => key),
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        user_agent: navigator.userAgent
      });
    }
  }
}

// Helper function for scrolling
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Initialize enhanced mobile experience
function initializeEnhancedMobileExperience() {
  if (window.enhancedMobileExperience) {
    return;
  }
  
  window.enhancedMobileExperience = new EnhancedMobileExperience();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeEnhancedMobileExperience);
} else {
  initializeEnhancedMobileExperience();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnhancedMobileExperience;
}