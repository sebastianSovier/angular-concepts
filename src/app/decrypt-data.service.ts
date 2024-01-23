import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DecryptDataService {

  constructor() { }


  public decrypt(data: HttpResponse<any>):Observable<any>{
    const bytes  = CryptoJS.AES.decrypt(data.body.data,environment.secretKey);
    const resp = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return of(resp);
  }
  public encrypt(data: HttpRequest<any>):Observable<any>{
    const resp = CryptoJS.AES.encrypt(JSON.stringify(data.body), environment.secretKey).toString();
    return of({data:resp});
  }
  public encryptQuery(data: string):string{
    const  resp = CryptoJS.AES.encrypt(data, environment.secretKey).toString(); 
    return resp;
  }
}
