import { Component, AfterViewInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { Geolocation } from '@capacitor/geolocation';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: false,
})
export class MapPage implements AfterViewInit {
  map: any;
  userLocation: { lat: number; lng: number } = { lat: -33.4489, lng: -70.6693 }; // Santiago
  destino: { lat: number; lng: number } = { lat: -33.4569, lng: -70.6483 }; // Ejemplo destino
  directionsService: any;
  directionsRenderer: any;

  constructor() {}

  async ngAfterViewInit() {
    await this.obtenerUbicacionUsuario();
    this.cargarMapa();
  }

  async obtenerUbicacionUsuario() {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
    }
  }

  async cargarMapa() {
    const loader = new Loader({
      apiKey: environment.googleMapsApiKey,
      libraries: ['places'],
    });

    await loader.load();
    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: this.userLocation,
      zoom: 14,
    });

    new google.maps.Marker({
      position: this.userLocation,
      map: this.map,
      title: 'Mi Ubicación',
    });

    new google.maps.Marker({
      position: this.destino,
      map: this.map,
      title: 'Destino',
    });

    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(this.map);

    this.calcularRuta();

    // Agregar tráfico en tiempo real
    const trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(this.map);
  }

  calcularRuta() {
    const request = {
      origin: this.userLocation,
      destination: this.destino,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    this.directionsService.route(request, (result: any, status: any) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsRenderer.setDirections(result);
      } else {
        console.error('Error calculando la ruta:', status);
      }
    });
  }

  centrarMapa() {
    this.map.setCenter(this.userLocation);
  }
}
