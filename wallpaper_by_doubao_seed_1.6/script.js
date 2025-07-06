const canvas = document.getElementById('wallpaperCanvas');
const ctx = canvas.getContext('2d');

// 设置canvas尺寸为窗口大小
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 粒子类
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
        this.originalColor = this.color;
        this.pulseRate = Math.random() * 0.02;
        this.pulseValue = 0;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulseValue += this.pulseRate;

        // 边界检测
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;

        // 鼠标交互
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const force = 150 / distance;

        if (distance < 100) {
            this.x -= dx * force * 0.01;
            this.y -= dy * force * 0.01;
            this.color = `hsl(${Math.random() * 360}, 80%, 70%)`;
        } else {
            this.color = this.originalColor;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size + Math.sin(this.pulseValue) * 0.5, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 鼠标位置跟踪
const mouse = {
    x: null,
    y: null
};

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

// 创建粒子数组
const particlesArray = [];
const particleCount = Math.floor(canvas.width * canvas.height / 15000);

for (let i = 0; i < particleCount; i++) {
    particlesArray.push(new Particle());
}

// 连接粒子的线条
function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            const dx = particlesArray[a].x - particlesArray[b].x;
            const dy = particlesArray[a].y - particlesArray[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                const opacity = 1 - distance / 100;
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// 动画循环
function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }

    connectParticles();
    requestAnimationFrame(animate);
}

animate();