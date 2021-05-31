import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AppConfig } from '../appconfig';

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
    const result: Observable<any> = this.http.post(AppConfig.settings.UrlWebApi +'/Account/Login', loginRequest);
    return result;
  }
  CrearUsuario(loginRequest: any) {
    const result: Observable<any> = this.http.post(AppConfig.settings.UrlWebApi +'/Account/IngresarUsuario', loginRequest);
    return result;
  }
}
