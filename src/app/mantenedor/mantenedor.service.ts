import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../appconfig';

@Injectable({
  providedIn: 'root'
})
export class MantenedorService {

  constructor(private http: HttpClient) { }



  ObtenerPaises(usuario:string) {
   //const headers = new HttpHeaders({'Authorization':'Bearer '+sessionStorage.getItem('token')});
   //,{headers:headers}
    const result: Observable<any> = this.http.get(AppConfig.settings.UrlWebApi +'/Countries/TodosLosPaises?usuario='+usuario);
    return result;
  }
  ObtenerExcelPaises(usuario:string) {
    //const headers = new HttpHeaders({'Authorization':'Bearer '+sessionStorage.getItem('token')});
    //,{headers:headers}
     const result: Observable<any> = this.http.get(AppConfig.settings.UrlWebApi +'/Countries/GetExcelPaises?usuario='+usuario);
     return result;
   }
  IngresarPais(pais:any) {
     const result: Observable<any> = this.http.post(AppConfig.settings.UrlWebApi +'/Countries/IngresarPais',pais );
     return result;
   }
  ModificarPais(pais:any) {
     const result: Observable<any> = this.http.put(AppConfig.settings.UrlWebApi +'/Countries/ModificarPais',pais );
     return result;
   }
   EliminarPais(pais_id:string,usuario:string) {
     const result: Observable<any> = this.http.delete(AppConfig.settings.UrlWebApi +'/Countries/EliminarPais?pais_id='+pais_id+"&usuario="+usuario);
     return result;
   }
   ObtenerCiudades(pais_id:string) {
     const result: Observable<any> = this.http.get(AppConfig.settings.UrlWebApi +'/Ciudades/CiudadesPais?pais_id='+pais_id);
     return result;
   }
   IngresarCiudad(ciudad:any) {
      const result: Observable<any> = this.http.post(AppConfig.settings.UrlWebApi +'/Ciudades/IngresarCiudad',ciudad );
      return result;
    }
   ModificarCiudad(ciudad:any) {
      const result: Observable<any> = this.http.put(AppConfig.settings.UrlWebApi +'/Ciudades/ModificarCiudad',ciudad );
      return result;
    }
    EliminarCiudad(element:any) {
      const result: Observable<any> = this.http.delete(AppConfig.settings.UrlWebApi +'/Ciudades/EliminarCiudad?ciudad_id='+element.ciudad_id+'&pais_id='+element.pais_id);
      return result;
    }
}
