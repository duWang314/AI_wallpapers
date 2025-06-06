document.addEventListener('DOMContentLoaded', () => {

    // --- 1. 数字雨背景 ---
    const canvas = document.getElementById('matrix-bg');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;

    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);

    const rainDrops = [];
    for (let x = 0; x < columns; x++) {
        rainDrops[x] = 1;
    }

    const drawMatrix = () => {
        ctx.fillStyle = 'rgba(5, 10, 24, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < rainDrops.length; i++) {
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

            if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        }
    };

    setInterval(drawMatrix, 33); // 大约 30 FPS

    // 窗口大小改变时重置 canvas
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // 注意：这里没有重新计算列数和雨滴，对于桌面壁纸来说，这通常是可接受的
    });


    // --- 2. 动态时钟 ---
    const clockElement = document.getElementById('clock');
    
    const updateClock = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    };

    setInterval(updateClock, 1000);
    updateClock(); // 立即执行一次


    // --- 3. 打字机效果 ---
    const welcomeTextElement = document.getElementById('welcome-text');
    const textToType = "SYSTEM ONLINE. AWAITING COMMAND...";
    let charIndex = 0;

    const typeWriter = () => {
        if (charIndex < textToType.length) {
            welcomeTextElement.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 100);
        }
    };
    
    setTimeout(typeWriter, 1500); // 延迟启动，给用户一点时间看清背景


    // --- 4. 鼠标跟随光环 ---
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        document.documentElement.style.setProperty('--mouse-x', `${clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${clientY}px`);
    });


    // --- 5. 搜索功能 ---
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    const performSearch = () => {
        const query = searchInput.value.trim();
        if (query) {
            // 使用 Google 搜索，可以替换成其他搜索引擎
            const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            window.open(url, '_blank'); // 在新标签页中打开
            searchInput.value = '';
        }
    };

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

});