const canvas = document.getElementById('wallpaper');
const ctx = canvas.getContext('2d');

// Resize canvas to full screen
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Particle system
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 4 - 2;
    this.speedY = Math.random() * 4 - 2;
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    this.life = 100;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= 1;
    if (this.life <= 0) {
      // Respawn
      this.x = canvas.width / 2;
      this.y = canvas.height / 2;
      this.life = 100;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 4 - 2;
      this.speedY = Math.random() * 4 - 2;
      this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const particles = [];
function initParticles(num) {
  for (let i = 0; i < num; i++) {
    particles.push(new Particle(canvas.width / 2, canvas.height / 2));
  }
}

initParticles(200);

// Interactive interaction: repel particles on mouse move
canvas.addEventListener('mousemove', function(e) {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  particles.forEach(p => {
    const dx = p.x - mouseX;
    const dy = p.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 100) {
      const angle = Math.atan2(dy, dx);
      p.speedX = Math.cos(angle) * 5;
      p.speedY = Math.sin(angle) * 5;
    }
  });
});

// Animation loop
function animate() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}

animate();
