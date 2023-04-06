import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MantenedorComponent } from './mantenedor/mantenedor.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { HttpClient, HttpClientJsonpModule, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingPageModule } from './loading-page/loading-page.module';
import { LoadingPageService } from './loading-page/loading-page.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule, } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DialogOverviewExampleDialogComponent } from './modales/dialog-overview-example-dialog/dialog-overview-example-dialog.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { GoogleMapsModule } from '@angular/google-maps';
import { AgmCoreModule } from '@agm/core';
import { AppConfig } from './appconfig';
import localeCl from '@angular/common/locales/es-CL';
import localeClExtra from '@angular/common/locales/extra/es-CL';
import { registerLocaleData } from '@angular/common';
import { AuthInterceptorServiceService } from './auth-interceptor-service.service';
import { MatTableExporterModule } from 'mat-table-exporter';
import { AuthGuardService } from './auth-guard.service';
import { AuthService } from './auth.service';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { PadreComponent } from './parent-child-component/padre/padre.component';
import { HijoComponent } from './parent-child-component/hijo/hijo.component';
import { MatNativeDateModule } from '@angular/material/core';
import { ModalEditarPaisComponent } from './modal-editar-pais/modal-editar-pais.component';

registerLocaleData(localeCl, localeClExtra);

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MantenedorComponent,
    DialogOverviewExampleDialogComponent,
    PadreComponent,
    HijoComponent,
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
    //componenetes angular material
    MatSliderModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    MatStepperModule,
    MatSnackBarModule,
    MatDialogModule,
    MatExpansionModule,
    MatSidenavModule,
    MatTableExporterModule,
    GoogleMapsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDgcp1axlsAr2kQ3sfV33oiyp99UswWYNs',
      libraries: ['places']
    })
  ],
  providers: [
    DatePipe,
    LoadingPageService,
    AuthGuardService,
    AuthService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    HttpClient, { provide: LOCALE_ID, useValue: 'es-CL' },
    AppConfig,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorServiceService,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfig],
      multi: true,
    },
  ],entryComponents: [
    ModalEditarPaisComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
