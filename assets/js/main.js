/* ── CURSOR ─────────────────────────────────────────── */
// Check if user prefers reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
    const cdot = document.getElementById('cdot');
    const cring = document.getElementById('cring');
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        cdot.style.left = mx + 'px';
        cdot.style.top  = my + 'px';
    });
    (function loop() {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        cring.style.left = rx + 'px';
        cring.style.top  = ry + 'px';
        requestAnimationFrame(loop);
    })();

    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => cring.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cring.classList.remove('hovered'));
    });
}

/* ── HEADER SCROLL ───────────────────────────────────── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', scrollY > 60);
});

/* ── HAMBURGER ↔ X ───────────────────────────────────── */
const hbg  = document.getElementById('hamburger');
const menu = document.getElementById('nav-menu');

hbg.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    hbg.classList.toggle('open', isOpen);
    hbg.setAttribute('aria-expanded', isOpen);
});

menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        menu.classList.remove('open');
        hbg.classList.remove('open');
        hbg.setAttribute('aria-expanded', 'false');
    });
});

/* ── SMOOTH SCROLL ───────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const t = document.querySelector(a.getAttribute('href'));
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
});

/* ── NAV ATIVO por seção visível ─────────────────────── */
const navLinks = document.querySelectorAll('nav a[href^="#"]');
const sections = document.querySelectorAll('section[id], div[id]');

const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(a => a.classList.remove('active'));
            const active = document.querySelector(`nav a[href="#${entry.target.id}"]`);
            if (active) active.classList.add('active');
        }
    });
}, { threshold: 0.35, rootMargin: '-56px 0px 0px 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ── REVEAL com stagger nas features ─────────────────── */
document.querySelectorAll('.feat-card').forEach((el, i) => {
    el.style.transitionDelay = (i % 3 * 0.08) + 's';
});

const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));