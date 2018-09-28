import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';

import {AnalysisRoutingModule} from './analysis-routing.module';

import {CorrelationComponent} from './correlation/correlation.component';
import {AlertComponent} from './alert/alert.component';
import {SharedModule} from '../shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DefaultComponent} from './default/default.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AnalysisRoutingModule,
    SharedModule,
  ],
  declarations: [
    DefaultComponent,
    CorrelationComponent,
    AlertComponent,
  ],
})
export class AnalysisModule { }
