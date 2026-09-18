// Dolita — Main Script

const RATES = {
    usd: {
        name: 'Dólar (BCV)',
        fuente: 'USD',
        promedio: 848.55,
        anterior: 847.44,
        variacion: 0.13,
        cambio: '+1,10 Bs',
        cambioDir: 'up',
        fecha: '18/09'
    },
    eur: {
        name: 'Euro (BCV)',
        fuente: 'EUR',
        promedio: 974.42,
        anterior: 977.68,
        variacion: -0.33,
        cambio: '-3,26 Bs',
        cambioDir: 'down',
        fecha: '18/09'
    },
    usdt: {
        name: 'USDT (P2P)',
        fuente: 'USDT',
        promedio: 945.02,
        anterior: null,
        variacion: null,
        cambio: null,
        cambioDir: null,
        fecha: '18/09 08:19'
    }
};

let currentSource = 'usd';

document.addEventListener('DOMContentLoaded', () => {
    updateDisplay('usd');
});

function selectSource(source) {
    currentSource = source;

    // Update chips
    document.querySelectorAll('.chip').forEach(chip => {
        chip.classList.remove('chip-active');
        if (chip.dataset.source === source) {
            chip.classList.add('chip-active');
        }
    });

    updateDisplay(source);
}

function updateDisplay(source) {
    const rate = RATES[source];

    // Main card
    document.getElementById('main-rate').textContent = '$' + formatNumber(rate.promedio);
    document.getElementById('detail-fuente').textContent = rate.fuente;
    document.getElementById('detail-promedio').textContent = '$' + formatNumber(rate.promedio);
    document.getElementById('detail-anterior').textContent = rate.anterior ? '$' + formatNumber(rate.anterior) : '—';

    const cambioEl = document.getElementById('detail-cambio');
    if (rate.cambio) {
        cambioEl.textContent = rate.cambio;
        cambioEl.className = 'font-bold text-sm ' + (rate.cambioDir === 'up' ? 'text-green-800' : 'text-red-800');
    } else {
        cambioEl.textContent = '—';
        cambioEl.className = 'font-bold text-sm text-black/50';
    }

    // Variacion badge
    const badge = document.getElementById('variacion-badge');
    if (rate.variacion !== null) {
        const icon = rate.variacion >= 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down';
        const sign = rate.variacion >= 0 ? '+' : '';
        badge.innerHTML = `<i class="fas ${icon} text-[10px]"></i> ${sign}${rate.variacion.toFixed(2).replace('.', ',')}%`;
    } else {
        badge.innerHTML = `Act. ${rate.fecha}`;
    }

    // Calculator
    document.getElementById('calc-title').textContent = `Conversión a Bs. según ${rate.fuente}`;
    document.getElementById('calc-rate').textContent = `1 ${rate.fuente} = ${formatNumber(rate.promedio)} Bs`;
    document.getElementById('label-divisa').textContent = rate.fuente;
    document.getElementById('calc-footer').textContent = `Convertido a ${rate.fuente}`;

    // Clear inputs
    document.getElementById('input-bs').value = '';
    document.getElementById('input-divisa').value = '';
}

function convertBs() {
    const input = document.getElementById('input-bs');
    const raw = input.value.replace(/\./g, '').replace(',', '.');
    const bs = parseFloat(raw);

    if (isNaN(bs)) {
        document.getElementById('input-divisa').value = '';
        return;
    }

    const rate = RATES[currentSource].promedio;
    const divisa = bs / rate;
    document.getElementById('input-divisa').value = formatInput(divisa);
}

function convertDivisa() {
    const input = document.getElementById('input-divisa');
    const raw = input.value.replace(/\./g, '').replace(',', '.');
    const divisa = parseFloat(raw);

    if (isNaN(divisa)) {
        document.getElementById('input-bs').value = '';
        return;
    }

    const rate = RATES[currentSource].promedio;
    const bs = divisa * rate;
    document.getElementById('input-bs').value = formatInput(bs);
}

function formatNumber(num) {
    return num.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function formatInput(num) {
    return num.toFixed(2).replace('.', ',');
}
