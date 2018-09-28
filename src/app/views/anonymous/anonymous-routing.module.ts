import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {FindIDComponent} from './find-id/find-id.component';
import {FindPasswordComponent} from './find-password/find-password.component';
import {ChangePasswordComponent} from './change-password/change-password.component';

const anonymousRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'find-id', component: FindIDComponent },
  { path: 'find-password', component: FindPasswordComponent },
  { path: 'change-password/:id/:gbn', component: ChangePasswordComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(anonymousRoutes)],
  exports: [RouterModule]
})
export class AnonymousRoutingModule { }
