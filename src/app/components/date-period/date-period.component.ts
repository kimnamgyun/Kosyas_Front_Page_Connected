import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Localization} from '../../localization';

@Component({
  selector: 'app-date-period',
  templateUrl: './date-period.component.html',
  styleUrls: ['./date-period.component.scss'],
})
export class DatePeriodComponent implements OnInit {
  /**
   * 기본 기간 값
   */
  @Input()
  defalutValue = 14;
  /**
   * 기본 기간 단위
   */
  @Input()
  defaultUnit: 'day' | 'month' | 'year' = 'day';
  /**
   * 버튼들 표시 여부
   */
  @Input()
  disabledButtons: boolean;
  /**
   * 검색 버튼 표시 여부
   */
  @Input()
  disabledSearchButton: boolean;
  /**
   * 검색 이벤트
   */
  @Output()
  search: EventEmitter<{startDate: Date, endDate: Date}> = new EventEmitter<{startDate: Date, endDate: Date}>();
  /**
   * 기간 변경 이벤트
   */
  @Output()
  dateChange: EventEmitter<void> = new EventEmitter<void>();

  /**
   * 검색 시작일
   */
  startDate: Date;
  /**
   * 검색 종료일
   */
  endDate: Date;
  /**
   * 기간 버튼 목록
   */
  items: {label: string, value: number, unit: 'day' | 'month' | 'year'}[];

  /**
   * 생성자
   */
  constructor() {}

  /**
   * 초기화
   */
  ngOnInit() {
    this.select(this.defalutValue, this.defaultUnit);
    this.items = [{label: Localization.pick('1일'), value: 1, unit: 'day'},
        {label: Localization.pick('1주'), value: 7, unit: 'day'},
        {label: Localization.pick('2주'), value: 14, unit: 'day'},
        {label: Localization.pick('1개월'), value: 1, unit: 'month'},
        {label: Localization.pick('3개월'), value: 3, unit: 'month'},
        {label: Localization.pick('6개월'), value: 6, unit: 'month'},
        {label: Localization.pick('1년'), value: 1, unit: 'year'}];
  }
  /**
   * 기간 설정 버튼 핸들러
   * @param value
   */
  select(value: number, unit: 'day' | 'month' | 'year'): void {
    this.startDate = new Date();
    this.endDate = new Date();
    if (unit === 'day') {
        this.startDate = new Date(this.startDate.setDate(this.startDate.getDate() - value + 1));
    } else if (unit === 'month') {
        this.startDate = new Date(this.startDate.setMonth(this.startDate.getMonth() - value));
    } else if (unit === 'year') {
        this.startDate = new Date(this.startDate.setFullYear(this.startDate.getFullYear() - value));
    }
    this.dateChange.emit();
  }
  /**
   * 현재 선택된 기간이 해당 일 수 인지 여부 반환
   * @param value
   */
  isActive(value: number, unit: 'day' | 'month' | 'year'): boolean {
    if (!this.startDate || !this.endDate) {
      return false;
    }
    const datePipe: DatePipe = new DatePipe('en-US');
    const format = 'yyyyMMdd';
    const today: string = datePipe.transform(new Date(), format);
    let startDate: string;
    if (unit === 'day') {
        startDate = datePipe.transform(new Date(new Date().setDate(this.endDate.getDate() - value + 1)), format);
    } else if (unit === 'month') {
        startDate = datePipe.transform(new Date(new Date().setMonth(this.endDate.getMonth() - value)), format);
    } else if (unit === 'year') {
        startDate = datePipe.transform(new Date(new Date().setFullYear(this.endDate.getFullYear() - value)), format);
    }
    const endDate: string = datePipe.transform(this.endDate, format);
    // console.log(endDate === today && startDate === endDate);
    return endDate === today && startDate === datePipe.transform(this.startDate, format);
  }
  /**
   * 검색 시작일 변경 핸들러
   * @param event
   */
  onStartDateChange(event) {
    this.startDate = event.value;
    this.dateChange.emit();
  }
  /**
   * 검색 종료일 변경 핸들러
   * @param event
   */
  onEndDateChange(event) {
    this.endDate = event.value;
    this.dateChange.emit();
  }
  /**
   * 검색 버튼 핸들러
   */
  onSearch() {
    this.search.emit({startDate: this.startDate, endDate: this.endDate});
  }
}
