/**
 * Intelligent Module Loader for CocoPilot
 * Optimizes JavaScript module loading based on user behavior and device capabilities
 */

class ModuleLoader {
  constructor() {
    this.loadedModules = new Set();
    this.loadingPromises = new Map();
    this.loadQueue = [];
    this.isSlowConnection = this.detectSlowConnection();
    this.isMobileDevice = window.innerWidth < 768;
    this.userInteractionDetected = false;

    // Priority modules that should load immediately
    this.criticalModules = [
      'i18n',
      'enhanced-error-handler',
      'performance-monitor',
      'daily-insights',
      'project-health-monitor',
      'achievement-milestones',
      'daily-developer-tips'
    ];

    // Modules to load on user interaction
    this.interactionModules = [
      'advanced-search-system',
      'progress-indicator',
      'enhanced-mobile-experience',
      'help-system',
      'accessibility-enhancer',
      'smart-search',
      'user-feedback',
      'theme-enhancer'
    ];

    // Modules to load on viewport intersection
    this.viewportModules = [
      'data-viz',
      'github-activity',
      'timeline',
      'analytics-dashboard-enhanced'
    ];

    // Low priority modules
    this.backgroundModules = [
      'content-management-system',
      'enhanced-analytics',
      'floating-particles',
      'rss-generator',
      'rss-feed-builder',
      'performance-optimizer'
    ];

    this.initialize();
  }

  initialize() {
    console.log('📦 Initializing Intelligent Module Loader...');

    // Load critical modules immediately
    this.loadCriticalModules();

    // Set up interaction listeners
    this.setupInteractionListeners();

    // Set up viewport observers
    this.setupViewportObservers();

    // Load interaction modules after first user interaction
    this.scheduleInteractionModules();

    // Load background modules with idle time
    this.scheduleBackgroundModules();

    console.log('✅ Module Loader initialized');
  }

  detectSlowConnection() {
    if (navigator.connection) {
      const connection = navigator.connection;
      const slowConnections = ['slow-2g', '2g'];
      return slowConnections.includes(connection.effectiveType) ||
             connection.downlink < 1.5;
    }
    return false;
  }

  async loadModule(moduleName) {
    if (this.loadedModules.has(moduleName)) {
      return true;
    }

    if (this.loadingPromises.has(moduleName)) {
      return await this.loadingPromises.get(moduleName);
    }

    const loadPromise = this.performModuleLoad(moduleName);
    this.loadingPromises.set(moduleName, loadPromise);

    try {
      await loadPromise;
      this.loadedModules.add(moduleName);
      this.loadingPromises.delete(moduleName);
      console.log(`✅ Module loaded: ${moduleName}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to load module: ${moduleName}`, error);
      this.loadingPromises.delete(moduleName);
      return false;
    }
  }

  async performModuleLoad(moduleName) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `js/${moduleName}.js`;
      script.async = true;

      // Add loading timeout for slow connections
      const timeout = this.isSlowConnection ? 10000 : 5000;
      const timeoutId = setTimeout(() => {
        reject(new Error(`Module ${moduleName} load timeout`));
      }, timeout);

      script.onload = () => {
        clearTimeout(timeoutId);
        resolve();
      };

      script.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error(`Failed to load ${moduleName}`));
      };

      document.head.appendChild(script);
    });
  }

  async loadCriticalModules() {
    console.log('🚀 Loading critical modules...');

    const loadPromises = this.criticalModules.map(module =>
      this.loadModule(module)
    );

    try {
      await Promise.all(loadPromises);
      console.log('✅ Critical modules loaded');
    } catch (error) {
      console.error('❌ Error loading critical modules:', error);
    }
  }

  setupInteractionListeners() {
    const interactionEvents = ['click', 'touchstart', 'keydown', 'scroll'];

    const handleFirstInteraction = () => {
      if (!this.userInteractionDetected) {
        this.userInteractionDetected = true;
        console.log('👆 User interaction detected, loading interaction modules...');
        this.loadInteractionModules();

        // Remove listeners after first interaction
        interactionEvents.forEach(event => {
          document.removeEventListener(event, handleFirstInteraction, true);
        });
      }
    };

    interactionEvents.forEach(event => {
      document.addEventListener(event, handleFirstInteraction, true);
    });
  }

  async loadInteractionModules() {
    if (this.isSlowConnection) {
      // Load interaction modules one by one on slow connections
      for (const module of this.interactionModules) {
        await this.loadModule(module);
        await this.delay(200); // Small delay between loads
      }
    } else {
      // Load all interaction modules in parallel on fast connections
      const loadPromises = this.interactionModules.map(module =>
        this.loadModule(module)
      );
      await Promise.all(loadPromises);
    }
  }

  setupViewportObservers() {
    // Observe elements that trigger viewport-specific modules
    const observerOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.handleViewportIntersection(entry.target);
        }
      });
    }, observerOptions);

    // Observe dashboard and chart elements
    setTimeout(() => {
      const dashboardElements = document.querySelectorAll(
        '.project-health-dashboard, .features-showcase, .stats'
      );
      dashboardElements.forEach(el => observer.observe(el));
    }, 1000);
  }

  async handleViewportIntersection(element) {
    console.log('👀 Element in viewport, loading related modules...');

    if (element.classList.contains('project-health-dashboard') ||
        element.classList.contains('stats')) {
      await this.loadModule('github-activity');
      await this.loadModule('analytics-dashboard-enhanced');
    }

    if (element.classList.contains('features-showcase')) {
      await this.loadModule('data-viz');
      await this.loadModule('interactive-data-viz');
    }
  }

  scheduleInteractionModules() {
    // If no interaction after 3 seconds, load anyway
    setTimeout(() => {
      if (!this.userInteractionDetected) {
        console.log('⏰ Loading interaction modules after timeout...');
        this.loadInteractionModules();
      }
    }, 3000);
  }

  scheduleBackgroundModules() {
    // Use requestIdleCallback for background loading
    if (window.requestIdleCallback) {
      const loadBackgroundModules = (deadline) => {
        while (deadline.timeRemaining() > 0 && this.backgroundModules.length > 0) {
          const module = this.backgroundModules.shift();
          this.loadModule(module);
        }

        if (this.backgroundModules.length > 0) {
          requestIdleCallback(loadBackgroundModules);
        }
      };

      requestIdleCallback(loadBackgroundModules);
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        this.backgroundModules.forEach(module => {
          this.loadModule(module);
        });
      }, 5000);
    }
  }

  // Load modules based on page content
  loadPageSpecificModules() {
    const currentPage = this.detectCurrentPage();

    const pageModules = {
      home: ['ai-content-suggestions', 'guided-tour', 'onboarding', 'visual-enhancer'],
      features: ['ai-code-playground', 'interactive-tutorial'],
      docs: ['comprehensive-help-system', 'code-diff-viewer'],
      timeline: ['timeline', 'automated-changelog'],
      analytics: ['analytics-dashboard-enhanced', 'interactive-data-viz'],
      community: ['community-engagement', 'advanced-collaboration-features']
    };

    const modules = pageModules[currentPage] || [];
    modules.forEach(module => {
      this.loadModule(module);
    });
  }

  detectCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('features')) {
      return 'features';
    }
    if (path.includes('docs')) {
      return 'docs';
    }
    if (path.includes('timeline')) {
      return 'timeline';
    }
    if (path.includes('analytics')) {
      return 'analytics';
    }
    if (path.includes('community')) {
      return 'community';
    }
    return 'home';
  }

  // Preload modules based on user behavior
  preloadPredictedModules() {
    const userBehavior = this.analyzeUserBehavior();

    if (userBehavior.likesInteractivity) {
      this.loadModule('ai-code-playground');
      this.loadModule('interactive-tutorial');
    }

    if (userBehavior.viewsDocumentation) {
      this.loadModule('comprehensive-help-system');
      this.loadModule('code-diff-viewer');
    }

    if (userBehavior.usesKeyboardShortcuts) {
      this.loadModule('smart-search');
      this.loadModule('accessibility-enhancer');
    }
  }

  analyzeUserBehavior() {
    // Simple behavior analysis
    const behavior = {
      likesInteractivity: this.userInteractionDetected,
      viewsDocumentation: document.querySelectorAll('[data-i18n]').length > 0,
      usesKeyboardShortcuts: false // Could be enhanced with actual tracking
    };

    return behavior;
  }

  // Performance monitoring
  reportLoadingMetrics() {
    const metrics = {
      loadedModules: this.loadedModules.size,
      totalModules: this.criticalModules.length +
                   this.interactionModules.length +
                   this.viewportModules.length +
                   this.backgroundModules.length,
      isSlowConnection: this.isSlowConnection,
      isMobileDevice: this.isMobileDevice
    };

    console.log('📊 Module Loading Metrics:', metrics);

    // Report to analytics if available
    if (window.gtag) {
      gtag('event', 'module_loading', {
        loaded_modules: metrics.loadedModules,
        total_modules: metrics.totalModules,
        slow_connection: metrics.isSlowConnection,
        mobile_device: metrics.isMobileDevice
      });
    }
  }

  // Utility methods
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Public API
  loadModuleOnDemand(moduleName) {
    return this.loadModule(moduleName);
  }

  getLoadedModules() {
    return Array.from(this.loadedModules);
  }

  getLoadingStatus() {
    return {
      loaded: this.loadedModules.size,
      loading: this.loadingPromises.size,
      queued: this.loadQueue.length
    };
  }
}

// Initialize module loader
document.addEventListener('DOMContentLoaded', () => {
  window.moduleLoader = new ModuleLoader();

  // Load page-specific modules
  window.moduleLoader.loadPageSpecificModules();

  // Report metrics after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      window.moduleLoader.reportLoadingMetrics();
    }, 2000);
  });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ModuleLoader;
}