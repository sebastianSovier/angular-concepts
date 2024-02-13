import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoadingPageService } from '../loading-page/loading-page.service';
import { LoginService } from './login.service';
import { FirebaseService } from '../shared-components/firebase.service';
import { DatePipe } from '@angular/common';
import { ValidationsService } from '../shared-components/validations.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit,OnDestroy {
  hide = true;

  loginForm = new UntypedFormGroup({});
  crearCuentaForm = new UntypedFormGroup({});
  loginRequest: any = {};
  login = true;
  private recaptchaSubscription: Subscription = new Subscription;
  constructor(private recaptchaV3Service: ReCaptchaV3Service,private validationService: ValidationsService, private datepipe: DatePipe, private firebaseService: FirebaseService, fb: UntypedFormBuilder, private loginService: LoginService, private router: Router, private loading: LoadingPageService, private _snackBar: MatSnackBar) {
    sessionStorage.clear();
    this.loginForm = fb.group(
      {
        usuario: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
        contrasena: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]

      }
    );
    this.crearCuentaForm = fb.group(
      {
        usuario: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
        contrasena: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20), this.validationService.createPasswordStrengthValidator(),this.ConfirmedValidatorPass()]],
        nombre_completo: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
        correo: ['', [Validators.email, Validators.required, Validators.minLength(6), Validators.maxLength(60)]],
        contrasenaRepetir: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20), this.validationService.createPasswordStrengthValidator(), this.ConfirmedValidator()]],
      },
    );
  }
  isValidInput = (fieldName: string | number, form: UntypedFormGroup) => this.validationService.isValidInput(fieldName, form);
  errors = (control: AbstractControl | null) => this.validationService.errors(control);
  errorMessages: Record<string, string> = this.validationService.errorMessages;

  get usuarioCrear() { return this.crearCuentaForm.value.usuario }

  get contrasenaCrear() { return this.crearCuentaForm.value.contrasena; }

  get nombre_completoCrear() { return this.crearCuentaForm.value.nombre_completo }

  get correoCrear() { return this.crearCuentaForm.value.correo; }
  get contrasenaRepetirCrear() { return this.crearCuentaForm.value.contrasenaRepetir; }

  volver() {
    this.login = true;
  }
  nuevoUsuario() {
    this.login = false;
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  public executeImportantAction(f:UntypedFormGroup): void {
    this.recaptchaSubscription = this.recaptchaV3Service.execute('login_action')
      .subscribe((token) => this.onSubmit(token,f));
  }


  ConfirmedValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const passwordConfirm = group.value as string;
      const password = this.crearCuentaForm.value.contrasena as string;
      if (this.crearCuentaForm && passwordConfirm) {
        if (password !== passwordConfirm) {
          return { notEquivalent: true };
        }
      } else {
        return null;
      }
      return null;
    };
  }
  ConfirmedValidatorPass(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.value as string;
      const passwordConfirm = this.crearCuentaForm.value.contrasenaRepetir as string;
      if (this.crearCuentaForm && passwordConfirm) {
        if (password !== passwordConfirm) {
          return { notEquivalent: true };
        }
      } else {
        return null;
      }
      return null;
    };
  }


  ngOnInit(): void {
    sessionStorage.clear();
    this.loading.cambiarestadoloading(false);

  }

  get usuario() { return this.loginForm.value.usuario }

  get contrasena() { return this.loginForm.value.contrasena; }

  ngOnDestroy(): void {
    // Unsubscribe when the component is destroyed
    if (this.recaptchaSubscription) {
      this.recaptchaSubscription.unsubscribe();
    }
  }
  onSubmit(token:string,f: UntypedFormGroup) {
    if (f.valid) {
      //this.loading.cambiarestadoloading(true);
      const loginRequest = { Username: this.usuario, Password: this.contrasena,token:token };
      this.loginService.IniciarSesion(loginRequest).subscribe((datos) => {
        if (datos.Error !== undefined) {
          sessionStorage.clear();
          this.openSnackBar("Credenciales Inválidas.", "Reintente");
        } else {
          if (datos.access_Token.length > 0) {
            const hora = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
            this.firebaseService.conexionFirebase(this.usuario, datos.access_Token, this.datepipe.transform(new Date(), "dd/MM/YYYY"), hora,datos.tokenFirebase);
            this.loginService.enviaCondicion(true);
            this._snackBar.dismiss();
            sessionStorage.setItem('token', datos.access_Token);
            sessionStorage.setItem('user', this.usuario);
            this.router.navigateByUrl('/mantenedor');
          } else {
            this.loginService.enviaCondicion(false);
            sessionStorage.clear();
            this.openSnackBar("Hubo problemas para validar su usuario", "Reintente");
          }
        }
        console.log(datos);
      }, (error) => {
        console.log(error);
        if (error.status !== 200) {
          this.router.navigateByUrl('');
        }
      }, () => {
        //this.loading.cambiarestadoloading(false);
      });
    }
  }
  CrearUsuario(f: UntypedFormGroup) {
    if (f.valid) {
      //this.loading.cambiarestadoloading(true);
      const loginRequest = { usuario: this.usuarioCrear, contrasena: this.contrasenaCrear, nombre_completo: this.nombre_completoCrear, correo: this.correoCrear };
      this.loginService.CrearUsuario(loginRequest).subscribe((datos) => {
        if (datos.Error !== undefined) {
          sessionStorage.clear();
          this.openSnackBar("Hubo problemas al crear su usuario Intente nuevamente.", "Reintente");
        } else {
          if (datos.datos === 'ok') {
            this.login = true;
            this.openSnackBar("Usuario creado exitosamente.", "Ok");
          } else {
            sessionStorage.clear();
            this.openSnackBar("Hubo problemas para validar su usuario", "Reintente");
          }
        }
        console.log(datos);
      }, (error) => {
        console.log(error);
        if (error.status !== 200) {
          this.router.navigateByUrl('');
        }
      }, () => {
        //this.loading.cambiarestadoloading(false);
      });
    }
  }

}

