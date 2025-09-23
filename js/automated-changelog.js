/**
 * Automated Changelog Generation System for CocoPilot
 * Generates dynamic changelogs from Git commits and GitHub API data
 */

class AutomatedChangelogGenerator {
  constructor() {
    this.apiBase = 'https://api.github.com/repos/acbart/cocopilot';
    this.cache = new Map();
    this.cacheExpiry = 15 * 60 * 1000; // 15 minutes
    this.changelogData = [];

    this.init();
  }

  async init() {
    try {
      await this.addChangelogStyles();
      await this.createChangelogInterface();
      await this.loadChangelogData();
      await this.generateChangelog();
      this.setupEventHandlers();
      console.log('📝 Automated Changelog Generator initialized');
    } catch (error) {
      console.error('Changelog generator initialization failed:', error);
      this.renderFallback();
    }
  }

  async addChangelogStyles() {
    const styles = `
      <style id="automated-changelog-styles">
        .changelog-section {
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

        .changelog-section.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .changelog-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 2px solid var(--border-color);
        }

        .changelog-title {
          margin: 0;
          color: var(--text-primary);
          font-size: 1.6rem;
          background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .changelog-controls {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .changelog-filter {
          padding: 8px 12px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background: var(--container-bg);
          color: var(--text-primary);
          font-size: 0.9rem;
          outline: none;
          transition: all 0.3s ease;
        }

        .changelog-filter:focus {
          border-color: var(--button-gradient-start);
        }

        .changelog-toggle {
          background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .changelog-toggle:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .changelog-content {
          display: none;
        }

        .changelog-content.expanded {
          display: block;
        }

        .changelog-timeline {
          position: relative;
          padding-left: 40px;
        }

        .changelog-timeline::before {
          content: '';
          position: absolute;
          left: 20px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, var(--button-gradient-start), var(--button-gradient-end));
        }

        .changelog-version {
          position: relative;
          margin-bottom: 30px;
          background: var(--feature-bg);
          border-radius: 16px;
          padding: 20px;
          border: 1px solid var(--border-color);
          transition: all 0.3s ease;
        }

        .changelog-version:hover {
          transform: translateX(5px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);
        }

        .changelog-version::before {
          content: '';
          position: absolute;
          left: -30px;
          top: 20px;
          width: 12px;
          height: 12px;
          background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
          border-radius: 50%;
          border: 3px solid var(--container-bg);
        }

        .version-header {
          display: flex;
          justify-content: between;
          align-items: center;
          margin-bottom: 15px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .version-number {
          font-size: 1.2rem;
          font-weight: bold;
          color: var(--text-primary);
        }

        .version-date {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .version-type {
          background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: bold;
          margin-left: auto;
        }

        .version-summary {
          color: var(--text-secondary);
          font-style: italic;
          margin-bottom: 15px;
          font-size: 0.95rem;
        }

        .change-categories {
          display: grid;
          gap: 15px;
        }

        .change-category {
          background: rgba(102, 126, 234, 0.05);
          border-radius: 12px;
          padding: 15px;
          border: 1px solid rgba(102, 126, 234, 0.1);
        }

        .category-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }

        .category-icon {
          font-size: 1.1rem;
        }

        .category-title {
          font-weight: bold;
          color: var(--text-primary);
          font-size: 0.95rem;
        }

        .change-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .change-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 8px;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .change-item:hover {
          background: rgba(102, 126, 234, 0.1);
        }

        .change-bullet {
          color: var(--button-gradient-start);
          font-weight: bold;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .change-text {
          color: var(--text-primary);
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .commit-link {
          color: var(--text-tertiary);
          font-size: 0.8rem;
          text-decoration: none;
          margin-left: 5px;
        }

        .commit-link:hover {
          color: var(--button-gradient-start);
          text-decoration: underline;
        }

        .loading-changelog {
          text-align: center;
          padding: 40px;
          color: var(--text-secondary);
        }

        .loading-spinner-changelog {
          width: 30px;
          height: 30px;
          border: 2px solid rgba(102, 126, 234, 0.3);
          border-top: 2px solid var(--button-gradient-start);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 15px;
        }

        .changelog-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
          padding: 20px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
          border-radius: 12px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--button-gradient-start);
          margin-bottom: 3px;
        }

        .stat-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .changelog-section {
            margin: 20px 0;
            padding: 20px;
          }

          .changelog-header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }

          .changelog-timeline {
            padding-left: 30px;
          }

          .changelog-timeline::before {
            left: 15px;
          }

          .changelog-version::before {
            left: -22px;
          }

          .version-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .version-type {
            margin-left: 0;
          }

          .changelog-stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        [data-theme="dark"] .changelog-section {
          background: rgba(42, 42, 42, 0.95);
        }

        [data-theme="dark"] .changelog-version {
          background: rgba(255, 255, 255, 0.05);
        }

        [data-theme="dark"] .change-category {
          background: rgba(255, 255, 255, 0.05);
        }

        [data-theme="dark"] .change-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        [data-theme="dark"] .changelog-filter {
          background: rgba(255, 255, 255, 0.05);
        }
      </style>
    `;

    if (!document.getElementById('automated-changelog-styles')) {
      document.head.insertAdjacentHTML('beforeend', styles);
    }
  }

  async createChangelogInterface() {
    const changelogHTML = `
      <section class="changelog-section" id="changelogSection">
        <div class="changelog-header">
          <h2 class="changelog-title">📝 Automated Changelog</h2>
          <div class="changelog-controls">
            <select class="changelog-filter" id="changelogFilter">
              <option value="all">All Changes</option>
              <option value="major">Major Releases</option>
              <option value="minor">Minor Updates</option>
              <option value="patch">Bug Fixes</option>
            </select>
            <button class="changelog-toggle" id="changelogToggle">
              📋 Show Changelog
            </button>
          </div>
        </div>
        
        <div class="changelog-content" id="changelogContent">
          <div class="loading-changelog" id="changelogLoading">
            <div class="loading-spinner-changelog"></div>
            <p>Generating changelog from repository history...</p>
          </div>
          
          <div class="changelog-timeline" id="changelogTimeline" style="display: none;">
            <!-- Changelog will be generated here -->
          </div>
        </div>
      </section>
    `;

    // Find the best insertion point
    const targetElement = document.querySelector('#communitySection') ||
                         document.querySelector('#dataVisualization') ||
                         document.querySelector('.about-section') ||
                         document.querySelector('main');

    if (targetElement) {
      targetElement.insertAdjacentHTML('afterend', changelogHTML);
    }
  }

  async loadChangelogData() {
    try {
      const [commits, releases, tags] = await Promise.all([
        this.fetchGitHubData('/commits?per_page=100'),
        this.fetchGitHubData('/releases'),
        this.fetchGitHubData('/tags')
      ]);

      this.changelogData = this.processChangelogData(commits, releases, tags);
      return this.changelogData;
    } catch (error) {
      console.warn('Failed to load changelog data:', error);
      throw error;
    }
  }

  async fetchGitHubData(endpoint) {
    const cacheKey = `changelog_${endpoint}`;
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

  processChangelogData(commits, releases, tags) {
    // Create versions from recent significant commits
    const versions = [];
    const currentVersion = 1;

    // Process commits into logical versions
    const significantCommits = commits.filter(commit =>
      this.isSignificantCommit(commit.commit.message)
    );

    // Group commits by date ranges for version creation
    const commitGroups = this.groupCommitsBySignificance(significantCommits);

    commitGroups.forEach((group, index) => {
      const versionNumber = `2.${currentVersion + index}.0`;
      const version = {
        number: versionNumber,
        date: group.date,
        type: this.determineVersionType(group.commits),
        summary: this.generateVersionSummary(group.commits),
        changes: this.categorizeChanges(group.commits)
      };
      versions.push(version);
    });

    return versions;
  }

  isSignificantCommit(message) {
    const significantKeywords = [
      'feature', 'add', 'implement', 'create', 'enhance', 'improve',
      'major', 'analytics', 'dashboard', 'community', 'search', 'documentation',
      'accessibility', 'performance', 'optimization', 'ui', 'ux'
    ];

    const messageLower = message.toLowerCase();
    return significantKeywords.some(keyword => messageLower.includes(keyword));
  }

  groupCommitsBySignificance(commits) {
    const groups = [];
    let currentGroup = {
      commits: [],
      date: null
    };

    commits.forEach((commit, index) => {
      if (!currentGroup.date) {
        currentGroup.date = commit.commit.author.date;
      }

      currentGroup.commits.push(commit);

      // Create a new group for major features or every 5-10 commits
      if (this.isMajorCommit(commit.commit.message) ||
          currentGroup.commits.length >= 8) {
        groups.push({ ...currentGroup });
        currentGroup = { commits: [], date: null };
      }
    });

    if (currentGroup.commits.length > 0) {
      groups.push(currentGroup);
    }

    return groups.slice(0, 5); // Limit to 5 most recent versions
  }

  isMajorCommit(message) {
    const majorKeywords = [
      'major feature', 'analytics dashboard', 'community engagement',
      'search system', 'documentation portal', 'visualization engine'
    ];

    const messageLower = message.toLowerCase();
    return majorKeywords.some(keyword => messageLower.includes(keyword));
  }

  determineVersionType(commits) {
    const hasMajorFeature = commits.some(commit =>
      this.isMajorCommit(commit.commit.message)
    );

    if (hasMajorFeature) {
      return 'major';
    }

    const hasFeature = commits.some(commit =>
      commit.commit.message.toLowerCase().includes('feature') ||
      commit.commit.message.toLowerCase().includes('add')
    );

    return hasFeature ? 'minor' : 'patch';
  }

  generateVersionSummary(commits) {
    const messages = commits.map(c => c.commit.message);

    if (messages.some(m => m.toLowerCase().includes('analytics'))) {
      return 'Enhanced analytics dashboard with interactive visualizations and real-time insights';
    }

    if (messages.some(m => m.toLowerCase().includes('community'))) {
      return 'Community engagement features with contributor highlights and metrics';
    }

    if (messages.some(m => m.toLowerCase().includes('search'))) {
      return 'Advanced search and discovery system with intelligent filtering';
    }

    if (messages.some(m => m.toLowerCase().includes('documentation'))) {
      return 'Comprehensive documentation portal with interactive guides';
    }

    return 'Various improvements and enhancements to user experience';
  }

  categorizeChanges(commits) {
    const categories = {
      features: [],
      improvements: [],
      fixes: [],
      documentation: []
    };

    commits.forEach(commit => {
      const message = commit.commit.message;
      const change = {
        text: this.formatChangeMessage(message),
        sha: commit.sha.substring(0, 7),
        url: commit.html_url
      };

      if (this.isFeatureCommit(message)) {
        categories.features.push(change);
      } else if (this.isDocumentationCommit(message)) {
        categories.documentation.push(change);
      } else if (this.isFixCommit(message)) {
        categories.fixes.push(change);
      } else {
        categories.improvements.push(change);
      }
    });

    return categories;
  }

  isFeatureCommit(message) {
    const featureKeywords = ['add', 'create', 'implement', 'new feature'];
    return featureKeywords.some(keyword =>
      message.toLowerCase().includes(keyword)
    );
  }

  isDocumentationCommit(message) {
    const docKeywords = ['docs', 'documentation', 'readme', 'guide'];
    return docKeywords.some(keyword =>
      message.toLowerCase().includes(keyword)
    );
  }

  isFixCommit(message) {
    const fixKeywords = ['fix', 'bug', 'error', 'issue'];
    return fixKeywords.some(keyword =>
      message.toLowerCase().includes(keyword)
    );
  }

  formatChangeMessage(message) {
    // Remove commit prefixes and clean up message
    return message
      .replace(/^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: /, '')
      .replace(/^(Add|Create|Implement|Fix|Update|Enhance|Improve) /, '')
      .trim();
  }

  async generateChangelog() {
    const changelogTimeline = document.getElementById('changelogTimeline');
    const changelogLoading = document.getElementById('changelogLoading');

    if (!changelogTimeline || !this.changelogData.length) {
      this.renderChangelogError();
      return;
    }

    try {
      // Generate stats
      const stats = this.generateChangelogStats();

      // Generate versions
      const versionsHTML = this.changelogData.map(version =>
        this.renderVersion(version)
      ).join('');

      changelogTimeline.innerHTML = `
        <div class="changelog-stats">
          ${stats}
        </div>
        ${versionsHTML}
      `;

      // Animate visibility
      setTimeout(() => {
        changelogLoading.style.display = 'none';
        changelogTimeline.style.display = 'block';

        // Animate versions
        const versions = changelogTimeline.querySelectorAll('.changelog-version');
        versions.forEach((version, index) => {
          setTimeout(() => {
            version.style.opacity = '0';
            version.style.transform = 'translateX(-20px)';
            version.style.transition = 'all 0.5s ease';

            requestAnimationFrame(() => {
              version.style.opacity = '1';
              version.style.transform = 'translateX(0)';
            });
          }, index * 200);
        });
      }, 1500);

    } catch (error) {
      console.error('Failed to generate changelog:', error);
      this.renderChangelogError();
    }
  }

  generateChangelogStats() {
    const totalVersions = this.changelogData.length;
    const totalChanges = this.changelogData.reduce((sum, version) => {
      return sum + Object.values(version.changes).reduce((catSum, changes) =>
        catSum + changes.length, 0
      );
    }, 0);

    const majorVersions = this.changelogData.filter(v => v.type === 'major').length;
    const recentDays = Math.ceil((Date.now() - new Date(this.changelogData[0]?.date || Date.now())) / (1000 * 60 * 60 * 24));

    return `
      <div class="stat-item">
        <div class="stat-value">${totalVersions}</div>
        <div class="stat-label">Versions</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${totalChanges}</div>
        <div class="stat-label">Changes</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${majorVersions}</div>
        <div class="stat-label">Major Releases</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${recentDays}</div>
        <div class="stat-label">Days Active</div>
      </div>
    `;
  }

  renderVersion(version) {
    const categoryIcons = {
      features: '✨',
      improvements: '🔧',
      fixes: '🐛',
      documentation: '📚'
    };

    const categoriesHTML = Object.entries(version.changes)
      .filter(([_, changes]) => changes.length > 0)
      .map(([category, changes]) => `
        <div class="change-category">
          <div class="category-header">
            <span class="category-icon">${categoryIcons[category] || '🔄'}</span>
            <span class="category-title">${this.formatCategoryName(category)}</span>
          </div>
          <ul class="change-list">
            ${changes.map(change => `
              <li class="change-item">
                <span class="change-bullet">•</span>
                <span class="change-text">
                  ${change.text}
                  <a href="${change.url}" class="commit-link" target="_blank" title="View commit">${change.sha}</a>
                </span>
              </li>
            `).join('')}
          </ul>
        </div>
      `).join('');

    return `
      <div class="changelog-version" data-type="${version.type}">
        <div class="version-header">
          <span class="version-number">v${version.number}</span>
          <span class="version-date">${new Date(version.date).toLocaleDateString()}</span>
          <span class="version-type">${version.type.toUpperCase()}</span>
        </div>
        <div class="version-summary">${version.summary}</div>
        <div class="change-categories">
          ${categoriesHTML}
        </div>
      </div>
    `;
  }

  formatCategoryName(category) {
    const names = {
      features: 'New Features',
      improvements: 'Improvements',
      fixes: 'Bug Fixes',
      documentation: 'Documentation'
    };
    return names[category] || category;
  }

  setupEventHandlers() {
    const changelogToggle = document.getElementById('changelogToggle');
    const changelogContent = document.getElementById('changelogContent');
    const changelogFilter = document.getElementById('changelogFilter');

    if (changelogToggle && changelogContent) {
      changelogToggle.addEventListener('click', () => {
        const isExpanded = changelogContent.classList.contains('expanded');

        if (isExpanded) {
          changelogContent.classList.remove('expanded');
          changelogToggle.textContent = '📋 Show Changelog';
        } else {
          changelogContent.classList.add('expanded');
          changelogToggle.textContent = '📋 Hide Changelog';
        }
      });
    }

    if (changelogFilter) {
      changelogFilter.addEventListener('change', (e) => {
        this.filterChangelog(e.target.value);
      });
    }

    // Make section visible with animation
    setTimeout(() => {
      const changelogSection = document.getElementById('changelogSection');
      if (changelogSection) {
        changelogSection.classList.add('visible');
      }
    }, 1200);
  }

  filterChangelog(filterType) {
    const versions = document.querySelectorAll('.changelog-version');

    versions.forEach(version => {
      const versionType = version.getAttribute('data-type');

      if (filterType === 'all' || versionType === filterType) {
        version.style.display = 'block';
      } else {
        version.style.display = 'none';
      }
    });
  }

  renderChangelogError() {
    const changelogTimeline = document.getElementById('changelogTimeline');
    const changelogLoading = document.getElementById('changelogLoading');

    if (changelogLoading) {
      changelogLoading.style.display = 'none';
    }
    if (changelogTimeline) {
      changelogTimeline.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
          <div style="font-size: 3rem; margin-bottom: 15px;">📝</div>
          <h3>Changelog Generation</h3>
          <p>Changelog will be generated when repository data is available.</p>
        </div>
      `;
      changelogTimeline.style.display = 'block';
    }
  }

  renderFallback() {
    const fallbackHTML = `
      <section class="changelog-section visible">
        <div class="changelog-header">
          <h2 class="changelog-title">📝 Automated Changelog</h2>
        </div>
        <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
          <div style="font-size: 3rem; margin-bottom: 15px;">📝</div>
          <p>Automated changelog generation will be available when repository data can be accessed.</p>
        </div>
      </section>
    `;

    const targetElement = document.querySelector('#communitySection') ||
                         document.querySelector('#dataVisualization') ||
                         document.querySelector('.about-section') ||
                         document.querySelector('main');

    if (targetElement) {
      targetElement.insertAdjacentHTML('afterend', fallbackHTML);
    }
  }
}

// Initialize the automated changelog generator
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new AutomatedChangelogGenerator();
  });
} else {
  new AutomatedChangelogGenerator();
}

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AutomatedChangelogGenerator;
}