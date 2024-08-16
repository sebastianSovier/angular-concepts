import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { LoginService } from './login/login.service';
@Injectable()
export class AuthGuardService {
  constructor(private auth: AuthService, private router: Router, private loginService: LoginService) { }
  canActivate(): boolean {
    if (!this.auth.isAuthenticated() || this.auth.jwtHelper.isTokenExpired(localStorage.getItem('token')!)) {
      this.router.navigateByUrl('');
      if (localStorage.getItem('user')) {
        const requestLogout = { usuario: localStorage.getItem('user')! }
        this.loginService.CerrarSesion(requestLogout).toPromise();
      }
      return false;
    }
    return true;
  }
}