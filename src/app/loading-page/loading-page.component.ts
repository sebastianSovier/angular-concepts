import { Component, OnInit } from '@angular/core';
import { LoadingPageService } from './loading-page.service';

@Component({
  selector: 'app-loading-page',
  templateUrl: './loading-page.component.html',
  styleUrls: ['./loading-page.component.scss']
})
export class LoadingPageComponent implements OnInit {
  condicion = true;
  constructor(private loading: LoadingPageService) {
    this.loading.emisor.subscribe((d: { condicion: boolean; }) => {
        this.cambiarestado(d.condicion);
    });
  }

  ngOnInit() {
  }
  get absUrl() {
    return window.location.href;
  }
  cambiarestado(condition: boolean) {
    this.condicion = condition;
  }
}