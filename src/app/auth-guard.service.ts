import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
@Injectable()
export class AuthGuardService  {
  constructor(public auth: AuthService, public router: Router) { }
  canActivate(): boolean {
    if (!this.auth.isAuthenticated() || this.auth.jwtHelper.isTokenExpired(sessionStorage.getItem('token')!)) {
      this.router.navigateByUrl('');
      
      return false;
    }
    return true;
  }
}