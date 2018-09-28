import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';

import {ConfigurationRoutingModule} from './configuration-routing.module';

import {SystemComponent} from './system/system.component';
import {AgentComponent} from './agent/agent.component';
import {SharedModule} from '../shared.module';
import {ConfigurationService} from '../../services';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ConfigurationRoutingModule,
    SharedModule,
  ],
  declarations: [
    SystemComponent,
    AgentComponent,
  ],
    providers: [ConfigurationService]
})
export class ConfigurationModule { }
