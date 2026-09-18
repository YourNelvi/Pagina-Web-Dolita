import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  features = [
    { icon: 'fa-bolt', title: 'Tasas en tiempo real', desc: 'Dolar BCV oficial, euro y USDT (Binance P2P) al instante, con actualizacion automatica cada hora.' },
    { icon: 'fa-chart-line', title: 'Graficas historicas', desc: 'Visualiza la evolucion del dolar y euro con graficas interactivas de hasta 886 muestras.' },
    { icon: 'fa-calculator', title: 'Calculadora inteligente', desc: 'Convierte bolivares a dolares al instante, con opcion de usar la tasa de manana si ya esta disponible.' },
    { icon: 'fa-bell', title: 'Notificaciones', desc: 'Recibe alertas cuando cambien las tasas del BCV o del USDT.' },
    { icon: 'fa-mobile-screen', title: 'Widget y Quick Settings', desc: 'Consulta las tasas sin abrir la app desde tu home screen o panel de control.' },
    { icon: 'fa-shield-halved', title: 'Privacidad total', desc: 'Sin registro, sin cuentas, sin rastreo. Todo queda en tu dispositivo.' },
  ];

  specs = [
    { label: 'Plataforma', value: 'Android 11+' },
    { label: 'Lenguaje', value: 'Kotlin + Jetpack Compose' },
    { label: 'Arquitectura', value: 'MVVM + Repository' },
    { label: 'Fuentes', value: 'BCV, Euro BCV, USDT P2P' },
    { label: 'Version', value: 'v1.17.0' },
    { label: 'Tamano', value: '~8 MB' },
  ];
}
