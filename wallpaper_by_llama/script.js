const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 设置 canvas 尺寸
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 定义一些颜色
const colors = ['#FF69B4', '#33CC33', '#6666FF', '#CC3333', '#FFFF66'];

// 定义粒子对象
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = Math.random() * 2 - 1;
        this.vy = Math.random() * 2 - 1;
        this.radius = Math.random() * 3 + 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.vx = -this.vx;
        }

        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.vy = -this.vy;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// 创建粒子数组
const particles = [];
for (let i = 0; i < 500; i++) {
    particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
}

// 动画循环
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }

    // 添加交互：鼠标附近的粒子会被吸引
    const mouse = {
        x: canvas.width / 2,
        y: canvas.height / 2
    };
    canvas.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    for (let i = 0; i < particles.length; i++) {
        const dx = mouse.x - particles[i].x;
        const dy = mouse.y - particles[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
            particles[i].vx += dx / dist * 0.1;
            particles[i].vy += dy / dist * 0.1;
        }
    }

    requestAnimationFrame(animate);
}

animate();