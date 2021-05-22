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
}
