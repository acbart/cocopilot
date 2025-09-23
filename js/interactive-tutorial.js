/**
 * Interactive Tutorial System
 * Provides guided tours and interactive learning experiences for new users
 */

class InteractiveTutorial {
  constructor() {
    this.currentStep = 0;
    this.tutorials = new Map();
    this.isActive = false;
    this.userProgress = this.loadUserProgress();
    this.currentTutorial = null;
    this.init();
  }

  async init() {
    try {
      await this.setupTutorials();
      await this.setupUI();
      this.setupEventListeners();
      await this.checkFirstTimeUser();
      console.log('Interactive Tutorial system initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Interactive Tutorial:', error);
    }
  }

  async setupTutorials() {
    // Define comprehensive tutorials
    this.tutorials.set('welcome', {
      id: 'welcome',
      title: '🎉 Welcome to CocoPilot!',
      description: 'Discover the amazing world of AI-driven development',
      estimatedTime: '3 minutes',
      steps: [
        {
          target: '.container h1',
          title: 'Welcome to CocoPilot!',
          content: 'This is a self-updating repository that evolves through AI-driven improvements. Let me show you around!',
          position: 'bottom',
          showNext: true,
          showSkip: true
        },
        {
          target: '.stats-grid',
          title: 'Live Repository Statistics',
          content: 'These stats update in real-time, showing the current state of the repository including stars, forks, and issues.',
          position: 'bottom',
          showNext: true,
          showBack: true
        },
        {
          target: '.about-section',
          title: 'About This Experiment',
          content: 'Learn about how this repository uses AI to continuously improve itself through daily automated analysis and enhancements.',
          position: 'top',
          showNext: true,
          showBack: true
        },
        {
          target: '.theme-toggle',
          title: 'Theme Customization',
          content: 'Toggle between light and dark themes to customize your viewing experience. The site remembers your preference!',
          position: 'left',
          showNext: true,
          showBack: true,
          highlight: true
        },
        {
          target: '#ai-suggestions-panel',
          title: 'AI Code Suggestions',
          content: 'This powerful AI assistant provides intelligent suggestions and can answer your questions about development best practices.',
          position: 'left',
          showNext: true,
          showBack: true,
          highlight: true
        }
      ]
    });

    this.tutorials.set('ai-features', {
      id: 'ai-features',
      title: '🤖 AI-Powered Features',
      description: 'Explore the intelligent features that make CocoPilot special',
      estimatedTime: '5 minutes',
      steps: [
        {
          target: '.ai-education-section',
          title: 'AI Education Module',
          content: 'Interactive lessons about AI-driven development with hands-on examples and real-world applications.',
          position: 'top',
          showNext: true,
          showSkip: true
        },
        {
          target: '.code-playground-section',
          title: 'Interactive Code Playground',
          content: 'Write, run, and experiment with code in real-time. Perfect for testing AI suggestions and learning new concepts.',
          position: 'top',
          showNext: true,
          showBack: true
        },
        {
          target: '.analytics-dashboard-section',
          title: 'Advanced Analytics',
          content: 'Visualize repository insights, contribution patterns, and AI improvement metrics with interactive charts.',
          position: 'top',
          showNext: true,
          showBack: true
        },
        {
          target: '.help-system-trigger',
          title: 'Comprehensive Help System',
          content: 'Access keyboard shortcuts, feature guides, and contextual help anytime by pressing Ctrl+/ or clicking the help button.',
          position: 'bottom',
          showNext: true,
          showBack: true,
          highlight: true
        }
      ]
    });

    this.tutorials.set('advanced-features', {
      id: 'advanced-features',
      title: '⚡ Advanced Capabilities',
      description: 'Master the advanced features for power users',
      estimatedTime: '4 minutes',
      steps: [
        {
          target: '.search-system-trigger',
          title: 'Universal Search',
          content: 'Press Ctrl+K to open the powerful search system. Find any feature, documentation, or action instantly with intelligent suggestions.',
          position: 'center',
          showNext: true,
          showSkip: true,
          action: () => this.demonstrateSearch()
        },
        {
          target: '.accessibility-panel-trigger',
          title: 'Accessibility Features',
          content: 'Press Alt+0 to access comprehensive accessibility options including high contrast, large text, and reduced motion settings.',
          position: 'center',
          showNext: true,
          showBack: true,
          action: () => this.demonstrateAccessibility()
        },
        {
          target: '.performance-indicators',
          title: 'Performance Monitoring',
          content: 'Real-time performance metrics ensure optimal user experience with Core Web Vitals tracking and optimization.',
          position: 'top',
          showNext: true,
          showBack: true
        }
      ]
    });
  }

  async setupUI() {
    // Create tutorial overlay and controls
    const tutorialOverlay = document.createElement('div');
    tutorialOverlay.id = 'tutorial-overlay';
    tutorialOverlay.className = 'tutorial-overlay';
    tutorialOverlay.innerHTML = `
      <div class="tutorial-backdrop" aria-hidden="true"></div>
      <div class="tutorial-spotlight" aria-hidden="true"></div>
      <div class="tutorial-tooltip" role="dialog" aria-labelledby="tutorial-title" aria-describedby="tutorial-content">
        <div class="tutorial-header">
          <h3 id="tutorial-title" class="tutorial-title"></h3>
          <button class="tutorial-close" aria-label="Close tutorial" title="Close tutorial">×</button>
        </div>
        <div id="tutorial-content" class="tutorial-content"></div>
        <div class="tutorial-progress">
          <div class="tutorial-progress-bar">
            <div class="tutorial-progress-fill"></div>
          </div>
          <span class="tutorial-step-indicator">Step 1 of 5</span>
        </div>
        <div class="tutorial-controls">
          <button class="tutorial-btn tutorial-skip" aria-label="Skip tutorial">Skip Tour</button>
          <div class="tutorial-navigation">
            <button class="tutorial-btn tutorial-back" aria-label="Previous step">Back</button>
            <button class="tutorial-btn tutorial-next" aria-label="Next step">Next</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(tutorialOverlay);

    // Create tutorial launcher
    const tutorialLauncher = document.createElement('div');
    tutorialLauncher.id = 'tutorial-launcher';
    tutorialLauncher.className = 'tutorial-launcher';
    tutorialLauncher.innerHTML = `
      <div class="tutorial-launcher-content">
        <h3>🎓 Interactive Tutorials</h3>
        <p>Learn to use CocoPilot's features with guided tours</p>
        <div class="tutorial-options">
          <button class="tutorial-option" data-tutorial="welcome">
            <span class="tutorial-icon">👋</span>
            <div class="tutorial-info">
              <strong>Welcome Tour</strong>
              <small>Get started with the basics</small>
            </div>
          </button>
          <button class="tutorial-option" data-tutorial="ai-features">
            <span class="tutorial-icon">🤖</span>
            <div class="tutorial-info">
              <strong>AI Features</strong>
              <small>Explore intelligent capabilities</small>
            </div>
          </button>
          <button class="tutorial-option" data-tutorial="advanced-features">
            <span class="tutorial-icon">⚡</span>
            <div class="tutorial-info">
              <strong>Advanced Features</strong>
              <small>Master power user tools</small>
            </div>
          </button>
        </div>
        <div class="tutorial-launcher-controls">
          <button class="tutorial-close-launcher">Maybe Later</button>
        </div>
      </div>
    `;

    // Add CSS styles
    this.addStyles();

    // Insert launcher into the page
    const targetContainer = document.querySelector('.container') || document.body;
    targetContainer.appendChild(tutorialLauncher);

    // Initially hide both overlay and launcher
    tutorialOverlay.style.display = 'none';
    tutorialLauncher.style.display = 'none';
  }

  addStyles() {
    if (document.getElementById('tutorial-styles')) {
      return;
    }

    const styles = document.createElement('style');
    styles.id = 'tutorial-styles';
    styles.textContent = `
      .tutorial-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        pointer-events: none;
      }

      .tutorial-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        transition: opacity 0.3s ease;
      }

      .tutorial-spotlight {
        position: absolute;
        border: 3px solid var(--button-gradient-start, #667eea);
        border-radius: 8px;
        box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7);
        transition: all 0.3s ease;
        pointer-events: none;
      }

      .tutorial-tooltip {
        position: absolute;
        background: var(--container-bg, white);
        border: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
        border-radius: 12px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        max-width: 320px;
        min-width: 280px;
        pointer-events: auto;
        transform: scale(0.9);
        opacity: 0;
        transition: all 0.3s ease;
      }

      .tutorial-tooltip.show {
        transform: scale(1);
        opacity: 1;
      }

      .tutorial-header {
        padding: 16px 16px 0 16px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }

      .tutorial-title {
        margin: 0;
        color: var(--text-primary, #333);
        font-size: 1.1rem;
        font-weight: 600;
        flex: 1;
      }

      .tutorial-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--text-secondary, #666);
        cursor: pointer;
        padding: 0;
        margin-left: 10px;
        line-height: 1;
      }

      .tutorial-close:hover {
        color: var(--text-primary, #333);
      }

      .tutorial-content {
        padding: 8px 16px 16px 16px;
        color: var(--text-secondary, #666);
        line-height: 1.5;
      }

      .tutorial-progress {
        padding: 0 16px 16px 16px;
      }

      .tutorial-progress-bar {
        width: 100%;
        height: 4px;
        background: var(--feature-bg, rgba(102, 126, 234, 0.1));
        border-radius: 2px;
        overflow: hidden;
        margin-bottom: 8px;
      }

      .tutorial-progress-fill {
        height: 100%;
        background: linear-gradient(135deg, var(--button-gradient-start, #667eea), var(--button-gradient-end, #764ba2));
        border-radius: 2px;
        transition: width 0.3s ease;
      }

      .tutorial-step-indicator {
        font-size: 0.85rem;
        color: var(--text-tertiary, #888);
      }

      .tutorial-controls {
        padding: 0 16px 16px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .tutorial-navigation {
        display: flex;
        gap: 8px;
      }

      .tutorial-btn {
        padding: 8px 16px;
        border: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
        border-radius: 6px;
        background: var(--container-bg, white);
        color: var(--text-primary, #333);
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.2s ease;
      }

      .tutorial-btn:hover {
        background: var(--feature-bg, rgba(102, 126, 234, 0.1));
      }

      .tutorial-btn.tutorial-next {
        background: linear-gradient(135deg, var(--button-gradient-start, #667eea), var(--button-gradient-end, #764ba2));
        color: white;
        border: none;
      }

      .tutorial-btn.tutorial-next:hover {
        transform: translateY(-1px);
      }

      .tutorial-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* Tutorial Launcher */
      .tutorial-launcher {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--container-bg, white);
        border: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
        border-radius: 15px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        max-width: 420px;
        width: 90%;
        z-index: 10001;
        animation: slideInScale 0.3s ease;
      }

      @keyframes slideInScale {
        from {
          transform: translate(-50%, -50%) scale(0.9);
          opacity: 0;
        }
        to {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
      }

      .tutorial-launcher-content {
        padding: 24px;
      }

      .tutorial-launcher h3 {
        margin: 0 0 8px 0;
        color: var(--text-primary, #333);
        font-size: 1.4rem;
      }

      .tutorial-launcher p {
        margin: 0 0 20px 0;
        color: var(--text-secondary, #666);
      }

      .tutorial-options {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 20px;
      }

      .tutorial-option {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        border: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
        border-radius: 8px;
        background: var(--container-bg, white);
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: left;
      }

      .tutorial-option:hover {
        background: var(--feature-bg, rgba(102, 126, 234, 0.05));
        transform: translateY(-1px);
      }

      .tutorial-icon {
        font-size: 1.5rem;
        flex-shrink: 0;
      }

      .tutorial-info strong {
        display: block;
        color: var(--text-primary, #333);
        margin-bottom: 2px;
      }

      .tutorial-info small {
        color: var(--text-secondary, #666);
      }

      .tutorial-launcher-controls {
        display: flex;
        justify-content: center;
      }

      .tutorial-close-launcher {
        padding: 8px 20px;
        border: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
        border-radius: 6px;
        background: var(--container-bg, white);
        color: var(--text-secondary, #666);
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .tutorial-close-launcher:hover {
        background: var(--feature-bg, rgba(102, 126, 234, 0.1));
      }

      /* Responsive design */
      @media (max-width: 768px) {
        .tutorial-tooltip {
          max-width: calc(100vw - 40px);
          min-width: calc(100vw - 40px);
        }

        .tutorial-launcher {
          max-width: calc(100vw - 40px);
        }

        .tutorial-controls {
          flex-direction: column;
          gap: 12px;
        }

        .tutorial-navigation {
          width: 100%;
          justify-content: space-between;
        }
      }

      /* Dark theme support */
      [data-theme="dark"] .tutorial-tooltip,
      [data-theme="dark"] .tutorial-launcher {
        background: var(--container-bg, rgba(30, 30, 30, 0.95));
      }

      [data-theme="dark"] .tutorial-btn {
        background: var(--container-bg, rgba(40, 40, 40, 0.8));
        color: var(--text-primary, #fff);
      }

      [data-theme="dark"] .tutorial-option {
        background: var(--container-bg, rgba(40, 40, 40, 0.8));
      }

      /* High contrast support */
      @media (prefers-contrast: high) {
        .tutorial-tooltip,
        .tutorial-launcher {
          border-width: 2px;
        }

        .tutorial-spotlight {
          border-width: 4px;
        }
      }

      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        .tutorial-tooltip,
        .tutorial-launcher,
        .tutorial-spotlight,
        .tutorial-backdrop,
        .tutorial-option {
          transition: none !important;
          animation: none !important;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  setupEventListeners() {
    // Tutorial option clicks
    document.addEventListener('click', (e) => {
      if (e.target.closest('.tutorial-option')) {
        const tutorialId = e.target.closest('.tutorial-option').dataset.tutorial;
        if (tutorialId && this.tutorials.has(tutorialId)) {
          this.startTutorial(tutorialId);
        }
      }
    });

    // Close tutorial launcher
    const closeLauncher = document.querySelector('.tutorial-close-launcher');
    if (closeLauncher) {
      closeLauncher.addEventListener('click', () => {
        this.hideLauncher();
      });
    }

    // Tutorial controls
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('tutorial-close')) {
        this.endTutorial();
      } else if (e.target.classList.contains('tutorial-skip')) {
        this.endTutorial();
      } else if (e.target.classList.contains('tutorial-next')) {
        this.nextStep();
      } else if (e.target.classList.contains('tutorial-back')) {
        this.previousStep();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.isActive) {
        return;
      }

      switch (e.key) {
      case 'Escape':
        this.endTutorial();
        break;
      case 'ArrowRight':
      case 'Enter':
        if (e.target.classList.contains('tutorial-next') || !e.target.closest('.tutorial-tooltip')) {
          this.nextStep();
        }
        break;
      case 'ArrowLeft':
        this.previousStep();
        break;
      }
    });

    // Global tutorial launcher (Ctrl+?)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '?' && !this.isActive) {
        e.preventDefault();
        this.showLauncher();
      }
    });
  }

  async checkFirstTimeUser() {
    // Check if user has completed welcome tutorial
    if (!this.userProgress.completedTutorials.includes('welcome')) {
      // Small delay to let page load
      setTimeout(() => {
        this.showLauncher();
      }, 2000);
    }
  }

  showLauncher() {
    const launcher = document.getElementById('tutorial-launcher');
    if (launcher) {
      launcher.style.display = 'block';
    }
  }

  hideLauncher() {
    const launcher = document.getElementById('tutorial-launcher');
    if (launcher) {
      launcher.style.display = 'none';
    }
  }

  startTutorial(tutorialId) {
    const tutorial = this.tutorials.get(tutorialId);
    if (!tutorial) {
      return;
    }

    this.currentTutorial = tutorial;
    this.currentStep = 0;
    this.isActive = true;

    // Hide launcher
    this.hideLauncher();

    // Show overlay
    const overlay = document.getElementById('tutorial-overlay');
    if (overlay) {
      overlay.style.display = 'block';
    }

    // Start first step
    this.showStep();
  }

  showStep() {
    if (!this.currentTutorial || !this.isActive) {
      return;
    }

    const step = this.currentTutorial.steps[this.currentStep];
    if (!step) {
      this.endTutorial();
      return;
    }

    // Update tooltip content
    this.updateTooltipContent(step);

    // Position tooltip and spotlight
    this.positionTooltip(step);

    // Execute step action if any
    if (step.action && typeof step.action === 'function') {
      step.action();
    }

    // Update progress
    this.updateProgress();

    // Show tooltip with animation
    setTimeout(() => {
      const tooltip = document.querySelector('.tutorial-tooltip');
      if (tooltip) {
        tooltip.classList.add('show');
      }
    }, 100);
  }

  updateTooltipContent(step) {
    const title = document.getElementById('tutorial-title');
    const content = document.getElementById('tutorial-content');
    const nextBtn = document.querySelector('.tutorial-next');
    const backBtn = document.querySelector('.tutorial-back');
    const skipBtn = document.querySelector('.tutorial-skip');

    if (title) {
      title.textContent = step.title;
    }
    if (content) {
      content.textContent = step.content;
    }

    // Show/hide buttons based on step configuration
    if (nextBtn) {
      nextBtn.style.display = step.showNext !== false ? 'block' : 'none';
      if (this.currentStep === this.currentTutorial.steps.length - 1) {
        nextBtn.textContent = 'Finish';
      } else {
        nextBtn.textContent = 'Next';
      }
    }

    if (backBtn) {
      backBtn.style.display = step.showBack === true ? 'block' : 'none';
    }

    if (skipBtn) {
      skipBtn.style.display = step.showSkip !== false ? 'block' : 'none';
    }
  }

  positionTooltip(step) {
    const tooltip = document.querySelector('.tutorial-tooltip');
    const spotlight = document.querySelector('.tutorial-spotlight');

    if (!tooltip || !spotlight) {
      return;
    }

    // Find target element
    let targetElement = null;
    if (step.target) {
      targetElement = document.querySelector(step.target);
    }

    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();

      // Position spotlight
      spotlight.style.left = `${rect.left - 8}px`;
      spotlight.style.top = `${rect.top - 8}px`;
      spotlight.style.width = `${rect.width + 16}px`;
      spotlight.style.height = `${rect.height + 16}px`;

      // Position tooltip based on step.position
      this.positionTooltipRelativeToTarget(tooltip, rect, step.position || 'bottom');

      // Highlight effect
      if (step.highlight) {
        targetElement.style.transition = 'all 0.3s ease';
        targetElement.style.transform = 'scale(1.02)';
        setTimeout(() => {
          if (targetElement) {
            targetElement.style.transform = '';
          }
        }, 2000);
      }
    } else {
      // Center tooltip if no target
      spotlight.style.display = 'none';
      tooltip.style.left = '50%';
      tooltip.style.top = '50%';
      tooltip.style.transform = 'translate(-50%, -50%)';
    }
  }

  positionTooltipRelativeToTarget(tooltip, targetRect, position) {
    const margin = 20;

    switch (position) {
    case 'top':
      tooltip.style.left = `${targetRect.left + targetRect.width / 2}px`;
      tooltip.style.top = `${targetRect.top - margin}px`;
      tooltip.style.transform = 'translate(-50%, -100%)';
      break;
    case 'bottom':
      tooltip.style.left = `${targetRect.left + targetRect.width / 2}px`;
      tooltip.style.top = `${targetRect.bottom + margin}px`;
      tooltip.style.transform = 'translate(-50%, 0)';
      break;
    case 'left':
      tooltip.style.left = `${targetRect.left - margin}px`;
      tooltip.style.top = `${targetRect.top + targetRect.height / 2}px`;
      tooltip.style.transform = 'translate(-100%, -50%)';
      break;
    case 'right':
      tooltip.style.left = `${targetRect.right + margin}px`;
      tooltip.style.top = `${targetRect.top + targetRect.height / 2}px`;
      tooltip.style.transform = 'translate(0, -50%)';
      break;
    case 'center':
    default:
      tooltip.style.left = '50%';
      tooltip.style.top = '50%';
      tooltip.style.transform = 'translate(-50%, -50%)';
      break;
    }

    // Ensure tooltip stays within viewport
    this.adjustTooltipPosition(tooltip);
  }

  adjustTooltipPosition(tooltip) {
    const rect = tooltip.getBoundingClientRect();
    const margin = 20;

    // Adjust if tooltip goes outside viewport
    if (rect.left < margin) {
      tooltip.style.left = `${margin}px`;
      tooltip.style.transform = 'translate(0, -50%)';
    }
    if (rect.right > window.innerWidth - margin) {
      tooltip.style.left = `${window.innerWidth - rect.width - margin}px`;
      tooltip.style.transform = 'translate(0, -50%)';
    }
    if (rect.top < margin) {
      tooltip.style.top = `${margin}px`;
      tooltip.style.transform = 'translate(-50%, 0)';
    }
    if (rect.bottom > window.innerHeight - margin) {
      tooltip.style.top = `${window.innerHeight - rect.height - margin}px`;
      tooltip.style.transform = 'translate(-50%, 0)';
    }
  }

  updateProgress() {
    const progressFill = document.querySelector('.tutorial-progress-fill');
    const stepIndicator = document.querySelector('.tutorial-step-indicator');

    if (progressFill && this.currentTutorial) {
      const progress = ((this.currentStep + 1) / this.currentTutorial.steps.length) * 100;
      progressFill.style.width = `${progress}%`;
    }

    if (stepIndicator && this.currentTutorial) {
      stepIndicator.textContent = `Step ${this.currentStep + 1} of ${this.currentTutorial.steps.length}`;
    }
  }

  nextStep() {
    if (!this.currentTutorial || !this.isActive) {
      return;
    }

    if (this.currentStep < this.currentTutorial.steps.length - 1) {
      this.currentStep++;
      this.showStep();
    } else {
      this.completeTutorial();
    }
  }

  previousStep() {
    if (!this.currentTutorial || !this.isActive || this.currentStep === 0) {
      return;
    }

    this.currentStep--;
    this.showStep();
  }

  completeTutorial() {
    if (this.currentTutorial) {
      // Mark tutorial as completed
      if (!this.userProgress.completedTutorials.includes(this.currentTutorial.id)) {
        this.userProgress.completedTutorials.push(this.currentTutorial.id);
        this.saveUserProgress();
      }

      // Show completion message
      this.showCompletionMessage();
    }

    setTimeout(() => {
      this.endTutorial();
    }, 2000);
  }

  showCompletionMessage() {
    const content = document.getElementById('tutorial-content');
    const title = document.getElementById('tutorial-title');

    if (title && content) {
      title.textContent = '🎉 Tutorial Complete!';
      content.textContent = 'Great job! You\'ve completed the tutorial. Feel free to explore more features or take another tour.';
    }

    // Hide controls
    const controls = document.querySelector('.tutorial-controls');
    if (controls) {
      controls.style.display = 'none';
    }
  }

  endTutorial() {
    this.isActive = false;
    this.currentTutorial = null;
    this.currentStep = 0;

    // Hide overlay
    const overlay = document.getElementById('tutorial-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }

    // Reset tooltip
    const tooltip = document.querySelector('.tutorial-tooltip');
    if (tooltip) {
      tooltip.classList.remove('show');
    }

    // Show controls again
    const controls = document.querySelector('.tutorial-controls');
    if (controls) {
      controls.style.display = 'flex';
    }
  }

  // Demonstration methods for advanced features
  demonstrateSearch() {
    // Simulate opening search
    console.log('Demonstrating search functionality...');
    // In a real implementation, this would trigger the search system
  }

  demonstrateAccessibility() {
    // Simulate opening accessibility panel
    console.log('Demonstrating accessibility features...');
    // In a real implementation, this would trigger the accessibility panel
  }

  loadUserProgress() {
    try {
      const stored = localStorage.getItem('tutorial-progress');
      return stored ? JSON.parse(stored) : {
        completedTutorials: [],
        skippedTutorials: [],
        preferences: {
          autoStart: true
        }
      };
    } catch (error) {
      return {
        completedTutorials: [],
        skippedTutorials: [],
        preferences: {
          autoStart: true
        }
      };
    }
  }

  saveUserProgress() {
    try {
      localStorage.setItem('tutorial-progress', JSON.stringify(this.userProgress));
    } catch (error) {
      console.warn('Could not save tutorial progress:', error);
    }
  }

  // Public API methods
  launchTutorial(tutorialId) {
    if (this.tutorials.has(tutorialId)) {
      this.startTutorial(tutorialId);
    }
  }

  isFirstTimeUser() {
    return this.userProgress.completedTutorials.length === 0;
  }

  getCompletedTutorials() {
    return [...this.userProgress.completedTutorials];
  }

  resetProgress() {
    this.userProgress = {
      completedTutorials: [],
      skippedTutorials: [],
      preferences: {
        autoStart: true
      }
    };
    this.saveUserProgress();
  }
}

// Initialize the Interactive Tutorial system when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.interactiveTutorial = new InteractiveTutorial();
  });
} else {
  window.interactiveTutorial = new InteractiveTutorial();
}

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InteractiveTutorial;
}