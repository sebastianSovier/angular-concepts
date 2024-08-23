import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, UntypedFormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationsService {
  errorMessages: Record<string, string> = {
    maxlength: 'Ingrese un maximo de caracteres',
    minlength: 'Ingrese un minimo de caracteres',
    email: 'Ingrese email válido',
    required: 'El campo es requerido',
    pattern: 'Ingrese caracteres válidos',
    notEquivalent: 'Contraseña deben ser iguales',
    passwordStrength: 'Contraseña debe contener Mayusculas,Minusculas,Numeros'
  };

  nombrePaisPattern = "^[a-zA-Z ]*$";
  poblacionPattern = "^[0-9]*$";
  
  createPasswordStrengthValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {

        const value = control.value;

        if (!value) {
            return null;
        }

        const hasUpperCase = /[A-Z]+/.test(value);

        const hasLowerCase = /[a-z]+/.test(value);

        const hasNumeric = /[0-9]+/.test(value);

        const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;

        return !passwordValid ? {passwordStrength:true}: null;
    }
  }
  isValidInput(fieldName: string | number,form: UntypedFormGroup): boolean {
    return form.controls[fieldName]?.invalid &&
      (form.controls[fieldName].dirty || form.controls[fieldName].touched);
  }
  errors(control: AbstractControl | null): string[] {
    if(control === null){
      return [];
    }else{
      return control.errors ? Object.keys(control.errors) : [];
    }
  }
  ConfirmedValidator(crearCuentaForm:UntypedFormGroup): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const passwordConfirm = group.value as string;
      const password = crearCuentaForm.value.contrasena as string;
      if (crearCuentaForm && passwordConfirm) {
        if (password !== passwordConfirm) {
          return { notEquivalent: true };
        }
      } else {
        return null;
      }
      return null;
    };
  }
  ConfirmedValidatorPass(crearCuentaForm:UntypedFormGroup): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.value as string;
      const passwordConfirm = crearCuentaForm.value.contrasenaRepetir as string;
      if (crearCuentaForm && passwordConfirm) {
        if (password !== passwordConfirm) {
          return { notEquivalent: true };
        }
      } else {
        return null;
      }
      return null;
    };
  }
}
