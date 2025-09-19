/**
 * Performance Enhancements for CocoPilot
 * Implements advanced performance optimizations including lazy loading,
 * resource prefetching, and intelligent module loading
 */

class PerformanceEnhancer {
  constructor() {
    this.isInitialized = false;
    this.loadedModules = new Set();
    this.performanceMetrics = {
      loadTime: 0,
      renderTime: 0,
      interactionTime: 0,
      memoryUsage: 0
    };
    
    this.init();
  }

  init() {
    if (this.isInitialized) return;
    
    this.measurePerformance();
    this.implementLazyLoading();
    this.optimizeImages();
    this.prefetchCriticalResources();
    this.addIntersectionObservers();
    this.implementModuleLazyLoading();
    this.monitorPerformance();
    
    this.isInitialized = true;
  }

  measurePerformance() {
    // Measure initial load performance
    if (performance.timing) {
      const timing = performance.timing;
      this.performanceMetrics.loadTime = timing.loadEventEnd - timing.navigationStart;
      this.performanceMetrics.renderTime = timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart;
    }

    // Use Performance Observer if available
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'measure') {
              console.log(`Performance measure: ${entry.name} took ${entry.duration}ms`);
            }
          });
        });
        observer.observe({ entryTypes: ['measure'] });
      } catch (e) {
        console.log('PerformanceObserver not fully supported');
      }
    }
  }

  implementLazyLoading() {
    // Enhanced lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      images.forEach(img => {
        img.src = img.dataset.src;
        img.classList.add('loaded');
      });
    }
  }

  optimizeImages() {
    // Add WebP support detection and fallback
    const supportsWebP = this.checkWebPSupport();
    
    if (supportsWebP) {
      document.documentElement.classList.add('webp-supported');
    }

    // Optimize background images
    const elementsWithBg = document.querySelectorAll('[data-bg]');
    elementsWithBg.forEach(el => {
      const bgImage = el.dataset.bg;
      if (bgImage) {
        el.style.backgroundImage = `url(${bgImage})`;
        el.removeAttribute('data-bg');
      }
    });
  }

  checkWebPSupport() {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  prefetchCriticalResources() {
    // Prefetch critical resources based on user behavior
    const criticalResources = [
      '/js/analytics-dashboard.js',
      '/js/interactive-data-viz.js',
      '/favicon.svg'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = resource;
      document.head.appendChild(link);
    });

    // Preload fonts if any are used
    if (window.getComputedStyle) {
      const bodyFont = getComputedStyle(document.body).fontFamily;
      if (bodyFont && !bodyFont.includes('system-ui')) {
        this.preloadFont(bodyFont);
      }
    }
  }

  preloadFont(fontFamily) {
    // This would preload custom fonts if they were being used
    console.log(`Would preload font: ${fontFamily}`);
  }

  addIntersectionObservers() {
    // Add observers for sections to trigger animations and loading
    const sections = document.querySelectorAll('section, .data-viz-container, .analytics-dashboard');
    
    if ('IntersectionObserver' in window) {
      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-viewport');
            
            // Trigger any section-specific loading
            this.loadSectionResources(entry.target);
          }
        });
      }, {
        rootMargin: '100px 0px',
        threshold: 0.1
      });

      sections.forEach(section => sectionObserver.observe(section));
    }
  }

  loadSectionResources(section) {
    // Load resources specific to sections as they come into view
    if (section.classList.contains('analytics-dashboard') && !this.loadedModules.has('analytics')) {
      this.loadedModules.add('analytics');
      console.log('Analytics section in view, loading additional resources');
      // Could trigger additional analytics module loading here
    }

    if (section.classList.contains('ai-education-section') && !this.loadedModules.has('education')) {
      this.loadedModules.add('education');
      console.log('Education section in view, optimizing content');
      // Could optimize education content loading here
    }
  }

  implementModuleLazyLoading() {
    // Implement intelligent module loading based on user interaction
    const interactiveElements = document.querySelectorAll('[onclick], button, .clickable');
    
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        this.preloadInteractionResources(element);
      }, { once: true, passive: true });
    });
  }

  preloadInteractionResources(element) {
    // Preload resources for interactive elements
    const elementClasses = Array.from(element.classList);
    
    if (elementClasses.some(cls => cls.includes('theme'))) {
      this.preloadThemeResources();
    }
    
    if (elementClasses.some(cls => cls.includes('help') || cls.includes('tour'))) {
      this.preloadHelpResources();
    }
  }

  preloadThemeResources() {
    if (!this.loadedModules.has('theme-preload')) {
      this.loadedModules.add('theme-preload');
      console.log('Preloading theme switching resources');
      // Could preload dark/light theme CSS here
    }
  }

  preloadHelpResources() {
    if (!this.loadedModules.has('help-preload')) {
      this.loadedModules.add('help-preload');
      console.log('Preloading help system resources');
      // Could preload help content here
    }
  }

  monitorPerformance() {
    // Monitor ongoing performance metrics
    if ('memory' in performance) {
      this.performanceMetrics.memoryUsage = performance.memory.usedJSHeapSize;
    }

    // Monitor Core Web Vitals
    this.measureCoreWebVitals();

    // Set up periodic performance reporting
    setInterval(() => {
      this.reportPerformanceMetrics();
    }, 30000); // Report every 30 seconds
  }

  measureCoreWebVitals() {
    // Measure Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('LCP:', lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // Measure First Input Delay (FID)
        new PerformanceObserver((entryList) => {
          entryList.getEntries().forEach((entry) => {
            console.log('FID:', entry.processingStart - entry.startTime);
          });
        }).observe({ entryTypes: ['first-input'] });

        // Measure Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
          entryList.getEntries().forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          console.log('CLS:', clsValue);
        }).observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.log('Core Web Vitals measurement not fully supported');
      }
    }
  }

  reportPerformanceMetrics() {
    const metrics = {
      ...this.performanceMetrics,
      timestamp: Date.now(),
      loadedModules: Array.from(this.loadedModules),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    // In a real application, this would send data to analytics
    console.log('Performance Report:', metrics);
    
    // Store metrics for the performance dashboard
    if (typeof window !== 'undefined') {
      window.performanceMetrics = metrics;
    }
  }

  // Public method to get current performance data
  getPerformanceData() {
    return {
      ...this.performanceMetrics,
      loadedModules: Array.from(this.loadedModules),
      timestamp: Date.now()
    };
  }

  // Method to optimize specific components
  optimizeComponent(componentName) {
    switch (componentName) {
      case 'analytics':
        this.optimizeAnalytics();
        break;
      case 'education':
        this.optimizeEducation();
        break;
      case 'playground':
        this.optimizePlayground();
        break;
      default:
        console.log(`No specific optimization for ${componentName}`);
    }
  }

  optimizeAnalytics() {
    // Optimize analytics dashboard
    const charts = document.querySelectorAll('.chart-container');
    charts.forEach(chart => {
      if (!chart.classList.contains('optimized')) {
        // Add performance optimizations for charts
        chart.style.willChange = 'transform';
        chart.classList.add('optimized');
      }
    });
  }

  optimizeEducation() {
    // Optimize education section
    const educationContent = document.querySelector('.ai-education-section');
    if (educationContent && !educationContent.classList.contains('optimized')) {
      // Optimize content loading
      educationContent.style.contain = 'layout style paint';
      educationContent.classList.add('optimized');
    }
  }

  optimizePlayground() {
    // Optimize code playground
    const playground = document.querySelector('.ai-playground-section');
    if (playground && !playground.classList.contains('optimized')) {
      // Optimize code editor performance
      const textarea = playground.querySelector('#codeTextarea');
      if (textarea) {
        textarea.style.contain = 'layout style';
      }
      playground.classList.add('optimized');
    }
  }

  // Method to clean up unused resources
  cleanupUnusedResources() {
    // Remove event listeners for elements no longer visible
    const invisibleElements = document.querySelectorAll('[style*="display: none"]');
    invisibleElements.forEach(element => {
      // Could remove event listeners here if needed
    });

    // Clear old performance entries
    if (performance.clearMarks) {
      performance.clearMarks();
    }
    if (performance.clearMeasures) {
      performance.clearMeasures();
    }
  }
}

// Enhanced CSS for performance optimizations
function addPerformanceStyles() {
  if (document.getElementById('performance-enhancement-styles')) return;

  const style = document.createElement('style');
  style.id = 'performance-enhancement-styles';
  style.textContent = `
    /* Performance optimization styles */
    .lazy {
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .loaded {
      opacity: 1;
    }

    .in-viewport {
      /* Add any viewport-specific optimizations */
    }

    .optimized {
      /* Mark optimized components */
    }

    /* GPU acceleration for smooth animations */
    .theme-toggle,
    .help-tour-btn,
    .education-btn,
    .control-btn {
      transform: translateZ(0);
      will-change: transform;
    }

    /* Optimize text rendering */
    body {
      text-rendering: optimizeSpeed;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* Optimize repaints */
    .data-viz-container,
    .analytics-dashboard,
    .ai-education-section,
    .ai-playground-section {
      contain: layout style paint;
    }

    /* Reduce layout thrashing */
    .chart-container,
    .code-editor {
      contain: layout;
    }

    /* Optimize animations for better performance */
    @media (prefers-reduced-motion: no-preference) {
      .concept-card,
      .tool-card,
      .practice-card {
        transition: transform 0.2s ease-out;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }

    /* Optimize for different network conditions */
    @media (prefers-reduced-data: reduce) {
      .background-animation {
        display: none;
      }
      
      .parallax-element {
        transform: none !important;
      }
    }
  `;
  
  document.head.appendChild(style);
}

// Initialize performance enhancements
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    addPerformanceStyles();
    window.performanceEnhancer = new PerformanceEnhancer();
  });
} else {
  addPerformanceStyles();
  window.performanceEnhancer = new PerformanceEnhancer();
}