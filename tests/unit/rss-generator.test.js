/**
 * Unit tests for RSS Generator functionality
 */

// Import RSSGenerator for testing
const RSSGenerator = require('../../js/rss-generator.js');

describe('RSS Generator', () => {
  let rssGenerator;

  beforeEach(() => {
    rssGenerator = new RSSGenerator('acbart', 'cocopilot');
  });

  describe('Initialization', () => {
    test('should create RSS generator with correct properties', () => {
      expect(rssGenerator.owner).toBe('acbart');
      expect(rssGenerator.repo).toBe('cocopilot');
      expect(rssGenerator.baseUrl).toBe('https://github.com/acbart/cocopilot');
      expect(rssGenerator.feedUrl).toBe('https://api.github.com/repos/acbart/cocopilot');
    });
  });

  describe('XML Generation', () => {
    test('should escape XML characters correctly', () => {
      const input = '<script>alert("test")</script> & "quotes" & \'single\'';
      const escaped = rssGenerator.escapeXML(input);

      expect(escaped).toBe('&lt;script&gt;alert(&quot;test&quot;)&lt;/script&gt; &amp; &quot;quotes&quot; &amp; &#x27;single&#x27;');
    });

    test('should handle null and undefined input', () => {
      expect(rssGenerator.escapeXML(null)).toBe('');
      expect(rssGenerator.escapeXML(undefined)).toBe('');
      expect(rssGenerator.escapeXML('')).toBe('');
    });

    test('should generate valid RSS XML structure', () => {
      const testData = {
        title: 'Test Feed',
        description: 'Test Description',
        link: 'https://example.com',
        items: [
          {
            id: 'test1',
            title: 'Test Item',
            description: 'Test item description',
            link: 'https://example.com/item1',
            date: new Date('2025-09-13T12:00:00Z'),
            author: 'Test Author',
            type: 'commit'
          }
        ]
      };

      const xml = rssGenerator.buildRSSXML(testData);

      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<rss version="2.0"');
      expect(xml).toContain('<title><![CDATA[Test Feed]]></title>');
      expect(xml).toContain('<description><![CDATA[Test Description]]></description>');
      expect(xml).toContain('<item>');
      expect(xml).toContain('<guid>test1</guid>');
      expect(xml).toContain('<category>commit</category>');
    });
  });

  describe('Data Processing', () => {
    test('should combine and sort items by date correctly', () => {
      const commits = [
        { date: new Date('2025-09-13T10:00:00Z'), title: 'Older commit' },
        { date: new Date('2025-09-13T12:00:00Z'), title: 'Newer commit' }
      ];

      const releases = [
        { date: new Date('2025-09-13T11:00:00Z'), title: 'Middle release' }
      ];

      const combined = rssGenerator.combineAndSortItems(commits, releases);

      expect(combined).toHaveLength(3);
      expect(combined[0].title).toBe('Newer commit'); // Most recent first
      expect(combined[1].title).toBe('Middle release');
      expect(combined[2].title).toBe('Older commit');
    });
  });

  describe('Error Handling', () => {
    test('should generate error feed when main generation fails', () => {
      const errorFeed = rssGenerator.generateErrorFeed();

      expect(errorFeed).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(errorFeed).toContain('RSS Feed Temporarily Unavailable');
      expect(errorFeed).toContain('temporarily unavailable due to network issues');
    });

    test('should provide fallback RSS URL', () => {
      const feedUrl = rssGenerator.getRSSFeedURL();

      expect(feedUrl).toBe('https://github.com/acbart/cocopilot/releases.atom');
    });
  });

  describe('Download Functionality', () => {
    test('should handle download errors gracefully', async() => {
      // Mock a failing RSS generation
      jest.spyOn(rssGenerator, 'generateFeed').mockRejectedValue(new Error('Network error'));

      const result = await rssGenerator.downloadRSSFeed();

      expect(result).toBe(false);
    });
  });

  describe('Mock API Integration', () => {
    beforeEach(() => {
      // Mock fetch globally for tests
      global.fetch = jest.fn();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('should fetch repository information successfully', async() => {
      const mockRepoData = {
        name: 'cocopilot',
        description: 'A self-updating repository'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async() => mockRepoData
      });

      const repoInfo = await rssGenerator.fetchRepositoryInfo();

      expect(fetch).toHaveBeenCalledWith('https://api.github.com/repos/acbart/cocopilot');
      expect(repoInfo).toEqual(mockRepoData);
    });

    test('should handle API fetch errors', async() => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(rssGenerator.fetchRepositoryInfo()).rejects.toThrow('Failed to fetch repository info: 404');
    });

    test('should fetch and process commits correctly', async() => {
      const mockCommits = [
        {
          sha: 'abc123',
          commit: {
            message: 'Test commit\nLonger description',
            author: {
              name: 'Test Author',
              date: '2025-09-13T12:00:00Z'
            }
          },
          html_url: 'https://github.com/acbart/cocopilot/commit/abc123'
        }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async() => mockCommits
      });

      const commits = await rssGenerator.fetchRecentCommits();

      expect(commits).toHaveLength(1);
      expect(commits[0].type).toBe('commit');
      expect(commits[0].title).toBe('Commit: Test commit');
      expect(commits[0].description).toBe('Test commit\nLonger description');
      expect(commits[0].id).toBe('abc123');
    });

    test('should handle missing releases gracefully', async() => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      const releases = await rssGenerator.fetchRecentReleases();

      expect(releases).toEqual([]);
    });
  });
});