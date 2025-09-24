/**
 * Floating Particles Visual Enhancement
 * Adds subtle animated particles to enhance the visual experience
 */

class FloatingParticles {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animationId = null;
    this.isActive = false;
    
    // Configuration
    this.config = {
      particleCount: this.getOptimalParticleCount(),
      particleSize: { min: 1, max: 3 },
      speed: { min: 0.2, max: 0.8 },
      opacity: { min: 0.1, max: 0.6 },
      colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c'],
      connectionDistance: 100,
      mouse: { x: 0, y: 0, radius: 100 },
      enableConnections: !this.isMobileDevice(),
      enableMouseInteraction: !this.isMobileDevice()
    };
    
    this.boundHandleResize = this.handleResize.bind(this);
    this.boundHandleMouseMove = this.handleMouseMove.bind(this);
    this.boundHandleVisibilityChange = this.handleVisibilityChange.bind(this);
  }

  async initialize() {
    try {
      console.log('✨ Initializing floating particles...');
      
      // Check if animations should be disabled due to user preferences
      if (this.shouldDisableAnimations()) {
        console.log('⏸️ Animations disabled due to user preferences');
        return;
      }
      
      // Create canvas
      this.createCanvas();
      
      // Initialize particles
      this.createParticles();
      
      // Set up event listeners
      this.attachEventListeners();
      
      // Start animation
      this.startAnimation();
      
      this.isActive = true;
      console.log('✅ Floating particles initialized');
      
    } catch (error) {
      console.error('❌ Error initializing floating particles:', error);
    }
  }

  shouldDisableAnimations() {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Disable on very slow connections
    const isSlowConnection = navigator.connection && 
                           (navigator.connection.effectiveType === 'slow-2g' || 
                            navigator.connection.effectiveType === '2g');
    
    // Disable on low-end devices (approximation)
    const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    
    return prefersReducedMotion || isSlowConnection || isLowEndDevice;
  }

  getOptimalParticleCount() {
    const baseCount = 50;
    const screenArea = window.innerWidth * window.innerHeight;
    const scaleFactor = Math.min(screenArea / (1920 * 1080), 1);
    
    if (this.isMobileDevice()) {
      return Math.floor(baseCount * 0.5 * scaleFactor);
    }
    
    return Math.floor(baseCount * scaleFactor);
  }

  isMobileDevice() {
    return window.innerWidth < 768 || 'ontouchstart' in window;
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'floating-particles-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
      opacity: 0.7;
    `;
    
    // Insert canvas as first child of body so it appears behind all content
    document.body.insertBefore(this.canvas, document.body.firstChild);
    
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
  }

  resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    
    this.ctx.scale(dpr, dpr);
    
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
  }

  createParticles() {
    this.particles = [];
    
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * (this.config.speed.max - this.config.speed.min) + this.config.speed.min,
      vy: (Math.random() - 0.5) * (this.config.speed.max - this.config.speed.min) + this.config.speed.min,
      size: Math.random() * (this.config.particleSize.max - this.config.particleSize.min) + this.config.particleSize.min,
      opacity: Math.random() * (this.config.opacity.max - this.config.opacity.min) + this.config.opacity.min,
      color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
      life: Math.random() * 100,
      maxLife: 100 + Math.random() * 100
    };
  }

  updateParticles() {
    this.particles.forEach((particle, index) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Update life
      particle.life += 1;
      
      // Wrap around screen edges
      if (particle.x < 0) particle.x = window.innerWidth;
      if (particle.x > window.innerWidth) particle.x = 0;
      if (particle.y < 0) particle.y = window.innerHeight;
      if (particle.y > window.innerHeight) particle.y = 0;
      
      // Mouse interaction (if enabled)
      if (this.config.enableMouseInteraction) {
        const dx = this.config.mouse.x - particle.x;
        const dy = this.config.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.config.mouse.radius) {
          const force = (this.config.mouse.radius - distance) / this.config.mouse.radius;
          particle.vx += (dx / distance) * force * 0.01;
          particle.vy += (dy / distance) * force * 0.01;
        }
      }
      
      // Regenerate particle if it's too old
      if (particle.life > particle.maxLife) {
        this.particles[index] = this.createParticle();
      }
    });
  }

  drawParticles() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw particles
    this.particles.forEach(particle => {
      this.ctx.save();
      
      // Apply opacity based on life
      const lifeRatio = 1 - (particle.life / particle.maxLife);
      const currentOpacity = particle.opacity * lifeRatio;
      
      this.ctx.globalAlpha = currentOpacity;
      this.ctx.fillStyle = particle.color;
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.restore();
    });
    
    // Draw connections (if enabled)
    if (this.config.enableConnections) {
      this.drawConnections();
    }
  }

  drawConnections() {
    this.ctx.save();
    this.ctx.strokeStyle = this.config.colors[0];
    this.ctx.lineWidth = 0.5;
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const particle1 = this.particles[i];
        const particle2 = this.particles[j];
        
        const dx = particle1.x - particle2.x;
        const dy = particle1.y - particle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.config.connectionDistance) {
          const opacity = (1 - distance / this.config.connectionDistance) * 0.3;
          this.ctx.globalAlpha = opacity;
          
          this.ctx.beginPath();
          this.ctx.moveTo(particle1.x, particle1.y);
          this.ctx.lineTo(particle2.x, particle2.y);
          this.ctx.stroke();
        }
      }
    }
    
    this.ctx.restore();
  }

  animate() {
    if (!this.isActive) return;
    
    this.updateParticles();
    this.drawParticles();
    
    this.animationId = requestAnimationFrame(this.animate.bind(this));
  }

  startAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    this.animate();
  }

  stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  attachEventListeners() {
    window.addEventListener('resize', this.boundHandleResize);
    
    if (this.config.enableMouseInteraction) {
      document.addEventListener('mousemove', this.boundHandleMouseMove);
    }
    
    document.addEventListener('visibilitychange', this.boundHandleVisibilityChange);
    
    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          this.updateTheme();
        }
      });
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  }

  handleResize() {
    this.resizeCanvas();
    
    // Update particle count based on new screen size
    const newParticleCount = this.getOptimalParticleCount();
    if (newParticleCount !== this.particles.length) {
      this.config.particleCount = newParticleCount;
      this.createParticles();
    }
  }

  handleMouseMove(e) {
    this.config.mouse.x = e.clientX;
    this.config.mouse.y = e.clientY;
  }

  handleVisibilityChange() {
    if (document.hidden) {
      this.stopAnimation();
    } else {
      this.startAnimation();
    }
  }

  updateTheme() {
    // Update particle colors based on theme
    const isDarkMode = document.documentElement.dataset.theme === 'dark';
    
    if (isDarkMode) {
      this.config.colors = ['#667eea', '#764ba2', '#11998e', '#2d1b69'];
      this.canvas.style.opacity = '0.4';
    } else {
      this.config.colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c'];
      this.canvas.style.opacity = '0.7';
    }
  }

  // Public methods
  setParticleCount(count) {
    this.config.particleCount = Math.max(10, Math.min(200, count));
    this.createParticles();
  }

  setOpacity(opacity) {
    this.canvas.style.opacity = Math.max(0, Math.min(1, opacity));
  }

  toggleConnections() {
    this.config.enableConnections = !this.config.enableConnections;
  }

  toggleMouseInteraction() {
    this.config.enableMouseInteraction = !this.config.enableMouseInteraction;
    
    if (this.config.enableMouseInteraction) {
      document.addEventListener('mousemove', this.boundHandleMouseMove);
    } else {
      document.removeEventListener('mousemove', this.boundHandleMouseMove);
    }
  }

  destroy() {
    this.isActive = false;
    this.stopAnimation();
    
    window.removeEventListener('resize', this.boundHandleResize);
    document.removeEventListener('mousemove', this.boundHandleMouseMove);
    document.removeEventListener('visibilitychange', this.boundHandleVisibilityChange);
    
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    
    console.log('🗑️ Floating particles destroyed');
  }

  // Performance monitoring
  getPerformanceMetrics() {
    return {
      particleCount: this.particles.length,
      isActive: this.isActive,
      canvasSize: {
        width: this.canvas?.width || 0,
        height: this.canvas?.height || 0
      },
      features: {
        connections: this.config.enableConnections,
        mouseInteraction: this.config.enableMouseInteraction
      }
    };
  }
}

// Initialize floating particles when DOM is ready
function initializeFloatingParticles() {
  // Only initialize if not already done
  if (window.floatingParticles) {
    return;
  }
  
  window.floatingParticles = new FloatingParticles();
  
  // Initialize with a delay to avoid blocking initial page load
  setTimeout(() => {
    window.floatingParticles.initialize();
  }, 1000);
}

// Initialize based on document state
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFloatingParticles);
} else {
  initializeFloatingParticles();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FloatingParticles;
}