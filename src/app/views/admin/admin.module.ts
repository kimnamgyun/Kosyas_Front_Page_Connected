import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AdminRoutingModule} from './admin-routing.module';

import {SharedModule} from '../shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SystemManagementComponent} from './system-management/system-management.component';
import {UserManagementComponent} from './user-management/user-management.component';
import {LicenseInfoComponent} from './license-info/license-info.component';
import {LanguageComponent} from './language/language.component';
import {InspectionLogComponent} from './inspection-log/inspection-log.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AdminRoutingModule,
    SharedModule,
  ],
  declarations: [
    SystemManagementComponent,
    UserManagementComponent,
    LanguageComponent,
    LicenseInfoComponent,
    InspectionLogComponent,
  ]
})
export class AdminModule {}
