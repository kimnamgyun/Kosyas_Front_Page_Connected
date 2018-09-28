import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {CorrelationComponent} from './correlation/correlation.component';
import {AlertComponent} from './alert/alert.component';
import {Localization} from '../../localization';

const analysisRoutes: Routes = [
  { path: 'correlation', component: CorrelationComponent, data: {title: Localization.pick('연관성 분석'), required_level: 1} },
  { path: 'alert', component: AlertComponent, data: {title: Localization.pick('알람'), required_level: 1} },
  { path: '', redirectTo: 'correlation', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forChild(analysisRoutes)],
  exports: [RouterModule]
})
export class AnalysisRoutingModule {}
