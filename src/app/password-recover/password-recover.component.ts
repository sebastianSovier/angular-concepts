import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  UntypedFormGroup,
  AbstractControl,
  UntypedFormBuilder,
  Validators,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Subscription } from 'rxjs';
import { LoadingPageService } from '../loading-page/loading-page.service';
import { LoginService } from '../login/login.service';
import { Recaptcha } from '../models/recaptcha';
import { FirebaseService } from '../shared-components/firebase.service';
import { ValidationsService } from '../shared-components/validations.service';

@Component({
  selector: 'app-password-recover',
  templateUrl: './password-recover.component.html',
  styleUrl: './password-recover.component.scss',
})
export class PasswordRecoverComponent {
  hide = true;

  recoverForm = new UntypedFormGroup({});
  loginRequest: any = {};
  paso = '1';
  private recaptchaSubscription: Subscription = new Subscription();
  recaptchaToken: Recaptcha = new Recaptcha();
  tokenv2_1: string = '';
  tokenv2_2: string = '';
  tokenv2_3: string = '';
  isValidInput = (fieldName: string | number, form: UntypedFormGroup) =>
    this.validationService.isValidInput(fieldName, form);
  errors = (control: AbstractControl | null) =>
    this.validationService.errors(control);
  errorMessages: Record<string, string> = this.validationService.errorMessages;
  newPasswordForm= new UntypedFormGroup({});
  usuarioRecuperar: string = '';
  codigoRecuperarForm= new UntypedFormGroup({});
  recaptchaToken1: Recaptcha = new Recaptcha();
  recaptchaToken2: Recaptcha = new Recaptcha();
  recaptchaToken3: Recaptcha = new Recaptcha();

  constructor(
    private recaptchaV3Service: ReCaptchaV3Service,
    private validationService: ValidationsService,
    fb: UntypedFormBuilder,
    private loginService: LoginService,
    private router: Router,
    private loading: LoadingPageService,
    private _snackBar: MatSnackBar
  ) {
    //localStorage.clear();
    this.recoverForm = fb.group({
      usuario: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(20),
        ],
      ],
    });

    this.codigoRecuperarForm = fb.group({
      codigo: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
    });

    this.newPasswordForm = fb.group({
      contrasena: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
          this.validationService.createPasswordStrengthValidator(),
          this.ConfirmedValidatorPass(),
        ],
      ],
      contrasenaRepetir: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
          this.validationService.createPasswordStrengthValidator(),
          this.ConfirmedValidator(),
        ],
      ],
    });
  }
  get usuarioCrear() {
    return this.recoverForm.value.usuario;
  }
  get codigoRecuperar() {
    return this.codigoRecuperarForm.value.codigo;
  }
  get passwordChange() {
    return this.newPasswordForm.value.contrasena;
  }

  ConfirmedValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const passwordConfirm = group.value as string;
      const password = this.newPasswordForm.value.contrasena as string;
      if (this.newPasswordForm && passwordConfirm) {
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
      const passwordConfirm = this.newPasswordForm.value
        .contrasenaRepetir as string;
      if (this.newPasswordForm && passwordConfirm) {
        if (password !== passwordConfirm) {
          return { notEquivalent: true };
        }
      } else {
        return null;
      }
      return null;
    };
  }
  openSnackBar(message: string) {
    this._snackBar.open(message);
  }
  recaptchaVerificado1: boolean = true;
  recaptchaVerificado2: boolean = true;
  recaptchaVerificado3: boolean = true;

  executeImportantActionUser(f: UntypedFormGroup): void {
    this.recaptchaSubscription = this.recaptchaV3Service
      .execute('code_recover_action')
      .subscribe((token) => {
        this.recaptchaVerificado1 = false;
        this.onSubmitUser(token, f);
      });
  }
  executeImportantActionCodigo(f: UntypedFormGroup): void {
    this.recaptchaSubscription = this.recaptchaV3Service
      .execute('code_send_action')
      .subscribe((token) => {
        this.recaptchaVerificado2 = false;
        this.onSubmitCodigo(token, f);
      });
  }
  executeImportantActionRecuperar(f: UntypedFormGroup): void {
    this.recaptchaSubscription = this.recaptchaV3Service
      .execute('new_password_action')
      .subscribe((token) => {
        this.recaptchaVerificado3 = false;
        this.onSubmitNewPassword(token, f);
      });
  }
  resolveRecaptcha1(event: any): void {
    if (event) {
      this.recaptchaVerificado1 = true;
      this.tokenv2_1 = event;
    } else {
      this.recaptchaVerificado1 = false;
      this.tokenv2_1 = '';
    }
  }
  resolveRecaptcha2(event: any): void {
    if (event) {
      this.recaptchaVerificado2 = true;
      this.tokenv2_2 = event;
    } else {
      this.recaptchaVerificado2 = false;
      this.tokenv2_2 = '';
    }
  }
  resolveRecaptcha3(event: any): void {
    if (event) {
      this.recaptchaVerificado3 = true;
      this.tokenv2_3 = event;
    } else {
      this.recaptchaVerificado3 = false;
      this.tokenv2_3 = '';
    }
  }

  errored(event: any): void {
    console.log(event);
  }
  ngOnDestroy(): void {
    // Unsubscribe when the component is destroyed
    if (this.recaptchaSubscription) {
      this.recaptchaSubscription.unsubscribe();
    }
  }
  ngOnInit(): void {
    //localStorage.clear();
    this.loading.cambiarestadoloading(false);
    this.tokenv2_1 = '';
    this.tokenv2_2 = '';
    this.tokenv2_3 = '';
    this.usuarioRecuperar = '';
  }
  onSubmitUser(token: string, f: UntypedFormGroup) {
    if (f.valid) {
      const loginRequest = {
        Username: this.usuarioCrear,
        token: token,
        tokenv2: this.tokenv2_1,
      };
      this.loginService.SolicitarCodigo(loginRequest).subscribe(
        (datos) => {
          if (datos.Error !== undefined) {
            if (datos.Error === '3') {
              this.recaptchaToken1 = { score: datos.score, token: datos.token };
              this.openSnackBar('Recaptcha Fallido.');
            } else {
              this.usuarioRecuperar = '';
              this.openSnackBar('Hubo problemas al obtener código.');
            }
          } else {
            this.paso = "2";
            this.usuarioRecuperar = this.usuarioCrear;
            if (this.recaptchaSubscription) {
              this.recaptchaSubscription.unsubscribe();
            }
          }
          console.log(datos);
        },
        (error) => {
          console.log(error);
        },
        () => {}
      );
    }
  }
  onSubmitCodigo(token: string, f: UntypedFormGroup) {
    if (f.valid) {
      const loginRequest = {
        Username: this.usuarioRecuperar,
        Codigo: this.codigoRecuperar,
        token: token,
        tokenv2: this.tokenv2_2,
      };
      this.loginService.ValidarCodigo(loginRequest).subscribe(
        (datos) => {
          if (datos.Error !== undefined) {
            if (datos.Error === '3') {
              this.recaptchaToken2 = { score: datos.score, token: datos.token };
              this.openSnackBar('Recaptcha Fallido.');
            } else {
              this.usuarioRecuperar = '';
              this.openSnackBar('Hubo problemas al validar código.');
            }
          } else {
            this.paso = "3";
            if (this.recaptchaSubscription) {
              this.recaptchaSubscription.unsubscribe();
            }
          }
          console.log(datos);
        },
        (error) => {
          console.log(error);
        },
        () => {}
      );
    }
  }
  volver(){
    this.router.navigateByUrl("");
  }
  onSubmitNewPassword(token: string, f: UntypedFormGroup) {
    if (f.valid) {
      const loginRequest = {
        Username: this.usuarioRecuperar,
        Password: this.passwordChange,
        token: token,
        tokenv2: this.tokenv2_3,
      };
      this.loginService.CambiarPassword(loginRequest).subscribe(
        (datos) => {
          if (datos.Error !== undefined) {
            if (datos.Error === '3') {
              this.recaptchaToken3 = { score: datos.score, token: datos.token };
              this.openSnackBar('Recaptcha Fallido.');
            }else
            this.openSnackBar('Hubo problemas al cambiar password.');
          } else {
            this.openSnackBar('Contraseña cambiada correctamente.');
            
            this.router.navigateByUrl('');
          }
          console.log(datos);
        },
        (error) => {
          console.log(error);
        },
        () => {}
      );
    }
  }
}
