import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../Servicios/auth.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { LocalStorageService } from '../../Servicios/local-storage.service';
import { IonModal } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { OverlayEventDetail } from '@ionic/core/components';




@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage {
  @ViewChild(IonModal) modal!: IonModal;  // ✅ Uso de operador "!" para evitar el error

  usuario: any = null;
  message = '';
  name: string = '';
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  constructor(
    private router: Router,
    private auth: AuthService,
    private toast: ToastController,
    private storage: LocalStorageService
  ) {}

  ngOnInit() {
    const storedUser = this.storage.getItem('usuario');
    if (storedUser) {
      this.usuario = storedUser;
      this.name = this.usuario.username;
    }
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    if (!this.name.trim() || !this.usuario.correo.trim()) {
      this.mostrarToast('El nombre de usuario y el correo no pueden estar vacíos.');
      return;
    }
    if (this.passwordData.newPassword && (this.passwordData.newPassword.length < 8 || this.passwordData.newPassword !== this.passwordData.confirmPassword)) {
      this.mostrarToast('Las contraseñas no coinciden o son demasiado cortas.');
      return;
    }
    this.usuario.username = this.name;
    const updateData: any = { username: this.usuario.username, correo: this.usuario.correo };
    if (this.passwordData.newPassword) {
      updateData.pass = this.passwordData.newPassword;
    }
    this.auth.updateUser(this.usuario.id, updateData).then(() => {
      this.mostrarToast('Perfil actualizado correctamente.');
      this.storage.setItem('usuario', this.usuario);
      this.modal.dismiss(this.name, 'confirm');
    }).catch(error => {
      this.mostrarToast('Error al actualizar el perfil.');
      console.error(error);
    });
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toast.create({
      message: mensaje,
      duration: 3000,
      position: 'bottom',
    });
    await toast.present();
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Perfil actualizado: ${ev.detail.data}`;
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/home']);
    this.generarToast('Usuario Desconectado');
  }

  generarToast(message: string) {
    const toast = this.toast.create({
      message: message,
      duration: 3000,
      position: 'bottom',
    });

    toast.then((res) => {
      res.present();
    });
  }

}