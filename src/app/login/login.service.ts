import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private subject: Subject<any> = new Subject<any>();
  public emisor: any = this.subject.asObservable();

  constructor(private http: HttpClient) { }

  enviaCondicion(mostrarMenu:boolean) {
    // al que lo este escuchando...

    this.subject.next({ mostrarMenu });

  }
  IniciarSesion(loginRequest: any) {
    const result: Observable<any> = this.http.post('https://localhost:44385/Account/Login', loginRequest);
    return result;
  }
  CrearUsuario(loginRequest: any) {
    const result: Observable<any> = this.http.post('https://localhost:44385/Account/IngresarUsuario', loginRequest);
    return result;
  }
}
