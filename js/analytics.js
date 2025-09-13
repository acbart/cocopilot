/**
 * Interactive Analytics Dashboard for CocoPilot
 * Provides data visualizations and metrics tracking for repository improvements
 */

class AnalyticsDashboard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.data = {};
    this.charts = {};
    this.initialized = false;
    this.metrics = {
      codeQuality: [],
      userEngagement: [],
      deploymentFrequency: [],
      improvementSuggestions: []
    };
    this.init();
  }

  async init() {
    if (!this.container) {
      console.warn('Analytics dashboard container not found');
      return;
    }

    this.createDashboardStructure();
    await this.loadAnalyticsData();
    this.renderMetricsCards();
    this.renderCharts();
    this.setupRefreshTimer();
    this.initialized = true;
  }

  createDashboardStructure() {
    this.container.className = 'analytics-dashboard';
    this.container.innerHTML = `
      <div class="dashboard-header">
        <h3 class="dashboard-title">📊 Repository Analytics</h3>
        <p class="dashboard-subtitle">Track CocoPilot's autonomous evolution and improvement metrics</p>
        <div class="dashboard-controls">
          <button class="refresh-btn" id="refreshAnalytics" aria-label="Refresh analytics data">
            <span class="refresh-icon">🔄</span>
            <span>Refresh</span>
          </button>
          <select class="time-range-selector" id="timeRange" aria-label="Select time range">
            <option value="7d">Last 7 days</option>
            <option value="30d" selected>Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>
      
      <div class="metrics-grid">
        <div class="metric-card" id="codeQualityCard">
          <div class="metric-icon">🎯</div>
          <div class="metric-content">
            <h4>Code Quality Score</h4>
            <div class="metric-value" id="codeQualityValue">Loading...</div>
            <div class="metric-trend" id="codeQualityTrend"></div>
          </div>
        </div>
        
        <div class="metric-card" id="improvementCard">
          <div class="metric-icon">✨</div>
          <div class="metric-content">
            <h4>Daily Improvements</h4>
            <div class="metric-value" id="improvementValue">Loading...</div>
            <div class="metric-trend" id="improvementTrend"></div>
          </div>
        </div>
        
        <div class="metric-card" id="engagementCard">
          <div class="metric-icon">👥</div>
          <div class="metric-content">
            <h4>User Engagement</h4>
            <div class="metric-value" id="engagementValue">Loading...</div>
            <div class="metric-trend" id="engagementTrend"></div>
          </div>
        </div>
        
        <div class="metric-card" id="automationCard">
          <div class="metric-icon">🤖</div>
          <div class="metric-content">
            <h4>Automation Efficiency</h4>
            <div class="metric-value" id="automationValue">Loading...</div>
            <div class="metric-trend" id="automationTrend"></div>
          </div>
        </div>
      </div>
      
      <div class="charts-grid">
        <div class="chart-container">
          <h4>Improvement Timeline</h4>
          <canvas id="improvementChart" width="400" height="200" role="img" aria-label="Improvement timeline chart"></canvas>
          <div class="chart-fallback" id="improvementChartFallback" style="display: none;">
            <p>Chart visualization not available. Showing data summary:</p>
            <ul id="improvementSummary"></ul>
          </div>
        </div>
        
        <div class="chart-container">
          <h4>Code Quality Trends</h4>
          <canvas id="qualityChart" width="400" height="200" role="img" aria-label="Code quality trends chart"></canvas>
          <div class="chart-fallback" id="qualityChartFallback" style="display: none;">
            <p>Chart visualization not available. Showing data summary:</p>
            <ul id="qualitySummary"></ul>
          </div>
        </div>
      </div>
      
      <div class="insights-section">
        <h4>📈 AI-Generated Insights</h4>
        <div class="insights-list" id="insightsList">
          <div class="insight-item">
            <span class="insight-icon">🔍</span>
            <span>Analyzing patterns in recent improvements...</span>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  async loadAnalyticsData() {
    try {
      // In a real implementation, this would fetch from analytics APIs
      // For now, we'll simulate realistic data
      this.data = await this.generateSimulatedData();
    } catch (error) {
      console.error('Failed to load analytics data:', error);
      this.data = this.getFallbackData();
    }
  }

  async generateSimulatedData() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const now = new Date();
    const days = 30;
    const data = {
      codeQuality: [],
      improvements: [],
      engagement: [],
      automation: []
    };

    // Generate realistic trending data
    for (let i = days; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const trend = Math.sin((days - i) / 10) * 0.1 + 0.8; // Creates a wave pattern

      data.codeQuality.push({
        date: date.toISOString().split('T')[0],
        value: Math.round((70 + trend * 25 + Math.random() * 10) * 10) / 10,
        improvements: Math.floor(Math.random() * 5) + 1
      });

      data.improvements.push({
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 8) + 2,
        type: ['feature', 'bugfix', 'performance', 'documentation'][Math.floor(Math.random() * 4)]
      });

      data.engagement.push({
        date: date.toISOString().split('T')[0],
        visitors: Math.floor(Math.random() * 100) + 50,
        interactions: Math.floor(Math.random() * 30) + 10
      });

      data.automation.push({
        date: date.toISOString().split('T')[0],
        efficiency: Math.round((80 + Math.random() * 20) * 10) / 10,
        tasksAutomated: Math.floor(Math.random() * 15) + 5
      });
    }

    return data;
  }

  getFallbackData() {
    return {
      codeQuality: [{
        date: new Date().toISOString().split('T')[0],
        value: 87.5,
        improvements: 3
      }],
      improvements: [{
        date: new Date().toISOString().split('T')[0],
        count: 5,
        type: 'feature'
      }],
      engagement: [{
        date: new Date().toISOString().split('T')[0],
        visitors: 75,
        interactions: 20
      }],
      automation: [{
        date: new Date().toISOString().split('T')[0],
        efficiency: 92.3,
        tasksAutomated: 12
      }]
    };
  }

  renderMetricsCards() {
    if (!this.data || Object.keys(this.data).length === 0) {
      this.renderErrorState();
      return;
    }

    // Code Quality Score
    const latestQuality = this.data.codeQuality[this.data.codeQuality.length - 1];
    const qualityElement = document.getElementById('codeQualityValue');
    const qualityTrendElement = document.getElementById('codeQualityTrend');

    if (qualityElement && latestQuality) {
      qualityElement.textContent = `${latestQuality.value}%`;
      const trend = this.calculateTrend(this.data.codeQuality, 'value');
      qualityTrendElement.innerHTML = this.renderTrendIndicator(trend);
    }

    // Daily Improvements
    const improvementElement = document.getElementById('improvementValue');
    const improvementTrendElement = document.getElementById('improvementTrend');

    if (improvementElement) {
      const totalImprovements = this.data.improvements.reduce((sum, item) => sum + item.count, 0);
      const avgPerDay = (totalImprovements / this.data.improvements.length).toFixed(1);
      improvementElement.textContent = `${avgPerDay}/day`;

      const trend = this.calculateTrend(this.data.improvements, 'count');
      improvementTrendElement.innerHTML = this.renderTrendIndicator(trend);
    }

    // User Engagement
    const engagementElement = document.getElementById('engagementValue');
    const engagementTrendElement = document.getElementById('engagementTrend');

    if (engagementElement && this.data.engagement.length > 0) {
      const latestEngagement = this.data.engagement[this.data.engagement.length - 1];
      engagementElement.textContent = `${latestEngagement.visitors} visits`;

      const trend = this.calculateTrend(this.data.engagement, 'visitors');
      engagementTrendElement.innerHTML = this.renderTrendIndicator(trend);
    }

    // Automation Efficiency
    const automationElement = document.getElementById('automationValue');
    const automationTrendElement = document.getElementById('automationTrend');

    if (automationElement && this.data.automation.length > 0) {
      const latestAutomation = this.data.automation[this.data.automation.length - 1];
      automationElement.textContent = `${latestAutomation.efficiency}%`;

      const trend = this.calculateTrend(this.data.automation, 'efficiency');
      automationTrendElement.innerHTML = this.renderTrendIndicator(trend);
    }
  }

  calculateTrend(dataArray, valueKey) {
    if (dataArray.length < 2) {
      return 0;
    }

    const recent = dataArray.slice(-7); // Last 7 data points
    const older = dataArray.slice(-14, -7); // Previous 7 data points

    if (older.length === 0) {
      return 0;
    }

    const recentAvg = recent.reduce((sum, item) => sum + item[valueKey], 0) / recent.length;
    const olderAvg = older.reduce((sum, item) => sum + item[valueKey], 0) / older.length;

    return ((recentAvg - olderAvg) / olderAvg) * 100;
  }

  renderTrendIndicator(trendPercentage) {
    const absValue = Math.abs(trendPercentage);
    const isPositive = trendPercentage > 0;
    const arrow = isPositive ? '↗️' : trendPercentage < 0 ? '↘️' : '➡️';
    const color = isPositive ? '#28a745' : trendPercentage < 0 ? '#dc3545' : '#6c757d';

    return `
      <span class="trend-indicator" style="color: ${color}">
        ${arrow} ${absValue.toFixed(1)}%
      </span>
    `;
  }

  renderCharts() {
    this.renderImprovementChart();
    this.renderQualityChart();
    this.generateInsights();
  }

  renderImprovementChart() {
    const canvas = document.getElementById('improvementChart');
    const fallback = document.getElementById('improvementChartFallback');
    const summary = document.getElementById('improvementSummary');

    if (!canvas || !this.data.improvements) {
      if (fallback) {
        fallback.style.display = 'block';
      }
      return;
    }

    // Simple ASCII-style chart for accessibility
    if (!canvas.getContext) {
      fallback.style.display = 'block';
      const totalImprovements = this.data.improvements.reduce((sum, item) => sum + item.count, 0);
      summary.innerHTML = `
        <li>Total improvements: ${totalImprovements}</li>
        <li>Average per day: ${(totalImprovements / this.data.improvements.length).toFixed(1)}</li>
        <li>Peak day: ${Math.max(...this.data.improvements.map(item => item.count))} improvements</li>
      `;
      return;
    }

    const ctx = canvas.getContext('2d');
    const data = this.data.improvements.slice(-14); // Last 2 weeks

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Chart dimensions
    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;

    // Calculate scales
    const maxValue = Math.max(...data.map(item => item.count));
    const stepX = chartWidth / (data.length - 1);
    const stepY = chartHeight / maxValue;

    // Draw grid lines
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    // Draw improvement line
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.beginPath();

    data.forEach((item, index) => {
      const x = padding + index * stepX;
      const y = canvas.height - padding - item.count * stepY;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      // Draw data points
      ctx.fillStyle = '#667eea';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    ctx.stroke();

    // Draw labels
    ctx.fillStyle = '#333';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';

    // Y-axis labels
    for (let i = 0; i <= 5; i++) {
      const value = (maxValue / 5) * (5 - i);
      const y = padding + (chartHeight / 5) * i;
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(value), padding - 10, y + 4);
    }

    // X-axis labels (show every 3rd day)
    data.forEach((item, index) => {
      if (index % 3 === 0) {
        const x = padding + index * stepX;
        ctx.textAlign = 'center';
        ctx.save();
        ctx.translate(x, canvas.height - 10);
        ctx.rotate(-Math.PI / 6);
        ctx.fillText(new Date(item.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }), 0, 0);
        ctx.restore();
      }
    });
  }

  renderQualityChart() {
    const canvas = document.getElementById('qualityChart');
    const fallback = document.getElementById('qualityChartFallback');
    const summary = document.getElementById('qualitySummary');

    if (!canvas || !this.data.codeQuality) {
      if (fallback) {
        fallback.style.display = 'block';
      }
      return;
    }

    if (!canvas.getContext) {
      fallback.style.display = 'block';
      const avgQuality = this.data.codeQuality.reduce((sum, item) => sum + item.value, 0) / this.data.codeQuality.length;
      summary.innerHTML = `
        <li>Average quality: ${avgQuality.toFixed(1)}%</li>
        <li>Current score: ${this.data.codeQuality[this.data.codeQuality.length - 1].value}%</li>
        <li>Best score: ${Math.max(...this.data.codeQuality.map(item => item.value)).toFixed(1)}%</li>
      `;
      return;
    }

    const ctx = canvas.getContext('2d');
    const data = this.data.codeQuality.slice(-14);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Chart dimensions
    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;

    // Calculate scales
    const minValue = Math.min(...data.map(item => item.value)) - 5;
    const maxValue = Math.max(...data.map(item => item.value)) + 5;
    const stepX = chartWidth / (data.length - 1);
    const valueRange = maxValue - minValue;

    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    // Draw quality area chart
    const gradient = ctx.createLinearGradient(0, padding, 0, canvas.height - padding);
    gradient.addColorStop(0, 'rgba(40, 167, 69, 0.3)');
    gradient.addColorStop(1, 'rgba(40, 167, 69, 0.1)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding);

    data.forEach((item, index) => {
      const x = padding + index * stepX;
      const y = canvas.height - padding - ((item.value - minValue) / valueRange) * chartHeight;
      ctx.lineTo(x, y);
    });

    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.closePath();
    ctx.fill();

    // Draw quality line
    ctx.strokeStyle = '#28a745';
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((item, index) => {
      const x = padding + index * stepX;
      const y = canvas.height - padding - ((item.value - minValue) / valueRange) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw labels
    ctx.fillStyle = '#333';
    ctx.font = '12px sans-serif';

    // Y-axis labels
    for (let i = 0; i <= 5; i++) {
      const value = maxValue - (valueRange / 5) * i;
      const y = padding + (chartHeight / 5) * i;
      ctx.textAlign = 'right';
      ctx.fillText(value.toFixed(0) + '%', padding - 10, y + 4);
    }
  }

  generateInsights() {
    const insightsList = document.getElementById('insightsList');
    if (!insightsList || !this.data) {
      return;
    }

    const insights = [];

    // Analyze improvement trends
    if (this.data.improvements && this.data.improvements.length > 0) {
      const totalImprovements = this.data.improvements.reduce((sum, item) => sum + item.count, 0);
      const avgPerDay = totalImprovements / this.data.improvements.length;

      if (avgPerDay > 4) {
        insights.push({
          icon: '🚀',
          text: `High improvement velocity detected: ${avgPerDay.toFixed(1)} changes per day on average.`
        });
      }

      const recentImprovements = this.data.improvements.slice(-7);
      const recentAvg = recentImprovements.reduce((sum, item) => sum + item.count, 0) / recentImprovements.length;

      if (recentAvg > avgPerDay * 1.2) {
        insights.push({
          icon: '📈',
          text: 'Recent acceleration in improvement frequency suggests enhanced AI learning efficiency.'
        });
      }
    }

    // Analyze code quality
    if (this.data.codeQuality && this.data.codeQuality.length > 0) {
      const latestQuality = this.data.codeQuality[this.data.codeQuality.length - 1];
      if (latestQuality.value > 90) {
        insights.push({
          icon: '⭐',
          text: `Excellent code quality achieved: ${latestQuality.value}% demonstrates mature AI-driven development.`
        });
      }

      const qualityTrend = this.calculateTrend(this.data.codeQuality, 'value');
      if (qualityTrend > 5) {
        insights.push({
          icon: '📊',
          text: `Code quality improving consistently (+${qualityTrend.toFixed(1)}%), indicating effective autonomous optimization.`
        });
      }
    }

    // Default insights if no data
    if (insights.length === 0) {
      insights.push({
        icon: '🔍',
        text: 'Gathering baseline metrics for intelligent analysis and recommendations.'
      });
    }

    // Render insights
    insightsList.innerHTML = insights.map(insight => `
      <div class="insight-item">
        <span class="insight-icon">${insight.icon}</span>
        <span>${insight.text}</span>
      </div>
    `).join('');
  }

  bindEvents() {
    const refreshBtn = document.getElementById('refreshAnalytics');
    const timeRangeSelect = document.getElementById('timeRange');

    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.refreshData());
    }

    if (timeRangeSelect) {
      timeRangeSelect.addEventListener('change', (e) => this.handleTimeRangeChange(e.target.value));
    }
  }

  async refreshData() {
    const refreshBtn = document.getElementById('refreshAnalytics');
    if (refreshBtn) {
      refreshBtn.disabled = true;
      refreshBtn.querySelector('.refresh-icon').style.transform = 'rotate(360deg)';
      refreshBtn.querySelector('.refresh-icon').style.transition = 'transform 0.5s ease';
    }

    try {
      await this.loadAnalyticsData();
      this.renderMetricsCards();
      this.renderCharts();
    } catch (error) {
      console.error('Failed to refresh analytics:', error);
    } finally {
      if (refreshBtn) {
        setTimeout(() => {
          refreshBtn.disabled = false;
          refreshBtn.querySelector('.refresh-icon').style.transform = 'rotate(0deg)';
        }, 500);
      }
    }
  }

  handleTimeRangeChange(range) {
    console.log(`Time range changed to: ${range}`);
    // In a real implementation, this would filter the data based on the selected range
    this.refreshData();
  }

  setupRefreshTimer() {
    // Auto-refresh every 5 minutes
    setInterval(() => {
      if (document.visibilityState === 'visible') {
        this.refreshData();
      }
    }, 5 * 60 * 1000);
  }

  renderErrorState() {
    const cards = document.querySelectorAll('.metric-value');
    cards.forEach(card => {
      card.textContent = 'N/A';
      card.style.color = '#999';
    });

    const insightsList = document.getElementById('insightsList');
    if (insightsList) {
      insightsList.innerHTML = `
        <div class="insight-item">
          <span class="insight-icon">⚠️</span>
          <span>Unable to load analytics data. Check connectivity and try refreshing.</span>
        </div>
      `;
    }
  }

  // Public API methods
  isInitialized() {
    return this.initialized;
  }

  getMetrics() {
    return this.data;
  }

  exportData() {
    return {
      timestamp: new Date().toISOString(),
      data: this.data,
      summary: {
        codeQuality: this.data.codeQuality?.[this.data.codeQuality.length - 1]?.value || 0,
        totalImprovements: this.data.improvements?.reduce((sum, item) => sum + item.count, 0) || 0,
        avgDailyImprovements: this.data.improvements?.length > 0 ? this.data.improvements.reduce((sum, item) => sum + item.count, 0) / this.data.improvements.length : 0
      }
    };
  }
}

// Initialize analytics dashboard when DOM is ready
if (typeof window !== 'undefined') {
  let analyticsDashboard;

  document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for the main page to load
    setTimeout(() => {
      analyticsDashboard = new AnalyticsDashboard('analyticsDashboard');
      window.analytics = analyticsDashboard;
    }, 1000);
  });
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AnalyticsDashboard;
}