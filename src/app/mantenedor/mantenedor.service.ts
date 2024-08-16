import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Paises } from '../models/paises';
import { Ciudades } from '../models/ciudades';

@Injectable({
  providedIn: 'root'
})
export class MantenedorService {

  constructor(private http: HttpClient) { }



  ObtenerPaises(usuario:string) {
    const result: Observable<any> = this.http.get(environment.UrlWebApi +'/Countries/TodosLosPaises?"usuario"='+'"'+usuario+'"');
    return result;
  }
  ObtenerPaisesByFechas(fechas:any) {
     const result: Observable<any> = this.http.post(environment.UrlWebApi +'/Countries/ObtenerPaisesPorFechas',fechas);
     return result;
   }
  ObtenerExcelPaises(usuario:string) {
     const result: Observable<any> = this.http.get(environment.UrlWebApi +'/Countries/GetExcelPaises?"usuario"='+'"'+usuario+'"');
     return result;
   }
   ImportarPaises(objeto:any) {
    const result: Observable<any> = this.http.post(environment.UrlWebApi +'/Countries/ImportarPais',objeto);
    return result;
  }
  ImportarCiudades(objeto:any) {
    const result: Observable<any> = this.http.post(environment.UrlWebApi +'/Ciudades/ImportarCiudad',objeto);
    return result;
  }
  IngresarPais(pais:Paises) {
     const result: Observable<any> = this.http.post(environment.UrlWebApi +'/Countries/IngresarPais',pais );
     return result;
   }
  ModificarPais(pais:Paises) {
     const result: Observable<any> = this.http.put(environment.UrlWebApi +'/Countries/ModificarPais',pais );
     return result;
   }
   EliminarPais(pais_id:string,usuario:string) {
     const result: Observable<any> = this.http.delete(environment.UrlWebApi +'/Countries/EliminarPais?"pais_id"='+'"'+pais_id+'"'+"&'usuario'="+'"'+usuario+'"');
     return result;
   }
   ObtenerCiudades(pais_id:string,usuario:string) {
     const result: Observable<any> = this.http.get(environment.UrlWebApi +'/Ciudades/CiudadesPais?"pais_id"='+'"'+pais_id+'"'+"&'usuario'="+'"'+usuario+'"');
     return result;
   }
   IngresarCiudad(ciudad:Ciudades) {
      const result: Observable<any> = this.http.post(environment.UrlWebApi +'/Ciudades/IngresarCiudad',ciudad );
      return result;
    }
   ModificarCiudad(ciudad:Ciudades) {
      const result: Observable<any> = this.http.put(environment.UrlWebApi +'/Ciudades/ModificarCiudad',ciudad );
      return result;
    }
    EliminarCiudad(element:any,usuario:string) {
      const result: Observable<any> = this.http.delete(environment.UrlWebApi +'/Ciudades/EliminarCiudad?"ciudad_id"='+'"'+element.ciudad_id+'"'+"&'pais_id'="+'"'+element.pais_id+'"'+"&'usuario'="+'"'+usuario+'"');
      return result;
    }
}
