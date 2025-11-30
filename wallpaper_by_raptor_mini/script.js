const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let w = (canvas.width = innerWidth);
let h = (canvas.height = innerHeight);

// UI
const themeSelect = document.getElementById('themeSelect');
const particleCountInput = document.getElementById('particleCount');
const speedInput = document.getElementById('speed');
const toggleBlurBtn = document.getElementById('toggleBlur');
const info = document.getElementById('info');

// HUD
const clockEl = document.getElementById('clock');
const dateEl = document.getElementById('date');

// Settings & state
const settings = {
  theme: 'neon',
  particles: parseInt(particleCountInput.value, 10),
  speed: parseFloat(speedInput.value),
  blur: false
};

let mouse = { x: w / 2, y: h / 2 };
let particles = [];
let pulses = [];

// Colors by theme
const THEMES = {
  neon: { bg: ['#0b0b12', '#020217'], particle: ['#7b61ff', '#ff4d6d'] },
  synth: { bg: ['#0b0711', '#060216'], particle: ['#ff0080', '#6f5bff'] },
  space: { bg: ['#05020e', '#001021'], particle: ['#cfe8ff', '#ffeded'] },
  calm: { bg: ['#061f3b', '#032626'], particle: ['#78f6d2', '#5fb8ff'] }
};

// Resize canvas
function resize() {
  w = canvas.width = innerWidth;
  h = canvas.height = innerHeight;
}

window.addEventListener('resize', resize);

// Particle
class Particle {
  constructor() {
    this.reset();
  }
  reset(){
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = 1 + Math.random() * 3;
    this.life = 100 + Math.random() * 200;
    this.hue = 0;
    this.baseColor = THEMES[settings.theme].particle[Math.floor(Math.random()*2)];
  }
  step(dt){
    // move
    this.x += this.vx * settings.speed * dt;
    this.y += this.vy * settings.speed * dt;

    // wrap
    if (this.x < -10) this.x = w + 10;
    if (this.x > w + 10) this.x = -10;
    if (this.y < -10) this.y = h + 10;
    if (this.y > h + 10) this.y = -10;

    // float toward mouse slightly
    this.vx += (mouse.x - this.x) * 0.00002;
    this.vy += (mouse.y - this.y) * 0.00002;

    this.life -= dt;
    if (this.life <= 0) this.reset();
  }
  draw(ctx){
    ctx.save();
    const grad = ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.size*8);
    grad.addColorStop(0, this.baseColor);
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
    ctx.fill();
    ctx.restore();
  }
}

// Pulse effect when clicking
class Pulse {
  constructor(x,y){
    this.x = x; this.y = y; this.r = 0; this.max = Math.min(w,h)*0.8; this.alpha = 0.6;
  }
  step(dt){
    this.r += 300 * dt * settings.speed;
    this.alpha -= 0.005 * dt;
  }
  draw(ctx){
    ctx.save();
    ctx.beginPath();
    ctx.globalCompositeOperation = 'screen';
    ctx.strokeStyle = `rgba(255,255,255,${Math.max(0, this.alpha)})`;
    ctx.lineWidth = 2;
    ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
    ctx.stroke();
    ctx.restore();
  }
}

// Mouse & interaction
window.addEventListener('mousemove', (e)=>{
  mouse.x = e.clientX; mouse.y = e.clientY;
});
window.addEventListener('click', (e)=>{
  pulses.push(new Pulse(e.clientX, e.clientY));
  // create particle burst
  for (let i=0;i<8;i++){
    const p = new Particle();
    p.x = e.clientX; p.y = e.clientY;
    p.vx = (Math.random()-0.5)*6; p.vy = (Math.random()-0.5)*6;
    p.life = 50 + Math.random()*80;
    particles.push(p);
  }
});

// Keyboard shortcuts
window.addEventListener('keydown', (e)=>{
  if(e.key === 'b') toggleBlur();
});

// Setup particles
function resetParticles(){
  particles = [];
  for (let i=0;i<settings.particles;i++) particles.push(new Particle());
}

// Theme management
function setTheme(name){
  document.body.classList.remove(...Object.keys(THEMES));
  document.body.classList.add(name);
  settings.theme = name;
  // update particle colors
  particles.forEach(p => p.baseColor = THEMES[name].particle[Math.floor(Math.random()*2)]);
}

// Blur toggle
function toggleBlur(){
  settings.blur = !settings.blur;
  if(settings.blur){
    canvas.classList.add('canvas-blur'); toggleBlurBtn.textContent = '模糊: 开';
  } else { canvas.classList.remove('canvas-blur'); toggleBlurBtn.textContent = '模糊: 关'; }
}

// UI events
themeSelect.addEventListener('change', (e)=>{
  setTheme(e.target.value);
});
particleCountInput.addEventListener('input', (e)=>{
  settings.particles = parseInt(e.target.value, 10);
  resetParticles();
});
speedInput.addEventListener('input', (e)=>{
  settings.speed = parseFloat(e.target.value);
});
toggleBlurBtn.addEventListener('click', toggleBlur);

// clock update
function updateClock(){
  const now = new Date();
  const h = now.getHours().toString().padStart(2,'0');
  const m = now.getMinutes().toString().padStart(2,'0');
  clockEl.textContent = `${h}:${m}`;
  dateEl.textContent = now.toLocaleDateString();
}
updateClock();
setInterval(updateClock, 1000);

// Render loop
let last = performance.now();
function loop(t){
  let dt = (t-last)/16.6667; // approx 60fps multiplier
  last = t;
  ctx.clearRect(0,0,w,h);

  // background gradient
  const theme = THEMES[settings.theme];
  const g = ctx.createLinearGradient(0,0,w,h);
  g.addColorStop(0, theme.bg[0]);
  g.addColorStop(1, theme.bg[1]);
  ctx.fillStyle = g;
  ctx.fillRect(0,0,w,h);

  // subtle lines for depth
  ctx.globalAlpha = 0.06;
  for(let i=0;i<6;i++){
    ctx.fillStyle = `rgba(255,255,255,${0.03*(1+i/2)})`;
    ctx.fillRect(0, h*(i/6), w, 1);
  }
  ctx.globalAlpha = 1;

  // parallax: shift center to mouse slightly
  ctx.save();
  ctx.translate((mouse.x - w/2) * -0.01, (mouse.y - h/2) * -0.01);

  // draw pulses
  for (let i=pulses.length-1;i>=0;i--){
    pulses[i].step(dt);
    pulses[i].draw(ctx);
    if (pulses[i].alpha <= 0) pulses.splice(i,1);
  }

  // particles
  for (let i=0;i<particles.length;i++){
    particles[i].step(dt);
    particles[i].draw(ctx);
  }

  // lines between close particles
  ctx.save();
  ctx.globalCompositeOperation='lighter';
  for (let i=0;i<particles.length;i++){
    for (let j=i+1;j<particles.length;j++){
      let a = particles[i], b = particles[j];
      let dx = a.x-b.x, dy = a.y-b.y;
      let dist = Math.sqrt(dx*dx+dy*dy);
      if (dist<120){
        ctx.strokeStyle = 'rgba(255,255,255,' + (0.035*(1-(dist/120))) + ')';
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
      }
    }
  }
  ctx.restore();

  ctx.restore(); // parallax

  // subtle vignette
  ctx.save();
  const v = ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,Math.max(w,h)/1.2);
  v.addColorStop(0,'rgba(0,0,0,0)');
  v.addColorStop(1,'rgba(0,0,0,0.35)');
  ctx.fillStyle = v; ctx.fillRect(0,0,w,h);
  ctx.restore();

  // overlay instructions
  info.style.opacity = 0.95 - Math.min(0.85, Math.min(1, Math.abs(mouse.x-w/2)/(w/2)) + Math.min(1, Math.abs(mouse.y-h/2)/(h/2)));

  // keep particle number close to requested
  if (particles.length > settings.particles*1.5) particles.splice(0, particles.length - settings.particles);
  if (particles.length < settings.particles) particles.push(new Particle());

  requestAnimationFrame(loop);
}

// init
resetParticles();
setTheme(settings.theme);
requestAnimationFrame(loop);

// On load small pulse
window.addEventListener('load', ()=>pulses.push(new Pulse(w/2,h/2)));

// expose for debug
window.__WALLPAPER = { resetParticles, setTheme, settings };
