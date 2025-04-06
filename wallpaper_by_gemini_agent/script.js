const canvas = document.getElementById('interactive-wallpaper');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // --- 新增: 更新波浪的 yOffset ---
    waves.forEach(wave => {
        // 保持初始相对位置
        if (wave.initialYRatio === undefined) {
            wave.initialYRatio = wave.yOffset / (canvas.height || 1); // 存储初始比例
        }
        wave.yOffset = canvas.height * wave.initialYRatio;
    });
    // --- 新增结束 ---
}

window.addEventListener('resize', resizeCanvas);

// 初始化画布大小
resizeCanvas();

// --- 新增代码开始 ---
const waves = [
    { amplitude: 50, frequency: 0.01, speed: 0.02, color: 'rgba(0, 100, 255, 0.5)', yOffset: canvas.height / 2, timeOffset: 0 },
    { amplitude: 40, frequency: 0.015, speed: 0.03, color: 'rgba(0, 150, 255, 0.5)', yOffset: canvas.height / 2 + 10, timeOffset: 1 },
    { amplitude: 60, frequency: 0.008, speed: 0.015, color: 'rgba(0, 50, 200, 0.5)', yOffset: canvas.height / 2 - 10, timeOffset: 2 }
];

let time = 0;
// --- 新增代码开始 ---
const ripples = [];
const RIPPLE_DURATION = 100; // 涟漪持续时间 (帧数)
const RIPPLE_MAX_RADIUS = 150; // 涟漪最大半径
const RIPPLE_STRENGTH = 30; // 涟漪初始强度 (振幅)

function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top; // 虽然 y 不直接用，但保留可能有用

    ripples.push({
        x: mouseX,
        startTime: time,
    });
}

canvas.addEventListener('click', handleClick);
// --- 新增代码结束 ---

// 在这里添加绘制和互动逻辑
function animate() {
    // 清除画布
    // ctx.clearRect(0, 0, canvas.width, canvas.height); // 改为填充背景以覆盖旧帧
    ctx.fillStyle = '#000'; // 背景色
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // --- 修改/新增绘制代码开始 ---
    time += 1; // 更新时间

    // --- 新增: 更新和移除涟漪 ---
    const activeRipples = ripples.filter(ripple => (time - ripple.startTime) < RIPPLE_DURATION);
    // --- 新增结束 ---

    waves.forEach(wave => {
        ctx.fillStyle = wave.color;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height); // 从左下角开始

        for (let x = 0; x < canvas.width; x++) {
            const baseY = wave.yOffset + wave.amplitude * Math.sin(x * wave.frequency + time * wave.speed + wave.timeOffset);

            // --- 新增: 计算涟漪效果 ---
            let rippleEffectY = 0;
            activeRipples.forEach(ripple => {
                const age = time - ripple.startTime;
                const distanceX = Math.abs(x - ripple.x);
                const currentRadius = (age / RIPPLE_DURATION) * RIPPLE_MAX_RADIUS;

                if (distanceX < currentRadius) {
                    // 使用 cosine 平滑过渡，并随时间衰减强度
                    const influence = (Math.cos((distanceX / currentRadius) * (Math.PI / 2)) + 1) / 2; // 0 到 1
                    const currentStrength = RIPPLE_STRENGTH * (1 - age / RIPPLE_DURATION);
                    // 添加一个小的垂直振荡效果
                    const rippleDisplacement = Math.sin((age * 0.3) - (distanceX * 0.1)) * currentStrength * influence;
                    rippleEffectY += rippleDisplacement;
                }
            });
            // --- 新增结束 ---

            const finalY = baseY + rippleEffectY; // 应用涟漪效果
            ctx.lineTo(x, finalY); // 使用最终计算的 Y
        }

        ctx.lineTo(canvas.width, canvas.height); // 连接到右下角
        ctx.closePath();
        ctx.fill();
    });
    // --- 修改/新增绘制代码结束 ---

    requestAnimationFrame(animate);
}

// 启动动画
animate(); 