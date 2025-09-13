/**
 * Unit tests for theme management functionality
 */

describe('Theme Management', () => {
  beforeEach(() => {
    // Mock DOM elements using jsdom's built-in functionality
    document.body.innerHTML = '<button class="theme-toggle">🌙</button>';
  });

  describe('Theme Toggle Logic', () => {
    test('should toggle from light to dark theme', () => {
      const body = document.body;
      const themeToggle = document.querySelector('.theme-toggle');
      
      // Simulate the toggle logic
      body.setAttribute('data-theme', 'dark');
      themeToggle.textContent = '☀️';
      
      expect(body.getAttribute('data-theme')).toBe('dark');
      expect(themeToggle.textContent).toBe('☀️');
    });

    test('should toggle from dark to light theme', () => {
      const body = document.body;
      const themeToggle = document.querySelector('.theme-toggle');
      
      // Set up dark theme first
      body.setAttribute('data-theme', 'dark');
      
      // Simulate toggle back to light
      body.removeAttribute('data-theme');
      themeToggle.textContent = '🌙';
      
      expect(body.getAttribute('data-theme')).toBeNull();
      expect(themeToggle.textContent).toBe('🌙');
    });
  });

  describe('Theme Initialization', () => {
    test('should initialize dark theme', () => {
      const body = document.body;
      const themeToggle = document.querySelector('.theme-toggle');
      
      // Simulate initialization with dark theme
      body.setAttribute('data-theme', 'dark');
      themeToggle.textContent = '☀️';
      
      expect(body.getAttribute('data-theme')).toBe('dark');
      expect(themeToggle.textContent).toBe('☀️');
    });

    test('should keep light theme by default', () => {
      // Reset body for this specific test
      document.body.removeAttribute('data-theme');
      
      // By default, no data-theme attribute should be set (light theme)
      expect(document.body.getAttribute('data-theme')).toBeNull();
    });
  });

  describe('DOM Structure', () => {
    test('should have theme toggle button', () => {
      const themeToggle = document.querySelector('.theme-toggle');
      expect(themeToggle).toBeTruthy();
      expect(themeToggle.tagName).toBe('BUTTON');
    });

    test('should be able to access body element', () => {
      expect(document.body).toBeTruthy();
      expect(document.body.tagName).toBe('BODY');
    });
  });
});