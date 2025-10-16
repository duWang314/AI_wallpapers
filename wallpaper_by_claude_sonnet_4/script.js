class CosmicWallpaper {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.isParticlesEnabled = true;
        this.currentTheme = 'default';
        this.constellationLines = [];
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.createParticles();
        this.setupEventListeners();
        this.startAnimationLoop();
        this.initializeTime();
        this.createCustomCursor();
        this.setupInteractiveElements();
    }
    
    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
      createParticles() {
        const particleCount = 150;
        this.particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.8 + 0.2,
                color: this.getRandomColor(),
                originalSize: 0,
                pulseSpeed: Math.random() * 0.02 + 0.01,
                life: Infinity, // 初始粒子永久存在
                maxLife: Infinity,
                friction: 0.98, // 阻力系数
                isTemporary: false // 标记是否为临时粒子
            });
            this.particles[i].originalSize = this.particles[i].size;
        }
    }
    
    getRandomColor() {
        const colors = [
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', 
            '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
      drawParticles() {
        if (!this.isParticlesEnabled) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections between nearby particles
        this.drawConnections();
        
        // Draw and update particles
        this.particles.forEach((particle, index) => {
            // 生命周期管理
            if (particle.isTemporary) {
                particle.life--;
                if (particle.life <= 0) {
                    // 标记为删除
                    particle.toDelete = true;
                    return;
                }
                // 临时粒子逐渐变透明
                particle.opacity = Math.max(0, particle.life / particle.maxLife);
            }
            
            // Mouse interaction
            const dx = this.mouseX - particle.x;
            const dy = this.mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                // 限制最大加速度
                const maxForce = 0.0005;
                particle.vx += dx * force * maxForce;
                particle.vy += dy * force * maxForce;
                particle.size = particle.originalSize * (1 + force * 0.5);
            } else {
                particle.size = particle.originalSize;
            }
            
            // 应用阻力
            particle.vx *= particle.friction;
            particle.vy *= particle.friction;
            
            // 速度限制
            const maxVelocity = 3;
            const currentSpeed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
            if (currentSpeed > maxVelocity) {
                particle.vx = (particle.vx / currentSpeed) * maxVelocity;
                particle.vy = (particle.vy / currentSpeed) * maxVelocity;
            }
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Boundary check with bounce dampening
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -0.8; // 碰撞时减少速度
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -0.8; // 碰撞时减少速度
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            }
            
            // Pulse effect
            if (!particle.isTemporary) {
                particle.opacity = 0.5 + Math.sin(Date.now() * particle.pulseSpeed) * 0.3;
            }
            
            // Draw particle
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
          // 清理过期的粒子
        this.cleanupParticles();
    }
    
    // 清理过期粒子的方法
    cleanupParticles() {
        this.particles = this.particles.filter(particle => !particle.toDelete);
        
        // 如果粒子数量超过最大限制，删除最老的临时粒子
        const maxParticles = 300;
        if (this.particles.length > maxParticles) {
            const temporaryParticles = this.particles.filter(p => p.isTemporary);
            const permanentParticles = this.particles.filter(p => !p.isTemporary);
            
            // 保留永久粒子，删除超出的临时粒子
            if (temporaryParticles.length > 0) {
                const excessCount = this.particles.length - maxParticles;
                temporaryParticles.splice(0, excessCount);
                this.particles = [...permanentParticles, ...temporaryParticles];
            }
        }
        
        // 定期重置过快的粒子速度
        this.particles.forEach(particle => {
            const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
            if (speed > 5) {
                particle.vx *= 0.5;
                particle.vy *= 0.5;
            }
        });
    }
    
    drawConnections() {
        this.particles.forEach((particle, i) => {
            this.particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 80) {
                    this.ctx.save();
                    this.ctx.globalAlpha = (80 - distance) / 80 * 0.3;
                    this.ctx.strokeStyle = '#ffffff';
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.stroke();
                    this.ctx.restore();
                }
            });
        });
    }
    
    setupEventListeners() {
        // Mouse movement
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.updateCustomCursor(e.clientX, e.clientY);
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.createParticles();
        });
        
        // Control buttons
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });
        
        document.getElementById('particleToggle').addEventListener('click', () => {
            this.toggleParticles();
        });
        
        document.getElementById('musicToggle').addEventListener('click', () => {
            this.toggleMusicVisualizer();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    this.createRippleEffect(this.mouseX, this.mouseY);
                    break;
                case 'r':
                    this.resetParticles();
                    break;
                case 't':
                    this.toggleTheme();
                    break;
            }
        });
        
        // Click effects
        document.addEventListener('click', (e) => {
            this.createRippleEffect(e.clientX, e.clientY);
            this.createParticleBurst(e.clientX, e.clientY);
        });
    }
    
    createRippleEffect(x, y) {
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = '10px';
        ripple.style.height = '10px';
        ripple.style.border = '2px solid #00ffff';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '1000';
        ripple.style.animation = 'ripple 1s ease-out forwards';
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            document.body.removeChild(ripple);
        }, 1000);
        
        // Add CSS animation if not exists
        if (!document.querySelector('#rippleStyle')) {
            const style = document.createElement('style');
            style.id = 'rippleStyle';
            style.textContent = `
                @keyframes ripple {
                    to {
                        width: 100px;
                        height: 100px;
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
      createParticleBurst(x, y) {
        const maxParticles = 300; // 限制最大粒子数量
        const burstCount = Math.min(8, maxParticles - this.particles.length); // 减少爆炸粒子数量
        
        for (let i = 0; i < burstCount; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4, // 减少初始速度
                vy: (Math.random() - 0.5) * 4,
                size: Math.random() * 3 + 1, // 减少粒子大小
                opacity: 1,
                color: this.getRandomColor(),
                originalSize: Math.random() * 3 + 1,
                pulseSpeed: Math.random() * 0.02 + 0.01,
                life: 120, // 生命周期2秒 (60fps * 2)
                maxLife: 120,
                friction: 0.95, // 更强的阻力
                isTemporary: true // 标记为临时粒子
            });
        }
    }
    
    setupInteractiveElements() {
        // Setup constellation interactions
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                this.toggleStarConnection(star);
            });
            
            star.addEventListener('mouseenter', () => {
                star.style.transform = 'scale(2)';
                star.style.boxShadow = '0 0 20px #4ecdc4';
            });
            
            star.addEventListener('mouseleave', () => {
                if (!star.classList.contains('connected')) {
                    star.style.transform = 'scale(1)';
                    star.style.boxShadow = '0 0 10px white';
                }
            });
        });
        
        // Setup floating elements interactions
        const orbs = document.querySelectorAll('.orb');
        orbs.forEach(orb => {
            orb.addEventListener('click', () => {
                orb.style.animation = 'none';
                orb.style.transform = 'scale(1.5)';
                setTimeout(() => {
                    orb.style.animation = 'float 6s ease-in-out infinite';
                    orb.style.transform = 'scale(1)';
                }, 500);
            });
        });
    }
    
    toggleStarConnection(star) {
        star.classList.toggle('connected');
        if (star.classList.contains('connected')) {
            star.style.background = '#4ecdc4';
            star.style.boxShadow = '0 0 15px #4ecdc4';
        } else {
            star.style.background = 'white';
            star.style.boxShadow = '0 0 10px white';
        }
    }
    
    createCustomCursor() {
        const cursor = document.createElement('div');
        cursor.className = 'cursor';
        document.body.appendChild(cursor);
        this.cursor = cursor;
    }
    
    updateCustomCursor(x, y) {
        if (this.cursor) {
            this.cursor.style.left = x + 'px';
            this.cursor.style.top = y + 'px';
        }
    }
    
    toggleTheme() {
        const container = document.querySelector('.wallpaper-container');
        const themeBtn = document.getElementById('themeToggle');
        
        if (this.currentTheme === 'default') {
            container.className = 'wallpaper-container dark-theme';
            this.currentTheme = 'dark';
            themeBtn.textContent = '☀️';
        } else if (this.currentTheme === 'dark') {
            container.className = 'wallpaper-container light-theme';
            this.currentTheme = 'light';
            themeBtn.textContent = '🌙';
        } else {
            container.className = 'wallpaper-container';
            this.currentTheme = 'default';
            themeBtn.textContent = '🌙';
        }
    }
    
    toggleParticles() {
        this.isParticlesEnabled = !this.isParticlesEnabled;
        const btn = document.getElementById('particleToggle');
        btn.textContent = this.isParticlesEnabled ? '✨' : '💫';
        
        if (!this.isParticlesEnabled) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    
    toggleMusicVisualizer() {
        const visualizer = document.querySelector('.audio-visualizer');
        const btn = document.getElementById('musicToggle');
        
        if (visualizer.style.display === 'none') {
            visualizer.style.display = 'flex';
            btn.textContent = '🎵';
        } else {
            visualizer.style.display = 'none';
            btn.textContent = '🔇';
        }
    }
    
    resetParticles() {
        this.createParticles();
    }
    
    initializeTime() {
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
    }
    
    updateTime() {
        const now = new Date();
        const timeElement = document.getElementById('currentTime');
        const dateElement = document.getElementById('currentDate');
        
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        
        timeElement.textContent = `${hours}:${minutes}:${seconds}`;
        
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        dateElement.textContent = `${year}年${month}月${day}日`;
    }
    
    startAnimationLoop() {
        const animate = () => {
            this.drawParticles();
            this.updateFloatingElements();
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    updateFloatingElements() {
        // Update geometric shapes rotation based on mouse position
        const shapes = document.querySelectorAll('.shape');
        shapes.forEach((shape, index) => {
            const factor = (this.mouseX / window.innerWidth) * 2 - 1;
            const rotation = factor * 30 + (index * 45);
            shape.style.transform = `rotate(${rotation}deg)`;
        });
        
        // Update nebula position slightly based on mouse
        const nebulas = document.querySelectorAll('.nebula');
        nebulas.forEach((nebula, index) => {
            const offsetX = (this.mouseX / window.innerWidth - 0.5) * 20;
            const offsetY = (this.mouseY / window.innerHeight - 0.5) * 20;
            nebula.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${1 + index * 0.1})`;
        });
    }
}

// Initialize the wallpaper when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CosmicWallpaper();
    
    // Add some interactive tips
    console.log('🌟 Interactive Cosmic Wallpaper Controls:');
    console.log('• Click anywhere for ripple effects');
    console.log('• Press SPACE for ripple at cursor');
    console.log('• Press R to reset particles');
    console.log('• Press T to toggle theme');
    console.log('• Click stars to connect constellations');
    console.log('• Hover over elements for interactions');
});

// Performance optimization
let ticking = false;
function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateAnimation);
        ticking = true;
    }
}

function updateAnimation() {
    ticking = false;
}

// Prevent context menu on right click for cleaner experience
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});
