import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParentChildRoutingModule } from './parent-child-routing.module';
import { HijoComponent } from './hijo/hijo.component';
import { PadreComponent } from './padre/padre.component';
import { MaterialModule } from '../material/material.module';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  declarations: [
    HijoComponent,
    PadreComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    ParentChildRoutingModule,
    MaterialModule
  ]
})
export class ParentChildModule { }
