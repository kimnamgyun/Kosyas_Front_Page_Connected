import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {IntelligenceService} from '../../../services';
import { Chart } from 'chart.js';
import {DatePeriodComponent} from '../../../components/date-period/date-period.component';
import {Common} from '../../../utils';

@Component({
  selector: 'app-ioc-status',
  templateUrl: './ioc-status.component.html',
  styleUrls: ['./ioc-status.component.scss']
})
export class IocStatusComponent implements OnInit, AfterViewInit {
  /**
   * 현재 페이지
   */
  page = 1 ;
  /**
   * 총 자료 수
   */
  totalRows = 1;
  /**
   * 표시할 페이지 번호 수
   */
  pageSize = 10;
  /**
   * 페이지당 표시할 행 수
   */
  rowsSize = 20;
  /**
   * 목록
   */
  items: {'time': string, 'start': string, 'end': string}[] = [];

  @ViewChild('dateperiod')
  datePeriod: DatePeriodComponent;
  gte = '';
  lte = '';
  chartUpdateInfo: Chart = [];

  constructor(
    private intelligenceService: IntelligenceService) {}

  ngOnInit() {
    // IOC 업데이트 사항
    this.chartUpdateInfo = new Chart('canvasUpdateInfo', {
      type: 'bar',

      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'time'
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'count'
            }
          }],
        }
      }
    });
  }
  ngAfterViewInit() {
    this.load();
    setInterval(() => {
        this.load();
      },
      3600000);
    // IP대역대 가져오기
    this.getRules(this.page, this.gte, this.lte);
  }
  load() {
    this.gte = this.datePeriod.startDate.getFullYear() + '-' + Common.pad(this.datePeriod.startDate.getMonth() + 1, 2) + '-' + Common.pad(this.datePeriod.startDate.getDate(), 2);
    this.lte = this.datePeriod.endDate.getFullYear() + '-' + Common.pad(this.datePeriod.endDate.getMonth() + 1, 2) + '-' + Common.pad(this.datePeriod.endDate.getDate(), 2);
    // Analysis : Alert Count
    this.intelligenceService.updateInfo(this.gte, this.lte, result => {
      // System.instance.create(result);
      const key = result['data'].map(res => res.key.substring(0, 10));
      const doc_count = result['data'].map(res => res.count);
      this.chartUpdateInfo.data = {
        labels: key,
        datasets: [
          {
            data: doc_count,
            backgroundColor: '#1c93ed',
            fill: true
          },
        ]
      };
      this.chartUpdateInfo.update();
    });
  }

  /**
   * 기간 검색 버튼 이벤트 핸들러
   * @param dates
   */
  onSearch(dates: { startDate: Date, endDate: Date }) {
    this.load();
    // IP대역대 가져오기
    this.getRules(this.page, this.gte, this.lte);
  }
  /**
   * 페이지 이동 이벤트시 호출될
   * @param page
   */
  paginationHandler(page: number): void {
    this.gte = this.datePeriod.startDate.getFullYear() + '-' + Common.pad(this.datePeriod.startDate.getMonth() + 1, 2) + '-' + Common.pad(this.datePeriod.startDate.getDate(), 2);
    this.lte = this.datePeriod.endDate.getFullYear() + '-' + Common.pad(this.datePeriod.endDate.getMonth() + 1, 2) + '-' + Common.pad(this.datePeriod.endDate.getDate(), 2);
    this.getRules(page, this.gte, this.lte);
  }

  /**
   * 룰 목록 요청
   * @param page
   * @param rule
   */
  getRules(page: number = 1, gte: string, lte: string): void {
    this.intelligenceService.ipInfo(page, gte, lte, result => {
      this.page = page;
      this.totalRows = result.data.total;
      this.items = result.data.list;
    });
  }
}
