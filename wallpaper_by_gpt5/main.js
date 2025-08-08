// 炫酷互动壁纸主脚本
// 功能: 粒子网络 + 视差 + Ripple + 主题切换 + 自适应时间 + FPS + 配置持久化

(() => {
  const cfgKey = 'interactiveWallpaperConfigV1';
  const d = document;
  const body = d.body;
  const canvas = d.getElementById('space');
  const rippleCanvas = d.getElementById('ripple');
  const ctx = canvas.getContext('2d');
  const rctx = rippleCanvas.getContext('2d');
  const clockEl = d.getElementById('clock');
  const dateEl = d.getElementById('date');
  const quoteEl = d.getElementById('quote');
  const fpsBox = d.getElementById('fps');
  const panel = d.getElementById('panel');
  const gear = d.getElementById('gear');

  const toggleNetwork = d.getElementById('toggleNetwork');
  const toggleGlow = d.getElementById('toggleGlow');
  const toggleQuote = d.getElementById('toggleQuote');
  const toggleTimeCycle = d.getElementById('toggleTimeCycle');
  const particleDensityInput = d.getElementById('particleDensity');
  const linkDistanceInput = d.getElementById('linkDistance');
  const saveBtn = d.getElementById('saveConfig');
  const resetBtn = d.getElementById('resetConfig');
  const themeList = d.getElementById('themes');

  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width = rippleCanvas.width = W;
  canvas.height = rippleCanvas.height = H;

  const defaultConfig = {
    theme: 'default',
    network: true,
    glow: true,
    quote: true,
    timeCycle: true,
    density: 160,
    linkDist: 160
  };

  function loadConfig(){
    try {return Object.assign({}, defaultConfig, JSON.parse(localStorage.getItem(cfgKey)||'{}'));}catch(e){return {...defaultConfig};}
  }
  function saveConfig(){
    const data = {
      theme: body.getAttribute('data-theme')||'default',
      network: toggleNetwork.checked,
      glow: toggleGlow.checked,
      quote: toggleQuote.checked,
      timeCycle: toggleTimeCycle.checked,
      density: +particleDensityInput.value,
      linkDist: +linkDistanceInput.value
    };
    localStorage.setItem(cfgKey, JSON.stringify(data));
    flashSave();
  }
  function resetConfig(){
    localStorage.removeItem(cfgKey);location.reload();
  }

  const config = loadConfig();

  // 初始化UI状态
  toggleNetwork.checked = config.network;
  toggleGlow.checked = config.glow;
  toggleQuote.checked = config.quote;
  toggleTimeCycle.checked = config.timeCycle;
  particleDensityInput.value = config.density;
  linkDistanceInput.value = config.linkDist;

  function flashSave(){
    saveBtn.textContent = '已保存 ✔';
    setTimeout(()=> saveBtn.textContent='保存配置',1200);
  }

  saveBtn.addEventListener('click', saveConfig);
  resetBtn.addEventListener('click', resetConfig);

  gear.addEventListener('click', () => {
    const open = panel.classList.toggle('open');
    panel.setAttribute('aria-hidden', !open);
  });

  document.addEventListener('keydown', e => {
    if(e.key==='Escape' && panel.classList.contains('open')){
      panel.classList.remove('open');
    }
  });

  // 主题定义
  const themes = [
    { id:'default', name:'Default', class:'' , grad:'linear-gradient(135deg,#001727,#031f3a,#062c54,#031f3a)'},
    { id:'neo', name:'Neo', class:'theme-neo', grad:'linear-gradient(135deg,#001d1b,#002e44,#004f5a,#002e44)'},
    { id:'sunset', name:'Sunset', class:'theme-sunset', grad:'linear-gradient(135deg,#210012,#5a0e1f,#210012)'},
    { id:'violet', name:'Violet', class:'theme-violet', grad:'linear-gradient(135deg,#0a0021,#300e5a,#0a0021)'},
    { id:'matrix', name:'Matrix', class:'theme-matrix', grad:'linear-gradient(135deg,#001b13,#003b24,#001b13)'},
    { id:'gold', name:'Gold', class:'theme-gold', grad:'linear-gradient(135deg,#1f1600,#3f2e00,#1f1600)'}
  ];

  function renderThemes(){
    themeList.innerHTML = '';
    themes.forEach(t => {
      const b = document.createElement('button');
      b.className='theme-btn';
      b.dataset.id=t.id;
      b.innerHTML = `<span class="swatch" style="--grad:${t.grad}"></span><span>${t.name}</span>`;
      if(config.theme===t.id) b.classList.add('active');
      b.addEventListener('click', () => applyTheme(t));
      themeList.appendChild(b);
    });
  }

  function applyTheme(theme){
    body.className = theme.class; // 重置为单一主题类
    if(theme.id==='default') body.removeAttribute('class');
    body.setAttribute('data-theme', theme.id);
    [...themeList.children].forEach(ch => ch.classList.toggle('active', ch.dataset.id===theme.id));
    saveConfig();
  }

  renderThemes();
  // 应用初始主题
  const initTheme = themes.find(t=>t.id===config.theme) || themes[0];
  applyTheme(initTheme);

  // Quote 库
  const quotes = [
    'Stay hungry. Stay foolish.',
    'Simplicity is the ultimate sophistication.',
    'Code. Learn. Iterate.',
    '未来是由今天的代码构筑。',
    'Focus on signals, ignore noise.',
    'Do one thing well.',
    'Less is more.',
    '深度思考，快速行动。',
    'Dream in algorithms.',
    'Elegance is not a dispensable luxury.'
  ];

  function setQuote(){
    if(!toggleQuote.checked){ quoteEl.textContent=''; return; }
    const q = quotes[Math.floor(Math.random()*quotes.length)];
    quoteEl.textContent = q;
  }
  setQuote();
  setInterval(setQuote, 12000);

  // 时间 & 日期
  function pad(n){return n<10?'0'+n:n;}
  function updateClock(){
    const now = new Date();
    clockEl.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    dateEl.textContent = now.toLocaleDateString('zh-CN',{year:'numeric',month:'long',day:'numeric',weekday:'long'});
    if(toggleTimeCycle.checked){
      const hour = now.getHours();
      const glow = document.getElementById('bg-glow');
      const t = hour/24;
      // 动态生成两个色相
      const h1 = Math.floor((t*360 + 180)%360);
      const h2 = Math.floor((t*360 + 300)%360);
      glow.style.background = `radial-gradient(circle at 30% 40%,hsl(${h1} 80% 55%) 0,transparent 60%),radial-gradient(circle at 70% 70%,hsl(${h2} 80% 55%) 0,transparent 55%)`;
    }
  }
  updateClock();
  setInterval(updateClock,1000);

  // 粒子系统
  let particles = [];
  const mouse = {x:0,y:0,active:false};
  let density = config.density;
  let linkDist = config.linkDist;

  class Particle{
    constructor(){
      this.reset();
    }
    reset(){
      this.x = Math.random()*W;
      this.y = Math.random()*H;
      const speed = 0.15 + Math.random()*0.55; // 基础速度
      const angle = Math.random()*Math.PI*2;
      this.vx = Math.cos(angle)*speed;
      this.vy = Math.sin(angle)*speed;
      this.size = 1 + Math.random()*2.2;
      this.alpha = 0.25 + Math.random()*0.6;
    }
    step(){
      this.x += this.vx;
      this.y += this.vy;
      if(this.x<0||this.x>W||this.y<0||this.y>H){this.reset();}
    }
    draw(ctx){
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
      ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
      ctx.fill();
    }
  }

  function buildParticles(){
    particles = [];
    for(let i=0;i<density;i++) particles.push(new Particle());
  }
  buildParticles();

  particleDensityInput.addEventListener('input', e => {
    density = +e.target.value; buildParticles(); saveConfig();
  });
  linkDistanceInput.addEventListener('input', e => {
    linkDist = +e.target.value; saveConfig();
  });
  toggleNetwork.addEventListener('change', saveConfig);
  toggleGlow.addEventListener('change', ()=>{body.classList.toggle('no-glow', !toggleGlow.checked); saveConfig();});
  toggleQuote.addEventListener('change', ()=>{ if(toggleQuote.checked) setQuote(); else quoteEl.textContent=''; saveConfig();});
  toggleTimeCycle.addEventListener('change', saveConfig);

  // 鼠标交互
  window.addEventListener('mousemove', e => {mouse.x=e.clientX;mouse.y=e.clientY;mouse.active=true;});
  window.addEventListener('mouseleave', ()=> mouse.active=false);
  window.addEventListener('click', e => createRipple(e.clientX,e.clientY));

  // Ripple 效果
  const ripples = [];
  function createRipple(x,y){
    ripples.push({x,y,r:0,alpha:0.5});
  }

  function drawRipples(){
    rctx.clearRect(0,0,W,H);
    for(let i=ripples.length-1;i>=0;i--){
      const rp = ripples[i];
      rp.r += 4;
      rp.alpha *= 0.96;
      if(rp.alpha < 0.01){ripples.splice(i,1);continue;}
      const g = rctx.createRadialGradient(rp.x,rp.y,rp.r*0.2,rp.x,rp.y,rp.r);
      g.addColorStop(0,`rgba(255,255,255,${rp.alpha})`);
      g.addColorStop(1,'rgba(255,255,255,0)');
      rctx.beginPath();
      rctx.fillStyle = g;
      rctx.arc(rp.x,rp.y,rp.r,0,Math.PI*2);
      rctx.fill();
    }
  }

  // 渲染循环
  let lastTime = performance.now();
  let frameCount = 0; let fps = 0; let fpsLast = performance.now();

  function loop(now){
    requestAnimationFrame(loop);
    const dt = now - lastTime; lastTime = now;
    ctx.clearRect(0,0,W,H);

    if(toggleNetwork.checked){
      // 先绘制粒子
      particles.forEach(p=>{p.step();p.draw(ctx);});
      // 连接线
      for(let i=0;i<particles.length;i++){
        for(let j=i+1;j<particles.length;j++){
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x; const dy = a.y - b.y; const dist = dx*dx+dy*dy;
          if(dist < linkDist*linkDist){
            const o = 1 - dist/(linkDist*linkDist);
            ctx.strokeStyle = `rgba(255,255,255,${0.15*o})`;
            ctx.lineWidth = 1;
            ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
          }
        }
      }
      // 鼠标引力线
      if(mouse.active){
        particles.forEach(p => {
          const dx = p.x - mouse.x; const dy = p.y - mouse.y; const dist = Math.sqrt(dx*dx+dy*dy);
          if(dist < 180){
            ctx.strokeStyle = `rgba(255,255,255,${(1 - dist/180)*0.4})`;
            ctx.lineWidth = 1;
            ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(mouse.x,mouse.y);ctx.stroke();
            // 微效果: 略微推离
            p.x += dx/dist*0.15; p.y += dy/dist*0.15;
          }
        });
      }
    }

    drawRipples();

    frameCount++; if(now - fpsLast >= 1000){ fps = frameCount; frameCount=0; fpsLast = now; fpsBox.textContent = `FPS ${fps}\nP ${particles.length}`; }
  }
  requestAnimationFrame(loop);

  // 自适应尺寸
  window.addEventListener('resize', () => {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = rippleCanvas.width = W; canvas.height = rippleCanvas.height = H;
    // 不破坏现有粒子，增加/减少
    if(particles.length < density){
      for(let i=particles.length;i<density;i++) particles.push(new Particle());
    }else if(particles.length > density){
      particles.length = density;
    }
  });

  // 初始应用 glow 开关
  if(!config.glow) body.classList.add('no-glow');
})();
