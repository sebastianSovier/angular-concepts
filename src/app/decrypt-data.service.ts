import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { AppConfig } from './appconfig';


@Injectable({
  providedIn: 'root'
})
export class DecryptDataService {

  constructor() { }


  public decrypt(data: any):any{
    const bytes  = CryptoJS.AES.decrypt(data,AppConfig.settings.SecretKey.toString());
    const resp = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return resp;
  }
  public encrypt(data: any):any{
    const resp = CryptoJS.AES.encrypt(JSON.stringify(data), AppConfig.settings.SecretKey.toString()).toString();
    return {data:resp};
  }
}
