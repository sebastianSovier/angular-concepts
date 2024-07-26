import { HttpErrorResponse, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DecryptDataService {

  constructor() { }


  public decrypt(data: HttpResponse<any>): Observable<any> {
    if (environment.encrypt) {
      const bytes = CryptoJS.AES.decrypt(data.body.data, environment.secretKey);
      const resp = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return of(resp);
    } else {
      return of(data.body.data);
    }

  }
  public decryptCatch(data: HttpErrorResponse): string {
    if (environment.encrypt) {
      const bytes = CryptoJS.AES.decrypt(data.error.data, environment.secretKey);
      const resp = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return resp;
    } else {
      return data.error.data;
    }

  }
  public encrypt(data: HttpRequest<any>): Observable<any> {
    if (environment.encrypt) {
      const resp = CryptoJS.AES.encrypt(JSON.stringify(data.body), environment.secretKey).toString();
      return of({ data: resp });
    } else {
      return of({ data: data.body });
    }
  }
  public encryptQuery(data: string): string {
    if (environment.encrypt) {
      const resp = CryptoJS.AES.encrypt(data, environment.secretKey).toString();
      return resp;
    } else {
      return data;
    }
  }
}
