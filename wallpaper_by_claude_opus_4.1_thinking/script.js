// 粒子系统
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 10000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                hue: Math.random() * 60 + 180 // 青色到紫色范围
            });
        }
    }

    updateParticles() {
        this.particles.forEach(particle => {
            // 基础运动
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // 鼠标交互
            const dx = this.mouseX - particle.x;
            const dy = this.mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.x -= dx * force * 0.03;
                particle.y -= dy * force * 0.03;
            }
            
            // 边界检测
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.speedX *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.speedY *= -1;
            }
            
            // 限制粒子在画布内
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
        });
    }

    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制粒子
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(${particle.hue}, 100%, 70%, ${particle.opacity})`;
            this.ctx.fill();
            
            // 发光效果
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = `hsla(${particle.hue}, 100%, 70%, 0.5)`;
        });
        
        // 连线效果
        this.particles.forEach((particle1, i) => {
            this.particles.slice(i + 1).forEach(particle2 => {
                const dx = particle1.x - particle2.x;
                const dy = particle1.y - particle2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 150)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(particle1.x, particle1.y);
                    this.ctx.lineTo(particle2.x, particle2.y);
                    this.ctx.stroke();
                }
            });
        });
    }

    animate() {
        this.updateParticles();
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }
}

// 时钟功能
class DigitalClock {
    constructor() {
        this.hoursElement = document.getElementById('hours');
        this.minutesElement = document.getElementById('minutes');
        this.secondsElement = document.getElementById('seconds');
        this.dateElement = document.getElementById('date');
        this.update();
        setInterval(() => this.update(), 1000);
    }

    update() {
        const now = new Date();
        
        this.hoursElement.textContent = String(now.getHours()).padStart(2, '0');
        this.minutesElement.textContent = String(now.getMinutes()).padStart(2, '0');
        this.secondsElement.textContent = String(now.getSeconds()).padStart(2, '0');
        
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][now.getDay()];
        
        this.dateElement.textContent = `${year}年${month}月${day}日 ${weekday}`;
    }
}

// 鼠标跟随效果
class CursorEffect {
    constructor() {
        this.follower = document.querySelector('.cursor-follower');
        this.dot = document.querySelector('.cursor-dot');
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.follower.style.left = e.clientX - 20 + 'px';
            this.follower.style.top = e.clientY - 20 + 'px';
            
            this.dot.style.left = e.clientX - 4 + 'px';
            this.dot.style.top = e.clientY - 4 + 'px';
        });
        
        document.addEventListener('mousedown', () => {
            this.follower.style.transform = 'scale(0.8)';
        });
        
        document.addEventListener('mouseup', () => {
            this.follower.style.transform = 'scale(1)';
        });
    }
}

// 涟漪效果
class RippleEffect {
    constructor() {
        this.container = document.getElementById('rippleContainer');
        this.init();
    }

    init() {
        document.addEventListener('click', (e) => {
            this.createRipple(e.clientX, e.clientY);
        });
    }

    createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        this.container.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 1000);
    }
}

// 主题切换
class ThemeManager {
    constructor() {
        this.isLightTheme = false;
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    toggleTheme() {
        this.isLightTheme = !this.isLightTheme;
        
        if (this.isLightTheme) {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }
        
        // 创建过渡效果
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: white;
            z-index: 10000;
            pointer-events: none;
            animation: flash 0.3s ease-out forwards;
        `;
        document.body.appendChild(flash);
        
        setTimeout(() => flash.remove(), 300);
    }
}

// 添加闪烁动画
const style = document.createElement('style');
style.textContent = `
    @keyframes flash {
        from { opacity: 0.8; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);

// 初始化所有组件
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particleCanvas');
    
    // 创建所有效果实例
    const particleSystem = new ParticleSystem(canvas);
    const clock = new DigitalClock();
    const cursor = new CursorEffect();
    const ripple = new RippleEffect();
    const theme = new ThemeManager();
    
    // 添加页面可见性处理
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // 页面隐藏时暂停动画以节省资源
            cancelAnimationFrame(particleSystem.animationId);
        } else {
            // 页面可见时恢复动画
            particleSystem.animate();
        }
    });
    
    // 添加性能优化：降低帧率选项
    let lowPerformanceMode = false;
    document.addEventListener('keydown', (e) => {
        if (e.key === 'p' || e.key === 'P') {
            lowPerformanceMode = !lowPerformanceMode;
            console.log(`Performance mode: ${lowPerformanceMode ? 'Low' : 'Normal'}`);
        }
    });
    
    // 彩蛋：按K键触发特殊效果
    document.addEventListener('keydown', (e) => {
        if (e.key === 'k' || e.key === 'K') {
            createFireworks();
        }
    });
});

// 烟花效果（彩蛋）
function createFireworks() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    const container = document.getElementById('rippleContainer');
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const spark = document.createElement('div');
            spark.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: 50%;
                top: 50%;
                border-radius: 50%;
                box-shadow: 0 0 6px currentColor;
                animation: firework 1s ease-out forwards;
                --tx: ${(Math.random() - 0.5) * 400}px;
                --ty: ${(Math.random() - 0.5) * 400}px;
            `;
            container.appendChild(spark);
            
            setTimeout(() => spark.remove(), 1000);
        }, i * 50);
    }
    
    // 添加烟花动画
    if (!document.getElementById('firework-style')) {
        const style = document.createElement('style');
        style.id = 'firework-style';
        style.textContent = `
            @keyframes firework {
                0% {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 1;
                }
                100% {
                    transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// 添加触摸支持
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        const rippleEffect = new RippleEffect();
        rippleEffect.createRipple(touch.clientX, touch.clientY);
    });
    
    document.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const follower = document.querySelector('.cursor-follower');
        const dot = document.querySelector('.cursor-dot');
        
        if (follower && dot) {
            follower.style.left = touch.clientX - 20 + 'px';
            follower.style.top = touch.clientY - 20 + 'px';
            dot.style.left = touch.clientX - 4 + 'px';
            dot.style.top = touch.clientY - 4 + 'px';
        }
    });
}
