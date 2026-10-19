// =========================================================================
// COMPONENT: HOME
// =========================================================================

// THE MOUNT FUNCTION
function mountHome(container) {
    container.innerHTML = `
        <section id="home-view">
            <div align="center" style="line-height: 1.5;font-family:'Geo', sans-serif;margin: var(--space-lg) auto;padding: var(--space-lg);">
                <h1>&#128521;</h1>
                <h2 style="color: var(--text-muted);">Hey there!</h2>
                <h1 style="font-family: 'Rubik Doodle Shadow';">I'm ARTO.</h1>
            </div>
        </section>
    `;
}

// UNMOUNT
function unmountHome() {
    
}
