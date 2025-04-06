const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const numberOfParticles = 100; // 粒子数量

// 鼠标位置
const mouse = {
    x: null,
    y: null,
    radius: 150 // 鼠标交互半径
}

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// 创建粒子类
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1; // 粒子大小
        this.baseX = this.x; // 初始X位置
        this.baseY = this.y; // 初始Y位置
        this.density = (Math.random() * 30) + 1; // 影响粒子移动速度/响应性
        this.color = '#ffffff'; // 粒子颜色
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    // 更新粒子位置，使其受鼠标影响
    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        // 计算鼠标排斥力，距离越近力越大
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
            // 粒子被鼠标排斥
            this.x -= directionX;
            this.y -= directionY;
            // 增加一点交互视觉效果：靠近鼠标时变亮或变色（可选）
            // let opacity = 1 - (distance / mouse.radius);
            // this.color = `rgba(255, 255, 255, ${opacity})`;
        } else {
            // 粒子缓慢回到初始位置
            if (this.x !== this.baseX) {
                let dx_base = this.x - this.baseX;
                this.x -= dx_base / 10;
            }
            if (this.y !== this.baseY) {
                let dy_base = this.y - this.baseY;
                this.y -= dy_base / 10;
            }
             // 恢复默认颜色
             // this.color = '#ffffff';
        }
    }
}

// 初始化粒子
function init() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        particlesArray.push(new Particle(x, y));
    }
}
init();

// 连接粒子形成线条
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx*dx + dy*dy);

            if (distance < 50) { // 连接线的最长距离
                opacityValue = 1 - (distance/50);
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue})`;
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
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除画布
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update(); // 更新粒子状态
        particlesArray[i].draw();   // 绘制粒子
    }
    connect(); // 连接粒子
    requestAnimationFrame(animate); // 请求下一帧
}
animate();

// 窗口大小调整时重新设置画布并初始化粒子
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    mouse.radius = 150; // 可以根据需要调整
    init(); // 重新初始化粒子位置
}); 