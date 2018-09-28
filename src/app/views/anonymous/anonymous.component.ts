import { Component, OnInit } from '@angular/core';
import {Localization} from '../../localization';

@Component({
  selector: 'app-anonymous',
  templateUrl: './anonymous.component.html',
  styleUrls: ['./anonymous.component.scss']
})
export class AnonymousComponent implements OnInit {

  /**
   * 언어 설정 메뉴 열림 상태 모델
   */
  openedLanguage = false;
  /**
   * 현재 언어
   */
  get language(): string {
      const matchList = {'ko-KR': 'KOREAN', 'en-US': 'ENGLISH', 'fr-FR': 'FRENCH'};
      return matchList[Localization.instance.language];
  }

  /**
   * 생성자
   */
  constructor() { }

  /**
   * 초기화
   */
  ngOnInit() {
  }
  /**
   * 언어 설정 메뉴 닫기 핸들러
   */
  onClickOutsideLanguage() {
      this.openedLanguage = false;
  }
  /**
   * 언어 설정 메뉴 열림 상태 토글 핸들러
   */
  onToggleLanguage() {
      this.openedLanguage = !this.openedLanguage;
  }
  /**
   * 사용자 언어 설정
   * @param language
   */
  setLanguage(language: string): void {
      Localization.instance.setLanguage(language);
      location.reload();
  }

}
