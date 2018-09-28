import { Component } from '@angular/core';
import {Localization} from '../localization';
import {LocaleService} from '../services/locale.service';
import {Messages, SystemSeq} from '../properties';
import {AdminService} from '../services';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private adminService: AdminService,
    private localeService: LocaleService,
  ) {
    this.load();
  }

  /**
   * 언어별 문자열 설정 파일을 로드한다.
   */
  private load(): void {
    this.initEnvironment();
    this.initLanguage();
  }
  /**
   * 환경변수 초기화
   */
  private initEnvironment(): void {
    this.adminService.systemSelect(SystemSeq.SYSTEM, result => {
      if (result.success) {
        environment.elasticBasecUrl = result.data.url;
      }
    });
  }
  /**
   * 다국어 언어 설정 초기화
   */
  private initLanguage(): void {
    const language: string = Localization.instance.language;
    // console.log(language);
    this.localeService.get(result => {
      // console.log(JSON.stringify(result.data));
      if (result.success) {
        console.log(result.data);
        Localization.instance.data = result.data;
        if (Messages.instance) {}; // Init Singletone Instance
      } else {
        alert(result.messageCode);
      }
    });
  }

}
