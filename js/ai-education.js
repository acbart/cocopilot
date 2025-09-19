/**
 * AI Education Module - Interactive Learning about AI-Driven Development
 * Provides educational content about AI in software development
 */

class AIEducation {
  constructor() {
    this.currentLesson = 0;
    this.isInitialized = false;
    this.lessons = [
      {
        id: 'intro',
        title: '🤖 Introduction to AI-Driven Development',
        description: 'Learn the fundamentals of how AI assists in modern software development',
        content: `
          <div class="lesson-content">
            <h3>What is AI-Driven Development?</h3>
            <p>AI-driven development represents a revolutionary approach where artificial intelligence assists, automates, and enhances various aspects of software creation.</p>
            
            <div class="concept-grid">
              <div class="concept-card">
                <div class="concept-icon">🧠</div>
                <h4>Intelligent Code Generation</h4>
                <p>AI can generate code snippets, complete functions, and even entire modules based on natural language descriptions.</p>
              </div>
              
              <div class="concept-card">
                <div class="concept-icon">🔍</div>
                <h4>Automated Code Review</h4>
                <p>AI systems can analyze code for bugs, security vulnerabilities, and optimization opportunities.</p>
              </div>
              
              <div class="concept-card">
                <div class="concept-icon">📊</div>
                <h4>Predictive Analytics</h4>
                <p>AI can predict potential issues, estimate development time, and suggest architectural improvements.</p>
              </div>
              
              <div class="concept-card">
                <div class="concept-icon">🔄</div>
                <h4>Continuous Improvement</h4>
                <p>Systems like CocoPilot can autonomously update and improve themselves based on usage patterns and feedback.</p>
              </div>
            </div>
            
            <div class="interactive-demo">
              <h4>🎯 Try It Yourself</h4>
              <p>This repository is a living example of AI-driven development. Every day, GitHub Copilot analyzes the code and suggests improvements!</p>
              <button class="demo-btn" onclick="this.parentElement.classList.toggle('expanded')">
                <span class="demo-text">View Today's AI Suggestions</span>
                <span class="demo-icon">🔽</span>
              </button>
              <div class="demo-content">
                <div class="suggestion-item">
                  <div class="suggestion-type">Performance</div>
                  <div class="suggestion-text">Optimize image loading with lazy loading and WebP format</div>
                </div>
                <div class="suggestion-item">
                  <div class="suggestion-type">Accessibility</div>
                  <div class="suggestion-text">Add more descriptive ARIA labels for complex interactions</div>
                </div>
                <div class="suggestion-item">
                  <div class="suggestion-type">Feature</div>
                  <div class="suggestion-text">Implement code playground for live AI coding demonstrations</div>
                </div>
              </div>
            </div>
          </div>
        `,
        duration: 300
      },
      {
        id: 'tools',
        title: '🛠️ AI Development Tools',
        description: 'Explore the tools and technologies powering AI-assisted development',
        content: `
          <div class="lesson-content">
            <h3>Popular AI Development Tools</h3>
            
            <div class="tools-grid">
              <div class="tool-card">
                <div class="tool-header">
                  <div class="tool-icon">🤖</div>
                  <div class="tool-info">
                    <h4>GitHub Copilot</h4>
                    <span class="tool-category">Code Generation</span>
                  </div>
                </div>
                <p>AI pair programmer that suggests code and entire functions in real-time as you type.</p>
                <div class="tool-features">
                  <span class="feature-tag">Multi-language</span>
                  <span class="feature-tag">Context-aware</span>
                  <span class="feature-tag">IDE Integration</span>
                </div>
              </div>
              
              <div class="tool-card">
                <div class="tool-header">
                  <div class="tool-icon">🚀</div>
                  <div class="tool-info">
                    <h4>GitHub Actions</h4>
                    <span class="tool-category">Automation</span>
                  </div>
                </div>
                <p>Automate workflows, testing, and deployment with AI-powered optimization suggestions.</p>
                <div class="tool-features">
                  <span class="feature-tag">CI/CD</span>
                  <span class="feature-tag">Workflows</span>
                  <span class="feature-tag">Integration</span>
                </div>
              </div>
              
              <div class="tool-card">
                <div class="tool-header">
                  <div class="tool-icon">🧪</div>
                  <div class="tool-info">
                    <h4>AI Testing Tools</h4>
                    <span class="tool-category">Quality Assurance</span>
                  </div>
                </div>
                <p>Automated test generation, bug detection, and performance optimization.</p>
                <div class="tool-features">
                  <span class="feature-tag">Test Gen</span>
                  <span class="feature-tag">Bug Detection</span>
                  <span class="feature-tag">Performance</span>
                </div>
              </div>
            </div>
            
            <div class="timeline-demo">
              <h4>📈 AI Development Evolution</h4>
              <div class="evolution-timeline">
                <div class="timeline-item">
                  <div class="timeline-year">2020</div>
                  <div class="timeline-content">
                    <h5>Early AI Assistants</h5>
                    <p>Basic autocomplete and syntax highlighting</p>
                  </div>
                </div>
                <div class="timeline-item active">
                  <div class="timeline-year">2023</div>
                  <div class="timeline-content">
                    <h5>Advanced Code Generation</h5>
                    <p>Context-aware AI that understands entire codebases</p>
                  </div>
                </div>
                <div class="timeline-item future">
                  <div class="timeline-year">2025</div>
                  <div class="timeline-content">
                    <h5>Autonomous Development</h5>
                    <p>Self-updating repositories like CocoPilot</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `,
        duration: 400
      },
      {
        id: 'benefits',
        title: '⚡ Benefits & Best Practices',
        description: 'Understand the advantages and learn how to effectively use AI in development',
        content: `
          <div class="lesson-content">
            <h3>Benefits of AI-Driven Development</h3>
            
            <div class="benefits-comparison">
              <div class="comparison-side">
                <h4>🐌 Traditional Development</h4>
                <ul class="comparison-list">
                  <li>Manual code writing</li>
                  <li>Time-consuming debugging</li>
                  <li>Manual testing creation</li>
                  <li>Reactive bug fixing</li>
                  <li>Limited code review capacity</li>
                </ul>
              </div>
              
              <div class="comparison-arrow">➡️</div>
              
              <div class="comparison-side">
                <h4>🚀 AI-Enhanced Development</h4>
                <ul class="comparison-list highlight">
                  <li>AI-assisted code generation</li>
                  <li>Predictive bug detection</li>
                  <li>Automated test generation</li>
                  <li>Proactive optimization</li>
                  <li>AI-powered code review</li>
                </ul>
              </div>
            </div>
            
            <div class="best-practices">
              <h4>🎯 Best Practices for AI Development</h4>
              
              <div class="practice-grid">
                <div class="practice-card">
                  <div class="practice-number">1</div>
                  <div class="practice-content">
                    <h5>Start Small</h5>
                    <p>Begin with simple AI assistance like code completion before moving to complex automation.</p>
                  </div>
                </div>
                
                <div class="practice-card">
                  <div class="practice-number">2</div>
                  <div class="practice-content">
                    <h5>Review Everything</h5>
                    <p>Always review AI-generated code for correctness, security, and adherence to standards.</p>
                  </div>
                </div>
                
                <div class="practice-card">
                  <div class="practice-number">3</div>
                  <div class="practice-content">
                    <h5>Maintain Context</h5>
                    <p>Provide clear comments and documentation to help AI understand your codebase better.</p>
                  </div>
                </div>
                
                <div class="practice-card">
                  <div class="practice-number">4</div>
                  <div class="practice-content">
                    <h5>Iterative Improvement</h5>
                    <p>Use AI feedback loops to continuously improve code quality and development processes.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="success-metrics">
              <h4>📊 Measuring AI Development Success</h4>
              <div class="metrics-grid">
                <div class="metric-card">
                  <div class="metric-value">40%</div>
                  <div class="metric-label">Faster Development</div>
                </div>
                <div class="metric-card">
                  <div class="metric-value">60%</div>
                  <div class="metric-label">Fewer Bugs</div>
                </div>
                <div class="metric-card">
                  <div class="metric-value">80%</div>
                  <div class="metric-label">Better Testing</div>
                </div>
                <div class="metric-card">
                  <div class="metric-value">90%</div>
                  <div class="metric-label">Code Quality</div>
                </div>
              </div>
            </div>
          </div>
        `,
        duration: 500
      }
    ];
    
    this.init();
  }

  init() {
    if (this.isInitialized) return;
    
    this.createEducationSection();
    this.addEducationStyles();
    this.setupEventListeners();
    this.isInitialized = true;
  }

  createEducationSection() {
    const mainContainer = document.querySelector('.container');
    if (!mainContainer) return;

    // Find a good insertion point (after analytics dashboard)
    const analyticsSection = document.querySelector('.analytics-dashboard') || 
                            document.querySelector('.data-viz-container') ||
                            document.querySelector('.about-section');
    
    const educationSection = document.createElement('section');
    educationSection.className = 'ai-education-section';
    educationSection.innerHTML = `
      <div class="education-header">
        <h2>🎓 Learn AI-Driven Development</h2>
        <p>Interactive lessons about how AI is transforming software development</p>
      </div>
      
      <div class="education-nav">
        ${this.lessons.map((lesson, index) => `
          <button class="lesson-nav-btn ${index === 0 ? 'active' : ''}" 
                  data-lesson="${index}" 
                  onclick="window.aiEducation?.showLesson(${index})">
            <div class="lesson-nav-title">${lesson.title}</div>
            <div class="lesson-nav-desc">${lesson.description}</div>
          </button>
        `).join('')}
      </div>
      
      <div class="education-content" id="educationContent">
        ${this.lessons[0].content}
      </div>
      
      <div class="education-controls">
        <button class="education-btn prev" onclick="window.aiEducation?.previousLesson()" disabled>
          ← Previous
        </button>
        <div class="lesson-progress">
          <span class="current-lesson">1</span> of <span class="total-lessons">${this.lessons.length}</span>
        </div>
        <button class="education-btn next" onclick="window.aiEducation?.nextLesson()">
          Next →
        </button>
      </div>
    `;

    if (analyticsSection) {
      analyticsSection.parentNode.insertBefore(educationSection, analyticsSection.nextSibling);
    } else {
      mainContainer.appendChild(educationSection);
    }
  }

  addEducationStyles() {
    if (document.getElementById('ai-education-styles')) return;

    const style = document.createElement('style');
    style.id = 'ai-education-styles';
    style.textContent = `
      .ai-education-section {
        background: var(--feature-bg);
        border-radius: 20px;
        padding: 40px;
        margin: 40px 0;
        border: 2px solid var(--border-color);
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
      }

      .ai-education-section.visible {
        opacity: 1;
        transform: translateY(0);
      }

      .education-header {
        text-align: center;
        margin-bottom: 30px;
      }

      .education-header h2 {
        color: var(--text-primary);
        font-size: 2rem;
        margin-bottom: 10px;
      }

      .education-header p {
        color: var(--text-secondary);
        font-size: 1.1rem;
      }

      .education-nav {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
      }

      .lesson-nav-btn {
        background: var(--container-bg);
        border: 2px solid var(--border-color);
        border-radius: 15px;
        padding: 20px;
        text-align: left;
        cursor: pointer;
        transition: all 0.3s ease;
        opacity: 0.7;
      }

      .lesson-nav-btn:hover,
      .lesson-nav-btn.active {
        border-color: var(--button-gradient-start);
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
        opacity: 1;
      }

      .lesson-nav-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 8px;
      }

      .lesson-nav-desc {
        font-size: 0.9rem;
        color: var(--text-secondary);
        line-height: 1.4;
      }

      .education-content {
        background: var(--container-bg);
        border-radius: 15px;
        padding: 30px;
        margin-bottom: 30px;
        min-height: 400px;
        border: 1px solid var(--border-color);
      }

      .lesson-content h3 {
        color: var(--text-primary);
        font-size: 1.6rem;
        margin-bottom: 20px;
      }

      .concept-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin: 25px 0;
      }

      .concept-card {
        background: var(--feature-bg);
        border-radius: 12px;
        padding: 20px;
        border: 1px solid var(--border-color);
        transition: transform 0.2s ease;
      }

      .concept-card:hover {
        transform: translateY(-3px);
      }

      .concept-icon {
        font-size: 2rem;
        margin-bottom: 10px;
      }

      .concept-card h4 {
        color: var(--text-primary);
        font-size: 1.1rem;
        margin-bottom: 10px;
      }

      .concept-card p {
        color: var(--text-secondary);
        font-size: 0.95rem;
        line-height: 1.5;
      }

      .interactive-demo {
        background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
        border-radius: 15px;
        padding: 25px;
        margin-top: 30px;
        color: white;
      }

      .interactive-demo h4 {
        margin-bottom: 15px;
        font-size: 1.3rem;
      }

      .demo-btn {
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 8px;
        padding: 12px 20px;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 15px 0;
        transition: all 0.3s ease;
      }

      .demo-btn:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: translateY(-1px);
      }

      .demo-content {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
      }

      .interactive-demo.expanded .demo-content {
        max-height: 300px;
        margin-top: 20px;
      }

      .suggestion-item {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 15px;
      }

      .suggestion-type {
        background: rgba(255, 255, 255, 0.2);
        padding: 5px 12px;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 600;
        min-width: 100px;
        text-align: center;
      }

      .suggestion-text {
        flex: 1;
        font-size: 0.95rem;
      }

      .education-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
      }

      .education-btn {
        background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
        border: none;
        border-radius: 10px;
        padding: 12px 24px;
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .education-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
      }

      .education-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .lesson-progress {
        background: var(--container-bg);
        border: 1px solid var(--border-color);
        border-radius: 25px;
        padding: 8px 20px;
        color: var(--text-primary);
        font-weight: 600;
      }

      .current-lesson {
        color: var(--button-gradient-start);
      }

      /* Tools grid styles */
      .tools-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin: 25px 0;
      }

      .tool-card {
        background: var(--feature-bg);
        border-radius: 12px;
        padding: 20px;
        border: 1px solid var(--border-color);
      }

      .tool-header {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 15px;
      }

      .tool-icon {
        font-size: 2rem;
        background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .tool-info h4 {
        color: var(--text-primary);
        margin-bottom: 5px;
      }

      .tool-category {
        color: var(--text-tertiary);
        font-size: 0.85rem;
        font-weight: 500;
      }

      .tool-features {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 15px;
      }

      .feature-tag {
        background: var(--button-gradient-start);
        color: white;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
      }

      /* Benefits comparison styles */
      .benefits-comparison {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        gap: 20px;
        align-items: center;
        margin: 25px 0;
      }

      .comparison-side {
        background: var(--feature-bg);
        border-radius: 12px;
        padding: 25px;
        border: 1px solid var(--border-color);
      }

      .comparison-side h4 {
        color: var(--text-primary);
        margin-bottom: 15px;
        text-align: center;
      }

      .comparison-list {
        list-style: none;
        padding: 0;
      }

      .comparison-list li {
        padding: 8px 0;
        color: var(--text-secondary);
        position: relative;
        padding-left: 25px;
      }

      .comparison-list li::before {
        content: '•';
        position: absolute;
        left: 0;
        color: var(--text-tertiary);
      }

      .comparison-list.highlight li::before {
        content: '✓';
        color: #4ade80;
        font-weight: bold;
      }

      .comparison-arrow {
        font-size: 2rem;
        color: var(--button-gradient-start);
        text-align: center;
      }

      .practice-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin: 25px 0;
      }

      .practice-card {
        display: flex;
        gap: 15px;
        background: var(--feature-bg);
        border-radius: 12px;
        padding: 20px;
        border: 1px solid var(--border-color);
      }

      .practice-number {
        background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
        color: white;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        flex-shrink: 0;
      }

      .practice-content h5 {
        color: var(--text-primary);
        margin-bottom: 8px;
      }

      .practice-content p {
        color: var(--text-secondary);
        font-size: 0.9rem;
        line-height: 1.4;
      }

      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 20px;
        margin: 25px 0;
      }

      .metric-card {
        background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        color: white;
      }

      .metric-value {
        font-size: 2.5rem;
        font-weight: bold;
        margin-bottom: 8px;
      }

      .metric-label {
        font-size: 0.9rem;
        opacity: 0.9;
      }

      @media (max-width: 768px) {
        .education-nav {
          grid-template-columns: 1fr;
        }
        
        .benefits-comparison {
          grid-template-columns: 1fr;
          gap: 15px;
        }
        
        .comparison-arrow {
          transform: rotate(90deg);
        }
        
        .metrics-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  setupEventListeners() {
    // Animation on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    setTimeout(() => {
      const educationSection = document.querySelector('.ai-education-section');
      if (educationSection) {
        observer.observe(educationSection);
      }
    }, 100);
  }

  showLesson(index) {
    if (index < 0 || index >= this.lessons.length) return;
    
    this.currentLesson = index;
    const lesson = this.lessons[index];
    
    // Update content
    const contentElement = document.getElementById('educationContent');
    if (contentElement) {
      contentElement.innerHTML = lesson.content;
    }
    
    // Update navigation
    document.querySelectorAll('.lesson-nav-btn').forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });
    
    // Update progress
    const currentLessonSpan = document.querySelector('.current-lesson');
    if (currentLessonSpan) {
      currentLessonSpan.textContent = index + 1;
    }
    
    // Update controls
    const prevBtn = document.querySelector('.education-btn.prev');
    const nextBtn = document.querySelector('.education-btn.next');
    
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === this.lessons.length - 1;
  }

  nextLesson() {
    if (this.currentLesson < this.lessons.length - 1) {
      this.showLesson(this.currentLesson + 1);
    }
  }

  previousLesson() {
    if (this.currentLesson > 0) {
      this.showLesson(this.currentLesson - 1);
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.aiEducation = new AIEducation();
  });
} else {
  window.aiEducation = new AIEducation();
}