import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, mergeMap, switchMap, tap } from 'rxjs/operators';
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
    return this.decryptService.encrypt(request.body).pipe(
      switchMap((encryptedBody) => {
        // Clonamos la solicitud original y le asignamos el cuerpo cifrado
        if(req.method === "GET" || req.method === "DELETE"){
          if (req.url.indexOf("?") > 0) {
            let encriptURL = req.url.substring(0, req.url.indexOf("?") + 1) +"data="+ encodeURIComponent(this.decryptService.encryptQuery(req.url.substring(req.url.indexOf("?") + 1, req.url.length)));
            if(token){
              request = req.clone({
                url: encriptURL,
                setHeaders: {
                  Authorization: 'Bearer ' + token
                }
            });
            }else{
              request = req.clone({
                url: encriptURL,   
            });
            }     
          }
        }else{
          if(token){
          const encryptedRequest = request.clone({ body: encryptedBody,setHeaders: {
            Authorization: 'Bearer ' + token
          } });
          return next.handle(encryptedRequest);
        }else{
          const encryptedRequest = request.clone({ body: encryptedBody });
          return next.handle(encryptedRequest);
        }
          // Luego, pasamos la solicitud cifrada al siguiente manejador
          
        }
        
        // Luego, pasamos la solicitud cifrada al siguiente manejador
        return next.handle(request);
      }),
      switchMap(async (event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && event.ok) {
          try {
            // Verificar el tipo de contenido antes de desencriptar
            const contentType = event.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
              const _body = await this.decryptService.decrypt(event.body.data).toPromise();
              // Manejar posibles errores durante el JSON.parse
              const parsedBody = JSON.parse(_body);
              return event.clone({ body: parsedBody });
            }
          } catch (error) {
            console.error('Error during decryption or JSON parsing:', error);
            // Puedes lanzar el error nuevamente o devolver la respuesta original
            return of(event);
          }
        }
        return event;
      }),
      catchError(error => {

        if (error.status === 401 || error.status === 403) {
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
        } else if (error.status === 500) {
          if (this.router.url === '/mantenedor') {
            this.router.navigateByUrl('');
          } else {
            this.router.navigateByUrl('');
          }
          this.openSnackBar("Hubo problemas, por favor comuniquese con Administrador.", "Reintente");
        } else if(error.status === 0){
          this.openSnackBar("Hubo problemas, por favor comuniquese con Administrador.", "Reintente");
        }else{
          return next.handle(request);
        }

       
        return throwError(error);

      })

    );

/*
    let request = req;
    // const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + sessionStorage.getItem('token') });

    
    if(req.method !== "OPTIONS"){
    if(req.method === "GET" || req.method === "DELETE"){
      if (req.url.indexOf("?") > 0) {
        let encriptURL = req.url.substring(0, req.url.indexOf("?") + 1) +"data="+ encodeURIComponent(this.decryptService.encryptQuery(req.url.substring(req.url.indexOf("?") + 1, req.url.length)));
        if(token){
          request = req.clone({
            url: encriptURL,
            setHeaders: {
              Authorization: 'Bearer ' + token
            }
        });
        }else{
          request = req.clone({
            url: encriptURL,   
        });
        }     
      }
    }else{
      if (token) {
        request = req.clone({
          setHeaders: {
            Authorization: 'Bearer ' + token
          },body:this.decryptService.encrypt(req.body)
        });
      }else{
        request = req.clone({
          body:this.decryptService.encrypt(req.body)
        });
      }
    }
  }

    if (this.reload > 30) {
      setTimeout(() => {
        this.reload = 0;

      }, 10000)
      return EMPTY
    } else {
      return next.handle(request).pipe(
        switchMap(async (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse && event.status === 200) {
            const _body = await this.decryptService.decrypt(event.body.data);
            return event.clone({ body: JSON.parse(_body) });
          }
          return event;
        }),
        catchError(error => {

          if (error.status === 401 || error.status === 403) {
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
          } else if (error.status === 500) {
            if (this.router.url === '/mantenedor') {
              this.router.navigateByUrl('');
            } else {
              this.router.navigateByUrl('');
            }
            this.openSnackBar("Hubo problemas, por favor comuniquese con Administrador.", "Reintente");
          } else if(error.status === 0){
            this.openSnackBar("Hubo problemas, por favor comuniquese con Administrador.", "Reintente");
          }else{
            return next.handle(request);
          }

         
          return throwError(error);

        })
      );
    }

    // return next.handle(request)
*/
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}

