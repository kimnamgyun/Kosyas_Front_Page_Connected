import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';

import {IntelligenceRoutingModule} from './intelligence-routing.module';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IocStatusComponent} from './ioc-status/ioc-status.component';
import {MinemeldComponent} from './minemeld/minemeld.component';
import {SharedModule} from '../shared.module';
import {IntelligenceService} from '../../services/intelligence.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IntelligenceRoutingModule,
    SharedModule,
    FormsModule,
  ],
  declarations: [
    IocStatusComponent,
    MinemeldComponent,
  ],
  providers: [IntelligenceService]
})
export class IntelligenceModule { }
