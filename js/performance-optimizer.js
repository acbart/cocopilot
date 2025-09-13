/**
 * Advanced Performance Optimizer
 * Extends the existing performance monitoring with optimization features
 */

class PerformanceOptimizer {
  constructor() {
    this.optimizations = {
      imageOptimization: false,
      resourcePrefetching: false,
      codeOptimization: false,
      renderOptimization: false
    };
    
    this.metrics = {
      bundleSize: 0,
      resourceCount: 0,
      cacheHitRate: 0,
      optimizationScore: 0
    };

    this.thresholds = {
      lcp: 2500, // 2.5s
      fid: 100,  // 100ms
      cls: 0.1,  // 0.1
      fcp: 1800  // 1.8s
    };

    this.init();
  }

  init() {
    this.optimizeResourceLoading();
    this.implementIntelligentPrefetching();
    this.optimizeRendering();
    this.addOptimizationDashboard();
    this.schedulePerformanceAudit();
  }

  /**
   * Optimize resource loading strategies
   */
  optimizeResourceLoading() {
    // Implement resource hints
    this.addResourceHints();
    
    // Lazy load images
    this.implementLazyLoading();
    
    // Optimize font loading
    this.optimizeFontLoading();
    
    // Implement service worker optimizations
    this.enhanceServiceWorker();

    this.optimizations.resourcePrefetching = true;
  }

  /**
   * Add resource hints for better performance
   */
  addResourceHints() {
    const hints = [
      { rel: 'dns-prefetch', href: '//api.github.com' },
      { rel: 'dns-prefetch', href: '//github.com' },
      { rel: 'preconnect', href: 'https://api.github.com', crossorigin: true }
    ];

    hints.forEach(hint => {
      if (!document.querySelector(`link[href="${hint.href}"]`)) {
        const link = document.createElement('link');
        link.rel = hint.rel;
        link.href = hint.href;
        if (hint.crossorigin) link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      }
    });
  }

  /**
   * Implement intelligent lazy loading
   */
  implementLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              observer.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      // Apply to images that don't have src
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });

      // Apply to future images
      const mutationObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) {
              const images = node.querySelectorAll ? 
                node.querySelectorAll('img[data-src]') : 
                [];
              images.forEach(img => imageObserver.observe(img));
            }
          });
        });
      });

      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });

      this.optimizations.imageOptimization = true;
    }
  }

  /**
   * Optimize font loading
   */
  optimizeFontLoading() {
    // Use font-display: swap for better perceived performance
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'System';
        font-display: swap;
        src: local('system-ui'), local('-apple-system'), local('BlinkMacSystemFont');
      }
    `;
    document.head.appendChild(style);

    // Preload critical fonts if any
    const criticalFonts = [
      // Add any critical fonts here
    ];

    criticalFonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = font.url;
      link.as = 'font';
      link.type = font.type;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  /**
   * Enhance service worker with advanced caching strategies
   */
  enhanceServiceWorker() {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // Send optimization preferences to service worker
      navigator.serviceWorker.controller.postMessage({
        type: 'OPTIMIZATION_CONFIG',
        config: {
          enableAdvancedCaching: true,
          prefetchStrategy: 'intelligent',
          cacheTimeout: 3600000 // 1 hour
        }
      });
    }
  }

  /**
   * Implement intelligent prefetching
   */
  implementIntelligentPrefetching() {
    // Prefetch likely navigation targets
    this.prefetchLikelyPages();
    
    // Prefetch API endpoints
    this.prefetchAPIEndpoints();
    
    // Implement hover-based prefetching
    this.implementHoverPrefetching();
  }

  /**
   * Prefetch likely pages based on user behavior
   */
  prefetchLikelyPages() {
    const likelyPages = [
      '/README.md',
      '/CHANGELOG.md',
      '/tomorrow.md'
    ];

    // Use requestIdleCallback for non-critical prefetching
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        likelyPages.forEach(page => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = page;
          document.head.appendChild(link);
        });
      });
    }
  }

  /**
   * Prefetch API endpoints
   */
  prefetchAPIEndpoints() {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Prefetch repository stats if not already loaded
        if (!window.repoStatsLoaded) {
          fetch('https://api.github.com/repos/acbart/cocopilot', {
            method: 'HEAD' // Just check if endpoint is available
          }).catch(() => {
            // Ignore prefetch errors
          });
        }
      });
    }
  }

  /**
   * Implement hover-based prefetching
   */
  implementHoverPrefetching() {
    let prefetchTimeout;
    
    document.addEventListener('mouseover', (event) => {
      const link = event.target.closest('a[href]');
      if (link && link.hostname === window.location.hostname) {
        prefetchTimeout = setTimeout(() => {
          if (!document.querySelector(`link[rel="prefetch"][href="${link.href}"]`)) {
            const prefetchLink = document.createElement('link');
            prefetchLink.rel = 'prefetch';
            prefetchLink.href = link.href;
            document.head.appendChild(prefetchLink);
          }
        }, 100); // Small delay to avoid excessive prefetching
      }
    });

    document.addEventListener('mouseout', () => {
      if (prefetchTimeout) {
        clearTimeout(prefetchTimeout);
      }
    });
  }

  /**
   * Optimize rendering performance
   */
  optimizeRendering() {
    // Use CSS containment for better performance
    this.applyCSSContainment();
    
    // Optimize animations
    this.optimizeAnimations();
    
    // Implement virtual scrolling for large lists
    this.implementVirtualScrolling();

    this.optimizations.renderOptimization = true;
  }

  /**
   * Apply CSS containment for better performance
   */
  applyCSSContainment() {
    const style = document.createElement('style');
    style.textContent = `
      .feature-card, .timeline-item, .commit-item {
        contain: layout style paint;
      }
      
      .floating-element {
        contain: layout;
        will-change: transform;
      }
      
      .performance-dashboard {
        contain: layout style;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Optimize animations
   */
  optimizeAnimations() {
    // Ensure animations use GPU acceleration
    const style = document.createElement('style');
    style.textContent = `
      .floating-element,
      .timeline-item,
      .feature-card {
        transform: translateZ(0);
        backface-visibility: hidden;
      }
      
      @media (prefers-reduced-motion: reduce) {
        .floating-element {
          animation: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Implement virtual scrolling for performance
   */
  implementVirtualScrolling() {
    // This would be implemented for large lists
    // For now, we'll optimize existing lists
    const commitList = document.querySelector('.commits-list');
    if (commitList) {
      // Add scroll optimization
      let scrollTimeout;
      commitList.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          // Optimize scroll performance
          this.optimizeVisibleItems(commitList);
        }, 16); // 60fps
      }, { passive: true });
    }
  }

  /**
   * Optimize visible items during scroll
   */
  optimizeVisibleItems(container) {
    const items = container.querySelectorAll('.commit-item');
    const containerRect = container.getBoundingClientRect();
    
    items.forEach(item => {
      const itemRect = item.getBoundingClientRect();
      const isVisible = itemRect.bottom > containerRect.top && 
                       itemRect.top < containerRect.bottom;
      
      if (isVisible) {
        item.style.willChange = 'transform';
      } else {
        item.style.willChange = 'auto';
      }
    });
  }

  /**
   * Add optimization dashboard
   */
  addOptimizationDashboard() {
    if (!this.shouldShowDashboard()) {
      return;
    }

    // Extend existing performance dashboard
    const existingDashboard = document.getElementById('performance-dashboard');
    if (existingDashboard) {
      this.enhanceExistingDashboard(existingDashboard);
    } else {
      this.createOptimizationDashboard();
    }
  }

  /**
   * Enhance existing performance dashboard
   */
  enhanceExistingDashboard(dashboard) {
    const optimizationSection = document.createElement('div');
    optimizationSection.className = 'optimization-section';
    optimizationSection.innerHTML = `
      <div class="optimization-header">
        <h5>🚀 Optimizations</h5>
      </div>
      <div class="optimization-status">
        <div class="opt-item ${this.optimizations.imageOptimization ? 'enabled' : 'disabled'}">
          <span class="opt-label">Images</span>
          <span class="opt-status">${this.optimizations.imageOptimization ? '✓' : '○'}</span>
        </div>
        <div class="opt-item ${this.optimizations.resourcePrefetching ? 'enabled' : 'disabled'}">
          <span class="opt-label">Prefetch</span>
          <span class="opt-status">${this.optimizations.resourcePrefetching ? '✓' : '○'}</span>
        </div>
        <div class="opt-item ${this.optimizations.renderOptimization ? 'enabled' : 'disabled'}">
          <span class="opt-label">Render</span>
          <span class="opt-status">${this.optimizations.renderOptimization ? '✓' : '○'}</span>
        </div>
      </div>
      <div class="optimization-score">
        <span class="score-label">Score:</span>
        <span class="score-value" id="optimization-score">${this.calculateOptimizationScore()}</span>
      </div>
    `;

    dashboard.appendChild(optimizationSection);
    this.addOptimizationStyles();
  }

  /**
   * Calculate optimization score
   */
  calculateOptimizationScore() {
    const enabledOptimizations = Object.values(this.optimizations).filter(Boolean).length;
    const totalOptimizations = Object.keys(this.optimizations).length;
    return Math.round((enabledOptimizations / totalOptimizations) * 100);
  }

  /**
   * Add optimization-specific styles
   */
  addOptimizationStyles() {
    if (document.getElementById('optimization-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'optimization-styles';
    style.textContent = `
      .optimization-section {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid rgba(255, 255, 255, 0.2);
      }

      .optimization-header h5 {
        margin: 0 0 8px 0;
        font-size: 0.8em;
        color: #ffd700;
        font-weight: 600;
      }

      .optimization-status {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 4px;
        margin-bottom: 8px;
      }

      .opt-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.7em;
        padding: 2px 4px;
        border-radius: 3px;
        background: rgba(255, 255, 255, 0.1);
      }

      .opt-item.enabled {
        background: rgba(76, 175, 80, 0.2);
        color: #4caf50;
      }

      .opt-item.disabled {
        background: rgba(255, 255, 255, 0.05);
        color: rgba(255, 255, 255, 0.6);
      }

      .opt-label {
        font-size: 0.65em;
      }

      .opt-status {
        font-weight: bold;
        font-size: 0.8em;
      }

      .optimization-score {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.75em;
        padding: 4px 0;
      }

      .score-value {
        font-weight: bold;
        color: #ffd700;
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Schedule performance audit
   */
  schedulePerformanceAudit() {
    // Run audit after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.runPerformanceAudit();
      }, 2000);
    });

    // Run periodic audits
    setInterval(() => {
      this.runPerformanceAudit();
    }, 30000); // Every 30 seconds
  }

  /**
   * Run comprehensive performance audit
   */
  runPerformanceAudit() {
    const audit = {
      timestamp: Date.now(),
      metrics: this.gatherPerformanceMetrics(),
      optimizations: this.optimizations,
      recommendations: this.generateRecommendations()
    };

    // Update optimization score
    const scoreElement = document.getElementById('optimization-score');
    if (scoreElement) {
      scoreElement.textContent = this.calculateOptimizationScore();
    }

    // Log audit results in development
    if (this.isDevelopment()) {
      console.log('Performance Audit:', audit);
    }

    return audit;
  }

  /**
   * Gather performance metrics
   */
  gatherPerformanceMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    
    return {
      pageLoadTime: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
      domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : 0,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      resourceCount: performance.getEntriesByType('resource').length,
      memoryUsage: performance.memory ? {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      } : null
    };
  }

  /**
   * Generate performance recommendations
   */
  generateRecommendations() {
    const recommendations = [];
    const metrics = this.gatherPerformanceMetrics();

    if (metrics.firstContentfulPaint > this.thresholds.fcp) {
      recommendations.push('Consider optimizing above-the-fold content loading');
    }

    if (metrics.resourceCount > 50) {
      recommendations.push('Consider bundling resources to reduce HTTP requests');
    }

    if (metrics.memoryUsage && metrics.memoryUsage.used > metrics.memoryUsage.total * 0.8) {
      recommendations.push('High memory usage detected - consider optimizing JavaScript');
    }

    return recommendations;
  }

  /**
   * Create new optimization dashboard
   */
  createOptimizationDashboard() {
    const dashboard = document.createElement('div');
    dashboard.id = 'performance-dashboard';
    dashboard.className = 'performance-dashboard';
    dashboard.innerHTML = `
      <div class="dashboard-header">
        <h4>⚡ Performance Metrics</h4>
        <button class="dashboard-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
      <div class="dashboard-content">
        <div class="metric-grid">
          <div class="metric-item">
            <span class="metric-label">LCP</span>
            <span class="metric-value" id="lcp-value">-</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">FID</span>
            <span class="metric-value" id="fid-value">-</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">CLS</span>
            <span class="metric-value" id="cls-value">-</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">FCP</span>
            <span class="metric-value" id="fcp-value">-</span>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(dashboard);
    this.addDashboardStyles();
    this.enhanceExistingDashboard(dashboard);
  }

  /**
   * Add dashboard-specific styles
   */
  addDashboardStyles() {
    if (document.getElementById('dashboard-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'dashboard-styles';
    style.textContent = `
      .performance-dashboard {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        border-radius: 10px;
        padding: 15px;
        min-width: 200px;
        font-size: 0.8em;
        z-index: 1000;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }

      .dashboard-header h4 {
        margin: 0;
        font-size: 0.9em;
        color: #ffd700;
      }

      .dashboard-close {
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
      }

      .dashboard-close:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .metric-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }

      .metric-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(255, 255, 255, 0.1);
        padding: 6px 8px;
        border-radius: 4px;
      }

      .metric-label {
        font-size: 0.7em;
        font-weight: 500;
      }

      .metric-value {
        font-weight: bold;
        color: #4caf50;
      }

      @media (max-width: 768px) {
        .performance-dashboard {
          bottom: 10px;
          right: 10px;
          left: 10px;
          max-width: none;
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Check if dashboard should be shown
   */
  shouldShowDashboard() {
    return this.isDevelopment() || localStorage.getItem('showPerformanceDashboard') === 'true';
  }

  /**
   * Check if running in development
   */
  isDevelopment() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1';
  }

  /**
   * Export performance data
   */
  exportPerformanceData() {
    const data = {
      audit: this.runPerformanceAudit(),
      browser: {
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        connection: navigator.connection ? {
          effectiveType: navigator.connection.effectiveType,
          downlink: navigator.connection.downlink,
          rtt: navigator.connection.rtt
        } : null
      },
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `cocopilot-performance-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }
}

// Initialize performance optimizer
if (typeof window !== 'undefined') {
  window.performanceOptimizer = new PerformanceOptimizer();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceOptimizer;
}