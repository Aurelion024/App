import { Component, AfterViewInit } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Servicios/auth.service';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';


@Component({
  selector: 'app-solicitar-viaje',
  templateUrl: './solicitar-viaje.page.html',
  styleUrls: ['./solicitar-viaje.page.scss'],
  standalone: false,
})
export class SolicitarViajePage implements AfterViewInit {
  map!: mapboxgl.Map;
  userMarker!: mapboxgl.Marker;
  autosDisponibles: any[] = [];
  destination: string = '';

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoiYXVyZWxpb24iLCJhIjoiY202cGU5NHNtMWdieDJqcHk2bWM2dmR6YyJ9.lzO5z0ozjhles1gVmqiicg';
    
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-70.6483, -33.4569], // Coordenadas iniciales en Santiago, Chile
      zoom: 12
    });
    
  }


  mostrarAutosEnMapa() {
    this.autosDisponibles.forEach(auto => {
      new mapboxgl.Marker({ color: 'red' })
        .setLngLat(auto.ubicacion)
        .setPopup(new mapboxgl.Popup().setText(`${auto.conductor} - Destino: ${auto.destino} - Asientos: ${auto.asientos_disponibles}`))
        .addTo(this.map);
    });
  }

  solicitarViaje() {
    if (!this.destination) {
      alert('Por favor, ingresa tu destino.');
      return;
    }
    alert(`Buscando conductores para: ${this.destination}`);
    // Aquí puedes enviar la solicitud a JSON-Server
  }
}