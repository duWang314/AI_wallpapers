class Particle {
    constructor(x, y, canvas) {
        this.x = x;
        this.y = y;
        this.canvas = canvas;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = `hsl(${Math.random() * 60 + 200}, 100%, 50%)`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > 0.2) this.size -= 0.1;

        // Bounce off edges
        if (this.x < 0 || this.x > this.canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.speedY *= -1;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class InteractiveWallpaper {
    constructor() {
        this.canvas = document.getElementById('wallpaperCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = {
            x: null,
            y: null,
            radius: 100
        };

        this.init();
    }

    init() {
        this.resizeCanvas();
        this.setupEventListeners();
        this.createParticles();
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());
        
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
            // Create new particles on mouse move
            for (let i = 0; i < 2; i++) {
                this.particles.push(new Particle(this.mouse.x, this.mouse.y, this.canvas));
            }
        });

        this.canvas.addEventListener('click', () => {
            // Create burst of particles on click
            for (let i = 0; i < 20; i++) {
                this.particles.push(new Particle(this.mouse.x, this.mouse.y, this.canvas));
            }
        });
    }

    createParticles() {
        for (let i = 0; i < 100; i++) {
            this.particles.push(
                new Particle(
                    Math.random() * this.canvas.width,
                    Math.random() * this.canvas.height,
                    this.canvas
                )
            );
        }
    }

    animate() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((particle, index) => {
            particle.update();
            particle.draw(this.ctx);

            // Remove small particles
            if (particle.size <= 0.2) {
                this.particles.splice(index, 1);
            }
        });

        // Keep particle count in check
        while (this.particles.length > 500) {
            this.particles.shift();
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Start the wallpaper
window.addEventListener('load', () => {
    new InteractiveWallpaper();
});
