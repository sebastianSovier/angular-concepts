import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LoginService } from './login/login.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',

  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Proyecto Angular 17 aaa / Angular Material 15/ Express.js Middleware / Mysql/ Firebase Y Firebase Admin /Api Net Core 6 /Recaptcha v3 /Google maps ';
  mostrar = false;
  recarga: boolean = false;
  constructor(private route: Router, private loginService: LoginService) {
    this.loginService.emisor.subscribe((d: { mostrarMenu: boolean }) => {
      this.mostrar = d.mostrarMenu;
    });
    /*this.route.events
      .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
      .subscribe(event => {
        if (
          event.id === 1 &&
          event.url === event.urlAfterRedirects
        ) {
          this.recarga = true;
        }
      })*/
  }
  async ngOnDestroy() {
    this.LogOut();
  }
  ngOnInit() {
    if (!localStorage.getItem('user') || !localStorage.getItem('token')) {
      localStorage.clear();
      this.route.navigateByUrl('');
      this.mostrar = false;
    } else {
      this.mostrar = true;
    }
  }
  LogOut() {
    const requestLogout = { usuario: localStorage.getItem('user')! }
    this.loginService.CerrarSesion(requestLogout).subscribe((datos) => {
      localStorage.clear();
      this.mostrar = false;
      this.route.navigateByUrl('');
    });

  }
  VerPaises() {
    this.route.navigateByUrl('paises');
  }
}
