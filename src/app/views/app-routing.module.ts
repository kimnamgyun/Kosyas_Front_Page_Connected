import { NgModule } from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {HomepageComponent} from "./homepage/homepage.component";
import {HomeComponent} from './home/home.component';
import {AuthGuard} from '../guards';
import {AnonymousComponent} from './anonymous/anonymous.component';
import {ErrorComponent} from './error/error.component';
import {PreviewComponent} from './report/print/preview/preview.component';


const appRoutes: Routes = [
   { path: '', redirectTo: '/homepage', pathMatch: 'full' },
   { path: 'homepage', component: HomepageComponent, loadChildren: './homepage/homepage.module#HomepageModule'},
  { path: 'anonymous', component: AnonymousComponent, loadChildren: './anonymous/anonymous.module#AnonymousModule'},
  { path: 'preview', component: PreviewComponent, loadChildren: './report/print/preview/preview.module#PreviewModule', canActivate: [AuthGuard]},
  { path: '', component: HomeComponent, loadChildren: './home/home.module#HomeModule', canActivate: [AuthGuard]},
  { path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: true,
        preloadingStrategy: PreloadAllModules,
      }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {  }
