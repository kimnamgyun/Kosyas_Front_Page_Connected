import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SystemManagementComponent} from './system-management/system-management.component';
import {UserManagementComponent} from './user-management/user-management.component';
import {Localization} from '../../localization';
import {LanguageComponent} from './language/language.component';
import {InspectionLogComponent} from './inspection-log/inspection-log.component';
import {LicenseInfoComponent} from './license-info/license-info.component';
import {UserInfoComponent} from '../user/user-info/user-info.component';

const adminRoutes: Routes = [
  { path: 'user-management', component: UserManagementComponent, data: {title: Localization.pick('사용자 관리'), required_level: 5} },
  { path: 'inspection-log', component: InspectionLogComponent, data: {title: Localization.pick('감사 로그'), required_level: 5} },
  { path: 'system-management', component: SystemManagementComponent, data: {title: Localization.pick('시스템 등록'), required_level: 5} },
  { path: 'license-info', component: LicenseInfoComponent, data: {title: Localization.pick('라이센스 확인'), required_level: 5} },
  { path: 'language', component: LanguageComponent, data: {title: Localization.pick('다국어 관리'), required_level: 9} },
  { path: '', redirectTo: 'system-management', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
