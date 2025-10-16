// ==================== 全局变量 ====================
let currentTheme = 'theme-dark';
let soundEnabled = true;
let particlesEnabled = true;
let musicEnabled = false;
const themes = ['theme-dark', 'theme-cyber', 'theme-neon', 'theme-sunset'];

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeWallpaper();
    initializeEventListeners();
    createParticles();
    updateTime();
});

function initializeWallpaper() {
    // 应用默认主题
    document.body.classList.add(currentTheme);
    
    // 设置中心球体的交互
    const centerSphere = document.querySelector('.center-sphere');
    centerSphere.addEventListener('click', () => {
        activatePulse();
        playSound('click');
    });
    
    // 每个卡片的交互
    document.querySelectorAll('.card').forEach((card, index) => {
        card.addEventListener('click', () => {
            triggerCardAnimation(card, index);
            playSound('card');
        });
    });
}

// ==================== 时间更新 ====================
function updateTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('zh-CN', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    const dateStr = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    
    document.getElementById('time').textContent = timeStr;
    document.getElementById('date').textContent = dateStr;
    
    setTimeout(updateTime, 1000);
}

// ==================== 粒子生成 ====================
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = Math.random() * window.innerHeight + 'px';
        
        // 随机选择颜色
        const colors = ['#00d4ff', '#ff006e', '#8338ec', '#ffc107'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = randomColor;
        particle.style.boxShadow = `0 0 10px ${randomColor}`;
        
        particlesContainer.appendChild(particle);
        
        // 动画运动
        animateParticle(particle);
    }
}

function animateParticle(particle) {
    const duration = Math.random() * 20 + 10;
    const x = Math.random() * 200 - 100;
    const y = Math.random() * 200 - 100;
    
    particle.animate([
        { transform: 'translate(0, 0)', opacity: 1 },
        { transform: `translate(${x}px, ${y}px)`, opacity: 0.5 }
    ], {
        duration: duration * 1000,
        iterations: Infinity,
        direction: 'alternate',
        easing: 'ease-in-out'
    });
}

// ==================== 鼠标交互 ====================
document.addEventListener('mousemove', (e) => {
    // 鼠标跟踪轨迹
    if (Math.random() > 0.7) {
        createMouseTrail(e.clientX, e.clientY);
    }
    
    // 动态背景网格响应
    updateGridBackground(e.clientX, e.clientY);
});

document.addEventListener('click', (e) => {
    // 涟漪效果
    createRipple(e.clientX, e.clientY);
    playSound('click');
});

function createMouseTrail(x, y) {
    if (!particlesEnabled) return;
    
    const trail = document.createElement('div');
    trail.className = 'mouse-trail';
    trail.textContent = '✨';
    trail.style.left = x + 'px';
    trail.style.top = y + 'px';
    
    // 随机符号
    const symbols = ['✨', '⭐', '💫', '✦', '◆'];
    trail.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    
    // 随机颜色
    const colors = ['#00d4ff', '#ff006e', '#8338ec', '#ffc107'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    trail.style.color = randomColor;
    
    document.body.appendChild(trail);
    
    // 动画结束后移除
    setTimeout(() => trail.remove(), 800);
}

function createRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    // 随机颜色
    const colors = ['#00d4ff', '#ff006e', '#8338ec'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    ripple.style.borderColor = randomColor;
    
    document.body.appendChild(ripple);
    
    // 动画结束后移除
    setTimeout(() => ripple.remove(), 800);
}

function updateGridBackground(x, y) {
    const gridBg = document.querySelector('.grid-background');
    const offsetX = (x / window.innerWidth) * 20;
    const offsetY = (y / window.innerHeight) * 20;
    
    gridBg.style.backgroundPosition = `${offsetX}px ${offsetY}px`;
}

// ==================== 中心球体脉冲 ====================
function activatePulse() {
    const sphere = document.querySelector('.center-sphere');
    
    // 添加临时脉冲效果
    sphere.style.animation = 'none';
    setTimeout(() => {
        sphere.style.animation = '';
    }, 10);
    
    // 创建爆发效果
    for (let i = 0; i < 8; i++) {
        const burst = document.createElement('div');
        burst.style.position = 'fixed';
        burst.style.width = '10px';
        burst.style.height = '10px';
        burst.style.background = '#00d4ff';
        burst.style.borderRadius = '50%';
        burst.style.left = (window.innerWidth / 2) + 'px';
        burst.style.top = (window.innerHeight / 2) + 'px';
        burst.style.pointerEvents = 'none';
        burst.style.boxShadow = '0 0 10px #00d4ff';
        
        document.body.appendChild(burst);
        
        const angle = (i / 8) * Math.PI * 2;
        const distance = 150;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        burst.animate([
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(0)`, opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        });
        
        setTimeout(() => burst.remove(), 1000);
    }
}

// ==================== 卡片动画 ====================
function triggerCardAnimation(card, index) {
    // 旋转动画
    card.style.animation = 'none';
    setTimeout(() => {
        card.animate([
            { transform: 'rotateZ(0deg) scale(1)' },
            { transform: 'rotateZ(360deg) scale(1.2)' },
            { transform: 'rotateZ(360deg) scale(1)' }
        ], {
            duration: 600,
            easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        });
    }, 50);
    
    // 粒子爆发
    createCardBurst(card);
}

function createCardBurst(card) {
    const rect = card.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    for (let i = 0; i < 6; i++) {
        const burst = document.createElement('div');
        burst.className = 'mouse-trail';
        burst.style.left = x + 'px';
        burst.style.top = y + 'px';
        burst.textContent = '✦';
        burst.style.color = card.style.color;
        
        document.body.appendChild(burst);
        
        const angle = (i / 6) * Math.PI * 2;
        const distance = 100;
        const bx = Math.cos(angle) * distance;
        const by = Math.sin(angle) * distance;
        
        burst.animate([
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            { transform: `translate(calc(-50% + ${bx}px), calc(-50% + ${by}px)) scale(0)`, opacity: 0 }
        ], {
            duration: 800,
            easing: 'ease-out'
        });
        
        setTimeout(() => burst.remove(), 800);
    }
}

// ==================== 音效系统 ====================
function playSound(type) {
    if (!soundEnabled) return;
    
    // 使用 Web Audio API 生成音效
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'click') {
        oscillator.frequency.value = 800;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } else if (type === 'card') {
        oscillator.frequency.value = 600;
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
    }
}

// ==================== 事件监听器 ====================
function initializeEventListeners() {
    // 主题切换按钮
    document.getElementById('toggleTheme').addEventListener('click', toggleTheme);
    
    // 音效开关
    document.getElementById('toggleSound').addEventListener('click', toggleSound);
    
    // 粒子切换
    document.getElementById('toggleParticles').addEventListener('click', toggleParticles);
    
    // 背景音乐
    document.getElementById('toggleMusic').addEventListener('click', toggleMusic);
    
    // 键盘快捷键
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // 防止右键菜单
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        // 在右键点击处创建涟漪
        createRipple(e.clientX, e.clientY);
    });
}

function toggleTheme() {
    // 移除当前主题
    document.body.classList.remove(currentTheme);
    
    // 选择下一个主题
    const currentIndex = themes.indexOf(currentTheme);
    currentTheme = themes[(currentIndex + 1) % themes.length];
    
    // 应用新主题
    document.body.classList.add(currentTheme);
    
    playSound('click');
    
    // 视觉反馈
    createRipple(window.innerWidth - 65, 65);
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const btn = document.getElementById('toggleSound');
    btn.style.opacity = soundEnabled ? '1' : '0.5';
    playSound('click');
}

function toggleParticles() {
    particlesEnabled = !particlesEnabled;
    const btn = document.getElementById('toggleParticles');
    btn.style.opacity = particlesEnabled ? '1' : '0.5';
    
    const particlesContainer = document.getElementById('particles');
    particlesContainer.style.opacity = particlesEnabled ? '1' : '0';
    
    playSound('click');
}

function toggleMusic() {
    musicEnabled = !musicEnabled;
    const btn = document.getElementById('toggleMusic');
    btn.style.opacity = musicEnabled ? '1' : '0.5';
    
    playSound('click');
}

function handleKeyboardShortcuts(e) {
    switch(e.key.toLowerCase()) {
        case 't':
            // 切换主题
            toggleTheme();
            break;
        case 's':
            // 切换音效
            toggleSound();
            break;
        case 'p':
            // 切换粒子
            toggleParticles();
            break;
        case 'm':
            // 切换音乐
            toggleMusic();
            break;
        case ' ':
            // 空格键激活脉冲
            e.preventDefault();
            activatePulse();
            break;
        case 'escape':
            // Escape 键创建全屏涟漪
            createRipple(window.innerWidth / 2, window.innerHeight / 2);
            break;
    }
}

// ==================== 窗口自适应 ====================
window.addEventListener('resize', () => {
    // 重新计算容器位置
    const mainContainer = document.querySelector('.main-container');
    mainContainer.style.left = '50%';
    mainContainer.style.top = '50%';
});

// ==================== 性能优化 ====================
// 使用 requestAnimationFrame 进行流畅动画
let animationId;

function optimizePerformance() {
    // 根据设备性能调整粒子数量
    const particleCount = window.matchMedia('(max-width: 768px)').matches ? 20 : 50;
    
    // 如果粒子数量太多，禁用某些效果
    if (particleCount < 50) {
        document.body.style.setProperty('--animation-speed', '1.5');
    }
}

optimizePerformance();

// ==================== 滚动监听 ====================
let scrollDirection = 'down';
window.addEventListener('wheel', (e) => {
    scrollDirection = e.deltaY > 0 ? 'down' : 'up';
    
    // 根据滚动方向改变某些元素
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        const rotation = scrollDirection === 'down' ? 5 : -5;
        card.style.transform = `rotate(${rotation}deg)`;
    });
});

// ==================== 无限创意效果 ====================
setInterval(() => {
    // 随机在屏幕某处创建粒子效果
    if (Math.random() > 0.9 && particlesEnabled) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        createMouseTrail(x, y);
    }
}, 500);

// ==================== 页面可见性 ====================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // 暂停动画
        document.body.style.animationPlayState = 'paused';
    } else {
        // 恢复动画
        document.body.style.animationPlayState = 'running';
    }
});

// ==================== 深度交互 ====================
// 双击创建特殊效果
let lastClickTime = 0;
document.addEventListener('click', (e) => {
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - lastClickTime;
    
    if (timeDiff < 300 && timeDiff > 0) {
        // 双击了
        createSpecialEffect(e.clientX, e.clientY);
    }
    lastClickTime = currentTime;
});

function createSpecialEffect(x, y) {
    const colors = ['#00d4ff', '#ff006e', '#8338ec', '#ffc107'];
    
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'mouse-trail';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.textContent = '◆';
        particle.style.color = colors[i % colors.length];
        particle.style.fontSize = '16px';
        
        document.body.appendChild(particle);
        
        const angle = (i / 12) * Math.PI * 2;
        const distance = 150;
        const px = Math.cos(angle) * distance;
        const py = Math.sin(angle) * distance;
        
        particle.animate([
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            { transform: `translate(calc(-50% + ${px}px), calc(-50% + ${py}px)) scale(0)`, opacity: 0 }
        ], {
            duration: 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        setTimeout(() => particle.remove(), 1000);
    }
    
    playSound('card');
}

console.log('🚀 炫彩交互壁纸加载完成！');
console.log('⌨️ 快捷键: T(主题) S(音效) P(粒子) M(音乐) Space(脉冲) ESC(涟漪)');
