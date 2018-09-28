import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {LocaleItem} from '../../../models/locale-item';
import {Localization} from '../../../localization';
import {LocaleService} from '../../../services';
import {Messages} from '../../../properties';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnInit {

  /**
   * 다국어 문자열 배열
   */
  items: Observable<LocaleItem[]>;

  /**
   * 생성자
   * @param localeService
   */
  constructor(private localeService: LocaleService) {}

  /**
   * 초기화
   */
  ngOnInit() {
    this.onSubmit();
    this.items = Localization.instance.data;
  }
  /**
   * 다국어 문자열 저장하기
   */
  onSubmit() {
    this.localeService.extract(result => {
      if (result.success) {
        this.getItems();
        alert(Messages.instance.LocaleSet[result.status]);
      } else {
        alert(result.messageCode);
      }
    });
  }
  /**
   * 다국어 문자열 가져오기
   */
  getItems(): void {
    this.localeService.get(result => {
      if (result.success) {
        // alert(Messages.instance.LocaleGet[result.status]);
        Localization.instance.data = result.data;
      } else {
        alert(result.messageCode);
      }
    });
  }
}
