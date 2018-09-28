import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PreviewRoutingModule} from './preview.routing.module';
import {CoverComponent} from './cover/cover.component';
import {OverviewComponent} from './overview/overview.component';
import {IntrusionComponent} from './intrusion/intrusion.component';
import {VulnerabilityComponent} from './vulnerability/vulnerability.component';
import {SystemComponent} from './system/system.component';
import {FullLogsComponent} from './full-logs/full-logs.component';
import {SharedModule} from '../../../shared.module';


@NgModule({
  imports: [
    CommonModule,
    PreviewRoutingModule,
    SharedModule,
  ],
  declarations: [
    CoverComponent,
    OverviewComponent,
    IntrusionComponent,
    VulnerabilityComponent,
    SystemComponent,
    FullLogsComponent
  ],
  providers: []
})
export class PreviewModule { }
