import { Injectable, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingPageService {
  private subject: Subject<any> = new Subject<any>();
  public emisor: any = this.subject.asObservable();
  @Output() condicion = false

  constructor() {
  }

  cambiarestadoloading(condicion: boolean) {
    this.subject.next({ condicion });

  }
}