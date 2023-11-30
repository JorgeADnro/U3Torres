import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service'
import { Usuario } from 'src/app/models/usuario';
import Swal from 'sweetalert2';
import { BiblioService } from 'src/app/services/biblio.service';
import { Colonia } from 'src/app/models/colonia';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  usuarioForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _authService: AuthService,
    private router: Router,
    private _biblioService: BiblioService
  ) {
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      calle: ['', Validators.required],
      col: ['', Validators.required],
      no: ['', Validators.required],
      cp: ['', Validators.required],
      correo: ['', Validators.required],
      passwd: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.obtenerColonia();
  }

  /*calle: String;
    no: String;
    col: String;
    cp: Number;*/

  signUp() {
    console.log(this.usuarioForm)

    console.log(this.usuarioForm.get('nombre')?.value)

    const usuario: Usuario = {
      nombre: this.usuarioForm.get('nombre')?.value,
      calle: this.usuarioForm.get('calle')?.value,
      correo: this.usuarioForm.get('correo')?.value,
      no: this.usuarioForm.get('no')?.value,
      col: this.usuarioForm.get('col')?.value,
      cp: this.usuarioForm.get('cp')?.value,
      passwd: this.usuarioForm.get('passwd')?.value,
      favoritos: [],
      roles: []
    }

    this._authService.registrarUsuario(usuario).subscribe(res => {
      console.log(res);
      localStorage.setItem('token', res.token);
      if(res){
        Swal.fire('Se ha registrado correctamente!', res.message, 'success');
      }
      this.router.navigate(['/']);
    });

    console.log(usuario);
  }

  listColonia: Colonia[] = [];

  obtenerColonia() {
    this._biblioService.getColonia().subscribe(data => {
      console.log(data);
      this.listColonia = data;
    },error => {
      console.log(error);
    })
    
  }
}