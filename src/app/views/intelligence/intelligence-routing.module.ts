import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {IocStatusComponent} from './ioc-status/ioc-status.component';
import {MinemeldComponent} from './minemeld/minemeld.component';
import {Localization} from '../../localization';

const intelligenceRoutes: Routes = [
  { path: 'ioc-status', component: IocStatusComponent , data: {title: Localization.pick('IOC 상태'), required_level: 1}},
  { path: 'minemeld', component: MinemeldComponent , data: {title: Localization.pick('연동'), required_level: 1}},
  { path: '', redirectTo: 'ioc-status', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forChild(intelligenceRoutes)],
  exports: [RouterModule]
})
export class IntelligenceRoutingModule {}
