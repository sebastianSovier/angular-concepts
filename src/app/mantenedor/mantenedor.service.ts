import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MantenedorService {

  constructor(private http: HttpClient) { }



  ObtenerPaises() {
   const headers = new HttpHeaders({'Authorization':'Bearer '+sessionStorage.getItem('token')});
    const result: Observable<any> = this.http.post('https://localhost:44385/Countries/TodosLosPaises', null,{headers: headers});
    return result;
  }
  IngresarPais(pais:any) {
    const headers = new HttpHeaders({'Authorization':'Bearer '+sessionStorage.getItem('token')});
     const result: Observable<any> = this.http.post('https://localhost:44385/Countries/IngresarPais',pais ,{headers: headers});
     return result;
   }
  ModificarPais(pais:any) {
    const headers = new HttpHeaders({'Authorization':'Bearer '+sessionStorage.getItem('token')});
     const result: Observable<any> = this.http.put('https://localhost:44385/Countries/ModificarPais',pais ,{headers: headers});
     return result;
   }
   EliminarPais(pais_id:string) {
    const headers = new HttpHeaders({'Authorization':'Bearer '+sessionStorage.getItem('token')});
     const result: Observable<any> = this.http.delete('https://localhost:44385/Countries/EliminarPais?pais_id='+pais_id,{headers: headers});
     return result;
   }
}
