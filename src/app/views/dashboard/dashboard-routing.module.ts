import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {OverviewComponent} from './overview/overview.component';
import {IntrusionComponent} from './intrusion/intrusion.component';
import {VulnerabilityComponent} from './vulnerability/vulnerability.component';
import {SystemComponent} from './system/system.component';
import {FullLogsComponent} from './full-logs/full-logs.component';
import {Localization} from '../../localization/localization';

const dashboardRoutes: Routes = [
  { path: 'overview', component: OverviewComponent, data: {title: Localization.pick('개요'), required_level: 1} },
  { path: 'intrusion', component: IntrusionComponent, data: {title: Localization.pick('침입탐지'), required_level: 1} },
  { path: 'vulnerability', component: VulnerabilityComponent, data: {title: Localization.pick('취약점'), required_level: 1} },
  { path: 'system', component: SystemComponent, data: {title: Localization.pick('시스템'), required_level: 1} },
  { path: 'full-logs', component: FullLogsComponent, data: {title: Localization.pick('전체로그'), required_level: 1} },
  { path: '', redirectTo: 'overview', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
