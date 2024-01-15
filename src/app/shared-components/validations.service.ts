import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationsService {
  errorMessages: Object = {
    maxlength: 'max',
    minlength: 'min',
    email: 'email',
    required: 'required',
    pattern: 'pattern'
  };
  form:FormGroup= new FormGroup({});
  constructor() { }

  errorsForm(inputForm: any) {
    console.log(inputForm.errors);
    let message = "";
    if (inputForm.errors) {
      Object.entries(this.errorMessages).forEach(value => {
        if (message.length > 0) {
        } else {
          const [key1, value1] = value;
          if (Object.prototype.hasOwnProperty.call(inputForm.errors, key1)) {
            console.log(value1);
            message = value1;
            return message;
          }
        }
        return;
      })
    }
    return message;
}
}
