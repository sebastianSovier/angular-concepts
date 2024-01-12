import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MantenedorComponent } from './mantenedor/mantenedor.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClient, HttpClientJsonpModule, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingPageModule } from './loading-page/loading-page.module';
import { LoadingPageService } from './loading-page/loading-page.service';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

import { DialogOverviewExampleDialogComponent } from './modales/dialog-overview-example-dialog/dialog-overview-example-dialog.component';

import { GoogleMapsModule } from '@angular/google-maps';
import { AgmCoreModule } from '@agm/core';
import localeCl from '@angular/common/locales/es-CL';
import localeClExtra from '@angular/common/locales/extra/es-CL';
import { registerLocaleData } from '@angular/common';
import { AuthInterceptorServiceService } from './auth-interceptor-service.service';
import { AuthGuardService } from './auth-guard.service';
import { AuthService } from './auth.service';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { ModalEditarPaisComponent } from './modal-editar-pais/modal-editar-pais.component';
import { MaterialModule } from './material/material.module';
import { DecryptDataService } from './decrypt-data.service';
import { FirebaseService } from './shared-components/firebase.service';

registerLocaleData(localeCl, localeClExtra);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MantenedorComponent,
    DialogOverviewExampleDialogComponent,
    ModalEditarPaisComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoadingPageModule,
    MaterialModule,
    GoogleMapsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDgcp1axlsAr2kQ3sfV33oiyp99UswWYNs',
      libraries: ['places']
    })
  ],
  providers: [
    DatePipe,
    LoadingPageService,
    AuthGuardService,
    FirebaseService,
    AuthService,
    DecryptDataService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    HttpClient, { provide: LOCALE_ID, useValue: 'es-CL' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorServiceService,
      multi: true
    },
  ],entryComponents: [
    ModalEditarPaisComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
