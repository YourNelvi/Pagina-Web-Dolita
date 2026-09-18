import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface RateData {
  promedio: number;
  anterior?: number;
  variacion?: number;
  cambio?: string;
  fecha: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  currentSource: 'usd' | 'eur' | 'usdt' = 'usd';
  inputBs = '';
  inputDivisa = '';

  rates: Record<string, RateData> = {
    usd: { promedio: 848.55, anterior: 847.44, variacion: 0.13, cambio: '+1,10 Bs', fecha: '18/09' },
    eur: { promedio: 974.42, anterior: 977.68, variacion: -0.33, cambio: '-3,26 Bs', fecha: '18/09' },
    usdt: { promedio: 945.02, fecha: '18/09' }
  };

  ngOnInit() {
    this.fetchRates();
    setInterval(() => this.fetchRates(), 5 * 60 * 1000);
  }

  async fetchRates() {
    await Promise.allSettled([this.fetchDolarAPI(), this.fetchBinanceUSDT()]);
  }

  async fetchDolarAPI() {
    try {
      const res = await fetch('https://ve.dolarapi.com/v1/dolares');
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      const oficial = data.find((d: any) => d.fuente === 'oficial');
      if (oficial) {
        const nuevo = oficial.promedio;
        const anterior = this.rates['usd'].promedio;
        const variacion = ((nuevo - anterior) / anterior * 100);
        this.rates['usd'] = {
          promedio: nuevo,
          anterior,
          variacion: parseFloat(variacion.toFixed(2)),
          cambio: (variacion >= 0 ? '+' : '') + (nuevo - anterior).toFixed(2).replace('.', ',') + ' Bs',
          fecha: this.formatDate(oficial.fechaActualizacion)
        };
      }
    } catch (e) {
      console.warn('Error fetching dolarapi:', e);
    }
  }

  async fetchBinanceUSDT() {
    try {
      const res = await fetch('https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fiat: 'VES', tradeType: 'BUY', asset: 'USDT', page: 1, rows: 10 })
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      if (data.success && data.data?.length > 0) {
        const prices = data.data.slice(0, 5).map((d: any) => parseFloat(d.adv.price));
        const avg = prices.reduce((a: number, b: number) => a + b, 0) / prices.length;
        this.rates['usdt'] = {
          promedio: parseFloat(avg.toFixed(2)),
          fecha: new Date().toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit' }) + ' ' +
                  new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })
        };
      }
    } catch (e) {
      console.warn('Error fetching Binance USDT:', e);
    }
  }

  selectSource(source: 'usd' | 'eur' | 'usdt') {
    this.currentSource = source;
    this.inputBs = '';
    this.inputDivisa = '';
  }

  get mainRate(): string {
    return '$' + this.formatNumber(this.rates[this.currentSource].promedio);
  }

  get detailFuente(): string {
    return this.currentSource === 'usd' ? 'USD' : this.currentSource === 'eur' ? 'EUR' : 'USDT';
  }

  get detailPromedio(): string {
    return '$' + this.formatNumber(this.rates[this.currentSource].promedio);
  }

  get detailAnterior(): string {
    const r = this.rates[this.currentSource];
    return r.anterior ? '$' + this.formatNumber(r.anterior) : '—';
  }

  get detailCambio(): { text: string; class: string } {
    const r = this.rates[this.currentSource];
    if (r.cambio) {
      return { text: r.cambio, class: r.variacion! >= 0 ? 'text-green-800' : 'text-red-800' };
    }
    return { text: '—', class: 'text-black/50' };
  }

  get badgeHtml(): string {
    const r = this.rates[this.currentSource];
    if (r.variacion !== undefined && r.variacion !== null) {
      const icon = r.variacion >= 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down';
      const sign = r.variacion >= 0 ? '+' : '';
      return `<i class="fas ${icon} text-[10px]"></i> ${sign}${r.variacion.toFixed(2).replace('.', ',')}%`;
    }
    return `Act. ${r.fecha || 'Hoy'}`;
  }

  get calcTitle(): string {
    return `Conversión a Bs. según ${this.detailFuente}`;
  }

  get calcRate(): string {
    return `1 ${this.detailFuente} = ${this.formatNumber(this.rates[this.currentSource].promedio)} Bs`;
  }

  onBsInput() {
    const raw = this.inputBs.replace(/\./g, '').replace(',', '.');
    const bs = parseFloat(raw);
    if (isNaN(bs)) { this.inputDivisa = ''; return; }
    this.inputDivisa = this.formatInput(bs / this.rates[this.currentSource].promedio);
  }

  onDivisaInput() {
    const raw = this.inputDivisa.replace(/\./g, '').replace(',', '.');
    const divisa = parseFloat(raw);
    if (isNaN(divisa)) { this.inputBs = ''; return; }
    this.inputBs = this.formatInput(divisa * this.rates[this.currentSource].promedio);
  }

  formatNumber(num: number): string {
    return num.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  formatInput(num: number): string {
    return num.toFixed(2).replace('.', ',');
  }

  formatDate(iso: string): string {
    if (!iso) return 'Hoy';
    return new Date(iso).toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit' });
  }

  getCotizacionRate(source: string): string {
    return '$' + this.formatNumber(this.rates[source].promedio);
  }

  getCotizacionVariacion(source: string): { text: string; class: string; icon: string } {
    const r = this.rates[source];
    if (r.variacion !== undefined) {
      const sign = r.variacion >= 0 ? '+' : '';
      return {
        text: `${sign}${r.variacion.toFixed(2).replace('.', ',')}%`,
        class: r.variacion >= 0 ? 'text-green' : 'text-red-400',
        icon: r.variacion >= 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'
      };
    }
    return { text: '', class: '', icon: '' };
  }
}
