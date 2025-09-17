/**
 * Visual Enhancement Module for CocoPilot
 * Adds subtle animations and interactive elements to improve user experience
 */

class VisualEnhancer {
  constructor() {
    this.isInitialized = false;
    this.init();
  }

  init() {
    if (this.isInitialized) {
      return;
    }

    try {
      this.addEnhancedAnimations();
      this.addInteractiveElements();
      this.addMouseTrail();
      this.addProgressiveEnhancements();
      this.isInitialized = true;
    } catch (error) {
      console.warn('Visual Enhancer initialization failed:', error);
    }
  }

  addEnhancedAnimations() {
    // Add subtle parallax effect to the background
    this.addParallaxEffect();

    // Add scroll-triggered animations
    this.addScrollAnimations();

    // Add hover animations to feature cards
    this.enhanceFeatureCards();
  }

  addParallaxEffect() {
    const particles = document.querySelectorAll('.particle');
    let ticking = false;

    function updateParallax() {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;

      particles.forEach((particle, index) => {
        const speed = 0.5 + (index * 0.1);
        particle.style.transform = `translateY(${rate * speed}px)`;
      });

      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    window.addEventListener('scroll', requestTick);
  }

  addScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.about-section, .features-grid, .guide-section, .actions');
    animatedElements.forEach(el => {
      if (el) {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
      }
    });

    this.addAnimationStyles();
  }

  addAnimationStyles() {
    const styles = `
      <style id="visual-enhancements">
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-on-scroll.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .feature-card-enhanced {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .feature-card-enhanced::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }

        .feature-card-enhanced:hover::before {
          left: 100%;
        }

        .feature-card-enhanced:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
        }

        .interactive-button {
          position: relative;
          overflow: hidden;
          transform-style: preserve-3d;
        }

        .interactive-button::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.3s ease, height 0.3s ease;
        }

        .interactive-button:active::after {
          width: 100px;
          height: 100px;
        }

        .mouse-trail {
          position: fixed;
          width: 20px;
          height: 20px;
          border: 2px solid rgba(102, 126, 234, 0.5);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transition: all 0.1s ease;
          opacity: 0;
        }

        .mouse-trail.visible {
          opacity: 1;
        }

        .enhanced-stats {
          counter-reset: stats-counter;
        }

        .stat-item {
          position: relative;
          counter-increment: stats-counter;
        }

        .stat-value {
          display: inline-block;
          transition: all 0.3s ease;
        }

        .stat-item:hover .stat-value {
          transform: scale(1.1);
          color: var(--button-gradient-start);
        }

        .floating-action {
          position: fixed;
          bottom: 80px;
          right: 20px;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
          transition: all 0.3s ease;
          z-index: 1000;
          opacity: 0;
          transform: translateY(20px);
        }

        .floating-action.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .floating-action:hover {
          transform: translateY(-3px) scale(1.1);
          box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
        }

        .progress-indicator {
          position: fixed;
          top: 0;
          left: 0;
          width: 0%;
          height: 3px;
          background: linear-gradient(90deg, var(--button-gradient-start), var(--button-gradient-end));
          z-index: 1000;
          transition: width 0.1s ease;
        }

        .sparkle {
          position: absolute;
          width: 10px;
          height: 10px;
          background: radial-gradient(circle, #ffd700, transparent);
          border-radius: 50%;
          animation: sparkle 2s infinite;
          pointer-events: none;
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }

        .glow-effect {
          position: relative;
        }

        .glow-effect::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, var(--button-gradient-start), var(--button-gradient-end));
          border-radius: inherit;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .glow-effect:hover::before {
          opacity: 0.7;
          animation: glow-pulse 2s infinite;
        }

        @keyframes glow-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .floating-action {
            width: 50px;
            height: 50px;
            font-size: 20px;
            bottom: 70px;
            right: 15px;
          }

          .mouse-trail {
            display: none;
          }
        }

        /* Reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .animate-on-scroll,
          .feature-card-enhanced,
          .interactive-button,
          .floating-action {
            transition: none;
          }

          .sparkle {
            animation: none;
          }
        }
      </style>
    `;

    if (!document.getElementById('visual-enhancements')) {
      document.head.insertAdjacentHTML('beforeend', styles);
    }
  }

  enhanceFeatureCards() {
    const featureCards = document.querySelectorAll('.feature, .guide-step');
    featureCards.forEach(card => {
      if (!card.classList.contains('feature-card-enhanced')) {
        card.classList.add('feature-card-enhanced');
      }
    });

    // Add interactive buttons enhancement
    const buttons = document.querySelectorAll('button, .btn');
    buttons.forEach(button => {
      if (!button.classList.contains('interactive-button')) {
        button.classList.add('interactive-button');
      }
    });
  }

  addInteractiveElements() {
    // Add floating back-to-top button
    this.createFloatingAction();

    // Add reading progress indicator
    this.addProgressIndicator();

    // Add sparkle effects to important elements
    this.addSparkleEffects();

    // Add glow effects to CTA buttons
    this.addGlowEffects();
  }

  createFloatingAction() {
    const floatingButton = document.createElement('div');
    floatingButton.className = 'floating-action';
    floatingButton.innerHTML = '↑';
    floatingButton.title = 'Back to top';
    floatingButton.setAttribute('aria-label', 'Scroll to top');

    floatingButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.body.appendChild(floatingButton);

    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        floatingButton.classList.add('visible');
      } else {
        floatingButton.classList.remove('visible');
      }
    });
  }

  addProgressIndicator() {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-indicator';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      progressBar.style.width = `${Math.min(scrolled, 100)}%`;
    });
  }

  addSparkleEffects() {
    const sparkleTargets = document.querySelectorAll('.status, h1, .feature-icon');

    sparkleTargets.forEach(target => {
      if (target) {
        target.addEventListener('mouseenter', () => {
          this.createSparkle(target);
        });
      }
    });
  }

  createSparkle(element) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';

    const rect = element.getBoundingClientRect();
    sparkle.style.left = `${Math.random() * rect.width}px`;
    sparkle.style.top = `${Math.random() * rect.height}px`;

    element.style.position = 'relative';
    element.appendChild(sparkle);

    setTimeout(() => {
      if (sparkle.parentNode) {
        sparkle.parentNode.removeChild(sparkle);
      }
    }, 2000);
  }

  addGlowEffects() {
    const ctaButtons = document.querySelectorAll('.theme-toggle, .try-it-btn, .start-tour-btn');
    ctaButtons.forEach(button => {
      if (button && !button.classList.contains('glow-effect')) {
        button.classList.add('glow-effect');
      }
    });
  }

  addMouseTrail() {
    // Skip on mobile devices
    if (window.innerWidth <= 768) {
      return;
    }

    const trail = document.createElement('div');
    trail.className = 'mouse-trail';
    document.body.appendChild(trail);

    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      trail.classList.add('visible');
    });

    document.addEventListener('mouseleave', () => {
      trail.classList.remove('visible');
    });

    function updateTrail() {
      const dx = mouseX - trailX;
      const dy = mouseY - trailY;

      trailX += dx * 0.1;
      trailY += dy * 0.1;

      trail.style.left = `${trailX - 10}px`;
      trail.style.top = `${trailY - 10}px`;

      requestAnimationFrame(updateTrail);
    }

    updateTrail();
  }

  addProgressiveEnhancements() {
    // Enhance stats display with counting animation
    this.animateStats();

    // Add keyboard navigation enhancements
    this.addKeyboardEnhancements();

    // Add focus indicators
    this.addFocusIndicators();
  }

  animateStats() {
    const statElements = document.querySelectorAll('#stars, #forks, #issues');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          this.countUpAnimation(entry.target);
          entry.target.dataset.animated = 'true';
        }
      });
    });

    statElements.forEach(el => {
      if (el) {
        observer.observe(el);
      }
    });
  }

  countUpAnimation(element) {
    const finalValue = element.textContent;
    const numericValue = parseInt(finalValue) || 0;

    if (numericValue === 0) {
      return;
    }

    let currentValue = 0;
    const increment = Math.ceil(numericValue / 20);

    const counter = setInterval(() => {
      currentValue += increment;
      if (currentValue >= numericValue) {
        currentValue = numericValue;
        clearInterval(counter);
      }
      element.textContent = currentValue;
    }, 50);
  }

  addKeyboardEnhancements() {
    // Add visual feedback for keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  addFocusIndicators() {
    const focusStyle = `
      <style id="focus-indicators">
        .keyboard-navigation *:focus {
          outline: 3px solid var(--button-gradient-start);
          outline-offset: 2px;
          border-radius: 4px;
        }

        .keyboard-navigation button:focus,
        .keyboard-navigation a:focus {
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
        }
      </style>
    `;

    if (!document.getElementById('focus-indicators')) {
      document.head.insertAdjacentHTML('beforeend', focusStyle);
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new VisualEnhancer();
  });
} else {
  new VisualEnhancer();
}

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VisualEnhancer;
}