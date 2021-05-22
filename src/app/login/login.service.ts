import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }


  IniciarSesion(loginRequest: any) {
    const result: Observable<any> = this.http.post('https://localhost:44385/Account/Login', loginRequest);
    return result;
  }
}
