import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
 import { environment } from 'src/environments/environment';
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
    const result: Observable<any> = this.http.post(environment.UrlWebApi +'/Account/Login', loginRequest);
    return result;
  }
  CrearUsuario(loginRequest: any) {
    const result: Observable<any> = this.http.post(environment.UrlWebApi +'/Account/IngresarUsuario', loginRequest);
    return result;
  }
}
