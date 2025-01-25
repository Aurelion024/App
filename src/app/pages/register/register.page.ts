import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../Servicios/auth.service';

import { HttpClient } from '@angular/common/http';




@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegistroPage {
  user = {
    username: '', // Reemplazado 'usuario' por 'username'
    correo: '',
    pass: '', // Reemplazado 'password' por 'pass'
    confirmPassword: '',
    telefono: ''
  };

  constructor(private http: HttpClient, private router: Router) {}
  registrar() {
    // Validaciones
    const usernamePattern = /^[a-zA-Z0-9_.-]{3,}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;
    const phonePattern = /^[0-9]{9}$/;

    if (!usernamePattern.test(this.user.username)) {
      alert('El nombre de usuario debe tener al menos 3 caracteres y solo puede contener letras, números, "-", ".", "_".');
      return;
    }

    if (!emailPattern.test(this.user.correo)) {
      alert('El correo no tiene un formato válido.');
      return;
    }

    if (!passwordPattern.test(this.user.pass)) {
      alert(
        'La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial.'
      );
      return;
    }

    if (this.user.pass !== this.user.confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    if (!phonePattern.test(this.user.telefono)) {
      alert('El número de teléfono debe tener exactamente 9 dígitos.');
      return;
    }

    // Enviar datos al servidor (JSON Server)
    const endpoint = 'http://localhost:3000/users';
    this.http.post(endpoint, this.user).subscribe(
      (response) => {
        alert('Registro exitoso.');
        console.log('Respuesta del servidor:', response);
        this.router.navigate(['/login']); // Redirige al login
      },
      (error) => {
        alert('Error al registrar el usuario.');
        console.error(error);
      }
    );
  }
}
