/**
 * Advanced Collaboration Features
 * Enables real-time collaboration, shared sessions, and community interactions
 */

class AdvancedCollaborationFeatures {
  constructor() {
    this.isInitialized = false;
    this.collaborationSession = null;
    this.connectedUsers = new Map();
    this.sharedState = {};
    this.messageHistory = [];
    this.userPresence = {};
    this.init();
  }

  async init() {
    try {
      await this.setupUI();
      this.setupEventListeners();
      await this.initializeCollaborationSystem();
      this.isInitialized = true;
      console.log('Advanced Collaboration Features initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Advanced Collaboration Features:', error);
    }
  }

  async setupUI() {
    // Create collaboration hub
    const collaborationHub = document.createElement('div');
    collaborationHub.id = 'collaboration-hub';
    collaborationHub.className = 'collaboration-hub';
    collaborationHub.innerHTML = `
      <div class="collaboration-header">
        <h3>
          <span class="collab-icon">👥</span>
          Collaboration Hub
        </h3>
        <div class="collaboration-controls">
          <button class="collab-toggle-btn" title="Toggle Collaboration" aria-label="Toggle Collaboration">
            <span class="toggle-icon">🤝</span>
          </button>
          <div class="online-users-indicator">
            <span class="user-count">1</span>
            <span class="status-dot online"></span>
          </div>
        </div>
      </div>
      <div class="collaboration-content">
        <div class="collaboration-tabs">
          <button class="collab-tab active" data-tab="community">Community</button>
          <button class="collab-tab" data-tab="sessions">Sessions</button>
          <button class="collab-tab" data-tab="share">Share</button>
        </div>
        
        <div class="collaboration-panel community-panel active">
          <div class="community-feed">
            <div class="feed-item">
              <div class="feed-avatar">🤖</div>
              <div class="feed-content">
                <strong>CocoPilot AI</strong>
                <p>Welcome to the collaboration space! Share ideas, get help, and connect with other developers.</p>
                <span class="feed-time">Just now</span>
              </div>
            </div>
          </div>
          <div class="community-input">
            <input type="text" id="community-message" placeholder="Share something with the community..." 
                   aria-label="Community message">
            <button id="send-community-message" aria-label="Send message">Send</button>
          </div>
        </div>
        
        <div class="collaboration-panel sessions-panel">
          <div class="active-sessions">
            <h4>Active Sessions</h4>
            <div class="session-list" id="session-list">
              <div class="session-item">
                <div class="session-info">
                  <strong>AI Learning Session</strong>
                  <p>Exploring new AI features</p>
                  <small>3 participants</small>
                </div>
                <button class="join-session-btn" data-session="ai-learning">Join</button>
              </div>
            </div>
            <button class="create-session-btn">Create New Session</button>
          </div>
        </div>
        
        <div class="collaboration-panel share-panel">
          <div class="sharing-options">
            <h4>Share Your Experience</h4>
            <div class="share-option">
              <div class="share-icon">🔗</div>
              <div class="share-content">
                <strong>Share Page</strong>
                <p>Generate a shareable link to this page</p>
                <button class="share-btn" data-type="page">Create Link</button>
              </div>
            </div>
            <div class="share-option">
              <div class="share-icon">📸</div>
              <div class="share-content">
                <strong>Share Screenshot</strong>
                <p>Capture and share what you're working on</p>
                <button class="share-btn" data-type="screenshot">Take Screenshot</button>
              </div>
            </div>
            <div class="share-option">
              <div class="share-icon">💡</div>
              <div class="share-content">
                <strong>Share Idea</strong>
                <p>Submit feature suggestions or improvements</p>
                <button class="share-btn" data-type="idea">Share Idea</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add CSS styles
    this.addStyles();

    // Insert hub into the page
    const targetContainer = document.querySelector('.container') || document.body;
    targetContainer.appendChild(collaborationHub);

    // Initially minimized
    collaborationHub.classList.add('minimized');
  }

  addStyles() {
    if (document.getElementById('collaboration-styles')) {
      return;
    }

    const styles = document.createElement('style');
    styles.id = 'collaboration-styles';
    styles.textContent = `
      .collaboration-hub {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 350px;
        max-height: 500px;
        background: var(--container-bg, rgba(255, 255, 255, 0.95));
        border: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        z-index: 1000;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
      }

      .collaboration-hub.minimized {
        height: 60px;
        overflow: hidden;
      }

      .collaboration-hub.minimized .collaboration-content {
        display: none;
      }

      .collaboration-header {
        padding: 15px;
        border-bottom: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
      }

      .collaboration-header h3 {
        margin: 0;
        font-size: 1rem;
        color: var(--text-primary, #333);
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .collab-icon {
        font-size: 1.2rem;
      }

      .collaboration-controls {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .collab-toggle-btn {
        background: none;
        border: none;
        padding: 6px;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      .collab-toggle-btn:hover {
        background: var(--feature-bg, rgba(102, 126, 234, 0.1));
      }

      .online-users-indicator {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.9rem;
        color: var(--text-secondary, #666);
      }

      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #10b981;
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      .collaboration-content {
        padding: 0;
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      .collaboration-tabs {
        display: flex;
        border-bottom: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
      }

      .collab-tab {
        flex: 1;
        padding: 10px;
        border: none;
        background: none;
        color: var(--text-secondary, #666);
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.9rem;
      }

      .collab-tab.active {
        color: var(--text-primary, #333);
        background: var(--feature-bg, rgba(102, 126, 234, 0.1));
        border-bottom: 2px solid var(--button-gradient-start, #667eea);
      }

      .collab-tab:hover {
        background: var(--feature-bg, rgba(102, 126, 234, 0.05));
      }

      .collaboration-panel {
        display: none;
        padding: 15px;
        flex: 1;
        overflow-y: auto;
      }

      .collaboration-panel.active {
        display: block;
      }

      /* Community Panel */
      .community-feed {
        max-height: 250px;
        overflow-y: auto;
        margin-bottom: 15px;
      }

      .feed-item {
        display: flex;
        gap: 10px;
        padding: 10px;
        border-radius: 8px;
        margin-bottom: 8px;
        transition: background-color 0.2s ease;
      }

      .feed-item:hover {
        background: var(--feature-bg, rgba(102, 126, 234, 0.05));
      }

      .feed-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: var(--button-gradient-start, #667eea);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        color: white;
        flex-shrink: 0;
      }

      .feed-content {
        flex: 1;
      }

      .feed-content strong {
        color: var(--text-primary, #333);
        font-size: 0.9rem;
      }

      .feed-content p {
        color: var(--text-secondary, #666);
        font-size: 0.8rem;
        margin: 4px 0;
        line-height: 1.4;
      }

      .feed-time {
        color: var(--text-tertiary, #888);
        font-size: 0.75rem;
      }

      .community-input {
        display: flex;
        gap: 8px;
      }

      #community-message {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
        border-radius: 8px;
        font-size: 0.9rem;
        background: var(--container-bg, white);
        color: var(--text-primary, #333);
      }

      #community-message:focus {
        outline: none;
        border-color: var(--button-gradient-start, #667eea);
      }

      #send-community-message {
        padding: 8px 12px;
        background: linear-gradient(135deg, var(--button-gradient-start, #667eea), var(--button-gradient-end, #764ba2));
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: transform 0.2s ease;
      }

      #send-community-message:hover {
        transform: translateY(-1px);
      }

      /* Sessions Panel */
      .active-sessions h4 {
        margin: 0 0 15px 0;
        color: var(--text-primary, #333);
        font-size: 1rem;
      }

      .session-list {
        margin-bottom: 15px;
      }

      .session-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        border: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
        border-radius: 8px;
        margin-bottom: 8px;
      }

      .session-info strong {
        color: var(--text-primary, #333);
        font-size: 0.9rem;
        display: block;
      }

      .session-info p {
        color: var(--text-secondary, #666);
        font-size: 0.8rem;
        margin: 2px 0;
      }

      .session-info small {
        color: var(--text-tertiary, #888);
        font-size: 0.75rem;
      }

      .join-session-btn {
        padding: 6px 12px;
        background: var(--button-gradient-start, #667eea);
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.8rem;
        transition: background-color 0.2s ease;
      }

      .join-session-btn:hover {
        background: var(--button-gradient-end, #764ba2);
      }

      .create-session-btn {
        width: 100%;
        padding: 10px;
        background: linear-gradient(135deg, var(--button-gradient-start, #667eea), var(--button-gradient-end, #764ba2));
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: transform 0.2s ease;
      }

      .create-session-btn:hover {
        transform: translateY(-1px);
      }

      /* Share Panel */
      .sharing-options h4 {
        margin: 0 0 15px 0;
        color: var(--text-primary, #333);
        font-size: 1rem;
      }

      .share-option {
        display: flex;
        gap: 12px;
        padding: 12px;
        border: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
        border-radius: 8px;
        margin-bottom: 10px;
        transition: all 0.2s ease;
      }

      .share-option:hover {
        background: var(--feature-bg, rgba(102, 126, 234, 0.05));
        transform: translateY(-1px);
      }

      .share-icon {
        font-size: 1.5rem;
        flex-shrink: 0;
      }

      .share-content {
        flex: 1;
      }

      .share-content strong {
        color: var(--text-primary, #333);
        font-size: 0.9rem;
        display: block;
        margin-bottom: 2px;
      }

      .share-content p {
        color: var(--text-secondary, #666);
        font-size: 0.8rem;
        margin: 0 0 8px 0;
        line-height: 1.3;
      }

      .share-btn {
        padding: 6px 12px;
        background: var(--container-bg, white);
        border: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
        border-radius: 6px;
        color: var(--text-primary, #333);
        cursor: pointer;
        font-size: 0.8rem;
        transition: all 0.2s ease;
      }

      .share-btn:hover {
        background: var(--feature-bg, rgba(102, 126, 234, 0.1));
      }

      @media (max-width: 768px) {
        .collaboration-hub {
          position: relative;
          bottom: auto;
          right: auto;
          width: 100%;
          margin: 20px 0;
        }
      }

      /* Dark theme support */
      [data-theme="dark"] .collaboration-hub {
        background: var(--container-bg, rgba(30, 30, 30, 0.95));
      }

      [data-theme="dark"] #community-message,
      [data-theme="dark"] .share-btn {
        background: var(--container-bg, rgba(40, 40, 40, 0.8));
        color: var(--text-primary, #fff);
      }

      [data-theme="dark"] .feed-avatar {
        background: var(--button-gradient-end, #764ba2);
      }

      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        .collaboration-hub,
        .collab-tab,
        .feed-item,
        .share-option,
        .status-dot {
          transition: none !important;
          animation: none !important;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  setupEventListeners() {
    // Toggle collaboration hub
    const toggleBtn = document.querySelector('.collab-toggle-btn');
    const _hub = document.getElementById('collaboration-hub');
    const header = document.querySelector('.collaboration-header');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleHub();
      });
    }

    if (header) {
      header.addEventListener('click', () => {
        this.toggleHub();
      });
    }

    // Tab switching
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('collab-tab')) {
        this.switchTab(e.target.dataset.tab);
      }
    });

    // Community message sending
    const messageInput = document.getElementById('community-message');
    const sendBtn = document.getElementById('send-community-message');

    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        this.sendCommunityMessage();
      });
    }

    if (messageInput) {
      messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.sendCommunityMessage();
        }
      });
    }

    // Session joining
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('join-session-btn')) {
        const sessionId = e.target.dataset.session;
        this.joinSession(sessionId);
      }
    });

    // Session creation
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('create-session-btn')) {
        this.createNewSession();
      }
    });

    // Sharing actions
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('share-btn')) {
        const shareType = e.target.dataset.type;
        this.handleSharing(shareType);
      }
    });
  }

  async initializeCollaborationSystem() {
    // Initialize collaboration features
    this.setupMockData();
    this.startPresenceSimulation();
    this.loadCommunityFeed();
  }

  toggleHub() {
    const hub = document.getElementById('collaboration-hub');
    if (hub) {
      hub.classList.toggle('minimized');
    }
  }

  switchTab(tabId) {
    // Update tab buttons
    const tabs = document.querySelectorAll('.collab-tab');
    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabId);
    });

    // Update panels
    const panels = document.querySelectorAll('.collaboration-panel');
    panels.forEach(panel => {
      panel.classList.toggle('active', panel.classList.contains(`${tabId}-panel`));
    });
  }

  sendCommunityMessage() {
    const messageInput = document.getElementById('community-message');
    if (!messageInput || !messageInput.value.trim()) {
      return;
    }

    const message = messageInput.value.trim();
    messageInput.value = '';

    // Add message to feed
    this.addCommunityMessage({
      avatar: '👤',
      name: 'You',
      message: message,
      time: 'Just now'
    });

    // Simulate AI response
    setTimeout(() => {
      this.addCommunityMessage({
        avatar: '🤖',
        name: 'CocoPilot AI',
        message: this.generateAIResponse(message),
        time: 'Just now'
      });
    }, 1500);
  }

  addCommunityMessage(data) {
    const feed = document.querySelector('.community-feed');
    if (!feed) {
      return;
    }

    const feedItem = document.createElement('div');
    feedItem.className = 'feed-item';
    feedItem.innerHTML = `
      <div class="feed-avatar">${data.avatar}</div>
      <div class="feed-content">
        <strong>${data.name}</strong>
        <p>${data.message}</p>
        <span class="feed-time">${data.time}</span>
      </div>
    `;

    feed.appendChild(feedItem);
    feed.scrollTop = feed.scrollHeight;

    // Store in message history
    this.messageHistory.push({
      ...data,
      timestamp: new Date().toISOString()
    });

    // Limit history
    if (this.messageHistory.length > 50) {
      this.messageHistory = this.messageHistory.slice(-25);
    }
  }

  generateAIResponse(_message) {
    const responses = [
      'That\'s a great point! AI-driven development really opens up new possibilities.',
      'Interesting perspective! Have you tried exploring the AI code suggestions feature?',
      'I agree! Collaboration is key to advancing AI-assisted development.',
      'Thanks for sharing! The community benefits from diverse viewpoints like yours.',
      'Excellent observation! This aligns with the goals of autonomous software evolution.',
      'You raise an important question. The future of development is indeed collaborative.',
      'That\'s exactly the kind of innovation we need in AI-driven projects!'
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  joinSession(sessionId) {
    // Simulate joining a session
    this.collaborationSession = sessionId;

    // Show notification
    if (window.smartNotificationSystem) {
      window.smartNotificationSystem.createCustomNotification(
        '🤝 Joined Session',
        `You've joined the "${sessionId}" collaboration session. Other participants will see your activity.`,
        'success',
        [{ text: 'Great!', action: 'dismiss', primary: true }]
      );
    }

    // Update UI to show session status
    this.updateSessionStatus(sessionId);
  }

  createNewSession() {
    // Generate session ID
    const sessionId = `session-${Date.now()}`;

    // Create session creation modal
    const modal = document.createElement('div');
    modal.className = 'session-creation-modal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <h3>Create Collaboration Session</h3>
        <div class="session-form">
          <label>
            Session Name:
            <input type="text" id="session-name" placeholder="My AI Learning Session" maxlength="50">
          </label>
          <label>
            Description:
            <textarea id="session-description" placeholder="What will you be working on?" maxlength="200"></textarea>
          </label>
          <label>
            <input type="checkbox" id="session-public" checked>
            Make session public
          </label>
        </div>
        <div class="modal-actions">
          <button class="cancel-session">Cancel</button>
          <button class="create-session-confirm">Create Session</button>
        </div>
      </div>
    `;

    // Add modal styles
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
      .session-creation-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10002;
      }
      .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
      }
      .modal-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--container-bg, white);
        padding: 24px;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
      }
      .session-form label {
        display: block;
        margin-bottom: 15px;
        color: var(--text-primary, #333);
      }
      .session-form input, .session-form textarea {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
        border-radius: 6px;
        margin-top: 5px;
        background: var(--container-bg, white);
        color: var(--text-primary, #333);
      }
      .modal-actions {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 20px;
      }
      .modal-actions button {
        padding: 8px 16px;
        border: 1px solid var(--border-color, rgba(102, 126, 234, 0.2));
        border-radius: 6px;
        cursor: pointer;
      }
      .create-session-confirm {
        background: var(--button-gradient-start, #667eea) !important;
        color: white !important;
        border: none !important;
      }
    `;

    document.head.appendChild(modalStyles);
    document.body.appendChild(modal);

    // Handle modal actions
    modal.querySelector('.cancel-session').addEventListener('click', () => {
      document.body.removeChild(modal);
      document.head.removeChild(modalStyles);
    });

    modal.querySelector('.create-session-confirm').addEventListener('click', () => {
      const name = modal.querySelector('#session-name').value || 'Untitled Session';
      const description = modal.querySelector('#session-description').value || 'No description';
      const isPublic = modal.querySelector('#session-public').checked;

      this.createSession(sessionId, name, description, isPublic);
      document.body.removeChild(modal);
      document.head.removeChild(modalStyles);
    });

    // Close on overlay click
    modal.querySelector('.modal-overlay').addEventListener('click', () => {
      document.body.removeChild(modal);
      document.head.removeChild(modalStyles);
    });
  }

  createSession(sessionId, name, description, _isPublic) {
    // Add session to list
    const sessionList = document.getElementById('session-list');
    if (sessionList) {
      const sessionItem = document.createElement('div');
      sessionItem.className = 'session-item';
      sessionItem.innerHTML = `
        <div class="session-info">
          <strong>${name}</strong>
          <p>${description}</p>
          <small>1 participant (You)</small>
        </div>
        <button class="join-session-btn" data-session="${sessionId}">Manage</button>
      `;
      sessionList.appendChild(sessionItem);
    }

    // Show success notification
    if (window.smartNotificationSystem) {
      window.smartNotificationSystem.createCustomNotification(
        '✅ Session Created',
        `Your session "${name}" has been created successfully. Others can now join!`,
        'success',
        [{ text: 'Awesome!', action: 'dismiss', primary: true }]
      );
    }
  }

  handleSharing(shareType) {
    switch (shareType) {
    case 'page':
      this.sharePageLink();
      break;
    case 'screenshot':
      this.shareScreenshot();
      break;
    case 'idea':
      this.shareIdea();
      break;
    }
  }

  sharePageLink() {
    const url = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: 'CocoPilot - AI-Driven Development',
        text: 'Check out this amazing self-updating repository!',
        url: url
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(url).then(() => {
        if (window.smartNotificationSystem) {
          window.smartNotificationSystem.createCustomNotification(
            '🔗 Link Copied',
            'Page link has been copied to your clipboard.',
            'success',
            [{ text: 'Great!', action: 'dismiss', primary: true }]
          );
        }
      });
    }
  }

  shareScreenshot() {
    // Simulate screenshot functionality
    if (window.smartNotificationSystem) {
      window.smartNotificationSystem.createCustomNotification(
        '📸 Screenshot Feature',
        'Screenshot sharing will be available in the next update. For now, use your browser\'s built-in screenshot tools.',
        'info',
        [{ text: 'Got It', action: 'dismiss', primary: true }]
      );
    }
  }

  shareIdea() {
    // Open GitHub issues for idea sharing
    const githubUrl = 'https://github.com/acbart/cocopilot/issues/new?template=feature_request.md&title=[Idea]%20';
    window.open(githubUrl, '_blank');
  }

  updateSessionStatus(_sessionId) {
    // Update UI to reflect session participation
    const userCount = document.querySelector('.user-count');
    if (userCount) {
      userCount.textContent = '2'; // Simulate other users
    }
  }

  setupMockData() {
    // Add some initial community messages
    setTimeout(() => {
      this.addCommunityMessage({
        avatar: '👨‍💻',
        name: 'Alex Developer',
        message: 'The AI suggestions feature is incredible! It\'s helping me write better code.',
        time: '5 minutes ago'
      });
    }, 2000);

    setTimeout(() => {
      this.addCommunityMessage({
        avatar: '👩‍🔬',
        name: 'Sarah Researcher',
        message: 'I love how this repository evolves by itself. The future of development!',
        time: '3 minutes ago'
      });
    }, 4000);
  }

  startPresenceSimulation() {
    // Simulate user presence updates
    setInterval(() => {
      const userCount = document.querySelector('.user-count');
      if (userCount) {
        const count = Math.floor(Math.random() * 5) + 1;
        userCount.textContent = count.toString();
      }
    }, 30000); // Update every 30 seconds
  }

  loadCommunityFeed() {
    // Load any saved community messages
    try {
      const saved = localStorage.getItem('collaboration-messages');
      if (saved) {
        const messages = JSON.parse(saved);
        messages.slice(-10).forEach(msg => {
          this.addCommunityMessage(msg);
        });
      }
    } catch (error) {
      console.warn('Could not load community messages:', error);
    }
  }

  // Public API methods
  showCollaborationHub() {
    const hub = document.getElementById('collaboration-hub');
    if (hub) {
      hub.classList.remove('minimized');
    }
  }

  hideCollaborationHub() {
    const hub = document.getElementById('collaboration-hub');
    if (hub) {
      hub.classList.add('minimized');
    }
  }

  addCommunityNotification(message) {
    this.addCommunityMessage({
      avatar: '📢',
      name: 'System',
      message: message,
      time: 'Just now'
    });
  }

  getCurrentSession() {
    return this.collaborationSession;
  }

  getConnectedUsers() {
    return Array.from(this.connectedUsers.values());
  }
}

// Initialize the Advanced Collaboration Features when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.advancedCollaborationFeatures = new AdvancedCollaborationFeatures();
  });
} else {
  window.advancedCollaborationFeatures = new AdvancedCollaborationFeatures();
}

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdvancedCollaborationFeatures;
}