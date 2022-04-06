import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Proyecto Angular 12 / Angular Material/ Express.js / Mysql';
  mostrar = false;
  constructor(private route: Router, private loginService: LoginService) {
    this.loginService.emisor.subscribe((d: { mostrarMenu: boolean }) => {
      this.mostrar = d.mostrarMenu;
    });
  }
ngOnInit(){
  sessionStorage.clear();
    this.route.navigateByUrl('');
}
  LogOut() {
    sessionStorage.clear();
    this.route.navigateByUrl('');
    this.mostrar = false;
  }
}
