import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: false,
})
export class UsuariosPage implements OnInit {
  usuarios: any[] = []; // Lista de usuarios

  // Inyecta el Router
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cerrarSesion() {
    localStorage.removeItem('usuario'); // Elimina los datos del usuario almacenados
    this.router.navigate(['/login']); // Redirige al login
  }

  cargarUsuarios() {
    const endpoint = 'http://localhost:3000/users';
    this.http.get<any[]>(endpoint).subscribe(
      (response) => {
        this.usuarios = response; // Guardar la lista de usuarios
      },
      (error) => {
        console.error('Error al cargar usuarios:', error);
        this.usuarios = [];
      }
    );
  }
}