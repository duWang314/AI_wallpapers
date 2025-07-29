// Get DOM elements
const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');
const greetingElement = document.getElementById('greetingText');
const themeToggle = document.getElementById('themeToggle');
const particlesToggle = document.getElementById('particlesToggle');
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Initialize canvas size
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Update time and date
function updateTime() {
    const now = new Date();
    
    // Format time
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    timeElement.textContent = `${hours}:${minutes}`;
    
    // Format date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = now.toLocaleDateString('en-US', options);
    
    // Update greeting based on time of day
    updateGreeting(hours);
}

function updateGreeting(hours) {
    if (hours >= 5 && hours < 12) {
        greetingElement.textContent = 'Good Morning';
    } else if (hours >= 12 && hours < 17) {
        greetingElement.textContent = 'Good Afternoon';
    } else if (hours >= 17 && hours < 21) {
        greetingElement.textContent = 'Good Evening';
    } else {
        greetingElement.textContent = 'Good Night';
    }
}

// Particle system
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Create particles
let particles = [];
const particleCount = 100;

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    
    requestAnimationFrame(animate);
}

// Theme toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
});

// Particles toggle
let particlesEnabled = true;
particlesToggle.addEventListener('click', () => {
    particlesEnabled = !particlesEnabled;
    particlesToggle.textContent = particlesEnabled ? 'Toggle Particles' : 'Enable Particles';
    
    if (particlesEnabled) {
        animate();
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});

// Interactive elements
const elements = document.querySelectorAll('.element');
elements.forEach(element => {
    element.addEventListener('click', function() {
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.width = '100%';
        ripple.style.height = '100%';
        ripple.style.borderRadius = '50%';
        ripple.style.border = '2px solid white';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.pointerEvents = 'none';
        
        // Add CSS for ripple animation
        if (!document.getElementById('ripple-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-style';
            style.innerHTML = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        this.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
        
        // Change color temporarily
        const originalColor = this.style.background;
        this.style.background = 'radial-gradient(circle, #00ff9d, transparent 70%)';
        setTimeout(() => {
            this.style.background = originalColor;
        }, 300);
    });
});

// Mouse move effect
document.addEventListener('mousemove', (e) => {
    if (!particlesEnabled) return;
    
    // Add a few particles at mouse position
    for (let i = 0; i < 2; i++) {
        if (particles.length < 200) { // Limit total particles
            const particle = new Particle();
            particle.x = e.clientX;
            particle.y = e.clientY;
            particles.push(particle);
        }
    }
});

// Initialize and start
updateTime();
setInterval(updateTime, 60000); // Update time every minute
initParticles();

// Check for saved theme preference
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-theme');
}

// Start animation
animate();

// Add a few interactive features
document.addEventListener('keydown', (e) => {
    // Press 'T' to toggle theme
    if (e.key.toLowerCase() === 't') {
        themeToggle.click();
    }
    
    // Press 'P' to toggle particles
    if (e.key.toLowerCase() === 'p') {
        particlesToggle.click();
    }
});