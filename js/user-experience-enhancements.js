/**
 * User Experience Enhancements
 * Adds subtle visual feedback, tips, and progressive disclosure features
 */

class UserExperienceEnhancements {
  constructor() {
    this.hasShownWelcomeTip = localStorage.getItem('cocopilot-welcome-shown') === 'true';
    this.progressBar = null;
    this.tipsShown = [];
  }

  init() {
    this.addProgressBar();
    this.addTipsSystem();
    this.addKeyboardShortcutHint();
    this.addMobileTouchHints();
    this.setupProgressTracking();
    console.log('✨ User Experience Enhancements initialized');
  }

  /**
   * Add a subtle progress bar at the top of the page
   */
  addProgressBar() {
    // Create progress bar container
    const progressContainer = document.createElement('div');
    progressContainer.id = 'page-progress-bar';
    progressContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      z-index: 10000;
      pointer-events: none;
    `;

    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #667eea, #764ba2);
      transition: width 0.3s ease;
      box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
    `;

    progressContainer.appendChild(progressBar);
    document.body.insertBefore(progressContainer, document.body.firstChild);
    this.progressBar = progressBar;

    // Track page load progress
    this.updateProgress(0);
  }

  /**
   * Update progress bar
   */
  updateProgress(percentage) {
    if (this.progressBar) {
      this.progressBar.style.width = `${Math.min(100, percentage)}%`;
      
      // Hide when complete
      if (percentage >= 100) {
        setTimeout(() => {
          this.progressBar.parentElement.style.opacity = '0';
          setTimeout(() => {
            this.progressBar.parentElement.style.display = 'none';
          }, 300);
        }, 500);
      }
    }
  }

  /**
   * Setup progress tracking for page load
   */
  setupProgressTracking() {
    let progress = 0;
    
    // Simulate progressive loading
    const updateInterval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 90) {
        clearInterval(updateInterval);
        progress = 90;
      }
      this.updateProgress(progress);
    }, 100);

    // Complete when page fully loads
    if (document.readyState === 'complete') {
      clearInterval(updateInterval);
      this.updateProgress(100);
    } else {
      window.addEventListener('load', () => {
        clearInterval(updateInterval);
        this.updateProgress(100);
      });
    }
  }

  /**
   * Add helpful tips system
   */
  addTipsSystem() {
    const tips = [
      { id: 'keyboard', icon: '⌨️', text: 'Press <kbd>?</kbd> to see keyboard shortcuts', delay: 3000, condition: () => !this.hasShownWelcomeTip },
      { id: 'theme', icon: '🎨', text: 'Press <kbd>T</kbd> to toggle theme', delay: 8000, condition: () => !localStorage.getItem('cocopilot-theme') },
      { id: 'rss', icon: '📡', text: 'Press <kbd>R</kbd> to access the RSS feed', delay: 15000, condition: () => true },
    ];

    tips.forEach(tip => {
      if (tip.condition()) {
        setTimeout(() => this.showTip(tip), tip.delay);
      }
    });

    // Mark welcome as shown after first tip
    if (!this.hasShownWelcomeTip) {
      setTimeout(() => {
        localStorage.setItem('cocopilot-welcome-shown', 'true');
      }, 3000);
    }
  }

  /**
   * Show a tip notification
   */
  showTip(tip) {
    if (this.tipsShown.includes(tip.id)) return;
    this.tipsShown.push(tip.id);

    const toast = document.createElement('div');
    toast.className = 'tip-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--container-bg, white);
      color: var(--text-primary, black);
      padding: 15px 20px;
      border-radius: 10px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      gap: 10px;
      max-width: 320px;
      z-index: 9999;
      animation: slideInRight 0.4s ease, fadeOut 0.4s ease 6s forwards;
      border: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
      backdrop-filter: blur(10px);
    `;

    toast.innerHTML = `
      <span style="font-size: 1.5em;">${tip.icon}</span>
      <span style="flex: 1; line-height: 1.4;">${tip.text}</span>
      <button style="
        background: transparent;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        font-size: 1.2em;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      " aria-label="Close tip">×</button>
    `;

    // Add animation styles if not present
    if (!document.getElementById('tip-animations')) {
      const style = document.createElement('style');
      style.id = 'tip-animations';
      style.textContent = `
        @keyframes slideInRight {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
          to { opacity: 0; transform: translateX(400px); }
        }
        .tip-toast kbd {
          background: var(--feature-bg, rgba(102, 126, 234, 0.1));
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.9em;
          font-weight: bold;
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    // Close button
    toast.querySelector('button').onclick = () => {
      toast.style.animation = 'fadeOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    };

    // Auto-remove after animation
    setTimeout(() => {
      if (document.body.contains(toast)) {
        toast.remove();
      }
    }, 6500);
  }

  /**
   * Add keyboard shortcut hint for first-time visitors
   */
  addKeyboardShortcutHint() {
    if (this.hasShownWelcomeTip) return;

    const hint = document.createElement('div');
    hint.className = 'keyboard-hint';
    hint.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--container-bg, white);
      color: var(--text-primary, black);
      padding: 12px 20px;
      border-radius: 25px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
      font-size: 0.9em;
      z-index: 9998;
      animation: fadeInUp 0.5s ease 2s both, fadeOut 0.5s ease 10s forwards;
      border: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
      display: flex;
      align-items: center;
      gap: 8px;
    `;

    hint.innerHTML = `
      <span style="font-size: 1.2em;">💡</span>
      <span>Tip: Press <kbd style="background: var(--feature-bg); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.95em; font-weight: bold;">?</kbd> for keyboard shortcuts</span>
    `;

    // Add animation if not present
    if (!document.getElementById('keyboard-hint-animations')) {
      const style = document.createElement('style');
      style.id = 'keyboard-hint-animations';
      style.textContent = `
        @keyframes fadeInUp {
          from { transform: translate(-50%, 20px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        @media (max-width: 768px) {
          .keyboard-hint {
            bottom: 80px !important;
            font-size: 0.85em !important;
            padding: 10px 16px !important;
          }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(hint);

    // Remove after animation
    setTimeout(() => {
      if (document.body.contains(hint)) {
        hint.remove();
      }
    }, 10500);
  }

  /**
   * Add mobile touch gesture hints
   */
  addMobileTouchHints() {
    // Only show on mobile devices
    if (window.innerWidth > 768) return;

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) return;

    const hasSeenHints = localStorage.getItem('cocopilot-mobile-hints-shown') === 'true';
    if (hasSeenHints) return;

    // Show swipe hints after a delay
    setTimeout(() => {
      this.showMobileHint('👆 Tap menu buttons for quick navigation', 5000);
      localStorage.setItem('cocopilot-mobile-hints-shown', 'true');
    }, 4000);
  }

  /**
   * Show mobile hint
   */
  showMobileHint(text, duration = 5000) {
    const hint = document.createElement('div');
    hint.style.cssText = `
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--container-bg, white);
      color: var(--text-primary, black);
      padding: 12px 20px;
      border-radius: 20px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      font-size: 0.9em;
      z-index: 9997;
      max-width: 80%;
      text-align: center;
      animation: fadeInDown 0.4s ease, fadeOut 0.4s ease ${(duration - 400) / 1000}s forwards;
      border: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
    `;

    hint.textContent = text;

    if (!document.getElementById('mobile-hint-animations')) {
      const style = document.createElement('style');
      style.id = 'mobile-hint-animations';
      style.textContent = `
        @keyframes fadeInDown {
          from { transform: translate(-50%, -20px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(hint);

    setTimeout(() => {
      if (document.body.contains(hint)) {
        hint.remove();
      }
    }, duration);
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.userExperienceEnhancements = new UserExperienceEnhancements();
    window.userExperienceEnhancements.init();
  });
} else {
  window.userExperienceEnhancements = new UserExperienceEnhancements();
  window.userExperienceEnhancements.init();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UserExperienceEnhancements;
}
