import { NgModule } from '@angular/core';
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
    ParentChildRoutingModule,
    MaterialModule,
  ]
})
export class ParentChildModule { }
