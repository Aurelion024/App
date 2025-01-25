import { Component} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';
import { AuthService } from '../../Servicios/auth.service';
import { HttpClient } from '@angular/common/http';





@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
  
})
export class LoginPage {
  user = {
    usuario: '',
    password: ''
  };
  msj = ''; // Mensaje para el usuario
  carga = false; // Indicador de carga

  constructor(private http: HttpClient, private router: Router) {}

  conectar() {
    // Validar que los campos no estén vacíos
    if (!this.user.usuario || !this.user.password) {
      this.msj = 'Por favor, completa todos los campos.';
      return;
    }

    this.carga = true;

    // Endpoint del recurso en JSON Server
    const endpoint = 'http://localhost:3000/users';

    // Hacer una solicitud GET para obtener todos los usuarios
    this.http.get<any[]>(endpoint).subscribe(
      (users) => {
        // Buscar al usuario con el username o correo proporcionado
        const foundUser = users.find(
          (u) =>
            (u.username === this.user.usuario || u.correo === this.user.usuario) &&
            u.pass === this.user.password
        );

        if (foundUser) {
          // Usuario encontrado y autenticado
          this.msj = 'Inicio de sesión exitoso.';
          console.log('Usuario autenticado:', foundUser);
          // Guardar el usuario en el local storage
          localStorage.setItem('usuario', JSON.stringify(foundUser));

          // Redirigir al usuario a la página de inicio
          this.router.navigate(['/perfil']);
        } else {
          // Usuario no encontrado o contraseña incorrecta
          this.msj = 'Usuario o contraseña incorrectos.';
        }
        this.carga = false;
      },
      (error) => {
        console.error('Error al conectar con el servidor:', error);
        this.msj = 'Error al conectar con el servidor.';
        this.carga = false;
      }
    );
  }

  registrar() {
    console.log('Redirigir al registro');
    this.router.navigate(['/register']); // Redirige a la página de registro
  }
}