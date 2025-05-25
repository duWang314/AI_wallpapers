document.addEventListener('DOMContentLoaded', () => {
    // Initialize the time and date display
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Initialize the particles
    createParticles(100);

    // Add mouse interaction
    document.addEventListener('mousemove', handleMouseMove);
    
    // Add click interaction to create ripple effect
    document.addEventListener('click', createRipple);
});

// Function to update the time and date
function updateDateTime() {
    const now = new Date();
    
    // Update time
    const timeElement = document.querySelector('.time');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    timeElement.textContent = `${hours}:${minutes}:${seconds}`;
    
    // Update date
    const dateElement = document.querySelector('.date');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = now.toLocaleDateString(undefined, options);
}

// Function to create particles
function createParticles(count) {
    const container = document.querySelector('.particles-container');
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random properties
        const size = Math.random() * 5 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const opacity = Math.random() * 0.5 + 0.1;
        const animationDuration = Math.random() * 20 + 10;
        
        // Apply styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.opacity = opacity;
        
        // Add random floating animation
        particle.style.animation = `float ${animationDuration}s infinite ease-in-out`;
        particle.style.animationDelay = `-${Math.random() * animationDuration}s`;
        
        container.appendChild(particle);
    }
}

// Function to handle mouse movement
function handleMouseMove(event) {
    const shapes = document.querySelectorAll('.shape');
    const mouseX = event.clientX / window.innerWidth;
    const mouseY = event.clientY / window.innerHeight;
    
    // Move shapes slightly in response to mouse position
    shapes.forEach((shape, index) => {
        const factorX = (index % 2 === 0 ? -1 : 1) * (10 + index * 5);
        const factorY = (index % 3 === 0 ? 1 : -1) * (10 + index * 5);
        
        shape.style.transform = `translate(${(mouseX - 0.5) * factorX}px, ${(mouseY - 0.5) * factorY}px) rotate(${(mouseX - 0.5) * 10}deg)`;
    });
    
    // Change background gradient slightly
    document.body.style.background = `linear-gradient(${135 + mouseX * 30}deg, #121212 0%, #2d3436 ${50 + mouseY * 20}%, #3d5a73 100%)`;
}

// Function to create ripple effect on click
function createRipple(event) {
    const container = document.querySelector('.container');
    const ripple = document.createElement('div');
    
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    ripple.style.width = '10px';
    ripple.style.height = '10px';
    ripple.style.left = `${event.clientX}px`;
    ripple.style.top = `${event.clientY}px`;
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.pointerEvents = 'none';
    
    container.appendChild(ripple);
    
    // Animate the ripple
    let scale = 1;
    let opacity = 0.5;
    
    const animate = () => {
        scale += 0.2;
        opacity -= 0.01;
        
        ripple.style.transform = `translate(-50%, -50%) scale(${scale})`;
        ripple.style.opacity = opacity;
        
        if (opacity > 0) {
            requestAnimationFrame(animate);
        } else {
            container.removeChild(ripple);
        }
    };
    
    requestAnimationFrame(animate);
}
