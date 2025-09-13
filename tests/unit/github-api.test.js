/**
 * Unit tests for GitHub API integration
 */

describe('GitHub API Integration', () => {
  beforeEach(() => {
    // Setup DOM with real elements
    document.body.innerHTML = `
      <div id="stars">0</div>
      <div id="forks">0</div>
      <div id="issues">0</div>
      <div id="repoStats"></div>
    `;

    global.console.warn = jest.fn();
    global.console.log = jest.fn();
  });

  describe('fetchRepoStats', () => {
    const fetchRepoStats = async() => {
      try {
        const response = await fetch('https://api.github.com/repos/acbart/cocopilot');

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        document.getElementById('stars').textContent = data.stargazers_count || '0';
        document.getElementById('forks').textContent = data.forks_count || '0';
        document.getElementById('issues').textContent = data.open_issues_count || '0';

        const statsElement = document.getElementById('repoStats');
        statsElement.setAttribute('aria-label', 'Repository statistics loaded successfully');

      } catch (error) {
        console.warn('Could not fetch repository stats:', error);

        const fallbackValues = {
          stars: error.message.includes('ERR_BLOCKED_BY_CLIENT') ? '🔒' : '∞',
          forks: error.message.includes('ERR_BLOCKED_BY_CLIENT') ? '🔒' : '∞',
          issues: error.message.includes('ERR_BLOCKED_BY_CLIENT') ? '🔒' : '∞'
        };

        document.getElementById('stars').textContent = fallbackValues.stars;
        document.getElementById('forks').textContent = fallbackValues.forks;
        document.getElementById('issues').textContent = fallbackValues.issues;

        const statsElement = document.getElementById('repoStats');
        statsElement.setAttribute('aria-label', 'Repository statistics unavailable (offline or network restrictions)');
      }
    };

    test('should fetch and display repository stats successfully', async() => {
      const mockData = {
        stargazers_count: 42,
        forks_count: 10,
        open_issues_count: 3
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      await fetchRepoStats();

      expect(fetch).toHaveBeenCalledWith('https://api.github.com/repos/acbart/cocopilot');
      expect(document.getElementById('stars').textContent).toBe('42');
      expect(document.getElementById('forks').textContent).toBe('10');
      expect(document.getElementById('issues').textContent).toBe('3');
      expect(document.getElementById('repoStats').getAttribute('aria-label')).toBe(
        'Repository statistics loaded successfully'
      );
    });

    test('should handle missing data gracefully', async() => {
      const mockData = {}; // Empty response

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData)
      });

      await fetchRepoStats();

      expect(document.getElementById('stars').textContent).toBe('0');
      expect(document.getElementById('forks').textContent).toBe('0');
      expect(document.getElementById('issues').textContent).toBe('0');
    });

    test('should handle HTTP errors gracefully', async() => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await fetchRepoStats();

      expect(console.warn).toHaveBeenCalledWith(
        'Could not fetch repository stats:',
        expect.any(Error)
      );
      expect(document.getElementById('stars').textContent).toBe('∞');
      expect(document.getElementById('forks').textContent).toBe('∞');
      expect(document.getElementById('issues').textContent).toBe('∞');
      expect(document.getElementById('repoStats').getAttribute('aria-label')).toBe(
        'Repository statistics unavailable (offline or network restrictions)'
      );
    });

    test('should handle blocked requests specifically', async() => {
      fetch.mockRejectedValueOnce(new Error('Failed to fetch - ERR_BLOCKED_BY_CLIENT'));

      await fetchRepoStats();

      expect(document.getElementById('stars').textContent).toBe('🔒');
      expect(document.getElementById('forks').textContent).toBe('🔒');
      expect(document.getElementById('issues').textContent).toBe('🔒');
    });
  });
});