// =========================================================================
// CORE ENGINE: App Router & State Manager
// =========================================================================

// --- The Initial Cold Boot Sequence ---
window.addEventListener('load', () => {
    const loader = document.getElementById('global-loader');
    const loaderText = document.getElementById('loader-text');
    
    if (loader && loaderText) {
        loaderText.innerText = "BOOTING NEURAL NETWORK [ARTO]...";
        
        setTimeout(() => { loaderText.innerText = "RENDERING VISION [MODULE: ART]..."; }, 250);
        setTimeout(() => { loaderText.innerText = "STRUCTURING PURPOSE [MODULE: DESIGN]..."; }, 500);
        setTimeout(() => { loaderText.innerText = "MOUNTING LOGIC [MODULE: DEV]..."; }, 750);
        setTimeout(() => { loaderText.innerText = "I AM A HUMAN BEING."; }, 1000);
        
        // Hide the loader and reveal the site
        setTimeout(() => { loader.classList.add('is-hidden');}, 1500); 
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const appRoot = document.getElementById('app-root');
    const navTabs = document.querySelectorAll('.tab-item');
    let currentRoute = '';
    let isFirstLoad = true; // Prevents the router from hijacking the Cold Boot

    function mountPageContext(hash) {
        // UNMOUNT LIFECYCLE
        if (currentRoute === '#home' && typeof unmountHome === 'function') unmountHome();
        if (currentRoute === '#projects' && typeof unmountProjects === 'function') unmountProjects();
        if (currentRoute === '#about' && typeof unmountAbout === 'function') unmountAbout();

        appRoot.innerHTML = '';
        appRoot.classList.remove('view-container');
        void appRoot.offsetWidth; 
        appRoot.classList.add('view-container');

        document.body.classList.remove('theme-neon', 'theme-dusk', 'theme-light');

        // MOUNT LIFECYCLE
        switch (hash) {
            case '#home':
                document.body.classList.add('theme-neon');
                if (typeof mountHome === 'function') mountHome(appRoot);
                break;
            case '#projects':
                document.body.classList.add('theme-dusk');
                if (typeof mountProjects === 'function') mountProjects(appRoot);
                break;
            case '#about':
                document.body.classList.add('theme-light');
                if (typeof mountAbout === 'function') mountAbout(appRoot);
                break;
            default:
                document.body.classList.add('theme-neon');
                appRoot.innerHTML = `<div style="text-align:center; padding:5em 8rem;"><h2>404</h2><h3>Signal Lost.</h3><p style="margin-top: 1.5rem;line-height: 1.5;">Whoops! It seems that you got warped into the void. Please return home instead. <br> Or would you like to send a message?</p><br><a href="#contact"  style="font-family: 'Rubik Doodle Shadow'; border: 5px dashed var(--nav-border);border-radius: var(--text-sm);padding: var(--text-xs);text-decoration: none;" onmouseover="this.style.color='var(--accent-color)';this.style.borderColor='var(--accent-color)';" onmouseout="this.style.color='var(--text-muted)';this.style.borderColor='var(--nav-border)';">Hit me up!</a></div>`;
        }

        navTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('href') === hash) tab.classList.add('active');
        });

        currentRoute = hash;
        const viewport = document.querySelector('.app-viewport');
        if (viewport) viewport.scrollTo({ top: 0, behavior: 'instant' });
        
        buildGlobalSubnav();
    }

    function handleRouting() {
        let hash = window.location.hash || '#home';
        if (hash === currentRoute) return;

        const viewport = document.querySelector('.app-viewport');

        // UNMOUNT LIFECYCLE
        if (currentRoute === '#home' && typeof unmountHome === 'function') unmountHome();
        if (currentRoute === '#projects' && typeof unmountProjects === 'function') unmountProjects();
        if (currentRoute === '#about' && typeof unmountAbout === 'function') unmountAbout();

        appRoot.innerHTML = '';
        appRoot.classList.remove('view-container');
        void appRoot.offsetWidth; 
        appRoot.classList.add('view-container');

        document.body.classList.remove('theme-neon', 'theme-dusk', 'theme-light');

        // MOUNT LIFECYCLE
        switch (hash) {
            case '#home':
                document.body.classList.add('theme-neon');
                if (typeof mountHome === 'function') mountHome(appRoot);
                break;
            case '#projects':
                document.body.classList.add('theme-dusk');
                if (typeof mountProjects === 'function') mountProjects(appRoot);
                break;
            case '#about':
                document.body.classList.add('theme-light');
                if (typeof mountAbout === 'function') mountAbout(appRoot);
                break;
            default:
                document.body.classList.add('theme-neon');
                appRoot.innerHTML = `<div style="text-align:center; padding:5em 8rem;"><h2>404</h2><h3>Signal Lost.</h3><a href="#home">Return Home</a></div>`;
        }

        // UPDATE HUD UI
        navTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('href') === hash) tab.classList.add('active');
        });

        // RESET STATE
        currentRoute = hash;
        if (viewport) viewport.scrollTo({ top: 0, behavior: 'instant' });
        
        buildGlobalSubnav();
    }

        
    document.addEventListener('click', (e) => {
        // Back to Top Logic
        const backToTopBtn = e.target.closest('#back-to-top');
        if (backToTopBtn) {
            const viewport = document.querySelector('.app-viewport');
            if (viewport) {
                viewport.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }

        // Sub Nav
        const subnavLink = e.target.closest('.subnav-link');

        if (subnavLink) {
            e.preventDefault();
            const targetId = subnavLink.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            const viewport = document.querySelector('.app-viewport');

            if (targetSection && viewport) {
                // Using absolute top relative to the scrolling viewport
                const targetPos = targetSection.offsetTop;
                const stickyNavHeight = document.getElementById('global-subnav').offsetHeight || 60;

                viewport.scrollTo({
                    top: targetPos - stickyNavHeight - 20, // 20px padding buffer
                    behavior: 'smooth'
                });
            }
        }
    });

     // Toggle Sidebar Collapse on Desktop
    const sidebarToggleBtn = document.getElementById('sidebar-toggle');
    if (sidebarToggleBtn) {
        sidebarToggleBtn.onclick = function() {
            document.body.classList.toggle('sidebar-collapsed');
        };
    }

    window.addEventListener('hashchange', handleRouting);
    handleRouting();
});

// =========================================================================
// SCROLL & SUB-NAV ENGINES
// =========================================================================

// --- Scroll Progress Bar Engine ---
const viewport = document.querySelector('.app-viewport');
const progressBar = document.getElementById('scroll-progress-bar');

if (viewport && progressBar) {
    viewport.addEventListener('scroll', () => {
        // Calculate the total scrollable height
        const scrollHeight = viewport.scrollHeight - viewport.clientHeight;
        
        // Prevent division by zero on very short pages
        if (scrollHeight <= 0) {
            progressBar.style.width = '0%';
            return;
        }

        // Calculate percentage and update the bar
        const scrollPercentage = (viewport.scrollTop / scrollHeight) * 100;
        progressBar.style.width = `${scrollPercentage}%`;
    }, { passive: true }); // Passive flag ensures smooth scrolling performance
}

function buildGlobalSubnav() {
    const subnavContainer = document.getElementById('global-subnav');
    const contentTarget = document.getElementById('global-subnav-content');
    const sections = document.querySelectorAll('[data-subnav]');

    // Hide the nav if the current page has no subnav sections
    if (!sections || sections.length === 0) {
        if (subnavContainer) subnavContainer.style.display = 'none';
        return;
    }

    // Clear previous links and reveal the nav
    if (contentTarget) contentTarget.innerHTML = '';
    if (subnavContainer) subnavContainer.style.display = 'block';

    // Build the links dynamically
    sections.forEach((sec, index) => {
        // Ensure the section has an ID for the anchor link to target
        if (!sec.id) sec.id = `subnav-sec-${index}`; 

        const title = sec.getAttribute('data-subnav');
        
        const link = document.createElement('a');
        link.href = `#${sec.id}`;
        link.className = 'subnav-link';
        link.textContent = title;
        
        if (contentTarget) contentTarget.appendChild(link);

        // Add the dot separator if it's not the last item
        if (index < sections.length - 1) {
            const sep = document.createElement('span');
            sep.className = 'subnav-separator';
            sep.textContent = '·';
            if (contentTarget) contentTarget.appendChild(sep);
        }
    });

    // Set up Scroll Spying (Auto-highlights the active section)
    const observerOptions = {
        root: document.querySelector('.app-viewport'), 
        rootMargin: '-20% 0px -60% 0px', // Triggers when section is near the top
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all links
                if (contentTarget) {
                    contentTarget.querySelectorAll('.subnav-link').forEach(l => l.classList.remove('is-active'));
                    
                    // Add active class to the currently visible section's link
                    const activeLink = contentTarget.querySelector(`a[href="#${entry.target.id}"]`);
                    if (activeLink) activeLink.classList.add('is-active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(sec => observer.observe(sec));
}