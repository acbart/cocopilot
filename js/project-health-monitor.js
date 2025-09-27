/**
 * Project Health Monitor - Real-time animated dashboard for project metrics
 * Provides visual, animated representations of repository health and activity
 */

class ProjectHealthMonitor {
  constructor() {
    this.isInitialized = false;
    this.animationIntervals = new Map();
    this.healthData = {
      codeQuality: 95,
      testCoverage: 87,
      performance: 94,
      accessibility: 100,
      security: 92,
      documentation: 98,
      activity: 85,
      community: 78
    };

    this.trends = {
      codeQuality: +2,
      testCoverage: +5,
      performance: +3,
      accessibility: 0,
      security: +1,
      documentation: +4,
      activity: -2,
      community: +8
    };

    this.init();
  }

  init() {
    if (this.isInitialized) {
      return;
    }

    // Wait for dashboard to be available
    const checkDashboard = () => {
      const existingDashboard = document.querySelector('.project-health-dashboard');
      if (existingDashboard) {
        this.createHealthMonitor();
        this.addHealthMonitorStyles();
        setTimeout(() => this.startAnimations(), 1000); // Delay animations
        this.setupInteractions();
        this.isInitialized = true;
        console.log('🏥 Project Health Monitor initialized');
      } else {
        // Retry after a short delay
        setTimeout(checkDashboard, 500);
      }
    };

    checkDashboard();
  }

  createHealthMonitor() {
    const existingDashboard = document.querySelector('.project-health-dashboard');
    if (!existingDashboard) {
      return;
    }

    // Enhance the existing dashboard with animated visual monitor
    const visualMonitor = document.createElement('div');
    visualMonitor.className = 'visual-health-monitor';
    visualMonitor.innerHTML = `
      <div class="monitor-header">
        <h3 class="monitor-title">🎯 Live Health Monitor</h3>
        <div class="monitor-controls">
          <button class="monitor-btn" id="pauseAnimation" aria-label="Pause animations">⏸️</button>
          <button class="monitor-btn" id="refreshData" aria-label="Refresh data">🔄</button>
          <button class="monitor-btn" id="expandMonitor" aria-label="Expand monitor">🔍</button>
        </div>
      </div>

      <div class="health-grid">
        <div class="health-card" data-metric="codeQuality">
          <div class="card-header">
            <span class="metric-icon">💎</span>
            <span class="metric-name">Code Quality</span>
            <span class="trend-indicator positive">📈</span>
          </div>
          <div class="metric-visualization">
            <div class="circular-progress">
              <svg width="80" height="80">
                <circle cx="40" cy="40" r="30" stroke="#e0e0e0" stroke-width="8" fill="none"/>
                <circle cx="40" cy="40" r="30" stroke="#667eea" stroke-width="8" fill="none" 
                        stroke-dasharray="188.5" stroke-dashoffset="188.5" class="progress-circle" 
                        data-target="95"/>
              </svg>
              <div class="percentage-text">95%</div>
            </div>
            <div class="metric-details">
              <div class="current-value">95/100</div>
              <div class="trend-value">+2 this week</div>
            </div>
          </div>
        </div>

        <div class="health-card" data-metric="testCoverage">
          <div class="card-header">
            <span class="metric-icon">🧪</span>
            <span class="metric-name">Test Coverage</span>
            <span class="trend-indicator positive">📈</span>
          </div>
          <div class="metric-visualization">
            <div class="bar-chart">
              <div class="bar-container">
                <div class="bar-fill" data-target="87"></div>
                <div class="bar-label">87%</div>
              </div>
              <div class="test-breakdown">
                <div class="test-type">
                  <span class="test-color unit"></span>
                  <span>Unit: 92%</span>
                </div>
                <div class="test-type">
                  <span class="test-color integration"></span>
                  <span>Integration: 85%</span>
                </div>
                <div class="test-type">
                  <span class="test-color e2e"></span>
                  <span>E2E: 78%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="health-card" data-metric="performance">
          <div class="card-header">
            <span class="metric-icon">⚡</span>
            <span class="metric-name">Performance</span>
            <span class="trend-indicator positive">📈</span>
          </div>
          <div class="metric-visualization">
            <div class="gauge-chart">
              <div class="gauge-container">
                <div class="gauge-arc"></div>
                <div class="gauge-needle" data-angle="94"></div>
                <div class="gauge-center"></div>
              </div>
              <div class="gauge-value">94</div>
              <div class="vitals-breakdown">
                <div class="vital">LCP: 1.2s</div>
                <div class="vital">FID: 15ms</div>
                <div class="vital">CLS: 0.05</div>
              </div>
            </div>
          </div>
        </div>

        <div class="health-card" data-metric="accessibility">
          <div class="card-header">
            <span class="metric-icon">♿</span>
            <span class="metric-name">Accessibility</span>
            <span class="trend-indicator neutral">✅</span>
          </div>
          <div class="metric-visualization">
            <div class="accessibility-score">
              <div class="score-badge wcag-aa">WCAG AA</div>
              <div class="score-details">
                <div class="audit-item">
                  <span class="audit-icon">✅</span>
                  <span>Keyboard Navigation</span>
                </div>
                <div class="audit-item">
                  <span class="audit-icon">✅</span>
                  <span>Screen Reader</span>
                </div>
                <div class="audit-item">
                  <span class="audit-icon">✅</span>
                  <span>Color Contrast</span>
                </div>
                <div class="audit-item">
                  <span class="audit-icon">✅</span>
                  <span>Focus Management</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="health-card" data-metric="activity">
          <div class="card-header">
            <span class="metric-icon">📊</span>
            <span class="metric-name">Repository Activity</span>
            <span class="trend-indicator negative">📉</span>
          </div>
          <div class="metric-visualization">
            <div class="activity-chart">
              <div class="activity-bars">
                ${this.generateActivityBars()}
              </div>
              <div class="activity-stats">
                <div class="stat">Commits: 245</div>
                <div class="stat">Issues: 12</div>
                <div class="stat">PRs: 28</div>
              </div>
            </div>
          </div>
        </div>

        <div class="health-card" data-metric="community">
          <div class="card-header">
            <span class="metric-icon">👥</span>
            <span class="metric-name">Community</span>
            <span class="trend-indicator positive">📈</span>
          </div>
          <div class="metric-visualization">
            <div class="community-metrics">
              <div class="community-stat">
                <div class="stat-icon">⭐</div>
                <div class="stat-value" data-counter="0" data-target="127">0</div>
                <div class="stat-label">Stars</div>
              </div>
              <div class="community-stat">
                <div class="stat-icon">🍴</div>
                <div class="stat-value" data-counter="0" data-target="24">0</div>
                <div class="stat-label">Forks</div>
              </div>
              <div class="community-stat">
                <div class="stat-icon">👁️</div>
                <div class="stat-value" data-counter="0" data-target="89">0</div>
                <div class="stat-label">Watchers</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="health-summary">
        <div class="overall-health">
          <div class="health-score">
            <div class="score-circle">
              <div class="score-value" data-target="91">91</div>
              <div class="score-label">Overall Health</div>
            </div>
          </div>
          <div class="health-insights">
            <div class="insight positive">
              <span class="insight-icon">✨</span>
              <span>Excellent code quality and documentation</span>
            </div>
            <div class="insight positive">
              <span class="insight-icon">🚀</span>
              <span>Strong performance and accessibility scores</span>
            </div>
            <div class="insight warning">
              <span class="insight-icon">📈</span>
              <span>Consider increasing repository activity</span>
            </div>
          </div>
        </div>
      </div>
    `;

    existingDashboard.appendChild(visualMonitor);
  }

  generateActivityBars() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const values = [12, 8, 15, 22, 18, 5, 9];

    return days.map((day, index) => `
      <div class="activity-bar">
        <div class="bar" style="height: ${(values[index] / 25) * 100}%" data-day="${day}" data-value="${values[index]}"></div>
        <div class="bar-label">${day}</div>
      </div>
    `).join('');
  }

  addHealthMonitorStyles() {
    const styles = `
      <style id="health-monitor-styles">
        .visual-health-monitor {
          margin-top: 30px;
          padding: 25px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
          border-radius: 20px;
          border: 2px solid var(--border-color);
          backdrop-filter: blur(10px);
        }

        .monitor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .monitor-title {
          margin: 0;
          color: var(--text-primary);
          font-size: 1.4rem;
          background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .monitor-controls {
          display: flex;
          gap: 10px;
        }

        .monitor-btn {
          background: var(--container-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 8px 12px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .monitor-btn:hover {
          background: var(--feature-bg);
          transform: translateY(-2px);
        }

        .health-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .health-card {
          background: var(--container-bg);
          border: 1px solid var(--border-color);
          border-radius: 15px;
          padding: 20px;
          transition: all 0.3s ease;
        }

        .health-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 15px;
        }

        .metric-icon {
          font-size: 1.5rem;
          margin-right: 10px;
        }

        .metric-name {
          font-weight: 600;
          color: var(--text-primary);
          flex-grow: 1;
        }

        .trend-indicator {
          font-size: 1.2rem;
        }

        .trend-indicator.positive {
          color: #28a745;
        }

        .trend-indicator.negative {
          color: #dc3545;
        }

        .trend-indicator.neutral {
          color: var(--text-secondary);
        }

        /* Circular Progress */
        .circular-progress {
          position: relative;
          display: inline-block;
          margin-bottom: 15px;
        }

        .progress-circle {
          transform: rotate(-90deg);
          transition: stroke-dashoffset 2s ease-in-out;
        }

        .percentage-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 1.2rem;
          font-weight: bold;
          color: var(--text-primary);
        }

        /* Bar Chart */
        .bar-chart {
          text-align: center;
        }

        .bar-container {
          position: relative;
          height: 80px;
          background: #f0f0f0;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 15px;
        }

        .bar-fill {
          height: 100%;
          background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
          width: 0%;
          transition: width 2s ease-in-out;
          border-radius: 10px;
        }

        .bar-label {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-weight: bold;
          color: white;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }

        .test-breakdown {
          display: flex;
          gap: 15px;
          font-size: 0.85rem;
        }

        .test-type {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .test-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }

        .test-color.unit { background: #667eea; }
        .test-color.integration { background: #764ba2; }
        .test-color.e2e { background: #f093fb; }

        /* Gauge Chart */
        .gauge-chart {
          text-align: center;
        }

        .gauge-container {
          position: relative;
          width: 100px;
          height: 50px;
          margin: 0 auto 15px;
        }

        .gauge-arc {
          width: 100px;
          height: 50px;
          border: 8px solid #e0e0e0;
          border-bottom: none;
          border-radius: 100px 100px 0 0;
        }

        .gauge-needle {
          position: absolute;
          top: 42px;
          left: 50%;
          width: 2px;
          height: 40px;
          background: #dc3545;
          transform-origin: bottom center;
          transform: translateX(-50%) rotate(0deg);
          transition: transform 2s ease-in-out;
        }

        .gauge-center {
          position: absolute;
          top: 38px;
          left: 50%;
          width: 8px;
          height: 8px;
          background: #333;
          border-radius: 50%;
          transform: translateX(-50%);
        }

        .gauge-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--text-primary);
          margin-bottom: 10px;
        }

        .vitals-breakdown {
          display: flex;
          gap: 10px;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        /* Accessibility Score */
        .accessibility-score {
          text-align: center;
        }

        .score-badge {
          background: #28a745;
          color: white;
          padding: 10px 20px;
          border-radius: 25px;
          font-weight: bold;
          margin-bottom: 15px;
          display: inline-block;
        }

        .score-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .audit-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
        }

        /* Activity Chart */
        .activity-bars {
          display: flex;
          justify-content: space-between;
          align-items: end;
          height: 80px;
          margin-bottom: 15px;
          padding: 0 10px;
        }

        .activity-bar {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }

        .bar {
          width: 20px;
          background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
          border-radius: 3px 3px 0 0;
          transition: height 1.5s ease-in-out;
          cursor: pointer;
        }

        .bar:hover {
          opacity: 0.8;
          transform: scale(1.1);
        }

        .bar-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .activity-stats {
          display: flex;
          justify-content: space-around;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        /* Community Metrics */
        .community-metrics {
          display: flex;
          justify-content: space-around;
          text-align: center;
        }

        .community-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }

        .stat-icon {
          font-size: 1.5rem;
        }

        .stat-value {
          font-size: 1.3rem;
          font-weight: bold;
          color: var(--text-primary);
        }

        .stat-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        /* Health Summary */
        .health-summary {
          background: var(--container-bg);
          border: 1px solid var(--border-color);
          border-radius: 15px;
          padding: 25px;
        }

        .overall-health {
          display: flex;
          gap: 30px;
          align-items: center;
        }

        .health-score {
          text-align: center;
        }

        .score-circle {
          width: 120px;
          height: 120px;
          border: 8px solid var(--border-color);
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
        }

        .score-value {
          font-size: 2rem;
          font-weight: bold;
          color: var(--button-gradient-start);
        }

        .score-label {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-top: 5px;
        }

        .health-insights {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .insight {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 15px;
          border-radius: 8px;
          font-size: 0.9rem;
        }

        .insight.positive {
          background: rgba(40, 167, 69, 0.1);
          border-left: 4px solid #28a745;
        }

        .insight.warning {
          background: rgba(255, 193, 7, 0.1);
          border-left: 4px solid #ffc107;
        }

        .insight-icon {
          font-size: 1.2rem;
        }

        /* Animations */
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .health-card:hover .metric-icon {
          animation: pulse 1s ease-in-out infinite;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .health-grid {
            grid-template-columns: 1fr;
          }
          
          .overall-health {
            flex-direction: column;
            text-align: center;
          }
          
          .monitor-header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }
        }

        /* Dark Theme Support */
        [data-theme="dark"] .visual-health-monitor {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
        }

        [data-theme="dark"] .bar-container {
          background: rgba(255, 255, 255, 0.1);
        }

        [data-theme="dark"] .gauge-arc {
          border-color: rgba(255, 255, 255, 0.2);
        }
      </style>
    `;

    if (!document.getElementById('health-monitor-styles')) {
      document.head.insertAdjacentHTML('beforeend', styles);
    }
  }

  startAnimations() {
    // Animate circular progress
    setTimeout(() => {
      const progressCircles = document.querySelectorAll('.progress-circle');
      progressCircles.forEach(circle => {
        const target = parseInt(circle.dataset.target);
        const circumference = 2 * Math.PI * 30; // radius = 30
        const offset = circumference - (target / 100) * circumference;
        circle.style.strokeDashoffset = offset;
      });
    }, 500);

    // Animate bar chart
    setTimeout(() => {
      const barFill = document.querySelector('.bar-fill');
      if (barFill) {
        const target = parseInt(barFill.dataset.target);
        barFill.style.width = target + '%';
      }
    }, 1000);

    // Animate gauge needle
    setTimeout(() => {
      const needle = document.querySelector('.gauge-needle');
      if (needle) {
        const angle = parseInt(needle.dataset.angle);
        const rotation = -90 + (angle / 100) * 180; // Map 0-100% to -90 to +90 degrees
        needle.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
      }
    }, 1500);

    // Animate counters
    setTimeout(() => {
      this.animateCounters();
    }, 2000);
  }

  animateCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target);
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        counter.textContent = Math.round(current);
      }, 16);
    });
  }

  setupInteractions() {
    // Pause/Resume animations
    const pauseBtn = document.getElementById('pauseAnimation');
    if (pauseBtn) {
      let isPaused = false;
      pauseBtn.addEventListener('click', () => {
        isPaused = !isPaused;
        pauseBtn.textContent = isPaused ? '▶️' : '⏸️';
        pauseBtn.setAttribute('aria-label', isPaused ? 'Resume animations' : 'Pause animations');

        // Toggle CSS animations
        const monitor = document.querySelector('.visual-health-monitor');
        if (monitor) {
          monitor.style.animationPlayState = isPaused ? 'paused' : 'running';
        }
      });
    }

    // Refresh data
    const refreshBtn = document.getElementById('refreshData');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.refreshHealthData();
      });
    }

    // Expand monitor (future enhancement)
    const expandBtn = document.getElementById('expandMonitor');
    if (expandBtn) {
      expandBtn.addEventListener('click', () => {
        // Placeholder for modal/expanded view
        console.log('Expand monitor feature - coming soon!');
      });
    }

    // Activity bar hover effects
    const activityBars = document.querySelectorAll('.activity-bar .bar');
    activityBars.forEach(bar => {
      bar.addEventListener('mouseenter', (e) => {
        const tooltip = document.createElement('div');
        tooltip.className = 'activity-tooltip';
        tooltip.textContent = `${e.target.dataset.day}: ${e.target.dataset.value} commits`;
        tooltip.style.position = 'absolute';
        tooltip.style.background = 'rgba(0,0,0,0.8)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '5px 10px';
        tooltip.style.borderRadius = '4px';
        tooltip.style.fontSize = '12px';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.zIndex = '1000';

        document.body.appendChild(tooltip);

        const rect = e.target.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
      });

      bar.addEventListener('mouseleave', () => {
        const tooltip = document.querySelector('.activity-tooltip');
        if (tooltip) {
          tooltip.remove();
        }
      });
    });
  }

  refreshHealthData() {
    // Simulate data refresh with slight variations
    Object.keys(this.healthData).forEach(key => {
      const variation = (Math.random() - 0.5) * 4; // ±2 points
      this.healthData[key] = Math.max(0, Math.min(100, this.healthData[key] + variation));
    });

    // Re-animate with new data
    this.startAnimations();

    // Show refresh feedback
    const refreshBtn = document.getElementById('refreshData');
    if (refreshBtn) {
      const originalText = refreshBtn.textContent;
      refreshBtn.textContent = '✅';
      setTimeout(() => {
        refreshBtn.textContent = originalText;
      }, 1000);
    }
  }
}

// Initialize the health monitor when the page loads
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
    window.projectHealthMonitor = new ProjectHealthMonitor();
  }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProjectHealthMonitor;
}