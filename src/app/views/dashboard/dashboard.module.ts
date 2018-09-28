import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';

import {OverviewComponent} from './overview/overview.component';
import {IntrusionComponent} from './intrusion/intrusion.component';
import {VulnerabilityComponent} from './vulnerability/vulnerability.component';
import {SystemComponent} from './system/system.component';
import {FullLogsComponent} from './full-logs/full-logs.component';
import {SharedModule} from '../shared.module';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
  ],
  declarations: [
    OverviewComponent,
    IntrusionComponent,
    VulnerabilityComponent,
    SystemComponent,
    FullLogsComponent,
  ],
})
export class DashboardModule { }
