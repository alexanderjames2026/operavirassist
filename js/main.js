async function loadComponent(id, file) {
    const element = document.getElementById(id);
    if (!element) return;

    try {
        const res = await fetch(file);
        if (!res.ok) throw new Error(`Could not load ${file}`);
        const html = await res.text();
        element.innerHTML = html;

        // Re-run icon replacement for injected HTML
        if (window.lucide) {
            lucide.createIcons();
        }

        // If we just loaded the header, attach the menu logic
        if (id === "header") {
            initNavbar();
        }
    } catch (err) {
        console.error("Error loading component:", err);
    }
}


function initNavbar() {
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("navMenu");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    hamburger.classList.toggle("open");
    document.body.classList.toggle("menu-open");
});}

    // Handle Mobile Dropdowns
    const dropLink = document.querySelector(".drop-link");
    if (dropLink) {
        dropLink.addEventListener("click", function(e) {
            if (window.innerWidth <= 900) {
                e.preventDefault();
                const parent = this.closest(".dropdown");
                parent.classList.toggle("open");
            }
        });
    }
}


function initCanvas() {
    const container = document.getElementById('canvas-bg');
    if (!container) return;

    container.innerHTML = '<canvas id="bg-canvas"></canvas>';

    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');

    let particles = [];

    /* ---------- GLOW COLORS ---------- */
    const GLOW = {
        core: "rgba(63,169,255,0.9)",   // electric blue
        glow: "rgba(123,92,255,0.8)",   // violet aura
        line: "rgba(63,169,255,0.15)"   // connection lines
    };

    /* ---------- RESIZE ---------- */
    function resizeCanvas() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        createParticles();
    }

    /* ---------- PARTICLE CLASS ---------- */
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 1.5;

            this.speedX = Math.random() * 0.6 - 0.3;
            this.speedY = Math.random() * 0.6 - 0.3;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // wrap edges
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.shadowBlur = 25;
            ctx.shadowColor = GLOW.glow;

            ctx.fillStyle = GLOW.core;

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();

            ctx.shadowBlur = 0;
        }
    }

    /* ---------- CREATE PARTICLES ---------- */
    function createParticles() {
        const density =
            window.innerWidth < 768 ? 22000 : 15000;

        const count = Math.floor(
            (canvas.width * canvas.height) / density
        );

        particles = [];

        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    /* ---------- CONNECT PARTICLES ---------- */
    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {

                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const dist = dx * dx + dy * dy;

                if (dist < 12000) {
                    ctx.strokeStyle = GLOW.line;
                    ctx.lineWidth = 1;

                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    /* ---------- BACKGROUND GLOW ---------- */
    function drawAmbientGlow() {
        const gradient = ctx.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            0,
            canvas.width / 2,
            canvas.height / 2,
            canvas.width * 0.6
        );

        gradient.addColorStop(0, "rgba(63,169,255,0.08)");
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    /* ---------- ANIMATION LOOP ---------- */
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // environment glow
        drawAmbientGlow();

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        connectParticles();

        requestAnimationFrame(animate);
    }

    /* ---------- EVENTS ---------- */
    window.addEventListener('resize', resizeCanvas);

    window.addEventListener('orientationchange', () => {
        setTimeout(resizeCanvas, 300);
    });

    resizeCanvas();
    animate();
}

document.addEventListener("DOMContentLoaded", () => {
    loadComponent("header", "/components/header.html");
    loadComponent("footer", "/components/footer.html");
    initCanvas();
});