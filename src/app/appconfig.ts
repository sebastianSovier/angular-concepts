import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAppconfig } from './iappconfig.model';



@Injectable({ providedIn: 'root' })

export class AppConfig {

  public constructor(private http: HttpClient) {

  }
  static settings: IAppconfig;

  public config: any;
  public env: any;

  public get_() {
    return this.config;
  }

  load() {
    const jsonFile = `assets/params.json`;
    return new Promise<void>((resolve, reject) => {
      this.http.get(jsonFile).toPromise().then((response: any) => {
        AppConfig.settings = response as IAppconfig;
        resolve();
      }).catch((response: any) => {
        reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
      });
    });

  }

}