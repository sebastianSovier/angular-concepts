import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, throwError, from } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { DecryptDataService } from './decrypt-data.service';
import { LoadingPageService } from './loading-page/loading-page.service';
import { LoginService } from './login/login.service';
@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorServiceService implements HttpInterceptor {
  url401 = '';
  reload = 0;

  constructor(
    private loginService: LoginService,
    private decryptService: DecryptDataService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private _loadingService: LoadingPageService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this._loadingService.cambiarestadoloading(true);

    const token: string = localStorage.getItem('token')!;
    let request = req;
    const csrfToken = this.getCookie('XSRF-TOKEN');
    let clonedRequest: HttpRequest<any> = req;
    return this.decryptService.encrypt(request).pipe(
      switchMap((encryptedBody) => {
        // Procesar la solicitud
        if (req.method === 'GET' || req.method === 'DELETE') {
          if (req.url.indexOf('?') > 0) {
            const encriptURL =
              req.url.substring(0, req.url.indexOf('?') + 1) +
              'data=' +
              encodeURIComponent(
                this.decryptService.encryptQuery(
                  req.url.substring(req.url.indexOf('?') + 1, req.url.length)
                )
              );
              request = req.clone({
              url: encriptURL});
          }
        } else {
          request = req.clone({
            body: encryptedBody});
        }
        clonedRequest =  this.addAuthHeader(request,token,csrfToken);

        return next.handle(clonedRequest).pipe(
          switchMap(async (event: HttpEvent<any>) => {
            if (event instanceof HttpResponse && event.ok) {
              const contentType = event.headers.get('Content-Type');
              this._loadingService.cambiarestadoloading(false);

              if (contentType?.includes('application/json')) {
                // Uso de await para desencriptar el cuerpo
                const decryptedBody = JSON.parse(
                  await this.decryptService.decrypt(event).toPromise()
                );
                return event.clone({ body: decryptedBody });
              }
            }
            return event;
          }),
          catchError((error) => this.handleError(error, next, request))
        );
      }),
      catchError((error) => throwError(() => error)) // Catch genérico
    );
  }
  private addAuthHeader(req: HttpRequest<any>,token:any,csrfToken:any): HttpRequest<any> {
    const xsrfToken = csrfToken;
        return req.clone({
      withCredentials:true,
      setHeaders: {
        'Accept': 'application/json',
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        'X-XSRF-TOKEN': xsrfToken || ''    
      },
    });
  }
  private handleError(
    error: any,
    next: HttpHandler,
    request: HttpRequest<any>
  ): Observable<HttpEvent<any>> {
    this._loadingService.cambiarestadoloading(false);
    return from(this.decryptService.decryptCatch(error)).pipe(
      switchMap((decryptData) => {
        this._loadingService.cambiarestadoloading(false);
        if (error.status === 401 || error.status === 403) {
          if (this.url401 == request.url) {
            this.reload = this.reload > 12 ? 0 : this.reload + 1;
          } else {
            this.url401 = request.url;
            this.reload = 0;
          }

          if (decryptData && JSON.parse(decryptData).Error === '93') {
            this.handleUnauthorized('Usuario ya posee sesión activa.');
          } else {
            this.handleUnauthorized('Superó el tiempo límite de sesión.');
          }
        } else if ([500, 0].includes(error.status)) {
          this.handleServerError();
        } else {
          return next.handle(request);
        }
        return throwError(() => error);
      }),
      catchError((decryptError) => {
        console.error('Error en el desencriptado:', decryptError);
        return throwError(() => decryptError);
      })
    );
  }

  private handleUnauthorized(message: string): void {
    localStorage.clear();
    this.router.navigateByUrl('');
    this.openSnackBar(message);
  }

  private handleServerError(): void {
    if (localStorage.getItem('user') != null) {
      const requestLogout = { usuario: localStorage.getItem('user')! };
      this.loginService.CerrarSesion(requestLogout).toPromise();
    }
    this.loginService.enviaCondicion(false);
    localStorage.clear();
    this.router.navigateByUrl('');
    this.openSnackBar(
      'Hubo problemas, por favor comuniquese con Administrador.'
    );
  }

  openSnackBar(message: string): void {
    this._snackBar.open(message);
  }
  private getCookie(name: string): string | null {
    const xsrfToken = document.cookie.split(';').find((cookie) => cookie.trim().startsWith('XSRF-TOKEN='));
    return xsrfToken ? decodeURIComponent(xsrfToken.split('=')[1]) : '';

  }
}
