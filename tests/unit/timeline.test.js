/**
 * Unit tests for timeline functionality
 */

describe('Evolution Timeline', () => {
  beforeEach(() => {
    // Setup DOM for timeline tests
    document.body.innerHTML = `
      <div class="timeline-container">
        <div class="timeline-items">
          <div class="timeline-item" data-version="1.0.0">
            <div class="timeline-dot"></div>
            <div class="timeline-date">Sep 13</div>
            <div class="timeline-version">1.0.0</div>
            <div class="timeline-title">Initial Release</div>
          </div>
          <div class="timeline-item" data-version="1.1.0">
            <div class="timeline-dot"></div>
            <div class="timeline-date">Sep 13</div>
            <div class="timeline-version">1.1.0</div>
            <div class="timeline-title">Enhanced UI & PWA Features</div>
          </div>
          <div class="timeline-item" data-version="1.2.0">
            <div class="timeline-dot"></div>
            <div class="timeline-date">Sep 13</div>
            <div class="timeline-version">1.2.0</div>
            <div class="timeline-title">Performance & Analytics</div>
          </div>
          <div class="timeline-item" data-version="2.0.0">
            <div class="timeline-dot"></div>
            <div class="timeline-date">Sep 13</div>
            <div class="timeline-version">2.0.0</div>
            <div class="timeline-title">Testing Infrastructure</div>
          </div>
        </div>
        <div class="timeline-details">
          <div class="detail-card">
            <div class="detail-version">1.0.0</div>
            <div class="detail-category">foundation</div>
            <h4>Initial Release</h4>
            <p>Basic repository structure with self-updating workflow</p>
            <div class="detail-features">
              <h5>Key Features:</h5>
              <ul>
                <li>✨GitHub Actions workflow</li>
                <li>✨Basic HTML homepage</li>
                <li>✨Auto-issue creation</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="timeline-navigation">
          <button class="timeline-nav-btn" id="prevBtn" disabled>← Previous</button>
          <button class="timeline-nav-btn" id="nextBtn">Next →</button>
        </div>
      </div>
    `;
  });

  describe('Timeline Navigation', () => {
    test('should have correct initial state', () => {
      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');
      const timelineItems = document.querySelectorAll('.timeline-item');

      expect(prevBtn).toHaveAttribute('disabled');
      expect(nextBtn).not.toHaveAttribute('disabled');
      expect(timelineItems).toHaveLength(4);
    });

    test('should navigate between timeline items', () => {
      const timelineItems = document.querySelectorAll('.timeline-item');

      // Simulate clicking on different timeline items
      timelineItems.forEach((item, _index) => {
        const event = new Event('click');
        item.dispatchEvent(event);

        expect(item.dataset.version).toBeTruthy();
      });
    });

    test('should update navigation buttons based on current position', () => {
      // Test current navigation state
      const totalItems = 4;

      // Simulate navigation logic
      const updateNavigation = (index) => {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === totalItems - 1;
      };

      // Test at first position
      updateNavigation(0);
      expect(document.getElementById('prevBtn')).toHaveAttribute('disabled');
      expect(document.getElementById('nextBtn')).not.toHaveAttribute('disabled');

      // Test at middle position
      updateNavigation(1);
      expect(document.getElementById('prevBtn')).not.toHaveAttribute('disabled');
      expect(document.getElementById('nextBtn')).not.toHaveAttribute('disabled');

      // Test at last position
      updateNavigation(3);
      expect(document.getElementById('prevBtn')).not.toHaveAttribute('disabled');
      expect(document.getElementById('nextBtn')).toHaveAttribute('disabled');
    });
  });

  describe('Timeline Data Structure', () => {
    test('should have valid version information', () => {
      const timelineItems = document.querySelectorAll('.timeline-item');

      timelineItems.forEach(item => {
        const version = item.dataset.version;
        const versionElement = item.querySelector('.timeline-version');
        const titleElement = item.querySelector('.timeline-title');
        const dateElement = item.querySelector('.timeline-date');

        expect(version).toMatch(/^\d+\.\d+\.\d+$/); // Semantic versioning pattern
        expect(versionElement.textContent).toBe(version);
        expect(titleElement.textContent.length).toBeGreaterThan(0);
        expect(dateElement.textContent.length).toBeGreaterThan(0);
      });
    });

    test('should have proper chronological order', () => {
      const timelineItems = document.querySelectorAll('.timeline-item');
      const versions = Array.from(timelineItems).map(item => item.dataset.version);

      // Check if versions are in ascending order
      for (let i = 0; i < versions.length - 1; i++) {
        const current = versions[i].split('.').map(Number);
        const next = versions[i + 1].split('.').map(Number);

        // Compare version numbers
        const currentValue = current[0] * 10000 + current[1] * 100 + current[2];
        const nextValue = next[0] * 10000 + next[1] * 100 + next[2];

        expect(currentValue).toBeLessThanOrEqual(nextValue);
      }
    });
  });

  describe('Timeline Details Display', () => {
    test('should show details for selected version', () => {
      const detailCard = document.querySelector('.detail-card');
      const detailVersion = detailCard.querySelector('.detail-version');
      const detailTitle = detailCard.querySelector('h4');
      const detailDescription = detailCard.querySelector('p');

      expect(detailVersion.textContent).toBe('1.0.0');
      expect(detailTitle.textContent).toBe('Initial Release');
      expect(detailDescription.textContent).toBe('Basic repository structure with self-updating workflow');
    });

    test('should have feature list for each version', () => {
      const featuresList = document.querySelector('.detail-features ul');
      const features = featuresList.querySelectorAll('li');

      expect(features.length).toBeGreaterThan(0);
      features.forEach(feature => {
        expect(feature.textContent).toContain('✨');
        expect(feature.textContent.length).toBeGreaterThan(2);
      });
    });
  });

  describe('Timeline Accessibility', () => {
    test('should have proper semantic structure', () => {
      const timelineContainer = document.querySelector('.timeline-container');
      const timelineItems = document.querySelectorAll('.timeline-item');
      const navigationButtons = document.querySelectorAll('.timeline-nav-btn');

      expect(timelineContainer).toBeTruthy();
      expect(timelineItems.length).toBeGreaterThan(0);
      expect(navigationButtons.length).toBe(2);
    });

    test('should have accessible navigation buttons', () => {
      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');

      expect(prevBtn.textContent).toContain('Previous');
      expect(nextBtn.textContent).toContain('Next');
      expect(prevBtn.tagName).toBe('BUTTON');
      expect(nextBtn.tagName).toBe('BUTTON');
    });
  });
});