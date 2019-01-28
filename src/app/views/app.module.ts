import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import {HomepageModule} from "./homepage/homepage.module";
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from '../guards/index';
import {AdminService, AnalysisService, AuthenticationService, DashboardService, LicenseService, UserService} from '../services/index';
import {HttpClientModule} from '@angular/common/http';
import {ClickOutsideModule} from 'ng-click-outside';
import {AnonymousComponent} from './anonymous/anonymous.component';
import {SharedModule} from './shared.module';
import {LocaleService} from '../services/locale.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ErrorComponent} from './error/error.component';
import {PreviewComponent} from './report/print/preview/preview.component';
import { FormsModule }   from '@angular/forms';
import {HomepageComponent} from "./homepage/homepage.component";

@NgModule({
  declarations: [
	HomepageComponent,
    AppComponent,
    AnonymousComponent,
    HomeComponent,
    PreviewComponent  ],
  imports: [ 
	FormsModule,
	HomepageModule,
    ClickOutsideModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
  ],
  exports: [
    ErrorComponent,
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    UserService,
    LocaleService,
    AdminService,
    AnalysisService,
    LicenseService,
    DashboardService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
