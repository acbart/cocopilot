/**
 * @jest-environment jsdom
 */

describe('Internationalization (i18n) System', () => {
  let I18nManager;
  let i18nManager;

  beforeEach(() => {
    // Reset DOM
    document.head.innerHTML = '';
    document.body.innerHTML = `
      <main>
        <h1>Hello from CocoPilot!</h1>
        <p class="subtitle">A Self-Updating Repository</p>
        <p class="description">This repository evolves autonomously through AI-driven daily improvements.</p>
        <div class="status">🟢 Active & Self-Improving</div>
        <div class="about-title">🔬 About This Experiment</div>
        <div class="about-content">
          <p>CocoPilot represents a fascinating experiment in autonomous software evolution.</p>
          <ul class="about-list">
            <li>Daily automated analysis by GitHub Copilot</li>
            <li>Self-generated improvement suggestions and implementations</li>
            <li>Continuous learning from user interactions and feedback</li>
            <li>Transparent development process through public issues and PRs</li>
          </ul>
        </div>
        <section class="features">
          <h2 id="features-heading">Key Features</h2>
        </section>
        <div class="timeline-container">
          <h3>🚀 Evolution Timeline</h3>
          <p>Explore how CocoPilot has evolved through AI-driven improvements</p>
        </div>
        <nav class="cta">
          <a href="https://github.com/acbart/cocopilot">View on GitHub</a>
          <a href="https://github.com/acbart/cocopilot/issues">See Daily Issues</a>
        </nav>
        <section class="social-share">
          <h2>Share CocoPilot</h2>
        </section>
        <footer>
          <p>Powered by GitHub Copilot • Last updated: <span>9/13/2025</span></p>
        </footer>
      </main>
    `;

    // Mock localStorage
    global.localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    };

    // Mock navigator.language
    Object.defineProperty(navigator, 'language', {
      writable: true,
      value: 'en-US'
    });

    // Clear any previous I18nManager instances
    delete global.i18n;

    // Import the class
    I18nManager = require('../../js/i18n.js');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Language Detection', () => {
    test('should detect language from localStorage if available', () => {
      localStorage.getItem.mockReturnValue('es');
      i18nManager = new I18nManager();
      expect(i18nManager.detectLanguage()).toBe('es');
    });

    test('should detect language from browser if localStorage is empty', () => {
      localStorage.getItem.mockReturnValue(null);
      Object.defineProperty(navigator, 'language', {
        writable: true,
        value: 'fr-FR'
      });
      i18nManager = new I18nManager();
      expect(i18nManager.detectLanguage()).toBe('fr');
    });

    test('should fallback to English for unsupported languages', () => {
      localStorage.getItem.mockReturnValue(null);
      Object.defineProperty(navigator, 'language', {
        writable: true,
        value: 'xy-ZZ'
      });
      i18nManager = new I18nManager();
      expect(i18nManager.detectLanguage()).toBe('en');
    });
  });

  describe('Language Switching', () => {
    beforeEach(async() => {
      i18nManager = new I18nManager();
      await i18nManager.loadTranslations();
    });

    test('should change language and update localStorage', async() => {
      await i18nManager.changeLanguage('es');
      expect(i18nManager.getCurrentLanguage()).toBe('es');
      expect(localStorage.setItem).toHaveBeenCalledWith('cocopilot-language', 'es');
    });

    test('should update HTML lang attribute when language changes', async() => {
      await i18nManager.changeLanguage('fr');
      expect(document.documentElement.lang).toBe('fr');
    });

    test('should not change language if same language is selected', async() => {
      const initialCalls = localStorage.setItem.mock.calls.length;
      await i18nManager.changeLanguage('en');
      expect(localStorage.setItem.mock.calls.length).toBe(initialCalls);
    });

    test('should dispatch languageChanged event', async() => {
      const eventSpy = jest.fn();
      document.addEventListener('languageChanged', eventSpy);

      await i18nManager.changeLanguage('de');

      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { language: 'de' }
        })
      );
    });
  });

  describe('Content Translation', () => {
    beforeEach(async() => {
      i18nManager = new I18nManager();
      await i18nManager.loadTranslations();
    });

    test('should translate page title', () => {
      i18nManager.currentLanguage = 'es';
      i18nManager.applyTranslations();
      expect(document.title).toBe('CocoPilot - Repositorio Auto-Actualizable');
    });

    test('should translate main content elements', () => {
      i18nManager.currentLanguage = 'fr';
      i18nManager.applyTranslations();

      const subtitle = document.querySelector('.subtitle');
      expect(subtitle.textContent).toBe('Un Dépôt Auto-Actualisable');

      const aboutTitle = document.querySelector('.about-title');
      expect(aboutTitle.textContent).toBe('À Propos de Cette Expérience');
    });

    test('should translate list items correctly', () => {
      i18nManager.currentLanguage = 'es';
      i18nManager.applyTranslations();

      const listItems = document.querySelectorAll('.about-list li');
      expect(listItems[0].textContent).toContain('Análisis automatizado diario por GitHub Copilot');
    });

    test('should handle missing translations gracefully', () => {
      i18nManager.currentLanguage = 'de'; // German not fully implemented
      const originalTitle = document.title;

      i18nManager.applyTranslations();

      // Should fallback to English
      expect(document.title).not.toBe(originalTitle);
    });
  });

  describe('Language Switcher UI', () => {
    beforeEach(async() => {
      i18nManager = new I18nManager();
      await i18nManager.loadTranslations();
    });

    test('should create language switcher element', () => {
      const switcher = i18nManager.createLanguageSwitcher();
      expect(switcher.id).toBe('language-switcher');
      expect(switcher.getAttribute('role')).toBe('group');
      expect(switcher.getAttribute('aria-label')).toBe('Language selection');
    });

    test('should include all supported languages in dropdown', () => {
      const switcher = i18nManager.createLanguageSwitcher();
      const options = switcher.querySelectorAll('[data-lang]');
      expect(options).toHaveLength(6);

      const languages = Array.from(options).map(option => option.dataset.lang);
      expect(languages).toEqual(['en', 'es', 'fr', 'de', 'zh', 'ja']);
    });

    test('should mark current language as selected', () => {
      i18nManager.currentLanguage = 'fr';
      const switcher = i18nManager.createLanguageSwitcher();

      const selectedOption = switcher.querySelector('[data-lang="fr"]');
      expect(selectedOption.className).toBe('selected');
    });

    test('should toggle dropdown on trigger click', () => {
      const switcher = i18nManager.createLanguageSwitcher();
      const trigger = switcher.querySelector('.language-trigger');
      const menu = switcher.querySelector('.language-menu');

      // Initial state
      expect(menu.style.display).toBe('none');
      expect(trigger.getAttribute('aria-expanded')).toBe('false');

      // Click to open
      trigger.click();
      expect(menu.style.display).toBe('block');
      expect(trigger.getAttribute('aria-expanded')).toBe('true');

      // Click to close
      trigger.click();
      expect(menu.style.display).toBe('none');
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('Translation Helper Methods', () => {
    beforeEach(async() => {
      i18nManager = new I18nManager();
      await i18nManager.loadTranslations();
    });

    test('should return translated text for valid keys', () => {
      i18nManager.currentLanguage = 'es';
      const translation = i18nManager.t('title');
      expect(translation).toBe('CocoPilot - Repositorio Auto-Actualizable');
    });

    test('should return nested translations', () => {
      i18nManager.currentLanguage = 'fr';
      const translation = i18nManager.t('features.auto_updates');
      expect(translation).toBe('Auto-Mises à Jour');
    });

    test('should return default value for missing keys', () => {
      const translation = i18nManager.t('non.existent.key', 'Default Value');
      expect(translation).toBe('Default Value');
    });

    test('should fallback to English for unsupported languages', () => {
      i18nManager.currentLanguage = 'unsupported';
      const translation = i18nManager.t('title');
      expect(translation).toBe('CocoPilot - Self-Updating Repository');
    });
  });

  describe('Accessibility', () => {
    beforeEach(async() => {
      i18nManager = new I18nManager();
      await i18nManager.loadTranslations();
    });

    test('should have proper ARIA attributes on language switcher', () => {
      const switcher = i18nManager.createLanguageSwitcher();
      const trigger = switcher.querySelector('.language-trigger');
      const menu = switcher.querySelector('.language-menu');

      expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      expect(menu.getAttribute('role')).toBe('listbox');

      const options = menu.querySelectorAll('li');
      options.forEach(option => {
        expect(option.getAttribute('role')).toBe('option');
      });
    });

    test('should close dropdown when clicking outside', () => {
      const switcher = i18nManager.createLanguageSwitcher();
      document.body.appendChild(switcher);

      const trigger = switcher.querySelector('.language-trigger');
      const menu = switcher.querySelector('.language-menu');

      // Open dropdown
      trigger.click();
      expect(menu.style.display).toBe('block');

      // Click outside
      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);
      outsideElement.click();

      expect(menu.style.display).toBe('none');
      expect(trigger.getAttribute('aria-expanded')).toBe('false');

      document.body.removeChild(switcher);
      document.body.removeChild(outsideElement);
    });
  });

  describe('Supported Languages', () => {
    test('should return correct list of supported languages', () => {
      i18nManager = new I18nManager();
      const supportedLanguages = i18nManager.getSupportedLanguages();
      expect(supportedLanguages).toEqual(['en', 'es', 'fr', 'de', 'zh', 'ja']);
    });

    test('should validate supported language correctly', () => {
      i18nManager = new I18nManager();
      expect(i18nManager.supportedLanguages.includes('en')).toBe(true);
      expect(i18nManager.supportedLanguages.includes('es')).toBe(true);
      expect(i18nManager.supportedLanguages.includes('xyz')).toBe(false);
    });
  });
});