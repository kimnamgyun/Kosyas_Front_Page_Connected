import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CoverComponent} from './cover/cover.component';
import {OverviewComponent} from './overview/overview.component';
import {IntrusionComponent} from './intrusion/intrusion.component';
import {VulnerabilityComponent} from './vulnerability/vulnerability.component';
import {SystemComponent} from './system/system.component';
import {FullLogsComponent} from './full-logs/full-logs.component';

const previewRoutes: Routes = [
  { path: '', redirectTo: 'cover', pathMatch: 'full'},
  { path: 'cover', component: CoverComponent },
  { path: 'overview', component: OverviewComponent},
  { path: 'intrusion', component: IntrusionComponent },
  { path: 'vulnerability', component: VulnerabilityComponent },
  { path: 'system', component: SystemComponent },
  { path: 'full-logs', component: FullLogsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(previewRoutes)],
  exports: [RouterModule]
})
export class PreviewRoutingModule {}
