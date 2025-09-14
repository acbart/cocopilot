/**
 * Enhanced Mobile Experience for CocoPilot
 * Provides advanced touch interactions and mobile-specific optimizations
 */

class MobileExperienceEnhancer {
    constructor() {
        this.isMobile = this.detectMobile();
        this.touchStartY = 0;
        this.touchStartX = 0;
        this.currentTouch = null;
        this.lastTap = 0;
        this.init();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
            || window.innerWidth <= 768;
    }

    init() {
        if (this.isMobile) {
            this.enhanceMobileInterface();
            this.addTouchGestures();
            this.optimizeForMobile();
            this.addMobileFeatures();
        }
        
        // Listen for orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.handleOrientationChange(), 100);
        });

        // Listen for viewport changes
        window.addEventListener('resize', () => this.handleViewportChange());
    }

    enhanceMobileInterface() {
        // Add mobile-specific CSS
        const mobileStyles = document.createElement('style');
        mobileStyles.textContent = `
            /* Enhanced Mobile Styles */
            @media (max-width: 768px) {
                /* Improved touch targets */
                .btn, .share-btn, .theme-toggle, .help-tour-btn, .language-toggle {
                    min-height: 44px;
                    min-width: 44px;
                    padding: 12px 16px;
                }

                /* Better mobile spacing */
                .container {
                    padding: 20px 15px;
                    margin: 5px;
                }

                /* Enhanced mobile navigation */
                .cta {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    align-items: stretch;
                }

                .btn {
                    width: 100%;
                    text-align: center;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                /* Mobile-optimized cards */
                .feature, .about-section {
                    margin: 15px 0;
                    padding: 20px 15px;
                }

                /* Touch-friendly social sharing */
                .social-share {
                    flex-direction: column;
                    gap: 12px;
                    align-items: stretch;
                }

                .share-btn {
                    width: 100%;
                    justify-content: center;
                    padding: 15px;
                    font-size: 1rem;
                }

                /* Mobile timeline improvements */
                .commit-item {
                    padding: 15px 10px;
                    margin-bottom: 15px;
                }

                .commit-header {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 8px;
                }

                /* Better mobile stats */
                .repo-stats {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                    margin: 20px 0;
                }

                .stat-item {
                    padding: 12px 15px;
                    font-size: 0.95rem;
                    justify-content: center;
                    text-align: center;
                }

                /* Mobile-optimized modals */
                .search-modal-content,
                .language-dropdown {
                    width: 95%;
                    margin: 0 auto;
                    border-radius: 12px;
                }

                /* Enhanced mobile typography */
                h1 {
                    font-size: 2.2rem;
                    line-height: 1.2;
                }

                .subtitle {
                    font-size: 1.1rem;
                    margin-bottom: 25px;
                }

                .description {
                    font-size: 1rem;
                    line-height: 1.6;
                }

                /* Mobile-specific animations */
                .feature:hover {
                    transform: none;
                }

                .btn:hover {
                    transform: none;
                }

                /* Touch feedback */
                .btn:active,
                .share-btn:active,
                .feature:active {
                    transform: scale(0.98);
                    transition: transform 0.1s ease;
                }

                /* Mobile-optimized floating elements */
                .floating-element {
                    animation-duration: 25s;
                    opacity: 0.05;
                }

                /* Better mobile footer */
                .footer-links {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                    text-align: center;
                }

                .footer-links a {
                    padding: 12px 8px;
                    border-radius: 8px;
                    font-size: 0.9rem;
                }
            }

            /* Touch-specific enhancements */
            .touch-device .feature {
                cursor: default;
            }

            .touch-device .btn:hover {
                transform: none;
            }

            .mobile-only {
                display: none;
            }

            @media (max-width: 768px) {
                .mobile-only {
                    display: block;
                }

                .desktop-only {
                    display: none;
                }
            }

            /* Swipe indicators */
            .swipe-indicator {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(102, 126, 234, 0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 20px;
                font-size: 0.8rem;
                pointer-events: none;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .swipe-indicator.left {
                left: 20px;
            }

            .swipe-indicator.right {
                right: 20px;
            }

            .swipe-indicator.show {
                opacity: 1;
            }

            /* Pull-to-refresh indicator */
            .pull-to-refresh {
                position: fixed;
                top: -60px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--container-bg);
                border: 2px solid var(--border-color);
                border-radius: 15px;
                padding: 10px 20px;
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 0.9rem;
                color: var(--text-primary);
                z-index: 1001;
                transition: transform 0.3s ease;
            }

            .pull-to-refresh.visible {
                transform: translateX(-50%) translateY(80px);
            }

            .pull-to-refresh .spinner {
                animation: spin 1s linear infinite;
            }

            /* Mobile-specific performance optimizations */
            @media (max-width: 768px) {
                .background-animation {
                    display: none;
                }

                .floating-element {
                    animation: none;
                }

                * {
                    -webkit-tap-highlight-color: rgba(102, 126, 234, 0.2);
                }
            }
        `;
        document.head.appendChild(mobileStyles);
    }

    addTouchGestures() {
        // Add swipe gestures for timeline navigation
        const timeline = document.querySelector('.evolution-section');
        if (timeline) {
            this.addSwipeSupport(timeline);
        }

        // Add pull-to-refresh
        this.addPullToRefresh();

        // Add double-tap to toggle theme
        this.addDoubleTapThemeToggle();

        // Add long press for context menus
        this.addLongPressSupport();
    }

    addSwipeSupport(element) {
        let startX = 0;
        let startY = 0;
        let distX = 0;
        let distY = 0;
        let threshold = 50;
        let restraint = 100;

        element.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX;
            startY = e.touches[0].pageY;
        }, { passive: true });

        element.addEventListener('touchmove', (e) => {
            distX = e.touches[0].pageX - startX;
            distY = e.touches[0].pageY - startY;

            // Show swipe indicators
            if (Math.abs(distX) > 20 && Math.abs(distY) < restraint) {
                this.showSwipeIndicator(distX > 0 ? 'right' : 'left');
            }
        }, { passive: true });

        element.addEventListener('touchend', () => {
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
                if (distX > 0) {
                    this.navigateTimeline('prev');
                } else {
                    this.navigateTimeline('next');
                }
            }
            this.hideSwipeIndicators();
        });
    }

    addPullToRefresh() {
        let startY = 0;
        let pullDistance = 0;
        let isPulling = false;
        const pullThreshold = 100;

        // Create pull-to-refresh indicator
        const pullIndicator = document.createElement('div');
        pullIndicator.className = 'pull-to-refresh';
        pullIndicator.innerHTML = `
            <div class="spinner">🔄</div>
            <span>Pull to refresh</span>
        `;
        document.body.appendChild(pullIndicator);

        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].pageY;
                isPulling = true;
            }
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (isPulling && window.scrollY === 0) {
                pullDistance = e.touches[0].pageY - startY;
                
                if (pullDistance > 0) {
                    e.preventDefault();
                    
                    if (pullDistance > 20) {
                        pullIndicator.classList.add('visible');
                        pullIndicator.style.transform = `translateX(-50%) translateY(${Math.min(pullDistance, pullThreshold)}px)`;
                        
                        if (pullDistance >= pullThreshold) {
                            pullIndicator.innerHTML = `
                                <div class="spinner">✨</div>
                                <span>Release to refresh</span>
                            `;
                        }
                    }
                }
            }
        });

        document.addEventListener('touchend', () => {
            if (isPulling && pullDistance >= pullThreshold) {
                this.handleRefresh();
            }
            
            isPulling = false;
            pullDistance = 0;
            pullIndicator.classList.remove('visible');
            pullIndicator.innerHTML = `
                <div class="spinner">🔄</div>
                <span>Pull to refresh</span>
            `;
        });
    }

    addDoubleTapThemeToggle() {
        document.addEventListener('touchend', (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - this.lastTap;
            
            if (tapLength < 500 && tapLength > 0) {
                // Double tap detected
                if (e.target.closest('.container') && !e.target.closest('button') && !e.target.closest('a')) {
                    if (typeof toggleTheme === 'function') {
                        toggleTheme();
                        this.showMobileToast('Theme toggled');
                    }
                }
            }
            this.lastTap = currentTime;
        });
    }

    addLongPressSupport() {
        let pressTimer;

        document.addEventListener('touchstart', (e) => {
            pressTimer = setTimeout(() => {
                if (e.target.closest('.feature')) {
                    this.showFeatureDetails(e.target.closest('.feature'));
                }
            }, 800);
        });

        document.addEventListener('touchend', () => {
            clearTimeout(pressTimer);
        });

        document.addEventListener('touchmove', () => {
            clearTimeout(pressTimer);
        });
    }

    optimizeForMobile() {
        // Add touch device class
        document.body.classList.add('touch-device');

        // Optimize viewport
        this.optimizeViewport();

        // Reduce animations for better performance
        if (this.isMobile) {
            this.reduceAnimations();
        }

        // Add mobile-specific meta tags
        this.addMobileMeta();
    }

    addMobileFeatures() {
        // Add mobile toolbar
        this.createMobileToolbar();

        // Add quick actions
        this.addQuickActions();

        // Add mobile-specific keyboard shortcuts
        this.addMobileKeyboardShortcuts();
    }

    createMobileToolbar() {
        const toolbar = document.createElement('div');
        toolbar.className = 'mobile-toolbar mobile-only';
        toolbar.innerHTML = `
            <div class="mobile-toolbar-content">
                <button type="button" class="mobile-action" onclick="window.scrollTo({top: 0, behavior: 'smooth'})" title="Scroll to top">
                    ⬆️
                </button>
                <button type="button" class="mobile-action" onclick="advancedSearch?.openSearch()" title="Search">
                    🔍
                </button>
                <button type="button" class="mobile-action" onclick="toggleTheme()" title="Toggle theme">
                    🌙
                </button>
                <button type="button" class="mobile-action" onclick="this.shareNative()" title="Share">
                    📤
                </button>
            </div>
        `;

        // Add toolbar styles
        const toolbarStyles = document.createElement('style');
        toolbarStyles.textContent = `
            .mobile-toolbar {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--container-bg);
                border: 2px solid var(--border-color);
                border-radius: 25px;
                padding: 8px 12px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
                backdrop-filter: blur(10px);
                z-index: 1000;
            }

            .mobile-toolbar-content {
                display: flex;
                gap: 15px;
                align-items: center;
            }

            .mobile-action {
                background: none;
                border: none;
                font-size: 1.2rem;
                padding: 8px;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.2s ease;
                color: var(--text-primary);
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .mobile-action:active {
                transform: scale(0.9);
                background: var(--feature-bg);
            }
        `;
        document.head.appendChild(toolbarStyles);
        document.body.appendChild(toolbar);
    }

    addQuickActions() {
        // Add quick action gestures
        const quickActions = {
            'three-finger-tap': () => this.showQuickMenu(),
            'edge-swipe-right': () => this.openSidebar(),
            'edge-swipe-left': () => this.closeSidebar()
        };

        // Implement gesture detection
        this.detectMultiTouch();
    }

    detectMultiTouch() {
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length === 3) {
                // Three finger tap
                setTimeout(() => {
                    if (e.touches.length === 3) {
                        this.showQuickMenu();
                    }
                }, 200);
            }
        });
    }

    showQuickMenu() {
        const quickMenu = document.createElement('div');
        quickMenu.className = 'quick-menu';
        quickMenu.innerHTML = `
            <div class="quick-menu-content">
                <h4>Quick Actions</h4>
                <div class="quick-actions">
                    <button onclick="window.open('https://github.com/acbart/cocopilot', '_blank')">📱 View on GitHub</button>
                    <button onclick="handleRSSFeed()">📡 RSS Feed</button>
                    <button onclick="toggleTheme()">🌙 Toggle Theme</button>
                    <button onclick="this.shareNative()">📤 Share</button>
                </div>
                <button class="close-quick-menu" onclick="this.parentElement.parentElement.remove()">Close</button>
            </div>
        `;

        const menuStyles = document.createElement('style');
        menuStyles.textContent = `
            .quick-menu {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }

            .quick-menu-content {
                background: var(--container-bg);
                border-radius: 15px;
                padding: 25px;
                width: 90%;
                max-width: 300px;
                text-align: center;
            }

            .quick-actions {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin: 20px 0;
            }

            .quick-actions button {
                background: var(--feature-bg);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                padding: 12px;
                color: var(--text-primary);
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .quick-actions button:active {
                transform: scale(0.98);
                background: var(--border-color);
            }

            .close-quick-menu {
                background: var(--button-gradient-start);
                color: white;
                border: none;
                border-radius: 8px;
                padding: 10px 20px;
                cursor: pointer;
                margin-top: 15px;
            }
        `;
        document.head.appendChild(menuStyles);
        document.body.appendChild(quickMenu);

        // Remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(quickMenu)) {
                quickMenu.remove();
            }
        }, 5000);
    }

    addMobileKeyboardShortcuts() {
        // Volume buttons for navigation (if supported)
        document.addEventListener('keydown', (e) => {
            if (this.isMobile) {
                switch(e.code) {
                    case 'VolumeUp':
                        e.preventDefault();
                        this.navigateTimeline('next');
                        break;
                    case 'VolumeDown':
                        e.preventDefault();
                        this.navigateTimeline('prev');
                        break;
                }
            }
        });
    }

    // Helper methods
    showSwipeIndicator(direction) {
        const indicator = document.createElement('div');
        indicator.className = `swipe-indicator ${direction} show`;
        indicator.textContent = direction === 'left' ? '← Previous' : 'Next →';
        document.body.appendChild(indicator);

        setTimeout(() => indicator.remove(), 1000);
    }

    hideSwipeIndicators() {
        document.querySelectorAll('.swipe-indicator').forEach(el => el.remove());
    }

    navigateTimeline(direction) {
        const nextBtn = document.querySelector('button[onclick*="next"]');
        const prevBtn = document.querySelector('button[onclick*="prev"]');
        
        if (direction === 'next' && nextBtn && !nextBtn.disabled) {
            nextBtn.click();
        } else if (direction === 'prev' && prevBtn && !prevBtn.disabled) {
            prevBtn.click();
        }
    }

    handleRefresh() {
        // Refresh repository stats and activity
        if (typeof fetchRepoStats === 'function') {
            fetchRepoStats();
        }
        
        // Refresh GitHub activity
        const activitySection = document.getElementById('github-activity');
        if (activitySection && window.githubActivity) {
            window.githubActivity.loadActivity();
        }

        this.showMobileToast('Refreshed successfully');
    }

    showFeatureDetails(featureElement) {
        const title = featureElement.querySelector('.feature-title')?.textContent;
        const description = featureElement.querySelector('.feature-desc')?.textContent;
        
        if (title && description) {
            this.showMobileToast(`${title}: ${description}`, 3000);
        }
    }

    showMobileToast(message, duration = 2000) {
        const toast = document.createElement('div');
        toast.className = 'mobile-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--container-bg);
            border: 2px solid var(--border-color);
            border-radius: 10px;
            padding: 15px 20px;
            color: var(--text-primary);
            z-index: 10001;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
            animation: slideInUp 0.3s ease;
            max-width: 80%;
            text-align: center;
        `;

        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), duration);
    }

    shareNative() {
        if (navigator.share) {
            navigator.share({
                title: 'CocoPilot - Self-Updating Repository',
                text: 'Check out this AI-powered repository that evolves daily!',
                url: window.location.href
            }).catch(console.error);
        } else {
            // Fallback to copy URL
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showMobileToast('URL copied to clipboard');
            });
        }
    }

    optimizeViewport() {
        // Ensure proper viewport configuration
        let viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
        }
    }

    reduceAnimations() {
        // Reduce animations for better performance on mobile
        const reducedAnimationStyle = document.createElement('style');
        reducedAnimationStyle.textContent = `
            @media (max-width: 768px) {
                .floating-element {
                    animation: none !important;
                }
                
                .background-animation {
                    display: none !important;
                }
                
                * {
                    animation-duration: 0.2s !important;
                    transition-duration: 0.2s !important;
                }
            }
        `;
        document.head.appendChild(reducedAnimationStyle);
    }

    addMobileMeta() {
        // Add mobile-specific meta tags
        const metaTags = [
            { name: 'mobile-web-app-capable', content: 'yes' },
            { name: 'apple-mobile-web-app-capable', content: 'yes' },
            { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
            { name: 'format-detection', content: 'telephone=no' }
        ];

        metaTags.forEach(tag => {
            if (!document.querySelector(`meta[name="${tag.name}"]`)) {
                const meta = document.createElement('meta');
                meta.name = tag.name;
                meta.content = tag.content;
                document.head.appendChild(meta);
            }
        });
    }

    handleOrientationChange() {
        // Handle orientation changes
        const isLandscape = window.orientation === 90 || window.orientation === -90;
        document.body.classList.toggle('landscape', isLandscape);
        
        // Adjust interface for landscape mode
        if (isLandscape) {
            this.optimizeForLandscape();
        } else {
            this.optimizeForPortrait();
        }
    }

    optimizeForLandscape() {
        // Landscape-specific optimizations
        const landscapeStyle = document.createElement('style');
        landscapeStyle.id = 'landscape-styles';
        landscapeStyle.textContent = `
            .landscape .container {
                max-width: 90%;
                padding: 20px 30px;
            }

            .landscape .features {
                grid-template-columns: repeat(3, 1fr);
            }

            .landscape .repo-stats {
                grid-template-columns: repeat(4, 1fr);
            }

            .landscape .mobile-toolbar {
                right: 20px;
                left: auto;
                transform: none;
                flex-direction: column;
            }
        `;
        document.head.appendChild(landscapeStyle);
    }

    optimizeForPortrait() {
        // Remove landscape styles
        const landscapeStyles = document.getElementById('landscape-styles');
        if (landscapeStyles) {
            landscapeStyles.remove();
        }
    }

    handleViewportChange() {
        // Update mobile detection on viewport change
        const wasMobile = this.isMobile;
        this.isMobile = this.detectMobile();
        
        if (this.isMobile !== wasMobile) {
            if (this.isMobile) {
                this.enhanceMobileInterface();
                this.addMobileFeatures();
            }
        }
    }
}

// Initialize mobile experience enhancer
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.mobileExperienceEnhancer = new MobileExperienceEnhancer();
    });
} else {
    window.mobileExperienceEnhancer = new MobileExperienceEnhancer();
}

// Add mobile-specific CSS animations
const mobileAnimationStyle = document.createElement('style');
mobileAnimationStyle.textContent = `
    @keyframes slideInUp {
        from {
            transform: translate(-50%, 20px);
            opacity: 0;
        }
        to {
            transform: translate(-50%, -50%);
            opacity: 1;
        }
    }

    @keyframes slideInDown {
        from {
            transform: translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(mobileAnimationStyle);