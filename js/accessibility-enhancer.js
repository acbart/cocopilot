/**
 * Enhanced Accessibility Features for CocoPilot
 * Provides advanced screen reader support, focus management, and accessibility utilities
 */

class AccessibilityEnhancer {
  constructor() {
    this.focusVisible = false;
    this.lastFocusedElement = null;
    this.skipLinksContainer = null;
    this.announcements = [];
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  init() {
    this.enhanceFocusManagement();
    this.createSkipLinks();
    this.setupScreenReaderAnnouncements();
    this.enhanceInteractiveElements();
    this.setupMotionPreferences();
    this.addAccessibilityShortcuts();
    this.createAccessibilityPanel();
    this.monitorAccessibilityIssues();
  }

  enhanceFocusManagement() {
    // Improved focus visibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        this.focusVisible = true;
        document.body.classList.add('focus-visible');
      }
    });

    document.addEventListener('mousedown', () => {
      this.focusVisible = false;
      document.body.classList.remove('focus-visible');
    });

    // Focus trap for modals
    this.setupFocusTraps();

    // Restore focus when modals close
    this.setupFocusRestoration();
  }

  createSkipLinks() {
    const skipLinks = document.createElement('div');
    skipLinks.className = 'skip-links';
    skipLinks.innerHTML = `
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <a href="#navigation" class="skip-link">Skip to navigation</a>
      <a href="#search" class="skip-link">Skip to search</a>
      <a href="#footer" class="skip-link">Skip to footer</a>
    `;

    document.body.insertBefore(skipLinks, document.body.firstChild);
    this.addSkipLinkStyles();
  }

  setupScreenReaderAnnouncements() {
    // Create live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.id = 'sr-announcements';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);

    // Enhanced status updates
    this.enhanceStatusUpdates();
  }

  announce(message, priority = 'polite') {
    const liveRegion = document.getElementById('sr-announcements');
    if (liveRegion) {
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.textContent = message;

      // Clear after announcement
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }

    // Log for debugging
    console.log(`Screen reader announcement: ${message}`);
  }

  enhanceInteractiveElements() {
    // Add better ARIA labels to interactive elements
    this.enhanceButtons();
    this.enhanceLinks();
    this.enhanceFormElements();
    this.addLandmarkRoles();
  }

  enhanceButtons() {
    const buttons = document.querySelectorAll('button:not([aria-label])');
    buttons.forEach(button => {
      const text = button.textContent || button.innerText;
      const icon = button.querySelector('.icon, [class*="icon"]');

      if (!text.trim() && icon) {
        // Icon-only button needs better labeling
        const iconClass = icon.className;
        let label = 'Button';

        if (iconClass.includes('theme')) {
          label = 'Toggle theme';
        } else if (iconClass.includes('search')) {
          label = 'Open search';
        } else if (iconClass.includes('menu')) {
          label = 'Open menu';
        } else if (iconClass.includes('close')) {
          label = 'Close';
        }

        button.setAttribute('aria-label', label);
      }

      // Add role clarification for complex buttons
      if (button.onclick || button.addEventListener) {
        button.setAttribute('role', 'button');
      }
    });
  }

  enhanceLinks() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      // External links indication
      if (link.hostname && link.hostname !== window.location.hostname) {
        if (!link.getAttribute('aria-label')) {
          const text = link.textContent || link.innerText;
          link.setAttribute('aria-label', `${text} (opens in new tab)`);
        }
        link.setAttribute('aria-describedby', 'external-link-notice');
      }

      // Ensure links have proper roles
      if (!link.href && link.onclick) {
        link.setAttribute('role', 'button');
        link.setAttribute('tabindex', '0');
      }
    });

    // Add external link notice
    if (!document.getElementById('external-link-notice')) {
      const notice = document.createElement('span');
      notice.id = 'external-link-notice';
      notice.className = 'sr-only';
      notice.textContent = 'External link, opens in new tab';
      document.body.appendChild(notice);
    }
  }

  enhanceFormElements() {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      // Ensure form elements have labels
      if (!input.getAttribute('aria-label') && !input.labels?.length) {
        const placeholder = input.placeholder;
        if (placeholder) {
          input.setAttribute('aria-label', placeholder);
        }
      }

      // Add validation messages
      if (input.required) {
        input.setAttribute('aria-required', 'true');
      }
    });
  }

  addLandmarkRoles() {
    // Ensure proper landmark structure
    const main = document.querySelector('main');
    if (main && !main.getAttribute('role')) {
      main.setAttribute('role', 'main');
      main.id = main.id || 'main-content';
    }

    const nav = document.querySelector('nav');
    if (nav && !nav.getAttribute('role')) {
      nav.setAttribute('role', 'navigation');
      nav.id = nav.id || 'navigation';
    }

    const footer = document.querySelector('footer, [role="contentinfo"]');
    if (footer && !footer.getAttribute('role')) {
      footer.setAttribute('role', 'contentinfo');
      footer.id = footer.id || 'footer';
    }
  }

  setupMotionPreferences() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleMotionPreference = (e) => {
      this.reducedMotion = e.matches;
      document.body.classList.toggle('reduce-motion', e.matches);

      if (e.matches) {
        this.announce('Animations reduced for accessibility');
      }
    };

    mediaQuery.addEventListener('change', handleMotionPreference);
    handleMotionPreference(mediaQuery);
  }

  addAccessibilityShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Alt + 1: Go to main content
      if (e.altKey && e.key === '1') {
        e.preventDefault();
        const main = document.getElementById('main-content') || document.querySelector('main');
        if (main) {
          main.focus();
          this.announce('Navigated to main content');
        }
      }

      // Alt + 2: Go to navigation
      if (e.altKey && e.key === '2') {
        e.preventDefault();
        const nav = document.getElementById('navigation') || document.querySelector('nav');
        if (nav) {
          nav.focus();
          this.announce('Navigated to navigation');
        }
      }

      // Alt + 3: Go to search
      if (e.altKey && e.key === '3') {
        e.preventDefault();
        const search = document.getElementById('search') || document.querySelector('[role="search"]');
        if (search) {
          search.focus();
          this.announce('Navigated to search');
        }
      }

      // Alt + 0: Open accessibility panel
      if (e.altKey && e.key === '0') {
        e.preventDefault();
        this.toggleAccessibilityPanel();
      }
    });
  }

  createAccessibilityPanel() {
    const panel = document.createElement('div');
    panel.id = 'accessibility-panel';
    panel.className = 'accessibility-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-labelledby', 'a11y-panel-title');
    panel.setAttribute('aria-hidden', 'true');

    panel.innerHTML = `
      <div class="a11y-panel-overlay"></div>
      <div class="a11y-panel-content">
        <div class="a11y-panel-header">
          <h2 id="a11y-panel-title">Accessibility Options</h2>
          <button class="a11y-panel-close" aria-label="Close accessibility panel">×</button>
        </div>
        
        <div class="a11y-panel-body">
          <div class="a11y-option">
            <label class="a11y-label">
              <input type="checkbox" id="high-contrast" class="a11y-checkbox">
              <span class="a11y-label-text">High Contrast Mode</span>
            </label>
            <p class="a11y-description">Increases contrast for better visibility</p>
          </div>

          <div class="a11y-option">
            <label class="a11y-label">
              <input type="checkbox" id="large-text" class="a11y-checkbox">
              <span class="a11y-label-text">Large Text</span>
            </label>
            <p class="a11y-description">Increases text size for easier reading</p>
          </div>

          <div class="a11y-option">
            <label class="a11y-label">
              <input type="checkbox" id="reduce-motion" class="a11y-checkbox">
              <span class="a11y-label-text">Reduce Motion</span>
            </label>
            <p class="a11y-description">Minimizes animations and transitions</p>
          </div>

          <div class="a11y-option">
            <label class="a11y-label">
              <input type="checkbox" id="focus-indicators" class="a11y-checkbox">
              <span class="a11y-label-text">Enhanced Focus Indicators</span>
            </label>
            <p class="a11y-description">Makes keyboard focus more visible</p>
          </div>

          <div class="a11y-option">
            <label class="a11y-label">
              <input type="range" id="font-size" min="12" max="24" value="16" class="a11y-range">
              <span class="a11y-label-text">Font Size: <span id="font-size-value">16px</span></span>
            </label>
            <p class="a11y-description">Adjust text size to your preference</p>
          </div>
        </div>

        <div class="a11y-panel-footer">
          <button class="a11y-reset-btn">Reset to Defaults</button>
          <p class="a11y-shortcut-info">Press Alt+0 to open this panel anytime</p>
        </div>
      </div>
    `;

    document.body.appendChild(panel);
    this.bindAccessibilityPanelEvents();
    this.addAccessibilityStyles();
  }

  bindAccessibilityPanelEvents() {
    const panel = document.getElementById('accessibility-panel');

    // Close button
    const closeBtn = panel.querySelector('.a11y-panel-close');
    closeBtn.addEventListener('click', () => this.hideAccessibilityPanel());

    // Overlay click
    const overlay = panel.querySelector('.a11y-panel-overlay');
    overlay.addEventListener('click', () => this.hideAccessibilityPanel());

    // Options
    const highContrast = panel.querySelector('#high-contrast');
    highContrast.addEventListener('change', (e) => {
      document.body.classList.toggle('high-contrast', e.target.checked);
      localStorage.setItem('a11y-high-contrast', e.target.checked);
      this.announce(e.target.checked ? 'High contrast enabled' : 'High contrast disabled');
    });

    const largeText = panel.querySelector('#large-text');
    largeText.addEventListener('change', (e) => {
      document.body.classList.toggle('large-text', e.target.checked);
      localStorage.setItem('a11y-large-text', e.target.checked);
      this.announce(e.target.checked ? 'Large text enabled' : 'Large text disabled');
    });

    const reduceMotion = panel.querySelector('#reduce-motion');
    reduceMotion.addEventListener('change', (e) => {
      document.body.classList.toggle('reduce-motion', e.target.checked);
      localStorage.setItem('a11y-reduce-motion', e.target.checked);
      this.announce(e.target.checked ? 'Motion reduced' : 'Motion restored');
    });

    const focusIndicators = panel.querySelector('#focus-indicators');
    focusIndicators.addEventListener('change', (e) => {
      document.body.classList.toggle('enhanced-focus', e.target.checked);
      localStorage.setItem('a11y-enhanced-focus', e.target.checked);
      this.announce(e.target.checked ? 'Enhanced focus indicators enabled' : 'Enhanced focus indicators disabled');
    });

    const fontSize = panel.querySelector('#font-size');
    const fontSizeValue = panel.querySelector('#font-size-value');
    fontSize.addEventListener('input', (e) => {
      const size = e.target.value;
      fontSizeValue.textContent = `${size}px`;
      document.documentElement.style.setProperty('--base-font-size', `${size}px`);
      localStorage.setItem('a11y-font-size', size);
    });

    // Reset button
    const resetBtn = panel.querySelector('.a11y-reset-btn');
    resetBtn.addEventListener('click', () => this.resetAccessibilitySettings());

    // Load saved settings
    this.loadAccessibilitySettings();
  }

  loadAccessibilitySettings() {
    const highContrast = localStorage.getItem('a11y-high-contrast') === 'true';
    const largeText = localStorage.getItem('a11y-large-text') === 'true';
    const reduceMotion = localStorage.getItem('a11y-reduce-motion') === 'true';
    const enhancedFocus = localStorage.getItem('a11y-enhanced-focus') === 'true';
    const fontSize = localStorage.getItem('a11y-font-size') || '16';

    document.body.classList.toggle('high-contrast', highContrast);
    document.body.classList.toggle('large-text', largeText);
    document.body.classList.toggle('reduce-motion', reduceMotion);
    document.body.classList.toggle('enhanced-focus', enhancedFocus);

    document.documentElement.style.setProperty('--base-font-size', `${fontSize}px`);

    // Update UI
    const panel = document.getElementById('accessibility-panel');
    if (panel) {
      panel.querySelector('#high-contrast').checked = highContrast;
      panel.querySelector('#large-text').checked = largeText;
      panel.querySelector('#reduce-motion').checked = reduceMotion;
      panel.querySelector('#focus-indicators').checked = enhancedFocus;
      panel.querySelector('#font-size').value = fontSize;
      panel.querySelector('#font-size-value').textContent = `${fontSize}px`;
    }
  }

  resetAccessibilitySettings() {
    localStorage.removeItem('a11y-high-contrast');
    localStorage.removeItem('a11y-large-text');
    localStorage.removeItem('a11y-reduce-motion');
    localStorage.removeItem('a11y-enhanced-focus');
    localStorage.removeItem('a11y-font-size');

    document.body.classList.remove('high-contrast', 'large-text', 'reduce-motion', 'enhanced-focus');
    document.documentElement.style.removeProperty('--base-font-size');

    this.loadAccessibilitySettings();
    this.announce('Accessibility settings reset to defaults');
  }

  toggleAccessibilityPanel() {
    const panel = document.getElementById('accessibility-panel');
    const isVisible = panel.style.display === 'flex';

    if (isVisible) {
      this.hideAccessibilityPanel();
    } else {
      this.showAccessibilityPanel();
    }
  }

  showAccessibilityPanel() {
    const panel = document.getElementById('accessibility-panel');
    panel.style.display = 'flex';
    panel.setAttribute('aria-hidden', 'false');

    const firstInput = panel.querySelector('input');
    if (firstInput) {
      firstInput.focus();
    }

    document.body.style.overflow = 'hidden';
    this.announce('Accessibility panel opened');
  }

  hideAccessibilityPanel() {
    const panel = document.getElementById('accessibility-panel');
    panel.style.display = 'none';
    panel.setAttribute('aria-hidden', 'true');

    document.body.style.overflow = '';
    this.announce('Accessibility panel closed');
  }

  setupFocusTraps() {
    // Monitor for modal dialogs and set up focus trapping
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && (
            node.matches('[role="dialog"]') ||
            node.querySelector('[role="dialog"]')
          )) {
            this.setupFocusTrap(node);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  setupFocusTrap(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    container.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
  }

  setupFocusRestoration() {
    // Track the last focused element before modal opens
    document.addEventListener('focusin', (e) => {
      if (!e.target.closest('[role="dialog"]')) {
        this.lastFocusedElement = e.target;
      }
    });
  }

  enhanceStatusUpdates() {
    // Monitor status regions for changes
    const statusElements = document.querySelectorAll('[role="status"], [aria-live]');

    statusElements.forEach(element => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' || mutation.type === 'characterData') {
            const text = element.textContent.trim();
            if (text) {
              this.announce(text);
            }
          }
        });
      });

      observer.observe(element, {
        childList: true,
        characterData: true,
        subtree: true
      });
    });
  }

  monitorAccessibilityIssues() {
    // Check for common accessibility issues
    setTimeout(() => {
      this.checkImages();
      this.checkHeadings();
      this.checkForms();
      this.checkColors();
    }, 1000);
  }

  checkImages() {
    const images = document.querySelectorAll('img:not([alt])');
    if (images.length > 0) {
      console.warn(`Found ${images.length} images without alt text`);
    }
  }

  checkHeadings() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let level = 0;

    headings.forEach(heading => {
      const currentLevel = parseInt(heading.tagName.slice(1));
      if (currentLevel > level + 1) {
        console.warn(`Heading level skipped: found h${currentLevel} after h${level}`);
      }
      level = currentLevel;
    });
  }

  checkForms() {
    const inputs = document.querySelectorAll('input:not([aria-label]):not([id])');
    const unlabeledInputs = Array.from(inputs).filter(input => !input.labels?.length);

    if (unlabeledInputs.length > 0) {
      console.warn(`Found ${unlabeledInputs.length} unlabeled form inputs`);
    }
  }

  checkColors() {
    // Basic color contrast check (simplified)
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
      const style = window.getComputedStyle(element);
      const bgColor = style.backgroundColor;
      const textColor = style.color;

      // This would need a more sophisticated contrast ratio calculation
      // For now, just log elements with transparent backgrounds and dark text
      if (bgColor === 'rgba(0, 0, 0, 0)' && textColor.includes('rgb(0')) {
        // Potentially low contrast
      }
    });
  }

  addSkipLinkStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
      .skip-links {
        position: absolute;
        top: -100px;
        left: 0;
        z-index: 10001;
      }

      .skip-link {
        position: absolute;
        top: -100px;
        left: 6px;
        background: var(--button-gradient-start, #667eea);
        color: white;
        padding: 8px 16px;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
        z-index: 10001;
        transition: top 0.3s;
      }

      .skip-link:focus {
        top: 6px;
      }
    `;
    document.head.appendChild(styles);
  }

  addAccessibilityStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
      .sr-only {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      }

      .accessibility-panel {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10002;
        display: none;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .a11y-panel-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
      }

      .a11y-panel-content {
        position: relative;
        background: var(--container-bg, white);
        border-radius: 16px;
        max-width: 90vw;
        max-height: 90vh;
        width: 600px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        overflow: hidden;
        border: 1px solid var(--border-color, #e0e0e0);
      }

      .a11y-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 24px;
        border-bottom: 1px solid var(--border-color, #e0e0e0);
        background: var(--feature-bg, #f8f9fa);
      }

      .a11y-panel-header h2 {
        margin: 0;
        color: var(--text-primary, #333);
        font-size: 1.5rem;
      }

      .a11y-panel-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-secondary, #666);
        padding: 8px;
        border-radius: 8px;
        transition: background-color 0.2s;
      }

      .a11y-panel-close:hover {
        background: var(--border-color, #e0e0e0);
      }

      .a11y-panel-body {
        padding: 24px;
        max-height: 60vh;
        overflow-y: auto;
      }

      .a11y-option {
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--border-color, #e0e0e0);
      }

      .a11y-option:last-child {
        border-bottom: none;
      }

      .a11y-label {
        display: flex;
        align-items: center;
        cursor: pointer;
        margin-bottom: 8px;
      }

      .a11y-checkbox,
      .a11y-range {
        margin-right: 12px;
      }

      .a11y-label-text {
        font-weight: 500;
        color: var(--text-primary, #333);
      }

      .a11y-description {
        margin: 0;
        color: var(--text-secondary, #666);
        font-size: 0.9rem;
        line-height: 1.4;
      }

      .a11y-panel-footer {
        padding: 16px 24px;
        border-top: 1px solid var(--border-color, #e0e0e0);
        background: var(--feature-bg, #f8f9fa);
        text-align: center;
      }

      .a11y-reset-btn {
        background: var(--button-gradient-start, #667eea);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        margin-bottom: 12px;
      }

      .a11y-reset-btn:hover {
        background: var(--button-gradient-end, #764ba2);
      }

      .a11y-shortcut-info {
        margin: 0;
        color: var(--text-secondary, #666);
        font-size: 0.8rem;
      }

      /* Enhanced focus indicators */
      .enhanced-focus *:focus {
        outline: 3px solid var(--button-gradient-start, #667eea) !important;
        outline-offset: 2px !important;
      }

      /* High contrast mode */
      .high-contrast {
        filter: contrast(150%);
      }

      .high-contrast * {
        border-color: #000 !important;
        text-shadow: none !important;
        box-shadow: none !important;
      }

      /* Large text mode */
      .large-text {
        font-size: 120% !important;
      }

      .large-text * {
        font-size: inherit !important;
        line-height: 1.6 !important;
      }

      /* Reduced motion */
      .reduce-motion *,
      .reduce-motion *::before,
      .reduce-motion *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }

      /* Focus visible enhancement */
      .focus-visible *:focus-visible {
        outline: 3px solid var(--button-gradient-start, #667eea);
        outline-offset: 2px;
      }

      @media (max-width: 768px) {
        .a11y-panel-content {
          width: 95vw;
          max-height: 85vh;
        }
      }

      /* Dark theme support */
      [data-theme="dark"] .a11y-panel-content {
        background: #1a1a1a;
        border-color: #333;
      }

      [data-theme="dark"] .a11y-panel-header {
        background: #2a2a2a;
        border-color: #333;
      }

      [data-theme="dark"] .a11y-panel-footer {
        background: #2a2a2a;
        border-color: #333;
      }

      [data-theme="dark"] .a11y-option {
        border-color: #333;
      }
    `;

    document.head.appendChild(styles);
  }
}

// Initialize accessibility enhancer when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new AccessibilityEnhancer();
  });
} else {
  new AccessibilityEnhancer();
}

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AccessibilityEnhancer;
}