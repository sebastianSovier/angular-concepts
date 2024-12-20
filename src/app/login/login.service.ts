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
    this.subject.next({ mostrarMenu });
  }
  GetTokenCrsf() {
   
    const result: Observable<any> = this.http.get(environment.UrlWebApi +'/api/csrf-token',{ withCredentials: true });
    return result;
  }
  IniciarSesion(loginRequest: any) {
   
    const result: Observable<any> = this.http.post(environment.UrlWebApi +'/Account/Login', loginRequest);
    return result;
  }
  CerrarSesion(requestLogout: any) {
   
    const result: Observable<any> = this.http.post(environment.UrlWebApi +'/Account/Logout', requestLogout);
    return result;
  }
  CrearUsuario(loginRequest: any) {
    const result: Observable<any> = this.http.post(environment.UrlWebApi +'/Account/IngresarUsuario', loginRequest);
    return result;
  }

  SolicitarCodigo(loginRequest: any){
    const result: Observable<any> = this.http.post(environment.UrlWebApi +'/Account/SolicitarCodigo', loginRequest);
    return result;
  }
  ValidarCodigo(loginRequest: any){
    const result: Observable<any> = this.http.post(environment.UrlWebApi +'/Account/ValidaCodigo', loginRequest);
    return result;
  }
  
  CambiarPassword(loginRequest: any){
    const result: Observable<any> = this.http.post(environment.UrlWebApi +'/Account/CambiarPassword', loginRequest);
    return result;
  }
}
