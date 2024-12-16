import {
  HttpErrorResponse,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DecryptDataService {
  constructor() {}

  public decrypt(data: HttpResponse<any>): Observable<any> {
    if (environment.encrypt) {
      const iv = CryptoJS.enc.Hex.parse(data.body.data.iv);
      const salt = CryptoJS.enc.Hex.parse(data.body.data.salt);
      const ciphertext = CryptoJS.enc.Hex.parse(data.body.data.ciphertext);

      // Derivar la clave con PBKDF2
      const key = CryptoJS.PBKDF2(environment.secretKey, salt, {
        keySize: 256 / 32,
        iterations: 1000,
        hasher: CryptoJS.algo.SHA256,
      });

      // Crear el objeto CipherParams con el ciphertext y el iv
      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: ciphertext,
        iv: iv,
      });

      // Desencriptar los datos usando el objeto CipherParams
      const decrypted = CryptoJS.AES.decrypt(cipherParams, key,{
        iv: iv,  // Asegúrate de pasar el iv en cfg si es necesario
      });

      // Convertir el texto desencriptado a una cadena y analizarlo
      return of(JSON.parse(decrypted.toString(CryptoJS.enc.Utf8)));
    } else {
      return of(data.body.data);
    }
  }
   public async decryptCatch(data: HttpErrorResponse): Promise<string> {
    if (environment.encrypt) {
      const iv = CryptoJS.enc.Hex.parse(data.error.data.iv);
      const salt = CryptoJS.enc.Hex.parse(data.error.data.salt);
      const ciphertext = CryptoJS.enc.Hex.parse(data.error.data.ciphertext);

      // Derivar la clave con PBKDF2
      const key = CryptoJS.PBKDF2(environment.secretKey, salt, {
        keySize: 256 / 32,
        iterations: 1000,
        hasher: CryptoJS.algo.SHA256,
      });

      // Crear el objeto CipherParams con el ciphertext y el iv
      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: ciphertext,
        iv: iv,
      });

      // Desencriptar los datos usando el objeto CipherParams
      const decrypted = CryptoJS.AES.decrypt(cipherParams, key,{
        iv: iv,  // Asegúrate de pasar el iv en cfg si es necesario
      });

      // Convertir el texto desencriptado a una cadena y analizarlo
      return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    } else {
      return data.error.data;
    }
  }
  public encrypt(data: HttpRequest<any>): Observable<any> {
    if (environment.encrypt) {
      const salt = CryptoJS.lib.WordArray.random(16);
      // Derivar la clave con PBKDF2
      const key = CryptoJS.PBKDF2(environment.secretKey, salt, {
        keySize: 256 / 32,
        iterations: 1000,
        hasher: CryptoJS.algo.SHA256,
      });
      // Generar un IV aleatorio
      const iv = CryptoJS.lib.WordArray.random(16);

      // Encriptar los datos
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      // Combinar el IV, el salt y el ciphertext
      const combined = {
        iv: iv.toString(CryptoJS.enc.Hex),
        salt: salt.toString(CryptoJS.enc.Hex),
        ciphertext: encrypted.ciphertext.toString(CryptoJS.enc.Hex),
      };

      return of({ data: combined });
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
