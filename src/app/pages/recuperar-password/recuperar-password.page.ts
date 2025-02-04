import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { LocalStorageService } from '../../Servicios/local-storage.service';
import { Router } from '@angular/router';
import { AuthService } from '../../Servicios/auth.service';


@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.page.html',
  styleUrls: ['./recuperar-password.page.scss'],
  standalone: false,
})
  export class RecuperarPasswordPage {
    correo: string = '';
    codigoIngresado: string = '';
    nuevaPassword: string = '';
    codigoGenerado: string = '';
    mostrarCodigo: boolean = false;
    usuario: any = null;
  
    constructor(private http: HttpClient, private toast: ToastController) {}
  
    async solicitarCodigo() {
      if (!this.correo.trim()) {
        this.mostrarToast('Ingrese su correo.');
        return;
      }
  
      this.http.get<any[]>(`http://localhost:3000/users?correo=${this.correo}`).subscribe(async (usuarios) => {
        if (usuarios.length === 0) {
          this.mostrarToast('No se encontró una cuenta con este correo.');
          return;
        }
  
        this.usuario = usuarios[0];
        this.codigoGenerado = Math.floor(100000 + Math.random() * 900000).toString(); // Genera un código de 6 dígitos
  
        // Guarda el código en JSON-Server
        this.http.patch(`http://localhost:3000/users/${this.usuario.id}`, { recoveryCode: this.codigoGenerado }).subscribe(() => {
          this.mostrarToast(`Código enviado a ${this.correo}`);
          this.mostrarCodigo = true;
        });
      });
    }
  
    async restablecerPassword() {
      if (this.codigoIngresado !== this.codigoGenerado) {
        this.mostrarToast('El código ingresado no es correcto.');
        return;
      }
  
      if (this.nuevaPassword.length < 8) {
        this.mostrarToast('La contraseña debe tener al menos 8 caracteres.');
        return;
      }
  
      // Actualiza la contraseña y borra el código de recuperación
      this.http.patch(`http://localhost:3000/users/${this.usuario.id}`, { pass: this.nuevaPassword, recoveryCode: null }).subscribe(() => {
        this.mostrarToast('Contraseña restablecida correctamente.');
        this.mostrarCodigo = false;
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
  }