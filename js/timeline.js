/**
 * Repository Evolution Timeline
 * An interactive visualization showing the project's development history
 */

class EvolutionTimeline {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.data = [];
    this.currentIndex = 0;
    this.init();
  }

  init() {
    this.loadTimelineData();
    this.createTimeline();
    this.bindEvents();
  }

  loadTimelineData() {
    // Simulate timeline data - in a real implementation, this would come from GitHub API
    this.data = [
      {
        date: '2025-09-13',
        version: '1.0.0',
        title: 'Initial Release',
        description: 'Basic repository structure with self-updating workflow',
        features: ['GitHub Actions workflow', 'Basic HTML homepage', 'Auto-issue creation'],
        impact: 'foundation'
      },
      {
        date: '2025-09-13',
        version: '1.1.0',
        title: 'Enhanced UI & PWA Features',
        description: 'Added progressive web app capabilities and improved user interface',
        features: ['Service Worker', 'Web App Manifest', 'Theme Toggle', 'Responsive Design'],
        impact: 'enhancement'
      },
      {
        date: '2025-09-13',
        version: '1.2.0',
        title: 'Performance & Analytics',
        description: 'Integrated performance monitoring and GitHub API statistics',
        features: ['Core Web Vitals tracking', 'GitHub API integration', 'Performance optimization'],
        impact: 'optimization'
      },
      {
        date: '2025-09-13',
        version: '2.0.0',
        title: 'Testing Infrastructure',
        description: 'Added comprehensive testing framework and CI/CD pipeline',
        features: ['Unit Testing with Jest', 'E2E Testing with Playwright', 'CI/CD Pipeline', 'Code Coverage'],
        impact: 'infrastructure'
      }
    ];
  }

  createTimeline() {
    this.container.innerHTML = `
      <div class="timeline-header">
        <h3>🚀 Evolution Timeline</h3>
        <p>Explore how CocoPilot has evolved through AI-driven improvements</p>
      </div>
      <div class="timeline-container">
        <div class="timeline-track" id="timelineTrack">
          ${this.data.map((item, index) => `
            <div class="timeline-item ${index === 0 ? 'active' : ''}" data-index="${index}">
              <div class="timeline-dot ${this.getImpactClass(item.impact)}"></div>
              <div class="timeline-content">
                <div class="timeline-date">${this.formatDate(item.date)}</div>
                <div class="timeline-version">${item.version}</div>
                <div class="timeline-title">${item.title}</div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="timeline-details" id="timelineDetails">
          ${this.renderDetails(this.data[0])}
        </div>
      </div>
      <div class="timeline-controls">
        <button id="prevBtn" class="timeline-btn" disabled>← Previous</button>
        <div class="timeline-progress">
          <div class="progress-bar" id="progressBar" style="width: 25%"></div>
        </div>
        <button id="nextBtn" class="timeline-btn">Next →</button>
      </div>
    `;

    this.addTimelineStyles();
  }

  renderDetails(item) {
    return `
      <div class="detail-card">
        <div class="detail-header">
          <span class="detail-version">${item.version}</span>
          <span class="detail-impact ${this.getImpactClass(item.impact)}">${item.impact}</span>
        </div>
        <h4 class="detail-title">${item.title}</h4>
        <p class="detail-description">${item.description}</p>
        <div class="detail-features">
          <h5>Key Features:</h5>
          <ul>
            ${item.features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const timelineItems = document.querySelectorAll('.timeline-item');

    prevBtn.addEventListener('click', () => this.navigateTimeline(-1));
    nextBtn.addEventListener('click', () => this.navigateTimeline(1));

    timelineItems.forEach((item, index) => {
      item.addEventListener('click', () => this.goToIndex(index));
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.target.closest('.timeline-container')) {
        if (e.key === 'ArrowLeft') this.navigateTimeline(-1);
        if (e.key === 'ArrowRight') this.navigateTimeline(1);
      }
    });
  }

  navigateTimeline(direction) {
    const newIndex = this.currentIndex + direction;
    if (newIndex >= 0 && newIndex < this.data.length) {
      this.goToIndex(newIndex);
    }
  }

  goToIndex(index) {
    this.currentIndex = index;
    
    // Update active states
    document.querySelectorAll('.timeline-item').forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });

    // Update details
    document.getElementById('timelineDetails').innerHTML = this.renderDetails(this.data[index]);

    // Update controls
    document.getElementById('prevBtn').disabled = index === 0;
    document.getElementById('nextBtn').disabled = index === this.data.length - 1;

    // Update progress bar
    const progress = ((index + 1) / this.data.length) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;

    // Animate transition
    this.animateTransition();
  }

  animateTransition() {
    const details = document.getElementById('timelineDetails');
    details.style.opacity = '0';
    details.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
      details.style.opacity = '1';
      details.style.transform = 'translateY(0)';
    }, 150);
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }

  getImpactClass(impact) {
    const classes = {
      foundation: 'impact-foundation',
      enhancement: 'impact-enhancement',
      optimization: 'impact-optimization',
      infrastructure: 'impact-infrastructure'
    };
    return classes[impact] || 'impact-default';
  }

  addTimelineStyles() {
    if (document.getElementById('timeline-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'timeline-styles';
    styles.textContent = `
      .timeline-header {
        text-align: center;
        margin-bottom: 2rem;
      }

      .timeline-header h3 {
        margin: 0 0 0.5rem 0;
        color: var(--text-primary);
        font-size: 1.5rem;
      }

      .timeline-header p {
        margin: 0;
        color: var(--text-secondary);
        font-size: 0.9rem;
      }

      .timeline-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-bottom: 2rem;
      }

      .timeline-track {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .timeline-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        opacity: 0.7;
      }

      .timeline-item:hover, .timeline-item.active {
        opacity: 1;
        background: var(--feature-bg);
        transform: translateX(5px);
      }

      .timeline-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--text-tertiary);
        transition: all 0.3s ease;
        position: relative;
      }

      .timeline-item.active .timeline-dot {
        transform: scale(1.5);
      }

      .timeline-dot.impact-foundation { background: #667eea; }
      .timeline-dot.impact-enhancement { background: #764ba2; }
      .timeline-dot.impact-optimization { background: #f093fb; }
      .timeline-dot.impact-infrastructure { background: #4facfe; }

      .timeline-content {
        flex: 1;
      }

      .timeline-date {
        font-size: 0.8rem;
        color: var(--text-tertiary);
        margin-bottom: 0.25rem;
      }

      .timeline-version {
        font-size: 0.9rem;
        color: var(--button-gradient-start);
        font-weight: bold;
        margin-bottom: 0.25rem;
      }

      .timeline-title {
        font-weight: 600;
        color: var(--text-primary);
      }

      .timeline-details {
        background: var(--feature-bg);
        border-radius: 12px;
        padding: 1.5rem;
        border: 1px solid var(--border-color);
        transition: all 0.3s ease;
      }

      .detail-card {
        height: 100%;
      }

      .detail-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }

      .detail-version {
        font-weight: bold;
        color: var(--button-gradient-start);
        font-size: 1.1rem;
      }

      .detail-impact {
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: bold;
        text-transform: uppercase;
        color: white;
      }

      .detail-impact.impact-foundation { background: #667eea; }
      .detail-impact.impact-enhancement { background: #764ba2; }
      .detail-impact.impact-optimization { background: #f093fb; }
      .detail-impact.impact-infrastructure { background: #4facfe; }

      .detail-title {
        margin: 0 0 1rem 0;
        color: var(--text-primary);
        font-size: 1.2rem;
      }

      .detail-description {
        color: var(--text-secondary);
        margin-bottom: 1.5rem;
        line-height: 1.6;
      }

      .detail-features h5 {
        margin: 0 0 0.75rem 0;
        color: var(--text-primary);
        font-size: 1rem;
      }

      .detail-features ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .detail-features li {
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border-color);
        color: var(--text-secondary);
      }

      .detail-features li:last-child {
        border-bottom: none;
      }

      .detail-features li::before {
        content: '✨';
        margin-right: 0.5rem;
      }

      .timeline-controls {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;
      }

      .timeline-btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 8px;
        background: var(--button-gradient-start);
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 600;
      }

      .timeline-btn:hover:not(:disabled) {
        background: var(--button-gradient-end);
        transform: translateY(-2px);
      }

      .timeline-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }

      .timeline-progress {
        flex: 1;
        max-width: 200px;
        height: 8px;
        background: var(--border-color);
        border-radius: 4px;
        overflow: hidden;
      }

      .progress-bar {
        height: 100%;
        background: linear-gradient(45deg, var(--button-gradient-start), var(--button-gradient-end));
        transition: width 0.3s ease;
        border-radius: 4px;
      }

      @media (max-width: 768px) {
        .timeline-container {
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .timeline-controls {
          flex-direction: column;
          gap: 1rem;
        }

        .timeline-progress {
          max-width: 100%;
        }
      }
    `;
    document.head.appendChild(styles);
  }
}

// Initialize timeline when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Only initialize if the timeline container exists
  if (document.getElementById('evolutionTimeline')) {
    new EvolutionTimeline('evolutionTimeline');
  }
});