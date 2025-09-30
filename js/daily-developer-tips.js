/**
 * Daily Developer Tips Widget
 * Displays rotating tips about AI-driven development, best practices, and CocoPilot features
 */

class DailyDeveloperTips {
  constructor() {
    this.isInitialized = false;
    this.currentTipIndex = 0;
    this.tips = [
      {
        id: 'ai-collaboration',
        category: 'AI Development',
        icon: '🤖',
        title: 'AI-Human Collaboration',
        tip: 'The best results come from combining AI efficiency with human creativity. Let AI handle repetitive tasks while you focus on strategic decisions.',
        actionText: 'Learn More',
        actionUrl: 'documentation.html#ai-collaboration'
      },
      {
        id: 'incremental-changes',
        category: 'Best Practice',
        icon: '🎯',
        title: 'Make Incremental Changes',
        tip: 'Small, focused commits are easier to review, test, and debug than large sweeping changes. CocoPilot updates daily with surgical precision.',
        actionText: 'View Timeline',
        actionUrl: 'timeline.html'
      },
      {
        id: 'keyboard-shortcuts',
        category: 'Productivity',
        icon: '⌨️',
        title: 'Master Keyboard Shortcuts',
        tip: 'Press Ctrl+K to search, T to toggle theme, R for RSS feed, and G to jump to GitHub. Arrow keys work in most interactive widgets!',
        actionText: 'See All Shortcuts',
        actionUrl: '#'
      },
      {
        id: 'code-quality',
        category: 'Quality',
        icon: '✨',
        title: 'Code Quality Matters',
        tip: 'CocoPilot automatically runs ESLint, Prettier, and accessibility checks. Clean code today prevents technical debt tomorrow.',
        actionText: 'View Metrics',
        actionUrl: 'analytics.html'
      },
      {
        id: 'accessibility-first',
        category: 'Accessibility',
        icon: '♿',
        title: 'Accessibility is Not Optional',
        tip: 'WCAG 2.1 AA compliance ensures everyone can use your application. Use semantic HTML, ARIA labels, and keyboard navigation.',
        actionText: 'Test Accessibility',
        actionUrl: 'docs.html#accessibility'
      },
      {
        id: 'performance-optimization',
        category: 'Performance',
        icon: '⚡',
        title: 'Performance by Default',
        tip: 'Lazy load non-critical resources, monitor Core Web Vitals, and optimize images. CocoPilot maintains a 95+ Lighthouse score.',
        actionText: 'View Dashboard',
        actionUrl: 'analytics.html#performance'
      },
      {
        id: 'documentation',
        category: 'Documentation',
        icon: '📚',
        title: 'Document as You Build',
        tip: 'Good documentation saves time for future you and your team. Comments explain why, not what. Code should be self-explanatory.',
        actionText: 'Read Docs',
        actionUrl: 'documentation.html'
      },
      {
        id: 'testing',
        category: 'Testing',
        icon: '🧪',
        title: 'Test Early, Test Often',
        tip: 'Automated tests catch bugs before users do. CocoPilot includes unit tests, E2E tests, and accessibility validation.',
        actionText: 'Explore Tests',
        actionUrl: 'docs.html#testing'
      },
      {
        id: 'mobile-first',
        category: 'Design',
        icon: '📱',
        title: 'Design Mobile-First',
        tip: 'Over 50% of web traffic is mobile. Start with mobile constraints, then enhance for larger screens. Progressive enhancement wins.',
        actionText: 'Mobile Features',
        actionUrl: 'features.html#mobile'
      },
      {
        id: 'community',
        category: 'Community',
        icon: '👥',
        title: 'Community Drives Innovation',
        tip: 'Open source thrives on collaboration. Share your insights, report issues, and contribute to make CocoPilot even better.',
        actionText: 'Join Community',
        actionUrl: 'community.html'
      }
    ];

    // Select today's tip based on date
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    this.currentTipIndex = dayOfYear % this.tips.length;
  }

  init() {
    if (this.isInitialized) {
      return;
    }

    this.createTipWidget();
    this.addStyles();
    this.setupEventListeners();
    this.isInitialized = true;
    
    console.log('💡 Daily Developer Tips initialized');
  }

  createTipWidget() {
    const existingWidget = document.getElementById('daily-developer-tips-widget');
    if (existingWidget) {
      return;
    }

    // Insert after the achievement milestones widget
    const achievementMilestones = document.getElementById('achievement-milestones-widget');
    const insertPoint = achievementMilestones;
    
    if (!insertPoint) {
      console.warn('Could not find insertion point for daily tips widget');
      return;
    }

    const widget = document.createElement('div');
    widget.id = 'daily-developer-tips-widget';
    widget.className = 'daily-tips-widget';
    widget.innerHTML = `
      <div class="tips-header">
        <div class="tips-badge">
          <span class="tips-badge-icon">💡</span>
          <span class="tips-badge-text">Tip of the Day</span>
        </div>
        <h3 class="tips-title">Developer Insight</h3>
      </div>

      <div class="tips-content">
        <div class="tip-category" id="tip-category">Category</div>
        <div class="tip-icon" id="tip-icon">💡</div>
        <h4 class="tip-title" id="tip-title">Loading tip...</h4>
        <p class="tip-text" id="tip-text">Discover helpful insights about AI-driven development and best practices.</p>
        <button type="button" class="tip-action-btn" id="tip-action-btn">
          <span id="tip-action-text">Learn More</span>
          <span class="tip-action-arrow">→</span>
        </button>
      </div>

      <div class="tips-controls">
        <button type="button" class="tip-control-btn tip-prev" id="tip-prev" aria-label="Previous tip" title="Previous tip">
          ←
        </button>
        <div class="tip-indicators" id="tip-indicators"></div>
        <button type="button" class="tip-control-btn tip-next" id="tip-next" aria-label="Next tip" title="Next tip">
          →
        </button>
      </div>

      <div class="tips-footer">
        <span class="tips-count">${this.tips.length} expert tips available</span>
        <button type="button" class="tips-random-btn" id="tips-random" title="Random tip">
          🎲 Surprise Me
        </button>
      </div>
    `;

    insertPoint.parentNode.insertBefore(widget, insertPoint.nextSibling);

    // Initialize indicators
    this.createIndicators();
    
    // Display current tip
    this.displayTip(this.currentTipIndex);
  }

  createIndicators() {
    const indicatorsContainer = document.getElementById('tip-indicators');
    if (!indicatorsContainer) return;

    indicatorsContainer.innerHTML = '';
    this.tips.forEach((_, index) => {
      const indicator = document.createElement('button');
      indicator.type = 'button';
      indicator.className = 'tip-indicator';
      indicator.setAttribute('aria-label', `View tip ${index + 1}`);
      indicator.addEventListener('click', () => this.displayTip(index));
      indicatorsContainer.appendChild(indicator);
    });
  }

  displayTip(index) {
    if (index < 0 || index >= this.tips.length) return;

    this.currentTipIndex = index;
    const tip = this.tips[index];

    // Update content
    const categoryEl = document.getElementById('tip-category');
    const iconEl = document.getElementById('tip-icon');
    const titleEl = document.getElementById('tip-title');
    const textEl = document.getElementById('tip-text');
    const actionBtn = document.getElementById('tip-action-btn');
    const actionTextEl = document.getElementById('tip-action-text');

    if (categoryEl) categoryEl.textContent = tip.category;
    if (iconEl) iconEl.textContent = tip.icon;
    if (titleEl) titleEl.textContent = tip.title;
    if (textEl) textEl.textContent = tip.tip;
    if (actionTextEl) actionTextEl.textContent = tip.actionText;
    if (actionBtn) {
      actionBtn.onclick = () => {
        if (tip.actionUrl === '#') {
          // Show keyboard shortcuts
          this.showKeyboardShortcuts();
        } else {
          window.location.href = tip.actionUrl;
        }
      };
    }

    // Update indicators
    const indicators = document.querySelectorAll('.tip-indicator');
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === index);
    });

    // Add entrance animation
    const content = document.querySelector('.tips-content');
    if (content) {
      content.classList.remove('tip-animate-in');
      void content.offsetWidth; // Trigger reflow
      content.classList.add('tip-animate-in');
    }
  }

  showKeyboardShortcuts() {
    // Check if help system exists, otherwise show alert
    if (window.comprehensiveHelpSystem && typeof window.comprehensiveHelpSystem.showHelp === 'function') {
      window.comprehensiveHelpSystem.showHelp();
    } else {
      const shortcuts = `
Keyboard Shortcuts:
• Ctrl+K - Search
• T - Toggle Theme
• R - RSS Feed
• G - GitHub
• Arrow Keys - Navigate widgets
• Escape - Close dialogs
      `;
      alert(shortcuts.trim());
    }
  }

  setupEventListeners() {
    const prevBtn = document.getElementById('tip-prev');
    const nextBtn = document.getElementById('tip-next');
    const randomBtn = document.getElementById('tips-random');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const newIndex = (this.currentTipIndex - 1 + this.tips.length) % this.tips.length;
        this.displayTip(newIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const newIndex = (this.currentTipIndex + 1) % this.tips.length;
        this.displayTip(newIndex);
      });
    }

    if (randomBtn) {
      randomBtn.addEventListener('click', () => {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * this.tips.length);
        } while (randomIndex === this.currentTipIndex && this.tips.length > 1);
        this.displayTip(randomIndex);
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      const widget = document.getElementById('daily-developer-tips-widget');
      if (!widget || !widget.matches(':hover, :focus-within')) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevBtn?.click();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextBtn?.click();
      }
    });
  }

  addStyles() {
    if (document.getElementById('daily-tips-styles')) {
      return;
    }

    const styles = document.createElement('style');
    styles.id = 'daily-tips-styles';
    styles.textContent = `
      .daily-tips-widget {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08));
        border: 2px solid var(--border-color, rgba(102, 126, 234, 0.3));
        border-radius: 16px;
        padding: 25px;
        margin: 30px 0;
        position: relative;
        overflow: hidden;
        animation: fadeInUp 0.6s ease-out;
      }

      .daily-tips-widget::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--bg-gradient-start, #667eea), var(--bg-gradient-end, #764ba2));
      }

      .tips-header {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 20px;
      }

      .tips-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: linear-gradient(135deg, var(--bg-gradient-start, #667eea), var(--bg-gradient-end, #764ba2));
        color: white;
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
      }

      .tips-badge-icon {
        font-size: 1rem;
        animation: pulse 2s ease-in-out infinite;
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }

      .tips-title {
        font-size: 1.4rem;
        font-weight: bold;
        color: var(--text-primary, #333);
        margin: 0;
      }

      .tips-content {
        background: var(--container-bg, white);
        border-radius: 12px;
        padding: 25px;
        margin-bottom: 20px;
        position: relative;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        min-height: 200px;
      }

      .tip-animate-in {
        animation: slideIn 0.4s ease-out;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      .tip-category {
        display: inline-block;
        background: rgba(102, 126, 234, 0.15);
        color: var(--bg-gradient-start, #667eea);
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 12px;
      }

      .tip-icon {
        font-size: 2.5rem;
        margin: 10px 0;
        display: block;
      }

      .tip-title {
        font-size: 1.3rem;
        font-weight: bold;
        color: var(--text-primary, #333);
        margin: 10px 0;
      }

      .tip-text {
        font-size: 1rem;
        color: var(--text-description, #555);
        line-height: 1.6;
        margin: 15px 0 20px;
      }

      .tip-action-btn {
        background: linear-gradient(135deg, var(--bg-gradient-start, #667eea), var(--bg-gradient-end, #764ba2));
        color: white;
        border: none;
        border-radius: 8px;
        padding: 10px 20px;
        font-size: 0.95rem;
        font-weight: 600;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
      }

      .tip-action-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }

      .tip-action-btn:active {
        transform: translateY(0);
      }

      .tip-action-arrow {
        font-size: 1.1rem;
        transition: transform 0.3s ease;
      }

      .tip-action-btn:hover .tip-action-arrow {
        transform: translateX(4px);
      }

      .tips-controls {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
        margin-bottom: 15px;
      }

      .tip-control-btn {
        background: var(--container-bg, white);
        border: 2px solid var(--border-color, rgba(102, 126, 234, 0.3));
        border-radius: 50%;
        width: 36px;
        height: 36px;
        font-size: 1.1rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        color: var(--text-primary, #333);
      }

      .tip-control-btn:hover {
        background: linear-gradient(135deg, var(--bg-gradient-start, #667eea), var(--bg-gradient-end, #764ba2));
        color: white;
        border-color: transparent;
        transform: scale(1.1);
      }

      .tip-control-btn:active {
        transform: scale(0.95);
      }

      .tip-indicators {
        display: flex;
        gap: 6px;
      }

      .tip-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--border-color, rgba(102, 126, 234, 0.3));
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 0;
      }

      .tip-indicator:hover {
        background: var(--bg-gradient-start, #667eea);
        transform: scale(1.3);
      }

      .tip-indicator.active {
        background: linear-gradient(135deg, var(--bg-gradient-start, #667eea), var(--bg-gradient-end, #764ba2));
        width: 20px;
        border-radius: 4px;
      }

      .tips-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 15px;
        border-top: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
      }

      .tips-count {
        font-size: 0.85rem;
        color: var(--text-secondary, #666);
        font-weight: 500;
      }

      .tips-random-btn {
        background: transparent;
        border: 1px solid var(--border-color, rgba(102, 126, 234, 0.3));
        border-radius: 20px;
        padding: 6px 14px;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--text-primary, #333);
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .tips-random-btn:hover {
        background: linear-gradient(135deg, var(--bg-gradient-start, #667eea), var(--bg-gradient-end, #764ba2));
        color: white;
        border-color: transparent;
        transform: translateY(-1px);
      }

      @media (max-width: 768px) {
        .daily-tips-widget {
          padding: 20px;
        }

        .tips-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
        }

        .tips-title {
          font-size: 1.2rem;
        }

        .tips-content {
          padding: 20px;
          min-height: auto;
        }

        .tip-icon {
          font-size: 2rem;
        }

        .tip-title {
          font-size: 1.1rem;
        }

        .tip-text {
          font-size: 0.95rem;
        }

        .tips-footer {
          flex-direction: column;
          gap: 10px;
          align-items: stretch;
        }

        .tips-random-btn {
          width: 100%;
          text-align: center;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .daily-tips-widget,
        .tips-badge-icon,
        .tip-animate-in,
        .tip-control-btn,
        .tip-indicator,
        .tip-action-btn {
          animation: none;
          transition: none;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  cleanup() {
    // Cleanup if needed
  }
}

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.dailyDeveloperTips = new DailyDeveloperTips();
      window.dailyDeveloperTips.init();
    });
  } else {
    window.dailyDeveloperTips = new DailyDeveloperTips();
    window.dailyDeveloperTips.init();
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DailyDeveloperTips;
}
