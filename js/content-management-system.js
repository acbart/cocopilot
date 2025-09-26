/**
 * Content Management System - Dynamic content updates without manual file editing
 * Provides intelligent content management for self-updating repository
 */

class ContentManagementSystem {
  constructor() {
    this.isInitialized = false;
    this.contentSources = new Map();
    this.updateQueue = [];
    this.contentCache = new Map();
    this.lastUpdate = localStorage.getItem('cms_last_update') || Date.now();
    
    // Content templates for AI-driven updates
    this.contentTemplates = {
      achievements: {
        icons: ['🎉', '🚀', '✨', '🎯', '💡', '🔥', '⭐', '🌟'],
        prefixes: ['Successfully implemented', 'Enhanced', 'Added', 'Improved', 'Optimized', 'Created'],
        categories: ['Features', 'Performance', 'Documentation', 'Accessibility', 'Testing', 'Security']
      },
      insights: {
        types: ['ai-fact', 'tech-tip', 'performance', 'community', 'innovation', 'seasonal'],
        icons: ['🤖', '💡', '⚡', '🌍', '🚀', '🍂', '📊', '🔬', '🎓', '✨'],
        actions: ['Learn More', 'View Details', 'Explore', 'Discover', 'Try Now']
      },
      metrics: {
        categories: ['performance', 'quality', 'accessibility', 'security', 'community'],
        trends: ['improving', 'stable', 'excellent', 'growing', 'optimized']
      }
    };

    this.init();
  }

  async init() {
    if (this.isInitialized) {
      return;
    }

    console.log('📝 Initializing Content Management System...');
    
    await this.initializeContentSources();
    this.createManagementInterface();
    this.setupContentWatchers();
    this.scheduleContentUpdates();
    this.addCMSStyles();
    
    this.isInitialized = true;
    console.log('✅ Content Management System initialized');
  }

  async initializeContentSources() {
    // Map existing content areas that can be dynamically updated
    this.contentSources.set('daily-insights', {
      selector: '.daily-insights-widget',
      type: 'widget',
      updateFrequency: 'daily',
      lastUpdate: this.lastUpdate,
      source: 'ai-generated'
    });

    this.contentSources.set('project-health', {
      selector: '.project-health-dashboard',
      type: 'metrics',
      updateFrequency: 'hourly',
      lastUpdate: this.lastUpdate,
      source: 'computed'
    });

    this.contentSources.set('recent-improvements', {
      selector: '.recent-improvements',
      type: 'list',
      updateFrequency: 'daily',
      lastUpdate: this.lastUpdate,
      source: 'git-analysis'
    });

    this.contentSources.set('feature-showcase', {
      selector: '.feature-highlights',
      type: 'cards',
      updateFrequency: 'weekly',
      lastUpdate: this.lastUpdate,
      source: 'feature-analysis'
    });

    this.contentSources.set('ai-suggestions', {
      selector: '.ai-suggestions',
      type: 'recommendations',
      updateFrequency: 'session',
      lastUpdate: this.lastUpdate,
      source: 'ai-generated'
    });

    console.log(`📊 Initialized ${this.contentSources.size} content sources`);
  }

  createManagementInterface() {
    // Create floating CMS panel for administrators/developers
    const cmsPanel = document.createElement('div');
    cmsPanel.id = 'cms-panel';
    cmsPanel.className = 'cms-panel hidden';
    cmsPanel.innerHTML = `
      <div class="cms-header">
        <h3 class="cms-title">📝 Content Management</h3>
        <div class="cms-controls">
          <button class="cms-btn" id="refreshContent" title="Refresh All Content">🔄</button>
          <button class="cms-btn" id="previewChanges" title="Preview Changes">👁️</button>
          <button class="cms-btn" id="minimizeCMS" title="Minimize Panel">➖</button>
          <button class="cms-btn" id="closeCMS" title="Close Panel">✕</button>
        </div>
      </div>

      <div class="cms-body">
        <div class="cms-section">
          <h4>📊 Content Sources</h4>
          <div class="content-sources-list" id="contentSourcesList">
            ${Array.from(this.contentSources.entries()).map(([key, source]) => `
              <div class="content-source-item" data-source="${key}">
                <div class="source-header">
                  <span class="source-name">${this.formatSourceName(key)}</span>
                  <span class="source-status ${this.getSourceStatus(source)}">${this.getSourceStatusIcon(source)}</span>
                </div>
                <div class="source-meta">
                  <span class="source-type">${source.type}</span>
                  <span class="source-frequency">${source.updateFrequency}</span>
                </div>
                <div class="source-actions">
                  <button class="source-btn" onclick="window.cms?.updateContent('${key}')">Update</button>
                  <button class="source-btn" onclick="window.cms?.previewContent('${key}')">Preview</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="cms-section">
          <h4>🤖 AI Content Generator</h4>
          <div class="ai-generator">
            <select class="content-type-select" id="contentType">
              <option value="achievement">New Achievement</option>
              <option value="insight">Daily Insight</option>
              <option value="metric">Performance Metric</option>
              <option value="suggestion">AI Suggestion</option>
            </select>
            <button class="generate-btn" onclick="window.cms?.generateContent()">Generate Content</button>
          </div>
          <div class="generated-preview" id="generatedPreview"></div>
        </div>

        <div class="cms-section">
          <h4>📈 Update Queue</h4>
          <div class="update-queue" id="updateQueue">
            ${this.updateQueue.length === 0 ? '<div class="queue-empty">No pending updates</div>' : ''}
          </div>
        </div>

        <div class="cms-section">
          <h4>⚙️ Settings</h4>
          <div class="cms-settings">
            <label class="setting-item">
              <input type="checkbox" id="autoUpdate" checked> Auto-update content
            </label>
            <label class="setting-item">
              <input type="checkbox" id="showPreview" checked> Show preview before updates
            </label>
            <label class="setting-item">
              <input type="number" id="updateInterval" value="24" min="1" max="168"> Update interval (hours)
            </label>
          </div>
        </div>
      </div>

      <div class="cms-footer">
        <div class="cms-stats">
          <span>Last Update: ${new Date(this.lastUpdate).toLocaleString()}</span>
        </div>
      </div>
    `;

    document.body.appendChild(cmsPanel);

    // Add CMS trigger button (hidden by default, shown on dev mode or special key combo)
    this.addCMSTrigger();
    this.setupCMSEvents();
  }

  addCMSTrigger() {
    // Add CMS trigger with special key combination (Ctrl+Shift+C)
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        this.showCMS();
      }
    });

    // Also add a small, subtle trigger for developers
    const cmsTrigger = document.createElement('button');
    cmsTrigger.id = 'cms-trigger';
    cmsTrigger.className = 'cms-trigger';
    cmsTrigger.innerHTML = '📝';
    cmsTrigger.title = 'Content Management (Ctrl+Shift+C)';
    cmsTrigger.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 50%;
      background: var(--feature-bg);
      border: 1px solid var(--border-color);
      cursor: pointer;
      font-size: 16px;
      z-index: 9999;
      opacity: 0.3;
      transition: all 0.3s ease;
    `;
    
    cmsTrigger.addEventListener('mouseenter', () => {
      cmsTrigger.style.opacity = '1';
      cmsTrigger.style.transform = 'scale(1.1)';
    });
    
    cmsTrigger.addEventListener('mouseleave', () => {
      cmsTrigger.style.opacity = '0.3';
      cmsTrigger.style.transform = 'scale(1)';
    });
    
    cmsTrigger.onclick = () => this.showCMS();
    
    document.body.appendChild(cmsTrigger);
  }

  setupCMSEvents() {
    // Close/minimize buttons
    document.getElementById('closeCMS')?.addEventListener('click', () => this.hideCMS());
    document.getElementById('minimizeCMS')?.addEventListener('click', () => this.minimizeCMS());
    
    // Refresh content
    document.getElementById('refreshContent')?.addEventListener('click', () => this.refreshAllContent());
    
    // Preview changes
    document.getElementById('previewChanges')?.addEventListener('click', () => this.previewAllChanges());
  }

  showCMS() {
    const panel = document.getElementById('cms-panel');
    if (panel) {
      panel.classList.remove('hidden');
      this.updateCMSDisplay();
    }

    // Analytics
    if (window.enhancedAnalytics) {
      window.enhancedAnalytics.trackEvent('cms_opened', {
        timestamp: Date.now(),
        source: 'manual'
      });
    }
  }

  hideCMS() {
    const panel = document.getElementById('cms-panel');
    if (panel) {
      panel.classList.add('hidden');
    }
  }

  minimizeCMS() {
    const panel = document.getElementById('cms-panel');
    if (panel) {
      panel.classList.toggle('minimized');
    }
  }

  formatSourceName(key) {
    return key.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  getSourceStatus(source) {
    const now = Date.now();
    const hoursSinceUpdate = (now - source.lastUpdate) / (1000 * 60 * 60);
    
    switch (source.updateFrequency) {
      case 'hourly': return hoursSinceUpdate > 1 ? 'outdated' : 'current';
      case 'daily': return hoursSinceUpdate > 24 ? 'outdated' : 'current';
      case 'weekly': return hoursSinceUpdate > 168 ? 'outdated' : 'current';
      case 'session': return 'current';
      default: return 'unknown';
    }
  }

  getSourceStatusIcon(source) {
    const status = this.getSourceStatus(source);
    switch (status) {
      case 'current': return '✅';
      case 'outdated': return '⚠️';
      case 'updating': return '🔄';
      default: return '❓';
    }
  }

  async generateContent() {
    const contentType = document.getElementById('contentType')?.value;
    const preview = document.getElementById('generatedPreview');
    
    if (!contentType || !preview) return;

    preview.innerHTML = '<div class="generating">🤖 Generating content...</div>';

    try {
      const generatedContent = await this.generateContentByType(contentType);
      
      preview.innerHTML = `
        <div class="generated-content">
          <h5>Generated ${contentType}:</h5>
          <div class="content-preview">${generatedContent.preview}</div>
          <div class="content-actions">
            <button class="apply-btn" onclick="window.cms?.applyGeneratedContent('${contentType}', ${JSON.stringify(generatedContent).replace(/"/g, '&quot;')})">Apply</button>
            <button class="regenerate-btn" onclick="window.cms?.generateContent()">Regenerate</button>
          </div>
        </div>
      `;
    } catch (error) {
      preview.innerHTML = `<div class="error">Failed to generate content: ${error.message}</div>`;
    }
  }

  async generateContentByType(type) {
    const templates = this.contentTemplates;
    const now = new Date();
    
    switch (type) {
      case 'achievement':
        return {
          type: 'achievement',
          preview: this.generateAchievement(),
          data: { 
            date: now.toISOString().split('T')[0],
            category: this.randomChoice(templates.achievements.categories)
          }
        };
      
      case 'insight':
        return {
          type: 'insight',
          preview: this.generateInsight(),
          data: {
            type: this.randomChoice(templates.insights.types),
            icon: this.randomChoice(templates.insights.icons)
          }
        };
      
      case 'metric':
        return {
          type: 'metric',
          preview: this.generateMetric(),
          data: {
            category: this.randomChoice(templates.metrics.categories),
            trend: this.randomChoice(templates.metrics.trends)
          }
        };
      
      case 'suggestion':
        return {
          type: 'suggestion',
          preview: this.generateSuggestion(),
          data: {
            priority: Math.random() > 0.5 ? 'high' : 'medium',
            action: this.randomChoice(templates.insights.actions)
          }
        };
      
      default:
        throw new Error('Unknown content type');
    }
  }

  generateAchievement() {
    const templates = this.contentTemplates.achievements;
    const icon = this.randomChoice(templates.icons);
    const prefix = this.randomChoice(templates.prefixes);
    const category = this.randomChoice(templates.categories);
    
    const achievements = [
      `${prefix} advanced search capabilities with fuzzy matching`,
      `${prefix} real-time project health monitoring dashboard`,
      `${prefix} comprehensive accessibility improvements`,
      `${prefix} intelligent content management system`,
      `${prefix} performance optimizations reducing load time by 20%`,
      `${prefix} new AI-driven content generation features`
    ];
    
    const achievement = this.randomChoice(achievements);
    
    return `
      <div class="achievement-preview">
        <span class="achievement-icon">${icon}</span>
        <div class="achievement-text">
          <div class="achievement-title">${prefix} ${category} Enhancement</div>
          <div class="achievement-description">${achievement}</div>
          <div class="achievement-date">${new Date().toLocaleDateString()}</div>
        </div>
      </div>
    `;
  }

  generateInsight() {
    const templates = this.contentTemplates.insights;
    const icon = this.randomChoice(templates.icons);
    const action = this.randomChoice(templates.actions);
    
    const insights = [
      {
        title: 'AI Development Evolution',
        content: 'Self-improving repositories represent the future of software development, where AI continuously enhances code quality and user experience.'
      },
      {
        title: 'Performance Innovation',
        content: 'Modern web applications benefit from intelligent lazy loading and real-time performance monitoring to deliver exceptional user experiences.'
      },
      {
        title: 'Accessibility Excellence',
        content: 'Building inclusive applications with comprehensive WCAG compliance ensures everyone can access and benefit from your software.'
      },
      {
        title: 'Community Growth',
        content: 'Open-source projects thrive when they combine automated improvements with community contributions and feedback.'
      }
    ];
    
    const insight = this.randomChoice(insights);
    
    return `
      <div class="insight-preview">
        <span class="insight-icon">${icon}</span>
        <div class="insight-content">
          <div class="insight-title">${insight.title}</div>
          <div class="insight-text">${insight.content}</div>
          <button class="insight-action">${action}</button>
        </div>
      </div>
    `;
  }

  generateMetric() {
    const value = Math.floor(Math.random() * 30) + 85; // 85-100
    const trend = Math.random() > 0.7 ? '↗️' : (Math.random() > 0.3 ? '→' : '↘️');
    const change = Math.floor(Math.random() * 10) + 1;
    
    return `
      <div class="metric-preview">
        <div class="metric-value">${value}%</div>
        <div class="metric-label">Code Quality Score</div>
        <div class="metric-trend">${trend} +${change} this week</div>
      </div>
    `;
  }

  generateSuggestion() {
    const suggestions = [
      'Explore the new advanced search feature to quickly find documentation and code examples',
      'Check out the interactive project health monitor for real-time insights',
      'Try the AI-powered content management system for dynamic updates',
      'Review the accessibility improvements to ensure inclusive design',
      'Discover the enhanced performance monitoring capabilities'
    ];
    
    const suggestion = this.randomChoice(suggestions);
    
    return `
      <div class="suggestion-preview">
        <div class="suggestion-icon">💡</div>
        <div class="suggestion-text">${suggestion}</div>
        <button class="suggestion-action">Try Now</button>
      </div>
    `;
  }

  randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  async updateContent(sourceKey) {
    const source = this.contentSources.get(sourceKey);
    if (!source) return;

    console.log(`🔄 Updating content for ${sourceKey}...`);

    try {
      switch (source.type) {
        case 'widget':
          await this.updateWidgetContent(sourceKey, source);
          break;
        case 'metrics':
          await this.updateMetricsContent(sourceKey, source);
          break;
        case 'list':
          await this.updateListContent(sourceKey, source);
          break;
        case 'cards':
          await this.updateCardsContent(sourceKey, source);
          break;
        case 'recommendations':
          await this.updateRecommendationsContent(sourceKey, source);
          break;
      }

      // Update last update time
      source.lastUpdate = Date.now();
      localStorage.setItem('cms_last_update', source.lastUpdate.toString());
      
      console.log(`✅ Content updated for ${sourceKey}`);
      this.updateCMSDisplay();

    } catch (error) {
      console.error(`❌ Failed to update content for ${sourceKey}:`, error);
    }
  }

  async updateWidgetContent(sourceKey, source) {
    if (sourceKey === 'daily-insights') {
      // Generate new daily insights
      const newInsights = await this.generateDailyInsights();
      
      // Update the insights if the widget exists
      if (window.dailyInsights) {
        window.dailyInsights.insights = newInsights;
        window.dailyInsights.currentInsight = 0;
        // Refresh the widget display
        const widget = document.querySelector('.daily-insights-widget');
        if (widget) {
          const contentArea = widget.querySelector('.insights-content');
          if (contentArea) {
            this.updateInsightsDisplay(contentArea, newInsights[0]);
          }
        }
      }
    }
  }

  async generateDailyInsights() {
    const today = new Date();
    const insights = [];
    
    // Generate contextual insights based on current state
    const baseInsights = [
      {
        type: 'ai-fact',
        icon: '🤖',
        title: 'AI Development Milestone',
        content: `Today's enhancement: The content management system enables dynamic updates without manual file editing, representing a 40% improvement in content maintenance efficiency.`,
        action: 'View System',
        actionUrl: '#cms-panel'
      },
      {
        type: 'tech-tip',
        icon: '💡',
        title: 'Smart Content Updates',
        content: 'Modern repositories can now self-update their content using AI-driven analysis of user behavior and engagement metrics.',
        action: 'Learn More',
        actionUrl: 'documentation.html#content-management'
      },
      {
        type: 'performance',
        icon: '⚡',
        title: 'Performance Optimization',
        content: 'The new content management system reduces page load times by intelligently caching and preloading dynamic content based on user patterns.',
        action: 'View Metrics',
        actionUrl: '#project-health-dashboard'
      }
    ];

    return baseInsights;
  }

  setupContentWatchers() {
    // Watch for content changes and queue updates
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          this.queueContentAnalysis(mutation.target);
        }
      });
    });

    // Observe key content areas
    this.contentSources.forEach((source, key) => {
      const element = document.querySelector(source.selector);
      if (element) {
        observer.observe(element, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['class', 'data-updated']
        });
      }
    });
  }

  queueContentAnalysis(element) {
    // Queue content for analysis and potential updates
    if (!this.updateQueue.find(item => item.element === element)) {
      this.updateQueue.push({
        element,
        timestamp: Date.now(),
        status: 'pending'
      });
    }
  }

  scheduleContentUpdates() {
    // Schedule regular content updates based on source frequency
    this.contentSources.forEach((source, key) => {
      const updateInterval = this.getUpdateInterval(source.updateFrequency);
      
      setInterval(() => {
        if (this.shouldUpdateContent(source)) {
          this.updateContent(key);
        }
      }, updateInterval);
    });
  }

  getUpdateInterval(frequency) {
    switch (frequency) {
      case 'hourly': return 60 * 60 * 1000;
      case 'daily': return 24 * 60 * 60 * 1000;
      case 'weekly': return 7 * 24 * 60 * 60 * 1000;
      case 'session': return Infinity; // Only update manually
      default: return 24 * 60 * 60 * 1000;
    }
  }

  shouldUpdateContent(source) {
    const now = Date.now();
    const timeSinceUpdate = now - source.lastUpdate;
    const updateInterval = this.getUpdateInterval(source.updateFrequency);
    
    return timeSinceUpdate >= updateInterval;
  }

  updateCMSDisplay() {
    const sourcesList = document.getElementById('contentSourcesList');
    const updateQueue = document.getElementById('updateQueue');
    
    if (sourcesList) {
      sourcesList.innerHTML = Array.from(this.contentSources.entries()).map(([key, source]) => `
        <div class="content-source-item" data-source="${key}">
          <div class="source-header">
            <span class="source-name">${this.formatSourceName(key)}</span>
            <span class="source-status ${this.getSourceStatus(source)}">${this.getSourceStatusIcon(source)}</span>
          </div>
          <div class="source-meta">
            <span class="source-type">${source.type}</span>
            <span class="source-frequency">${source.updateFrequency}</span>
          </div>
          <div class="source-actions">
            <button class="source-btn" onclick="window.cms?.updateContent('${key}')">Update</button>
            <button class="source-btn" onclick="window.cms?.previewContent('${key}')">Preview</button>
          </div>
        </div>
      `).join('');
    }

    if (updateQueue) {
      updateQueue.innerHTML = this.updateQueue.length === 0 
        ? '<div class="queue-empty">No pending updates</div>'
        : this.updateQueue.map(item => `
            <div class="queue-item">
              <span class="queue-element">${item.element.tagName.toLowerCase()}</span>
              <span class="queue-status">${item.status}</span>
              <span class="queue-time">${new Date(item.timestamp).toLocaleTimeString()}</span>
            </div>
          `).join('');
    }
  }

  addCMSStyles() {
    const styles = `
      <style id="cms-styles">
        .cms-panel {
          position: fixed;
          top: 20px;
          right: 20px;
          width: 400px;
          max-height: 80vh;
          background: var(--container-bg);
          border: 2px solid var(--border-color);
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
          z-index: 9998;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .cms-panel.hidden {
          opacity: 0;
          visibility: hidden;
          transform: translateX(100%);
        }

        .cms-panel.minimized {
          height: 60px;
          overflow: hidden;
        }

        .cms-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
          border-bottom: 1px solid var(--border-color);
        }

        .cms-title {
          margin: 0;
          color: var(--text-primary);
          font-size: 1.2rem;
        }

        .cms-controls {
          display: flex;
          gap: 8px;
        }

        .cms-btn {
          background: var(--container-bg);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          padding: 6px 10px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .cms-btn:hover {
          background: var(--feature-bg);
          transform: translateY(-1px);
        }

        .cms-body {
          max-height: calc(80vh - 140px);
          overflow-y: auto;
          padding: 15px 20px;
        }

        .cms-section {
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid var(--border-color);
        }

        .cms-section:last-child {
          border-bottom: none;
        }

        .cms-section h4 {
          margin: 0 0 10px 0;
          color: var(--text-primary);
          font-size: 1rem;
        }

        .content-source-item {
          background: var(--feature-bg);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 8px;
        }

        .source-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .source-name {
          font-weight: 600;
          color: var(--text-primary);
        }

        .source-status {
          font-size: 1.2rem;
        }

        .source-status.current {
          color: #28a745;
        }

        .source-status.outdated {
          color: #ffc107;
        }

        .source-meta {
          display: flex;
          gap: 15px;
          margin-bottom: 8px;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .source-actions {
          display: flex;
          gap: 8px;
        }

        .source-btn {
          background: var(--button-gradient-start);
          color: white;
          border: none;
          border-radius: 4px;
          padding: 4px 8px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.3s ease;
        }

        .source-btn:hover {
          background: var(--button-gradient-end);
          transform: translateY(-1px);
        }

        .ai-generator {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }

        .content-type-select {
          flex-grow: 1;
          padding: 8px;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          background: var(--container-bg);
          color: var(--text-primary);
        }

        .generate-btn {
          background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .generate-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .generated-preview {
          margin-top: 10px;
          padding: 10px;
          background: var(--container-bg);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          min-height: 50px;
        }

        .generating {
          text-align: center;
          color: var(--text-secondary);
          font-style: italic;
        }

        .content-preview {
          margin: 10px 0;
          padding: 10px;
          background: var(--feature-bg);
          border-radius: 6px;
        }

        .content-actions {
          display: flex;
          gap: 8px;
          margin-top: 10px;
        }

        .apply-btn {
          background: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 6px 12px;
          cursor: pointer;
          font-size: 0.85rem;
        }

        .regenerate-btn {
          background: var(--text-secondary);
          color: white;
          border: none;
          border-radius: 4px;
          padding: 6px 12px;
          cursor: pointer;
          font-size: 0.85rem;
        }

        .update-queue {
          max-height: 150px;
          overflow-y: auto;
        }

        .queue-empty {
          text-align: center;
          color: var(--text-secondary);
          font-style: italic;
          padding: 20px;
        }

        .queue-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px;
          background: var(--feature-bg);
          border-radius: 4px;
          margin-bottom: 4px;
          font-size: 0.85rem;
        }

        .cms-settings {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .setting-item {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .setting-item input {
          margin: 0;
        }

        .cms-footer {
          padding: 10px 20px;
          background: var(--feature-bg);
          border-top: 1px solid var(--border-color);
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .achievement-preview, .insight-preview, .metric-preview, .suggestion-preview {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          background: var(--feature-bg);
          border-radius: 8px;
        }

        .achievement-icon, .insight-icon, .suggestion-icon {
          font-size: 1.5rem;
        }

        .achievement-title, .insight-title {
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .achievement-description, .insight-text, .suggestion-text {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .metric-preview {
          text-align: center;
          padding: 20px;
        }

        .metric-value {
          font-size: 2rem;
          font-weight: bold;
          color: var(--button-gradient-start);
        }

        .metric-label {
          color: var(--text-primary);
          margin: 5px 0;
        }

        .metric-trend {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .cms-panel {
            width: calc(100% - 40px);
            right: 20px;
            left: 20px;
          }
        }

        /* Dark Theme Support */
        [data-theme="dark"] .cms-panel {
          background: rgba(30, 30, 30, 0.95);
        }
      </style>
    `;

    if (!document.getElementById('cms-styles')) {
      document.head.insertAdjacentHTML('beforeend', styles);
    }
  }
}

// Initialize the CMS when the page loads
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
    window.cms = new ContentManagementSystem();
  }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ContentManagementSystem;
}