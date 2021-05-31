import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../appconfig';

@Injectable({
  providedIn: 'root'
})
export class MantenedorService {

  constructor(private http: HttpClient) { }



  ObtenerPaises() {
   const headers = new HttpHeaders({'Authorization':'Bearer '+sessionStorage.getItem('token')});
    const result: Observable<any> = this.http.get(AppConfig.settings.UrlWebApi +'/Countries/TodosLosPaises',{headers: headers});
    return result;
  }
  IngresarPais(pais:any) {
    const headers = new HttpHeaders({'Authorization':'Bearer '+sessionStorage.getItem('token')});
     const result: Observable<any> = this.http.post(AppConfig.settings.UrlWebApi +'/Countries/IngresarPais',pais ,{headers: headers});
     return result;
   }
  ModificarPais(pais:any) {
    const headers = new HttpHeaders({'Authorization':'Bearer '+sessionStorage.getItem('token')});
     const result: Observable<any> = this.http.put(AppConfig.settings.UrlWebApi +'/Countries/ModificarPais',pais ,{headers: headers});
     return result;
   }
   EliminarPais(pais_id:string) {
    const headers = new HttpHeaders({'Authorization':'Bearer '+sessionStorage.getItem('token')});
     const result: Observable<any> = this.http.delete(AppConfig.settings.UrlWebApi +'/Countries/EliminarPais?pais_id='+pais_id,{headers: headers});
     return result;
   }
   ObtenerCiudades(pais_id:string) {
    const headers = new HttpHeaders({'Authorization':'Bearer '+sessionStorage.getItem('token')});
     const result: Observable<any> = this.http.get(AppConfig.settings.UrlWebApi +'/Countries/CiudadesPais?pais_id='+pais_id,{headers: headers});
     return result;
   }
   IngresarCiudad(ciudad:any) {
     const headers = new HttpHeaders({'Authorization':'Bearer '+sessionStorage.getItem('token')});
      const result: Observable<any> = this.http.post(AppConfig.settings.UrlWebApi +'/Countries/IngresarCiudad',ciudad ,{headers: headers});
      return result;
    }
   ModificarCiudad(ciudad:any) {
     const headers = new HttpHeaders({'Authorization':'Bearer '+sessionStorage.getItem('token')});
      const result: Observable<any> = this.http.put(AppConfig.settings.UrlWebApi +'/Countries/ModificarCiudad',ciudad ,{headers: headers});
      return result;
    }
    EliminarCiudad(element:any) {
     const headers = new HttpHeaders({'Authorization':'Bearer '+sessionStorage.getItem('token')});
      const result: Observable<any> = this.http.delete(AppConfig.settings.UrlWebApi +'/Countries/EliminarCiudad?ciudad_id='+element.ciudad_id+'&pais_id='+element.pais_id,{headers: headers});
      return result;
    }
}
