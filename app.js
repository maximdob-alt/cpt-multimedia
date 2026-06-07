// Acid Rain App Core Logic

document.addEventListener('DOMContentLoaded', () => {
    // 1. SPA Routing Initialization
    initRouter();

    // 2. Interactive pH Scale Setup
    initPHScale();

    // 3. Ecosystem Decay Slider Setup
    initEcosystemSlider();

    // 4. Transboundary Wind Simulator Setup
    initWindSimulator();

    // 5. Renewable Energy Switcher Setup
    initEnergySwitcher();

    // 6. Mobile Menu Setup
    initMobileMenu();
});

// ==========================================
// 1. HASH ROUTING SYSTEM
// ==========================================
function initRouter() {
    const defaultTab = 'home';
    
    function handleRoute() {
        const hash = window.location.hash || `/${defaultTab}`;
        const tabName = hash.replace('#/', '');
        
        // Hide all sections
        const sections = document.querySelectorAll('.tab-section');
        sections.forEach(sec => {
            sec.classList.remove('active-section', 'active-grid');
            sec.classList.add('hidden');
        });
        
        // Show target section
        const targetSection = document.getElementById(`section-${tabName}`);
        if (targetSection) {
            if (tabName === 'impact') {
                targetSection.classList.add('active-grid');
            } else {
                targetSection.classList.add('active-section');
            }
            targetSection.classList.remove('hidden');
        }
        
        // Update Nav Menu Tabs active classes
        const navTabs = document.querySelectorAll('.nav-tab, .mobile-tab');
        navTabs.forEach(tab => {
            if (tab.getAttribute('data-tab') === tabName) {
                tab.classList.add('active-tab');
            } else {
                tab.classList.remove('active-tab');
            }
        });

        // Close mobile nav menu on route change
        const mobileNav = document.getElementById('mobile-nav');
        if (mobileNav) mobileNav.classList.add('hidden');

        // Scroll to top of window on route change
        window.scrollTo({ top: 0, behavior: 'instant' });
        
        // Reset and update scroll indicator width
        updateScrollIndicator();
    }

    window.addEventListener('hashchange', handleRoute);
    // Initial route handling
    handleRoute();

    // Scroll tracker
    window.addEventListener('scroll', updateScrollIndicator);
}

function updateScrollIndicator() {
    const indicator = document.getElementById('scroll-indicator');
    if (!indicator) return;
    
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    
    indicator.style.width = `${scrolled}%`;
}

// Mobile hamburger toggle helper
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const menuIcon = document.getElementById('menu-btn-icon');
    
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('hidden');
            if (mobileNav.classList.contains('hidden')) {
                menuIcon.setAttribute('d', 'M4 6h16M4 12h16m-7 6h7');
            } else {
                // Change to close "X" icon
                menuIcon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
            }
        });
    }
}

// ==========================================
// 2. INTERACTIVE pH SCALE
// ==========================================
let ionTimer = null;

function initPHScale() {
    const slider = document.getElementById('ph-slider');
    if (!slider) return;

    slider.addEventListener('input', (e) => {
        updatePHUI(parseFloat(e.target.value));
    });

    // Initialize with default value 7.0
    updatePHUI(7.0);
}

function setPH(val) {
    const slider = document.getElementById('ph-slider');
    if (!slider) return;
    slider.value = val;
    updatePHUI(val);
}

function updatePHUI(ph) {
    const phValue = document.getElementById('ph-value');
    const phTitle = document.getElementById('ph-title');
    const phDesc = document.getElementById('ph-description');
    const panel = document.getElementById('ph-display-panel');
    const note = document.getElementById('ph-comparison-note');
    
    if (!phValue || !phTitle || !phDesc || !panel) return;
    
    phValue.textContent = ph.toFixed(1);

    // Dynamic scale effects based on the pH level
    let bgColors = '';
    let textColor = '';
    let titleText = '';
    let descText = '';
    let particleCount = 0;
    let particleType = 'acid';

    if (ph < 4.0) {
        bgColors = 'bg-rose-950/20 border-rose-500/30';
        textColor = 'text-rose-400';
        titleText = 'Severe Acid Rain (Extremely Dangerous)';
        descText = 'Highly toxic to ecosystems. Fish eggs die instantly, tree protective leaf cuticles melt, and heavy metals leach into soils.';
        particleCount = 50; // Exponentially higher concentration
        particleType = 'acid';
    } else if (ph >= 4.0 && ph < 5.0) {
        bgColors = 'bg-orange-950/20 border-orange-500/30';
        textColor = 'text-orange-400';
        titleText = 'Acid Rain (Harmful to Environment)';
        descText = 'Lakes begin to lose biodiversity. Microorganisms die off, and trees face nutrient deficiency due to acid leaching.';
        particleCount = 20;
        particleType = 'acid';
    } else if (ph >= 5.0 && ph < 5.6) {
        bgColors = 'bg-yellow-950/20 border-yellow-500/30';
        textColor = 'text-yellow-400';
        titleText = 'Elevated Acidity';
        descText = 'Marginally below normal rain pH. Sensitive aquatic insects like mayflies start to disappear from lakes.';
        particleCount = 8;
        particleType = 'acid';
    } else if (ph >= 5.6 && ph <= 6.0) {
        bgColors = 'bg-slate-900/60 border-slate-800';
        textColor = 'text-acid-lime';
        titleText = 'Normal Atmospheric Rain (pH 5.6)';
        descText = 'Clean rain is slightly acidic because carbon dioxide in the air naturally dissolves into it, forming mild carbonic acid.';
        particleCount = 3;
        particleType = 'neutral';
    } else if (ph > 6.0 && ph <= 8.0) {
        bgColors = 'bg-slate-900/60 border-slate-800';
        textColor = 'text-emerald-400';
        titleText = 'Neutral Water';
        descText = 'Healthy stream water, rivers, and tap water sit in this range, providing optimal conditions for life.';
        particleCount = 1;
        particleType = 'neutral';
    } else {
        bgColors = 'bg-blue-950/20 border-blue-500/30';
        textColor = 'text-blue-400';
        titleText = 'Alkaline Water';
        descText = 'High pH scale. Common for ocean water (pH 8.1) or cleaning agents like ammonia. Unnatural for precipitation.';
        particleCount = 5;
        particleType = 'alkaline';
    }

    // Apply Tailwind colors
    panel.className = `p-6 rounded-2xl border text-center transition-all duration-500 flex flex-col items-center justify-center h-48 ${bgColors}`;
    phValue.className = `text-4xl ${textColor}`;

    phTitle.textContent = titleText;
    phDesc.textContent = descText;

    // Relative comparison panel details
    if (ph < 5.6) {
        // Calculate concentration factor (10^(5.6 - pH))
        const intensity = Math.pow(10, 5.6 - ph);
        let factorText = '';
        if (intensity >= 100) {
            factorText = `${Math.round(intensity)}x times more acidic`;
        } else if (intensity >= 10) {
            factorText = `${intensity.toFixed(1)}x times more acidic`;
        } else {
            factorText = `${intensity.toFixed(1)}x times more acidic`;
        }
        
        note.classList.remove('opacity-0');
        note.querySelector('h5').textContent = `Warning: High Acid Level (${factorText})`;
        note.querySelector('p').textContent = `Compared to normal rain (pH 5.6), this precipitation is ${factorText}. Such concentration damages cellular structures in fish and leaches toxic aluminum into plant root systems.`;
    } else {
        note.classList.add('opacity-0');
    }

    // Regenerate particles
    spawnIons(particleCount, particleType);
}

function spawnIons(count, type) {
    const chamber = document.getElementById('ion-chamber');
    if (!chamber) return;

    // Clear previous
    chamber.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        
        // Base styling classes
        particle.className = 'ion-particle';
        if (type === 'neutral') {
            particle.className = 'ion-particle ion-particle-neutral';
        } else if (type === 'alkaline') {
            particle.className = 'ion-particle bg-blue-500/30';
        }

        // Random positioning & animations
        const size = Math.random() * 24 + 10;
        const left = Math.random() * 100;
        const delay = Math.random() * 2.5;
        const duration = Math.random() * 2 + 2;
        const randX = Math.random() * 60 - 30;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.setProperty('--random-x', `${randX}px`);
        
        chamber.appendChild(particle);
    }
}

// ==========================================
// 3. ECOSYSTEM DECAY SPLIT SLIDER
// ==========================================
function initEcosystemSlider() {
    const ecoSlider = document.getElementById('ecosystem-slider');
    const acidOverlay = document.getElementById('acid-overlay');
    const dividerBar = document.getElementById('divider-bar');

    if (!ecoSlider || !acidOverlay || !dividerBar) return;

    ecoSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        acidOverlay.style.width = `${100 - val}%`;
        dividerBar.style.left = `${val}%`;
    });
}

// ==========================================
// 4. TRANSBOUNDARY WIND SIMULATOR
// ==========================================
let windTimer = null;

function initWindSimulator() {
    // Start calm state
    triggerWind('none');
}

function triggerWind(strength) {
    const container = document.getElementById('wind-particles-container');
    const status = document.getElementById('wind-status');
    const forest = document.getElementById('target-forest');
    
    // Clear existing
    if (container) container.innerHTML = '';
    if (windTimer) clearInterval(windTimer);

    // Active state indicators on buttons
    ['none', 'moderate', 'gale'].forEach(type => {
        const btn = document.getElementById(`wind-btn-${type}`);
        if (btn) {
            if (type === strength) {
                btn.classList.add('bg-slate-800', 'border-acid-lime', 'text-acid-lime');
                btn.classList.remove('bg-slate-950', 'text-slate-400');
            } else {
                btn.classList.remove('bg-slate-800', 'border-acid-lime', 'text-acid-lime');
                btn.classList.add('bg-slate-950', 'text-slate-400');
            }
        }
    });

    if (strength === 'none') {
        status.textContent = 'Calm - Pollutants accumulate locally';
        status.className = 'text-emerald-400 font-bold';
        if (forest) {
            forest.textContent = '🌲🍁🌲';
            forest.className = 'text-3xl text-emerald-400 transition-all duration-500 scale-100';
        }
    } else if (strength === 'moderate') {
        status.textContent = 'Active - Pollutants traveling across border';
        status.className = 'text-yellow-500 font-bold';
        if (forest) {
            forest.textContent = '🍂🍁🌲';
            forest.className = 'text-3xl text-yellow-500 transition-all duration-500 scale-95';
        }
        
        // Spawn wind lines
        spawnWindStreaks(10, 2.5);
        windTimer = setInterval(() => spawnWindStreaks(5, 2.5), 1000);
    } else if (strength === 'gale') {
        status.textContent = 'Severe - Heavy acidic deposition into Canada';
        status.className = 'text-acid-rose font-bold';
        if (forest) {
            forest.textContent = '💀🪨💀';
            forest.className = 'text-3xl text-acid-rose transition-all duration-500 scale-90 blur-[0.5px]';
        }

        // Spawn rapid wind lines
        spawnWindStreaks(25, 1.2);
        windTimer = setInterval(() => spawnWindStreaks(10, 1.2), 600);
    }
}

function spawnWindStreaks(count, duration) {
    const container = document.getElementById('wind-particles-container');
    if (!container) return;

    for (let i = 0; i < count; i++) {
        const streak = document.createElement('div');
        streak.className = 'wind-streak';
        
        const top = Math.random() * 80 + 10;
        const delay = Math.random() * 1.5;
        const width = Math.random() * 120 + 60;
        const randY = Math.random() * 40 - 20;

        streak.style.top = `${top}%`;
        streak.style.width = `${width}px`;
        streak.style.animationDelay = `${delay}s`;
        streak.style.animationDuration = `${duration}s`;
        streak.style.setProperty('--random-y', `${randY}px`);

        container.appendChild(streak);
        
        // Remove after animation finishes
        setTimeout(() => {
            if (streak.parentNode) streak.parentNode.removeChild(streak);
        }, (delay + duration) * 1000);
    }
}

// ==========================================
// 5. RENEWABLE ENERGY SWITCHER
// ==========================================
let skyTimer = null;

function initEnergySwitcher() {
    // Default setting fossil
    setEnergySource('fossil');
}

function setEnergySource(source) {
    const chamber = document.getElementById('sky-chamber');
    const label = document.getElementById('sky-label');
    const rain = document.getElementById('sky-rain');
    const centerIcon = document.getElementById('sky-center-icon');
    const sourceLabel = document.getElementById('sky-source');
    const phLabel = document.getElementById('sky-ph');
    const particles = document.getElementById('sky-particles');

    const btnFossil = document.getElementById('btn-fossil');
    const btnClean = document.getElementById('btn-clean');

    if (!chamber || !label || !rain || !centerIcon || !sourceLabel || !phLabel || !particles) return;
    if (skyTimer) clearInterval(skyTimer);
    particles.innerHTML = '';

    if (source === 'fossil') {
        // Style Buttons
        btnFossil.className = 'py-3 rounded-2xl border border-rose-500/40 bg-rose-950/20 text-rose-400 text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(244,63,94,0.1)]';
        btnClean.className = 'py-3 rounded-2xl border border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-400 text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2';

        // Sky chamber update
        chamber.className = 'relative h-64 rounded-2xl overflow-hidden border border-rose-950/80 transition-all duration-1000 p-6 flex flex-col justify-between bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950';
        label.textContent = 'Acid Precipitation';
        label.className = 'px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-950/80 border border-rose-500/30 text-rose-400';
        rain.textContent = '🌧️⛈️';
        centerIcon.textContent = '🌫️💨';
        centerIcon.className = 'text-6xl block transition-all duration-700 select-none animate-pulse';
        sourceLabel.textContent = 'Coal & Petrol Vehicles';
        phLabel.textContent = 'pH 3.8 (Highly Acidic)';
        phLabel.className = 'font-bold text-sm text-rose-400';

        // Spawn smoke particles
        spawnSmoke(25);
        skyTimer = setInterval(() => spawnSmoke(5), 1200);

    } else if (source === 'clean') {
        // Style Buttons
        btnFossil.className = 'py-3 rounded-2xl border border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-400 text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2';
        btnClean.className = 'py-3 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 text-emerald-400 text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(52,211,153,0.1)]';

        // Sky chamber update
        chamber.className = 'relative h-64 rounded-2xl overflow-hidden border border-emerald-950/80 transition-all duration-1000 p-6 flex flex-col justify-between bg-gradient-to-b from-slate-900 via-emerald-950/10 to-emerald-900/10';
        label.textContent = 'Normal Precipitation';
        label.className = 'px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-950/80 border border-emerald-500/30 text-emerald-400';
        rain.textContent = '🌦️';
        centerIcon.textContent = '☀️🪁';
        centerIcon.className = 'text-6xl block transition-all duration-700 select-none hover:rotate-45';
        sourceLabel.textContent = 'Solar, Wind & EVs';
        phLabel.textContent = 'pH 5.6 (Normal Rain)';
        phLabel.className = 'font-bold text-sm text-emerald-400';

        // Spawn floating leaves
        spawnLeaves(15);
        skyTimer = setInterval(() => spawnLeaves(3), 1500);
    }
}

function spawnSmoke(count) {
    const container = document.getElementById('sky-particles');
    if (!container) return;

    for (let i = 0; i < count; i++) {
        const smoke = document.createElement('div');
        smoke.className = 'smoke-cloud';
        
        const size = Math.random() * 80 + 40;
        const left = Math.random() * 90;
        const delay = Math.random() * 3;
        const duration = Math.random() * 3 + 3;
        const smokeX = Math.random() * 100 - 50;

        smoke.style.width = `${size}px`;
        smoke.style.height = `${size}px`;
        smoke.style.left = `${left}%`;
        smoke.style.animationDelay = `${delay}s`;
        smoke.style.animationDuration = `${duration}s`;
        smoke.style.setProperty('--smoke-x', `${smokeX}px`);

        container.appendChild(smoke);

        setTimeout(() => {
            if (smoke.parentNode) smoke.parentNode.removeChild(smoke);
        }, (delay + duration) * 1000);
    }
}

function spawnLeaves(count) {
    const container = document.getElementById('sky-particles');
    if (!container) return;

    const leafIcons = ['🍃', '🍀', '🍂', '🍁'];

    for (let i = 0; i < count; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf-particle';
        leaf.textContent = leafIcons[Math.floor(Math.random() * leafIcons.length)];
        
        const left = Math.random() * 90;
        const delay = Math.random() * 2;
        const duration = Math.random() * 3 + 2;
        const leafX = Math.random() * 60 - 30;

        leaf.style.left = `${left}%`;
        leaf.style.animationDelay = `${delay}s`;
        leaf.style.animationDuration = `${duration}s`;
        leaf.style.setProperty('--leaf-x', `${leafX}px`);

        container.appendChild(leaf);

        setTimeout(() => {
            if (leaf.parentNode) leaf.parentNode.removeChild(leaf);
        }, (delay + duration) * 1000);
    }
}
