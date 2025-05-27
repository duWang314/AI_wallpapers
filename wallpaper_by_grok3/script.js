const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let width, height;

// 自适应屏幕尺寸
function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

window.addEventListener('resize', resize);
resize();

// 动态渐变背景
let gradientAngle = 0;

function drawBackground() {
    gradientAngle += 0.01; // 控制渐变速度
    const gradient = ctx.createLinearGradient(
        0, 0, 
        width * Math.cos(gradientAngle), 
        height * Math.sin(gradientAngle)
    );
    gradient.addColorStop(0, '#0f0'); // 绿色
    gradient.addColorStop(1, '#00f'); // 蓝色
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
}

// 几何形状类
class Shape {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 50 + 20; // 随机大小
        this.speedX = (Math.random() - 0.5) * 2; // 随机速度
        this.speedY = (Math.random() - 0.5) * 2;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`; // 随机霓虹色
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        // 边界反弹
        if (this.x < 0 || this.x > width) this.speedX *= -1;
        if (this.y < 0 || this.y > height) this.speedY *= -1;
    }
}

// 创建多个形状
const shapes = [];
for (let i = 0; i < 20; i++) {
    shapes.push(new Shape());
}

// 鼠标交互
let mouseX, mouseY;
canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

canvas.addEventListener('click', () => {
    shapes.forEach(shape => {
        if (Math.hypot(shape.x - mouseX, shape.y - mouseY) < shape.size) {
            shape.size += 10; // 点击时放大
            setTimeout(() => shape.size -= 10, 300); // 300ms后恢复
        }
    });
});

// 动画循环
function animate() {
    drawBackground();
    shapes.forEach(shape => {
        shape.update();
        shape.draw();
        if (mouseX && mouseY) {
            const dist = Math.hypot(shape.x - mouseX, shape.y - mouseY);
            if (dist < shape.size + 50) {
                // 鼠标靠近时加速
                shape.speedX += (mouseX - shape.x) * 0.001;
                shape.speedY += (mouseY - shape.y) * 0.001;
            }
        }
    });
    requestAnimationFrame(animate); // 优化动画性能
}

animate();