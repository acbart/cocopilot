/**
 * Guided Tour System for CocoPilot
 * Provides interactive onboarding and feature discovery for new users
 */

class GuidedTour {
  constructor() {
    this.currentStep = 0;
    this.totalSteps = 0;
    this.isActive = false;
    this.tourData = [];
    this.overlay = null;
    this.spotlight = null;
    this.tourCard = null;
    this.tourProgress = null;

    // Configuration
    this.config = {
      spotlightPadding: 10,
      animationDuration: 300,
      autoAdvanceDelay: 5000,
      enableKeyboardNavigation: true,
      enableAutoAdvance: false
    };

    this.initialize();
  }

  async initialize() {
    try {
      console.log('🎯 Initializing Guided Tour System...');

      // Create tour interface
      this.createTourInterface();

      // Define tour steps
      this.defineTourSteps();

      // Set up event listeners
      this.attachEventListeners();

      // Check if user should see tour
      this.checkTourTriggers();

      console.log('✅ Guided Tour System initialized');

    } catch (error) {
      console.error('❌ Error initializing Guided Tour:', error);
    }
  }

  createTourInterface() {
    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'tour-overlay';

    // Create spotlight
    this.spotlight = document.createElement('div');
    this.spotlight.className = 'tour-spotlight';

    // Create tour card
    this.tourCard = document.createElement('div');
    this.tourCard.className = 'tour-card';
    this.tourCard.innerHTML = `
      <div class="tour-header">
        <div class="tour-progress">
          <div class="tour-progress-bar">
            <div class="tour-progress-fill"></div>
          </div>
          <span class="tour-step-counter">1 of 7</span>
        </div>
        <button class="tour-close" aria-label="Close tour">×</button>
      </div>
      <div class="tour-content">
        <div class="tour-icon">🎯</div>
        <h3 class="tour-title">Welcome to CocoPilot!</h3>
        <p class="tour-description">Let's take a quick tour to help you discover the amazing features of this self-updating repository.</p>
      </div>
      <div class="tour-controls">
        <div class="tour-navigation">
          <button class="tour-btn tour-prev" disabled>← Previous</button>
          <button class="tour-btn tour-skip">Skip Tour</button>
          <button class="tour-btn tour-next tour-primary">Next →</button>
        </div>
        <div class="tour-indicators">
          <div class="tour-dots"></div>
        </div>
      </div>
    `;

    // Add styles
    this.addTourStyles();

    // Append to DOM (hidden initially)
    document.body.appendChild(this.overlay);
    document.body.appendChild(this.spotlight);
    document.body.appendChild(this.tourCard);

    // Get references
    this.tourProgress = this.tourCard.querySelector('.tour-progress-fill');
    this.tourStepCounter = this.tourCard.querySelector('.tour-step-counter');
    this.tourTitle = this.tourCard.querySelector('.tour-title');
    this.tourDescription = this.tourCard.querySelector('.tour-description');
    this.tourIcon = this.tourCard.querySelector('.tour-icon');
  }

  addTourStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
      .tour-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 10000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        backdrop-filter: blur(2px);
      }

      .tour-overlay.active {
        opacity: 1;
        visibility: visible;
      }

      .tour-spotlight {
        position: fixed;
        pointer-events: none;
        z-index: 10001;
        border-radius: 8px;
        box-shadow: 
          0 0 0 4px rgba(102, 126, 234, 0.5),
          0 0 0 8px rgba(102, 126, 234, 0.2),
          0 0 20px rgba(102, 126, 234, 0.3);
        background: transparent;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        opacity: 0;
        transform: scale(0.8);
      }

      .tour-spotlight.active {
        opacity: 1;
        transform: scale(1);
      }

      .tour-card {
        position: fixed;
        background: var(--container-bg, white);
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        z-index: 10002;
        max-width: 400px;
        width: 90vw;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px) scale(0.9);
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        border: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
      }

      .tour-card.active {
        opacity: 1;
        visibility: visible;
        transform: translateY(0) scale(1);
      }

      .tour-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        border-bottom: 1px solid var(--border-color, rgba(102, 126, 234, 0.1));
      }

      .tour-progress {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .tour-progress-bar {
        flex: 1;
        height: 4px;
        background: var(--border-color, rgba(102, 126, 234, 0.2));
        border-radius: 2px;
        overflow: hidden;
      }

      .tour-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #667eea, #764ba2);
        width: 0%;
        transition: width 0.3s ease;
        border-radius: 2px;
      }

      .tour-step-counter {
        font-size: 0.8rem;
        color: var(--text-secondary, #666);
        font-weight: 600;
        white-space: nowrap;
      }

      .tour-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--text-secondary, #666);
        cursor: pointer;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }

      .tour-close:hover {
        background: var(--feature-bg, rgba(102, 126, 234, 0.1));
        color: var(--text-primary, #333);
      }

      .tour-content {
        padding: 24px 20px;
        text-align: center;
      }

      .tour-icon {
        font-size: 2.5rem;
        margin-bottom: 12px;
        display: block;
      }

      .tour-title {
        font-size: 1.3rem;
        font-weight: 700;
        color: var(--text-primary, #333);
        margin-bottom: 12px;
      }

      .tour-description {
        color: var(--text-secondary, #666);
        line-height: 1.6;
        margin: 0;
      }

      .tour-controls {
        padding: 16px 20px;
        border-top: 1px solid var(--border-color, rgba(102, 126, 234, 0.1));
      }

      .tour-navigation {
        display: flex;
        gap: 8px;
        justify-content: space-between;
        margin-bottom: 16px;
      }

      .tour-btn {
        padding: 8px 16px;
        border: 1px solid var(--border-color, rgba(102, 126, 234, 0.3));
        border-radius: 8px;
        background: transparent;
        color: var(--text-primary, #333);
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .tour-btn:hover:not(:disabled) {
        border-color: var(--button-gradient-start, #667eea);
        background: var(--feature-bg, rgba(102, 126, 234, 0.1));
      }

      .tour-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .tour-btn.tour-primary {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border-color: transparent;
      }

      .tour-btn.tour-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }

      .tour-skip {
        color: var(--text-tertiary, #888);
        border-color: transparent;
        font-size: 0.8rem;
      }

      .tour-skip:hover {
        color: var(--text-secondary, #666);
        background: var(--feature-bg, rgba(102, 126, 234, 0.05));
      }

      .tour-indicators {
        text-align: center;
      }

      .tour-dots {
        display: flex;
        justify-content: center;
        gap: 6px;
      }

      .tour-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--border-color, rgba(102, 126, 234, 0.3));
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .tour-dot.active {
        background: var(--button-gradient-start, #667eea);
        transform: scale(1.2);
      }

      .tour-dot:hover {
        background: var(--button-gradient-start, #667eea);
        opacity: 0.7;
      }

      /* Pulse animation for current element */
      .tour-highlight {
        animation: tourPulse 2s infinite;
        position: relative !important;
        z-index: 10003 !important;
      }

      @keyframes tourPulse {
        0%, 100% { 
          box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7); 
        }
        50% { 
          box-shadow: 0 0 0 10px rgba(102, 126, 234, 0); 
        }
      }

      /* Dark mode support */
      [data-theme="dark"] .tour-card {
        background: rgba(30, 30, 30, 0.95);
        border-color: rgba(102, 126, 234, 0.3);
      }

      [data-theme="dark"] .tour-overlay {
        background: rgba(0, 0, 0, 0.8);
      }

      /* Mobile responsiveness */
      @media (max-width: 480px) {
        .tour-card {
          bottom: 0;
          left: 0;
          right: 0;
          border-radius: 16px 16px 0 0;
          max-width: none;
          width: 100%;
        }

        .tour-navigation {
          flex-wrap: wrap;
          gap: 8px;
        }

        .tour-btn {
          flex: 1;
          min-width: 0;
          font-size: 0.8rem;
          padding: 10px 12px;
        }

        .tour-skip {
          flex-basis: 100%;
          order: 3;
        }
      }

      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        .tour-overlay,
        .tour-spotlight,
        .tour-card,
        .tour-btn,
        .tour-dot {
          transition: none !important;
        }
        
        .tour-highlight {
          animation: none !important;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  defineTourSteps() {
    this.tourData = [
      {
        id: 'welcome',
        target: null,
        position: 'center',
        icon: '🎉',
        title: 'Welcome to CocoPilot!',
        description: 'This is a self-updating repository that evolves daily through AI-driven improvements. Let\'s explore its amazing features together!'
      },
      {
        id: 'header',
        target: 'h1',
        position: 'bottom',
        icon: '🤖',
        title: 'AI-Powered Evolution',
        description: 'This repository updates itself daily using GitHub Copilot, continuously improving its features and capabilities.'
      },
      {
        id: 'stats',
        target: '.repo-stats',
        position: 'bottom',
        icon: '📊',
        title: 'Live Repository Stats',
        description: 'These statistics are fetched in real-time from GitHub, showing the project\'s growth and activity.'
      },
      {
        id: 'features',
        target: '.features-showcase-section',
        position: 'top',
        icon: '✨',
        title: 'Feature Showcase',
        description: 'Explore our comprehensive feature set including AI education, code playground, analytics, and more!'
      },
      {
        id: 'theme',
        target: '.theme-toggle',
        position: 'bottom-left',
        icon: '🌗',
        title: 'Theme Control',
        description: 'Switch between light and dark themes to match your preference. The choice is automatically saved.'
      },
      {
        id: 'navigation',
        target: '.quick-nav',
        position: 'top',
        icon: '🧭',
        title: 'Quick Navigation',
        description: 'Use these buttons to quickly jump to different sections or visit the GitHub repository.'
      },
      {
        id: 'ai-suggestions',
        target: '.ai-suggestions-trigger',
        position: 'left',
        icon: '🧠',
        title: 'AI Suggestions',
        description: 'Click here to get personalized AI-powered content suggestions based on your interests and behavior!'
      }
    ];

    this.totalSteps = this.tourData.length;
    this.createTourDots();
  }

  createTourDots() {
    const dotsContainer = this.tourCard.querySelector('.tour-dots');
    dotsContainer.innerHTML = '';

    for (let i = 0; i < this.totalSteps; i++) {
      const dot = document.createElement('div');
      dot.className = 'tour-dot';
      if (i === 0) {
        dot.classList.add('active');
      }
      dot.addEventListener('click', () => this.goToStep(i));
      dotsContainer.appendChild(dot);
    }
  }

  attachEventListeners() {
    // Tour controls
    this.tourCard.querySelector('.tour-close').addEventListener('click', () => this.endTour());
    this.tourCard.querySelector('.tour-skip').addEventListener('click', () => this.endTour());
    this.tourCard.querySelector('.tour-prev').addEventListener('click', () => this.previousStep());
    this.tourCard.querySelector('.tour-next').addEventListener('click', () => this.nextStep());

    // Keyboard navigation
    if (this.config.enableKeyboardNavigation) {
      document.addEventListener('keydown', (e) => {
        if (!this.isActive) {
          return;
        }

        switch (e.key) {
        case 'Escape':
          this.endTour();
          break;
        case 'ArrowLeft':
          this.previousStep();
          break;
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          this.nextStep();
          break;
        }
      });
    }

    // Overlay click to close
    this.overlay.addEventListener('click', () => this.endTour());

    // Prevent closing when clicking tour card
    this.tourCard.addEventListener('click', (e) => e.stopPropagation());
  }

  checkTourTriggers() {
    // Check if user is new or hasn't seen tour
    const hasSeenTour = localStorage.getItem('cocopilot-tour-completed');
    const isFirstVisit = !localStorage.getItem('cocopilot-visited');

    if (!hasSeenTour || isFirstVisit) {
      // Show tour after a brief delay
      setTimeout(() => {
        this.startTour();
      }, 2000);

      localStorage.setItem('cocopilot-visited', 'true');
    }
  }

  startTour() {
    if (this.isActive) {
      return;
    }

    console.log('🎯 Starting guided tour...');

    this.isActive = true;
    this.currentStep = 0;

    // Show overlay and tour elements
    this.overlay.classList.add('active');
    this.tourCard.classList.add('active');

    // Disable page scrolling
    document.body.style.overflow = 'hidden';

    // Show first step
    this.showStep(0);

    // Track tour start
    if (window.gtag) {
      gtag('event', 'tour_started', {
        event_category: 'engagement'
      });
    }
  }

  endTour() {
    if (!this.isActive) {
      return;
    }

    console.log('🏁 Ending guided tour...');

    this.isActive = false;

    // Hide tour elements
    this.overlay.classList.remove('active');
    this.spotlight.classList.remove('active');
    this.tourCard.classList.remove('active');

    // Re-enable page scrolling
    document.body.style.overflow = '';

    // Clear highlights
    this.clearHighlights();

    // Mark tour as completed
    localStorage.setItem('cocopilot-tour-completed', 'true');

    // Track tour completion
    if (window.gtag) {
      gtag('event', 'tour_completed', {
        event_category: 'engagement',
        steps_completed: this.currentStep + 1,
        total_steps: this.totalSteps
      });
    }
  }

  nextStep() {
    if (this.currentStep < this.totalSteps - 1) {
      this.showStep(this.currentStep + 1);
    } else {
      this.endTour();
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.showStep(this.currentStep - 1);
    }
  }

  goToStep(stepIndex) {
    if (stepIndex >= 0 && stepIndex < this.totalSteps) {
      this.showStep(stepIndex);
    }
  }

  showStep(stepIndex) {
    const step = this.tourData[stepIndex];
    if (!step) {
      return;
    }

    this.currentStep = stepIndex;

    // Update tour content
    this.tourIcon.textContent = step.icon;
    this.tourTitle.textContent = step.title;
    this.tourDescription.textContent = step.description;

    // Update progress
    const progress = ((stepIndex + 1) / this.totalSteps) * 100;
    this.tourProgress.style.width = progress + '%';
    this.tourStepCounter.textContent = `${stepIndex + 1} of ${this.totalSteps}`;

    // Update dots
    this.updateTourDots(stepIndex);

    // Update navigation buttons
    this.updateNavigationButtons(stepIndex);

    // Position tour elements
    this.positionTourElements(step);

    // Highlight target element
    this.highlightElement(step.target);

    // Auto-advance if enabled
    if (this.config.enableAutoAdvance && stepIndex < this.totalSteps - 1) {
      clearTimeout(this.autoAdvanceTimer);
      this.autoAdvanceTimer = setTimeout(() => {
        this.nextStep();
      }, this.config.autoAdvanceDelay);
    }
  }

  updateTourDots(activeIndex) {
    const dots = this.tourCard.querySelectorAll('.tour-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === activeIndex);
    });
  }

  updateNavigationButtons(stepIndex) {
    const prevBtn = this.tourCard.querySelector('.tour-prev');
    const nextBtn = this.tourCard.querySelector('.tour-next');

    prevBtn.disabled = stepIndex === 0;
    nextBtn.textContent = stepIndex === this.totalSteps - 1 ? 'Finish!' : 'Next →';
  }

  positionTourElements(step) {
    const target = step.target ? document.querySelector(step.target) : null;

    if (target) {
      const rect = target.getBoundingClientRect();
      const padding = this.config.spotlightPadding;

      // Position spotlight
      this.spotlight.style.left = (rect.left - padding) + 'px';
      this.spotlight.style.top = (rect.top - padding) + 'px';
      this.spotlight.style.width = (rect.width + padding * 2) + 'px';
      this.spotlight.style.height = (rect.height + padding * 2) + 'px';
      this.spotlight.classList.add('active');

      // Position tour card
      this.positionTourCard(step.position, rect);
    } else {
      // Center position for welcome step
      this.spotlight.classList.remove('active');
      this.tourCard.style.left = '50%';
      this.tourCard.style.top = '50%';
      this.tourCard.style.transform = 'translate(-50%, -50%)';
    }
  }

  positionTourCard(position, targetRect) {
    const cardRect = this.tourCard.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let left, top, transform = '';

    switch (position) {
    case 'top':
      left = targetRect.left + (targetRect.width / 2);
      top = targetRect.top - cardRect.height - 20;
      transform = 'translateX(-50%)';
      break;
    case 'bottom':
      left = targetRect.left + (targetRect.width / 2);
      top = targetRect.bottom + 20;
      transform = 'translateX(-50%)';
      break;
    case 'left':
      left = targetRect.left - cardRect.width - 20;
      top = targetRect.top + (targetRect.height / 2);
      transform = 'translateY(-50%)';
      break;
    case 'right':
      left = targetRect.right + 20;
      top = targetRect.top + (targetRect.height / 2);
      transform = 'translateY(-50%)';
      break;
    case 'bottom-left':
      left = targetRect.left;
      top = targetRect.bottom + 20;
      break;
    default:
      left = viewport.width / 2;
      top = viewport.height / 2;
      transform = 'translate(-50%, -50%)';
    }

    // Ensure tour card stays within viewport
    left = Math.max(10, Math.min(left, viewport.width - cardRect.width - 10));
    top = Math.max(10, Math.min(top, viewport.height - cardRect.height - 10));

    this.tourCard.style.left = left + 'px';
    this.tourCard.style.top = top + 'px';
    this.tourCard.style.transform = transform;
  }

  highlightElement(selector) {
    this.clearHighlights();

    if (selector) {
      const element = document.querySelector(selector);
      if (element) {
        element.classList.add('tour-highlight');

        // Scroll element into view if needed
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
    }
  }

  clearHighlights() {
    document.querySelectorAll('.tour-highlight').forEach(el => {
      el.classList.remove('tour-highlight');
    });
  }

  // Public API
  restartTour() {
    localStorage.removeItem('cocopilot-tour-completed');
    this.startTour();
  }

  skipToStep(stepId) {
    const stepIndex = this.tourData.findIndex(step => step.id === stepId);
    if (stepIndex !== -1) {
      this.goToStep(stepIndex);
    }
  }

  // Integration with other systems
  addCustomStep(step) {
    this.tourData.push(step);
    this.totalSteps = this.tourData.length;
    this.createTourDots();
  }

  removeStep(stepId) {
    const index = this.tourData.findIndex(step => step.id === stepId);
    if (index !== -1) {
      this.tourData.splice(index, 1);
      this.totalSteps = this.tourData.length;
      this.createTourDots();
    }
  }
}

// Initialize guided tour
function initializeGuidedTour() {
  if (window.guidedTour) {
    return;
  }

  window.guidedTour = new GuidedTour();

  // Add global helper functions
  window.startTour = () => {
    window.guidedTour.restartTour();
  };
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeGuidedTour);
} else {
  initializeGuidedTour();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GuidedTour;
}