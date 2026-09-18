// Dolita — Main Script

document.addEventListener('DOMContentLoaded', () => {
    // Update date
    const fechaEl = document.getElementById('fecha-actualizacion');
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    fechaEl.textContent = now.toLocaleDateString('es-VE', options);

    // --- Tasas de referencia (último dato del JSON de la app) ---
    // Cuando tengas una API propia, reemplazá estos valores
    const TASAS = {
        usd: 775.34,   // Dólar BCV
        eur: 897.82,   // Euro BCV
        usdt: 780.50   // USDT P2P (estimado, ajustar con dato real)
    };

    animateValue('usd-valor', TASAS.usd);
    animateValue('eur-valor', TASAS.eur);
    animateValue('usdt-valor', TASAS.usdt);

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Fade-in on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
});

// Animate number counting up
function animateValue(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const duration = 1200;
    const steps = 50;
    const increment = targetValue / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
        step++;
        current = Math.min(increment * step, targetValue);
        element.textContent = current.toFixed(2);

        if (step >= steps) {
            clearInterval(timer);
            element.textContent = targetValue.toFixed(2);
        }
    }, duration / steps);
}
