/**
 * Internationalization (i18n) Support for CocoPilot
 * Provides multi-language support for global accessibility
 */

class I18nManager {
  constructor() {
    this.currentLanguage = 'en';
    this.translations = {};
    this.supportedLanguages = ['en', 'es', 'fr', 'de', 'zh', 'ja'];
    this.fallbackLanguage = 'en';
    this.init();
  }

  async init() {
    // Detect user's preferred language
    this.currentLanguage = this.detectLanguage();

    // Load translations
    await this.loadTranslations();

    // Apply translations to the page
    this.applyTranslations();

    // Set up language switcher
    this.setupLanguageSwitcher();
  }

  detectLanguage() {
    // Check localStorage for saved preference
    const savedLang = localStorage.getItem('cocopilot-language');
    if (savedLang && this.supportedLanguages.includes(savedLang)) {
      return savedLang;
    }

    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    if (this.supportedLanguages.includes(browserLang)) {
      return browserLang;
    }

    return this.fallbackLanguage;
  }

  async loadTranslations() {
    // In a real implementation, these would be loaded from separate JSON files
    // For now, we'll include them inline for simplicity
    this.translations = {
      en: {
        title: 'CocoPilot - Self-Updating Repository',
        subtitle: 'A Self-Updating Repository',
        description: 'This repository evolves autonomously through AI-driven daily improvements. Every day, GitHub Copilot analyzes the codebase and proposes enhancements to make this project better, more useful, and more interesting.',
        status: 'Active & Self-Improving',
        about_title: 'About This Experiment',
        about_description: 'CocoPilot represents a fascinating experiment in autonomous software evolution. This repository uses AI to continuously improve itself through:',
        about_features: [
          'Daily automated analysis by GitHub Copilot',
          'Self-generated improvement suggestions and implementations',
          'Continuous learning from user interactions and feedback',
          'Transparent development process through public issues and PRs'
        ],
        features_title: 'Key Features',
        features: {
          auto_updates: 'Auto-Updates',
          auto_updates_desc: 'Daily AI-driven improvements',
          github_actions: 'GitHub Actions',
          github_actions_desc: 'Automated workflow management',
          focused_goals: 'Focused Goals',
          focused_goals_desc: 'Incremental, thoughtful changes'
        },
        timeline_title: 'Evolution Timeline',
        timeline_desc: 'Explore how CocoPilot has evolved through AI-driven improvements',
        actions: {
          view_github: 'View on GitHub',
          view_issues: 'See Daily Issues',
          view_github_desc: 'View the complete source code and development history',
          view_issues_desc: 'Browse daily improvement issues and discussions'
        },
        share_title: 'Share CocoPilot',
        share_twitter: 'Share on Twitter',
        share_linkedin: 'Share on LinkedIn',
        share_copy: 'Copy Link',
        footer_text: 'Powered by GitHub Copilot • Last updated:',
        footer_links: {
          documentation: 'Documentation',
          development_guide: 'Development Guide',
          changelog: 'Changelog',
          future_plans: 'Future Plans'
        }
      },
      es: {
        title: 'CocoPilot - Repositorio Auto-Actualizable',
        subtitle: 'Un Repositorio Auto-Actualizable',
        description: 'Este repositorio evoluciona de forma autónoma a través de mejoras diarias impulsadas por IA. Todos los días, GitHub Copilot analiza la base de código y propone mejoras para hacer este proyecto mejor, más útil y más interesante.',
        status: 'Activo y Auto-Mejorable',
        about_title: 'Sobre Este Experimento',
        about_description: 'CocoPilot representa un experimento fascinante en evolución autónoma de software. Este repositorio usa IA para mejorar continuamente a través de:',
        about_features: [
          'Análisis automatizado diario por GitHub Copilot',
          'Sugerencias de mejora auto-generadas e implementaciones',
          'Aprendizaje continuo de interacciones y comentarios de usuarios',
          'Proceso de desarrollo transparente a través de issues y PRs públicos'
        ],
        features_title: 'Características Principales',
        features: {
          auto_updates: 'Auto-Actualizaciones',
          auto_updates_desc: 'Mejoras diarias impulsadas por IA',
          github_actions: 'GitHub Actions',
          github_actions_desc: 'Gestión automatizada de flujos de trabajo',
          focused_goals: 'Objetivos Enfocados',
          focused_goals_desc: 'Cambios incrementales y reflexivos'
        },
        timeline_title: 'Línea de Tiempo de Evolución',
        timeline_desc: 'Explora cómo CocoPilot ha evolucionado a través de mejoras impulsadas por IA',
        actions: {
          view_github: 'Ver en GitHub',
          view_issues: 'Ver Issues Diarios',
          view_github_desc: 'Ver el código fuente completo e historial de desarrollo',
          view_issues_desc: 'Explorar issues de mejoras diarias y discusiones'
        },
        share_title: 'Compartir CocoPilot',
        share_twitter: 'Compartir en Twitter',
        share_linkedin: 'Compartir en LinkedIn',
        share_copy: 'Copiar Enlace',
        footer_text: 'Impulsado por GitHub Copilot • Última actualización:',
        footer_links: {
          documentation: 'Documentación',
          development_guide: 'Guía de Desarrollo',
          changelog: 'Registro de Cambios',
          future_plans: 'Planes Futuros'
        }
      },
      fr: {
        title: 'CocoPilot - Dépôt Auto-Actualisable',
        subtitle: 'Un Dépôt Auto-Actualisable',
        description: 'Ce dépôt évolue de manière autonome grâce à des améliorations quotidiennes pilotées par l\'IA. Chaque jour, GitHub Copilot analyse la base de code et propose des améliorations pour rendre ce projet meilleur, plus utile et plus intéressant.',
        status: 'Actif et Auto-Améliorable',
        about_title: 'À Propos de Cette Expérience',
        about_description: 'CocoPilot représente une expérience fascinante d\'évolution logicielle autonome. Ce dépôt utilise l\'IA pour s\'améliorer continuellement à travers:',
        about_features: [
          'Analyse automatisée quotidienne par GitHub Copilot',
          'Suggestions d\'amélioration auto-générées et implémentations',
          'Apprentissage continu des interactions et commentaires des utilisateurs',
          'Processus de développement transparent via des issues et PRs publiques'
        ],
        features_title: 'Fonctionnalités Clés',
        features: {
          auto_updates: 'Auto-Mises à Jour',
          auto_updates_desc: 'Améliorations quotidiennes pilotées par l\'IA',
          github_actions: 'GitHub Actions',
          github_actions_desc: 'Gestion automatisée des flux de travail',
          focused_goals: 'Objectifs Ciblés',
          focused_goals_desc: 'Changements incrémentaux et réfléchis'
        },
        timeline_title: 'Chronologie d\'Évolution',
        timeline_desc: 'Explorez comment CocoPilot a évolué grâce aux améliorations pilotées par l\'IA',
        actions: {
          view_github: 'Voir sur GitHub',
          view_issues: 'Voir les Issues Quotidiennes',
          view_github_desc: 'Voir le code source complet et l\'historique de développement',
          view_issues_desc: 'Parcourir les issues d\'amélioration quotidiennes et les discussions'
        },
        share_title: 'Partager CocoPilot',
        share_twitter: 'Partager sur Twitter',
        share_linkedin: 'Partager sur LinkedIn',
        share_copy: 'Copier le Lien',
        footer_text: 'Propulsé par GitHub Copilot • Dernière mise à jour:',
        footer_links: {
          documentation: 'Documentation',
          development_guide: 'Guide de Développement',
          changelog: 'Journal des Modifications',
          future_plans: 'Plans Futurs'
        }
      }
    };
  }

  applyTranslations() {
    const t = this.translations[this.currentLanguage] || this.translations[this.fallbackLanguage];

    // Update page title
    document.title = t.title;

    // Update meta descriptions
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.content = t.description;
    }

    // Update main content
    this.updateElement('h1', t.title.split(' - ')[0]);
    this.updateElement('.subtitle', t.subtitle);
    this.updateElement('.description', t.description);
    this.updateElement('.status', t.status);
    this.updateElement('.about-title', t.about_title);

    // Update about section
    const aboutContent = document.querySelector('.about-content');
    if (aboutContent) {
      const p = aboutContent.querySelector('p');
      if (p) {
        p.textContent = t.about_description;
      }

      const listItems = aboutContent.querySelectorAll('li');
      listItems.forEach((item, index) => {
        if (t.about_features[index]) {
          item.textContent = `✨ ${t.about_features[index]}`;
        }
      });
    }

    // Update features section
    this.updateElement('#features-heading', t.features_title);

    // Update timeline
    this.updateElement('h3', t.timeline_title);
    const timelineDesc = document.querySelector('.timeline-container p');
    if (timelineDesc) {
      timelineDesc.textContent = t.timeline_desc;
    }

    // Update action buttons
    const githubLink = document.querySelector('a[href*="github.com/acbart/cocopilot"]');
    if (githubLink && !githubLink.href.includes('/issues')) {
      githubLink.textContent = t.actions.view_github;
    }

    const issuesLink = document.querySelector('a[href*="/issues"]');
    if (issuesLink) {
      issuesLink.textContent = t.actions.view_issues;
    }

    // Update share section
    this.updateElement('h2', t.share_title, 1); // Second h2 is share title

    // Update footer
    const footerText = document.querySelector('footer p');
    if (footerText) {
      const dateSpan = footerText.querySelector('span');
      const dateText = dateSpan ? dateSpan.textContent : '';
      footerText.innerHTML = `${t.footer_text} <span>${dateText}</span>`;
    }
  }

  updateElement(selector, text, index = 0) {
    const elements = document.querySelectorAll(selector);
    if (elements[index]) {
      elements[index].textContent = text;
    }
  }

  setupLanguageSwitcher() {
    // Create language switcher if it doesn't exist
    let langSwitcher = document.getElementById('language-switcher');
    if (!langSwitcher) {
      langSwitcher = this.createLanguageSwitcher();
    }

    // Update the current language indicator
    this.updateLanguageSwitcher(langSwitcher);
  }

  createLanguageSwitcher() {
    const switcher = document.createElement('div');
    switcher.id = 'language-switcher';
    switcher.className = 'language-switcher';
    switcher.setAttribute('role', 'group');
    switcher.setAttribute('aria-label', 'Language selection');

    const languageNames = {
      en: 'English',
      es: 'Español',
      fr: 'Français',
      de: 'Deutsch',
      zh: '中文',
      ja: '日本語'
    };

    // Create dropdown structure
    const dropdown = document.createElement('div');
    dropdown.className = 'language-dropdown';

    const trigger = document.createElement('button');
    trigger.className = 'language-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML = `
      <span class="current-lang">${languageNames[this.currentLanguage]}</span>
      <span class="dropdown-arrow">▼</span>
    `;

    const menu = document.createElement('ul');
    menu.className = 'language-menu';
    menu.setAttribute('role', 'listbox');
    menu.style.display = 'none';

    this.supportedLanguages.forEach(lang => {
      const item = document.createElement('li');
      item.setAttribute('role', 'option');
      item.setAttribute('data-lang', lang);
      item.className = lang === this.currentLanguage ? 'selected' : '';
      item.textContent = languageNames[lang];
      item.addEventListener('click', () => this.changeLanguage(lang));
      menu.appendChild(item);
    });

    // Toggle dropdown
    trigger.addEventListener('click', () => {
      const isOpen = menu.style.display !== 'none';
      menu.style.display = isOpen ? 'none' : 'block';
      trigger.setAttribute('aria-expanded', !isOpen);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!switcher.contains(e.target)) {
        menu.style.display = 'none';
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    dropdown.appendChild(trigger);
    dropdown.appendChild(menu);
    switcher.appendChild(dropdown);

    // Add to page (near theme toggle)
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle && themeToggle.parentNode) {
      themeToggle.parentNode.insertBefore(switcher, themeToggle);
    }

    return switcher;
  }

  updateLanguageSwitcher(switcher) {
    const currentLangSpan = switcher.querySelector('.current-lang');
    const menuItems = switcher.querySelectorAll('[data-lang]');

    const languageNames = {
      en: 'English',
      es: 'Español',
      fr: 'Français',
      de: 'Deutsch',
      zh: '中文',
      ja: '日本語'
    };

    if (currentLangSpan) {
      currentLangSpan.textContent = languageNames[this.currentLanguage];
    }

    menuItems.forEach(item => {
      item.className = item.dataset.lang === this.currentLanguage ? 'selected' : '';
    });
  }

  async changeLanguage(lang) {
    if (lang === this.currentLanguage) {
      return;
    }

    this.currentLanguage = lang;
    localStorage.setItem('cocopilot-language', lang);

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Reapply translations
    this.applyTranslations();

    // Update language switcher
    const switcher = document.getElementById('language-switcher');
    if (switcher) {
      this.updateLanguageSwitcher(switcher);

      // Close dropdown
      const menu = switcher.querySelector('.language-menu');
      const trigger = switcher.querySelector('.language-trigger');
      if (menu && trigger) {
        menu.style.display = 'none';
        trigger.setAttribute('aria-expanded', 'false');
      }
    }

    // Trigger custom event for other components
    document.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { language: lang }
    }));
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  t(key, defaultValue = '') {
    const t = this.translations[this.currentLanguage] || this.translations[this.fallbackLanguage];
    return this.getNestedValue(t, key) || defaultValue;
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}

// Initialize i18n when DOM is ready
if (typeof window !== 'undefined') {
  let i18nManager;

  document.addEventListener('DOMContentLoaded', async() => {
    i18nManager = new I18nManager();
    window.i18n = i18nManager;
  });
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = I18nManager;
}