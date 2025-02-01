import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../Servicios/auth.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { LocalStorageService } from '../../Servicios/local-storage.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage implements OnInit {
  usuario: any = null;
  mostrarModal = false;
  mostrarModalPassword = false;
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  constructor(
    private router: Router,
    private storage: LocalStorageService,
    private auth: AuthService,
    private toast: ToastController
    ) {}

    ngOnInit() {
      const storedUser = this.storage.getItem('usuario');
      if (storedUser) {
        this.usuario = storedUser; // Usuario cargado correctamente desde LocalStorage
        console.log('Usuario cargado correctamente:', this.usuario);
      } else {
        // Si no hay usuario en sesión, redirige al login y usa valores predeterminados para evitar errores
        console.log('No hay usuario en sesión, redirigiendo a login...');
        this.usuario = { username: '', correo: '', pass: '' }; // Valores predeterminados
        this.router.navigate(['/login']);
      }
    }

  cerrarSesion() {
    this.storage.removeItem('usuario');
    console.log('Sesión cerrada correctamente');
    this.router.navigate(['/login']);
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toast.create({
      message: mensaje,
      duration: 3000,
      position: 'bottom',
    });
    await toast.present();
  }

  guardarCambios() {
    if (!this.usuario.username.trim() || !this.usuario.correo.trim()) {
      this.mostrarToast('El nombre de usuario y el correo no pueden estar vacíos.');
      return;
    }

    this.auth
      .updateUser(this.usuario.id, {
        username: this.usuario.username,
        correo: this.usuario.correo,
      })
      .then(() => {
        this.mostrarToast('Perfil actualizado correctamente.');
        this.storage.setItem('usuario', this.usuario); // Actualiza localStorage
        this.mostrarModal = false; // Cierra el modal
      })
      .catch((error) => {
        this.mostrarToast('Error al actualizar el perfil.');
        console.error(error);
      });
  }

  guardarNuevaPassword() {
    if (this.passwordData.currentPassword !== this.usuario.pass) {
      this.mostrarToast('La contraseña actual no es correcta.');
      return;
    }

    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.mostrarToast('La nueva contraseña y su confirmación no coinciden.');
      return;
    }

    if (this.passwordData.newPassword.trim().length < 8) {
      this.mostrarToast('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }

    this.auth
      .updateUser(this.usuario.id, { pass: this.passwordData.newPassword })
      .then(() => {
        this.mostrarToast('Contraseña actualizada correctamente.');
        this.usuario.pass = this.passwordData.newPassword; // Actualiza localStorage
        this.storage.setItem('usuario', this.usuario);
        this.mostrarModalPassword = false; // Cierra el modal
        this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' }; // Limpia los campos
      })
      .catch((error) => {
        this.mostrarToast('Error al actualizar la contraseña.');
        console.error(error);
      });
  }
}