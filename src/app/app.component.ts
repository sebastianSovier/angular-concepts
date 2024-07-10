import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login/login.service';

@Component({
  selector: 'app-root',
  
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Proyecto Angular 17 aaa / Angular Material 15/ Express.js Middleware / Mysql/ Firebase Y Firebase Admin /Api Net Core 6 /Recaptcha v3 /Google maps ';
  mostrar = false;
  constructor(private route: Router, private loginService: LoginService) {
    this.loginService.emisor.subscribe((d: { mostrarMenu: boolean }) => {
      this.mostrar = d.mostrarMenu;
    });
  }
  ngOnInit() {
    if (!sessionStorage.getItem('user') || !sessionStorage.getItem('token')) {
      sessionStorage.clear();
      this.route.navigateByUrl('');
      this.mostrar = false;
    }else{
      this.mostrar = true;
    }
  }
  LogOut() {
    sessionStorage.clear();
    this.route.navigateByUrl('');
    this.mostrar = false;
  }
  VerPaises(){
    this.route.navigateByUrl('paises');
  }
}
