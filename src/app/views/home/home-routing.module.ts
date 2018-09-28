import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../guards';
import {Localization} from '../../localization';
import {ErrorComponent} from '../error/error.component';

const homeRoutes: Routes = [
  { path: 'dashboard', canActivate: [AuthGuard],
    loadChildren: '../dashboard/dashboard.module#DashboardModule',
    data: {title: Localization.pick('대쉬보드'), required_level: 1, opened: false} },
  { path: 'analysis', canActivate: [AuthGuard],
    loadChildren: '../analysis/analysis.module#AnalysisModule',
    data: {title: Localization.pick('분석'), required_level: 1, opened: false} },
  { path: 'configuration', canActivate: [AuthGuard],
    loadChildren: '../configuration/configuration.module#ConfigurationModule',
    data: {title: Localization.pick('설정'), required_level: 1, opened: false} },
  { path: 'report', canActivate: [AuthGuard],
    loadChildren: '../report/report.module#ReportModule',
    data: {title: Localization.pick('보고서'), required_level: 1, opened: false} },
  { path: 'intelligence', canActivate: [AuthGuard],
    loadChildren: '../intelligence/intelligence.module#IntelligenceModule',
    data: {title: Localization.pick('위협 인텔리전스'), required_level: 1, opened: false} },
  { path: 'admin', canActivate: [AuthGuard],
    loadChildren: '../admin/admin.module#AdminModule',
    data: {title: Localization.pick('관리자설정'), required_level: 5, opened: false} },
  { path: 'user', canActivate: [AuthGuard],
    loadChildren: '../user/user.module#UserModule',
    data: {hidden: true, title: Localization.pick('사용자설정'), required_level: 1} },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', canActivate: [AuthGuard], component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(homeRoutes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
