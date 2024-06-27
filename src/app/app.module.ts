import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
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
import { RECAPTCHA_SETTINGS, RECAPTCHA_V3_SITE_KEY, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings, RecaptchaV3Module } from 'ng-recaptcha';
import { environment } from 'src/environments/environment';
import { NgChartsModule } from 'ng2-charts';

registerLocaleData(localeCl, localeClExtra);

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        MantenedorComponent,
        DialogOverviewExampleDialogComponent,
        ModalEditarPaisComponent
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
        RecaptchaModule,
        RecaptchaFormsModule,
        RecaptchaV3Module,
        NgChartsModule

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
        {
            provide: RECAPTCHA_SETTINGS,
            useValue: {
                siteKey: environment.recaptchakeyv2,
            } as RecaptchaSettings,
        },
        { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recaptchakey }
    ],
    bootstrap: [AppComponent], schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class AppModule { }
