import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {HomeRoutingModule} from './home-routing.module';
import {SharedModule} from '../shared.module';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
  ],
  declarations: [],
})
export class HomeModule {}
