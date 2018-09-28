import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {PrintComponent} from './print/print.component';

const reportRoutes: Routes = [
  { path: 'print', component: PrintComponent, data: {title: '보고서 출력', required_level: 1} },
  { path: '', redirectTo: 'status', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forChild(reportRoutes)],
  exports: [RouterModule]
})
export class ReportRoutingModule {}
