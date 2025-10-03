// 粒子系统
class Particle {
    constructor(x, y, canvas) {
        this.x = x;
        this.y = y;
        this.canvas = canvas;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.life = Math.random() * 100 + 100;
        this.maxLife = this.life;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;

        // 边界检测
        if (this.x < 0 || this.x > this.canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.speedY *= -1;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity * (this.life / this.maxLife);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    isDead() {
        return this.life <= 0;
    }
}

// 初始化画布
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const maxParticles = 100;
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

// 初始化粒子
for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        canvas
    ));
}

// 动画循环
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 更新和绘制粒子
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw(ctx);

        if (particles[i].isDead()) {
            particles.splice(i, 1);
        }
    }

    // 保持粒子数量
    while (particles.length < maxParticles) {
        particles.push(new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            canvas
        ));
    }

    // 绘制粒子连线
    drawConnections();

    // 鼠标交互粒子
    drawMouseParticle();

    requestAnimationFrame(animate);
}

// 绘制粒子之间的连线
function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.save();
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - distance / 100)})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
                ctx.restore();
            }
        }
    }
}

// 鼠标位置的特殊粒子效果
function drawMouseParticle() {
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 30;
    ctx.shadowColor = '#ffffff';
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 连接鼠标到附近的粒子
    particles.forEach(particle => {
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
            ctx.save();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 * (1 - distance / 150)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(mouseX, mouseY);
            ctx.lineTo(particle.x, particle.y);
            ctx.stroke();
            ctx.restore();
        }
    });
}

// 鼠标移动事件
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// 点击创建涟漪效果
document.addEventListener('click', (e) => {
    createRipple(e.clientX, e.clientY);
    
    // 在点击位置创建额外的粒子
    for (let i = 0; i < 10; i++) {
        particles.push(new Particle(
            e.clientX + (Math.random() - 0.5) * 50,
            e.clientY + (Math.random() - 0.5) * 50,
            canvas
        ));
    }
});

// 创建涟漪效果
function createRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 1000);
}

// 窗口大小调整
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// 更新时钟
function updateTime() {
    const now = new Date();
    
    // 更新时间
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('time').textContent = `${hours}:${minutes}:${seconds}`;
    
    // 更新日期
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[now.getDay()];
    document.getElementById('date').textContent = `${year}年${month}月${day}日 ${weekday}`;
}

// 随机名言
const quotes = [
    '探索无限可能',
    '创造属于你的未来',
    '每一天都是新的开始',
    '追逐梦想，永不止步',
    '相信自己，你能做到',
    '生活充满美好',
    '用心感受每一刻',
    '让创意自由流动',
    '勇敢追寻内心的声音',
    '每个瞬间都独一无二'
];

function updateQuote() {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('quote').textContent = randomQuote;
}

// 初始化
updateTime();
updateQuote();
setInterval(updateTime, 1000);
setInterval(updateQuote, 10000); // 每10秒更换一次名言

// 启动动画
animate();

// 键盘快捷键 - 按空格键暂停/继续动画
let isPaused = false;
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        isPaused = !isPaused;
        if (!isPaused) {
            animate();
        }
    }
});

console.log('🎨 炫酷交互壁纸已加载！');
console.log('💡 提示：');
console.log('   - 移动鼠标查看粒子交互效果');
console.log('   - 点击屏幕创建涟漪效果');
console.log('   - 按空格键暂停/继续动画');
