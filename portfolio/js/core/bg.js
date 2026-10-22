(function () {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); // alpha:false optimizes background rendering

    let width, height;
    let particles = [];
    let mouse = { x: -1000, y: -1000 };

    // --- Configuration ---
    const MAX_PARTICLES = window.innerWidth > 768 ? 70 : 40; // Fewer particles on mobile for 60fps
    const CONNECTION_DISTANCE = 140;
    const MOUSE_REPULSION_RADIUS = 120;
    const MOUSE_REPULSION_FORCE = 0.03;

    // --- Color Management & Dual-Tone Lerping ---
    let currentColors = {
        bg: [7, 11, 18],
        accent: [56, 189, 248],
        secondary: [129, 140, 248]
    };
    let targetColors = {
        bg: [7, 11, 18],
        accent: [56, 189, 248],
        secondary: [129, 140, 248]
    };

    function hexToRgb(hex) {
        let cleanHex = hex.replace('#', '').trim();
        if (cleanHex.length === 3) cleanHex = cleanHex.split('').map(c => c + c).join('');
        const num = parseInt(cleanHex, 16);
        return isNaN(num) ? [56, 189, 248] : [(num >> 16) & 255, (num >> 8) & 255, num & 255];
    }

    function updateThemeColors() {
        const styles = getComputedStyle(document.body);
        targetColors.bg = hexToRgb(styles.getPropertyValue('--bg-color') || '#070B12');
        targetColors.accent = hexToRgb(styles.getPropertyValue('--accent-color') || '#38BDF8');
        targetColors.secondary = hexToRgb(styles.getPropertyValue('--accent-secondary') || '#818CF8');
    }

    function lerpColor(current, target, speed = 0.06) {
        return current.map((c, i) => c + (target[i] - c) * speed);
    }

    // --- Initialization ---
    function init() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        particles = [];
        
        for (let i = 0; i < MAX_PARTICLES; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                baseVx: (Math.random() - 0.5) * 0.6, // Constant drift
                baseVy: (Math.random() - 0.5) * 0.6,
                pushVx: 0, // Temporary mouse push
                pushVy: 0,
                radius: Math.random() * 1.5 + 0.6
            });
        }
        
        updateThemeColors();
        currentColors.bg = [...targetColors.bg];
        currentColors.accent = [...targetColors.accent];
        currentColors.secondary = [...targetColors.secondary];
    }

    // --- Event Listeners ---
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseout', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    }, { passive: true });

    window.addEventListener('themeChanged', updateThemeColors);
    
    // Initial color grab just in case
    setTimeout(updateThemeColors, 100);

    // --- Main Loop ---
    function loop() {
        // Smoothly transition all 3 color channels
        currentColors.bg = lerpColor(currentColors.bg, targetColors.bg);
        currentColors.accent = lerpColor(currentColors.accent, targetColors.accent);
        currentColors.secondary = lerpColor(currentColors.secondary, targetColors.secondary);

        // Fill background
        ctx.fillStyle = `rgb(${Math.round(currentColors.bg[0])}, ${Math.round(currentColors.bg[1])}, ${Math.round(currentColors.bg[2])})`;
        ctx.fillRect(0, 0, width, height);

        const accentRgb = `${Math.round(currentColors.accent[0])}, ${Math.round(currentColors.accent[1])}, ${Math.round(currentColors.accent[2])}`;
        const secondaryRgb = `${Math.round(currentColors.secondary[0])}, ${Math.round(currentColors.secondary[1])}, ${Math.round(currentColors.secondary[2])}`;

        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];

            // Movement combines constant drift + temporary mouse push
            p.x += p.baseVx + p.pushVx;
            p.y += p.baseVy + p.pushVy;

            // Screen wrapping
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            // Mouse interaction (gentle push)
            let dx = p.x - mouse.x;
            let dy = p.y - mouse.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < MOUSE_REPULSION_RADIUS) {
                let force = (MOUSE_REPULSION_RADIUS - dist) / MOUSE_REPULSION_RADIUS;
                p.pushVx += (dx / dist) * force * MOUSE_REPULSION_FORCE;
                p.pushVy += (dy / dist) * force * MOUSE_REPULSION_FORCE;
            }

            // Friction ONLY applies to the mouse push!
            p.pushVx *= 0.95;
            p.pushVy *= 0.95;

            // Draw particle node using Primary Accent
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${accentRgb}, 0.55)`;
            ctx.fill();

            // Connect constellation lines using Secondary Accent
            for (let j = i + 1; j < particles.length; j++) {
                let p2 = particles[j];
                let dx2 = p.x - p2.x;
                let dy2 = p.y - p2.y;
                let dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                if (dist2 < CONNECTION_DISTANCE) {
                    let opacity = 1 - (dist2 / CONNECTION_DISTANCE);
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(${secondaryRgb}, ${opacity * 0.28})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(loop);
    }

    init();
    loop();
})();