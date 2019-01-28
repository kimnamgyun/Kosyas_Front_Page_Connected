import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';


const homepageRoutes: Routes = [
    ];

@NgModule({
    imports: [RouterModule.forChild(homepageRoutes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
