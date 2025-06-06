class Particle {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.velocity = {
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2
    };
    this.radius = Math.random() * 2 + 1;
    this.hue = 240 + Math.random() * 60;
  }

  update(mouse) {
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx*dx + dy*dy);
    
    if (distance < 100) {
      const force = (100 - distance) / 100;
      this.velocity.x -= dx * force * 0.01;
      this.velocity.y -= dy * force * 0.01;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    if (this.x < 0 || this.x > this.canvas.width) this.velocity.x *= -1;
    if (this.y < 0 || this.y > this.canvas.height) this.velocity.y *= -1;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    this.ctx.fillStyle = `hsla(${this.hue}, 70%, 50%, 0.7)`;
    this.ctx.fill();
  }
}

// 初始化画布和粒子系统
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
const mouse = { x: 0, y: 0 };
const particles = Array(150).fill().map(() => new Particle(canvas, ctx));

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function animate() {
  ctx.fillStyle = 'rgba(10, 10, 12, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach(particle => {
    particle.update(mouse);
    particle.draw();
  });

  requestAnimationFrame(animate);
}

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('resize', resize);
resize();
animate();
