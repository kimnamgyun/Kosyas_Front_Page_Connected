import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';

import {ReportRoutingModule} from './report-routing.module';

import {PrintComponent} from './print/print.component';
import {SharedModule} from '../shared.module';

@NgModule({
  imports: [
    CommonModule,
    ReportRoutingModule,
    SharedModule,
  ],
  declarations: [
    PrintComponent,
  ]
})
export class ReportModule { }
