/**
 * Enhanced Analytics System for CocoPilot
 * Provides comprehensive user behavior tracking and performance monitoring
 */

class EnhancedAnalytics {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.events = [];
    this.performanceMetrics = {};
    this.userBehavior = {
      pageViews: 0,
      interactions: 0,
      timeOnSections: {},
      scrollDepth: 0,
      features_used: [],
      errors: []
    };

    // Configuration
    this.config = {
      batchSize: 10,
      sendInterval: 30000, // 30 seconds
      maxStoredEvents: 100,
      enableHeatmap: true,
      enableScrollTracking: true,
      enablePerformanceMonitoring: true
    };

    this.initialize();
  }

  async initialize() {
    try {
      console.log('📈 Initializing Enhanced Analytics...');

      // Set up tracking
      this.setupEventTracking();
      this.setupPerformanceMonitoring();
      this.setupUserBehaviorTracking();

      // Start periodic reporting
      this.startPeriodicReporting();

      // Initialize heat mapping if enabled
      if (this.config.enableHeatmap) {
        this.initializeHeatMapping();
      }

      console.log('✅ Enhanced Analytics initialized');

    } catch (error) {
      console.error('❌ Error initializing Enhanced Analytics:', error);
    }
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  setupEventTracking() {
    // Track page views
    this.trackEvent('page_view', {
      url: window.location.href,
      referrer: document.referrer,
      timestamp: Date.now()
    });

    // Track clicks
    document.addEventListener('click', (e) => {
      this.trackClick(e);
    });

    // Track form submissions
    document.addEventListener('submit', (e) => {
      this.trackFormSubmission(e);
    });

    // Track keyboard interactions
    document.addEventListener('keydown', (e) => {
      this.trackKeyboardInteraction(e);
    });

    // Track visibility changes
    document.addEventListener('visibilitychange', () => {
      this.trackVisibilityChange();
    });

    // Track errors
    window.addEventListener('error', (e) => {
      this.trackError(e);
    });

    window.addEventListener('unhandledrejection', (e) => {
      this.trackError(e, 'promise_rejection');
    });
  }

  setupPerformanceMonitoring() {
    if (!this.config.enablePerformanceMonitoring) {
      return;
    }

    // Monitor Core Web Vitals
    this.monitorCoreWebVitals();

    // Monitor resource loading
    this.monitorResourceLoading();

    // Monitor JavaScript execution time
    this.monitorJSPerformance();

    // Custom performance marks
    this.createPerformanceMarks();
  }

  setupUserBehaviorTracking() {
    // Scroll depth tracking
    if (this.config.enableScrollTracking) {
      this.setupScrollTracking();
    }

    // Time on section tracking
    this.setupSectionTimeTracking();

    // Feature usage tracking
    this.setupFeatureUsageTracking();

    // Mouse movement tracking (for heatmap)
    if (this.config.enableHeatmap) {
      this.setupMouseTracking();
    }
  }

  trackEvent(eventType, data = {}) {
    const event = {
      id: this.generateEventId(),
      sessionId: this.sessionId,
      type: eventType,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      ...data
    };

    this.events.push(event);
    this.userBehavior.interactions++;

    // Send to Google Analytics if available
    if (window.gtag) {
      gtag('event', eventType, {
        session_id: this.sessionId,
        custom_parameter: JSON.stringify(data)
      });
    }

    // Batch send if we have enough events
    if (this.events.length >= this.config.batchSize) {
      this.sendEvents();
    }

    console.log('📊 Event tracked:', eventType, data);
  }

  trackClick(event) {
    const element = event.target;
    const clickData = {
      elementTag: element.tagName.toLowerCase(),
      elementClass: element.className,
      elementId: element.id,
      elementText: element.textContent?.substring(0, 100),
      coordinates: {
        x: event.clientX,
        y: event.clientY
      },
      isButton: element.tagName === 'BUTTON' || element.type === 'button',
      isLink: element.tagName === 'A'
    };

    // Track special interactions
    if (element.classList.contains('feature')) {
      this.userBehavior.features_used.push(element.dataset.feature || 'unknown');
    }

    this.trackEvent('click', clickData);
  }

  trackFormSubmission(event) {
    const form = event.target;
    const formData = {
      formId: form.id,
      formClass: form.className,
      action: form.action,
      method: form.method,
      fieldCount: form.elements.length
    };

    this.trackEvent('form_submit', formData);
  }

  trackKeyboardInteraction(event) {
    // Only track meaningful keyboard interactions
    const importantKeys = ['Enter', 'Escape', 'Tab', 'Space'];
    const isShortcut = event.ctrlKey || event.metaKey || event.altKey;

    if (importantKeys.includes(event.key) || isShortcut) {
      const keyData = {
        key: event.key,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        altKey: event.altKey,
        shiftKey: event.shiftKey,
        targetElement: event.target.tagName.toLowerCase()
      };

      this.trackEvent('keyboard_interaction', keyData);
    }
  }

  trackVisibilityChange() {
    const visibilityData = {
      hidden: document.hidden,
      visibilityState: document.visibilityState,
      timeOnPage: Date.now() - this.startTime
    };

    this.trackEvent('visibility_change', visibilityData);
  }

  trackError(error, type = 'javascript_error') {
    const errorData = {
      message: error.message || error.reason?.message || 'Unknown error',
      filename: error.filename || 'Unknown',
      lineno: error.lineno || 0,
      colno: error.colno || 0,
      stack: error.error?.stack || error.reason?.stack || 'No stack trace',
      type: type
    };

    this.userBehavior.errors.push(errorData);
    this.trackEvent('error', errorData);
  }

  monitorCoreWebVitals() {
    // First Contentful Paint (FCP)
    this.observePerformanceEntries('paint', (entries) => {
      entries.forEach(entry => {
        if (entry.name === 'first-contentful-paint') {
          this.performanceMetrics.fcp = entry.startTime;
          this.trackEvent('core_web_vital', {
            metric: 'FCP',
            value: entry.startTime,
            rating: this.getCWVRating('FCP', entry.startTime)
          });
        }
      });
    });

    // Largest Contentful Paint (LCP)
    this.observePerformanceEntries('largest-contentful-paint', (entries) => {
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        this.performanceMetrics.lcp = lastEntry.startTime;
        this.trackEvent('core_web_vital', {
          metric: 'LCP',
          value: lastEntry.startTime,
          rating: this.getCWVRating('LCP', lastEntry.startTime)
        });
      }
    });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    this.observePerformanceEntries('layout-shift', (entries) => {
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });

      this.performanceMetrics.cls = clsValue;
      this.trackEvent('core_web_vital', {
        metric: 'CLS',
        value: clsValue,
        rating: this.getCWVRating('CLS', clsValue)
      });
    });
  }

  observePerformanceEntries(type, callback) {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          callback(list.getEntries());
        });
        observer.observe({ entryTypes: [type] });
      } catch (e) {
        console.warn('Performance observer not supported for:', type);
      }
    }
  }

  getCWVRating(metric, value) {
    const thresholds = {
      FCP: { good: 1800, needs_improvement: 3000 },
      LCP: { good: 2500, needs_improvement: 4000 },
      CLS: { good: 0.1, needs_improvement: 0.25 }
    };

    const threshold = thresholds[metric];
    if (!threshold) {
      return 'unknown';
    }

    if (value <= threshold.good) {
      return 'good';
    }
    if (value <= threshold.needs_improvement) {
      return 'needs_improvement';
    }
    return 'poor';
  }

  monitorResourceLoading() {
    // Monitor navigation timing
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          this.performanceMetrics.navigation = {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            totalTime: navigation.loadEventEnd - navigation.fetchStart
          };

          this.trackEvent('navigation_timing', this.performanceMetrics.navigation);
        }
      }, 100);
    });

    // Monitor resource timing
    this.observePerformanceEntries('resource', (entries) => {
      entries.forEach(entry => {
        if (entry.duration > 1000) { // Only report slow resources
          this.trackEvent('slow_resource', {
            name: entry.name,
            duration: entry.duration,
            size: entry.transferSize || 0,
            type: this.getResourceType(entry.name)
          });
        }
      });
    });
  }

  getResourceType(url) {
    if (url.includes('.js')) {
      return 'javascript';
    }
    if (url.includes('.css')) {
      return 'stylesheet';
    }
    if (url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) {
      return 'image';
    }
    if (url.includes('.html')) {
      return 'document';
    }
    return 'other';
  }

  monitorJSPerformance() {
    // Monitor long tasks
    this.observePerformanceEntries('longtask', (entries) => {
      entries.forEach(entry => {
        this.trackEvent('long_task', {
          duration: entry.duration,
          startTime: entry.startTime,
          attribution: entry.attribution?.[0]?.name || 'unknown'
        });
      });
    });
  }

  createPerformanceMarks() {
    // Create custom performance marks for key application events
    const marks = [
      'app_init_start',
      'modules_loaded',
      'ui_ready',
      'data_loaded'
    ];

    marks.forEach(mark => {
      if (performance.mark) {
        performance.mark(mark);
      }
    });
  }

  setupScrollTracking() {
    let maxScrollDepth = 0;
    let scrollTimer = null;

    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);

      scrollTimer = setTimeout(() => {
        const scrollDepth = Math.round(
          (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );

        if (scrollDepth > maxScrollDepth) {
          maxScrollDepth = scrollDepth;
          this.userBehavior.scrollDepth = maxScrollDepth;

          // Track milestone scroll depths
          if (maxScrollDepth % 25 === 0 && maxScrollDepth > 0) {
            this.trackEvent('scroll_depth', {
              depth: maxScrollDepth,
              timestamp: Date.now() - this.startTime
            });
          }
        }
      }, 100);
    });
  }

  setupSectionTimeTracking() {
    const sections = document.querySelectorAll('section, .section, [id]');
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const sectionId = entry.target.id || entry.target.className || 'unknown';

        if (entry.isIntersecting) {
          this.userBehavior.timeOnSections[sectionId] = {
            startTime: Date.now(),
            totalTime: this.userBehavior.timeOnSections[sectionId]?.totalTime || 0
          };
        } else if (this.userBehavior.timeOnSections[sectionId]?.startTime) {
          const timeSpent = Date.now() - this.userBehavior.timeOnSections[sectionId].startTime;
          this.userBehavior.timeOnSections[sectionId].totalTime += timeSpent;
          this.userBehavior.timeOnSections[sectionId].startTime = null;

          // Track significant time spent in sections
          if (timeSpent > 5000) { // More than 5 seconds
            this.trackEvent('section_engagement', {
              sectionId: sectionId,
              timeSpent: timeSpent,
              totalTime: this.userBehavior.timeOnSections[sectionId].totalTime
            });
          }
        }
      });
    }, { threshold: 0.5 });

    sections.forEach(section => sectionObserver.observe(section));
  }

  setupFeatureUsageTracking() {
    // Track feature interactions
    document.addEventListener('click', (e) => {
      const element = e.target.closest('[data-feature]');
      if (element) {
        const feature = element.dataset.feature;
        this.trackEvent('feature_usage', {
          feature: feature,
          element: element.tagName.toLowerCase(),
          context: this.getElementContext(element)
        });
      }
    });

    // Track button interactions
    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        this.trackEvent('button_click', {
          buttonText: e.target.textContent.trim(),
          buttonClass: e.target.className,
          buttonId: e.target.id
        });
      }
    });
  }

  setupMouseTracking() {
    const mouseData = [];
    let lastRecordTime = 0;

    document.addEventListener('mousemove', (e) => {
      const now = Date.now();

      // Sample mouse movements (every 100ms to avoid too much data)
      if (now - lastRecordTime > 100) {
        mouseData.push({
          x: e.clientX,
          y: e.clientY,
          timestamp: now - this.startTime
        });

        lastRecordTime = now;

        // Send mouse data in batches
        if (mouseData.length >= 50) {
          this.trackEvent('mouse_heatmap', {
            movements: mouseData.splice(0, 25) // Send half, keep half
          });
        }
      }
    });
  }

  getElementContext(element) {
    const rect = element.getBoundingClientRect();
    return {
      position: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      },
      visible: rect.top < window.innerHeight && rect.bottom > 0,
      inViewport: rect.top >= 0 && rect.bottom <= window.innerHeight
    };
  }

  initializeHeatMapping() {
    // Create heatmap visualization (simplified)
    this.heatmapData = new Map();

    document.addEventListener('click', (e) => {
      const key = `${Math.floor(e.clientX / 10)}_${Math.floor(e.clientY / 10)}`;
      this.heatmapData.set(key, (this.heatmapData.get(key) || 0) + 1);
    });
  }

  generateEventId() {
    return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  sendEvents() {
    if (this.events.length === 0) {
      return;
    }

    // In a real implementation, you would send this to your analytics backend
    console.log('📤 Sending analytics events:', this.events.length);

    // For now, just log to console and clear events
    this.events.splice(0, this.config.batchSize);
  }

  startPeriodicReporting() {
    setInterval(() => {
      this.generateReport();
      this.sendEvents();
    }, this.config.sendInterval);
  }

  generateReport() {
    const report = {
      sessionId: this.sessionId,
      sessionDuration: Date.now() - this.startTime,
      userBehavior: this.userBehavior,
      performanceMetrics: this.performanceMetrics,
      browserInfo: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine
      },
      pageInfo: {
        url: window.location.href,
        title: document.title,
        referrer: document.referrer
      }
    };

    console.log('📊 Analytics Report:', report);
    return report;
  }

  // Public API
  trackCustomEvent(eventName, data) {
    this.trackEvent(eventName, data);
  }

  getAnalyticsData() {
    return {
      events: this.events,
      userBehavior: this.userBehavior,
      performanceMetrics: this.performanceMetrics,
      sessionId: this.sessionId
    };
  }

  exportData() {
    const data = this.generateReport();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `cocopilot-analytics-${this.sessionId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Integration with other systems
  onModuleLoaded(moduleName) {
    this.trackEvent('module_loaded', {
      module: moduleName,
      loadTime: Date.now() - this.startTime
    });
  }

  onFeatureUsed(featureName, context = {}) {
    this.trackEvent('feature_used', {
      feature: featureName,
      ...context
    });
  }

  onError(error, context = {}) {
    this.trackError(error);
    this.trackEvent('application_error', {
      message: error.message,
      ...context
    });
  }
}

// Initialize enhanced analytics
function initializeEnhancedAnalytics() {
  if (window.enhancedAnalytics) {
    return;
  }

  window.enhancedAnalytics = new EnhancedAnalytics();

  // Add global helper functions
  window.trackEvent = (eventName, data) => {
    window.enhancedAnalytics.trackCustomEvent(eventName, data);
  };

  window.exportAnalytics = () => {
    window.enhancedAnalytics.exportData();
  };
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeEnhancedAnalytics);
} else {
  initializeEnhancedAnalytics();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnhancedAnalytics;
}