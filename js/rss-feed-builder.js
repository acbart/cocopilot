/**
 * Enhanced RSS Feed Builder for CocoPilot
 * Creates a dynamic RSS feed endpoint with better content and caching
 */

class RSSFeedBuilder {
  constructor(owner, repo) {
    this.owner = owner;
    this.repo = repo;
    this.baseUrl = `https://github.com/${owner}/${repo}`;
    this.apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
    this.cacheKey = 'cocopilot-rss-cache';
    this.cacheExpiry = 15 * 60 * 1000; // 15 minutes
  }

  /**
   * Generate complete RSS feed with caching
   */
  async generateRSSFeed() {
    try {
      // Check cache first
      const cached = this.getCachedFeed();
      if (cached) {
        return cached;
      }

      const [repoInfo, commits, issues, releases] = await Promise.all([
        this.fetchRepositoryInfo(),
        this.fetchRecentCommits(15),
        this.fetchRecentIssues(10),
        this.fetchRecentReleases(5)
      ]);

      const feedData = {
        title: `${repoInfo.name} - AI-Driven Repository Updates`,
        description: repoInfo.description || 'A self-updating repository powered by AI',
        link: this.baseUrl,
        language: 'en-us',
        lastBuildDate: new Date().toUTCString(),
        items: this.combineAndFormatItems(commits, issues, releases)
      };

      const rssXML = this.buildEnhancedRSSXML(feedData);

      // Cache the result
      this.cacheFeed(rssXML);

      return rssXML;
    } catch (error) {
      console.error('Error generating RSS feed:', error);
      return this.generateFallbackFeed();
    }
  }

  /**
   * Create RSS feed file and serve it
   */
  async createRSSFile() {
    try {
      const rssContent = await this.generateRSSFeed();

      // Create blob and object URL for serving
      const blob = new Blob([rssContent], { type: 'application/rss+xml; charset=utf-8' });
      const url = URL.createObjectURL(blob);

      // Store in cache for serving
      this.cacheRSSBlob(blob);

      return {
        success: true,
        url: url,
        content: rssContent,
        blob: blob
      };
    } catch (error) {
      console.error('Error creating RSS file:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Fetch repository information with error handling
   */
  async fetchRepositoryInfo() {
    const response = await this.fetchWithRetry(this.apiUrl);
    return response.json();
  }

  /**
   * Fetch recent commits with pagination
   */
  async fetchRecentCommits(count = 15) {
    const response = await this.fetchWithRetry(`${this.apiUrl}/commits?per_page=${count}`);
    const commits = await response.json();

    return commits.map(commit => ({
      type: 'commit',
      title: `🔄 ${commit.commit.message.split('\n')[0].substring(0, 80)}${commit.commit.message.length > 80 ? '...' : ''}`,
      description: this.formatCommitDescription(commit),
      link: commit.html_url,
      date: new Date(commit.commit.author.date),
      author: commit.commit.author.name || 'GitHub User',
      id: `commit-${commit.sha}`,
      category: 'Development'
    }));
  }

  /**
   * Fetch recent issues and pull requests
   */
  async fetchRecentIssues(count = 10) {
    try {
      const response = await this.fetchWithRetry(`${this.apiUrl}/issues?state=all&per_page=${count}&sort=updated`);
      const issues = await response.json();

      return issues.map(issue => ({
        type: issue.pull_request ? 'pull-request' : 'issue',
        title: `${issue.pull_request ? '🔄' : '📋'} ${issue.title}`,
        description: this.formatIssueDescription(issue),
        link: issue.html_url,
        date: new Date(issue.updated_at),
        author: issue.user.login,
        id: `${issue.pull_request ? 'pr' : 'issue'}-${issue.number}`,
        category: issue.pull_request ? 'Pull Request' : 'Issue'
      }));
    } catch (error) {
      console.warn('Could not fetch issues:', error);
      return [];
    }
  }

  /**
   * Fetch recent releases
   */
  async fetchRecentReleases(count = 5) {
    try {
      const response = await this.fetchWithRetry(`${this.apiUrl}/releases?per_page=${count}`);
      const releases = await response.json();

      return releases.map(release => ({
        type: 'release',
        title: `🚀 ${release.name || release.tag_name}`,
        description: this.formatReleaseDescription(release),
        link: release.html_url,
        date: new Date(release.published_at || release.created_at),
        author: release.author?.login || 'GitHub',
        id: `release-${release.id}`,
        category: 'Release'
      }));
    } catch (error) {
      console.warn('Could not fetch releases:', error);
      return [];
    }
  }

  /**
   * Format commit description with details
   */
  formatCommitDescription(commit) {
    const message = commit.commit.message;
    const firstLine = message.split('\n')[0];
    const body = message.substring(firstLine.length).trim();

    let description = `<strong>Commit:</strong> ${this.escapeHTML(firstLine)}<br/>`;
    description += `<strong>Author:</strong> ${this.escapeHTML(commit.commit.author.name)}<br/>`;
    description += `<strong>Date:</strong> ${new Date(commit.commit.author.date).toLocaleString()}<br/>`;

    if (body) {
      description += `<br/><strong>Details:</strong><br/>${this.escapeHTML(body).replace(/\n/g, '<br/>')}`;
    }

    if (commit.stats) {
      description += `<br/><br/><strong>Changes:</strong> +${commit.stats.additions} -${commit.stats.deletions}`;
    }

    return description;
  }

  /**
   * Format issue/PR description
   */
  formatIssueDescription(issue) {
    let description = `<strong>${issue.pull_request ? 'Pull Request' : 'Issue'} #${issue.number}</strong><br/>`;
    description += `<strong>State:</strong> ${issue.state}<br/>`;
    description += `<strong>Author:</strong> ${this.escapeHTML(issue.user.login)}<br/>`;
    description += `<strong>Updated:</strong> ${new Date(issue.updated_at).toLocaleString()}<br/>`;

    if (issue.body && issue.body.trim()) {
      const truncatedBody = issue.body.length > 200 ?
        issue.body.substring(0, 200) + '...' :
        issue.body;
      description += `<br/><strong>Description:</strong><br/>${this.escapeHTML(truncatedBody).replace(/\n/g, '<br/>')}`;
    }

    if (issue.labels && issue.labels.length > 0) {
      const labels = issue.labels.map(label => `<span style="background: #${label.color}; color: white; padding: 2px 6px; border-radius: 3px; font-size: 0.8em;">${this.escapeHTML(label.name)}</span>`).join(' ');
      description += `<br/><br/><strong>Labels:</strong> ${labels}`;
    }

    return description;
  }

  /**
   * Format release description
   */
  formatReleaseDescription(release) {
    let description = `<strong>Release ${this.escapeHTML(release.tag_name)}</strong><br/>`;
    description += `<strong>Published:</strong> ${new Date(release.published_at || release.created_at).toLocaleString()}<br/>`;

    if (release.body && release.body.trim()) {
      const truncatedBody = release.body.length > 300 ?
        release.body.substring(0, 300) + '...' :
        release.body;
      description += `<br/><strong>Release Notes:</strong><br/>${this.escapeHTML(truncatedBody).replace(/\n/g, '<br/>')}`;
    }

    return description;
  }

  /**
   * Combine and sort all feed items
   */
  combineAndFormatItems(commits, issues, releases) {
    return [...commits, ...issues, ...releases]
      .sort((a, b) => b.date - a.date)
      .slice(0, 25); // Limit to 25 most recent items
  }

  /**
   * Build enhanced RSS XML with proper formatting
   */
  buildEnhancedRSSXML(feedData) {
    const now = new Date().toUTCString();

    const itemsXML = feedData.items.map(item => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <description><![CDATA[${item.description}]]></description>
      <link>${this.escapeXML(item.link)}</link>
      <guid isPermaLink="true">${this.escapeXML(item.link)}</guid>
      <pubDate>${item.date.toUTCString()}</pubDate>
      <category>${this.escapeXML(item.category)}</category>
      <source url="${this.baseUrl}">${this.escapeXML(feedData.title)}</source>
    </item>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title><![CDATA[${feedData.title}]]></title>
    <description><![CDATA[${feedData.description}]]></description>
    <link>${this.escapeXML(feedData.link)}</link>
    <language>${feedData.language}</language>
    <lastBuildDate>${now}</lastBuildDate>
    <pubDate>${now}</pubDate>
    <ttl>15</ttl>
    <generator>CocoPilot RSS Feed Builder v2.0</generator>
    <managingEditor>noreply@github.com (CocoPilot AI)</managingEditor>
    <webMaster>noreply@github.com (GitHub Pages)</webMaster>
    <copyright>MIT License - GitHub</copyright>
    <atom:link href="${this.escapeXML(feedData.link)}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${this.escapeXML(feedData.link)}/favicon.svg</url>
      <title><![CDATA[${feedData.title}]]></title>
      <link>${this.escapeXML(feedData.link)}</link>
      <width>32</width>
      <height>32</height>
    </image>
    ${itemsXML}
  </channel>
</rss>`;
  }

  /**
   * Generate fallback feed when main generation fails
   */
  generateFallbackFeed() {
    const now = new Date().toUTCString();

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>CocoPilot - RSS Feed Unavailable</title>
    <description>The RSS feed is temporarily unavailable due to network issues. Please try again later.</description>
    <link>${this.baseUrl}</link>
    <lastBuildDate>${now}</lastBuildDate>
    <pubDate>${now}</pubDate>
    <item>
      <title>RSS Feed Temporarily Unavailable</title>
      <description>The RSS feed for CocoPilot updates is temporarily unavailable. Please visit the repository directly for the latest updates.</description>
      <link>${this.baseUrl}</link>
      <pubDate>${now}</pubDate>
      <guid>${this.baseUrl}#${Date.now()}</guid>
    </item>
  </channel>
</rss>`;
  }

  /**
   * Fetch with retry logic
   */
  async fetchWithRetry(url, maxRetries = 2) {
    for (let i = 0; i <= maxRetries; i++) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response;
      } catch (error) {
        if (i === maxRetries) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  /**
   * Cache management
   */
  getCachedFeed() {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (cached) {
        const data = JSON.parse(cached);
        if (Date.now() - data.timestamp < this.cacheExpiry) {
          return data.content;
        }
      }
    } catch (error) {
      console.warn('Cache read error:', error);
    }
    return null;
  }

  cacheFeed(content) {
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify({
        content: content,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Cache write error:', error);
    }
  }

  cacheRSSBlob(blob) {
    try {
      // Store blob reference for potential reuse
      window.cocopilotRSSBlob = blob;
    } catch (error) {
      console.warn('Blob cache error:', error);
    }
  }

  /**
   * Utility functions
   */
  escapeXML(str) {
    if (!str) {
      return '';
    }
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  escapeHTML(str) {
    if (!str) {
      return '';
    }
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RSSFeedBuilder;
}

// Global initialization
if (typeof window !== 'undefined') {
  window.RSSFeedBuilder = RSSFeedBuilder;
}