/**
 * AI Code Playground - Interactive coding environment for AI development demos
 * Provides a live coding environment to demonstrate AI-assisted programming
 */

class AICodePlayground {
  constructor() {
    this.isInitialized = false;
    this.currentExample = 0;
    this.editor = null;
    this.output = null;

    this.examples = [
      {
        id: 'hello-world',
        title: '👋 Hello World with AI',
        description: 'See how AI can help write your first program',
        language: 'javascript',
        code: `// AI-Generated Hello World
function greetUser(name = 'Developer') {
  const greeting = \`Hello, \${name}! Welcome to AI-driven development!\`;
  console.log(greeting);
  
  // AI suggestion: Add timestamp
  const timestamp = new Date().toLocaleTimeString();
  console.log(\`Current time: \${timestamp}\`);
  
  return greeting;
}

// Execute the function
greetUser('CocoPilot User');`,
        aiSuggestions: [
          'Add error handling for invalid names',
          'Include internationalization support',
          'Add emoji based on time of day'
        ]
      },
      {
        id: 'data-analysis',
        title: '📊 Data Analysis Helper',
        description: 'AI-assisted data processing and visualization',
        language: 'javascript',
        code: `// AI-Generated Data Analysis Function
function analyzeRepositoryData(commits) {
  // AI suggestion: Input validation
  if (!Array.isArray(commits)) {
    throw new Error('Expected array of commits');
  }
  
  const analysis = {
    totalCommits: commits.length,
    averagePerDay: 0,
    mostActiveDay: null,
    commitFrequency: {}
  };
  
  // AI-generated commit frequency analysis
  commits.forEach(commit => {
    const day = new Date(commit.date).toLocaleDateString();
    analysis.commitFrequency[day] = (analysis.commitFrequency[day] || 0) + 1;
  });
  
  // Find most active day
  analysis.mostActiveDay = Object.keys(analysis.commitFrequency)
    .reduce((a, b) => analysis.commitFrequency[a] > analysis.commitFrequency[b] ? a : b);
  
  // Calculate average (AI suggestion: consider weekends)
  const uniqueDays = Object.keys(analysis.commitFrequency).length;
  analysis.averagePerDay = (analysis.totalCommits / uniqueDays).toFixed(2);
  
  return analysis;
}

// Sample data for demonstration
const sampleCommits = [
  { date: '2025-09-15', message: 'Add AI features' },
  { date: '2025-09-16', message: 'Improve UI' },
  { date: '2025-09-17', message: 'Fix bugs' },
  { date: '2025-09-17', message: 'Add tests' },
  { date: '2025-09-18', message: 'Performance boost' }
];

console.log('Repository Analysis:', analyzeRepositoryData(sampleCommits));`,
        aiSuggestions: [
          'Add visualization with Chart.js',
          'Include time-based patterns analysis',
          'Add statistical significance testing'
        ]
      },
      {
        id: 'ai-assistant',
        title: '🤖 Simple AI Assistant',
        description: 'Build a basic AI response system',
        language: 'javascript',
        code: `// AI-Generated Simple Assistant
class SimpleAIAssistant {
  constructor() {
    this.responses = {
      greeting: ['Hello! How can I help with your code today?', 'Hi there! Ready to build something amazing?'],
      coding: ['Let me help you with that function!', 'Here's an AI-suggested approach...'],
      debugging: ['I found a potential issue in your code.', 'Let's trace through this logic together.'],
      optimization: ['I can suggest some performance improvements!', 'Here's how we can make this more efficient.']
    };
    
    this.keywords = {
      greeting: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
      coding: ['function', 'class', 'variable', 'write code', 'create'],
      debugging: ['error', 'bug', 'issue', 'problem', 'not working'],
      optimization: ['optimize', 'faster', 'improve', 'performance', 'speed']
    };
  }
  
  // AI-generated intent recognition
  recognizeIntent(input) {
    const lowercaseInput = input.toLowerCase();
    
    for (const [intent, keywords] of Object.entries(this.keywords)) {
      if (keywords.some(keyword => lowercaseInput.includes(keyword))) {
        return intent;
      }
    }
    
    return 'general';
  }
  
  // AI-suggested response generation
  generateResponse(input) {
    const intent = this.recognizeIntent(input);
    const responses = this.responses[intent] || ['I'm here to help with your coding journey!'];
    
    // AI suggestion: Add randomness for natural conversation
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      intent,
      response: randomResponse,
      confidence: Math.random() * 0.3 + 0.7, // Simulated confidence
      timestamp: new Date().toISOString()
    };
  }
}

// Demo the AI assistant
const assistant = new SimpleAIAssistant();

console.log('AI Assistant Demo:');
console.log(assistant.generateResponse('Hello there!'));
console.log(assistant.generateResponse('Help me write a function'));
console.log(assistant.generateResponse('My code has a bug'));
console.log(assistant.generateResponse('How can I make this faster?'));`,
        aiSuggestions: [
          'Add machine learning with TensorFlow.js',
          'Implement context awareness',
          'Add voice recognition capabilities'
        ]
      }
    ];

    this.init();
  }

  init() {
    if (this.isInitialized) {
      return;
    }

    this.createPlaygroundSection();
    this.addPlaygroundStyles();
    this.setupEventListeners();
    this.isInitialized = true;
  }

  createPlaygroundSection() {
    const mainContainer = document.querySelector('.container');
    if (!mainContainer) {
      return;
    }

    // Find insertion point after AI education section
    const educationSection = document.querySelector('.ai-education-section') ||
                            document.querySelector('.analytics-dashboard') ||
                            document.querySelector('.about-section');

    const playgroundSection = document.createElement('section');
    playgroundSection.className = 'ai-playground-section';
    playgroundSection.innerHTML = `
      <div class="playground-header">
        <h2>🎮 AI Code Playground</h2>
        <p>Try interactive examples of AI-assisted programming</p>
      </div>
      
      <div class="playground-nav">
        ${this.examples.map((example, index) => `
          <button class="example-btn ${index === 0 ? 'active' : ''}" 
                  data-example="${index}" 
                  onclick="window.aiPlayground?.loadExample(${index})">
            <div class="example-title">${example.title}</div>
            <div class="example-desc">${example.description}</div>
          </button>
        `).join('')}
      </div>
      
      <div class="playground-container">
        <div class="playground-sidebar">
          <div class="example-info">
            <h3 id="currentExampleTitle">${this.examples[0].title}</h3>
            <p id="currentExampleDesc">${this.examples[0].description}</p>
          </div>
          
          <div class="ai-suggestions">
            <h4>🤖 AI Suggestions:</h4>
            <ul id="aiSuggestionsList">
              ${this.examples[0].aiSuggestions.map(suggestion =>
    `<li class="suggestion-item">${suggestion}</li>`
  ).join('')}
            </ul>
          </div>
          
          <div class="playground-controls">
            <button class="control-btn run" onclick="window.aiPlayground?.runCode()">
              <span class="btn-icon">▶️</span>
              Run Code
            </button>
            <button class="control-btn clear" onclick="window.aiPlayground?.clearOutput()">
              <span class="btn-icon">🗑️</span>
              Clear Output
            </button>
            <button class="control-btn copy" onclick="window.aiPlayground?.copyCode()">
              <span class="btn-icon">📋</span>
              Copy Code
            </button>
          </div>
        </div>
        
        <div class="playground-main">
          <div class="code-editor-container">
            <div class="editor-header">
              <span class="editor-title">Code Editor</span>
              <span class="language-indicator" id="languageIndicator">JavaScript</span>
            </div>
            <div class="code-editor" id="codeEditor">
              <textarea 
                id="codeTextarea" 
                spellcheck="false" 
                autocomplete="off"
                aria-label="Code editor"
                placeholder="Write your AI-assisted code here...">${this.examples[0].code}</textarea>
            </div>
          </div>
          
          <div class="output-container">
            <div class="output-header">
              <span class="output-title">Output</span>
              <button class="output-toggle" onclick="window.aiPlayground?.toggleOutput()" aria-label="Toggle output panel">
                <span id="outputToggleIcon">🔽</span>
              </button>
            </div>
            <div class="output-content" id="outputContent">
              <div class="output-placeholder">Click "Run Code" to see output...</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="playground-footer">
        <div class="playground-tips">
          <h4>💡 Pro Tips:</h4>
          <ul>
            <li>Modify the code to see different AI suggestions in action</li>
            <li>Use console.log() to output results</li>
            <li>Try adding your own functions and see how they work</li>
            <li>Experiment with different data inputs</li>
          </ul>
        </div>
      </div>
    `;

    if (educationSection) {
      educationSection.parentNode.insertBefore(playgroundSection, educationSection.nextSibling);
    } else {
      mainContainer.appendChild(playgroundSection);
    }
  }

  addPlaygroundStyles() {
    if (document.getElementById('ai-playground-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'ai-playground-styles';
    style.textContent = `
      .ai-playground-section {
        background: var(--feature-bg);
        border-radius: 20px;
        padding: 40px;
        margin: 40px 0;
        border: 2px solid var(--border-color);
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
      }

      .ai-playground-section.visible {
        opacity: 1;
        transform: translateY(0);
      }

      .playground-header {
        text-align: center;
        margin-bottom: 30px;
      }

      .playground-header h2 {
        color: var(--text-primary);
        font-size: 2rem;
        margin-bottom: 10px;
      }

      .playground-header p {
        color: var(--text-secondary);
        font-size: 1.1rem;
      }

      .playground-nav {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 15px;
        margin-bottom: 30px;
      }

      .example-btn {
        background: var(--container-bg);
        border: 2px solid var(--border-color);
        border-radius: 12px;
        padding: 15px;
        text-align: left;
        cursor: pointer;
        transition: all 0.3s ease;
        opacity: 0.8;
      }

      .example-btn:hover,
      .example-btn.active {
        border-color: var(--button-gradient-start);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.15);
        opacity: 1;
      }

      .example-title {
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 6px;
      }

      .example-desc {
        font-size: 0.85rem;
        color: var(--text-secondary);
        line-height: 1.4;
      }

      .playground-container {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 30px;
        margin-bottom: 30px;
      }

      .playground-sidebar {
        background: var(--container-bg);
        border-radius: 15px;
        padding: 25px;
        border: 1px solid var(--border-color);
        height: fit-content;
      }

      .example-info h3 {
        color: var(--text-primary);
        font-size: 1.3rem;
        margin-bottom: 10px;
      }

      .example-info p {
        color: var(--text-secondary);
        font-size: 0.95rem;
        line-height: 1.5;
        margin-bottom: 20px;
      }

      .ai-suggestions {
        margin-bottom: 25px;
      }

      .ai-suggestions h4 {
        color: var(--text-primary);
        font-size: 1.1rem;
        margin-bottom: 12px;
      }

      .ai-suggestions ul {
        list-style: none;
        padding: 0;
      }

      .suggestion-item {
        background: var(--feature-bg);
        border-radius: 8px;
        padding: 10px 12px;
        margin-bottom: 8px;
        color: var(--text-secondary);
        font-size: 0.9rem;
        border-left: 3px solid var(--button-gradient-start);
        transition: all 0.2s ease;
      }

      .suggestion-item:hover {
        background: var(--border-color);
        transform: translateX(3px);
      }

      .playground-controls {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .control-btn {
        background: linear-gradient(135deg, var(--button-gradient-start), var(--button-gradient-end));
        border: none;
        border-radius: 8px;
        padding: 10px 15px;
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.9rem;
      }

      .control-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
      }

      .control-btn.run {
        background: linear-gradient(135deg, #10b981, #059669);
      }

      .control-btn.clear {
        background: linear-gradient(135deg, #f59e0b, #d97706);
      }

      .control-btn.copy {
        background: linear-gradient(135deg, #6b7280, #4b5563);
      }

      .btn-icon {
        font-size: 0.9rem;
      }

      .playground-main {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .code-editor-container,
      .output-container {
        background: var(--container-bg);
        border-radius: 12px;
        border: 1px solid var(--border-color);
        overflow: hidden;
      }

      .editor-header,
      .output-header {
        background: var(--feature-bg);
        padding: 12px 20px;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .editor-title,
      .output-title {
        font-weight: 600;
        color: var(--text-primary);
        font-size: 0.95rem;
      }

      .language-indicator {
        background: var(--button-gradient-start);
        color: white;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
      }

      .output-toggle {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-secondary);
        padding: 4px;
        border-radius: 4px;
        transition: background 0.2s ease;
      }

      .output-toggle:hover {
        background: var(--border-color);
      }

      .code-editor {
        position: relative;
      }

      #codeTextarea {
        width: 100%;
        height: 400px;
        padding: 20px;
        border: none;
        background: var(--container-bg);
        color: var(--text-primary);
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 14px;
        line-height: 1.6;
        resize: vertical;
        outline: none;
        tab-size: 2;
      }

      #codeTextarea::placeholder {
        color: var(--text-tertiary);
        opacity: 0.7;
      }

      .output-content {
        padding: 20px;
        min-height: 150px;
        max-height: 300px;
        overflow-y: auto;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 13px;
        line-height: 1.5;
        background: #1a1a1a;
        color: #e5e5e5;
      }

      .output-content.collapsed {
        display: none;
      }

      .output-placeholder {
        color: #888;
        font-style: italic;
        text-align: center;
        padding: 40px 20px;
      }

      .output-line {
        margin: 5px 0;
        padding: 3px 0;
        border-left: 3px solid transparent;
        padding-left: 8px;
      }

      .output-line.log {
        border-left-color: #10b981;
        color: #10b981;
      }

      .output-line.error {
        border-left-color: #ef4444;
        color: #ef4444;
      }

      .output-line.warn {
        border-left-color: #f59e0b;
        color: #f59e0b;
      }

      .playground-footer {
        background: var(--container-bg);
        border-radius: 12px;
        padding: 25px;
        border: 1px solid var(--border-color);
      }

      .playground-tips h4 {
        color: var(--text-primary);
        margin-bottom: 15px;
        font-size: 1.1rem;
      }

      .playground-tips ul {
        list-style: none;
        padding: 0;
      }

      .playground-tips li {
        color: var(--text-secondary);
        padding: 8px 0;
        padding-left: 25px;
        position: relative;
        font-size: 0.95rem;
        line-height: 1.4;
      }

      .playground-tips li::before {
        content: '💡';
        position: absolute;
        left: 0;
        top: 8px;
      }

      @media (max-width: 1024px) {
        .playground-container {
          grid-template-columns: 1fr;
          gap: 20px;
        }
        
        .playground-nav {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 768px) {
        .ai-playground-section {
          padding: 25px;
        }
        
        #codeTextarea {
          height: 300px;
          font-size: 13px;
        }
        
        .playground-controls {
          flex-direction: row;
          flex-wrap: wrap;
        }
        
        .control-btn {
          flex: 1;
          min-width: 0;
          justify-content: center;
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
      const playgroundSection = document.querySelector('.ai-playground-section');
      if (playgroundSection) {
        observer.observe(playgroundSection);
      }
    }, 100);

    // Tab support in textarea
    const textarea = document.getElementById('codeTextarea');
    if (textarea) {
      textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          e.preventDefault();
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          textarea.value = textarea.value.substring(0, start) + '  ' + textarea.value.substring(end);
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        }
      });
    }
  }

  loadExample(index) {
    if (index < 0 || index >= this.examples.length) {
      return;
    }

    this.currentExample = index;
    const example = this.examples[index];

    // Update navigation
    document.querySelectorAll('.example-btn').forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });

    // Update example info
    const titleEl = document.getElementById('currentExampleTitle');
    const descEl = document.getElementById('currentExampleDesc');
    const suggestionsEl = document.getElementById('aiSuggestionsList');
    const codeTextarea = document.getElementById('codeTextarea');
    const languageIndicator = document.getElementById('languageIndicator');

    if (titleEl) {
      titleEl.textContent = example.title;
    }
    if (descEl) {
      descEl.textContent = example.description;
    }
    if (codeTextarea) {
      codeTextarea.value = example.code;
    }
    if (languageIndicator) {
      languageIndicator.textContent = example.language.charAt(0).toUpperCase() + example.language.slice(1);
    }

    if (suggestionsEl) {
      suggestionsEl.innerHTML = example.aiSuggestions.map(suggestion =>
        `<li class="suggestion-item">${suggestion}</li>`
      ).join('');
    }

    // Clear output
    this.clearOutput();
  }

  runCode() {
    const codeTextarea = document.getElementById('codeTextarea');
    const outputContent = document.getElementById('outputContent');

    if (!codeTextarea || !outputContent) {
      return;
    }

    const code = codeTextarea.value;
    outputContent.innerHTML = '';

    // Capture console output
    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn
    };

    const outputs = [];

    // Override console methods
    console.log = (...args) => {
      outputs.push({ type: 'log', content: args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ') });
      originalConsole.log(...args);
    };

    console.error = (...args) => {
      outputs.push({ type: 'error', content: args.join(' ') });
      originalConsole.error(...args);
    };

    console.warn = (...args) => {
      outputs.push({ type: 'warn', content: args.join(' ') });
      originalConsole.warn(...args);
    };

    try {
      // Execute the code
      const wrappedCode = `
        (function() {
          ${code}
        })();
      `;
      eval(wrappedCode);

      if (outputs.length === 0) {
        outputs.push({ type: 'log', content: '✅ Code executed successfully (no output)' });
      }
    } catch (error) {
      outputs.push({ type: 'error', content: `❌ ${error.message}` });
    } finally {
      // Restore console methods
      console.log = originalConsole.log;
      console.error = originalConsole.error;
      console.warn = originalConsole.warn;
    }

    // Display outputs
    outputContent.innerHTML = outputs.map(output =>
      `<div class="output-line ${output.type}">${this.escapeHtml(output.content)}</div>`
    ).join('');

    // Auto-scroll to bottom
    outputContent.scrollTop = outputContent.scrollHeight;
  }

  clearOutput() {
    const outputContent = document.getElementById('outputContent');
    if (outputContent) {
      outputContent.innerHTML = '<div class="output-placeholder">Click "Run Code" to see output...</div>';
    }
  }

  copyCode() {
    const codeTextarea = document.getElementById('codeTextarea');
    if (!codeTextarea) {
      return;
    }

    codeTextarea.select();
    document.execCommand('copy');

    // Show feedback
    const copyBtn = document.querySelector('.control-btn.copy');
    if (copyBtn) {
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = '<span class="btn-icon">✅</span>Copied!';
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
      }, 2000);
    }
  }

  toggleOutput() {
    const outputContent = document.getElementById('outputContent');
    const toggleIcon = document.getElementById('outputToggleIcon');

    if (outputContent && toggleIcon) {
      outputContent.classList.toggle('collapsed');
      toggleIcon.textContent = outputContent.classList.contains('collapsed') ? '🔼' : '🔽';
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.aiPlayground = new AICodePlayground();
  });
} else {
  window.aiPlayground = new AICodePlayground();
}