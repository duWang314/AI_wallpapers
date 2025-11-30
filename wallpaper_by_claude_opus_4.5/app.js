(() => {
  const canvas = document.getElementById('bg');
  const ctx = canvas.getContext('2d');
  let W = canvas.width = innerWidth;
  let H = canvas.height = innerHeight;

  const el = (id) => document.getElementById(id);
  const countEl = el('count');
  const sizeEl = el('size');
  const colorEl = el('color');
  const themeBtn = el('theme');
  const fullscreenBtn = el('fullscreen');
  const resetBtn = el('reset');
  const motionEl = el('motion');

  let particles = [];
  let mouse = {x: W/2, y: H/2, down:false};

  function resize(){
    W = canvas.width = innerWidth;
    H = canvas.height = innerHeight;
  }
  addEventListener('resize', resize);

  addEventListener('mousemove', (e)=>{ mouse.x = e.clientX; mouse.y = e.clientY; });
  addEventListener('mousedown', ()=> mouse.down = true);
  addEventListener('mouseup', ()=> mouse.down = false);

  class Particle{
    constructor(){
      this.reset(true);
    }
    reset(init=false){
      this.x = Math.random()*W;
      this.y = Math.random()*H;
      const ang = Math.random()*Math.PI*2;
      const speed = (Math.random()*0.6)+0.1;
      this.vx = Math.cos(ang)*speed;
      this.vy = Math.sin(ang)*speed;
      this.size = parseFloat(sizeEl.value) * (0.6 + Math.random()*0.9);
      this.color = colorEl.value;
      this.life = 100 + Math.random()*200;
      if(!init && Math.random()<0.02){ this.x = mouse.x; this.y = mouse.y; this.vx = (Math.random()-0.5)*6; this.vy = (Math.random()-0.5)*6; }
    }
    update(){
      // simple attraction/repel to mouse when down
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx*dx+dy*dy) + 0.001;
      if(mouse.down){
        const f = Math.min(120/dist, 0.6);
        this.vx += dx/dist * f;
        this.vy += dy/dist * f;
      } else {
        // slight drift away
        if(dist < 80){
          const f = -0.02;
          this.vx += dx/dist * f; this.vy += dy/dist * f;
        }
      }

      // bounds
      if(this.x < -50) this.x = W + 50;
      if(this.x > W + 50) this.x = -50;
      if(this.y < -50) this.y = H + 50;
      if(this.y > H + 50) this.y = -50;

      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.995; this.vy *= 0.995;
      this.life--;
      if(this.life <= 0) this.reset();
    }
    draw(){
      ctx.beginPath();
      const g = ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.size*8);
      g.addColorStop(0, hexToRgba(this.color,0.95));
      g.addColorStop(0.3, hexToRgba(this.color,0.25));
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
      ctx.fill();
    }
  }

  function hexToRgba(hex, a=1){
    const c = hex.replace('#','');
    const r = parseInt(c.substring(0,2),16);
    const g = parseInt(c.substring(2,4),16);
    const b = parseInt(c.substring(4,6),16);
    return `rgba(${r},${g},${b},${a})`;
  }

  function spawn(n){
    particles.length = 0;
    for(let i=0;i<n;i++) particles.push(new Particle());
  }

  function frame(){
    requestAnimationFrame(frame);
    // motion blur / clear
    if(motionEl.checked){
      ctx.fillStyle = hexToRgba(getComputedStyle(document.documentElement).getPropertyValue('--bg2').trim() || '#081223', 0.12);
      ctx.fillRect(0,0,W,H);
    } else {
      ctx.clearRect(0,0,W,H);
    }

    // subtle background shapes
    drawBackground();

    // update & draw particles
    for(let p of particles){ p.update(); p.draw(); }
  }

  function drawBackground(){
    // moving gradient band
    const t = Date.now()/7000;
    const x = Math.sin(t)*W*0.4;
    const grad = ctx.createLinearGradient(0,0,W,H);
    grad.addColorStop(0, hexToRgba(getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#00d1ff',0.04));
    grad.addColorStop(0.5, hexToRgba(getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#00d1ff',0.02));
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(-W*0.25 + x, H*0.15, W*1.5, H*0.6);
  }

  // UI wiring
  countEl.addEventListener('input', ()=>{ spawn(parseInt(countEl.value)); saveSettings(); });
  sizeEl.addEventListener('input', ()=>{ for(let p of particles) p.size = parseFloat(sizeEl.value) * (0.6 + Math.random()*0.9); saveSettings(); });
  colorEl.addEventListener('input', ()=>{ for(let p of particles) p.color = colorEl.value; document.documentElement.style.setProperty('--accent', colorEl.value); saveSettings(); });

  themeBtn.addEventListener('click', ()=>{ document.body.classList.toggle('light'); saveSettings(); });
  fullscreenBtn.addEventListener('click', ()=>{
    if(!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen();
  });
  resetBtn.addEventListener('click', ()=>{ localStorage.removeItem('neon.wallpaper'); location.reload(); });

  function saveSettings(){
    const s = {count:countEl.value,size:sizeEl.value,color:colorEl.value,theme: document.body.classList.contains('light'),motion: motionEl.checked};
    localStorage.setItem('neon.wallpaper', JSON.stringify(s));
  }

  function loadSettings(){
    try{
      const s = JSON.parse(localStorage.getItem('neon.wallpaper'));
      if(!s) return;
      countEl.value = s.count||countEl.value;
      sizeEl.value = s.size||sizeEl.value;
      colorEl.value = s.color||colorEl.value;
      motionEl.checked = s.motion===undefined?motionEl.checked:!!s.motion;
      if(s.theme) document.body.classList.add('light'); else document.body.classList.remove('light');
    }catch(e){/* ignore */}
  }

  // init
  loadSettings();
  spawn(parseInt(countEl.value));
  document.documentElement.style.setProperty('--accent', colorEl.value);
  frame();

  // small touches — click to create bursts
  addEventListener('click', (e)=>{
    for(let i=0;i<12;i++){
      const p = new Particle(); p.x = e.clientX; p.y = e.clientY; p.vx = (Math.random()-0.5)*6; p.vy = (Math.random()-0.5)*6; particles.push(p);
    }
    // trim if too many
    const max = Math.max(1200, parseInt(countEl.value)*2);
    if(particles.length > max) particles.splice(0, particles.length - max);
  });

})();
