import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {AdminService, DashboardService} from '../../../services';
import { Chart } from 'chart.js';
import {Observable} from 'rxjs';
import {DatePeriodComponent} from '../../../components/date-period/date-period.component';
import {Common} from '../../../utils';
import {Messages, SystemSeq} from '../../../properties';
import {FindPw} from '../../../properties/user.enum';

@Component({
  selector: 'app-full-logs',
  templateUrl: './full-logs.component.html',
  styleUrls: ['./full-logs.component.scss']
})
export class FullLogsComponent implements OnInit, AfterViewInit {
    /**
     * 엑셀 제어
     */
    // Excel = Excel;
    /**
     * 바 차트
     */
    chart: Chart = []; // This will hold our chart info

    @ViewChild('dateperiod')
    datePeriod: DatePeriodComponent;

    gte = '';
    lte = '';
    page = 0;
    items: Observable<{'_index': string, '_source': Object}>[];

    data = {url: ''};
    seq = SystemSeq.KIBANA;

    constructor(
        private dashboardService: DashboardService,
        private adminService: AdminService) {}

    ngOnInit() {
        this.chart = new Chart('canvas', {
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
      this.getUrl();
    }

    ngAfterViewInit() {
      this.load();
      setInterval(() => {
          this.load();
        },
        3600000);
      this.getFullLogList();
    }

    /**
     *
     */
    load() {
        this.gte = this.datePeriod.startDate.getFullYear() + '-' + Common.pad(this.datePeriod.startDate.getMonth() + 1, 2) + '-' + Common.pad(this.datePeriod.startDate.getDate(), 2);
        this.lte = this.datePeriod.endDate.getFullYear() + '-' + Common.pad(this.datePeriod.endDate.getMonth() + 1, 2) + '-' + Common.pad(this.datePeriod.endDate.getDate(), 2);
        // 시간별 전체로그
        this.dashboardService.eventPerTime(this.gte, this.lte, result => {
          // System.instance.create(result);
          const key = result['data'].map(res => res.key_as_string.substring(0, 10));
          const doc_count = result['data'].map(res => res.doc_count);
          this.chart.data = {
            labels: key,
            datasets: [
              {
                data: doc_count,
                backgroundColor: '#1c93ed',
                fill: true
              },
            ]
          };
          this.chart.update();
        });
    }
    getFullLogList() {
    // 시간별 전체 로그
    this.dashboardService.fullLogList(this.gte, this.lte, this.page, result => {
      // System.instance.create(result);
      if (this.items) {
        this.items = this.items.concat(result.data);
      } else {
        this.items = result.data;
      }
    });
}
    getKeys(item: object): string[] {
        return Object.keys(item);
    }

    @HostListener('document:scroll', ['$event'])
    scrollHandler(event: any) {
        // console.log('scroll event');
        const pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
        const max = document.documentElement.scrollHeight;
        // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
        // console.log('pos : ' + pos + '// max : ' + max);
        if (pos === max)   {
            // Do your action here
            this.page = this.page + 1;
            // console.log('page : ' + this.page);
            this.getFullLogList();
        }
    }
    /**
     * 기간 검색 버튼 이벤트 핸들러
     * @param dates
     */
    onSearch(dates: { startDate: Date, endDate: Date }) {
        this.page = 0;
        this.items = null;
        this.load();
        this.getFullLogList();
    }
    /**
    * 시스템 링크 url 조회
    * @param
    */
    getUrl() {
      this.adminService.systemSelect(this.seq, result => {
        if (result.success) {
          this.data = result.data;
        }
    });
}

}
