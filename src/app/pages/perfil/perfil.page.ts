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
  mostrarModal = false; // Control del modal para editar perfil
  mostrarModalPassword = false; // Control del modal para cambiar contraseña
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

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
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  abrirModalPassword() {
    this.mostrarModalPassword = true;
  }

  cerrarModalPassword() {
    this.mostrarModalPassword = false;
  }

  guardarCambios() {
    const usernamePattern = /^[a-zA-Z0-9_.-]{3,}$/;
    const phonePattern = /^[0-9]{9}$/;

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

  guardarNuevaPassword() {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d@$!%*?&]{8,}$/;

    if (this.passwordData.currentPassword !== this.usuario.pass) {
      alert('La contraseña actual no es correcta.');
      return;
    }

    if (!passwordPattern.test(this.passwordData.newPassword)) {
      alert('La nueva contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial.');
      return;
    }

    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      alert('La nueva contraseña y su confirmación no coinciden.');
      return;
    }

    // Actualizar la contraseña en JSON Server
    const endpoint = `http://localhost:3000/users/${this.usuario.id}`;
    this.usuario.pass = this.passwordData.newPassword; // Actualizar la contraseña en el objeto usuario
    this.http.put(endpoint, this.usuario).subscribe(
      (response) => {
        alert('Contraseña actualizada correctamente.');
        localStorage.setItem('usuario', JSON.stringify(this.usuario)); // Actualizar Local Storage
        this.mostrarModalPassword = false; // Cerrar el modal
        this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' }; // Limpiar campos
      },
      (error) => {
        alert('Error al actualizar la contraseña.');
        console.error(error);
      }
    );
  }

  irAUsuarios() {
    this.router.navigate(['/usuarios']);
  }
}
