const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Function to resize canvas with window
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Particle class
class Particle {
    constructor() {
        this.position = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        };
        this.velocity = {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2
        };
        this.size = Math.random() * 3 + 1;
    }

    // Update particle position
    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.x > canvas.width || this.position.x < 0) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.position.y > canvas.height || this.position.y < 0) {
            this.velocity.y = -this.velocity.y;
        }
    }

    // Draw particle on canvas
    draw() {
        ctx.fillStyle = 'rgba(173, 216, 230, 0.8)';
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}

// Initialize particles
const particles = [];
for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animate);
}

animate();