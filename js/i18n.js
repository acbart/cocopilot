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
  },
  ja: {
    name: '日本語',
    flag: '🇯🇵',
    direction: 'ltr'
  },
  zh: {
    name: '中文',
    flag: '🇨🇳',
    direction: 'ltr'
  },
  ko: {
    name: '한국어',
    flag: '🇰🇷',
    direction: 'ltr'
  },
  pt: {
    name: 'Português',
    flag: '🇧🇷',
    direction: 'ltr'
  },
  it: {
    name: 'Italiano',
    flag: '🇮🇹',
    direction: 'ltr'
  },
  ru: {
    name: 'Русский',
    flag: '🇷🇺',
    direction: 'ltr'
  },
  ar: {
    name: 'العربية',
    flag: '🇸🇦',
    direction: 'rtl'
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
    'nav.rss': 'RSS Feed',
    'nav.github.desc': 'View the complete source code and development history',
    'nav.issues.desc': 'Browse daily improvement issues and discussions',
    'nav.rss.desc': 'Subscribe to RSS feed for repository updates',

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
    'version.2.0.0.description': 'Comprehensive testing framework and quality assurance',

    // Data Visualization
    'viz.growth.title': 'Repository Growth',
    'viz.growth.subtitle': 'Track the evolution of features and improvements over time',
    'viz.timeline.title': 'Feature Implementation Timeline',
    'viz.timeline.subtitle': 'Major milestones in CocoPilot\'s AI-driven development',
    'viz.tech.title': 'Technology Stack',
    'viz.tech.subtitle': 'Modern web technologies powering CocoPilot',
    'viz.legend.features': 'Features Added',
    'viz.legend.maturity': 'Platform Maturity'
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
    'version.2.0.0.description': 'Marco de pruebas integral y aseguramiento de calidad',

    // Data Visualization
    'viz.growth.title': 'Crecimiento del Repositorio',
    'viz.growth.subtitle': 'Seguimiento de la evolución de características y mejoras a lo largo del tiempo',
    'viz.timeline.title': 'Cronología de Implementación de Características',
    'viz.timeline.subtitle': 'Hitos principales en el desarrollo de CocoPilot impulsado por IA',
    'viz.tech.title': 'Stack Tecnológico',
    'viz.tech.subtitle': 'Tecnologías web modernas que impulsan CocoPilot',
    'viz.legend.features': 'Características Añadidas',
    'viz.legend.maturity': 'Madurez de la Plataforma'
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
    'version.2.0.0.description': 'Cadre de tests complet et assurance qualité',

    // Data Visualization
    'viz.growth.title': 'Croissance du Dépôt',
    'viz.growth.subtitle': 'Suivre l\'évolution des fonctionnalités et améliorations au fil du temps',
    'viz.timeline.title': 'Chronologie d\'Implémentation des Fonctionnalités',
    'viz.timeline.subtitle': 'Étapes majeures du développement de CocoPilot piloté par l\'IA',
    'viz.tech.title': 'Stack Technologique',
    'viz.tech.subtitle': 'Technologies web modernes alimentant CocoPilot',
    'viz.legend.features': 'Fonctionnalités Ajoutées',
    'viz.legend.maturity': 'Maturité de la Plateforme'
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
    'version.2.0.0.description': 'Umfassendes Test-Framework und Qualitätssicherung',

    // Data Visualization
    'viz.growth.title': 'Repository-Wachstum',
    'viz.growth.subtitle': 'Verfolgen Sie die Entwicklung von Funktionen und Verbesserungen im Laufe der Zeit',
    'viz.timeline.title': 'Feature-Implementierungs-Zeitstrahl',
    'viz.timeline.subtitle': 'Wichtige Meilensteine in CocoPilots KI-gesteuterter Entwicklung',
    'viz.tech.title': 'Technologie-Stack',
    'viz.tech.subtitle': 'Moderne Webtechnologien, die CocoPilot antreiben',
    'viz.legend.features': 'Hinzugefügte Funktionen',
    'viz.legend.maturity': 'Plattform-Reife'
  },

  ja: {
    // Main content
    'site.title': 'CocoPilot - 自己更新リポジトリ',
    'site.subtitle': '自己更新リポジトリ',
    'site.description': 'このリポジトリは、AI主導の日々の改善により自律的に進化します。毎日、GitHub Copilotがコードベースを分析し、このプロジェクトをより良く、より有用で、より興味深いものにするための拡張機能を提案します。',
    'status.active': 'アクティブ＆自己改善中',

    // About section
    'about.title': 'この実験について',
    'about.description': 'CocoPilotは自律的ソフトウェア進化の魅力的な実験です。このリポジトリはAIを使用して以下を通じて継続的に自己改善します：',
    'about.feature1': 'GitHub Copilotによる日次自動分析',
    'about.feature2': '自動生成された改善提案と実装',
    'about.feature3': 'ユーザーとのやり取りやフィードバックからの継続学習',
    'about.feature4': '公開イシューとPRを通じた透明な開発プロセス',
    'about.conclusion': '毎日新しい拡張機能がもたらされ、AI支援開発の生きた例を作り上げています。',

    // Features section
    'features.title': '主な機能',
    'features.updates.title': '自動更新',
    'features.updates.description': 'AI主導の日次改善',
    'features.actions.title': 'GitHub Actions',
    'features.actions.description': '自動化されたワークフロー管理',
    'features.goals.title': '集中的な目標',
    'features.goals.description': '段階的で思慮深い変更',

    // Timeline section
    'timeline.title': '進化タイムライン',
    'timeline.description': 'AI主導の改善によってCocoPilotがどのように進化したかを探る',
    'timeline.previous': '← 前へ',
    'timeline.next': '次へ →',
    'timeline.features': '主な機能：',

    // Navigation and actions
    'nav.github': 'GitHubで表示',
    'nav.issues': '日次イシューを見る',
    'nav.github.desc': '完全なソースコードと開発履歴を表示',
    'nav.issues.desc': '日次改善イシューとディスカッションを閲覧',

    // Social sharing
    'share.title': 'CocoPilotを共有',
    'share.twitter': 'Twitterで共有',
    'share.linkedin': 'LinkedInで共有',
    'share.copy': 'URLをコピー',
    'share.twitter.text': 'CocoPilotをチェック - AIを通じて進化する自己更新リポジトリ！🤖✨',

    // Footer
    'footer.powered': 'GitHub Copilotを活用',
    'footer.updated': '最終更新：',
    'footer.docs': 'ドキュメント',
    'footer.dev': '開発ガイド',
    'footer.changelog': '変更ログ',
    'footer.plans': '将来の計画',

    // Accessibility and UI
    'theme.toggle': 'ライトテーマとダークテーマを切り替え',
    'language.select': '言語を選択',
    'stats.loading': '読み込み中...',
    'stats.stars': 'スター数',
    'stats.forks': 'フォーク数',
    'stats.issues': 'オープンイシュー数',
    'stats.updates': '更新頻度',
    'stats.daily': '日次',
    'stats.unavailable': 'リポジトリ統計が利用できません（オフラインまたはネットワーク制限）',
    'stats.loaded': 'リポジトリ統計が正常に読み込まれました',

    // Timeline versions
    'version.1.0.0.title': '初回リリース',
    'version.1.0.0.description': '自己更新ワークフローを持つ基本的なリポジトリ構造',
    'version.1.1.0.title': '強化されたUIとPWA機能',
    'version.1.1.0.description': '改善されたユーザーインターフェースとプログレッシブウェブアプリ機能',
    'version.1.2.0.title': 'パフォーマンスと分析',
    'version.1.2.0.description': 'パフォーマンス監視と分析機能の追加',
    'version.2.0.0.title': 'テストインフラストラクチャ',
    'version.2.0.0.description': '包括的なテストフレームワークと品質保証',

    // Data Visualization
    'viz.growth.title': 'リポジトリの成長',
    'viz.growth.subtitle': '時間の経過に伴う機能と改善の進化を追跡',
    'viz.timeline.title': '機能実装タイムライン',
    'viz.timeline.subtitle': 'AI主導のCocoPilot開発における主要なマイルストーン',
    'viz.tech.title': 'テクノロジースタック',
    'viz.tech.subtitle': 'CocoPilotを支える現代的なウェブテクノロジー',
    'viz.legend.features': '追加された機能',
    'viz.legend.maturity': 'プラットフォームの成熟度'
  },

  zh: {
    // Main content
    'site.title': 'CocoPilot - 自动更新仓库',
    'site.subtitle': '自动更新仓库',
    'site.description': '这个仓库通过AI驱动的日常改进实现自主演化。每天，GitHub Copilot分析代码库并提出增强建议，使这个项目变得更好、更有用、更有趣。',
    'status.active': '活跃且自我改进中',

    // About section
    'about.title': '关于这个实验',
    'about.description': 'CocoPilot代表了自主软件演化的一个迷人实验。这个仓库使用AI通过以下方式持续自我改进：',
    'about.feature1': 'GitHub Copilot的日常自动分析',
    'about.feature2': '自动生成的改进建议和实现',
    'about.feature3': '从用户交互和反馈中持续学习',
    'about.feature4': '通过公开问题和PR的透明开发过程',
    'about.conclusion': '每天都会带来新的增强功能，创造了AI辅助开发的生动例子。',

    // Features section
    'features.title': '核心功能',
    'features.updates.title': '自动更新',
    'features.updates.description': 'AI驱动的日常改进',
    'features.actions.title': 'GitHub Actions',
    'features.actions.description': '自动化工作流管理',
    'features.goals.title': '专注目标',
    'features.goals.description': '渐进式、深思熟虑的变更',

    // Timeline section
    'timeline.title': '演化时间线',
    'timeline.description': '探索CocoPilot如何通过AI驱动的改进而演化',
    'timeline.previous': '← 上一个',
    'timeline.next': '下一个 →',
    'timeline.features': '核心功能：',

    // Navigation and actions
    'nav.github': '在GitHub上查看',
    'nav.issues': '查看日常问题',
    'nav.github.desc': '查看完整的源代码和开发历史',
    'nav.issues.desc': '浏览日常改进问题和讨论',

    // Social sharing
    'share.title': '分享CocoPilot',
    'share.twitter': '在Twitter上分享',
    'share.linkedin': '在LinkedIn上分享',
    'share.copy': '复制URL',
    'share.twitter.text': '查看CocoPilot - 一个通过AI演化的自动更新仓库！🤖✨',

    // Footer
    'footer.powered': '由GitHub Copilot提供支持',
    'footer.updated': '最后更新：',
    'footer.docs': '文档',
    'footer.dev': '开发指南',
    'footer.changelog': '更改日志',
    'footer.plans': '未来计划',

    // Accessibility and UI
    'theme.toggle': '在明暗主题间切换',
    'language.select': '选择语言',
    'stats.loading': '加载中...',
    'stats.stars': '星标数',
    'stats.forks': '分叉数',
    'stats.issues': '开放问题数',
    'stats.updates': '更新频率',
    'stats.daily': '每日',
    'stats.unavailable': '仓库统计不可用（离线或网络限制）',
    'stats.loaded': '仓库统计已成功加载',

    // Timeline versions
    'version.1.0.0.title': '初始发布',
    'version.1.0.0.description': '具有自动更新工作流的基本仓库结构',
    'version.1.1.0.title': '增强的UI和PWA功能',
    'version.1.1.0.description': '改进的用户界面和渐进式Web应用功能',
    'version.1.2.0.title': '性能和分析',
    'version.1.2.0.description': '添加了性能监控和分析功能',
    'version.2.0.0.title': '测试基础设施',
    'version.2.0.0.description': '全面的测试框架和质量保证',

    // Data Visualization
    'viz.growth.title': '仓库增长',
    'viz.growth.subtitle': '跟踪功能和改进随时间的演化',
    'viz.timeline.title': '功能实现时间线',
    'viz.timeline.subtitle': 'AI驱动的CocoPilot开发中的主要里程碑',
    'viz.tech.title': '技术栈',
    'viz.tech.subtitle': '驱动CocoPilot的现代Web技术',
    'viz.legend.features': '添加的功能',
    'viz.legend.maturity': '平台成熟度'
  },

  ko: {
    // Main content
    'site.title': 'CocoPilot - 자동 업데이트 저장소',
    'site.subtitle': '자동 업데이트 저장소',
    'site.description': '이 저장소는 AI 기반의 일일 개선을 통해 자율적으로 진화합니다. 매일 GitHub Copilot이 코드베이스를 분석하고 이 프로젝트를 더 좋고, 더 유용하고, 더 흥미롭게 만드는 개선사항을 제안합니다.',
    'status.active': '활성 및 자가 개선 중',

    // About section
    'about.title': '이 실험에 대하여',
    'about.description': 'CocoPilot은 자율적 소프트웨어 진화의 매혹적인 실험을 나타냅니다. 이 저장소는 다음을 통해 지속적으로 자가 개선하기 위해 AI를 사용합니다:',
    'about.feature1': 'GitHub Copilot의 일일 자동 분석',
    'about.feature2': '자동 생성된 개선 제안 및 구현',
    'about.feature3': '사용자 상호작용 및 피드백으로부터의 지속적 학습',
    'about.feature4': '공개 이슈 및 PR을 통한 투명한 개발 프로세스',
    'about.conclusion': '매일 새로운 개선사항이 제공되어 AI 지원 개발의 살아있는 예시를 만들어냅니다.',

    // Features section
    'features.title': '주요 기능',
    'features.updates.title': '자동 업데이트',
    'features.updates.description': 'AI 기반 일일 개선',
    'features.actions.title': 'GitHub Actions',
    'features.actions.description': '자동화된 워크플로우 관리',
    'features.goals.title': '집중된 목표',
    'features.goals.description': '점진적이고 신중한 변경',

    // Timeline section
    'timeline.title': '진화 타임라인',
    'timeline.description': 'AI 기반 개선을 통해 CocoPilot이 어떻게 진화했는지 탐색',
    'timeline.previous': '← 이전',
    'timeline.next': '다음 →',
    'timeline.features': '주요 기능:',

    // Navigation and actions
    'nav.github': 'GitHub에서 보기',
    'nav.issues': '일일 이슈 보기',
    'nav.github.desc': '완전한 소스 코드 및 개발 이력 보기',
    'nav.issues.desc': '일일 개선 이슈 및 토론 찾아보기',

    // Social sharing
    'share.title': 'CocoPilot 공유',
    'share.twitter': 'Twitter에서 공유',
    'share.linkedin': 'LinkedIn에서 공유',
    'share.copy': 'URL 복사',
    'share.twitter.text': 'CocoPilot을 확인해보세요 - AI를 통해 진화하는 자동 업데이트 저장소! 🤖✨',

    // Footer
    'footer.powered': 'GitHub Copilot으로 구동',
    'footer.updated': '마지막 업데이트:',
    'footer.docs': '문서',
    'footer.dev': '개발 가이드',
    'footer.changelog': '변경 로그',
    'footer.plans': '미래 계획',

    // Accessibility and UI
    'theme.toggle': '밝은 테마와 어두운 테마 전환',
    'language.select': '언어 선택',
    'stats.loading': '로딩 중...',
    'stats.stars': '스타 수',
    'stats.forks': '포크 수',
    'stats.issues': '열린 이슈 수',
    'stats.updates': '업데이트 빈도',
    'stats.daily': '일일',
    'stats.unavailable': '저장소 통계를 사용할 수 없음 (오프라인 또는 네트워크 제한)',
    'stats.loaded': '저장소 통계가 성공적으로 로드됨',

    // Timeline versions
    'version.1.0.0.title': '초기 릴리스',
    'version.1.0.0.description': '자동 업데이트 워크플로우가 있는 기본 저장소 구조',
    'version.1.1.0.title': '향상된 UI 및 PWA 기능',
    'version.1.1.0.description': '개선된 사용자 인터페이스 및 프로그레시브 웹 앱 기능',
    'version.1.2.0.title': '성능 및 분석',
    'version.1.2.0.description': '성능 모니터링 및 분석 기능 추가',
    'version.2.0.0.title': '테스트 인프라',
    'version.2.0.0.description': '포괄적인 테스트 프레임워크 및 품질 보증',

    // Data Visualization
    'viz.growth.title': '저장소 성장',
    'viz.growth.subtitle': '시간에 따른 기능 및 개선사항의 진화 추적',
    'viz.timeline.title': '기능 구현 타임라인',
    'viz.timeline.subtitle': 'AI 기반 CocoPilot 개발의 주요 이정표',
    'viz.tech.title': '기술 스택',
    'viz.tech.subtitle': 'CocoPilot을 구동하는 현대적인 웹 기술',
    'viz.legend.features': '추가된 기능',
    'viz.legend.maturity': '플랫폼 성숙도'
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
    if (existingSelector) {
      return;
    }

    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) {
      return;
    }

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

    if (!languageToggle || !languageDropdown) {
      return;
    }

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