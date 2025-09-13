/**
 * Unit tests for GitHub Activity functionality
 */

// Mock fetch for testing
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('GitHub Activity', () => {
  let GitHubActivity;

  beforeEach(() => {
    // Reset mocks
    fetch.mockClear();
    
    // Reset DOM
    document.body.innerHTML = `
      <div id="github-activity"></div>
    `;

    // Import the class
    GitHubActivity = require('../../js/github-activity.js');
  });

  describe('Initialization', () => {
    test('should create instance with correct properties', () => {
      const activity = new GitHubActivity('testowner', 'testrepo');
      
      expect(activity.owner).toBe('testowner');
      expect(activity.repo).toBe('testrepo');
      expect(activity.maxCommits).toBe(10);
      expect(activity.baseUrl).toBe('https://api.github.com/repos');
    });
  });

  describe('Commit Processing', () => {
    test('should process commits correctly', () => {
      const activity = new GitHubActivity('owner', 'repo');
      
      const mockCommits = [
        {
          sha: 'abc123def456',
          commit: {
            message: 'Fix: resolve navigation bug',
            author: {
              name: 'Test User',
              date: '2025-09-13T10:00:00Z',
              email: 'test@example.com'
            }
          },
          author: {
            avatar_url: 'https://github.com/avatar.jpg'
          },
          html_url: 'https://github.com/owner/repo/commit/abc123'
        }
      ];

      const processed = activity.processCommits(mockCommits);
      
      expect(processed).toHaveLength(1);
      expect(processed[0]).toMatchObject({
        id: 'abc123d',
        message: 'Fix: resolve navigation bug',
        author: 'Test User',
        url: 'https://github.com/owner/repo/commit/abc123',
        avatar: 'https://github.com/avatar.jpg',
        isRecent: true
      });
      expect(processed[0].date).toBeInstanceOf(Date);
      expect(processed[0].type).toMatchObject({
        icon: '🐛',
        type: 'fix',
        color: '#f85149'
      });
    });

    test('should categorize commits by type', () => {
      const activity = new GitHubActivity('owner', 'repo');
      
      const testCases = [
        { message: 'fix: bug in navigation', expected: { icon: '🐛', type: 'fix' } },
        { message: 'feat: add new feature', expected: { icon: '✨', type: 'feature' } },
        { message: 'docs: update README', expected: { icon: '📚', type: 'docs' } },
        { message: 'test: unit tests for module', expected: { icon: '🧪', type: 'test' } },
        { message: 'refactor: clean up code', expected: { icon: '♻️', type: 'refactor' } },
        { message: 'style: format code', expected: { icon: '🎨', type: 'style' } },
        { message: 'perf: optimize loading', expected: { icon: '⚡', type: 'performance' } },
        { message: 'chore: update dependencies', expected: { icon: '🔄', type: 'other' } }
      ];

      testCases.forEach(({ message, expected }) => {
        const result = activity.categorizeCommit(message);
        expect(result.icon).toBe(expected.icon);
        expect(result.type).toBe(expected.type);
        expect(result.color).toBeDefined();
      });
    });
  });

  describe('API Interaction', () => {
    test('should fetch commits successfully', async () => {
      const activity = new GitHubActivity('owner', 'repo');
      
      const mockCommits = [
        {
          sha: 'abc123',
          commit: {
            message: 'Test commit',
            author: { name: 'Test', date: '2025-09-13T10:00:00Z', email: 'test@example.com' }
          },
          author: { avatar_url: 'avatar.jpg' },
          html_url: 'commit-url'
        }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCommits)
      });

      const result = await activity.fetchRecentCommits();
      
      expect(fetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/owner/repo/commits?per_page=10'
      );
      expect(result).toHaveLength(1);
      expect(result[0].message).toBe('Test commit');
    });

    test('should handle API errors gracefully', async () => {
      const activity = new GitHubActivity('owner', 'repo');
      
      fetch.mockRejectedValue(new Error('Network error'));

      const result = await activity.fetchRecentCommits();
      
      // Should return fallback data
      expect(result).toHaveLength(1);
      expect(result[0].message).toContain('Recent activity unavailable');
      expect(result[0].type.type).toBe('offline');
    });

    test('should retry on failure', async () => {
      const activity = new GitHubActivity('owner', 'repo');
      activity.retryAttempts = 2;
      activity.retryDelay = 10; // Reduce delay for testing
      
      // First call fails, second succeeds
      fetch
        .mockRejectedValueOnce(new Error('First failure'))
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([])
        });

      const result = await activity.fetchRecentCommits();
      
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual([]);
    });

    test('should handle HTTP errors', async () => {
      const activity = new GitHubActivity('owner', 'repo');
      
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      const result = await activity.fetchRecentCommits();
      
      // Should return fallback data after retries
      expect(result[0].message).toContain('Recent activity unavailable');
    });
  });

  describe('Utility Functions', () => {
    test('should calculate time ago correctly', () => {
      const activity = new GitHubActivity('owner', 'repo');
      const now = new Date();
      
      // Test various time differences
      const testCases = [
        { diff: 0, expected: 'just now' },
        { diff: 30 * 1000, expected: 'just now' }, // 30 seconds
        { diff: 5 * 60 * 1000, expected: '5m ago' }, // 5 minutes
        { diff: 2 * 60 * 60 * 1000, expected: '2h ago' }, // 2 hours
        { diff: 3 * 24 * 60 * 60 * 1000, expected: '3d ago' }, // 3 days
      ];

      testCases.forEach(({ diff, expected }) => {
        const pastDate = new Date(now.getTime() - diff);
        const result = activity.getTimeAgo(pastDate);
        expect(result).toBe(expected);
      });
    });

    test('should truncate long messages', () => {
      const activity = new GitHubActivity('owner', 'repo');
      
      const longMessage = 'This is a very long commit message that should be truncated';
      const result = activity.truncateMessage(longMessage, 20);
      
      expect(result).toBe('This is a very lo...');
      expect(result.length).toBe(20);
    });

    test('should not truncate short messages', () => {
      const activity = new GitHubActivity('owner', 'repo');
      
      const shortMessage = 'Short message';
      const result = activity.truncateMessage(shortMessage, 20);
      
      expect(result).toBe(shortMessage);
    });
  });

  describe('DOM Rendering', () => {
    test('should render loading state initially', () => {
      const activity = new GitHubActivity('owner', 'repo');
      const container = document.getElementById('github-activity');
      
      // Mock the fetch to never resolve for this test
      fetch.mockImplementation(() => new Promise(() => {}));
      
      activity.renderActivityTimeline('github-activity');
      
      expect(container.innerHTML).toContain('Loading recent commits...');
      expect(container.innerHTML).toContain('⏳');
    });

    test('should render error state on fetch failure', () => {
      const activity = new GitHubActivity('owner', 'repo');
      const container = document.getElementById('github-activity');
      
      fetch.mockRejectedValue(new Error('Network error'));
      
      return activity.fetchRecentCommits().then(() => {
        activity.renderErrorState(container);
        
        expect(container.innerHTML).toContain('Unable to load recent activity');
        expect(container.innerHTML).toContain('⚠️');
      });
    });

    test('should handle missing container gracefully', () => {
      const activity = new GitHubActivity('owner', 'repo');
      
      // Should not throw error when container doesn't exist
      expect(() => {
        activity.renderActivityTimeline('nonexistent-container');
      }).not.toThrow();
    });
  });

  describe('Event Handling', () => {
    test('should attach click handlers to commit items', () => {
      const activity = new GitHubActivity('owner', 'repo');
      const container = document.getElementById('github-activity');
      
      // Mock window.open
      global.window.open = jest.fn();
      
      container.innerHTML = `
        <div class="commit-item" data-commit-url="https://github.com/test" tabindex="0">
          <span class="commit-message">Test commit</span>
        </div>
      `;
      
      activity.attachEventListeners(container);
      
      const commitItem = container.querySelector('.commit-item');
      
      // Test click event
      commitItem.click();
      expect(window.open).toHaveBeenCalledWith(
        'https://github.com/test',
        '_blank',
        'noopener,noreferrer'
      );
      
      // Test keyboard event
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      commitItem.dispatchEvent(enterEvent);
      
      expect(window.open).toHaveBeenCalledTimes(2);
    });
  });
});