const root = document.documentElement;
const clockEl = document.getElementById('clock');
const dateEl = document.getElementById('date');
const batteryLevelEl = document.getElementById('batteryLevel');
const batteryTextEl = document.getElementById('batteryText');
const quoteEl = document.getElementById('quote');
const accentPicker = document.getElementById('accentColor');
const parallaxRange = document.getElementById('parallaxRange');
const pulseToggle = document.getElementById('pulseToggle');
const noiseToggle = document.getElementById('noiseToggle');
const randomQuoteBtn = document.getElementById('randomQuote');
const noiseOverlay = document.getElementById('noiseOverlay');
const layers = Array.from(document.querySelectorAll('.layer'));
const starfieldCanvas = document.getElementById('starfield');
const starCtx = starfieldCanvas.getContext('2d');

const quotes = [
    '未来属于勇于改写自己的人。',
    '数据洪流中，灵感是最稀缺的能量。',
    'Feel the pulse of the neon night.',
    '在电光深处，愿景正在加载。',
    'Every signal is a story waiting to be decoded.'
];

let parallaxIntensity = parseInt(parallaxRange.value, 10) / 100;
let pointerX = 0;
let pointerY = 0;
let batteryLevel = 0.66;
let batterySimDirection = 1;
let animationFrameId;

class Star {
    constructor(width, height) {
        this.reset(width, height);
    }

    reset(width, height) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.z = Math.random() * 0.6 + 0.4;
        this.speed = Math.random() * 0.25 + 0.05;
        this.radius = Math.random() * 1.8 + 0.3;
    }

    update(width, height) {
        this.y += this.speed * this.z;
        if (this.y > height) {
            this.reset(width, 0);
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${0.35 + this.z * 0.5})`;
        ctx.shadowColor = 'rgba(0, 246, 255, 0.6)';
        ctx.shadowBlur = 8 * this.z;
        ctx.arc(this.x, this.y, this.radius * this.z, 0, Math.PI * 2);
        ctx.fill();
    }
}

const starfield = {
    stars: [],
    resize() {
        starfieldCanvas.width = window.innerWidth;
        starfieldCanvas.height = window.innerHeight;
        const totalStars = Math.min(250, Math.floor((window.innerWidth * window.innerHeight) / 6000));
        this.stars = Array.from({ length: totalStars }, () => new Star(starfieldCanvas.width, starfieldCanvas.height));
    },
    render() {
        starCtx.clearRect(0, 0, starfieldCanvas.width, starfieldCanvas.height);
        for (const star of this.stars) {
            star.update(starfieldCanvas.width, starfieldCanvas.height);
            star.draw(starCtx);
        }
        animationFrameId = requestAnimationFrame(() => this.render());
    }
};

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString('zh-CN', options);
    clockEl.textContent = `${hours}:${minutes}:${seconds}`;
    dateEl.textContent = formattedDate;
}

function pickRandomQuote() {
    const nextQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteEl.textContent = nextQuote;
}

function lightenHex(hex, amount = 0.2) {
    const parsed = hex.replace('#', '');
    const bigint = parseInt(parsed, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    const lighten = (channel) => Math.min(255, Math.floor(channel + (255 - channel) * amount));
    const newHex = `#${[lighten(r), lighten(g), lighten(b)].map((val) => val.toString(16).padStart(2, '0')).join('')}`;
    return newHex;
}

function updateAccent(color) {
    root.style.setProperty('--accent', color);
    root.style.setProperty('--accent-strong', lightenHex(color, 0.4));
    batteryLevelEl.style.filter = `drop-shadow(0 0 12px ${color})`;
}

function applyParallax() {
    const maxTranslate = 40 * parallaxIntensity;
    layers.forEach((layer) => {
        const depth = Number(layer.dataset.depth || 0.5);
        const translateX = pointerX * depth * maxTranslate;
        const translateY = pointerY * depth * maxTranslate;
        layer.style.setProperty('--parallax-x', `${translateX}px`);
        layer.style.setProperty('--parallax-y', `${translateY}px`);
    });
}

function handlePointerMove(event) {
    const rect = starfieldCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    pointerX = (x / rect.width - 0.5) * -1; // invert for subtle parallax
    pointerY = (y / rect.height - 0.5);
    applyParallax();
}

function simulateBattery() {
    batteryLevel += 0.0025 * batterySimDirection;
    if (batteryLevel > 0.95) {
        batterySimDirection = -1;
    } else if (batteryLevel < 0.35) {
        batterySimDirection = 1;
    }
    updateBatteryUI(batteryLevel, false);
    requestAnimationFrame(simulateBattery);
}

function updateBatteryUI(level, fromAPI) {
    const percent = Math.round(level * 100);
    batteryLevelEl.style.width = `${percent}%`;
    batteryTextEl.textContent = fromAPI ? `系统电量 ${percent}%` : `虚拟电量 ${percent}%`;
    if (percent < 40) {
        batteryLevelEl.classList.add('low');
    } else {
        batteryLevelEl.classList.remove('low');
    }
}

async function initBattery() {
    if ('getBattery' in navigator) {
        try {
            const battery = await navigator.getBattery();
            const handleBatteryChange = () => updateBatteryUI(battery.level, true);
            handleBatteryChange();
            battery.addEventListener('levelchange', handleBatteryChange);
            battery.addEventListener('chargingchange', handleBatteryChange);
            return;
        } catch (error) {
            console.warn('Battery API unavailable, falling back to simulation.', error);
        }
    }
    simulateBattery();
}

function togglePulse(active) {
    document.body.classList.toggle('pulse-off', !active);
}

function toggleNoise(active) {
    noiseOverlay.style.opacity = active ? '0.4' : '0';
}

function initEvents() {
    accentPicker.addEventListener('input', (event) => updateAccent(event.target.value));
    parallaxRange.addEventListener('input', (event) => {
        parallaxIntensity = parseInt(event.target.value, 10) / 100;
        applyParallax();
    });
    pulseToggle.addEventListener('change', (event) => togglePulse(event.target.checked));
    noiseToggle.addEventListener('change', (event) => toggleNoise(event.target.checked));
    randomQuoteBtn.addEventListener('click', pickRandomQuote);

    window.addEventListener('resize', () => {
        starfield.resize();
        applyParallax();
    });

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('deviceorientation', (event) => {
        if (event.gamma == null || event.beta == null) return;
        pointerX = (event.gamma / 45) * -1;
        pointerY = event.beta / 90;
        applyParallax();
    });
}

function init() {
    starfield.resize();
    starfield.render();
    updateClock();
    pickRandomQuote();
    updateAccent(accentPicker.value);
    toggleNoise(noiseToggle.checked);
    togglePulse(pulseToggle.checked);
    initBattery();
    initEvents();
    setInterval(updateClock, 1000);
}

window.addEventListener('DOMContentLoaded', init);

window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(animationFrameId);
});
