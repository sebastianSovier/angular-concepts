import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParentChildRoutingModule } from './parent-child-routing.module';
import { HijoComponent } from './hijo/hijo.component';
import { PadreComponent } from './padre/padre.component';
import { MaterialModule } from '../material/material.module';


@NgModule({
  declarations: [
    HijoComponent,
    PadreComponent
  ],
  imports: [
    CommonModule,
    ParentChildRoutingModule,
    MaterialModule
  ]
})
export class ParentChildModule { }
