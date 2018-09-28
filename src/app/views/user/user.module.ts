import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {UserRoutingModule} from './user-routing.module';
import {SharedModule} from '../shared.module';
import {UserInfoComponent} from '../user/user-info/user-info.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    UserRoutingModule,
    SharedModule,
  ],
  declarations: [UserInfoComponent],
})
export class UserModule {}
