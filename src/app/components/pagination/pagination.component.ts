import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {min} from 'rxjs/operators';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  /**
   * 현재 페이지
   */
  get page(): number {
    return this._page;
  }
  @Input()
  set page(value: number) {
    this._page = value;
    this.ngOnInit();
  }
  private _page: number;
  /**
   * 표시할 페이지 버튼 수
   */
  @Input()
  pageSize: number;
  /**
   * 한 페이지 당 표시될 행 수
   */
  @Input()
  rowsSize: number;
  /**
   * 총 자료 수
   */
  get totalRows(): number {
    return this._totalRows;
  }
  @Input()
  set totalRows(value: number) {
    this._totalRows = value;
    this.ngOnInit();
  }
  private _totalRows;

  /**
   * 페이지 이동 이벤트
   */
  @Output()
  changePage: EventEmitter<number> = new EventEmitter<number>();
  /**
   * 페이지 번호 배열
   */
  pages: number[];
  first: number;
  prev: number;
  next: number;
  last: number;
  /**
   * 생성자
   */
  constructor() { }

  /**
   * 초기화
   */
  ngOnInit() {
    // 총 페이지 수
    const total: number = Math.ceil(this.totalRows / this.rowsSize);
    // 보여줄 첫 페이지
    const first: number = this.page - (this.page % this.pageSize === 0 ? this.pageSize : this.page % this.pageSize) + 1;
    // 보여줄 끝 페이지
    const last: number = Math.min(first + this.pageSize - 1, total);

    this.pages = [];
    for (let i = first; i <= last; i++) {
      this.pages.push(i);
    }

    this.first = first > 1 ? 1 : 0;
    this.prev = first > 1 ? first - this.pageSize : 0;

    this.next = last < total ? last + 1 : 0;
    this.last = last < total ? total - (total % this.pageSize) + 1 : 0;
  }
  /**
   * 페이지 이동
   * @param page
   */
  navigate(page: number): void {
    if (page !== this.page) {
        this.changePage.emit(page);
    }
  }

}
