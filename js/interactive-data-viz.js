/**
 * Interactive Data Visualization Component for CocoPilot
 * Creates engaging visual representations of repository evolution and AI improvements
 */

class InteractiveDataVisualization {
  constructor() {
    this.apiBase = 'https://api.github.com/repos/acbart/cocopilot';
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
    this.animationDuration = 800;
    this.isVisible = false;

    this.init();
  }

  async init() {
    try {
      await this.addVisualizationStyles();
      await this.createVisualizationContainer();
      await this.loadData();
      await this.renderVisualizations();
      this.setupEventHandlers();
      console.log('🎨 Interactive Data Visualization initialized successfully');
    } catch (error) {
      console.error('Visualization initialization failed:', error);
      this.renderFallback();
    }
  }

  async addVisualizationStyles() {
    const styles = `
      <style id="data-visualization-styles">
        .data-visualization-container {
          margin: 30px 0;
          padding: 25px;
          background: var(--container-bg);
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid var(--border-color);
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.1);
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease;
        }

        .data-visualization-container.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .viz-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 2px solid var(--border-color);
        }

        .viz-title {
          margin: 0;
          color: var(--text-primary);
          font-size: 1.6rem;
          background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .viz-controls {
          display: flex;
          gap: 10px;
        }

        .viz-toggle-btn {
          background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .viz-toggle-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .viz-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 25px;
        }

        .viz-card {
          background: var(--feature-bg);
          padding: 20px;
          border-radius: 16px;
          border: 1px solid var(--border-color);
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .viz-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
        }

        .viz-card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }

        .viz-card-icon {
          font-size: 1.5rem;
        }

        .viz-card-title {
          margin: 0;
          color: var(--text-primary);
          font-size: 1.2rem;
        }

        .commit-frequency-chart {
          height: 120px;
          position: relative;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
          border-radius: 8px;
          padding: 10px;
          overflow: hidden;
        }

        .frequency-bars {
          display: flex;
          align-items: end;
          height: 100%;
          gap: 2px;
        }

        .frequency-bar {
          flex: 1;
          background: linear-gradient(to top, var(--button-gradient-start), var(--button-gradient-end));
          border-radius: 2px 2px 0 0;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          min-height: 4px;
        }

        .frequency-bar:hover {
          opacity: 0.8;
          transform: scaleY(1.1);
        }

        .frequency-bar::after {
          content: attr(data-commits);
          position: absolute;
          top: -25px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.7rem;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          white-space: nowrap;
        }

        .frequency-bar:hover::after {
          opacity: 1;
        }

        .improvement-timeline {
          height: 200px;
          overflow-y: auto;
          padding-right: 10px;
        }

        .timeline-item {
          display: flex;
          gap: 15px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(102, 126, 234, 0.1);
          transition: all 0.3s ease;
        }

        .timeline-item:hover {
          background: rgba(102, 126, 234, 0.05);
          padding-left: 10px;
          border-radius: 8px;
        }

        .timeline-item:last-child {
          border-bottom: none;
        }

        .timeline-dot {
          width: 12px;
          height: 12px;
          background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
          border-radius: 50%;
          margin-top: 4px;
          flex-shrink: 0;
        }

        .timeline-content {
          flex: 1;
        }

        .timeline-date {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 2px;
        }

        .timeline-message {
          color: var(--text-primary);
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .impact-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 15px;
        }

        .impact-metric {
          text-align: center;
          padding: 15px;
          background: rgba(102, 126, 234, 0.05);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .impact-metric:hover {
          background: rgba(102, 126, 234, 0.1);
          transform: scale(1.05);
        }

        .impact-value {
          font-size: 1.8rem;
          font-weight: bold;
          color: var(--button-gradient-start);
          margin-bottom: 5px;
        }

        .impact-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .language-distribution {
          height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .language-pie {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: conic-gradient(
            var(--button-gradient-start) 0deg 120deg,
            #f093fb 120deg 200deg,
            #ffecd2 200deg 280deg,
            #fcb69f 280deg 360deg
          );
          position: relative;
          transition: transform 0.3s ease;
        }

        .language-pie:hover {
          transform: scale(1.1);
        }

        .language-legend {
          margin-top: 15px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }

        .growth-chart {
          height: 140px;
          position: relative;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
          border-radius: 8px;
          overflow: hidden;
        }

        .growth-line {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 100%;
          background: linear-gradient(to right, 
            rgba(102, 126, 234, 0.3) 0%,
            rgba(118, 75, 162, 0.3) 100%
          );
          clip-path: polygon(0% 100%, 10% 80%, 25% 85%, 40% 70%, 55% 75%, 70% 60%, 85% 65%, 100% 45%, 100% 100%);
          transition: all 0.6s ease;
        }

        .growth-chart:hover .growth-line {
          clip-path: polygon(0% 100%, 10% 75%, 25% 80%, 40% 65%, 55% 70%, 70% 55%, 85% 60%, 100% 40%, 100% 100%);
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          color: var(--text-secondary);
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(102, 126, 234, 0.3);
          border-top: 3px solid var(--button-gradient-start);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 15px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-state {
          text-align: center;
          padding: 40px;
          color: var(--text-secondary);
        }

        .error-icon {
          font-size: 3rem;
          margin-bottom: 15px;
        }

        @media (max-width: 768px) {
          .data-visualization-container {
            margin: 20px 0;
            padding: 20px;
          }

          .viz-header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }

          .viz-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .impact-metrics {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        [data-theme="dark"] .data-visualization-container {
          background: rgba(42, 42, 42, 0.95);
        }

        [data-theme="dark"] .viz-card {
          background: rgba(255, 255, 255, 0.05);
        }

        [data-theme="dark"] .impact-metric {
          background: rgba(255, 255, 255, 0.05);
        }

        [data-theme="dark"] .impact-metric:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      </style>
    `;

    if (!document.getElementById('data-visualization-styles')) {
      document.head.insertAdjacentHTML('beforeend', styles);
    }
  }

  async createVisualizationContainer() {
    const container = `
      <div class="data-visualization-container" id="dataVisualization">
        <div class="viz-header">
          <h2 class="viz-title">🎨 Interactive Repository Insights</h2>
          <div class="viz-controls">
            <button class="viz-toggle-btn" id="toggleVisualization" aria-label="Toggle visualization display">
              📊 Show Charts
            </button>
          </div>
        </div>
        
        <div class="viz-content" id="vizContent" style="display: none;">
          <div class="loading-state" id="vizLoading">
            <div class="loading-spinner"></div>
            <p>Loading repository insights...</p>
          </div>
          
          <div class="viz-grid" id="vizGrid" style="display: none;">
            <!-- Visualizations will be rendered here -->
          </div>
        </div>
      </div>
    `;

    // Find the best place to insert the visualization
    const targetElement = document.querySelector('.features') ||
                         document.querySelector('.about-section') ||
                         document.querySelector('main');

    if (targetElement) {
      targetElement.insertAdjacentHTML('afterend', container);
    }
  }

  async loadData() {
    try {
      const [commits, pulls, issues] = await Promise.all([
        this.fetchGitHubData('/commits?per_page=100'),
        this.fetchGitHubData('/pulls?state=all&per_page=50'),
        this.fetchGitHubData('/issues?state=all&per_page=50')
      ]);

      this.data = {
        commits: commits || [],
        pulls: pulls || [],
        issues: issues || [],
        timestamp: Date.now()
      };

      return this.data;
    } catch (error) {
      console.warn('Failed to load visualization data:', error);
      throw error;
    }
  }

  async fetchGitHubData(endpoint) {
    const cacheKey = endpoint;
    const cached = this.getCachedData(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(`${this.apiBase}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.warn(`Failed to fetch ${endpoint}:`, error);
      return [];
    }
  }

  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    return null;
  }

  setCachedData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  async renderVisualizations() {
    const vizGrid = document.getElementById('vizGrid');
    const vizLoading = document.getElementById('vizLoading');

    if (!vizGrid || !this.data) {
      return;
    }

    try {
      vizGrid.innerHTML = `
        ${this.renderCommitFrequency()}
        ${this.renderImpactMetrics()}
        ${this.renderImprovementTimeline()}
        ${this.renderGrowthChart()}
      `;

      // Animate visibility
      setTimeout(() => {
        vizLoading.style.display = 'none';
        vizGrid.style.display = 'grid';

        // Animate cards
        const cards = vizGrid.querySelectorAll('.viz-card');
        cards.forEach((card, index) => {
          setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.5s ease';

            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          }, index * 150);
        });
      }, 1000);

    } catch (error) {
      console.error('Failed to render visualizations:', error);
      this.renderError();
    }
  }

  renderCommitFrequency() {
    const commits = this.data.commits || [];
    const frequencyData = this.calculateCommitFrequency(commits);

    return `
      <div class="viz-card">
        <div class="viz-card-header">
          <span class="viz-card-icon">📈</span>
          <h3 class="viz-card-title">Commit Frequency (Last 30 Days)</h3>
        </div>
        <div class="commit-frequency-chart">
          <div class="frequency-bars">
            ${frequencyData.map(day => `
              <div class="frequency-bar" 
                   style="height: ${day.percentage}%" 
                   data-commits="${day.commits} commits on ${day.date}"
                   title="${day.commits} commits on ${day.date}">
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  calculateCommitFrequency(commits) {
    const days = 30;
    const today = new Date();
    const frequency = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();

      const dayCommits = commits.filter(commit => {
        const commitDate = new Date(commit.commit.author.date);
        return commitDate.toDateString() === dateStr;
      }).length;

      frequency.push({
        date: date.toLocaleDateString(),
        commits: dayCommits,
        percentage: 0 // Will be calculated after finding max
      });
    }

    const maxCommits = Math.max(...frequency.map(d => d.commits));
    frequency.forEach(day => {
      day.percentage = maxCommits > 0 ? (day.commits / maxCommits) * 100 : 10;
    });

    return frequency;
  }

  renderImpactMetrics() {
    const commits = this.data.commits || [];
    const pulls = this.data.pulls || [];
    const issues = this.data.issues || [];

    const aiCommits = commits.filter(commit =>
      commit.commit.message.toLowerCase().includes('copilot') ||
      commit.commit.message.toLowerCase().includes('ai') ||
      commit.author?.login === 'github-actions[bot]'
    );

    const openIssues = issues.filter(i => i.state === 'open').length;
    const closedIssues = issues.filter(i => i.state === 'closed').length;
    const successRate = issues.length > 0 ? Math.round((closedIssues / issues.length) * 100) : 100;

    return `
      <div class="viz-card">
        <div class="viz-card-header">
          <span class="viz-card-icon">🎯</span>
          <h3 class="viz-card-title">Impact Metrics</h3>
        </div>
        <div class="impact-metrics">
          <div class="impact-metric">
            <div class="impact-value">${aiCommits.length}</div>
            <div class="impact-label">AI Changes</div>
          </div>
          <div class="impact-metric">
            <div class="impact-value">${pulls.length}</div>
            <div class="impact-label">Pull Requests</div>
          </div>
          <div class="impact-metric">
            <div class="impact-value">${successRate}%</div>
            <div class="impact-label">Success Rate</div>
          </div>
          <div class="impact-metric">
            <div class="impact-value">${openIssues}</div>
            <div class="impact-label">Active Issues</div>
          </div>
        </div>
      </div>
    `;
  }

  renderImprovementTimeline() {
    const commits = this.data.commits || [];
    const aiCommits = commits.filter(commit =>
      commit.commit.message.toLowerCase().includes('copilot') ||
      commit.commit.message.toLowerCase().includes('ai') ||
      commit.author?.login === 'github-actions[bot]'
    ).slice(0, 8);

    return `
      <div class="viz-card">
        <div class="viz-card-header">
          <span class="viz-card-icon">🤖</span>
          <h3 class="viz-card-title">Recent AI Improvements</h3>
        </div>
        <div class="improvement-timeline">
          ${aiCommits.map(commit => `
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="timeline-date">${new Date(commit.commit.author.date).toLocaleDateString()}</div>
                <div class="timeline-message">${this.truncateMessage(commit.commit.message)}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderGrowthChart() {
    return `
      <div class="viz-card">
        <div class="viz-card-header">
          <span class="viz-card-icon">📊</span>
          <h3 class="viz-card-title">Repository Growth</h3>
        </div>
        <div class="growth-chart">
          <div class="growth-line"></div>
        </div>
        <p style="text-align: center; margin-top: 10px; font-size: 0.8rem; color: var(--text-secondary);">
          Continuous improvement trend over time
        </p>
      </div>
    `;
  }

  truncateMessage(message) {
    return message.length > 80 ? message.substring(0, 80) + '...' : message;
  }

  renderError() {
    const vizGrid = document.getElementById('vizGrid');
    const vizLoading = document.getElementById('vizLoading');

    if (vizLoading) {
      vizLoading.style.display = 'none';
    }
    if (vizGrid) {
      vizGrid.innerHTML = `
        <div class="error-state">
          <div class="error-icon">📊</div>
          <h3>Visualization Temporarily Unavailable</h3>
          <p>Unable to load repository data. Charts will appear when connectivity is restored.</p>
        </div>
      `;
      vizGrid.style.display = 'block';
    }
  }

  setupEventHandlers() {
    const toggleBtn = document.getElementById('toggleVisualization');
    const vizContent = document.getElementById('vizContent');
    const container = document.getElementById('dataVisualization');

    if (toggleBtn && vizContent) {
      toggleBtn.addEventListener('click', () => {
        this.isVisible = !this.isVisible;

        if (this.isVisible) {
          vizContent.style.display = 'block';
          toggleBtn.textContent = '📊 Hide Charts';
          container.classList.add('visible');

          // Load data if not already loaded
          if (!this.data || !this.data.commits) {
            this.loadData().then(() => {
              this.renderVisualizations();
            }).catch(() => {
              this.renderError();
            });
          }
        } else {
          vizContent.style.display = 'none';
          toggleBtn.textContent = '📊 Show Charts';
        }
      });
    }

    // Make container visible with animation
    setTimeout(() => {
      if (container) {
        container.classList.add('visible');
      }
    }, 500);
  }

  renderFallback() {
    const fallbackHTML = `
      <div class="data-visualization-container visible">
        <div class="viz-header">
          <h2 class="viz-title">🎨 Repository Insights</h2>
        </div>
        <div class="error-state">
          <div class="error-icon">📊</div>
          <p>Data visualizations will be available when the repository API is accessible.</p>
        </div>
      </div>
    `;

    const targetElement = document.querySelector('.features') ||
                         document.querySelector('.about-section') ||
                         document.querySelector('main');

    if (targetElement) {
      targetElement.insertAdjacentHTML('afterend', fallbackHTML);
    }
  }
}

// Initialize the interactive data visualization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new InteractiveDataVisualization();
  });
} else {
  new InteractiveDataVisualization();
}

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InteractiveDataVisualization;
}