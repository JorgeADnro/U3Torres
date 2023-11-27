import { Component, OnInit } from '@angular/core';
import { Libro } from 'src/app/models/libro';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuarioInfo: Usuario | undefined;
  usuarioFavs: Usuario | undefined;

  constructor (private authService: AuthService) {}

  ngOnInit(): void {
    this.obtenerInfoUsuario();
    this.verFavoritos();
  }

  obtenerInfoUsuario() {
    this.authService.obtenerUsuario().subscribe(
      (data) => {
        this.usuarioInfo = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  verFavoritos() {
    this.authService.verFavoritos().subscribe(
      (data) => {
        this.usuarioInfo = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  

}
