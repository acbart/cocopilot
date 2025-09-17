/**
 * GitHub Activity Visualization
 * Fetches and displays recent repository activity in an interactive timeline
 */

class GitHubActivity {
  constructor(owner, repo) {
    this.owner = owner;
    this.repo = repo;
    this.baseUrl = 'https://api.github.com/repos';
    this.maxCommits = 10;
    this.retryAttempts = 3;
    this.retryDelay = 1000;
  }

  /**
   * Fetch recent commits from GitHub API
   */
  async fetchRecentCommits() {
    const url = `${this.baseUrl}/${this.owner}/${this.repo}/commits?per_page=${this.maxCommits}`;

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await fetch(url);

        if (!response.ok) {
          // Handle specific HTTP status codes
          if (response.status === 403) {
            console.warn('GitHub API rate limit exceeded');
            throw new Error('API rate limit exceeded');
          } else if (response.status === 404) {
            console.warn('Repository not found');
            throw new Error('Repository not found');
          } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
        }

        const commits = await response.json();
        console.log('Successfully fetched GitHub activity');
        return this.processCommits(commits);
      } catch (error) {
        // Suppress console warnings for network blocks (common in sandboxed environments)
        if (!error.message.includes('ERR_BLOCKED_BY_CLIENT') &&
            !error.message.includes('Failed to fetch')) {
          console.warn(`Attempt ${attempt} failed:`, error.message);
        }

        if (attempt === this.retryAttempts) {
          console.log('Using fallback data due to API unavailability');
          return this.getFallbackData();
        }

        // Wait before retrying, but don't retry for certain errors
        if (error.message.includes('ERR_BLOCKED_BY_CLIENT') ||
            error.message.includes('rate limit')) {
          console.log('API access blocked, using fallback data');
          return this.getFallbackData();
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
      }
    }
  }

  /**
   * Process raw commit data into visualization format
   */
  processCommits(commits) {
    return commits.map((commit, index) => ({
      id: commit.sha.substring(0, 7),
      message: commit.commit.message.split('\n')[0], // First line only
      author: commit.commit.author.name,
      date: new Date(commit.commit.author.date),
      url: commit.html_url,
      avatar: commit.author?.avatar_url || `https://github.com/identicons/${commit.commit.author.email}.png`,
      type: this.categorizeCommit(commit.commit.message),
      isRecent: index < 3 // Mark first 3 as recent
    }));
  }

  /**
   * Categorize commits by type based on commit message
   */
  categorizeCommit(message) {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('fix') || lowerMessage.includes('bug')) {
      return { icon: '🐛', type: 'fix', color: '#f85149' };
    } else if (lowerMessage.includes('feat') || lowerMessage.includes('add')) {
      return { icon: '✨', type: 'feature', color: '#3fb950' };
    } else if (lowerMessage.includes('test') || lowerMessage.includes('spec')) {
      return { icon: '🧪', type: 'test', color: '#8957e5' };
    } else if (lowerMessage.includes('docs') || lowerMessage.includes('readme')) {
      return { icon: '📚', type: 'docs', color: '#1f6feb' };
    } else if (lowerMessage.includes('refactor') || lowerMessage.includes('clean')) {
      return { icon: '♻️', type: 'refactor', color: '#fb8500' };
    } else if (lowerMessage.includes('style') || lowerMessage.includes('format')) {
      return { icon: '🎨', type: 'style', color: '#d73a7b' };
    } else if (lowerMessage.includes('perf') || lowerMessage.includes('optimize')) {
      return { icon: '⚡', type: 'performance', color: '#ffa500' };
    } else {
      return { icon: '🔄', type: 'other', color: '#656d76' };
    }
  }

  /**
   * Provide fallback data when API is unavailable
   */
  getFallbackData() {
    return [
      {
        id: 'offline1',
        message: 'Recent activity unavailable (offline)',
        author: 'CocoPilot',
        date: new Date(),
        url: '#',
        avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2NTZkNzYiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHBhdGggZD0iTTEyIDJDNi40NzcgMiAyIDYuNDc3IDIgMTJzNC40NzcgMTAgMTAgMTAgMTAtNC40NzcgMTAtMTAtNC40NzctMTAtMTAtMTB6bTMuNTkgNS41OWwtNy4wNyA3LjA3LTMuNTMtMy41M0w2LjQxIDl2NGgxMGwtMS40MS0xLjQxeiIgZmlsbD0iIzY1NmQ3NiIvPgo8L3N2Zz4KPC9zdmc+',
        type: { icon: '📡', type: 'offline', color: '#656d76' },
        isRecent: true
      }
    ];
  }

  /**
   * Render the activity timeline
   */
  renderActivityTimeline(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Container ${containerId} not found`);
      return;
    }

    // Show loading state
    container.innerHTML = `
      <div class="activity-header">
        <h3>🚀 Recent Activity</h3>
        <div class="activity-loading">
          <span class="loading-spinner">⏳</span>
          <span>Loading recent commits...</span>
        </div>
      </div>
    `;

    // Fetch and render commits
    this.fetchRecentCommits().then(commits => {
      this.renderCommits(container, commits);
    }).catch(error => {
      console.error('Error rendering activity timeline:', error);
      this.renderErrorState(container);
    });
  }

  /**
   * Render commits in the timeline
   */
  renderCommits(container, commits) {
    const timelineHtml = `
      <div class="activity-header">
        <h3>🚀 Recent Activity</h3>
        <div class="activity-stats">
          <span class="stat-badge">${commits.length} commits</span>
          <span class="stat-badge">Last updated: ${new Date().toLocaleDateString()}</span>
        </div>
      </div>
      <div class="activity-timeline">
        ${commits.map((commit, index) => this.renderCommitItem(commit, index)).join('')}
      </div>
      <div class="activity-footer">
        <a href="https://github.com/${this.owner}/${this.repo}/commits" 
           target="_blank" 
           class="view-all-link"
           aria-label="View all commits on GitHub">
          View all commits →
        </a>
      </div>
    `;

    container.innerHTML = timelineHtml;

    // Add click handlers for commit items
    this.attachEventListeners(container);
  }

  /**
   * Render individual commit item
   */
  renderCommitItem(commit, index) {
    const timeAgo = this.getTimeAgo(commit.date);
    const isRecent = commit.isRecent ? 'recent' : '';

    return `
      <div class="commit-item ${isRecent}" data-commit-url="${commit.url}" data-index="${index}">
        <div class="commit-indicator">
          <span class="commit-type-icon" style="color: ${commit.type.color}" title="${commit.type.type}">
            ${commit.type.icon}
          </span>
        </div>
        <div class="commit-content">
          <div class="commit-header">
            <span class="commit-message" title="${commit.message}">
              ${this.truncateMessage(commit.message, 60)}
            </span>
            <span class="commit-id" title="Commit ID">${commit.id}</span>
          </div>
          <div class="commit-meta">
            <img class="author-avatar" src="${commit.avatar}" alt="${commit.author}" loading="lazy">
            <span class="commit-author">${commit.author}</span>
            <span class="commit-time" title="${commit.date.toLocaleString()}">${timeAgo}</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render error state
   */
  renderErrorState(container) {
    container.innerHTML = `
      <div class="activity-header">
        <h3>🚀 Recent Activity</h3>
        <div class="activity-error">
          <span class="error-icon">⚠️</span>
          <span>Unable to load recent activity</span>
        </div>
      </div>
    `;
  }

  /**
   * Attach event listeners to commit items
   */
  attachEventListeners(container) {
    const commitItems = container.querySelectorAll('.commit-item');

    commitItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const url = item.dataset.commitUrl;
        if (url && url !== '#') {
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      });

      // Add keyboard navigation
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.click();
        }
      });

      // Make focusable
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', `View commit: ${item.querySelector('.commit-message').textContent}`);
    });
  }

  /**
   * Calculate human-readable time ago
   */
  getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) {
      return 'just now';
    }
    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    }
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    if (diffDays < 7) {
      return `${diffDays}d ago`;
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Truncate commit message to specified length
   */
  truncateMessage(message, maxLength) {
    if (message.length <= maxLength) {
      return message;
    }
    return message.substring(0, maxLength - 3) + '...';
  }
}

// Auto-initialize GitHub activity visualization
document.addEventListener('DOMContentLoaded', () => {
  const activityContainer = document.getElementById('github-activity');
  if (activityContainer) {
    const activity = new GitHubActivity('acbart', 'cocopilot');
    activity.renderActivityTimeline('github-activity');
  }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GitHubActivity;
}