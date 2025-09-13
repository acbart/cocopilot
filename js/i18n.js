/**
 * Internationalization (i18n) module for CocoPilot
 * Provides multi-language support with dynamic language switching
 */

// Supported languages and their configurations
const LANGUAGES = {
  en: {
    name: 'English',
    flag: '🇺🇸',
    direction: 'ltr'
  },
  es: {
    name: 'Español',
    flag: '🇪🇸',
    direction: 'ltr'
  },
  fr: {
    name: 'Français',
    flag: '🇫🇷',
    direction: 'ltr'
  },
  de: {
    name: 'Deutsch',
    flag: '🇩🇪',
    direction: 'ltr'
  }
};

// Translation strings
const TRANSLATIONS = {
  en: {
    // Main content
    'site.title': 'CocoPilot - Self-Updating Repository',
    'site.subtitle': 'A Self-Updating Repository',
    'site.description': 'This repository evolves autonomously through AI-driven daily improvements. Every day, GitHub Copilot analyzes the codebase and proposes enhancements to make this project better, more useful, and more interesting.',
    'status.active': 'Active & Self-Improving',
    
    // About section
    'about.title': 'About This Experiment',
    'about.description': 'CocoPilot represents a fascinating experiment in autonomous software evolution. This repository uses AI to continuously improve itself through:',
    'about.feature1': 'Daily automated analysis by GitHub Copilot',
    'about.feature2': 'Self-generated improvement suggestions and implementations',
    'about.feature3': 'Continuous learning from user interactions and feedback',
    'about.feature4': 'Transparent development process through public issues and PRs',
    'about.conclusion': 'Each day brings new enhancements, creating a living example of AI-assisted development in action.',
    
    // Features section
    'features.title': 'Key Features',
    'features.updates.title': 'Auto-Updates',
    'features.updates.description': 'Daily AI-driven improvements',
    'features.actions.title': 'GitHub Actions',
    'features.actions.description': 'Automated workflow management',
    'features.goals.title': 'Focused Goals',
    'features.goals.description': 'Incremental, thoughtful changes',
    
    // Timeline section
    'timeline.title': 'Evolution Timeline',
    'timeline.description': 'Explore how CocoPilot has evolved through AI-driven improvements',
    'timeline.previous': '← Previous',
    'timeline.next': 'Next →',
    'timeline.features': 'Key Features:',
    
    // Navigation and actions
    'nav.github': 'View on GitHub',
    'nav.issues': 'See Daily Issues',
    'nav.github.desc': 'View the complete source code and development history',
    'nav.issues.desc': 'Browse daily improvement issues and discussions',
    
    // Social sharing
    'share.title': 'Share CocoPilot',
    'share.twitter': 'Share on Twitter',
    'share.linkedin': 'Share on LinkedIn',
    'share.copy': 'Copy URL',
    'share.twitter.text': 'Check out CocoPilot - a self-updating repository that evolves through AI! 🤖✨',
    
    // Footer
    'footer.powered': 'Powered by GitHub Copilot',
    'footer.updated': 'Last updated:',
    'footer.docs': 'Documentation',
    'footer.dev': 'Development Guide',
    'footer.changelog': 'Changelog',
    'footer.plans': 'Future Plans',
    
    // Accessibility and UI
    'theme.toggle': 'Toggle between light and dark theme',
    'language.select': 'Select language',
    'stats.loading': 'Loading...',
    'stats.stars': 'Star count',
    'stats.forks': 'Fork count', 
    'stats.issues': 'Open issues count',
    'stats.updates': 'Update frequency',
    'stats.daily': 'Daily',
    'stats.unavailable': 'Repository statistics unavailable (offline or network restrictions)',
    'stats.loaded': 'Repository statistics loaded successfully',
    
    // Timeline versions
    'version.1.0.0.title': 'Initial Release',
    'version.1.0.0.description': 'Basic repository structure with self-updating workflow',
    'version.1.1.0.title': 'Enhanced UI & PWA Features',
    'version.1.1.0.description': 'Improved user interface and Progressive Web App capabilities',
    'version.1.2.0.title': 'Performance & Analytics',
    'version.1.2.0.description': 'Added performance monitoring and analytics features',
    'version.2.0.0.title': 'Testing Infrastructure',
    'version.2.0.0.description': 'Comprehensive testing framework and quality assurance'
  },
  
  es: {
    // Main content
    'site.title': 'CocoPilot - Repositorio Autoactualizable',
    'site.subtitle': 'Un Repositorio Autoactualizable',
    'site.description': 'Este repositorio evoluciona autónomamente a través de mejoras diarias impulsadas por IA. Cada día, GitHub Copilot analiza el código base y propone mejoras para hacer este proyecto mejor, más útil y más interesante.',
    'status.active': 'Activo y Automejorándose',
    
    // About section
    'about.title': 'Acerca de Este Experimento',
    'about.description': 'CocoPilot representa un experimento fascinante en evolución autónoma de software. Este repositorio usa IA para mejorarse continuamente a través de:',
    'about.feature1': 'Análisis automatizado diario por GitHub Copilot',
    'about.feature2': 'Sugerencias e implementaciones de mejoras autogeneradas',
    'about.feature3': 'Aprendizaje continuo de interacciones y comentarios de usuarios',
    'about.feature4': 'Proceso de desarrollo transparente a través de issues y PRs públicos',
    'about.conclusion': 'Cada día trae nuevas mejoras, creando un ejemplo vivo de desarrollo asistido por IA en acción.',
    
    // Features section
    'features.title': 'Características Principales',
    'features.updates.title': 'Auto-Actualizaciones',
    'features.updates.description': 'Mejoras diarias impulsadas por IA',
    'features.actions.title': 'GitHub Actions',
    'features.actions.description': 'Gestión automatizada de flujos de trabajo',
    'features.goals.title': 'Objetivos Enfocados',
    'features.goals.description': 'Cambios incrementales y reflexivos',
    
    // Timeline section
    'timeline.title': 'Cronología de Evolución',
    'timeline.description': 'Explora cómo CocoPilot ha evolucionado a través de mejoras impulsadas por IA',
    'timeline.previous': '← Anterior',
    'timeline.next': 'Siguiente →',
    'timeline.features': 'Características Principales:',
    
    // Navigation and actions
    'nav.github': 'Ver en GitHub',
    'nav.issues': 'Ver Issues Diarios',
    'nav.github.desc': 'Ver el código fuente completo e historial de desarrollo',
    'nav.issues.desc': 'Explorar issues de mejoras diarias y discusiones',
    
    // Social sharing
    'share.title': 'Compartir CocoPilot',
    'share.twitter': 'Compartir en Twitter',
    'share.linkedin': 'Compartir en LinkedIn',
    'share.copy': 'Copiar URL',
    'share.twitter.text': '¡Echa un vistazo a CocoPilot - un repositorio autoactualizable que evoluciona a través de IA! 🤖✨',
    
    // Footer
    'footer.powered': 'Desarrollado por GitHub Copilot',
    'footer.updated': 'Última actualización:',
    'footer.docs': 'Documentación',
    'footer.dev': 'Guía de Desarrollo',
    'footer.changelog': 'Registro de Cambios',
    'footer.plans': 'Planes Futuros',
    
    // Accessibility and UI
    'theme.toggle': 'Alternar entre tema claro y oscuro',
    'language.select': 'Seleccionar idioma',
    'stats.loading': 'Cargando...',
    'stats.stars': 'Número de estrellas',
    'stats.forks': 'Número de forks',
    'stats.issues': 'Número de issues abiertos',
    'stats.updates': 'Frecuencia de actualización',
    'stats.daily': 'Diaria',
    'stats.unavailable': 'Estadísticas del repositorio no disponibles (sin conexión o restricciones de red)',
    'stats.loaded': 'Estadísticas del repositorio cargadas exitosamente',
    
    // Timeline versions
    'version.1.0.0.title': 'Lanzamiento Inicial',
    'version.1.0.0.description': 'Estructura básica del repositorio con flujo de trabajo autoactualizable',
    'version.1.1.0.title': 'UI Mejorada y Características PWA',
    'version.1.1.0.description': 'Interfaz de usuario mejorada y capacidades de Aplicación Web Progresiva',
    'version.1.2.0.title': 'Rendimiento y Análisis',
    'version.1.2.0.description': 'Monitoreo de rendimiento y características de análisis añadidas',
    'version.2.0.0.title': 'Infraestructura de Pruebas',
    'version.2.0.0.description': 'Marco de pruebas integral y aseguramiento de calidad'
  },
  
  fr: {
    // Main content
    'site.title': 'CocoPilot - Dépôt Auto-Mise à Jour',
    'site.subtitle': 'Un Dépôt Auto-Mise à Jour',
    'site.description': 'Ce dépôt évolue de manière autonome grâce à des améliorations quotidiennes pilotées par l\'IA. Chaque jour, GitHub Copilot analyse la base de code et propose des améliorations pour rendre ce projet meilleur, plus utile et plus intéressant.',
    'status.active': 'Actif et Auto-Amélioration',
    
    // About section
    'about.title': 'À Propos de Cette Expérience',
    'about.description': 'CocoPilot représente une expérience fascinante d\'évolution logicielle autonome. Ce dépôt utilise l\'IA pour s\'améliorer continuellement grâce à :',
    'about.feature1': 'Analyse automatisée quotidienne par GitHub Copilot',
    'about.feature2': 'Suggestions et implémentations d\'améliorations auto-générées',
    'about.feature3': 'Apprentissage continu des interactions et commentaires des utilisateurs',
    'about.feature4': 'Processus de développement transparent via les issues et PRs publiques',
    'about.conclusion': 'Chaque jour apporte de nouvelles améliorations, créant un exemple vivant de développement assisté par IA en action.',
    
    // Features section
    'features.title': 'Fonctionnalités Clés',
    'features.updates.title': 'Auto-Mises à Jour',
    'features.updates.description': 'Améliorations quotidiennes pilotées par l\'IA',
    'features.actions.title': 'GitHub Actions',
    'features.actions.description': 'Gestion automatisée des flux de travail',
    'features.goals.title': 'Objectifs Ciblés',
    'features.goals.description': 'Changements incrémentaux et réfléchis',
    
    // Timeline section
    'timeline.title': 'Chronologie d\'Évolution',
    'timeline.description': 'Explorez comment CocoPilot a évolué grâce aux améliorations pilotées par l\'IA',
    'timeline.previous': '← Précédent',
    'timeline.next': 'Suivant →',
    'timeline.features': 'Fonctionnalités Clés :',
    
    // Navigation and actions
    'nav.github': 'Voir sur GitHub',
    'nav.issues': 'Voir les Issues Quotidiennes',
    'nav.github.desc': 'Voir le code source complet et l\'historique de développement',
    'nav.issues.desc': 'Parcourir les issues d\'amélioration quotidiennes et les discussions',
    
    // Social sharing
    'share.title': 'Partager CocoPilot',
    'share.twitter': 'Partager sur Twitter',
    'share.linkedin': 'Partager sur LinkedIn',
    'share.copy': 'Copier l\'URL',
    'share.twitter.text': 'Découvrez CocoPilot - un dépôt auto-mise à jour qui évolue grâce à l\'IA ! 🤖✨',
    
    // Footer
    'footer.powered': 'Alimenté par GitHub Copilot',
    'footer.updated': 'Dernière mise à jour :',
    'footer.docs': 'Documentation',
    'footer.dev': 'Guide de Développement',
    'footer.changelog': 'Journal des Modifications',
    'footer.plans': 'Plans Futurs',
    
    // Accessibility and UI
    'theme.toggle': 'Basculer entre le thème clair et sombre',
    'language.select': 'Sélectionner la langue',
    'stats.loading': 'Chargement...',
    'stats.stars': 'Nombre d\'étoiles',
    'stats.forks': 'Nombre de forks',
    'stats.issues': 'Nombre d\'issues ouvertes',
    'stats.updates': 'Fréquence de mise à jour',
    'stats.daily': 'Quotidienne',
    'stats.unavailable': 'Statistiques du dépôt indisponibles (hors ligne ou restrictions réseau)',
    'stats.loaded': 'Statistiques du dépôt chargées avec succès',
    
    // Timeline versions
    'version.1.0.0.title': 'Version Initiale',
    'version.1.0.0.description': 'Structure de base du dépôt avec flux de travail auto-mise à jour',
    'version.1.1.0.title': 'UI Améliorée et Fonctionnalités PWA',
    'version.1.1.0.description': 'Interface utilisateur améliorée et capacités d\'Application Web Progressive',
    'version.1.2.0.title': 'Performance et Analytique',
    'version.1.2.0.description': 'Surveillance des performances et fonctionnalités analytiques ajoutées',
    'version.2.0.0.title': 'Infrastructure de Tests',
    'version.2.0.0.description': 'Cadre de tests complet et assurance qualité'
  },
  
  de: {
    // Main content
    'site.title': 'CocoPilot - Selbstaktualisierendes Repository',
    'site.subtitle': 'Ein Selbstaktualisierendes Repository',
    'site.description': 'Dieses Repository entwickelt sich autonom durch KI-gesteuerte tägliche Verbesserungen. Jeden Tag analysiert GitHub Copilot die Codebasis und schlägt Verbesserungen vor, um dieses Projekt besser, nützlicher und interessanter zu machen.',
    'status.active': 'Aktiv & Selbstverbessernd',
    
    // About section
    'about.title': 'Über Dieses Experiment',
    'about.description': 'CocoPilot stellt ein faszinierendes Experiment zur autonomen Software-Evolution dar. Dieses Repository nutzt KI, um sich kontinuierlich zu verbessern durch:',
    'about.feature1': 'Tägliche automatisierte Analyse durch GitHub Copilot',
    'about.feature2': 'Selbstgenerierte Verbesserungsvorschläge und -implementierungen',
    'about.feature3': 'Kontinuierliches Lernen aus Benutzerinteraktionen und Feedback',
    'about.feature4': 'Transparenter Entwicklungsprozess durch öffentliche Issues und PRs',
    'about.conclusion': 'Jeder Tag bringt neue Verbesserungen und schafft ein lebendiges Beispiel für KI-unterstützte Entwicklung in Aktion.',
    
    // Features section
    'features.title': 'Hauptfunktionen',
    'features.updates.title': 'Auto-Updates',
    'features.updates.description': 'Tägliche KI-gesteuerte Verbesserungen',
    'features.actions.title': 'GitHub Actions',
    'features.actions.description': 'Automatisierte Workflow-Verwaltung',
    'features.goals.title': 'Fokussierte Ziele',
    'features.goals.description': 'Schrittweise, durchdachte Änderungen',
    
    // Timeline section
    'timeline.title': 'Entwicklungs-Zeitstrahl',
    'timeline.description': 'Erkunden Sie, wie CocoPilot durch KI-gesteuerte Verbesserungen entwickelt hat',
    'timeline.previous': '← Vorherige',
    'timeline.next': 'Nächste →',
    'timeline.features': 'Hauptfunktionen:',
    
    // Navigation and actions
    'nav.github': 'Auf GitHub anzeigen',
    'nav.issues': 'Tägliche Issues anzeigen',
    'nav.github.desc': 'Den vollständigen Quellcode und die Entwicklungsgeschichte anzeigen',
    'nav.issues.desc': 'Tägliche Verbesserungs-Issues und Diskussionen durchsuchen',
    
    // Social sharing
    'share.title': 'CocoPilot Teilen',
    'share.twitter': 'Auf Twitter teilen',
    'share.linkedin': 'Auf LinkedIn teilen',
    'share.copy': 'URL kopieren',
    'share.twitter.text': 'Schauen Sie sich CocoPilot an - ein selbstaktualisierendes Repository, das sich durch KI entwickelt! 🤖✨',
    
    // Footer
    'footer.powered': 'Angetrieben von GitHub Copilot',
    'footer.updated': 'Zuletzt aktualisiert:',
    'footer.docs': 'Dokumentation',
    'footer.dev': 'Entwicklungsleitfaden',
    'footer.changelog': 'Änderungsprotokoll',
    'footer.plans': 'Zukunftspläne',
    
    // Accessibility and UI
    'theme.toggle': 'Zwischen hellem und dunklem Theme wechseln',
    'language.select': 'Sprache auswählen',
    'stats.loading': 'Wird geladen...',
    'stats.stars': 'Anzahl der Sterne',
    'stats.forks': 'Anzahl der Forks',
    'stats.issues': 'Anzahl offener Issues',
    'stats.updates': 'Update-Häufigkeit',
    'stats.daily': 'Täglich',
    'stats.unavailable': 'Repository-Statistiken nicht verfügbar (offline oder Netzwerkbeschränkungen)',
    'stats.loaded': 'Repository-Statistiken erfolgreich geladen',
    
    // Timeline versions
    'version.1.0.0.title': 'Erste Version',
    'version.1.0.0.description': 'Grundlegende Repository-Struktur mit selbstaktualisierendem Workflow',
    'version.1.1.0.title': 'Verbesserte UI & PWA-Funktionen',
    'version.1.1.0.description': 'Verbesserte Benutzeroberfläche und Progressive Web App-Funktionen',
    'version.1.2.0.title': 'Leistung & Analytik',
    'version.1.2.0.description': 'Leistungsüberwachung und Analytics-Funktionen hinzugefügt',
    'version.2.0.0.title': 'Test-Infrastruktur',
    'version.2.0.0.description': 'Umfassendes Test-Framework und Qualitätssicherung'
  }
};

class I18n {
  constructor() {
    this.currentLanguage = this.detectLanguage();
    this.initializeLanguageSelector();
    // Don't call loadLanguage here as detectLanguage already sets the current language
    this.updateTranslatableElements();
    this.updateLanguageSelector();
    
    // Update page metadata
    document.title = this.t('site.title');
    document.documentElement.lang = this.currentLanguage;
    document.documentElement.dir = LANGUAGES[this.currentLanguage].direction;
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.content = this.t('site.description');
    }
  }

  detectLanguage() {
    // Check localStorage first
    const saved = localStorage.getItem('cocopilot-language');
    if (saved && LANGUAGES[saved]) {
      return saved;
    }
    
    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    if (LANGUAGES[browserLang]) {
      return browserLang;
    }
    
    // Default to English
    return 'en';
  }

  initializeLanguageSelector() {
    // Create language selector if it doesn't exist
    const existingSelector = document.getElementById('language-selector');
    if (existingSelector) return;

    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    const languageSelector = document.createElement('div');
    languageSelector.className = 'language-selector';
    languageSelector.id = 'language-selector';
    languageSelector.innerHTML = `
      <button class="language-toggle" aria-label="${this.t('language.select')}" title="${this.t('language.select')}">
        <span class="language-flag">${LANGUAGES[this.currentLanguage].flag}</span>
        <span class="language-code">${this.currentLanguage.toUpperCase()}</span>
      </button>
      <div class="language-dropdown" hidden>
        ${Object.entries(LANGUAGES).map(([code, config]) => `
          <button class="language-option" data-lang="${code}">
            <span class="language-flag">${config.flag}</span>
            <span class="language-name">${config.name}</span>
          </button>
        `).join('')}
      </div>
    `;

    // Insert after theme toggle
    themeToggle.parentNode.insertBefore(languageSelector, themeToggle.nextSibling);

    this.setupLanguageEvents();
  }

  setupLanguageEvents() {
    const languageToggle = document.querySelector('.language-toggle');
    const languageDropdown = document.querySelector('.language-dropdown');
    const languageOptions = document.querySelectorAll('.language-option');

    if (!languageToggle || !languageDropdown) return;

    // Toggle dropdown
    languageToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = languageDropdown.hidden;
      languageDropdown.hidden = !isHidden;
      languageToggle.setAttribute('aria-expanded', !isHidden);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      languageDropdown.hidden = true;
      languageToggle.setAttribute('aria-expanded', 'false');
    });

    // Handle language selection
    languageOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.preventDefault();
        const newLang = option.dataset.lang;
        if (newLang !== this.currentLanguage) {
          this.changeLanguage(newLang);
        }
        languageDropdown.hidden = true;
        languageToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Keyboard navigation
    languageToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        languageToggle.click();
      }
    });
  }

  loadLanguage(lang) {
    this.currentLanguage = lang;
    localStorage.setItem('cocopilot-language', lang);
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    document.documentElement.dir = LANGUAGES[lang].direction;
    
    // Update page title
    document.title = this.t('site.title');
    
    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.content = this.t('site.description');
    }
    
    this.updateTranslatableElements();
    this.updateLanguageSelector();
  }

  changeLanguage(lang) {
    if (LANGUAGES[lang]) {
      this.loadLanguage(lang);
      
      // Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language: lang, direction: LANGUAGES[lang].direction }
      }));
    }
  }

  updateTranslatableElements() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.dataset.i18n;
      const translation = this.t(key);
      
      if (translation) {
        if (element.tagName === 'INPUT' && element.type === 'text') {
          element.placeholder = translation;
        } else {
          element.textContent = translation;
        }
      }
    });

    // Update elements with data-i18n-aria attribute
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
      const key = element.dataset.i18nAria;
      const translation = this.t(key);
      
      if (translation) {
        element.setAttribute('aria-label', translation);
      }
    });

    // Update elements with data-i18n-title attribute
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.dataset.i18nTitle;
      const translation = this.t(key);
      
      if (translation) {
        element.title = translation;
      }
    });
  }

  updateLanguageSelector() {
    const languageFlag = document.querySelector('.language-flag');
    const languageCode = document.querySelector('.language-code');
    const languageToggle = document.querySelector('.language-toggle');
    
    if (languageFlag) {
      languageFlag.textContent = LANGUAGES[this.currentLanguage].flag;
    }
    
    if (languageCode) {
      languageCode.textContent = this.currentLanguage.toUpperCase();
    }
    
    if (languageToggle) {
      languageToggle.setAttribute('aria-label', this.t('language.select'));
      languageToggle.title = this.t('language.select');
    }
  }

  t(key, params = {}) {
    const translation = TRANSLATIONS[this.currentLanguage]?.[key] || TRANSLATIONS.en[key] || key;
    
    // Simple parameter substitution
    return Object.keys(params).reduce((text, param) => {
      return text.replace(new RegExp(`{{${param}}}`, 'g'), params[param]);
    }, translation);
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  getAvailableLanguages() {
    return Object.keys(LANGUAGES);
  }
}

// Initialize i18n when DOM is ready
let i18nInstance = null;

function initializeI18n() {
  if (!i18nInstance) {
    i18nInstance = new I18n();
  }
  return i18nInstance;
}

// Auto-initialize if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeI18n);
} else {
  initializeI18n();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { I18n, LANGUAGES, TRANSLATIONS };
}