/**
 * Enhanced Visual Effects - September 27, 2025
 * Adds subtle animations and visual polish to improve user experience
 */

class EnhancedVisualEffects {
  constructor() {
    this.init();
  }

  init() {
    this.addScrollAnimations();
    this.enhanceButtonInteractions();
    this.addHoverEffects();
    this.improveTransitions();
    console.log('✨ Visual enhancements activated');
  }

  addScrollAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, observerOptions);

    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll(
      '.feature, .health-metric, .improvement-item, .guide-step, .feature-highlight'
    );

    animateElements.forEach(el => {
      observer.observe(el);
    });

    // Add CSS for animations
    this.addScrollAnimationStyles();
  }

  enhanceButtonInteractions() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('button, .button, .nav-link');

    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        this.createRippleEffect(e);
      });
    });
  }

  createRippleEffect(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      animation: ripple 0.6s ease-out;
      pointer-events: none;
      z-index: 1;
    `;

    // Ensure button has relative positioning
    if (window.getComputedStyle(button).position === 'static') {
      button.style.position = 'relative';
    }

    button.appendChild(ripple);

    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }

  addHoverEffects() {
    // Enhanced hover effects for cards and interactive elements
    const interactiveElements = document.querySelectorAll(
      '.feature-highlight, .health-metric, .guide-step, .feature'
    );

    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        element.style.transform = 'translateY(-2px) scale(1.02)';
        element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      });

      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  improveTransitions() {
    // Add smooth transitions to theme changes
    const themeElements = document.querySelectorAll('*');
    themeElements.forEach(el => {
      // Only add transitions to elements that don't already have them
      const currentTransition = window.getComputedStyle(el).transition;
      if (currentTransition === 'all 0s ease 0s' || currentTransition === 'none') {
        el.style.transition = 'color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease';
      }
    });
  }

  addScrollAnimationStyles() {
    if (document.getElementById('visual-enhancement-styles')) {
      return;
    }

    const styles = document.createElement('style');
    styles.id = 'visual-enhancement-styles';
    styles.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-fade-in {
        animation: fadeInUp 0.6s ease-out forwards;
      }

      /* Smooth hover effects */
      .feature-highlight:hover,
      .health-metric:hover,
      .guide-step:hover {
        box-shadow: 0 12px 40px rgba(102, 126, 234, 0.2);
      }

      /* Enhanced button styles */
      button, .button {
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      button:hover, .button:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      }

      button:active, .button:active {
        transform: translateY(0);
        transition: all 0.1s ease;
      }

      /* Improved focus states */
      button:focus-visible,
      .button:focus-visible {
        outline: 2px solid var(--button-gradient-start);
        outline-offset: 2px;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
      }

      /* Staggered animations for lists */
      .health-metrics .health-metric {
        animation-delay: calc(var(--index, 0) * 0.1s);
      }

      .features .feature {
        animation-delay: calc(var(--index, 0) * 0.15s);
      }

      /* Micro-interactions */
      .theme-toggle:hover {
        transform: rotate(15deg) scale(1.1);
      }

      .nav-link {
        position: relative;
      }

      .nav-link::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 50%;
        width: 0;
        height: 2px;
        background: var(--button-gradient-start);
        transition: all 0.3s ease;
        transform: translateX(-50%);
      }

      .nav-link:hover::after {
        width: 80%;
      }

      /* Loading states */
      .loading {
        position: relative;
        overflow: hidden;
      }

      .loading::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.2),
          transparent
        );
        animation: loading-shimmer 2s infinite;
      }

      @keyframes loading-shimmer {
        0% { left: -100%; }
        100% { left: 100%; }
      }

      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  // Method to add staggered animation delays
  addStaggeredAnimations() {
    const healthMetrics = document.querySelectorAll('.health-metric');
    healthMetrics.forEach((metric, index) => {
      metric.style.setProperty('--index', index);
    });

    const features = document.querySelectorAll('.feature');
    features.forEach((feature, index) => {
      feature.style.setProperty('--index', index);
    });
  }
}

// Initialize visual enhancements when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new EnhancedVisualEffects();
  });
} else {
  new EnhancedVisualEffects();
}

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnhancedVisualEffects;
}