import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorServiceService implements HttpInterceptor {
  url401 = '';
  reload = 0;
  constructor(private router: Router) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string = sessionStorage.getItem("token")!;

    let request = req;
    // const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + sessionStorage.getItem('token') });

    if (token) {
      request = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token
        }
      });
    }

    if (this.reload > 30) {
      setTimeout(() => {
        this.reload = 0;

      }, 10000)
      return EMPTY
    } else {
      return next.handle(request).pipe(
        tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse && event.status === 200) {
            this.url401 = '';
            this.reload = 0;
          }
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
            if (this.router.url === '/mantenedor') {

            } else {
              this.router.navigateByUrl('');
            }

          } else if (err.status === 500) {
            if (this.router.url === '/mantenedor') {
              this.router.navigateByUrl('');
            } else {
              this.router.navigateByUrl('');
            }

          }


          return throwError(err);

        })
      );
    }

    // return next.handle(request)

  }
}