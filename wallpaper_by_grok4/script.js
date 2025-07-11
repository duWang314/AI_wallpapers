document.addEventListener('DOMContentLoaded', () => {
    const background = document.querySelector('.background');
    const clock = document.getElementById('clock');

    // 更新时钟
    function updateClock() {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString();
    }
    setInterval(updateClock, 1000);
    updateClock();

    // 生成粒子函数
    function createParticle(x, y, size, color) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = color;
        particle.style.animationDuration = `${Math.random() * 5 + 5}s`; // 随机动画时长
        background.appendChild(particle);

        // 移除粒子以优化性能
        setTimeout(() => particle.remove(), 10000);
    }

    // 鼠标移动生成跟随粒子
    document.addEventListener('mousemove', (e) => {
        createParticle(e.clientX, e.clientY, Math.random() * 10 + 5, 'rgba(0, 255, 204, 0.8)'); // 绿色粒子
    });

    // 点击生成光爆效果（多个粒子爆发）
    document.addEventListener('click', (e) => {
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 50 + 20;
            const px = e.clientX + Math.cos(angle) * dist;
            const py = e.clientY + Math.sin(angle) * dist;
            createParticle(px, py, Math.random() * 15 + 5, `hsl(${Math.random() * 360}, 100%, 70%)`); // 随机颜色
        }
    });

    // 初始生成一些背景粒子
    for (let i = 0; i < 50; i++) {
        createParticle(Math.random() * window.innerWidth, Math.random() * window.innerHeight, Math.random() * 5 + 2, 'rgba(255, 255, 255, 0.5)');
    }
});
