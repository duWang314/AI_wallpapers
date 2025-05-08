const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

// 创建粒子构造函数
class Particle {
    constructor(x, y, size, color, weight) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.weight = weight; // 影响粒子下落速度
    }
    // 绘制单个粒子
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    // 更新粒子位置
    update() {
        this.size -= 0.05; // 粒子逐渐变小
        if (this.size < 0) {
            this.x = (Math.random() * canvas.width);
            this.y = (Math.random() * canvas.height / 10); // 从顶部重新出现
            this.size = (Math.random() * 5) + 2; // 重置大小
            this.weight = (Math.random() * 2) + 1; // 重置速度
        }
        this.y += this.weight;
        this.weight += 0.03; // 模拟重力

        // 简单的交互：鼠标悬停时粒子加速下落
        if (mouse.x && mouse.y &&
            mouse.x - this.x < 50 && mouse.x - this.x > -50 &&
            mouse.y - this.y < 50 && mouse.y - this.y > -50) {
            this.weight *= 1.5;
        }

        // 确保粒子在画布内
        if (this.y > canvas.height - this.size) {
             this.weight *= -0.4; // 触底反弹效果
        }
    }
}

// 鼠标位置对象
const mouse = {
    x: null,
    y: null
}

window.addEventListener('mousemove', function(event){
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener('mouseout', function(){
    mouse.x = undefined;
    mouse.y = undefined;
});

// 初始化粒子
function init() {
    particlesArray = [];
    const numberOfParticles = (canvas.height * canvas.width) / 9000; // 根据画布大小调整粒子数量
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 5) + 2;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let color = 'rgba(173, 216, 230, ' + (Math.random() * 0.5 + 0.3) + ')'; // 淡蓝色，随机透明度
        let weight = 1;
        particlesArray.push(new Particle(x, y, size, color, weight));
    }
}

// 动画循环
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除上一帧
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animate);
}

init();
animate();

// 窗口大小改变时重新调整画布和粒子
window.addEventListener('resize', function(){
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init(); // 重新初始化粒子以适应新的画布大小
});