import {Component, OnInit} from '@angular/core';
import {Localization} from '../../../localization';

@Component({
  selector: 'app-correlation',
  templateUrl: './correlation.component.html',
  styleUrls: ['./correlation.component.scss']
})
export class CorrelationComponent implements OnInit {

  /**
   * 제목
   */
  title = {list: Localization.pick('연관성 분석 룰 리스트'), edit: Localization.pick('연관성 분석 룰')};

  /**
   * 생성자
   */
  constructor() {}

  /**
   * 초기화
   */
  ngOnInit(): void {
  }
  /**
   * 룰 명 키 업 이벤트 핸들러
   * 룰 명을 cr_로 시작하게 변경 또는
   * @param event
   */
  onKeyUpRuleName(event): void {
    const target = event.currentTarget;
    const value = target.value.replace(/ /g, '');
    if (value.length < 3 || value.substr(0, 3) !== 'cr_') {
      target.value = 'cr_';
    } else {
      target.value = value;
    }
    if (event.key === ' ') {
      event.preventDefault();
    }
  }

}
