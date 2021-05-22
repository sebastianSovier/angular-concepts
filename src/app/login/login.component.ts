import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingPageService } from '../loading-page/loading-page.service';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm = new FormGroup({});
  loginRequest: any = {};
  constructor(fb: FormBuilder, private loginService: LoginService,private router:Router,private loading: LoadingPageService,) {
    sessionStorage.clear();
    this.loginForm = fb.group(
      {
        usuario: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
        contrasena: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]

      }
    );

  }

  ngOnInit(): void {
  }

  get usuario() { return this.loginForm.value.usuario }

  get contrasena() { return this.loginForm.value.contrasena; }


  onSubmit(f: FormGroup) {
    if (f.valid) {
      this.loading.cambiarestadoloading(true);
      const loginRequest = { Username: this.usuario, Password: this.contrasena };
      this.loginService.IniciarSesion(loginRequest).subscribe((datos) => {
        if(datos.access_Token.length > 0){
          sessionStorage.setItem('token',datos.access_Token);
          this.router.navigateByUrl('/mantenedor');
        }else{
          sessionStorage.clear();
          this.loading.cambiarestadoloading(false);
          //mensaje usuario contraseña invalidos
        }
        console.log(datos);
      });
    }
  }

}

