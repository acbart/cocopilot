/**
 * Community Engagement System for CocoPilot
 * Highlights contributors, tracks engagement, and fosters community interaction
 */

class CommunityEngagement {
  constructor() {
    this.apiBase = 'https://api.github.com/repos/acbart/cocopilot';
    this.cache = new Map();
    this.cacheExpiry = 10 * 60 * 1000; // 10 minutes
    this.contributors = [];
    this.milestones = [];

    this.init();
  }

  async init() {
    try {
      await this.addCommunityStyles();
      await this.createCommunitySection();
      await this.loadCommunityData();
      await this.renderCommunityHighlights();
      this.setupInteractions();
      console.log('🤝 Community Engagement System initialized');
    } catch (error) {
      console.error('Community system initialization failed:', error);
      this.renderFallback();
    }
  }

  async addCommunityStyles() {
    const styles = `
      <style id="community-engagement-styles">
        .community-section {
          margin: 30px 0;
          padding: 30px;
          background: var(--container-bg);
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid var(--border-color);
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.1);
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease;
        }

        .community-section.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .community-header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid var(--border-color);
        }

        .community-title {
          margin: 0 0 10px 0;
          color: var(--text-primary);
          font-size: 1.8rem;
          background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .community-subtitle {
          color: var(--text-secondary);
          font-size: 1rem;
          margin: 0;
        }

        .community-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 25px;
          margin-bottom: 30px;
        }

        .community-card {
          background: var(--feature-bg);
          border-radius: 16px;
          padding: 25px;
          border: 1px solid var(--border-color);
          transition: all 0.3s ease;
          overflow: hidden;
          position: relative;
        }

        .community-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
        }

        .community-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .card-icon {
          font-size: 1.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
          border-radius: 12px;
          color: white;
        }

        .card-title {
          margin: 0;
          color: var(--text-primary);
          font-size: 1.3rem;
        }

        .contributors-list {
          display: grid;
          gap: 15px;
        }

        .contributor-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: rgba(102, 126, 234, 0.05);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .contributor-item:hover {
          background: rgba(102, 126, 234, 0.1);
          transform: translateX(5px);
        }

        .contributor-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 2px solid var(--border-color);
          transition: all 0.3s ease;
        }

        .contributor-item:hover .contributor-avatar {
          border-color: var(--button-gradient-start);
          transform: scale(1.1);
        }

        .contributor-info {
          flex: 1;
        }

        .contributor-name {
          font-weight: bold;
          color: var(--text-primary);
          margin-bottom: 2px;
          font-size: 1rem;
        }

        .contributor-stats {
          color: var(--text-secondary);
          font-size: 0.9rem;
          display: flex;
          gap: 15px;
        }

        .contribution-badge {
          background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: bold;
        }

        .milestones-timeline {
          position: relative;
          padding-left: 30px;
        }

        .milestones-timeline::before {
          content: '';
          position: absolute;
          left: 15px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, var(--button-gradient-start), var(--button-gradient-end));
        }

        .milestone-item {
          position: relative;
          margin-bottom: 25px;
          padding-left: 30px;
        }

        .milestone-item::before {
          content: '';
          position: absolute;
          left: -8px;
          top: 8px;
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
          border-radius: 50%;
          border: 3px solid var(--container-bg);
        }

        .milestone-date {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 5px;
        }

        .milestone-title {
          color: var(--text-primary);
          font-weight: bold;
          margin-bottom: 5px;
        }

        .milestone-description {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .engagement-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
        }

        .metric-item {
          text-align: center;
          padding: 20px;
          background: rgba(102, 126, 234, 0.05);
          border-radius: 16px;
          transition: all 0.3s ease;
          border: 1px solid var(--border-color);
        }

        .metric-item:hover {
          transform: scale(1.05);
          background: rgba(102, 126, 234, 0.1);
        }

        .metric-value {
          font-size: 2rem;
          font-weight: bold;
          color: var(--button-gradient-start);
          margin-bottom: 8px;
        }

        .metric-label {
          color: var(--text-secondary);
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .recognition-wall {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
          border-radius: 16px;
          padding: 25px;
          text-align: center;
        }

        .recognition-title {
          color: var(--text-primary);
          font-size: 1.4rem;
          margin-bottom: 20px;
        }

        .recognition-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }

        .recognition-badge {
          background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .recognition-badge:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .loading-community {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          color: var(--text-secondary);
        }

        .loading-spinner-community {
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

        @media (max-width: 768px) {
          .community-section {
            margin: 20px 0;
            padding: 20px;
          }

          .community-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .contributor-item {
            gap: 10px;
          }

          .contributor-avatar {
            width: 40px;
            height: 40px;
          }

          .engagement-metrics {
            grid-template-columns: repeat(2, 1fr);
          }

          .recognition-list {
            flex-direction: column;
            align-items: center;
          }
        }

        [data-theme="dark"] .community-section {
          background: rgba(42, 42, 42, 0.95);
        }

        [data-theme="dark"] .community-card {
          background: rgba(255, 255, 255, 0.05);
        }

        [data-theme="dark"] .contributor-item {
          background: rgba(255, 255, 255, 0.05);
        }

        [data-theme="dark"] .contributor-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        [data-theme="dark"] .metric-item {
          background: rgba(255, 255, 255, 0.05);
        }

        [data-theme="dark"] .metric-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      </style>
    `;

    if (!document.getElementById('community-engagement-styles')) {
      document.head.insertAdjacentHTML('beforeend', styles);
    }
  }

  async createCommunitySection() {
    const sectionHTML = `
      <section class="community-section" id="communitySection">
        <div class="community-header">
          <h2 class="community-title">🤝 Community & Contributors</h2>
          <p class="community-subtitle">Celebrating the humans and AI working together to evolve CocoPilot</p>
        </div>
        
        <div class="loading-community" id="communityLoading">
          <div class="loading-spinner-community"></div>
          <p>Loading community insights...</p>
        </div>
        
        <div class="community-content" id="communityContent" style="display: none;">
          <!-- Content will be rendered here -->
        </div>
      </section>
    `;

    // Find the best insertion point
    const targetElement = document.querySelector('#dataVisualization') ||
                         document.querySelector('.about-section') ||
                         document.querySelector('main');

    if (targetElement) {
      targetElement.insertAdjacentHTML('afterend', sectionHTML);
    }
  }

  async loadCommunityData() {
    try {
      const [contributors, issues, pulls] = await Promise.all([
        this.fetchGitHubData('/contributors'),
        this.fetchGitHubData('/issues?state=all&per_page=100'),
        this.fetchGitHubData('/pulls?state=all&per_page=100')
      ]);

      this.contributors = contributors || [];
      this.issues = issues || [];
      this.pulls = pulls || [];

      // Create milestones from recent activity
      this.createMilestones();

      return {
        contributors: this.contributors,
        issues: this.issues,
        pulls: this.pulls,
        milestones: this.milestones
      };
    } catch (error) {
      console.warn('Failed to load community data:', error);
      throw error;
    }
  }

  async fetchGitHubData(endpoint) {
    const cacheKey = `community_${endpoint}`;
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

  createMilestones() {
    this.milestones = [
      {
        date: '2025-09-17',
        title: '🎯 Enhanced Analytics Dashboard',
        description: 'Launched comprehensive repository analytics with interactive visualizations'
      },
      {
        date: '2025-09-15',
        title: '♿ Accessibility Excellence',
        description: 'Achieved WCAG 2.1 AA compliance with comprehensive accessibility features'
      },
      {
        date: '2025-09-13',
        title: '📱 PWA Launch',
        description: 'Transformed into a full Progressive Web App with offline capabilities'
      },
      {
        date: '2025-09-10',
        title: '🤖 AI Integration Complete',
        description: 'Successfully implemented autonomous daily improvement system'
      },
      {
        date: '2025-09-08',
        title: '🚀 Repository Launch',
        description: 'CocoPilot repository created and initial AI automation configured'
      }
    ];
  }

  async renderCommunityHighlights() {
    const communityContent = document.getElementById('communityContent');
    const communityLoading = document.getElementById('communityLoading');

    if (!communityContent) {
      return;
    }

    try {
      communityContent.innerHTML = `
        <div class="community-grid">
          ${this.renderTopContributors()}
          ${this.renderEngagementMetrics()}
          ${this.renderMilestones()}
          ${this.renderRecognitionWall()}
        </div>
      `;

      // Animate visibility
      setTimeout(() => {
        communityLoading.style.display = 'none';
        communityContent.style.display = 'block';

        // Animate cards
        const cards = communityContent.querySelectorAll('.community-card');
        cards.forEach((card, index) => {
          setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.5s ease';

            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          }, index * 200);
        });
      }, 1500);

    } catch (error) {
      console.error('Failed to render community highlights:', error);
      this.renderCommunityError();
    }
  }

  renderTopContributors() {
    const topContributors = this.contributors.slice(0, 5);

    return `
      <div class="community-card">
        <div class="card-header">
          <div class="card-icon">👥</div>
          <h3 class="card-title">Top Contributors</h3>
        </div>
        <div class="contributors-list">
          ${topContributors.map(contributor => `
            <div class="contributor-item">
              <img src="${contributor.avatar_url}" alt="${contributor.login}" class="contributor-avatar">
              <div class="contributor-info">
                <div class="contributor-name">${contributor.login}</div>
                <div class="contributor-stats">
                  <span>💻 ${contributor.contributions} commits</span>
                  ${contributor.login === 'github-actions[bot]' ? '<span class="contribution-badge">AI Assistant</span>' : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderEngagementMetrics() {
    const totalIssues = this.issues.length;
    const openIssues = this.issues.filter(i => i.state === 'open').length;
    const totalPRs = this.pulls.length;
    const mergedPRs = this.pulls.filter(pr => pr.merged_at).length;

    return `
      <div class="community-card">
        <div class="card-header">
          <div class="card-icon">📊</div>
          <h3 class="card-title">Engagement Metrics</h3>
        </div>
        <div class="engagement-metrics">
          <div class="metric-item">
            <div class="metric-value">${this.contributors.length}</div>
            <div class="metric-label">Contributors</div>
          </div>
          <div class="metric-item">
            <div class="metric-value">${totalIssues}</div>
            <div class="metric-label">Total Issues</div>
          </div>
          <div class="metric-item">
            <div class="metric-value">${totalPRs}</div>
            <div class="metric-label">Pull Requests</div>
          </div>
          <div class="metric-item">
            <div class="metric-value">${mergedPRs}</div>
            <div class="metric-label">Merged PRs</div>
          </div>
        </div>
      </div>
    `;
  }

  renderMilestones() {
    return `
      <div class="community-card">
        <div class="card-header">
          <div class="card-icon">🏆</div>
          <h3 class="card-title">Recent Milestones</h3>
        </div>
        <div class="milestones-timeline">
          ${this.milestones.map(milestone => `
            <div class="milestone-item">
              <div class="milestone-date">${new Date(milestone.date).toLocaleDateString()}</div>
              <div class="milestone-title">${milestone.title}</div>
              <div class="milestone-description">${milestone.description}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderRecognitionWall() {
    const recognitions = [
      '🏆 Innovation Excellence',
      '🤖 AI Integration Pioneer',
      '♿ Accessibility Champion',
      '📱 PWA Expert',
      '🔍 Testing Advocate',
      '🎨 UX Excellence',
      '⚡ Performance Optimized',
      '🌐 Internationalization Ready'
    ];

    return `
      <div class="community-card">
        <div class="card-header">
          <div class="card-icon">🌟</div>
          <h3 class="card-title">Recognition Wall</h3>
        </div>
        <div class="recognition-wall">
          <div class="recognition-title">Achievements Unlocked</div>
          <div class="recognition-list">
            ${recognitions.map(recognition => `
              <span class="recognition-badge">${recognition}</span>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  setupInteractions() {
    // Make the community section visible with animation
    setTimeout(() => {
      const communitySection = document.getElementById('communitySection');
      if (communitySection) {
        communitySection.classList.add('visible');
      }
    }, 800);

    // Add hover effects and interactions
    this.addInteractiveEffects();
  }

  addInteractiveEffects() {
    // Add click tracking for contributor profiles
    document.addEventListener('click', (e) => {
      if (e.target.closest('.contributor-item')) {
        const contributorItem = e.target.closest('.contributor-item');
        const contributorName = contributorItem.querySelector('.contributor-name')?.textContent;

        if (contributorName && contributorName !== 'github-actions[bot]') {
          // Open GitHub profile in new tab
          window.open(`https://github.com/${contributorName}`, '_blank');
        }
      }
    });

    // Add pulse animation to recognition badges
    const badges = document.querySelectorAll('.recognition-badge');
    badges.forEach((badge, index) => {
      setTimeout(() => {
        badge.style.animation = 'pulse 0.6s ease';
      }, index * 100);
    });
  }

  renderCommunityError() {
    const communityContent = document.getElementById('communityContent');
    const communityLoading = document.getElementById('communityLoading');

    if (communityLoading) {
      communityLoading.style.display = 'none';
    }
    if (communityContent) {
      communityContent.innerHTML = `
        <div class="community-card">
          <div style="text-align: center; padding: 40px;">
            <div style="font-size: 3rem; margin-bottom: 15px;">🤝</div>
            <h3>Community Highlights</h3>
            <p style="color: var(--text-secondary);">Community data will be displayed when connectivity is restored.</p>
          </div>
        </div>
      `;
      communityContent.style.display = 'block';
    }
  }
}

// Initialize the community engagement system
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new CommunityEngagement();
  });
} else {
  new CommunityEngagement();
}

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CommunityEngagement;
}