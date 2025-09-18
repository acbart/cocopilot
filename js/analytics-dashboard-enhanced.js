/**
 * Enhanced Analytics Dashboard for CocoPilot
 * Provides comprehensive insights into repository evolution and AI improvements
 */

class EnhancedAnalyticsDashboard {
  constructor() {
    this.apiBase = 'https://api.github.com/repos/acbart/cocopilot';
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
    this.initDashboard();
  }

  async initDashboard() {
    try {
      await this.createDashboardStyles();
      await this.fetchRepositoryData();
      await this.renderDashboard();
      this.attachEventListeners();
    } catch (error) {
      console.error('Analytics dashboard initialization failed:', error);
      this.renderErrorState();
    }
  }

  async fetchRepositoryData() {
    const endpoints = [
      '/commits?per_page=100',
      '/pulls?state=all&per_page=100',
      '/issues?state=all&per_page=100',
      '/stats/contributors',
      '/stats/commit_activity',
      '/stats/code_frequency',
      '/stats/participation'
    ];

    const data = {};
    
    for (const endpoint of endpoints) {
      try {
        const cached = this.getCachedData(endpoint);
        if (cached) {
          data[endpoint] = cached;
          continue;
        }

        const response = await fetch(`${this.apiBase}${endpoint}`);
        if (response.ok) {
          const result = await response.json();
          data[endpoint] = result;
          this.setCachedData(endpoint, result);
        }
      } catch (error) {
        console.warn(`Failed to fetch ${endpoint}:`, error);
        data[endpoint] = [];
      }
    }

    this.repositoryData = data;
    return data;
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

  async renderDashboard() {
    const dashboardHTML = `
      <div class="analytics-dashboard" id="analyticsDashboard">
        <div class="dashboard-header">
          <h2>📊 Repository Analytics</h2>
          <div class="dashboard-controls">
            <button class="refresh-btn" id="refreshDashboard" aria-label="Refresh analytics data">
              🔄 Refresh
            </button>
            <button class="toggle-dashboard" id="toggleDashboard" aria-label="Toggle dashboard visibility">
              📈 Analytics
            </button>
          </div>
        </div>
        
        <div class="dashboard-content" id="dashboardContent">
          ${await this.renderMetricsGrid()}
          ${await this.renderCommitChart()}
          ${await this.renderContributorInsights()}
          ${await this.renderAIImprovementTimeline()}
          ${await this.renderRepositoryHealth()}
        </div>
      </div>
    `;

    // Insert dashboard into page
    const existingDashboard = document.getElementById('analyticsDashboard');
    if (existingDashboard) {
      existingDashboard.outerHTML = dashboardHTML;
    } else {
      const container = document.querySelector('.about-section') || document.querySelector('main');
      container.insertAdjacentHTML('afterend', dashboardHTML);
    }
  }

  async renderMetricsGrid() {
    const commits = this.repositoryData['/commits?per_page=100'] || [];
    const pulls = this.repositoryData['/pulls?state=all&per_page=100'] || [];
    const issues = this.repositoryData['/issues?state=all&per_page=100'] || [];

    const aiCommits = commits.filter(commit => 
      commit.commit.message.toLowerCase().includes('copilot') ||
      commit.commit.message.toLowerCase().includes('ai') ||
      commit.author?.login === 'github-actions[bot]'
    );

    return `
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-icon">🚀</div>
          <div class="metric-value">${commits.length}</div>
          <div class="metric-label">Total Commits</div>
        </div>
        
        <div class="metric-card highlight">
          <div class="metric-icon">🤖</div>
          <div class="metric-value">${aiCommits.length}</div>
          <div class="metric-label">AI-Driven Changes</div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon">🔄</div>
          <div class="metric-value">${pulls.length}</div>
          <div class="metric-label">Pull Requests</div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon">📋</div>
          <div class="metric-value">${issues.filter(i => i.state === 'open').length}</div>
          <div class="metric-label">Open Issues</div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon">✅</div>
          <div class="metric-value">${issues.filter(i => i.state === 'closed').length}</div>
          <div class="metric-label">Resolved Issues</div>
        </div>
        
        <div class="metric-card">
          <div class="metric-icon">📈</div>
          <div class="metric-value">${this.calculateImprovementRate()}%</div>
          <div class="metric-label">Improvement Rate</div>
        </div>
      </div>
    `;
  }

  calculateImprovementRate() {
    const commits = this.repositoryData['/commits?per_page=100'] || [];
    if (commits.length === 0) return 0;

    const recentCommits = commits.slice(0, 20);
    const aiCommits = recentCommits.filter(commit => 
      commit.commit.message.toLowerCase().includes('copilot') ||
      commit.commit.message.toLowerCase().includes('ai') ||
      commit.author?.login === 'github-actions[bot]'
    );

    return Math.round((aiCommits.length / recentCommits.length) * 100);
  }

  async renderCommitChart() {
    const commits = this.repositoryData['/commits?per_page=100'] || [];
    const commitsByDate = this.groupCommitsByDate(commits);
    
    return `
      <div class="chart-section">
        <h3>📈 Commit Activity Timeline</h3>
        <div class="commit-chart" id="commitChart">
          ${this.renderCommitActivityChart(commitsByDate)}
        </div>
        <div class="chart-legend">
          <span class="legend-item">
            <span class="legend-color ai-commits"></span>
            AI-Driven Commits
          </span>
          <span class="legend-item">
            <span class="legend-color manual-commits"></span>
            Manual Commits
          </span>
        </div>
      </div>
    `;
  }

  groupCommitsByDate(commits) {
    const groups = {};
    
    commits.forEach(commit => {
      const date = new Date(commit.commit.author.date).toDateString();
      if (!groups[date]) {
        groups[date] = { ai: 0, manual: 0 };
      }
      
      const isAI = commit.commit.message.toLowerCase().includes('copilot') ||
                   commit.commit.message.toLowerCase().includes('ai') ||
                   commit.author?.login === 'github-actions[bot]';
      
      if (isAI) {
        groups[date].ai++;
      } else {
        groups[date].manual++;
      }
    });
    
    return groups;
  }

  renderCommitActivityChart(commitsByDate) {
    const dates = Object.keys(commitsByDate).slice(-14); // Last 14 days
    const maxCommits = Math.max(...dates.map(date => 
      commitsByDate[date].ai + commitsByDate[date].manual
    ));

    return dates.map(date => {
      const data = commitsByDate[date];
      const total = data.ai + data.manual;
      const aiHeight = maxCommits > 0 ? (data.ai / maxCommits) * 100 : 0;
      const manualHeight = maxCommits > 0 ? (data.manual / maxCommits) * 100 : 0;

      return `
        <div class="chart-bar" title="${date}: ${total} commits">
          <div class="bar-section ai-commits" style="height: ${aiHeight}%"></div>
          <div class="bar-section manual-commits" style="height: ${manualHeight}%"></div>
          <div class="bar-label">${new Date(date).getDate()}</div>
        </div>
      `;
    }).join('');
  }

  async renderContributorInsights() {
    const contributors = this.repositoryData['/stats/contributors'] || [];
    
    return `
      <div class="contributor-section">
        <h3>👥 Contributor Insights</h3>
        <div class="contributor-list">
          ${contributors.slice(0, 5).map(contributor => `
            <div class="contributor-card">
              <img src="${contributor.author.avatar_url}" alt="${contributor.author.login}" class="contributor-avatar">
              <div class="contributor-info">
                <div class="contributor-name">${contributor.author.login}</div>
                <div class="contributor-stats">${contributor.total} commits</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  async renderAIImprovementTimeline() {
    const commits = this.repositoryData['/commits?per_page=100'] || [];
    const aiCommits = commits.filter(commit => 
      commit.commit.message.toLowerCase().includes('copilot') ||
      commit.commit.message.toLowerCase().includes('ai') ||
      commit.author?.login === 'github-actions[bot]'
    ).slice(0, 10);

    return `
      <div class="ai-timeline-section">
        <h3>🤖 Recent AI Improvements</h3>
        <div class="ai-timeline">
          ${aiCommits.map(commit => `
            <div class="timeline-item">
              <div class="timeline-date">${new Date(commit.commit.author.date).toLocaleDateString()}</div>
              <div class="timeline-content">
                <div class="timeline-message">${commit.commit.message}</div>
                <div class="timeline-author">by ${commit.author?.login || 'AI Assistant'}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  async renderRepositoryHealth() {
    const issues = this.repositoryData['/issues?state=all&per_page=100'] || [];
    const openIssues = issues.filter(i => i.state === 'open').length;
    const closedIssues = issues.filter(i => i.state === 'closed').length;
    const totalIssues = issues.length;
    
    const healthScore = totalIssues > 0 ? Math.round((closedIssues / totalIssues) * 100) : 100;
    
    return `
      <div class="health-section">
        <h3>🏥 Repository Health</h3>
        <div class="health-metrics">
          <div class="health-score">
            <div class="score-circle">
              <div class="score-value">${healthScore}</div>
              <div class="score-label">Health Score</div>
            </div>
          </div>
          <div class="health-details">
            <div class="health-item">
              <span class="health-icon">📋</span>
              <span class="health-text">${openIssues} open issues</span>
            </div>
            <div class="health-item">
              <span class="health-icon">✅</span>
              <span class="health-text">${closedIssues} resolved issues</span>
            </div>
            <div class="health-item">
              <span class="health-icon">🔄</span>
              <span class="health-text">Active development</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const refreshBtn = document.getElementById('refreshDashboard');
    const toggleBtn = document.getElementById('toggleDashboard');
    const dashboardContent = document.getElementById('dashboardContent');

    if (refreshBtn) {
      refreshBtn.addEventListener('click', async () => {
        refreshBtn.textContent = '🔄 Refreshing...';
        refreshBtn.disabled = true;
        
        this.cache.clear();
        await this.fetchRepositoryData();
        await this.renderDashboard();
        
        refreshBtn.textContent = '🔄 Refresh';
        refreshBtn.disabled = false;
      });
    }

    if (toggleBtn && dashboardContent) {
      toggleBtn.addEventListener('click', () => {
        const isVisible = dashboardContent.style.display !== 'none';
        dashboardContent.style.display = isVisible ? 'none' : 'block';
        toggleBtn.textContent = isVisible ? '📈 Show Analytics' : '📊 Hide Analytics';
      });
    }
  }

  renderErrorState() {
    const errorHTML = `
      <div class="analytics-dashboard error-state">
        <div class="error-message">
          <h3>📊 Analytics Dashboard</h3>
          <p>Unable to load analytics data. Please check your connection and try again.</p>
          <button onclick="location.reload()" class="retry-btn">🔄 Retry</button>
        </div>
      </div>
    `;

    const container = document.querySelector('.about-section') || document.querySelector('main');
    container.insertAdjacentHTML('afterend', errorHTML);
  }

  async createDashboardStyles() {
    const styles = `
      <style id="analytics-dashboard-styles">
        .analytics-dashboard {
          margin: 40px 0;
          padding: 30px;
          background: var(--container-bg);
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid var(--border-color);
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.1);
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid var(--border-color);
        }

        .dashboard-header h2 {
          margin: 0;
          color: var(--text-primary);
          font-size: 1.8rem;
        }

        .dashboard-controls {
          display: flex;
          gap: 10px;
        }

        .refresh-btn, .toggle-dashboard {
          background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .refresh-btn:hover, .toggle-dashboard:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .refresh-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .metric-card {
          background: var(--feature-bg);
          padding: 25px;
          border-radius: 16px;
          text-align: center;
          transition: all 0.3s ease;
          border: 1px solid var(--border-color);
        }

        .metric-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
        }

        .metric-card.highlight {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
          border-color: var(--button-gradient-start);
        }

        .metric-icon {
          font-size: 2.5rem;
          margin-bottom: 12px;
        }

        .metric-value {
          font-size: 2.2rem;
          font-weight: bold;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .metric-label {
          color: var(--text-secondary);
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .chart-section {
          margin: 40px 0;
        }

        .chart-section h3 {
          margin-bottom: 20px;
          color: var(--text-primary);
          font-size: 1.4rem;
        }

        .commit-chart {
          display: flex;
          align-items: end;
          height: 200px;
          gap: 4px;
          padding: 20px;
          background: var(--feature-bg);
          border-radius: 12px;
          overflow-x: auto;
        }

        .chart-bar {
          flex: 1;
          min-width: 30px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: end;
          position: relative;
          cursor: pointer;
        }

        .bar-section {
          width: 100%;
          border-radius: 4px 4px 0 0;
          transition: all 0.3s ease;
        }

        .bar-section.ai-commits {
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .bar-section.manual-commits {
          background: linear-gradient(135deg, #f093fb, #f5576c);
        }

        .bar-label {
          position: absolute;
          bottom: -25px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .chart-legend {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin-top: 20px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .legend-color {
          width: 16px;
          height: 16px;
          border-radius: 4px;
        }

        .legend-color.ai-commits {
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .legend-color.manual-commits {
          background: linear-gradient(135deg, #f093fb, #f5576c);
        }

        .contributor-section, .ai-timeline-section, .health-section {
          margin: 40px 0;
        }

        .contributor-section h3, .ai-timeline-section h3, .health-section h3 {
          margin-bottom: 20px;
          color: var(--text-primary);
          font-size: 1.4rem;
        }

        .contributor-list {
          display: flex;
          gap: 15px;
          overflow-x: auto;
          padding: 10px 0;
        }

        .contributor-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px;
          background: var(--feature-bg);
          border-radius: 12px;
          min-width: 200px;
          border: 1px solid var(--border-color);
        }

        .contributor-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid var(--border-color);
        }

        .contributor-name {
          font-weight: bold;
          color: var(--text-primary);
        }

        .contributor-stats {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .ai-timeline {
          max-height: 400px;
          overflow-y: auto;
        }

        .timeline-item {
          display: flex;
          gap: 20px;
          padding: 15px 0;
          border-bottom: 1px solid var(--border-color);
        }

        .timeline-item:last-child {
          border-bottom: none;
        }

        .timeline-date {
          min-width: 100px;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .timeline-content {
          flex: 1;
        }

        .timeline-message {
          color: var(--text-primary);
          margin-bottom: 5px;
        }

        .timeline-author {
          font-size: 0.8rem;
          color: var(--text-tertiary);
        }

        .health-metrics {
          display: flex;
          align-items: center;
          gap: 40px;
        }

        .health-score {
          text-align: center;
        }

        .score-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .score-value {
          font-size: 2rem;
          font-weight: bold;
        }

        .score-label {
          font-size: 0.8rem;
          opacity: 0.9;
        }

        .health-details {
          flex: 1;
        }

        .health-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          color: var(--text-primary);
        }

        .health-icon {
          font-size: 1.2rem;
        }

        .error-state {
          text-align: center;
          padding: 60px 30px;
        }

        .error-message h3 {
          color: var(--text-primary);
          margin-bottom: 15px;
        }

        .error-message p {
          color: var(--text-secondary);
          margin-bottom: 25px;
        }

        .retry-btn {
          background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .analytics-dashboard {
            margin: 20px 0;
            padding: 20px;
          }

          .dashboard-header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }

          .metrics-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
          }

          .health-metrics {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }

          .contributor-list {
            flex-direction: column;
          }

          .contributor-card {
            min-width: auto;
          }
        }

        [data-theme="dark"] .analytics-dashboard {
          background: rgba(42, 42, 42, 0.95);
        }

        [data-theme="dark"] .metric-card,
        [data-theme="dark"] .commit-chart,
        [data-theme="dark"] .contributor-card {
          background: rgba(255, 255, 255, 0.05);
        }
      </style>
    `;

    if (!document.getElementById('analytics-dashboard-styles')) {
      document.head.insertAdjacentHTML('beforeend', styles);
    }
  }
}

// Initialize the enhanced analytics dashboard
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new EnhancedAnalyticsDashboard();
  });
} else {
  new EnhancedAnalyticsDashboard();
}

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnhancedAnalyticsDashboard;
}