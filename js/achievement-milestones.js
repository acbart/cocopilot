/**
 * Achievement Milestones Widget
 * Displays interactive project evolution milestones with visual progress indicators
 */

class AchievementMilestones {
  constructor() {
    this.isInitialized = false;
    this.currentMilestoneIndex = 0;
    this.milestones = [
      {
        id: 'project-launch',
        title: '🚀 Project Launch',
        date: 'September 2025',
        description: 'CocoPilot begins its journey as a self-improving AI-driven repository',
        achievement: 'Initial commit with vision for autonomous evolution',
        progress: 100,
        category: 'Foundation'
      },
      {
        id: 'ai-education',
        title: '🎓 AI Education Hub',
        date: 'September 19, 2025',
        description: 'Interactive learning modules for AI-driven development',
        achievement: '3 comprehensive lessons with hands-on playground',
        progress: 100,
        category: 'Features'
      },
      {
        id: 'performance-optimization',
        title: '⚡ Performance Excellence',
        date: 'September 22, 2025',
        description: 'Advanced optimizations for speed and efficiency',
        achievement: '96/100 Lighthouse score with Core Web Vitals monitoring',
        progress: 100,
        category: 'Technical'
      },
      {
        id: 'code-quality',
        title: '🔧 Code Quality Mastery',
        date: 'September 27, 2025',
        description: 'Automated linting and code maintenance improvements',
        achievement: '151+ issues resolved across 40+ JavaScript modules',
        progress: 100,
        category: 'Quality'
      },
      {
        id: 'analytics-consistency',
        title: '📊 Analytics Expansion',
        date: 'September 30, 2025',
        description: 'Complete analytics coverage across all pages',
        achievement: 'Google Analytics tracking on 100% of pages',
        progress: 100,
        category: 'Insights'
      },
      {
        id: 'future-vision',
        title: '🔮 Future Innovations',
        date: 'Coming Soon',
        description: 'Continuous evolution through daily AI improvements',
        achievement: 'Next breakthrough feature in development',
        progress: 45,
        category: 'Roadmap'
      }
    ];
  }

  init() {
    if (this.isInitialized) {
      return;
    }

    this.createMilestonesWidget();
    this.addStyles();
    this.setupEventListeners();
    this.startAutoRotation();
    this.isInitialized = true;
    
    console.log('🏆 Achievement Milestones initialized');
  }

  createMilestonesWidget() {
    const existingWidget = document.getElementById('achievement-milestones-widget');
    if (existingWidget) {
      return;
    }

    // Find a good place to insert - after the project health dashboard
    const healthDashboard = document.querySelector('.project-health-dashboard');
    if (!healthDashboard) {
      console.warn('Could not find project health dashboard to insert milestones widget');
      return;
    }

    const widget = document.createElement('div');
    widget.id = 'achievement-milestones-widget';
    widget.className = 'achievement-milestones-widget';
    widget.innerHTML = `
      <div class="milestones-header">
        <h2 class="milestones-title">🏆 Achievement Milestones</h2>
        <p class="milestones-subtitle">Track the evolution of CocoPilot's AI-driven journey</p>
      </div>

      <div class="milestones-container">
        <div class="milestone-display">
          <div class="milestone-content">
            <div class="milestone-category" id="milestone-category">Category</div>
            <h3 class="milestone-title" id="milestone-title">Loading...</h3>
            <div class="milestone-date" id="milestone-date">Date</div>
            <p class="milestone-description" id="milestone-description">Description</p>
            <div class="milestone-achievement" id="milestone-achievement">
              <span class="achievement-icon">✨</span>
              <span class="achievement-text">Achievement</span>
            </div>
            <div class="milestone-progress-container">
              <div class="progress-label">
                <span>Progress</span>
                <span class="progress-percentage" id="progress-percentage">0%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" id="progress-fill" style="width: 0%"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="milestones-navigation">
          <button type="button" class="milestone-nav-btn" id="prev-milestone" aria-label="Previous milestone">
            ←
          </button>
          <div class="milestone-dots" id="milestone-dots"></div>
          <button type="button" class="milestone-nav-btn" id="next-milestone" aria-label="Next milestone">
            →
          </button>
        </div>
      </div>

      <div class="milestones-stats">
        <div class="stat-item">
          <div class="stat-value">${this.milestones.filter(m => m.progress === 100).length}</div>
          <div class="stat-label">Completed</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${this.milestones.filter(m => m.progress < 100 && m.progress > 0).length}</div>
          <div class="stat-label">In Progress</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${this.milestones.length}</div>
          <div class="stat-label">Total Milestones</div>
        </div>
      </div>
    `;

    healthDashboard.parentNode.insertBefore(widget, healthDashboard.nextSibling);

    // Initialize dots
    this.createNavigationDots();
    
    // Display first milestone
    this.displayMilestone(0);
  }

  createNavigationDots() {
    const dotsContainer = document.getElementById('milestone-dots');
    if (!dotsContainer) return;

    dotsContainer.innerHTML = '';
    this.milestones.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'milestone-dot';
      dot.setAttribute('aria-label', `Go to milestone ${index + 1}`);
      dot.addEventListener('click', () => this.displayMilestone(index));
      dotsContainer.appendChild(dot);
    });
  }

  displayMilestone(index) {
    if (index < 0 || index >= this.milestones.length) return;

    this.currentMilestoneIndex = index;
    const milestone = this.milestones[index];

    // Update content
    const categoryEl = document.getElementById('milestone-category');
    const titleEl = document.getElementById('milestone-title');
    const dateEl = document.getElementById('milestone-date');
    const descEl = document.getElementById('milestone-description');
    const achievementEl = document.getElementById('milestone-achievement');
    const progressPercentageEl = document.getElementById('progress-percentage');
    const progressFillEl = document.getElementById('progress-fill');

    if (categoryEl) categoryEl.textContent = milestone.category;
    if (titleEl) titleEl.textContent = milestone.title;
    if (dateEl) dateEl.textContent = milestone.date;
    if (descEl) descEl.textContent = milestone.description;
    if (achievementEl) {
      achievementEl.querySelector('.achievement-text').textContent = milestone.achievement;
    }
    if (progressPercentageEl) progressPercentageEl.textContent = `${milestone.progress}%`;
    if (progressFillEl) {
      progressFillEl.style.width = `${milestone.progress}%`;
      // Color code based on progress
      if (milestone.progress === 100) {
        progressFillEl.style.background = 'linear-gradient(90deg, #10b981, #059669)';
      } else if (milestone.progress >= 50) {
        progressFillEl.style.background = 'linear-gradient(90deg, #3b82f6, #2563eb)';
      } else {
        progressFillEl.style.background = 'linear-gradient(90deg, #f59e0b, #d97706)';
      }
    }

    // Update dots
    const dots = document.querySelectorAll('.milestone-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  setupEventListeners() {
    const prevBtn = document.getElementById('prev-milestone');
    const nextBtn = document.getElementById('next-milestone');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const newIndex = this.currentMilestoneIndex - 1;
        if (newIndex >= 0) {
          this.displayMilestone(newIndex);
          this.resetAutoRotation();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const newIndex = this.currentMilestoneIndex + 1;
        if (newIndex < this.milestones.length) {
          this.displayMilestone(newIndex);
          this.resetAutoRotation();
        }
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      const widget = document.getElementById('achievement-milestones-widget');
      if (!widget || !widget.matches(':hover')) return;

      if (e.key === 'ArrowLeft') {
        prevBtn?.click();
      } else if (e.key === 'ArrowRight') {
        nextBtn?.click();
      }
    });
  }

  startAutoRotation() {
    // Auto-rotate every 8 seconds
    this.rotationInterval = setInterval(() => {
      const nextIndex = (this.currentMilestoneIndex + 1) % this.milestones.length;
      this.displayMilestone(nextIndex);
    }, 8000);
  }

  resetAutoRotation() {
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
      this.startAutoRotation();
    }
  }

  addStyles() {
    if (document.getElementById('achievement-milestones-styles')) {
      return;
    }

    const styles = document.createElement('style');
    styles.id = 'achievement-milestones-styles';
    styles.textContent = `
      .achievement-milestones-widget {
        background: var(--feature-bg, rgba(102, 126, 234, 0.1));
        border: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
        border-radius: 15px;
        padding: 30px;
        margin: 30px 0;
        animation: fadeInUp 0.6s ease-out;
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .milestones-header {
        text-align: center;
        margin-bottom: 25px;
      }

      .milestones-title {
        font-size: 1.8rem;
        font-weight: bold;
        color: var(--text-primary, #333);
        margin-bottom: 10px;
      }

      .milestones-subtitle {
        font-size: 1rem;
        color: var(--text-secondary, #666);
      }

      .milestone-display {
        background: var(--container-bg, white);
        border-radius: 12px;
        padding: 25px;
        margin-bottom: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .milestone-display:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
      }

      .milestone-category {
        display: inline-block;
        background: linear-gradient(135deg, var(--bg-gradient-start, #667eea), var(--bg-gradient-end, #764ba2));
        color: white;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
        margin-bottom: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .milestone-title {
        font-size: 1.5rem;
        color: var(--text-primary, #333);
        margin: 10px 0;
        font-weight: bold;
      }

      .milestone-date {
        font-size: 0.9rem;
        color: var(--text-secondary, #666);
        margin-bottom: 15px;
        font-weight: 500;
      }

      .milestone-description {
        color: var(--text-description, #555);
        line-height: 1.6;
        margin-bottom: 15px;
      }

      .milestone-achievement {
        background: rgba(16, 185, 129, 0.1);
        border-left: 3px solid #10b981;
        padding: 12px;
        border-radius: 8px;
        margin: 15px 0;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .achievement-icon {
        font-size: 1.2rem;
      }

      .achievement-text {
        color: var(--text-primary, #333);
        font-weight: 500;
      }

      .milestone-progress-container {
        margin-top: 20px;
      }

      .progress-label {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        font-size: 0.9rem;
        color: var(--text-secondary, #666);
        font-weight: 600;
      }

      .progress-percentage {
        color: var(--text-primary, #333);
        font-weight: bold;
      }

      .progress-bar {
        width: 100%;
        height: 8px;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--bg-gradient-start, #667eea), var(--bg-gradient-end, #764ba2));
        border-radius: 10px;
        transition: width 0.6s ease-out;
      }

      .milestones-navigation {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
        margin: 20px 0;
      }

      .milestone-nav-btn {
        background: linear-gradient(135deg, var(--bg-gradient-start, #667eea), var(--bg-gradient-end, #764ba2));
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 1.2rem;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .milestone-nav-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }

      .milestone-nav-btn:active {
        transform: scale(0.95);
      }

      .milestone-dots {
        display: flex;
        gap: 8px;
      }

      .milestone-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--border-color, rgba(102, 126, 234, 0.3));
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 0;
      }

      .milestone-dot:hover {
        background: var(--bg-gradient-start, #667eea);
        transform: scale(1.2);
      }

      .milestone-dot.active {
        background: linear-gradient(135deg, var(--bg-gradient-start, #667eea), var(--bg-gradient-end, #764ba2));
        width: 24px;
        border-radius: 5px;
      }

      .milestones-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 15px;
        margin-top: 20px;
      }

      .stat-item {
        text-align: center;
        padding: 15px;
        background: var(--container-bg, white);
        border-radius: 10px;
        border: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
      }

      .stat-value {
        font-size: 2rem;
        font-weight: bold;
        color: var(--bg-gradient-start, #667eea);
        margin-bottom: 5px;
      }

      .stat-label {
        font-size: 0.85rem;
        color: var(--text-secondary, #666);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      @media (max-width: 768px) {
        .achievement-milestones-widget {
          padding: 20px;
        }

        .milestones-title {
          font-size: 1.5rem;
        }

        .milestone-title {
          font-size: 1.2rem;
        }

        .milestone-nav-btn {
          width: 35px;
          height: 35px;
          font-size: 1rem;
        }

        .milestones-stats {
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .stat-value {
          font-size: 1.5rem;
        }

        .stat-label {
          font-size: 0.75rem;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .achievement-milestones-widget,
        .milestone-display,
        .milestone-nav-btn,
        .milestone-dot,
        .progress-fill {
          animation: none;
          transition: none;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  cleanup() {
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
    }
  }
}

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.achievementMilestones = new AchievementMilestones();
      window.achievementMilestones.init();
    });
  } else {
    window.achievementMilestones = new AchievementMilestones();
    window.achievementMilestones.init();
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AchievementMilestones;
}
