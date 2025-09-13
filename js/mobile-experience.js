/**
 * Mobile Experience Enhancer
 * Optimizes the mobile experience with touch interactions and responsive improvements
 */

class MobileExperienceEnhancer {
  constructor() {
    this.isMobile = this.detectMobile();
    this.touchStartY = 0;
    this.touchStartX = 0;
    this.gestureHandlers = new Map();
    this.isInitialized = false;
    
    this.init();
  }

  init() {
    if (this.isInitialized) return;
    
    this.addMobileOptimizations();
    this.implementTouchGestures();
    this.optimizeViewport();
    this.enhanceMobileNavigation();
    this.addPullToRefresh();
    this.optimizeTouchTargets();
    
    this.isInitialized = true;
  }

  /**
   * Detect if device is mobile
   */
  detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth <= 768;
  }

  /**
   * Add mobile-specific optimizations
   */
  addMobileOptimizations() {
    if (!this.isMobile) return;

    // Add mobile-specific CSS optimizations
    const style = document.createElement('style');
    style.id = 'mobile-optimizations';
    style.textContent = `
      /* Mobile-specific optimizations */
      @media (max-width: 768px) {
        /* Optimize touch targets */
        button, .btn, a, input, select, textarea {
          min-height: 44px;
          min-width: 44px;
          touch-action: manipulation;
        }

        /* Improve scroll performance */
        * {
          -webkit-overflow-scrolling: touch;
        }

        /* Optimize text rendering */
        body {
          -webkit-text-size-adjust: 100%;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeSpeed;
        }

        /* Prevent zoom on input focus */
        input, select, textarea {
          font-size: 16px;
        }

        /* Optimize performance dashboard for mobile */
        #performance-dashboard {
          position: fixed;
          bottom: 10px;
          right: 10px;
          left: auto;
          max-width: 280px;
          font-size: 0.8em;
        }

        /* Improve modal responsiveness */
        #rss-modal > div {
          margin: 10px;
          max-height: 80vh;
          overflow-y: auto;
        }

        /* Enhanced floating elements for mobile */
        .floating-element {
          animation-duration: 20s !important;
          will-change: transform;
        }

        /* Better spacing for mobile */
        .container {
          padding: 15px;
        }

        .feature-card {
          margin-bottom: 15px;
        }

        /* Optimize timeline for mobile */
        .timeline-item {
          padding: 12px;
          margin-bottom: 10px;
        }

        /* Mobile-friendly navigation */
        .main-actions {
          flex-direction: column;
          gap: 10px;
        }

        .main-actions .btn {
          width: 100%;
          justify-content: center;
        }
      }

      /* Touch feedback */
      .touch-feedback {
        position: relative;
        overflow: hidden;
      }

      .touch-feedback::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
        pointer-events: none;
      }

      .touch-feedback.active::after {
        width: 200px;
        height: 200px;
      }

      /* Pull to refresh indicator */
      .pull-to-refresh {
        position: fixed;
        top: -60px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--container-bg);
        border: 2px solid var(--border-color);
        border-radius: 30px;
        padding: 10px 20px;
        color: var(--text-primary);
        font-size: 0.9em;
        z-index: 1000;
        transition: top 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .pull-to-refresh.visible {
        top: 20px;
      }

      .pull-to-refresh.refreshing {
        animation: pulse 1.5s ease-in-out infinite;
      }

      @keyframes pulse {
        0% { transform: translateX(-50%) scale(1); }
        50% { transform: translateX(-50%) scale(1.05); }
        100% { transform: translateX(-50%) scale(1); }
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Implement touch gestures
   */
  implementTouchGestures() {
    if (!this.isMobile) return;

    // Add touch feedback to interactive elements
    this.addTouchFeedback();
    
    // Implement swipe gestures
    this.implementSwipeGestures();
    
    // Add pinch-to-zoom for images
    this.addPinchToZoom();
  }

  /**
   * Add touch feedback to buttons and interactive elements
   */
  addTouchFeedback() {
    const interactiveElements = document.querySelectorAll('button, .btn, a, .feature-card, .timeline-item');
    
    interactiveElements.forEach(element => {
      if (!element.classList.contains('touch-feedback')) {
        element.classList.add('touch-feedback');
        
        element.addEventListener('touchstart', (e) => {
          element.classList.add('active');
          setTimeout(() => {
            element.classList.remove('active');
          }, 600);
        }, { passive: true });
      }
    });

    // Add touch feedback to dynamically added elements
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            const newInteractiveElements = node.querySelectorAll ? 
              node.querySelectorAll('button, .btn, a, .feature-card, .timeline-item') : 
              [];
            newInteractiveElements.forEach(element => {
              if (!element.classList.contains('touch-feedback')) {
                element.classList.add('touch-feedback');
              }
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Implement swipe gestures
   */
  implementSwipeGestures() {
    let startX, startY, endX, endY;

    document.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      if (!startX || !startY) return;

      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;

      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Minimum swipe distance
      const minSwipeDistance = 50;

      if (absDeltaX > minSwipeDistance && absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > 0) {
          this.handleSwipeRight();
        } else {
          this.handleSwipeLeft();
        }
      } else if (absDeltaY > minSwipeDistance && absDeltaY > absDeltaX) {
        // Vertical swipe
        if (deltaY > 0) {
          this.handleSwipeDown();
        } else {
          this.handleSwipeUp();
        }
      }

      // Reset
      startX = startY = endX = endY = null;
    }, { passive: true });
  }

  /**
   * Handle swipe gestures
   */
  handleSwipeRight() {
    // Navigate to previous item in timeline
    const prevButton = document.querySelector('.timeline-nav .prev:not([disabled])');
    if (prevButton) {
      prevButton.click();
    }
  }

  handleSwipeLeft() {
    // Navigate to next item in timeline
    const nextButton = document.querySelector('.timeline-nav .next:not([disabled])');
    if (nextButton) {
      nextButton.click();
    }
  }

  handleSwipeDown() {
    // Trigger pull to refresh if at top
    if (window.scrollY === 0) {
      this.triggerPullToRefresh();
    }
  }

  handleSwipeUp() {
    // Close performance dashboard if open
    const dashboard = document.getElementById('performance-dashboard');
    if (dashboard && dashboard.style.display !== 'none') {
      if (window.performanceMonitor && window.performanceMonitor.toggleDashboard) {
        window.performanceMonitor.toggleDashboard();
      }
    }
  }

  /**
   * Add pinch-to-zoom for images
   */
  addPinchToZoom() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      let scale = 1;
      let initialDistance = 0;
      
      img.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
          initialDistance = this.getDistance(e.touches[0], e.touches[1]);
          img.style.transition = 'none';
        }
      }, { passive: true });

      img.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
          e.preventDefault();
          const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
          scale = currentDistance / initialDistance;
          img.style.transform = `scale(${scale})`;
        }
      });

      img.addEventListener('touchend', () => {
        img.style.transition = 'transform 0.3s ease';
        if (scale < 1) {
          scale = 1;
          img.style.transform = 'scale(1)';
        }
      }, { passive: true });
    });
  }

  /**
   * Get distance between two touch points
   */
  getDistance(touch1, touch2) {
    const deltaX = touch2.clientX - touch1.clientX;
    const deltaY = touch2.clientY - touch1.clientY;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  }

  /**
   * Optimize viewport settings
   */
  optimizeViewport() {
    // Ensure proper viewport meta tag
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }
    
    viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';

    // Add mobile-specific meta tags
    const mobileMetaTags = [
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      { name: 'format-detection', content: 'telephone=no' }
    ];

    mobileMetaTags.forEach(tag => {
      if (!document.querySelector(`meta[name="${tag.name}"]`)) {
        const meta = document.createElement('meta');
        meta.name = tag.name;
        meta.content = tag.content;
        document.head.appendChild(meta);
      }
    });
  }

  /**
   * Enhance mobile navigation
   */
  enhanceMobileNavigation() {
    if (!this.isMobile) return;

    // Add mobile navigation helper
    const navHelper = document.createElement('div');
    navHelper.className = 'mobile-nav-helper';
    navHelper.innerHTML = `
      <div class="nav-hint">
        <span>💡 Swipe left/right to navigate timeline</span>
      </div>
    `;

    // Show hint briefly on first visit
    if (!localStorage.getItem('mobileNavHintShown')) {
      document.body.appendChild(navHelper);
      setTimeout(() => {
        navHelper.style.opacity = '1';
      }, 1000);
      
      setTimeout(() => {
        navHelper.style.opacity = '0';
        setTimeout(() => navHelper.remove(), 300);
      }, 4000);
      
      localStorage.setItem('mobileNavHintShown', 'true');
    }

    // Add mobile nav styles
    const style = document.createElement('style');
    style.textContent = `
      .mobile-nav-helper {
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--container-bg);
        border: 1px solid var(--border-color);
        border-radius: 20px;
        padding: 10px 15px;
        font-size: 0.8em;
        color: var(--text-secondary);
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
      }

      .nav-hint {
        display: flex;
        align-items: center;
        gap: 5px;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Add pull-to-refresh functionality
   */
  addPullToRefresh() {
    if (!this.isMobile) return;

    const pullToRefreshElement = document.createElement('div');
    pullToRefreshElement.className = 'pull-to-refresh';
    pullToRefreshElement.innerHTML = `
      <span class="refresh-icon">↻</span>
      <span class="refresh-text">Release to refresh</span>
    `;
    document.body.appendChild(pullToRefreshElement);

    let startY = 0;
    let isPulling = false;
    let pullDistance = 0;
    const pullThreshold = 80;

    document.addEventListener('touchstart', (e) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
      }
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (window.scrollY === 0 && startY) {
        const currentY = e.touches[0].clientY;
        pullDistance = currentY - startY;
        
        if (pullDistance > 0) {
          isPulling = true;
          pullToRefreshElement.style.top = `${Math.min(pullDistance - 60, 20)}px`;
          
          if (pullDistance > pullThreshold) {
            pullToRefreshElement.classList.add('visible');
            pullToRefreshElement.querySelector('.refresh-text').textContent = 'Release to refresh';
          } else {
            pullToRefreshElement.classList.remove('visible');
            pullToRefreshElement.querySelector('.refresh-text').textContent = 'Pull to refresh';
          }
        }
      }
    }, { passive: true });

    document.addEventListener('touchend', () => {
      if (isPulling && pullDistance > pullThreshold) {
        this.triggerPullToRefresh();
      }
      
      isPulling = false;
      pullDistance = 0;
      startY = 0;
      pullToRefreshElement.style.top = '-60px';
      pullToRefreshElement.classList.remove('visible');
    }, { passive: true });
  }

  /**
   * Trigger pull to refresh action
   */
  triggerPullToRefresh() {
    const pullToRefreshElement = document.querySelector('.pull-to-refresh');
    if (pullToRefreshElement) {
      pullToRefreshElement.classList.add('refreshing');
      pullToRefreshElement.querySelector('.refresh-text').textContent = 'Refreshing...';
    }

    // Refresh repository stats
    if (window.fetchRepoStats) {
      window.fetchRepoStats();
    }

    // Refresh GitHub activity
    if (window.githubActivity && window.githubActivity.refreshActivity) {
      window.githubActivity.refreshActivity();
    }

    // Hide refresh indicator after completion
    setTimeout(() => {
      if (pullToRefreshElement) {
        pullToRefreshElement.classList.remove('refreshing');
        pullToRefreshElement.style.top = '-60px';
      }
    }, 2000);
  }

  /**
   * Optimize touch targets
   */
  optimizeTouchTargets() {
    if (!this.isMobile) return;

    const smallTargets = document.querySelectorAll('button, a, input, select');
    
    smallTargets.forEach(target => {
      const rect = target.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        target.style.minWidth = '44px';
        target.style.minHeight = '44px';
        target.style.display = 'inline-flex';
        target.style.alignItems = 'center';
        target.style.justifyContent = 'center';
      }
    });
  }

  /**
   * Add haptic feedback (if supported)
   */
  addHapticFeedback(type = 'light') {
    if (navigator.vibrate) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30],
        success: [10, 50, 10],
        error: [50, 50, 50]
      };
      
      navigator.vibrate(patterns[type] || patterns.light);
    }
  }

  /**
   * Get mobile device information
   */
  getMobileInfo() {
    return {
      isMobile: this.isMobile,
      isTouch: 'ontouchstart' in window,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1
      },
      orientation: window.orientation || 0,
      userAgent: navigator.userAgent
    };
  }

  /**
   * Optimize for specific mobile scenarios
   */
  optimizeForMobile() {
    if (!this.isMobile) return;

    // Disable hover effects on touch devices
    const style = document.createElement('style');
    style.textContent = `
      @media (hover: none) and (pointer: coarse) {
        .btn:hover,
        .feature-card:hover,
        .timeline-item:hover {
          transform: none !important;
          box-shadow: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Optimize scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Prevent double-tap zoom on specific elements
    const preventZoomElements = document.querySelectorAll('button, .btn, input, select');
    preventZoomElements.forEach(element => {
      element.addEventListener('touchend', (e) => {
        e.preventDefault();
        element.click();
      });
    });
  }
}

// Initialize mobile experience enhancer
if (typeof window !== 'undefined') {
  window.mobileExperienceEnhancer = new MobileExperienceEnhancer();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MobileExperienceEnhancer;
}