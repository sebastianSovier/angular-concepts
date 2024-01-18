import { Injectable } from '@angular/core';
import { AbstractControl, UntypedFormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

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

  
  ConfirmedValidator(contrasenaCrear: string,contrasenaRepetirCrear: string):ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null  => {
      const value = group.value
      if (!value) {
        return null;
    }
          if (contrasenaCrear !== contrasenaRepetirCrear) {
            return {notEquivalent:true};
          } else {
            return null;
          }
    };
  }
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
}
