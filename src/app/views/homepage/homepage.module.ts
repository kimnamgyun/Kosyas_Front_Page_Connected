import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgsRevealModule} from 'ng-scrollreveal';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {HomeRoutingModule} from './homepage-routing.module';


export function createTranslateLoader(http: HttpClient) {
  // �ٱ��� ������ Ȯ���ڿ� ��θ� ����
  return new TranslateHttpLoader( http, '../../../assets/i18n/', '.json');
}

@NgModule({
  imports: [
      HomeRoutingModule,
    CommonModule,
    HttpClientModule,
      ScrollToModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })  ,
	NgsRevealModule.forRoot(),   
],
  declarations: [],
  exports: [TranslateModule,
      ScrollToModule] //���� ����� ������ �����ؾ� ������.
})
export class HomepageModule { }
