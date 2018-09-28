import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../guards';
import {Localization} from '../../localization';
import {ErrorComponent} from '../error/error.component';
import {UserInfoComponent} from '../user/user-info/user-info.component';

const userRoutes: Routes = [
  { path: 'user-info', component: UserInfoComponent, data: {hidden: true, title: Localization.pick('사용자 정보'), required_level: 1} },
  { path: '', redirectTo: 'user-info', pathMatch: 'full' },
  { path: '**', canActivate: [AuthGuard], component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(userRoutes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
