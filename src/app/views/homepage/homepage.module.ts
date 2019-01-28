import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgsRevealModule} from 'ng-scrollreveal';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


import {HttpClient, HttpClientModule} from '@angular/common/http';
import {HomeRoutingModule} from './homepage-routing.module';


export function createTranslateLoader(http: HttpClient) {
  // 다국어 파일의 확장자와 경로를 지정
  return new TranslateHttpLoader( http, '../../../assets/i18n/', '.json');
}

@NgModule({
  imports: [
      HomeRoutingModule,
    CommonModule,
    HttpClientModule,
    
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
  exports: [TranslateModule] //번역 모듈을 밖으로 공유해야 가능함.
})
export class HomepageModule { }
