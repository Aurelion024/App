import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: false,
})
export class UsuariosPage implements OnInit {
  usuarios: any[] = []; // Lista de usuarios

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarUsuarios();
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
