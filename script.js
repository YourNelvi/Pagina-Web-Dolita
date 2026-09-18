// Dolita - Main Script

document.addEventListener('DOMContentLoaded', () => {
    // Update date
    const fechaEl = document.getElementById('fecha-actualizacion');
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    fechaEl.textContent = now.toLocaleDateString('es-VE', options);

    // --- Tasa values (placeholder — replace with real API or data source) ---
    // These will be replaced with actual API calls once the app repo is available
    const TASAS = {
        bcv: 36.50,    // Replace with real BCV rate
        usdt: 38.75    // Replace with real USDT P2P rate
    };

    // Animate rate values
    animateValue('bcv-valor', TASAS.bcv);
    animateValue('usdt-valor', TASAS.usdt);

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

// Animate number counting up
function animateValue(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const duration = 1500;
    const steps = 60;
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
