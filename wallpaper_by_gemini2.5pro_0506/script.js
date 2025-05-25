const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const numberOfParticles = 100; // 粒子数量

// 鼠标位置
const mouse = {
    x: null,
    y: null,
    radius: 100 // 鼠标影响范围
}

window.addEventListener('mousemove', function(event){
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

// 粒子类
class Particle {
    constructor(x, y, size, color, weight) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.weight = weight; // 影响粒子移动速度和方向
        this.baseX = this.x; // 记录初始位置
        this.baseY = this.y;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        // 粒子与鼠标的距离
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;

        // 粒子受鼠标影响的力度，距离越近力度越大
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance; // 0到1的值
        let directionX = forceDirectionX * force * this.weight * 5; // 调整乘数以改变敏感度
        let directionY = forceDirectionY * force * this.weight * 5;


        if (distance < mouse.radius) {
            // 鼠标靠近时，粒子向外移动
            this.x -= directionX;
            this.y -= directionY;
        } else {
            // 鼠标离开后，粒子缓慢回到初始位置
            if (this.x !== this.baseX) {
                let dxToBase = this.x - this.baseX;
                this.x -= dxToBase / 20; // 调整除数以改变回归速度
            }
            if (this.y !== this.baseY) {
                let dyToBase = this.y - this.baseY;
                this.y -= dyToBase / 20;
            }
        }

        // 确保粒子在画布内
        if (this.x - this.size < 0 || this.x + this.size > canvas.width) {
            // 简单处理边界，可以做得更复杂
            this.x = Math.random() * canvas.width;
            this.baseX = this.x;
        }
        if (this.y - this.size < 0 || this.y + this.size > canvas.height) {
            this.y = Math.random() * canvas.height;
            this.baseY = this.y;
        }

        this.draw();
    }
}

// 初始化粒子
function initParticles() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 5 + 1; // 粒子大小 1-6px
        let x = Math.random() * (canvas.width - size * 2) + size;
        let y = Math.random() * (canvas.height - size * 2) + size;
        let color = 'rgba(255, 255, 255, ' + (Math.random() * 0.5 + 0.3) + ')'; // 白色半透明粒子
        let weight = Math.random() * 1.5 + 0.5; // 粒子重量/敏感度
        particlesArray.push(new Particle(x, y, size, color, weight));
    }
}

// 动画循环
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    requestAnimationFrame(animateParticles);
}

// 时钟功能
const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');

function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    timeElement.textContent = `${hours}:${minutes}:${seconds}`;

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始
    const day = now.getDate().toString().padStart(2, '0');
    const dayOfWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][now.getDay()];
    dateElement.textContent = `${year}年${month}月${day}日 ${dayOfWeek}`;
}


// 窗口大小调整时重新初始化
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    mouse.radius = Math.min(canvas.width, canvas.height) / 8; // 根据窗口大小调整鼠标影响范围
    initParticles(); // 重新生成粒子以适应新尺寸
});

// 初始化
initParticles();
animateParticles();
updateClock();
setInterval(updateClock, 1000); // 每秒更新时钟

// 初始时隐藏鼠标，避免在没有移动时就显示影响
mouse.x = -mouse.radius;
mouse.y = -mouse.radius;
