import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AnonymousRoutingModule} from './anonymous-routing.module';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FindIDComponent } from './find-id/find-id.component';
import { FindPasswordComponent } from './find-password/find-password.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {SharedModule} from '../shared.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AnonymousRoutingModule,
    SharedModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    FindIDComponent,
    FindPasswordComponent,
    ChangePasswordComponent,
  ]
})
export class AnonymousModule { }
