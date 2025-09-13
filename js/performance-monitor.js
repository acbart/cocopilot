/**
 * Advanced Performance Monitoring and Optimization
 * Provides comprehensive performance metrics and optimization features
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoad: null,
      firstContentfulPaint: null,
      largestContentfulPaint: null,
      cumulativeLayoutShift: null,
      firstInputDelay: null,
      timeToInteractive: null
    };

    this.observers = [];
    this.isMonitoring = false;

    this.init();
  }

  init() {
    this.startMonitoring();
    this.setupPerformanceObservers();
    this.addPerformanceDashboard();
    this.optimizeImages();
    this.implementIntersectionObserver();
  }

  startMonitoring() {
    if (this.isMonitoring) {
      return;
    }
    this.isMonitoring = true;

    // Measure page load time
    window.addEventListener('load', () => {
      const navigationTiming = performance.getEntriesByType('navigation')[0];
      this.metrics.pageLoad = navigationTiming.loadEventEnd - navigationTiming.loadEventStart;
      this.updateDashboard();
    });

    // Measure DOM Content Loaded
    document.addEventListener('DOMContentLoaded', () => {
      const navigationTiming = performance.getEntriesByType('navigation')[0];
      this.metrics.domContentLoaded = navigationTiming.domContentLoadedEventEnd - navigationTiming.domContentLoadedEventStart;
    });
  }

  setupPerformanceObservers() {
    // Cumulative Layout Shift (CLS) Observer
    if ('LayoutShiftObserver' in window || 'PerformanceObserver' in window) {
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          this.metrics.cumulativeLayoutShift = clsValue;
          this.updateDashboard();
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn('Layout Shift Observer not supported:', e);
      }
    }

    // Largest Contentful Paint (LCP) Observer
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.metrics.largestContentfulPaint = entry.startTime;
        }
        this.updateDashboard();
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
    } catch (e) {
      console.warn('LCP Observer not supported:', e);
    }

    // First Input Delay (FID) Observer
    try {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
        }
        this.updateDashboard();
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);
    } catch (e) {
      console.warn('FID Observer not supported:', e);
    }

    // First Contentful Paint Observer
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.firstContentfulPaint = entry.startTime;
          }
        }
        this.updateDashboard();
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(fcpObserver);
    } catch (e) {
      console.warn('FCP Observer not supported:', e);
    }
  }

  addPerformanceDashboard() {
    // Only add in development or when explicitly enabled
    if (!this.shouldShowDashboard()) {
      return;
    }

    const dashboard = document.createElement('div');
    dashboard.id = 'performance-dashboard';
    dashboard.innerHTML = `
      <div class="perf-header">
        <h4>⚡ Performance Metrics</h4>
        <button class="perf-toggle" onclick="window.performanceMonitor.toggleDashboard()">×</button>
      </div>
      <div class="perf-metrics">
        <div class="perf-metric">
          <span class="perf-label">LCP</span>
          <span class="perf-value" id="lcp-value">-</span>
        </div>
        <div class="perf-metric">
          <span class="perf-label">FID</span>
          <span class="perf-value" id="fid-value">-</span>
        </div>
        <div class="perf-metric">
          <span class="perf-label">CLS</span>
          <span class="perf-value" id="cls-value">-</span>
        </div>
        <div class="perf-metric">
          <span class="perf-label">FCP</span>
          <span class="perf-value" id="fcp-value">-</span>
        </div>
      </div>
    `;

    this.addDashboardStyles();
    document.body.appendChild(dashboard);
  }

  addDashboardStyles() {
    if (document.getElementById('performance-dashboard-styles')) {
      return;
    }

    const styles = document.createElement('style');
    styles.id = 'performance-dashboard-styles';
    styles.textContent = `
      #performance-dashboard {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 12px;
        border-radius: 8px;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        z-index: 9999;
        min-width: 200px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: all 0.3s ease;
      }

      #performance-dashboard.hidden {
        transform: translateY(100%);
        opacity: 0;
      }

      .perf-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        padding-bottom: 4px;
      }

      .perf-header h4 {
        margin: 0;
        font-size: 13px;
        font-weight: 600;
      }

      .perf-toggle {
        background: none;
        border: none;
        color: white;
        font-size: 16px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .perf-toggle:hover {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
      }

      .perf-metrics {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }

      .perf-metric {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px 8px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
      }

      .perf-label {
        font-weight: 600;
        color: #4ade80;
      }

      .perf-value {
        font-weight: 700;
      }

      .perf-value.good { color: #10b981; }
      .perf-value.fair { color: #f59e0b; }
      .perf-value.poor { color: #ef4444; }

      @media (max-width: 768px) {
        #performance-dashboard {
          bottom: 10px;
          right: 10px;
          left: 10px;
          min-width: auto;
        }
        
        .perf-metrics {
          grid-template-columns: 1fr;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  shouldShowDashboard() {
    // Show if in development mode or performance debugging is enabled
    return window.location.hostname === 'localhost' ||
           window.location.search.includes('debug=performance') ||
           localStorage.getItem('cocopilot-show-performance') === 'true';
  }

  updateDashboard() {
    const lcpElement = document.getElementById('lcp-value');
    const fidElement = document.getElementById('fid-value');
    const clsElement = document.getElementById('cls-value');
    const fcpElement = document.getElementById('fcp-value');

    if (lcpElement && this.metrics.largestContentfulPaint !== null) {
      const lcp = Math.round(this.metrics.largestContentfulPaint);
      lcpElement.textContent = `${lcp}ms`;
      lcpElement.className = `perf-value ${this.getLCPRating(lcp)}`;
    }

    if (fidElement && this.metrics.firstInputDelay !== null) {
      const fid = Math.round(this.metrics.firstInputDelay);
      fidElement.textContent = `${fid}ms`;
      fidElement.className = `perf-value ${this.getFIDRating(fid)}`;
    }

    if (clsElement && this.metrics.cumulativeLayoutShift !== null) {
      const cls = Math.round(this.metrics.cumulativeLayoutShift * 1000) / 1000;
      clsElement.textContent = cls.toFixed(3);
      clsElement.className = `perf-value ${this.getCLSRating(cls)}`;
    }

    if (fcpElement && this.metrics.firstContentfulPaint !== null) {
      const fcp = Math.round(this.metrics.firstContentfulPaint);
      fcpElement.textContent = `${fcp}ms`;
      fcpElement.className = `perf-value ${this.getFCPRating(fcp)}`;
    }
  }

  getLCPRating(lcp) {
    if (lcp <= 2500) {
      return 'good';
    }
    if (lcp <= 4000) {
      return 'fair';
    }
    return 'poor';
  }

  getFIDRating(fid) {
    if (fid <= 100) {
      return 'good';
    }
    if (fid <= 300) {
      return 'fair';
    }
    return 'poor';
  }

  getCLSRating(cls) {
    if (cls <= 0.1) {
      return 'good';
    }
    if (cls <= 0.25) {
      return 'fair';
    }
    return 'poor';
  }

  getFCPRating(fcp) {
    if (fcp <= 1800) {
      return 'good';
    }
    if (fcp <= 3000) {
      return 'fair';
    }
    return 'poor';
  }

  toggleDashboard() {
    const dashboard = document.getElementById('performance-dashboard');
    if (dashboard) {
      dashboard.classList.toggle('hidden');
      localStorage.setItem('cocopilot-show-performance', !dashboard.classList.contains('hidden'));
    }
  }

  optimizeImages() {
    // Lazy load images that are not critical
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      images.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  }

  implementIntersectionObserver() {
    // Optimize animations and heavy elements
    if ('IntersectionObserver' in window) {
      const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '50px'
      });

      // Observe elements that should be animated when visible
      const animatedElements = document.querySelectorAll('.data-viz-container, .timeline-container, .github-activity');
      animatedElements.forEach(el => animationObserver.observe(el));
    }
  }

  // Resource loading optimization
  preloadCriticalResources() {
    const criticalResources = [
      '/js/i18n.js',
      '/js/github-activity.js',
      '/favicon.svg'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = resource.endsWith('.js') ? 'script' : 'image';
      link.href = resource;
      document.head.appendChild(link);
    });
  }

  // Memory management
  cleanup() {
    this.observers.forEach(observer => {
      if (observer && observer.disconnect) {
        observer.disconnect();
      }
    });
    this.observers = [];
    this.isMonitoring = false;
  }

  // Get comprehensive performance report
  getPerformanceReport() {
    const report = {
      ...this.metrics,
      timestamp: new Date().toISOString(),
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
    };

    return report;
  }

  // Export performance data for analysis
  exportPerformanceData() {
    const report = this.getPerformanceReport();
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `cocopilot-performance-${Date.now()}.json`;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }
}

// Global instance
window.performanceMonitor = null;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.performanceMonitor = new PerformanceMonitor();
  });
} else {
  window.performanceMonitor = new PerformanceMonitor();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (window.performanceMonitor) {
    window.performanceMonitor.cleanup();
  }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceMonitor;
}