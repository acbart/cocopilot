/**
 * RSS Feed Generator for CocoPilot Updates
 * Generates an RSS feed of repository activity and changes
 */

class RSSGenerator {
  constructor(owner, repo) {
    this.owner = owner;
    this.repo = repo;
    this.baseUrl = `https://github.com/${owner}/${repo}`;
    this.feedUrl = `https://api.github.com/repos/${owner}/${repo}`;
  }

  /**
   * Generate RSS feed XML for repository updates
   */
  async generateFeed() {
    try {
      const [repoInfo, commits, releases] = await Promise.all([
        this.fetchRepositoryInfo(),
        this.fetchRecentCommits(),
        this.fetchRecentReleases()
      ]);

      const items = this.combineAndSortItems(commits, releases);

      return this.buildRSSXML({
        title: `${repoInfo.name} - Repository Updates`,
        description: repoInfo.description || 'Repository updates and changes',
        link: this.baseUrl,
        items: items.slice(0, 20) // Limit to 20 most recent items
      });
    } catch (error) {
      console.error('Error generating RSS feed:', error);
      return this.generateErrorFeed();
    }
  }

  /**
   * Fetch repository information
   */
  async fetchRepositoryInfo() {
    const response = await fetch(this.feedUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch repository info: ${response.status}`);
    }
    return response.json();
  }

  /**
   * Fetch recent commits
   */
  async fetchRecentCommits() {
    const response = await fetch(`${this.feedUrl}/commits?per_page=10`);
    if (!response.ok) {
      throw new Error(`Failed to fetch commits: ${response.status}`);
    }
    const commits = await response.json();

    return commits.map(commit => ({
      type: 'commit',
      title: `Commit: ${commit.commit.message.split('\n')[0]}`,
      description: commit.commit.message,
      link: commit.html_url,
      date: new Date(commit.commit.author.date),
      author: commit.commit.author.name,
      id: commit.sha
    }));
  }

  /**
   * Fetch recent releases
   */
  async fetchRecentReleases() {
    try {
      const response = await fetch(`${this.feedUrl}/releases?per_page=5`);
      if (!response.ok) {
        return []; // Releases might not exist
      }
      const releases = await response.json();

      return releases.map(release => ({
        type: 'release',
        title: `Release: ${release.name || release.tag_name}`,
        description: release.body || 'New release available',
        link: release.html_url,
        date: new Date(release.published_at),
        author: release.author?.login || 'GitHub',
        id: release.id.toString()
      }));
    } catch (error) {
      console.warn('Could not fetch releases:', error);
      return [];
    }
  }

  /**
   * Combine and sort items by date
   */
  combineAndSortItems(commits, releases) {
    return [...commits, ...releases]
      .sort((a, b) => b.date - a.date);
  }

  /**
   * Build RSS XML from data
   */
  buildRSSXML({ title, description, link, items }) {
    const now = new Date().toUTCString();

    const itemsXML = items.map(item => `
    <item>
      <title><![CDATA[${this.escapeXML(item.title)}]]></title>
      <description><![CDATA[${this.escapeXML(item.description)}]]></description>
      <link>${this.escapeXML(item.link)}</link>
      <guid>${this.escapeXML(item.id)}</guid>
      <pubDate>${item.date.toUTCString()}</pubDate>
      <author>${this.escapeXML(item.author)}</author>
      <category>${item.type}</category>
    </item>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${this.escapeXML(title)}]]></title>
    <description><![CDATA[${this.escapeXML(description)}]]></description>
    <link>${this.escapeXML(link)}</link>
    <lastBuildDate>${now}</lastBuildDate>
    <pubDate>${now}</pubDate>
    <ttl>60</ttl>
    <language>en-us</language>
    <managingEditor>noreply@github.com (GitHub)</managingEditor>
    <webMaster>noreply@github.com (GitHub)</webMaster>
    <atom:link href="${this.escapeXML(link)}/rss.xml" rel="self" type="application/rss+xml"/>
    ${itemsXML}
  </channel>
</rss>`;
  }

  /**
   * Generate error feed when main generation fails
   */
  generateErrorFeed() {
    const now = new Date().toUTCString();

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>CocoPilot RSS Feed - Temporarily Unavailable</title>
    <description>RSS feed is temporarily unavailable due to network issues.</description>
    <link>${this.baseUrl}</link>
    <lastBuildDate>${now}</lastBuildDate>
    <item>
      <title>RSS Feed Temporarily Unavailable</title>
      <description>The RSS feed for CocoPilot updates is temporarily unavailable. Please try again later or visit the repository directly.</description>
      <link>${this.baseUrl}</link>
      <pubDate>${now}</pubDate>
    </item>
  </channel>
</rss>`;
  }

  /**
   * Escape special XML characters
   */
  escapeXML(str) {
    if (!str) {
      return '';
    }
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  /**
   * Download RSS feed as file
   */
  async downloadRSSFeed() {
    try {
      const rssContent = await this.generateFeed();
      const blob = new Blob([rssContent], { type: 'application/rss+xml' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'cocopilot-updates.xml';
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Error downloading RSS feed:', error);
      return false;
    }
  }

  /**
   * Get RSS feed URL for subscription
   */
  getRSSFeedURL() {
    // In a real implementation, this would point to a generated RSS file
    // For now, return a GitHub releases RSS feed as fallback
    return `https://github.com/${this.owner}/${this.repo}/releases.atom`;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RSSGenerator;
}

// Global initialization
if (typeof window !== 'undefined') {
  window.RSSGenerator = RSSGenerator;
}