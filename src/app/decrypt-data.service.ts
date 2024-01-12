import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DecryptDataService {

  constructor() { }


  public decrypt(data: any):any{
    const bytes  = CryptoJS.AES.decrypt(data,environment.secretKey);
    const resp = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return resp;
  }
  public encrypt(data: any):any{
    const resp = CryptoJS.AES.encrypt(JSON.stringify(data), environment.secretKey).toString();
    return {data:resp};
  }
}
