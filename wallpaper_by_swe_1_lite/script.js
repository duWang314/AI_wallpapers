document.addEventListener('DOMContentLoaded', () => {
    const particlesContainer = document.querySelector('.particles');
    const themeToggle = document.querySelector('.theme-toggle');
    const currentTime = document.getElementById('currentTime');
    
    // 初始化主题
    let currentTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', currentTheme);
    
    // 创建粒子效果
    function createParticles() {
        for (let i = 0; i < 100; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.width = `${Math.random() * 2 + 1}px`;
            particle.style.height = `${Math.random() * 2 + 1}px`;
            particle.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            particlesContainer.appendChild(particle);
        }
    }

    // 更新时间
    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        currentTime.textContent = `${hours}:${minutes}`;
    }

    // 切换主题
    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
    });

    // 鼠标移动效果
    document.addEventListener('mousemove', (e) => {
        const objects = document.querySelectorAll('.objects > div');
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        objects.forEach(obj => {
            const x = (mouseX - centerX) / 100;
            const y = (mouseY - centerY) / 100;
            obj.style.transform = `translate(-50%, -50%) rotateX(${y}deg) rotateY(${x}deg)`;
        });
    });

    // 初始化
    createParticles();
    updateTime();
    setInterval(updateTime, 1000);

    // 添加粒子动画
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => {
        particle.style.animation = `float ${Math.random() * 5 + 5}s infinite ease-in-out`;
    });
});
