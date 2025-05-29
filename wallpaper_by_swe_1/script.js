document.addEventListener('DOMContentLoaded', () => {
    // Initialize particles.js
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: {
                value: 0.5,
                random: true,
                animation: { enable: true, speed: 1, minimumValue: 0.1, sync: false }
            },
            size: {
                value: 3,
                random: true,
                animation: { enable: true, speed: 2, minimumValue: 0.1, sync: false }
            },
            lineLinked: {
                enable: true,
                distance: 150,
                color: "#ffffff",
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
                direction: "none",
                random: true,
                straight: false,
                outMode: "bounce",
                bounce: true
            }
        },
        interactivity: {
            detectsOn: "canvas",
            events: {
                onHover: { enable: true, mode: "repulse" },
                onClick: { enable: true, mode: "push" },
                resize: true
            },
            modes: {
                repulse: { distance: 100, duration: 0.4 },
                push: { particles_nb: 4 }
            }
        },
        retina_detect: true
    });

    // DOM Elements
    const planet = document.getElementById('planet');
    const moon = document.getElementById('moon');
    const orbit = document.getElementById('orbit');
    const changeColorBtn = document.getElementById('changeColor');
    const toggleOrbitBtn = document.getElementById('toggleOrbit');
    const body = document.body;
    const title = document.querySelector('.title');
    
    // Color themes
    const themes = [
        { 
            planet: 'linear-gradient(45deg, #ff6b6b, #ff8e8e)',
            moon: 'linear-gradient(45deg, #74b9ff, #a29bfe)',
            shadow: '0 0 60px rgba(255, 107, 107, 0.6)',
            moonShadow: '0 0 20px rgba(116, 185, 255, 0.6)'
        },
        {
            planet: 'linear-gradient(45deg, #6c5ce7, #a29bfe)',
            moon: 'linear-gradient(45deg, #00b894, #55efc4)',
            shadow: '0 0 60px rgba(108, 92, 231, 0.6)',
            moonShadow: '0 0 20px rgba(0, 184, 148, 0.6)'
        },
        {
            planet: 'linear-gradient(45deg, #00b894, #00cec9)',
            moon: 'linear-gradient(45deg, #fdcb6e, #ffeaa7)',
            shadow: '0 0 60px rgba(0, 184, 148, 0.6)',
            moonShadow: '0 0 20px rgba(253, 203, 110, 0.6)'
        },
        {
            planet: 'linear-gradient(45deg, #e84393, #fd79a8)',
            moon: 'linear-gradient(45deg, #a55eea, #d1d8e0)',
            shadow: '0 0 60px rgba(232, 67, 147, 0.6)',
            moonShadow: '0 0 20px rgba(165, 94, 234, 0.6)'
        }
    ];
    
    let currentTheme = 0;
    let isOrbitActive = true;
    
    // Mouse move effect for parallax
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 50;
        const y = (window.innerHeight / 2 - e.pageY) / 50;
        
        if (planet) {
            planet.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        }
        
        if (title) {
            title.style.transform = `translateX(${x / 2}px) translateY(${y / 2}px)`;
        }
    });
    
    // Change theme function
    function changeTheme() {
        currentTheme = (currentTheme + 1) % themes.length;
        const theme = themes[currentTheme];
        
        planet.style.background = theme.planet;
        planet.style.boxShadow = theme.shadow;
        moon.style.background = theme.moon;
        moon.style.boxShadow = theme.moonShadow;
        
        // Change title glow color
        document.documentElement.style.setProperty('--glow-color', theme.planet);
    }
    
    // Toggle orbit animation
    function toggleOrbit() {
        isOrbitActive = !isOrbitActive;
        if (isOrbitActive) {
            orbit.style.animationPlayState = 'running';
            toggleOrbitBtn.textContent = 'Pause Orbit';
        } else {
            orbit.style.animationPlayState = 'paused';
            toggleOrbitBtn.textContent = 'Resume Orbit';
        }
    }
    
    // Add click effects to planet
    planet.addEventListener('click', () => {
        planet.style.transform = 'scale(0.9)';
        setTimeout(() => {
            planet.style.transform = 'scale(1)';
        }, 200);
    });
    
    // Event Listeners
    changeColorBtn.addEventListener('click', changeTheme);
    toggleOrbitBtn.addEventListener('click', toggleOrbit);
    
    // Initial theme setup
    changeTheme();
    
    // Add floating animation to planet
    setInterval(() => {
        if (isOrbitActive) {
            const y = Math.sin(Date.now() / 1000) * 10;
            planet.style.transform = `translateY(${y}px)`;
        }
    }, 50);
});
