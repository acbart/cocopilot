/**
 * Unit tests for internationalization (i18n) functionality
 */

// Mock localStorage for testing
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

// Mock navigator.language
Object.defineProperty(window.navigator, 'language', {
  writable: true,
  value: 'en-US'
});

describe('Internationalization (i18n)', () => {
  let i18nModule;

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = `
      <div class="container">
        <button class="theme-toggle">🌙</button>
        <h1 data-i18n="site.title">Hello from CocoPilot!</h1>
        <p data-i18n="site.subtitle">A Self-Updating Repository</p>
        <div data-i18n="about.title">About This Experiment</div>
        <button data-i18n-aria="language.select" data-i18n-title="language.select">Language</button>
      </div>
    `;

    // Reset localStorage mock
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();

    // Reset the global i18n instance
    global.i18nInstance = null;

    // Import i18n module fresh for each test
    jest.resetModules();
    i18nModule = require('../../js/i18n.js');
  });

  describe('Language Detection', () => {
    test('should default to English when no language is saved', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { I18n } = i18nModule;
      const i18n = new I18n();

      expect(i18n.getCurrentLanguage()).toBe('en');
    });

    test('should use saved language from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('es');

      const { I18n } = i18nModule;
      const i18n = new I18n();

      expect(i18n.getCurrentLanguage()).toBe('es');
    });

    test('should detect browser language when supported', () => {
      localStorageMock.getItem.mockReturnValue(null);
      Object.defineProperty(window.navigator, 'language', {
        writable: true,
        value: 'fr-FR'
      });

      const { I18n } = i18nModule;
      const i18n = new I18n();

      expect(i18n.getCurrentLanguage()).toBe('fr');
    });

    test('should fallback to English for unsupported languages', () => {
      localStorageMock.getItem.mockReturnValue(null);
      Object.defineProperty(window.navigator, 'language', {
        writable: true,
        value: 'zh-CN'
      });

      const { I18n } = i18nModule;
      const i18n = new I18n();

      expect(i18n.getCurrentLanguage()).toBe('en');
    });
  });

  describe('Translation Functionality', () => {
    test('should translate text correctly', () => {
      const { I18n } = i18nModule;
      const i18n = new I18n();

      expect(i18n.t('site.title')).toBe('CocoPilot - Self-Updating Repository');
      expect(i18n.t('site.subtitle')).toBe('A Self-Updating Repository');
    });

    test('should translate to Spanish correctly', () => {
      localStorageMock.getItem.mockReturnValue('es');

      const { I18n } = i18nModule;
      const i18n = new I18n();

      expect(i18n.t('site.title')).toBe('CocoPilot - Repositorio Autoactualizable');
      expect(i18n.t('site.subtitle')).toBe('Un Repositorio Autoactualizable');
    });

    test('should translate to French correctly', () => {
      localStorageMock.getItem.mockReturnValue('fr');

      const { I18n } = i18nModule;
      const i18n = new I18n();

      expect(i18n.t('site.title')).toBe('CocoPilot - Dépôt Auto-Mise à Jour');
      expect(i18n.t('site.subtitle')).toBe('Un Dépôt Auto-Mise à Jour');
    });

    test('should fallback to English for missing translations', () => {
      localStorageMock.getItem.mockReturnValue('es');

      const { I18n } = i18nModule;
      const i18n = new I18n();

      expect(i18n.t('nonexistent.key')).toBe('nonexistent.key');
    });

    test('should return key if translation not found in any language', () => {
      const { I18n } = i18nModule;
      const i18n = new I18n();

      expect(i18n.t('completely.missing.key')).toBe('completely.missing.key');
    });
  });

  describe('Language Switching', () => {
    test('should change language correctly', () => {
      const { I18n } = i18nModule;
      const i18n = new I18n();

      expect(i18n.getCurrentLanguage()).toBe('en');

      i18n.changeLanguage('es');

      expect(i18n.getCurrentLanguage()).toBe('es');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('cocopilot-language', 'es');
    });

    test('should update HTML lang attribute when changing language', () => {
      const { I18n } = i18nModule;
      const i18n = new I18n();

      i18n.changeLanguage('fr');

      expect(document.documentElement.lang).toBe('fr');
      expect(document.documentElement.dir).toBe('ltr');
    });

    test('should update page title when changing language', () => {
      const { I18n } = i18nModule;
      const i18n = new I18n();

      i18n.changeLanguage('es');

      expect(document.title).toBe('CocoPilot - Repositorio Autoactualizable');
    });

    test('should not change to unsupported language', () => {
      const { I18n } = i18nModule;
      const i18n = new I18n();

      const originalLang = i18n.getCurrentLanguage();
      i18n.changeLanguage('unsupported');

      expect(i18n.getCurrentLanguage()).toBe(originalLang);
    });
  });

  describe('DOM Element Updates', () => {
    test('should update elements with data-i18n attributes', () => {
      const { I18n } = i18nModule;
      const i18n = new I18n();

      i18n.changeLanguage('es');

      const titleElement = document.querySelector('[data-i18n="site.title"]');
      const subtitleElement = document.querySelector('[data-i18n="site.subtitle"]');

      expect(titleElement.textContent).toBe('CocoPilot - Repositorio Autoactualizable');
      expect(subtitleElement.textContent).toBe('Un Repositorio Autoactualizable');
    });

    test('should update aria-label attributes', () => {
      const { I18n } = i18nModule;
      const i18n = new I18n();

      i18n.changeLanguage('es');

      const buttonElement = document.querySelector('[data-i18n-aria="language.select"]');
      expect(buttonElement.getAttribute('aria-label')).toBe('Seleccionar idioma');
    });

    test('should update title attributes', () => {
      const { I18n } = i18nModule;
      const i18n = new I18n();

      i18n.changeLanguage('fr');

      const buttonElement = document.querySelector('[data-i18n-title="language.select"]');
      expect(buttonElement.title).toBe('Sélectionner la langue');
    });
  });

  describe('Available Languages', () => {
    test('should return correct list of available languages', () => {
      const { I18n } = i18nModule;
      const i18n = new I18n();

      const languages = i18n.getAvailableLanguages();
      expect(languages).toEqual(['en', 'es', 'fr']);
    });

    test('should have correct language configurations', () => {
      const { LANGUAGES } = i18nModule;

      expect(LANGUAGES.en.name).toBe('English');
      expect(LANGUAGES.en.flag).toBe('🇺🇸');
      expect(LANGUAGES.es.name).toBe('Español');
      expect(LANGUAGES.es.flag).toBe('🇪🇸');
      expect(LANGUAGES.fr.name).toBe('Français');
      expect(LANGUAGES.fr.flag).toBe('🇫🇷');
    });
  });

  describe('Error Handling', () => {
    test('should handle missing meta description gracefully', () => {
      // Remove meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.remove();
      }

      const { I18n } = i18nModule;
      const i18n = new I18n();

      // Should not throw error
      expect(() => i18n.changeLanguage('es')).not.toThrow();
    });

    test('should handle missing theme toggle gracefully', () => {
      // Remove theme toggle
      const themeToggle = document.querySelector('.theme-toggle');
      if (themeToggle) {
        themeToggle.remove();
      }

      const { I18n } = i18nModule;

      // Should not throw error during initialization
      expect(() => new I18n()).not.toThrow();
    });
  });
});