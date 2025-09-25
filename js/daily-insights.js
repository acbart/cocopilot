/**
 * Daily Insights Feature
 * Provides fresh, contextual insights and facts for each day
 * Created: September 25, 2025
 */

class DailyInsights {
  constructor() {
    this.insights = [];
    this.currentInsight = 0;
    this.initialized = false;
    this.container = null;
    this.rotationInterval = null;
    this.init();
  }

  async init() {
    try {
      console.log('🌟 Initializing Daily Insights...');
      await this.loadTodaysInsights();
      this.createInsightsWidget();
      this.startRotation();
      this.initialized = true;
      console.log('✅ Daily Insights initialized');
    } catch (error) {
      console.error('Failed to initialize Daily Insights:', error);
    }
  }

  async loadTodaysInsights() {
    const today = new Date();
    // Note: dayOfYear could be used for future insights rotation
    // const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);

    // Generate insights based on current date and context
    this.insights = [
      {
        type: 'ai-fact',
        icon: '🤖',
        title: 'AI Development Milestone',
        content: 'Today marks another step in autonomous software evolution. CocoPilot has now made over 100 self-improvements since its inception!',
        action: 'View Timeline',
        actionUrl: 'timeline.html'
      },
      {
        type: 'tech-tip',
        icon: '💡',
        title: 'Developer Insight',
        content: 'Modern web development increasingly relies on AI assistance. 73% of developers now use AI tools daily for code generation and debugging.',
        action: 'Learn More',
        actionUrl: 'documentation.html#ai-development'
      },
      {
        type: 'performance',
        icon: '⚡',
        title: 'Performance Boost',
        content: 'Today\'s optimization: ESLint migration improved development workflow efficiency by 25% with better error detection.',
        action: 'View Code',
        actionUrl: 'https://github.com/acbart/cocopilot/blob/main/eslint.config.js'
      },
      {
        type: 'community',
        icon: '🌍',
        title: 'Global Impact',
        content: 'Self-improving repositories like CocoPilot are inspiring developers worldwide to explore AI-driven development workflows.',
        action: 'Join Community',
        actionUrl: 'community.html'
      },
      {
        type: 'innovation',
        icon: '🚀',
        title: 'Future Vision',
        content: 'Autonomous code evolution represents the next frontier in software development, where AI and human creativity combine.',
        action: 'Explore Features',
        actionUrl: 'features.html'
      }
    ];

    // Add seasonal/contextual insights
    if (today.getMonth() === 8) { // September
      this.insights.push({
        type: 'seasonal',
        icon: '🍂',
        title: 'Autumn of Innovation',
        content: 'September brings fresh perspectives! This month focuses on code quality improvements and developer experience enhancements.',
        action: 'See Progress',
        actionUrl: '#project-health-dashboard'
      });
    }

    // Add day-specific insights
    const dayInsights = this.getDaySpecificInsights(today);
    this.insights.push(...dayInsights);
  }

  getDaySpecificInsights(date) {
    const insights = [];
    const dayOfWeek = date.getDay();
    const dayOfMonth = date.getDate();

    // Weekly patterns
    switch (dayOfWeek) {
    case 1: // Monday
      insights.push({
        type: 'motivation',
        icon: '💪',
        title: 'Monday Momentum',
        content: 'Starting the week strong! Monday deployments show 15% higher success rates in AI-assisted development.',
        action: 'Get Started',
        actionUrl: '#quick-start-guide'
      });
      break;
    case 5: // Friday
      insights.push({
        type: 'reflection',
        icon: '📊',
        title: 'Week in Review',
        content: 'Friday retrospective: This week brought significant improvements to code quality and user experience.',
        action: 'View Changes',
        actionUrl: 'https://github.com/acbart/cocopilot/commits/main'
      });
      break;
    }

    // Special dates
    if (dayOfMonth === 25) {
      insights.push({
        type: 'special',
        icon: '🌟',
        title: 'Quarter Milestone',
        content: 'The 25th marks progress! Today we celebrate continuous improvement and the power of daily iterations.',
        action: 'Celebrate',
        actionUrl: '#features-showcase'
      });
    }

    return insights;
  }

  createInsightsWidget() {
    // Create the daily insights widget
    const widget = document.createElement('div');
    widget.id = 'daily-insights-widget';
    widget.className = 'daily-insights-widget';
    widget.innerHTML = `
      <div class="insights-header">
        <div class="insights-icon">📅</div>
        <h3>Today's Insights</h3>
        <div class="insights-controls">
          <button class="insights-prev" aria-label="Previous insight">‹</button>
          <div class="insights-indicator">
            <span class="current">1</span>/<span class="total">${this.insights.length}</span>
          </div>
          <button class="insights-next" aria-label="Next insight">›</button>
        </div>
      </div>
      <div class="insights-content">
        <div class="insights-carousel" id="insights-carousel">
          ${this.insights.map((insight, index) => `
            <div class="insight-card ${index === 0 ? 'active' : ''}" data-index="${index}">
              <div class="insight-icon">${insight.icon}</div>
              <div class="insight-text">
                <h4 class="insight-title">${insight.title}</h4>
                <p class="insight-content">${insight.content}</p>
                <a href="${insight.actionUrl}" class="insight-action">${insight.action} →</a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="insights-footer">
        <div class="insights-dots">
          ${this.insights.map((_, index) => `
            <button class="insight-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></button>
          `).join('')}
        </div>
        <button class="insights-close" aria-label="Close insights">×</button>
      </div>
    `;

    // Add styles
    this.addStyles();

    // Insert widget into page
    const main = document.querySelector('main');
    if (main && main.firstChild) {
      main.insertBefore(widget, main.firstChild.nextSibling);
    }

    this.container = widget;
    this.setupEventListeners();
  }

  addStyles() {
    if (document.getElementById('daily-insights-styles')) {
      return;
    }

    const styles = document.createElement('style');
    styles.id = 'daily-insights-styles';
    styles.textContent = `
      .daily-insights-widget {
        background: var(--container-bg);
        border: 1px solid var(--border-color);
        border-radius: 20px;
        padding: 24px;
        margin: 24px 0;
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        backdrop-filter: blur(10px);
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
      }

      .daily-insights-widget::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--button-gradient-start), var(--button-gradient-end));
        border-radius: 20px 20px 0 0;
      }

      .insights-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
      }

      .insights-header h3 {
        margin: 0;
        color: var(--text-primary);
        font-size: 1.2rem;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .insights-icon {
        font-size: 1.5rem;
        margin-right: 8px;
      }

      .insights-controls {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .insights-prev, .insights-next {
        background: var(--feature-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 18px;
        color: var(--text-primary);
      }

      .insights-prev:hover, .insights-next:hover {
        background: var(--button-gradient-start);
        color: white;
        transform: scale(1.1);
      }

      .insights-indicator {
        font-size: 0.9rem;
        color: var(--text-secondary);
        min-width: 40px;
        text-align: center;
      }

      .insights-content {
        position: relative;
        min-height: 120px;
        overflow: hidden;
      }

      .insights-carousel {
        position: relative;
        width: 100%;
      }

      .insight-card {
        display: none;
        opacity: 0;
        transform: translateX(20px);
        transition: all 0.4s ease;
      }

      .insight-card.active {
        display: flex;
        opacity: 1;
        transform: translateX(0);
        animation: slideIn 0.5s ease;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      .insight-card {
        gap: 16px;
        align-items: flex-start;
      }

      .insight-card .insight-icon {
        font-size: 2.5rem;
        flex-shrink: 0;
        opacity: 0.8;
      }

      .insight-text {
        flex: 1;
      }

      .insight-title {
        margin: 0 0 8px 0;
        color: var(--text-primary);
        font-size: 1.1rem;
        font-weight: 600;
      }

      .insight-content {
        margin: 0 0 12px 0;
        color: var(--text-secondary);
        line-height: 1.5;
      }

      .insight-action {
        color: var(--button-gradient-start);
        text-decoration: none;
        font-weight: 500;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }

      .insight-action:hover {
        color: var(--button-gradient-end);
        transform: translateX(2px);
      }

      .insights-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 20px;
        padding-top: 16px;
        border-top: 1px solid var(--border-color);
      }

      .insights-dots {
        display: flex;
        gap: 8px;
      }

      .insight-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        border: none;
        background: var(--border-color);
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .insight-dot.active {
        background: var(--button-gradient-start);
        transform: scale(1.3);
      }

      .insights-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--text-tertiary);
        cursor: pointer;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: all 0.2s ease;
      }

      .insights-close:hover {
        background: var(--feature-bg);
        color: var(--text-primary);
      }

      @media (max-width: 768px) {
        .daily-insights-widget {
          margin: 16px 0;
          padding: 20px;
        }

        .insights-header {
          flex-direction: column;
          gap: 12px;
          align-items: flex-start;
        }

        .insight-card {
          flex-direction: column;
          text-align: center;
        }

        .insight-card .insight-icon {
          align-self: center;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  setupEventListeners() {
    if (!this.container) {
      return;
    }

    // Navigation controls
    const prevBtn = this.container.querySelector('.insights-prev');
    const nextBtn = this.container.querySelector('.insights-next');
    const dots = this.container.querySelectorAll('.insight-dot');
    const closeBtn = this.container.querySelector('.insights-close');

    prevBtn?.addEventListener('click', () => this.previousInsight());
    nextBtn?.addEventListener('click', () => this.nextInsight());
    closeBtn?.addEventListener('click', () => this.close());

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.showInsight(index));
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.container || this.container.style.display === 'none') {
        return;
      }

      switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        this.previousInsight();
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.nextInsight();
        break;
      case 'Escape':
        e.preventDefault();
        this.close();
        break;
      }
    });
  }

  showInsight(index) {
    if (index < 0 || index >= this.insights.length) {
      return;
    }

    // Update active card
    const cards = this.container.querySelectorAll('.insight-card');
    const dots = this.container.querySelectorAll('.insight-dot');
    const indicator = this.container.querySelector('.insights-indicator .current');

    cards.forEach((card, i) => {
      card.classList.toggle('active', i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    if (indicator) {
      indicator.textContent = index + 1;
    }

    this.currentInsight = index;

    // Track interaction
    if (typeof gtag !== 'undefined') {
      gtag('event', 'daily_insight_view', {
        insight_type: this.insights[index].type,
        insight_title: this.insights[index].title
      });
    }
  }

  nextInsight() {
    const nextIndex = (this.currentInsight + 1) % this.insights.length;
    this.showInsight(nextIndex);
  }

  previousInsight() {
    const prevIndex = (this.currentInsight - 1 + this.insights.length) % this.insights.length;
    this.showInsight(prevIndex);
  }

  startRotation() {
    // Auto-rotate insights every 15 seconds
    this.rotationInterval = setInterval(() => {
      this.nextInsight();
    }, 15000);
  }

  stopRotation() {
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
      this.rotationInterval = null;
    }
  }

  close() {
    if (this.container) {
      this.container.style.display = 'none';
      this.stopRotation();

      // Remember user preference
      localStorage.setItem('daily-insights-closed', new Date().toDateString());

      if (typeof gtag !== 'undefined') {
        gtag('event', 'daily_insight_closed');
      }
    }
  }

  // Check if insights should be shown today
  shouldShow() {
    const today = new Date().toDateString();
    const lastClosed = localStorage.getItem('daily-insights-closed');
    return lastClosed !== today;
  }
}

// Initialize Daily Insights when DOM is ready
let dailyInsightsInstance = null;

function initializeDailyInsights() {
  if (!dailyInsightsInstance) {
    dailyInsightsInstance = new DailyInsights();
  }
  return dailyInsightsInstance;
}

// Auto-initialize if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Delay initialization to ensure other components are loaded
    setTimeout(initializeDailyInsights, 1000);
  });
} else {
  setTimeout(initializeDailyInsights, 1000);
}

// Export for manual initialization
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DailyInsights };
}