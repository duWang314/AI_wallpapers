const canvas = document.getElementById('wallpaperCanvas');
const ctx = canvas.getContext('2d');

// Set canvas to full window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Particle system
const particles = [];
const particleCount = 300;

// Color palette based on time
const getColorPalette = () => {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 12) {
        return ['#FF9A8B', '#FF7AA2', '#FF5D8F', '#FF97B7'];
    } else if (hour >= 12 && hour < 18) {
        return ['#4CC9F0', '#4361EE', '#3A0CA3', '#7209B7'];
    } else {
        return ['#14213D', '#FCA311', '#E5E5E5', '#000000'];
    }
};

// Particle class
class Particle {
    constructor() {
        this.reset();
        this.size = Math.random() * 5 + 1;
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = getColorPalette()[Math.floor(Math.random() * 4)];
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x < 0 || this.x > canvas.width || 
            this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Create particles
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

// Mouse interaction
const mouse = {
    x: undefined,
    y: undefined,
    radius: 100
};

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('click', (e) => {
    // Create ripple effect on click
    for (let i = 0; i < 20; i++) {
        particles.push(new Particle());
        particles[particles.length - 1].x = e.x;
        particles[particles.length - 1].y = e.y;
    }
});

// Animation loop
function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Mouse interaction
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
            particles[i].speedX += dx * 0.01;
            particles[i].speedY += dy * 0.01;
        }
    }
    
    requestAnimationFrame(animate);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
