import {Component, OnInit, ViewChild} from '@angular/core';
import {DatePeriodComponent} from '../../../components/date-period/date-period.component';
import {Common} from '../../../utils';

@Component({
  selector: 'app-manage',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit {

  @ViewChild('dateperiod')
  datePeriod: DatePeriodComponent;
  gte = '';
  lte = '';
  constructor() { }

  ngOnInit() {
  }

  openPop(param: string) {
    this.gte = this.datePeriod.startDate.getFullYear() + '-' + Common.pad(this.datePeriod.startDate.getMonth() + 1, 2) + '-' + Common.pad(this.datePeriod.startDate.getDate(), 2);
    this.lte = this.datePeriod.endDate.getFullYear() + '-' + Common.pad(this.datePeriod.endDate.getMonth() + 1, 2) + '-' + Common.pad(this.datePeriod.endDate.getDate(), 2);
    window.open('/preview/' + param + '?gte=' + this.gte + '&lte=' + this.lte, '_blank', 'menubar=no,location=no,resizable=no,scrollbars=yes,status=no,width=600');
  }

  /**
   * 기간 검색 버튼 이벤트 핸들러
   * @param dates
   */
  onSearch(dates: { startDate: Date, endDate: Date }) {
    this.gte = this.datePeriod.startDate.getFullYear() + '-' + Common.pad(this.datePeriod.startDate.getMonth() + 1, 2) + '-' + Common.pad(this.datePeriod.startDate.getDate(), 2);
    this.lte = this.datePeriod.endDate.getFullYear() + '-' + Common.pad(this.datePeriod.endDate.getMonth() + 1, 2) + '-' + Common.pad(this.datePeriod.endDate.getDate(), 2);
    console.log(this.gte);
    console.log(this.lte);
  }

}
