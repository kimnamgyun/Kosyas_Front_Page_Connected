import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss']
})
export class SortComponent {
  /**
   * 필드명
   */
  @Input()
  fieldName: string;
  /**
   * 정렬할 데이터
   */
  @Input()
  items: object[];
  /**
   * 데이터 변경 이벤트
   */
  @Output()
  itemsChange = new EventEmitter<object[]>();

  /**
   * 생성자
   */
  constructor() {}

  /**
   * 정렬
   * @param direction
   */
  onSort(direction: 'up' | 'down'): void {
    this.items.sort((a, b) => {
      a = a[this.fieldName];
      b = b[this.fieldName];
      if (direction === 'up') {
          return a > b ? -1 : a < b ? 1 : 0;
      } else if (direction === 'down') {
          return a < b ? -1 : a > b ? 1 : 0;
      }
    });
    this.itemsChange.emit(this.items);
  }
}
