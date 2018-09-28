import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SystemComponent} from './system/system.component';
import {AgentComponent} from './agent/agent.component';
import {Localization} from '../../localization';

const configurationRoutes: Routes = [
  { path: 'system', component: SystemComponent, data: {title: Localization.pick('운영 관리'), required_level: 1} },
  { path: 'agent', component: AgentComponent, data: {title: Localization.pick('에이전트 관리'), required_level: 1} },
  { path: '', redirectTo: 'system', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forChild(configurationRoutes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule {}
