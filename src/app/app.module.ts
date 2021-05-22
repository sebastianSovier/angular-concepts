import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MantenedorComponent } from './mantenedor/mantenedor.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import {MatCardModule} from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import { LoadingPageModule } from './loading-page/loading-page.module';
import { LoadingPageService } from './loading-page/loading-page.service';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule,} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatStepperModule} from '@angular/material/stepper';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogOverviewExampleDialogComponent } from './modales/dialog-overview-example-dialog/dialog-overview-example-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MantenedorComponent,
    DialogOverviewExampleDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSliderModule,
    MatCardModule,
    LoadingPageModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    MatStepperModule,
    MatSnackBarModule,
    MatDialogModule

  ],
  providers: [
    LoadingPageService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
