/**
 * Interactive Onboarding System for CocoPilot
 * Provides guided tours and tutorials for new users
 */

class OnboardingTour {
  constructor() {
    this.currentStep = 0;
    this.isActive = false;
    this.steps = [
      {
        target: '.emoji',
        title: 'Welcome to CocoPilot! 🤖',
        content: 'This is an AI-powered self-updating repository that evolves daily through GitHub Copilot!',
        position: 'bottom'
      },
      {
        target: '.theme-toggle',
        title: 'Theme Toggle 🌙',
        content: 'Click here to switch between light and dark themes. The site remembers your preference!',
        position: 'bottom'
      },
      {
        target: '.language-selector',
        title: 'Multi-Language Support 🌍',
        content: 'Choose from 11 different languages! The interface is fully internationalized.',
        position: 'bottom'
      },
      {
        target: '.repo-stats',
        title: 'Live Repository Stats 📊',
        content: 'Real-time data from GitHub API showing stars, forks, issues, and update frequency.',
        position: 'bottom'
      },
      {
        target: '.timeline-container',
        title: 'Interactive Timeline ⏰',
        content: 'Explore the evolution of CocoPilot through this interactive feature timeline.',
        position: 'top'
      },
      {
        target: '.data-viz-container',
        title: 'Data Visualizations 📈',
        content: 'Beautiful charts and graphs showing repository growth and technology metrics.',
        position: 'top'
      },
      {
        target: '.github-activity',
        title: 'Live Activity Feed 🔄',
        content: 'See recent commits and changes happening in real-time.',
        position: 'top'
      },
      {
        target: '.evolution-timeline',
        title: 'Version History 📚',
        content: 'Navigate through different versions to see how the project evolved.',
        position: 'top'
      },
      {
        target: '.main-actions',
        title: 'Quick Actions 🚀',
        content: 'Access the GitHub repository, browse issues, or subscribe to updates.',
        position: 'top'
      }
    ];

    this.init();
  }

  init() {
    this.createStyles();
    this.checkFirstVisit();
  }

  createStyles() {
    if (document.getElementById('onboarding-styles')) {
      return;
    }

    const styles = document.createElement('style');
    styles.id = 'onboarding-styles';
    styles.textContent = `
      .onboarding-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 10000;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }

      .onboarding-spotlight {
        position: absolute;
        border: 3px solid var(--button-gradient-start, #667eea);
        border-radius: 12px;
        box-shadow: 
          0 0 0 9999px rgba(0, 0, 0, 0.7),
          0 0 20px rgba(102, 126, 234, 0.6),
          inset 0 0 20px rgba(102, 126, 234, 0.2);
        transition: all 0.3s ease;
        pointer-events: none;
      }

      .onboarding-tooltip {
        position: absolute;
        background: var(--container-bg, white);
        border: 2px solid var(--border-color, #e1e5e9);
        border-radius: 16px;
        padding: 20px;
        min-width: 280px;
        max-width: 350px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        z-index: 10001;
        pointer-events: all;
        animation: tooltipAppear 0.3s ease-out;
      }

      @keyframes tooltipAppear {
        from {
          opacity: 0;
          transform: translateY(10px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .onboarding-tooltip::before {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        background: var(--container-bg, white);
        border: 2px solid var(--border-color, #e1e5e9);
        transform: rotate(45deg);
      }

      .onboarding-tooltip.position-bottom::before {
        top: -10px;
        left: 50%;
        margin-left: -8px;
        border-bottom: none;
        border-right: none;
      }

      .onboarding-tooltip.position-top::before {
        bottom: -10px;
        left: 50%;
        margin-left: -8px;
        border-top: none;
        border-left: none;
      }

      .onboarding-tooltip.position-left::before {
        right: -10px;
        top: 50%;
        margin-top: -8px;
        border-left: none;
        border-bottom: none;
      }

      .onboarding-tooltip.position-right::before {
        left: -10px;
        top: 50%;
        margin-top: -8px;
        border-right: none;
        border-top: none;
      }

      .onboarding-title {
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 12px 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .onboarding-content {
        color: var(--text-secondary);
        line-height: 1.5;
        margin: 0 0 20px 0;
        font-size: 0.95rem;
      }

      .onboarding-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
      }

      .onboarding-progress {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--text-secondary);
        font-size: 0.85rem;
      }

      .onboarding-buttons {
        display: flex;
        gap: 8px;
      }

      .onboarding-btn {
        padding: 8px 16px;
        border: none;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }

      .onboarding-btn.primary {
        background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
        color: white;
      }

      .onboarding-btn.primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }

      .onboarding-btn.secondary {
        background: var(--feature-bg);
        color: var(--text-secondary);
        border: 1px solid var(--border-color);
      }

      .onboarding-btn.secondary:hover {
        background: var(--border-color);
        color: var(--text-primary);
      }

      .onboarding-skip {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10002;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 20px;
        cursor: pointer;
        font-size: 0.85rem;
        transition: all 0.2s ease;
      }

      .onboarding-skip:hover {
        background: rgba(0, 0, 0, 0.9);
        transform: scale(1.05);
      }

      .onboarding-welcome {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--container-bg);
        border: 2px solid var(--border-color);
        border-radius: 20px;
        padding: 40px;
        max-width: 500px;
        text-align: center;
        z-index: 10001;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: welcomeAppear 0.5s ease-out;
      }

      @keyframes welcomeAppear {
        from {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
      }

      .welcome-icon {
        font-size: 4rem;
        margin-bottom: 20px;
        animation: bounce 2s infinite;
      }

      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-10px);
        }
        60% {
          transform: translateY(-5px);
        }
      }

      .welcome-title {
        font-size: 2rem;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0 0 16px 0;
      }

      .welcome-description {
        color: var(--text-secondary);
        line-height: 1.6;
        margin: 0 0 30px 0;
        font-size: 1.1rem;
      }

      .welcome-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
        flex-wrap: wrap;
      }

      @media (max-width: 768px) {
        .onboarding-tooltip {
          min-width: 260px;
          max-width: 90vw;
          padding: 16px;
        }

        .onboarding-welcome {
          max-width: 90vw;
          padding: 30px 20px;
        }

        .welcome-title {
          font-size: 1.5rem;
        }

        .welcome-description {
          font-size: 1rem;
        }

        .welcome-actions {
          flex-direction: column;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  checkFirstVisit() {
    const hasVisited = localStorage.getItem('cocopilot-visited');
    if (!hasVisited) {
      this.showWelcome();
    }
  }

  showWelcome() {
    const overlay = this.createOverlay();
    const welcome = document.createElement('div');
    welcome.className = 'onboarding-welcome';
    welcome.innerHTML = `
      <div class="welcome-icon">🤖</div>
      <h2 class="welcome-title">Welcome to CocoPilot!</h2>
      <p class="welcome-description">
        Discover an AI-powered repository that evolves daily through GitHub Copilot. 
        Would you like a quick tour to explore the features?
      </p>
      <div class="welcome-actions">
        <button class="onboarding-btn primary" onclick="window.onboardingTour.startTour()">
          🚀 Start Tour
        </button>
        <button class="onboarding-btn secondary" onclick="window.onboardingTour.skipWelcome()">
          Skip for now
        </button>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(welcome);
  }

  startTour() {
    this.markAsVisited();
    this.clearWelcome();
    this.currentStep = 0;
    this.isActive = true;
    this.showStep();
  }

  skipWelcome() {
    this.markAsVisited();
    this.clearWelcome();
  }

  clearWelcome() {
    const overlay = document.querySelector('.onboarding-overlay');
    const welcome = document.querySelector('.onboarding-welcome');
    if (overlay) {
      overlay.remove();
    }
    if (welcome) {
      welcome.remove();
    }
  }

  showStep() {
    if (this.currentStep >= this.steps.length) {
      this.endTour();
      return;
    }

    const step = this.steps[this.currentStep];
    const target = document.querySelector(step.target);

    if (!target) {
      this.nextStep();
      return;
    }

    this.createOverlay();
    this.createSpotlight(target);
    this.createTooltip(target, step);
    this.createSkipButton();
  }

  createOverlay() {
    let overlay = document.querySelector('.onboarding-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'onboarding-overlay';
      document.body.appendChild(overlay);
    }
    return overlay;
  }

  createSpotlight(target) {
    let spotlight = document.querySelector('.onboarding-spotlight');
    if (spotlight) {
      spotlight.remove();
    }

    spotlight = document.createElement('div');
    spotlight.className = 'onboarding-spotlight';

    const rect = target.getBoundingClientRect();
    const padding = 8;

    spotlight.style.left = `${rect.left - padding}px`;
    spotlight.style.top = `${rect.top - padding}px`;
    spotlight.style.width = `${rect.width + padding * 2}px`;
    spotlight.style.height = `${rect.height + padding * 2}px`;

    document.body.appendChild(spotlight);

    // Scroll target into view if needed
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  createTooltip(target, step) {
    let tooltip = document.querySelector('.onboarding-tooltip');
    if (tooltip) {
      tooltip.remove();
    }

    tooltip = document.createElement('div');
    tooltip.className = `onboarding-tooltip position-${step.position}`;
    tooltip.innerHTML = `
      <h3 class="onboarding-title">${step.title}</h3>
      <p class="onboarding-content">${step.content}</p>
      <div class="onboarding-controls">
        <div class="onboarding-progress">
          ${this.currentStep + 1} of ${this.steps.length}
        </div>
        <div class="onboarding-buttons">
          ${this.currentStep > 0 ? '<button class="onboarding-btn secondary" onclick="window.onboardingTour.previousStep()">← Back</button>' : ''}
          <button class="onboarding-btn primary" onclick="window.onboardingTour.nextStep()">
            ${this.currentStep === this.steps.length - 1 ? 'Finish ✨' : 'Next →'}
          </button>
        </div>
      </div>
    `;

    this.positionTooltip(tooltip, target, step.position);
    document.body.appendChild(tooltip);
  }

  positionTooltip(tooltip, target, position) {
    const rect = target.getBoundingClientRect();
    const tooltipRect = { width: 320, height: 150 }; // Approximate size

    let left, top;

    switch (position) {
    case 'bottom':
      left = rect.left + rect.width / 2 - tooltipRect.width / 2;
      top = rect.bottom + 20;
      break;
    case 'top':
      left = rect.left + rect.width / 2 - tooltipRect.width / 2;
      top = rect.top - tooltipRect.height - 20;
      break;
    case 'left':
      left = rect.left - tooltipRect.width - 20;
      top = rect.top + rect.height / 2 - tooltipRect.height / 2;
      break;
    case 'right':
      left = rect.right + 20;
      top = rect.top + rect.height / 2 - tooltipRect.height / 2;
      break;
    default:
      left = rect.left + rect.width / 2 - tooltipRect.width / 2;
      top = rect.bottom + 20;
    }

    // Keep tooltip within viewport
    left = Math.max(10, Math.min(left, window.innerWidth - tooltipRect.width - 10));
    top = Math.max(10, Math.min(top, window.innerHeight - tooltipRect.height - 10));

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  createSkipButton() {
    let skipBtn = document.querySelector('.onboarding-skip');
    if (!skipBtn) {
      skipBtn = document.createElement('button');
      skipBtn.className = 'onboarding-skip';
      skipBtn.textContent = 'Skip Tour ✕';
      skipBtn.onclick = () => this.endTour();
      document.body.appendChild(skipBtn);
    }
  }

  nextStep() {
    this.currentStep++;
    if (this.currentStep < this.steps.length) {
      this.showStep();
    } else {
      this.endTour();
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.showStep();
    }
  }

  endTour() {
    this.isActive = false;
    this.clearTourElements();
    this.showCompletionMessage();
  }

  clearTourElements() {
    const elements = [
      '.onboarding-overlay',
      '.onboarding-spotlight',
      '.onboarding-tooltip',
      '.onboarding-skip'
    ];

    elements.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        element.remove();
      }
    });
  }

  showCompletionMessage() {
    // Create a temporary success message
    const message = document.createElement('div');
    message.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
      font-weight: 500;
    `;
    message.innerHTML = '🎉 Tour completed! Enjoy exploring CocoPilot!';

    document.body.appendChild(message);

    setTimeout(() => {
      message.style.animation = 'slideOut 0.3s ease-in forwards';
      setTimeout(() => message.remove(), 300);
    }, 3000);
  }

  markAsVisited() {
    localStorage.setItem('cocopilot-visited', 'true');
  }

  // Public method to restart tour
  restartTour() {
    this.clearTourElements();
    this.currentStep = 0;
    this.isActive = true;
    this.showStep();
  }
}

// Global instance
window.onboardingTour = null;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.onboardingTour = new OnboardingTour();
  });
} else {
  window.onboardingTour = new OnboardingTour();
}

// Add CSS animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(animationStyles);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OnboardingTour;
}