// 粒子系统类
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.active = true;
        
        this.init();
    }
    
    init() {
        // 设置画布尺寸
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // 鼠标移动监听
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        // 创建粒子
        this.createParticles(150);
        
        // 开始动画循环
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles(count) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1,
                color: `hsl(${Math.random() * 360}, 70%, 60%)`,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    animate() {
        if (!this.active) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 更新和绘制粒子
        this.particles.forEach(particle => {
            // 粒子移动
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // 边界检查
            if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
            
            // 鼠标交互
            const dx = particle.x - this.mouseX;
            const dy = particle.y - this.mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.x += dx * force * 0.05;
                particle.y += dy * force * 0.05;
            }
            
            // 绘制粒子
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fill();
        });
        
        // 绘制粒子间的连线
        this.drawConnections();
        
        requestAnimationFrame(() => this.animate());
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - distance / 100)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    toggle() {
        this.active = !this.active;
        if (this.active) {
            this.animate();
        }
    }
}

// 时间显示功能
class TimeDisplay {
    constructor() {
        this.timeElement = document.getElementById('current-time');
        this.dateElement = document.getElementById('current-date');
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
    }
    
    updateTime() {
        const now = new Date();
        
        // 格式化时间
        const timeString = now.toLocaleTimeString('zh-CN');
        
        // 格式化日期
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        const weekday = weekdays[now.getDay()];
        const dateString = `${year}年${month}月${day}日 星期${weekday}`;
        
        this.timeElement.textContent = timeString;
        this.dateElement.textContent = dateString;
    }
}

// 主题管理
class ThemeManager {
    constructor() {
        this.currentTheme = 'default';
        this.themes = ['default', 'dark', 'light'];
        this.init();
    }
    
    init() {
        document.body.className = '';
    }
    
    switchTheme() {
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        this.currentTheme = this.themes[nextIndex];
        
        document.body.className = '';
        if (this.currentTheme !== 'default') {
            document.body.classList.add(`${this.currentTheme}-theme`);
        }
        
        // 更新按钮文本
        const themeButton = document.getElementById('theme-toggle');
        const themeNames = {
            'default': '默认主题',
            'dark': '暗色主题', 
            'light': '明亮主题'
        };
        themeButton.textContent = themeNames[this.currentTheme];
    }
}

// 音频管理
class AudioManager {
    constructor() {
        this.audio = document.getElementById('bg-music');
        this.playing = false;
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.init();
    }
    
    init() {
        // 创建虚拟音频源（实际使用时可以替换为真实音频文件）
        this.createVirtualAudio();
        
        // 设置音频可视化
        this.setupAudioVisualization();
    }
    
    createVirtualAudio() {
        // 这里创建了一个简单的合成音效作为背景音乐
        // 实际使用时可以替换为真实的音频文件
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 220;
        gainNode.gain.value = 0.1;
        
        // 简单的旋律变化
        setInterval(() => {
            oscillator.frequency.value = 220 + Math.sin(Date.now() * 0.001) * 100;
        }, 100);
        
        oscillator.start();
    }
    
    setupAudioVisualization() {
        // 音频可视化设置（简化版）
        // 实际使用时可以连接到真实的音频源
    }
    
    toggle() {
        this.playing = !this.playing;
        const audioButton = document.getElementById('audio-toggle');
        
        if (this.playing) {
            audioButton.textContent = '关闭音乐';
            // 这里可以播放真实音频
            // this.audio.play();
        } else {
            audioButton.textContent = '背景音乐';
            // this.audio.pause();
        }
    }
}

// 交互效果
class InteractionEffects {
    constructor() {
        this.orb = document.querySelector('.central-orb');
        this.init();
    }
    
    init() {
        // 点击中央球体的效果
        this.orb.addEventListener('click', (e) => {
            this.createRippleEffect(e.clientX, e.clientY);
        });
        
        // 双击重置效果
        this.orb.addEventListener('dblclick', () => {
            this.resetEffects();
        });
    }
    
    createRippleEffect(x, y) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            border: 2px solid #00ffff;
            border-radius: 50%;
            left: ${x - 10}px;
            top: ${y - 10}px;
            pointer-events: none;
            animation: ripple 1s ease-out forwards;
        `;
        
        document.body.appendChild(ripple);
        
        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                0% {
                    transform: scale(1);
                    opacity: 1;
                }
                100% {
                    transform: scale(10);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        // 清理元素
        setTimeout(() => {
            ripple.remove();
            style.remove();
        }, 1000);
    }
    
    resetEffects() {
        // 重置所有动画和效果
        document.querySelectorAll('.ring').forEach(ring => {
            ring.style.animation = 'none';
            setTimeout(() => {
                ring.style.animation = '';
            }, 10);
        });
    }
}

// 主应用类
class WallpaperApp {
    constructor() {
        this.particleSystem = null;
        this.timeDisplay = null;
        this.themeManager = null;
        this.audioManager = null;
        this.interactionEffects = null;
        this.init();
    }
    
    init() {
        // 初始化各个模块
        this.particleSystem = new ParticleSystem(document.getElementById('particleCanvas'));
        this.timeDisplay = new TimeDisplay();
        this.themeManager = new ThemeManager();
        this.audioManager = new AudioManager();
        this.interactionEffects = new InteractionEffects();
        
        // 设置事件监听器
        this.setupEventListeners();
        
        console.log('炫酷互动桌面壁纸已加载完成！');
    }
    
    setupEventListeners() {
        // 主题切换按钮
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.themeManager.switchTheme();
        });
        
        // 粒子效果切换按钮
        document.getElementById('particle-toggle').addEventListener('click', () => {
            this.particleSystem.toggle();
            const button = document.getElementById('particle-toggle');
            button.textContent = this.particleSystem.active ? '关闭粒子' : '粒子效果';
        });
        
        // 音频切换按钮
        document.getElementById('audio-toggle').addEventListener('click', () => {
            this.audioManager.toggle();
        });
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 't':
                case 'T':
                    this.themeManager.switchTheme();
                    break;
                case 'p':
                case 'P':
                    this.particleSystem.toggle();
                    break;
                case 'm':
                case 'M':
                    this.audioManager.toggle();
                    break;
                case 'r':
                case 'R':
                    this.interactionEffects.resetEffects();
                    break;
            }
        });
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new WallpaperApp();
});

// 添加一些额外的视觉效果
window.addEventListener('load', () => {
    // 页面加载时的入场动画
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1s ease-in';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // 添加一些随机的小星星效果
    setInterval(() => {
        if (Math.random() > 0.7) {
            createFloatingStar();
        }
    }, 2000);
});

function createFloatingStar() {
    const star = document.createElement('div');
    star.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: white;
        border-radius: 50%;
        left: ${Math.random() * 100}vw;
        top: -10px;
        pointer-events: none;
        animation: floatStar ${Math.random() * 3 + 2}s linear forwards;
        box-shadow: 0 0 5px white;
    `;
    
    document.body.appendChild(star);
    
    // 添加浮动动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatStar {
            0% {
                transform: translateY(0) scale(1);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) scale(0);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // 清理元素
    setTimeout(() => {
        star.remove();
        style.remove();
    }, 5000);
}