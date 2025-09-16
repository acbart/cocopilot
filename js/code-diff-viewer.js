/**
 * Interactive Code Diff Viewer for CocoPilot
 * Shows visual diffs of AI-driven improvements over time
 */

class CodeDiffViewer {
  constructor() {
    this.diffs = [];
    this.currentDiff = 0;
    this.isInitialized = false;
    this.init();
  }

  init() {
    if (this.isInitialized) return;
    
    try {
      this.createDiffViewer();
      this.loadSampleDiffs();
      this.bindEvents();
      this.isInitialized = true;
    } catch (error) {
      console.warn('Code Diff Viewer initialization failed:', error);
    }
  }

  createDiffViewer() {
    const diffViewerHtml = `
      <section class="code-diff-section" id="code-diff-section">
        <div class="diff-header">
          <h3 data-i18n="diff.title">💻 AI Code Evolution</h3>
          <p data-i18n="diff.subtitle">See how AI improves code quality over time</p>
          <button class="diff-toggle" id="toggle-diff" aria-expanded="false" aria-controls="diff-content">
            <span data-i18n="diff.toggle">🔍 View Code Changes</span>
            <span class="toggle-icon">▼</span>
          </button>
        </div>
        
        <div id="diff-content" class="diff-content" hidden>
          <div class="diff-controls">
            <button id="prev-diff" class="diff-nav-btn" disabled>
              <span>←</span>
              <span data-i18n="diff.previous">Previous</span>
            </button>
            <div class="diff-info">
              <span class="diff-counter" id="diff-counter">1 / 3</span>
              <span class="diff-type" id="diff-type">Enhancement</span>
            </div>
            <button id="next-diff" class="diff-nav-btn">
              <span data-i18n="diff.next">Next</span>
              <span>→</span>
            </button>
          </div>

          <div class="diff-viewer" id="diff-viewer">
            <div class="diff-meta">
              <div class="diff-title" id="diff-title">Improved Analytics Dashboard</div>
              <div class="diff-date" id="diff-date">2025-09-16</div>
              <div class="diff-stats" id="diff-stats">
                <span class="additions">+47</span>
                <span class="deletions">-12</span>
              </div>
            </div>
            
            <div class="diff-files">
              <div class="file-diff">
                <div class="file-header">
                  <span class="file-icon">📄</span>
                  <span class="file-name" id="file-name">js/analytics-dashboard.js</span>
                  <span class="file-status added">new file</span>
                </div>
                <div class="diff-content-area">
                  <div class="line-numbers">
                    <div class="line-numbers-left"></div>
                    <div class="line-numbers-right"></div>
                  </div>
                  <div class="diff-lines" id="diff-lines">
                    <!-- Diff lines will be populated here -->
                  </div>
                </div>
              </div>
            </div>

            <div class="diff-insights">
              <h4 data-i18n="diff.insights_title">🧠 AI Insights</h4>
              <div class="insights-content" id="diff-insights">
                <div class="insight-item">
                  <span class="insight-icon">🎯</span>
                  <span>Enhanced user experience with interactive analytics</span>
                </div>
                <div class="insight-item">
                  <span class="insight-icon">⚡</span>
                  <span>Optimized performance with efficient data rendering</span>
                </div>
                <div class="insight-item">
                  <span class="insight-icon">♿</span>
                  <span>Improved accessibility with proper ARIA labels</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    // Insert after recent activity section
    const recentActivity = document.querySelector('h3[data-i18n="activity.title"]');
    if (recentActivity && recentActivity.parentNode) {
      recentActivity.parentNode.insertAdjacentHTML('afterend', diffViewerHtml);
      this.addDiffStyles();
    }
  }

  addDiffStyles() {
    const styles = `
      <style id="code-diff-styles">
        .code-diff-section {
          margin: 30px 0;
          padding: 20px;
          background: var(--container-bg);
          border-radius: 15px;
          backdrop-filter: blur(10px);
          border: 1px solid var(--border-color);
        }

        .diff-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .diff-header h3 {
          margin: 0 0 10px 0;
          color: var(--text-primary);
          font-size: 20px;
        }

        .diff-header p {
          margin: 0 0 15px 0;
          color: var(--text-secondary);
          font-size: 14px;
        }

        .diff-toggle {
          background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 auto;
        }

        .diff-toggle:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(102, 126, 234, 0.3);
        }

        .diff-toggle[aria-expanded="true"] .toggle-icon {
          transform: rotate(180deg);
        }

        .toggle-icon {
          transition: transform 0.3s ease;
        }

        .diff-content {
          animation: slideDown 0.3s ease-out;
        }

        .diff-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding: 15px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 10px;
          border: 1px solid var(--border-color);
        }

        .diff-nav-btn {
          background: var(--button-gradient-start);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .diff-nav-btn:hover:not(:disabled) {
          background: var(--button-gradient-end);
          transform: translateY(-1px);
        }

        .diff-nav-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
        }

        .diff-info {
          text-align: center;
        }

        .diff-counter {
          display: block;
          font-weight: bold;
          color: var(--text-primary);
        }

        .diff-type {
          display: block;
          font-size: 12px;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .diff-viewer {
          background: #f8f9fa;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--border-color);
        }

        .diff-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: rgba(255, 255, 255, 0.8);
          border-bottom: 1px solid var(--border-color);
        }

        .diff-title {
          font-weight: bold;
          color: var(--text-primary);
          font-size: 16px;
        }

        .diff-date {
          color: var(--text-secondary);
          font-size: 14px;
        }

        .diff-stats {
          display: flex;
          gap: 10px;
          font-family: monospace;
          font-size: 14px;
        }

        .additions {
          color: #28a745;
        }

        .deletions {
          color: #dc3545;
        }

        .file-diff {
          margin-bottom: 20px;
        }

        .file-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 15px;
          background: rgba(102, 126, 234, 0.1);
          border-bottom: 1px solid var(--border-color);
          font-family: monospace;
          font-size: 14px;
        }

        .file-icon {
          font-size: 16px;
        }

        .file-name {
          font-weight: bold;
          color: var(--text-primary);
        }

        .file-status {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .file-status.added {
          background: #d4edda;
          color: #155724;
        }

        .file-status.modified {
          background: #fff3cd;
          color: #856404;
        }

        .file-status.deleted {
          background: #f8d7da;
          color: #721c24;
        }

        .diff-content-area {
          display: flex;
          font-family: 'Courier New', monospace;
          font-size: 13px;
          line-height: 1.4;
        }

        .line-numbers {
          display: flex;
          background: #f1f3f4;
          border-right: 1px solid var(--border-color);
        }

        .line-numbers-left,
        .line-numbers-right {
          width: 40px;
          padding: 0 8px;
          text-align: right;
          color: #666;
          background: #f8f9fa;
          user-select: none;
        }

        .line-numbers-right {
          border-left: 1px solid var(--border-color);
        }

        .diff-lines {
          flex: 1;
          padding: 0;
        }

        .diff-line {
          display: flex;
          min-height: 20px;
          white-space: pre-wrap;
        }

        .diff-line.added {
          background: rgba(40, 167, 69, 0.1);
          border-left: 3px solid #28a745;
        }

        .diff-line.removed {
          background: rgba(220, 53, 69, 0.1);
          border-left: 3px solid #dc3545;
        }

        .diff-line.context {
          background: transparent;
        }

        .line-content {
          padding: 2px 8px;
          flex: 1;
          word-break: break-all;
        }

        .diff-insights {
          margin-top: 20px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }

        .diff-insights h4 {
          margin: 0 0 15px 0;
          color: var(--text-primary);
          font-size: 16px;
        }

        .insights-content {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .insight-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          background: rgba(102, 126, 234, 0.05);
          border-radius: 8px;
          font-size: 14px;
        }

        .insight-icon {
          font-size: 16px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .diff-meta {
            flex-direction: column;
            gap: 10px;
            text-align: center;
          }

          .diff-controls {
            flex-direction: column;
            gap: 15px;
          }

          .diff-nav-btn {
            width: 100%;
            justify-content: center;
          }

          .line-numbers-left,
          .line-numbers-right {
            width: 30px;
            font-size: 11px;
          }

          .diff-lines {
            font-size: 12px;
          }
        }

        /* Dark Theme Support */
        [data-theme="dark"] .diff-viewer {
          background: #2d3748;
        }

        [data-theme="dark"] .diff-meta,
        [data-theme="dark"] .diff-insights {
          background: rgba(45, 55, 72, 0.8);
          border-color: rgba(255, 255, 255, 0.1);
        }

        [data-theme="dark"] .file-header {
          background: rgba(102, 126, 234, 0.2);
        }

        [data-theme="dark"] .line-numbers-left,
        [data-theme="dark"] .line-numbers-right {
          background: #374151;
          color: #9ca3af;
        }

        [data-theme="dark"] .diff-line.added {
          background: rgba(34, 197, 94, 0.2);
        }

        [data-theme="dark"] .diff-line.removed {
          background: rgba(239, 68, 68, 0.2);
        }

        [data-theme="dark"] .insight-item {
          background: rgba(102, 126, 234, 0.1);
        }
      </style>
    `;

    if (!document.getElementById('code-diff-styles')) {
      document.head.insertAdjacentHTML('beforeend', styles);
    }
  }

  bindEvents() {
    const toggleBtn = document.getElementById('toggle-diff');
    const diffContent = document.getElementById('diff-content');
    const prevBtn = document.getElementById('prev-diff');
    const nextBtn = document.getElementById('next-diff');

    if (toggleBtn && diffContent) {
      toggleBtn.addEventListener('click', () => {
        const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        
        toggleBtn.setAttribute('aria-expanded', !isExpanded);
        diffContent.hidden = isExpanded;
        
        const toggleText = toggleBtn.querySelector('[data-i18n]');
        if (toggleText) {
          toggleText.textContent = isExpanded ? '🔍 View Code Changes' : '🔒 Hide Code Changes';
        }
      });
    }

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => this.showPreviousDiff());
      nextBtn.addEventListener('click', () => this.showNextDiff());
    }
  }

  loadSampleDiffs() {
    this.diffs = [
      {
        title: 'Added Analytics Dashboard',
        date: '2025-09-16',
        type: 'Enhancement',
        files: [{
          name: 'js/analytics-dashboard.js',
          status: 'added',
          additions: 47,
          deletions: 0,
          lines: [
            { type: 'added', content: '/**' },
            { type: 'added', content: ' * Enhanced Analytics Dashboard for CocoPilot' },
            { type: 'added', content: ' * Provides interactive insights into repository evolution' },
            { type: 'added', content: ' */' },
            { type: 'added', content: '' },
            { type: 'added', content: 'class AnalyticsDashboard {' },
            { type: 'added', content: '  constructor() {' },
            { type: 'added', content: '    this.isInitialized = false;' },
            { type: 'added', content: '    this.data = {' },
            { type: 'added', content: '      commits: [],' },
            { type: 'added', content: '      improvements: [],' },
            { type: 'added', content: '      metrics: {}' },
            { type: 'added', content: '    };' },
            { type: 'added', content: '    this.init();' },
            { type: 'added', content: '  }' }
          ]
        }],
        insights: [
          { icon: '🎯', text: 'Enhanced user experience with interactive analytics' },
          { icon: '⚡', text: 'Optimized performance with efficient data rendering' },
          { icon: '♿', text: 'Improved accessibility with proper ARIA labels' }
        ]
      },
      {
        title: 'Enhanced Mobile Experience',
        date: '2025-09-15',
        type: 'Feature',
        files: [{
          name: 'js/enhanced-mobile.js',
          status: 'modified',
          additions: 23,
          deletions: 8,
          lines: [
            { type: 'context', content: 'class EnhancedMobileExperience {' },
            { type: 'context', content: '  constructor() {' },
            { type: 'removed', content: '    this.touchSupport = false;' },
            { type: 'added', content: '    this.touchSupport = \'ontouchstart\' in window;' },
            { type: 'added', content: '    this.gestureThreshold = 50;' },
            { type: 'context', content: '    this.init();' },
            { type: 'context', content: '  }' },
            { type: 'context', content: '' },
            { type: 'added', content: '  detectMultiTouch() {' },
            { type: 'added', content: '    return navigator.maxTouchPoints > 1;' },
            { type: 'added', content: '  }' }
          ]
        }],
        insights: [
          { icon: '📱', text: 'Better touch gesture recognition' },
          { icon: '🎨', text: 'Improved mobile UI responsiveness' },
          { icon: '⚡', text: 'Faster mobile interactions' }
        ]
      },
      {
        title: 'Performance Optimizations',
        date: '2025-09-14',
        type: 'Optimization',
        files: [{
          name: 'js/performance-monitor.js',
          status: 'modified',
          additions: 15,
          deletions: 5,
          lines: [
            { type: 'context', content: '  measureCoreWebVitals() {' },
            { type: 'removed', content: '    // Basic measurement' },
            { type: 'added', content: '    // Enhanced Core Web Vitals measurement' },
            { type: 'added', content: '    this.measureLCP();' },
            { type: 'added', content: '    this.measureFID();' },
            { type: 'added', content: '    this.measureCLS();' },
            { type: 'context', content: '  }' },
            { type: 'context', content: '' },
            { type: 'added', content: '  measureLCP() {' },
            { type: 'added', content: '    new PerformanceObserver((entryList) => {' },
            { type: 'added', content: '      const entries = entryList.getEntries();' },
            { type: 'added', content: '      const lastEntry = entries[entries.length - 1];' },
            { type: 'added', content: '      console.log(\'LCP:\', lastEntry.startTime);' },
            { type: 'added', content: '    }).observe({entryTypes: [\'largest-contentful-paint\']});' },
            { type: 'added', content: '  }' }
          ]
        }],
        insights: [
          { icon: '⚡', text: 'Improved Core Web Vitals tracking' },
          { icon: '📊', text: 'Better performance metrics collection' },
          { icon: '🎯', text: 'More accurate performance measurements' }
        ]
      }
    ];

    this.updateDiffDisplay();
  }

  showPreviousDiff() {
    if (this.currentDiff > 0) {
      this.currentDiff--;
      this.updateDiffDisplay();
    }
  }

  showNextDiff() {
    if (this.currentDiff < this.diffs.length - 1) {
      this.currentDiff++;
      this.updateDiffDisplay();
    }
  }

  updateDiffDisplay() {
    const diff = this.diffs[this.currentDiff];
    if (!diff) return;

    // Update meta information
    document.getElementById('diff-counter').textContent = `${this.currentDiff + 1} / ${this.diffs.length}`;
    document.getElementById('diff-type').textContent = diff.type;
    document.getElementById('diff-title').textContent = diff.title;
    document.getElementById('diff-date').textContent = diff.date;

    // Update file information
    const file = diff.files[0];
    document.getElementById('file-name').textContent = file.name;
    
    const fileStatus = document.querySelector('.file-status');
    fileStatus.textContent = file.status === 'added' ? 'new file' : file.status;
    fileStatus.className = `file-status ${file.status}`;

    // Update stats
    document.getElementById('diff-stats').innerHTML = `
      <span class="additions">+${file.additions}</span>
      <span class="deletions">-${file.deletions}</span>
    `;

    // Update diff lines
    this.renderDiffLines(file.lines);

    // Update insights
    this.renderInsights(diff.insights);

    // Update navigation buttons
    document.getElementById('prev-diff').disabled = this.currentDiff === 0;
    document.getElementById('next-diff').disabled = this.currentDiff === this.diffs.length - 1;
  }

  renderDiffLines(lines) {
    const container = document.getElementById('diff-lines');
    const leftNumbers = document.querySelector('.line-numbers-left');
    const rightNumbers = document.querySelector('.line-numbers-right');
    
    container.innerHTML = '';
    leftNumbers.innerHTML = '';
    rightNumbers.innerHTML = '';

    let leftLineNum = 1;
    let rightLineNum = 1;

    lines.forEach((line, index) => {
      // Line numbers
      const leftNum = document.createElement('div');
      const rightNum = document.createElement('div');
      
      if (line.type === 'removed') {
        leftNum.textContent = leftLineNum++;
        rightNum.textContent = '';
      } else if (line.type === 'added') {
        leftNum.textContent = '';
        rightNum.textContent = rightLineNum++;
      } else {
        leftNum.textContent = leftLineNum++;
        rightNum.textContent = rightLineNum++;
      }
      
      leftNumbers.appendChild(leftNum);
      rightNumbers.appendChild(rightNum);

      // Diff line
      const diffLine = document.createElement('div');
      diffLine.className = `diff-line ${line.type}`;
      
      const content = document.createElement('div');
      content.className = 'line-content';
      content.textContent = line.content;
      
      diffLine.appendChild(content);
      container.appendChild(diffLine);
    });
  }

  renderInsights(insights) {
    const container = document.getElementById('diff-insights');
    container.innerHTML = '';

    insights.forEach(insight => {
      const item = document.createElement('div');
      item.className = 'insight-item';
      item.innerHTML = `
        <span class="insight-icon">${insight.icon}</span>
        <span>${insight.text}</span>
      `;
      container.appendChild(item);
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new CodeDiffViewer();
  });
} else {
  new CodeDiffViewer();
}

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CodeDiffViewer;
}