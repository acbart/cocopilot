/**
 * Theme Enhancement Module
 * Adds smooth transitions and visual improvements to theme switching
 * Created: September 25, 2025
 */

class ThemeEnhancer {
  constructor() {
    this.initialized = false;
    this.init();
  }

  init() {
    console.log('🎨 Initializing Theme Enhancer...');
    this.enhanceThemeToggle();
    this.addSmoothTransitions();
    this.initialized = true;
    console.log('✅ Theme Enhancer initialized');
  }

  enhanceThemeToggle() {
    const themeToggle = document.querySelector('[aria-label*="theme"], .theme-toggle, button[title*="theme"]');
    if (!themeToggle) {
      return;
    }

    // Add enhanced styling for theme toggle
    if (!document.getElementById('theme-enhancer-styles')) {
      const styles = document.createElement('style');
      styles.id = 'theme-enhancer-styles';
      styles.textContent = `
        /* Enhanced theme toggle animation */
        [aria-label*="theme"], .theme-toggle {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          position: relative;
          overflow: hidden;
        }

        [aria-label*="theme"]:hover, .theme-toggle:hover {
          transform: scale(1.1) rotate(15deg);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        [aria-label*="theme"]:active, .theme-toggle:active {
          transform: scale(0.95) rotate(-5deg);
        }

        /* Ripple effect on click */
        .theme-ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.6);
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
        }

        @keyframes ripple {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }

        /* Smooth theme transition for entire page */
        .theme-transitioning,
        .theme-transitioning *,
        .theme-transitioning *:before,
        .theme-transitioning *:after {
          transition: background-color 0.4s ease, 
                      color 0.4s ease, 
                      border-color 0.4s ease,
                      box-shadow 0.4s ease !important;
          transition-delay: 0ms !important;
        }

        /* Enhanced focus states */
        [aria-label*="theme"]:focus-visible, .theme-toggle:focus-visible {
          outline: 2px solid var(--button-gradient-start);
          outline-offset: 2px;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
        }
      `;
      document.head.appendChild(styles);
    }

    // Add click ripple effect
    themeToggle.addEventListener('click', (e) => {
      this.createRippleEffect(e);
      this.addThemeTransitionClass();
    });

    // Enhance keyboard interaction
    themeToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        this.createRippleEffect(e);
        this.addThemeTransitionClass();
      }
    });
  }

  createRippleEffect(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'theme-ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    button.appendChild(ripple);

    // Remove ripple after animation
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }

  addThemeTransitionClass() {
    document.body.classList.add('theme-transitioning');

    // Remove class after transition completes
    setTimeout(() => {
      document.body.classList.remove('theme-transitioning');
    }, 400);
  }

  addSmoothTransitions() {
    // Ensure smooth transitions for dynamic content
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Add transition to newly added elements
              node.style.transition = 'all 0.3s ease';
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Store observer for cleanup
    this.mutationObserver = observer;
  }

  // Enhanced theme detection and preference handling
  detectPreferredTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  // Add smooth theme switching with preview
  previewTheme(_theme) {
    document.body.style.filter = 'brightness(0.8)';
    document.body.style.transition = 'filter 0.2s ease';

    setTimeout(() => {
      document.body.style.filter = '';
    }, 200);
  }

  cleanup() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }
}

// Initialize Theme Enhancer
let themeEnhancerInstance = null;

function initializeThemeEnhancer() {
  if (!themeEnhancerInstance) {
    themeEnhancerInstance = new ThemeEnhancer();
  }
  return themeEnhancerInstance;
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeThemeEnhancer);
} else {
  // Small delay to ensure other theme code is loaded
  setTimeout(initializeThemeEnhancer, 500);
}

// Export for manual initialization
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ThemeEnhancer };
}