import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../Servicios/auth.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage implements OnInit {
  usuario: any = null;
  mostrarModal = false; // Control del modal

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      this.usuario = JSON.parse(storedUser);
    } else {
      this.router.navigate(['/login']);
    }
  }

  cerrarSesion() {
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  abrirModal() {
    this.mostrarModal = true; // Abrir el modal
  }

  cerrarModal() {
    this.mostrarModal = false; // Cerrar el modal
  }

  guardarCambios() {
    // Validaciones para username y teléfono
    const usernamePattern = /^[a-zA-Z0-9_.-]{3,}$/; // Mismo patrón del registro
    const phonePattern = /^[0-9]{9}$/; // Teléfono de 9 dígitos

    if (!usernamePattern.test(this.usuario.username)) {
      alert('El nombre de usuario debe tener al menos 3 caracteres y solo puede contener letras, números, "-", ".", "_".');
      return;
    }

    if (!phonePattern.test(this.usuario.telefono)) {
      alert('El número de teléfono debe tener exactamente 9 dígitos.');
      return;
    }

    // Actualizar datos en JSON Server
    const endpoint = `http://localhost:3000/users/${this.usuario.id}`;
    this.http.put(endpoint, this.usuario).subscribe(
      (response) => {
        alert('Perfil actualizado correctamente.');
        localStorage.setItem('usuario', JSON.stringify(this.usuario)); // Actualizar Local Storage
        this.mostrarModal = false; // Cerrar el modal
      },
      (error) => {
        alert('Error al actualizar el perfil.');
        console.error(error);
      }
    );
  }
}