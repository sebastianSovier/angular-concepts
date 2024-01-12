import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DecryptDataService } from './decrypt-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorServiceService implements HttpInterceptor {
  url401 = '';
  reload = 0;
  constructor(private decryptService:DecryptDataService, private router: Router, private _snackBar: MatSnackBar) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string = sessionStorage.getItem("token")!;

    let request = req;
    // const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + sessionStorage.getItem('token') });

    if (token) {
      request = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token
        },body:this.decryptService.encrypt(req.body)
      });
      let data = req.body as FormData;
      console.log(data);
    }else{
      request = req.clone({
        body:this.decryptService.encrypt(req.body)
      });
      let data = req.body as FormData;
      console.log(data);
    }


    if (this.reload > 30) {
      setTimeout(() => {
        this.reload = 0;

      }, 10000)
      return EMPTY
    } else {
      return next.handle(request).pipe(
        mergeMap(async (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse && event.status === 200) {
            this.url401 = '';
            this.reload = 0;
            const _body = await this.decryptService.decrypt(event.body.data);
            return event.clone({ body: JSON.parse(_body) });
          }
          return event;
        }),
        catchError((err: HttpErrorResponse) => {

          if (err.status === 401 || err.status === 403) {
            if (this.url401 == request.url) {
              if (this.reload > 12) {
                this.reload = 0;
              } else {
                this.reload++;
              }

            } else {
              this.url401 = request.url;
              this.reload = 0;
            }


            sessionStorage.clear();
            this.router.navigateByUrl('');
            this.openSnackBar("Superó el tiempo limite de sesión.", "Ingrese Nuevamente");
          } else if (err.status === 500) {
            if (this.router.url === '/mantenedor') {
              this.router.navigateByUrl('');
            } else {
              this.router.navigateByUrl('');
            }
            this.openSnackBar("Hubo problemas, por favor comuniquese con Administrador.", "Reintente");
          } else if(err.status === 0){
            this.openSnackBar("Hubo problemas, por favor comuniquese con Administrador.", "Reintente");
          }else{
            return next.handle(request)
          }


          return throwError(err);

        })
      );
    }

    // return next.handle(request)

  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}