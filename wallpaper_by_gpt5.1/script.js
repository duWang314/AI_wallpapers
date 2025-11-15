const app = document.getElementById('app');
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;
let particles = [];
let animationId = null;
let animPaused = false;

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

window.addEventListener('resize', resize);
resize();

class Particle {
  constructor() {
    this.reset(true);
  }

  reset(initial = false) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.35;
    this.vy = (Math.random() - 0.5) * 0.35;
    this.baseSize = 1 + Math.random() * 2;
    this.pulseOffset = Math.random() * Math.PI * 2;
    if (!initial) {
      this.alpha = 0;
    } else {
      this.alpha = 0.5 + Math.random() * 0.4;
    }
  }

  update(t) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;

    const pulse = Math.sin(t * 0.002 + this.pulseOffset) * 0.3;
    this.size = this.baseSize + pulse;

    if (this.alpha < 0.9) this.alpha += 0.005;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = `rgba(0, 246, 255, ${this.alpha})`;
    ctx.shadowColor = 'rgba(0, 246, 255, 0.9)';
    ctx.shadowBlur = 8;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

for (let i = 0; i < 140; i++) {
  particles.push(new Particle());
}

function connectLines() {
  const maxDist = 140;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i];
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        const alpha = 1 - dist / maxDist;
        ctx.strokeStyle = `rgba(0, 246, 255, ${alpha * 0.4})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }
}

function animate(t = 0) {
  if (animPaused) return;
  animationId = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = 'rgba(2, 3, 10, 0.75)';
  ctx.fillRect(0, 0, width, height);

  particles.forEach(p => {
    p.update(t);
    p.draw();
  });
  connectLines();
}

animate();

const timeEl = document.getElementById('time-display');
const dateEl = document.getElementById('date-display');

function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  timeEl.textContent = `${h}:${m}:${s}`;

  const days = ['日', '一', '二', '三', '四', '五', '六'];
  const dateStr = `${now.getFullYear()} / ${now.getMonth() + 1} / ${now.getDate()}  周${days[now.getDay()]}`;
  dateEl.textContent = dateStr;
}

updateClock();
setInterval(updateClock, 1000);

const cpuMeter = document.getElementById('cpu-meter');
const ramMeter = document.getElementById('ram-meter');
const netMeter = document.getElementById('net-meter');

function smoothRandom(prev, range = 15) {
  let next = prev + (Math.random() * range - range / 2);
  if (next < 10) next = 10;
  if (next > 95) next = 95;
  return next;
}

let cpu = 35;
let ram = 48;
let net = 25;

function updateMeters() {
  cpu = smoothRandom(cpu);
  ram = smoothRandom(ram);
  net = smoothRandom(net);

  cpuMeter.style.width = cpu + '%';
  ramMeter.style.width = ram + '%';
  netMeter.style.width = net + '%';
}

updateMeters();
setInterval(updateMeters, 1300);

const orbitArea = document.getElementById('orbit-area');
const planets = Array.from(orbitArea.querySelectorAll('.planet'));

let orbitRect = orbitArea.getBoundingClientRect();
window.addEventListener('resize', () => {
  orbitRect = orbitArea.getBoundingClientRect();
});

function updateOrbitLayout() {
  orbitRect = orbitArea.getBoundingClientRect();
}

window.addEventListener('resize', updateOrbitLayout);

let orbitTime = 0;
function animateOrbit() {
  orbitTime += 0.016;
  const cx = orbitRect.width / 2;
  const cy = orbitRect.height / 2;

  planets.forEach((planet, index) => {
    const speed = parseFloat(planet.dataset.speed) || 1;
    const radiusX = (orbitRect.width / 2) * (0.35 + index * 0.2);
    const radiusY = (orbitRect.height / 2) * (0.2 + index * 0.16);
    const angle = orbitTime * speed + index * Math.PI * 0.6;

    const x = cx + Math.cos(angle) * radiusX;
    const y = cy + Math.sin(angle) * radiusY;

    planet.style.left = x + 'px';
    planet.style.top = y + 'px';
  });

  if (!animPaused) {
    requestAnimationFrame(animateOrbit);
  }
}

updateOrbitLayout();
requestAnimationFrame(animateOrbit);

let dragTarget = null;
let startX = 0;
let startY = 0;
let startLeft = 0;
let startTop = 0;
let hasDragged = false;

function makeDraggable(el) {
  el.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    dragTarget = el;
    hasDragged = false;
    startX = e.clientX;
    startY = e.clientY;
    const rect = el.getBoundingClientRect();
    startLeft = rect.left;
    startTop = rect.top;
    el.style.transition = 'none';
    el.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  });
}

['clock-widget', 'orbit-area'].forEach(id => {
  const el = document.getElementById(id).closest('.glass') || document.getElementById(id);
  makeDraggable(el);
});

window.addEventListener('mousemove', e => {
  if (!dragTarget) return;
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
    hasDragged = true;
  }
  dragTarget.style.position = 'absolute';
  dragTarget.style.left = startLeft + dx + 'px';
  dragTarget.style.top = startTop + dy + 'px';
  dragTarget.style.right = 'auto';
  dragTarget.style.bottom = 'auto';
});

window.addEventListener('mouseup', () => {
  if (!dragTarget) return;
  dragTarget.style.cursor = 'grab';
  dragTarget = null;
  document.body.style.userSelect = '';
});

const mainLayer = document.querySelector('.main-layer');
const defaultLayout = mainLayer.innerHTML;
let lastClickTime = 0;

mainLayer.addEventListener('click', e => {
  const now = Date.now();
  if (now - lastClickTime < 350 && !hasDragged) {
    mainLayer.innerHTML = defaultLayout;
    attachAfterReset();
  }
  lastClickTime = now;
});

function attachAfterReset() {
  const newOrbitArea = document.getElementById('orbit-area');
  const newPlanets = Array.from(newOrbitArea.querySelectorAll('.planet'));
  orbitRect = newOrbitArea.getBoundingClientRect();

  newPlanets.forEach(p => planets.push(p));

  ['clock-widget', 'orbit-area'].forEach(id => {
    const el = document.getElementById(id).closest('.glass') || document.getElementById(id);
    makeDraggable(el);
  });
}

const toggleThemeBtn = document.getElementById('toggle-theme');
const toggleAnimBtn = document.getElementById('toggle-anim');

let isSunset = false;

toggleThemeBtn.addEventListener('click', () => {
  isSunset = !isSunset;
  app.classList.toggle('theme-sunset', isSunset);
  app.classList.toggle('theme-neon', !isSunset);
});

toggleAnimBtn.addEventListener('click', () => {
  animPaused = !animPaused;
  if (!animPaused) {
    animate();
    requestAnimationFrame(animateOrbit);
    toggleAnimBtn.textContent = '暂停动效';
  } else {
    toggleAnimBtn.textContent = '恢复动效';
  }
});

canvas.addEventListener('mousemove', e => {
  const dx = (e.clientX / width - 0.5) * 2;
  const dy = (e.clientY / height - 0.5) * 2;
  particles.forEach(p => {
    p.x += dx * 0.4;
    p.y += dy * 0.4;
  });
});

canvas.addEventListener('click', e => {
  for (let i = 0; i < 12; i++) {
    const p = new Particle();
    p.x = e.clientX + (Math.random() - 0.5) * 40;
    p.y = e.clientY + (Math.random() - 0.5) * 40;
    p.alpha = 0;
    particles.push(p);
  }
});
