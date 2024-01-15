import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DecryptDataService {

  constructor() { }


  public decrypt(data: any):any{
    const bytes  = CryptoJS.AES.decrypt(data,environment.secretKey);
    const resp = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return of(resp);
  }
  public encrypt(data: any):any{
    const resp = CryptoJS.AES.encrypt(JSON.stringify(data), environment.secretKey).toString();
    return of({data:resp});
  }
  public encryptQuery(data: any):any{
    const  resp = CryptoJS.AES.encrypt(data, environment.secretKey).toString(); 
    return resp;
  }
}
