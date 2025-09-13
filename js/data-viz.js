/**
 * Data Visualization Module for CocoPilot
 * Creates interactive charts and graphs to showcase repository evolution
 */

class DataVisualization {
  constructor() {
    this.initializeVisualization();
  }

  initializeVisualization() {
    // Create repository growth chart
    this.createGrowthChart();

    // Create feature evolution timeline
    this.createFeatureTimeline();

    // Create technology distribution chart
    this.createTechChart();
  }

  createGrowthChart() {
    const chartContainer = document.createElement('div');
    chartContainer.className = 'data-viz-container growth-chart';
    chartContainer.innerHTML = `
      <div class="chart-header">
        <h3 data-i18n="viz.growth.title">📈 Repository Growth</h3>
        <p data-i18n="viz.growth.subtitle">Track the evolution of features and improvements over time</p>
      </div>
      <div class="chart-content">
        <svg class="growth-svg" width="100%" height="200" viewBox="0 0 400 200">
          <!-- Background grid -->
          <defs>
            <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 20" fill="none" stroke="rgba(102, 126, 234, 0.1)" stroke-width="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          <!-- Growth line -->
          <polyline id="growth-line" 
                    points="20,180 60,160 100,140 140,110 180,80 220,60 260,40 300,20 340,10 380,5"
                    fill="none" 
                    stroke="url(#gradient)" 
                    stroke-width="3" 
                    stroke-linecap="round"/>
          
          <!-- Gradient definition -->
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
            </linearGradient>
          </defs>
          
          <!-- Data points -->
          <circle cx="20" cy="180" r="4" fill="#667eea" class="data-point" data-value="1">
            <title>v1.0.0 - Initial Release</title>
          </circle>
          <circle cx="100" cy="140" r="4" fill="#667eea" class="data-point" data-value="15">
            <title>v1.1.0 - Enhanced UI & PWA Features</title>
          </circle>
          <circle cx="180" cy="80" r="4" fill="#667eea" class="data-point" data-value="35">
            <title>v1.2.0 - Performance & Analytics</title>
          </circle>
          <circle cx="300" cy="20" r="4" fill="#764ba2" class="data-point" data-value="68">
            <title>v2.0.0 - Testing Infrastructure</title>
          </circle>
          <circle cx="380" cy="5" r="4" fill="#764ba2" class="data-point" data-value="85">
            <title>v2.1.0 - Current Version</title>
          </circle>
        </svg>
        
        <div class="chart-legend">
          <div class="legend-item">
            <span class="legend-color" style="background: #667eea;"></span>
            <span data-i18n="viz.legend.features">Features Added</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background: #764ba2;"></span>
            <span data-i18n="viz.legend.maturity">Platform Maturity</span>
          </div>
        </div>
      </div>
    `;

    this.insertVisualization(chartContainer, 'after-features');
  }

  createFeatureTimeline() {
    const timelineContainer = document.createElement('div');
    timelineContainer.className = 'data-viz-container feature-timeline';
    timelineContainer.innerHTML = `
      <div class="chart-header">
        <h3 data-i18n="viz.timeline.title">🚀 Feature Implementation Timeline</h3>
        <p data-i18n="viz.timeline.subtitle">Major milestones in CocoPilot's AI-driven development</p>
      </div>
      <div class="timeline-viz">
        <div class="timeline-track">
          <div class="timeline-milestone" style="left: 10%;" data-tooltip="PWA Support">
            <div class="milestone-dot foundation"></div>
            <div class="milestone-label">PWA</div>
          </div>
          <div class="timeline-milestone" style="left: 25%;" data-tooltip="Theme System">
            <div class="milestone-dot ui"></div>
            <div class="milestone-label">Themes</div>
          </div>
          <div class="timeline-milestone" style="left: 40%;" data-tooltip="Internationalization">
            <div class="milestone-dot feature"></div>
            <div class="milestone-label">i18n</div>
          </div>
          <div class="timeline-milestone" style="left: 55%;" data-tooltip="Testing Framework">
            <div class="milestone-dot testing"></div>
            <div class="milestone-label">Tests</div>
          </div>
          <div class="timeline-milestone" style="left: 70%;" data-tooltip="Performance Monitoring">
            <div class="milestone-dot performance"></div>
            <div class="milestone-label">Analytics</div>
          </div>
          <div class="timeline-milestone" style="left: 85%;" data-tooltip="Data Visualization">
            <div class="milestone-dot current"></div>
            <div class="milestone-label">Data Viz</div>
          </div>
        </div>
      </div>
    `;

    this.insertVisualization(timelineContainer, 'after-about');
  }

  createTechChart() {
    const techContainer = document.createElement('div');
    techContainer.className = 'data-viz-container tech-chart';
    techContainer.innerHTML = `
      <div class="chart-header">
        <h3 data-i18n="viz.tech.title">⚙️ Technology Stack</h3>
        <p data-i18n="viz.tech.subtitle">Modern web technologies powering CocoPilot</p>
      </div>
      <div class="tech-grid">
        <div class="tech-item" style="--progress: 95%;">
          <div class="tech-icon">🌐</div>
          <div class="tech-name">HTML5</div>
          <div class="tech-bar">
            <div class="tech-progress"></div>
          </div>
          <div class="tech-percent">95%</div>
        </div>
        <div class="tech-item" style="--progress: 90%;">
          <div class="tech-icon">🎨</div>
          <div class="tech-name">CSS3</div>
          <div class="tech-bar">
            <div class="tech-progress"></div>
          </div>
          <div class="tech-percent">90%</div>
        </div>
        <div class="tech-item" style="--progress: 85%;">
          <div class="tech-icon">⚡</div>
          <div class="tech-name">JavaScript</div>
          <div class="tech-bar">
            <div class="tech-progress"></div>
          </div>
          <div class="tech-percent">85%</div>
        </div>
        <div class="tech-item" style="--progress: 75%;">
          <div class="tech-icon">🤖</div>
          <div class="tech-name">AI/ML</div>
          <div class="tech-bar">
            <div class="tech-progress"></div>
          </div>
          <div class="tech-percent">75%</div>
        </div>
      </div>
    `;

    this.insertVisualization(techContainer, 'after-timeline');
  }

  insertVisualization(container, position) {
    // Find appropriate insertion point
    let insertionPoint;

    switch (position) {
    case 'after-features':
      insertionPoint = document.querySelector('.features');
      break;
    case 'after-about':
      insertionPoint = document.querySelector('.about-section');
      break;
    case 'after-timeline':
      insertionPoint = document.querySelector('.evolution-section');
      break;
    default:
      insertionPoint = document.querySelector('main');
    }

    if (insertionPoint) {
      insertionPoint.parentNode.insertBefore(container, insertionPoint.nextSibling);

      // Add animation
      setTimeout(() => {
        container.classList.add('animated');
      }, 100);
    }
  }

  // Add CSS styles for visualizations
  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .data-viz-container {
        background: var(--feature-bg);
        border-radius: 20px;
        padding: 30px;
        margin: 30px 0;
        border: 2px solid var(--border-color);
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
      }

      .data-viz-container.animated {
        opacity: 1;
        transform: translateY(0);
      }

      .chart-header h3 {
        margin: 0 0 10px 0;
        color: var(--text-primary);
        font-size: 1.4rem;
      }

      .chart-header p {
        margin: 0 0 20px 0;
        color: var(--text-secondary);
        font-size: 0.95rem;
      }

      /* Growth Chart Styles */
      .growth-svg {
        max-width: 100%;
        height: auto;
      }

      .data-point {
        cursor: pointer;
        transition: r 0.3s ease;
      }

      .data-point:hover {
        r: 6;
      }

      .chart-legend {
        display: flex;
        gap: 20px;
        margin-top: 15px;
        flex-wrap: wrap;
      }

      .legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.9rem;
        color: var(--text-secondary);
      }

      .legend-color {
        width: 12px;
        height: 12px;
        border-radius: 2px;
      }

      /* Timeline Visualization */
      .timeline-viz {
        position: relative;
        padding: 20px 0;
      }

      .timeline-track {
        position: relative;
        height: 60px;
        background: linear-gradient(90deg, var(--button-gradient-start), var(--button-gradient-end));
        border-radius: 30px;
        padding: 5px;
      }

      .timeline-track::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 5px;
        right: 5px;
        height: 2px;
        background: rgba(255, 255, 255, 0.3);
        transform: translateY(-50%);
      }

      .timeline-milestone {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        cursor: pointer;
      }

      .milestone-dot {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        margin: 0 auto 8px;
        border: 3px solid white;
        transition: transform 0.3s ease;
      }

      .milestone-dot.foundation { background: #667eea; }
      .milestone-dot.ui { background: #764ba2; }
      .milestone-dot.feature { background: #11998e; }
      .milestone-dot.testing { background: #38a169; }
      .milestone-dot.performance { background: #ed8936; }
      .milestone-dot.current { 
        background: #e53e3e; 
        box-shadow: 0 0 15px rgba(229, 62, 62, 0.5);
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }

      .milestone-label {
        font-size: 0.8rem;
        color: white;
        font-weight: 500;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      }

      .timeline-milestone:hover .milestone-dot {
        transform: scale(1.2);
      }

      /* Technology Chart */
      .tech-grid {
        display: grid;
        gap: 20px;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      }

      .tech-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 15px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        border: 1px solid var(--border-color);
      }

      .tech-icon {
        font-size: 1.5rem;
        flex-shrink: 0;
      }

      .tech-name {
        font-weight: 500;
        color: var(--text-primary);
        min-width: 80px;
      }

      .tech-bar {
        flex: 1;
        height: 6px;
        background: rgba(102, 126, 234, 0.2);
        border-radius: 3px;
        overflow: hidden;
      }

      .tech-progress {
        height: 100%;
        background: linear-gradient(90deg, var(--button-gradient-start), var(--button-gradient-end));
        border-radius: 3px;
        width: var(--progress);
        transition: width 1s ease;
        animation: progressLoad 1.5s ease;
      }

      @keyframes progressLoad {
        from { width: 0; }
        to { width: var(--progress); }
      }

      .tech-percent {
        font-size: 0.9rem;
        color: var(--text-secondary);
        min-width: 35px;
        text-align: right;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .data-viz-container {
          padding: 20px;
          margin: 20px 0;
        }
        
        .chart-legend {
          justify-content: center;
        }
        
        .timeline-track {
          height: 50px;
        }
        
        .milestone-label {
          font-size: 0.7rem;
        }
      }
    `;

    document.head.appendChild(style);
  }
}

// Initialize data visualization when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const dataViz = new DataVisualization();
  dataViz.injectStyles();
});

// Update visualizations when language changes
window.addEventListener('languageChanged', () => {
  // Re-translate any dynamic content if needed
  console.log('Data visualizations updated for new language');
});