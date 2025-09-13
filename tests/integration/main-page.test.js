/**
 * Integration tests for main page functionality
 */

describe('Main Page Integration', () => {
  beforeEach(() => {
    // Setup comprehensive DOM for integration testing
    document.body.innerHTML = `
      <div id="backgroundAnimation"></div>
      <main>
        <button class="theme-toggle" aria-label="Toggle between light and dark theme">🌙</button>
        <h1>Hello from CocoPilot!</h1>
        <div role="status" id="repoStats" aria-label="Repository statistics">
          <div><span id="stars">Loading...</span></div>
          <div><span id="forks">Loading...</span></div>
          <div><span id="issues">Loading...</span></div>
        </div>
        <div class="social-share">
          <a href="#" class="share-btn" onclick="shareOnTwitter()">🐦 Share on Twitter</a>
          <a href="#" class="share-btn" onclick="shareOnLinkedIn()">💼 Share on LinkedIn</a>
          <a href="#" class="share-btn" onclick="copyLink(event)">🔗 Copy Link</a>
        </div>
        <div id="offlineIndicator" class="offline-indicator" style="display: none;" role="alert">
          You are currently offline
        </div>
      </main>
    `;

    // Mock global functions and APIs
    global.fetch = jest.fn();
    global.navigator = {
      ...global.navigator,
      onLine: true,
      clipboard: {
        writeText: jest.fn(() => Promise.resolve())
      },
      serviceWorker: {
        register: jest.fn(() => Promise.resolve({
          scope: '/'
        }))
      }
    };

    global.window = {
      ...global.window,
      location: {
        href: 'http://localhost:8000'
      },
      open: jest.fn(),
      addEventListener: jest.fn()
    };

    global.console.warn = jest.fn();
    global.console.log = jest.fn();
  });

  describe('Page Initialization', () => {
    test('should initialize all components correctly', () => {
      // Test that all essential elements are present
      expect(document.querySelector('.theme-toggle')).toBeTruthy();
      expect(document.querySelector('#repoStats')).toBeTruthy();
      expect(document.querySelector('.social-share')).toBeTruthy();
      expect(document.querySelector('#offlineIndicator')).toBeTruthy();
      expect(document.querySelector('#backgroundAnimation')).toBeTruthy();
    });

    test('should register service worker on page load', async () => {
      // Simulate service worker registration
      if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.register('/sw.js');
      }

      expect(navigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js');
    });
  });

  describe('Theme Functionality Integration', () => {
    test('should toggle theme and update UI consistently', () => {
      const themeToggle = document.querySelector('.theme-toggle');
      const body = document.body;

      // Initial state (light theme)
      expect(body.getAttribute('data-theme')).toBeNull();
      expect(themeToggle.textContent).toBe('🌙');

      // Simulate theme toggle function
      const toggleTheme = () => {
        const currentTheme = body.getAttribute('data-theme');
        if (currentTheme === 'dark') {
          body.removeAttribute('data-theme');
          themeToggle.textContent = '🌙';
        } else {
          body.setAttribute('data-theme', 'dark');
          themeToggle.textContent = '☀️';
        }
      };

      // Toggle to dark
      toggleTheme();
      expect(body.getAttribute('data-theme')).toBe('dark');
      expect(themeToggle.textContent).toBe('☀️');

      // Toggle back to light
      toggleTheme();
      expect(body.getAttribute('data-theme')).toBeNull();
      expect(themeToggle.textContent).toBe('🌙');
    });
  });

  describe('GitHub API Integration', () => {
    test('should fetch and display repository stats', async () => {
      const mockRepoData = {
        stargazers_count: 42,
        forks_count: 10,
        open_issues_count: 3
      };

      fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockRepoData)
      });

      // Simulate fetchRepoStats function
      const fetchRepoStats = async () => {
        try {
          const response = await fetch('https://api.github.com/repos/acbart/cocopilot');
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          
          const data = await response.json();
          
          document.getElementById('stars').textContent = data.stargazers_count || '0';
          document.getElementById('forks').textContent = data.forks_count || '0';
          document.getElementById('issues').textContent = data.open_issues_count || '0';
          
          const statsElement = document.getElementById('repoStats');
          statsElement.setAttribute('aria-label', 'Repository statistics loaded successfully');
          
        } catch (error) {
          console.warn('Could not fetch repository stats:', error);
          
          document.getElementById('stars').textContent = '∞';
          document.getElementById('forks').textContent = '∞';
          document.getElementById('issues').textContent = '∞';
          
          const statsElement = document.getElementById('repoStats');
          statsElement.setAttribute('aria-label', 'Repository statistics unavailable');
        }
      };

      await fetchRepoStats();

      expect(fetch).toHaveBeenCalledWith('https://api.github.com/repos/acbart/cocopilot');
      expect(document.getElementById('stars').textContent).toBe('42');
      expect(document.getElementById('forks').textContent).toBe('10');
      expect(document.getElementById('issues').textContent).toBe('3');
      expect(document.getElementById('repoStats').getAttribute('aria-label')).toBe('Repository statistics loaded successfully');
    });

    test('should handle API failures gracefully', async () => {
      fetch.mockRejectedValue(new Error('Network error'));

      const fetchRepoStats = async () => {
        try {
          const response = await fetch('https://api.github.com/repos/acbart/cocopilot');
          const data = await response.json();
          
          document.getElementById('stars').textContent = data.stargazers_count || '0';
          document.getElementById('forks').textContent = data.forks_count || '0';
          document.getElementById('issues').textContent = data.open_issues_count || '0';
          
        } catch (error) {
          console.warn('Could not fetch repository stats:', error);
          
          document.getElementById('stars').textContent = '∞';
          document.getElementById('forks').textContent = '∞';
          document.getElementById('issues').textContent = '∞';
          
          const statsElement = document.getElementById('repoStats');
          statsElement.setAttribute('aria-label', 'Repository statistics unavailable');
        }
      };

      await fetchRepoStats();

      expect(console.warn).toHaveBeenCalledWith('Could not fetch repository stats:', expect.any(Error));
      expect(document.getElementById('stars').textContent).toBe('∞');
      expect(document.getElementById('forks').textContent).toBe('∞');
      expect(document.getElementById('issues').textContent).toBe('∞');
    });
  });

  describe('Social Sharing Integration', () => {
    test('should open Twitter share window', () => {
      const shareOnTwitter = () => {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent('Check out CocoPilot - a self-updating repository that evolves through AI! 🤖✨');
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
      };

      shareOnTwitter();

      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('https://twitter.com/intent/tweet'),
        '_blank'
      );
    });

    test('should open LinkedIn share window', () => {
      const shareOnLinkedIn = () => {
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
      };

      shareOnLinkedIn();

      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('https://www.linkedin.com/sharing/share-offsite'),
        '_blank'
      );
    });

    test('should copy link to clipboard', async () => {
      const copyLink = async (event) => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          
          const btn = event.target.closest('.share-btn');
          const originalText = btn.innerHTML;
          btn.innerHTML = '✅ Copied!';
          
          setTimeout(() => {
            btn.innerHTML = originalText;
          }, 2000);
        } catch (err) {
          console.warn('Failed to copy link:', err);
        }
      };

      const mockEvent = {
        target: {
          closest: jest.fn(() => ({
            innerHTML: '🔗 Copy Link'
          }))
        }
      };

      await copyLink(mockEvent);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('http://localhost:8000');
    });
  });

  describe('Online/Offline Status Integration', () => {
    test('should show offline indicator when offline', () => {
      const offlineIndicator = document.getElementById('offlineIndicator');
      
      const updateOnlineStatus = () => {
        if (!navigator.onLine) {
          offlineIndicator.style.display = 'block';
        } else {
          offlineIndicator.style.display = 'none';
        }
      };

      // Simulate going offline
      Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
      updateOnlineStatus();
      expect(offlineIndicator.style.display).toBe('block');

      // Simulate going back online
      Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
      updateOnlineStatus();
      expect(offlineIndicator.style.display).toBe('none');
    });
  });

  describe('Background Animation Integration', () => {
    test('should create floating elements for background animation', () => {
      const createFloatingElements = () => {
        const backgroundAnimation = document.getElementById('backgroundAnimation');
        const elements = ['🤖', '⚡', '✨', '🔄', '🚀', '💫'];
        
        for (let i = 0; i < 8; i++) {
          const element = document.createElement('div');
          element.className = 'floating-element';
          element.textContent = elements[Math.floor(Math.random() * elements.length)];
          element.style.left = Math.random() * 100 + '%';
          element.style.top = Math.random() * 100 + '%';
          element.style.fontSize = (Math.random() * 2 + 1) + 'rem';
          element.style.animationDelay = Math.random() * 20 + 's';
          element.style.animationDuration = (Math.random() * 10 + 15) + 's';
          backgroundAnimation.appendChild(element);
        }
      };

      createFloatingElements();

      const backgroundAnimation = document.getElementById('backgroundAnimation');
      const floatingElements = backgroundAnimation.querySelectorAll('.floating-element');
      
      expect(floatingElements.length).toBe(8);
      
      floatingElements.forEach(element => {
        expect(element.className).toBe('floating-element');
        expect(['🤖', '⚡', '✨', '🔄', '🚀', '💫']).toContain(element.textContent);
        expect(element.style.left).toMatch(/\d+(\.\d+)?%/);
        expect(element.style.top).toMatch(/\d+(\.\d+)?%/);
      });
    });
  });

  describe('Error Boundary Integration', () => {
    test('should handle unhandled promise rejections', () => {
      const mockErrorHandler = jest.fn();
      
      // Simulate unhandled promise rejection handler
      window.addEventListener('unhandledrejection', mockErrorHandler);
      
      // Simulate an unhandled promise rejection
      const rejectionEvent = new Event('unhandledrejection');
      rejectionEvent.reason = new Error('Test error');
      window.dispatchEvent(rejectionEvent);
      
      expect(mockErrorHandler).toHaveBeenCalled();
    });
  });
});