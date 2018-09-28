import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DashboardService} from '../../../services';
import { Chart } from 'chart.js';
import {Common, Excel} from '../../../utils';
import {DatePeriodComponent} from '../../../components/date-period/date-period.component';
import {Localization} from '../../../localization';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss']
})
export class SystemComponent implements OnInit, AfterViewInit {

    /**
     * 엑셀 제어
     */
    Excel = Excel;
    @ViewChild('dateperiod')
    datePeriod: DatePeriodComponent;
    gte = '';
    lte = '';
    cpu = 0;
    memory = 0;
    cpuTitle = '';
    memoryTitle = '';
    chartTime: Chart = [];
    chartCategory: Chart = [];
    chartDocker: Chart = [];
    dockerCons = [];
    localization = Localization.instance;

    constructor(
        private dashboardService: DashboardService) {}

    ngOnInit() {
        this.chartTime = new Chart('canvasTime', {
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
        this.chartCategory = new Chart('canvasCategory', {
            type: 'doughnut',
            options: {
                responsive: true,
                legend: {
                    display: true,
                    position: 'right',
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
      this.chartDocker = new Chart('canvasDocker', {
        type: 'doughnut',
        options: {
          responsive: true,
          legend: {
            display: true,
            position: 'right',
          },
          animation: {
            animateScale: true,
            animateRotate: true
          }
        }
      });
    }
    ngAfterViewInit() {
      this.load();
      setInterval(() => {
          this.load();
        },
        36000000);
    }

    load() {
        this.gte = this.datePeriod.startDate.getFullYear() + '-' + Common.pad(this.datePeriod.startDate.getMonth() + 1, 2) + '-' + Common.pad(this.datePeriod.startDate.getDate(), 2);
        this.lte = this.datePeriod.endDate.getFullYear() + '-' + Common.pad(this.datePeriod.endDate.getMonth() + 1, 2) + '-' + Common.pad(this.datePeriod.endDate.getDate(), 2);
      // CPU 사용량 탑
      this.dashboardService.cpu(this.gte, this.lte, result => {
        // System.instance.create(result);
        this.cpu = result.data[0].avg_usage.value.toFixed(1);
        this.cpuTitle = result.data[0].key;
      });
      // Memory 사용량 탑
      this.dashboardService.memory(this.gte, this.lte, result => {
        // System.instance.create(result);
        this.memory = result.data[0].avg_usage.value.toFixed(1);
        this.memoryTitle = result.data[0].key;
      });
      // 이벤트 발생
        this.dashboardService.eventPerTime(this.gte, this.lte, result => {
          // System.instance.create(result);
          const key = result['data'].map(res => res.key_as_string.substring(0, 10));
          const doc_count = result['data'].map(res => res.doc_count);
          this.chartTime.data = {
            labels: key,
            datasets: [
              {
                data: doc_count,
                backgroundColor: '#1c93ed',
                fill: true
              },
            ]
          };
          this.chartTime.update();
        });
        // 카테고리별 발생
        this.dashboardService.eventCountPerCategory(this.gte, this.lte, result => {
          // System.instance.create(result);
          const key = result['data'].map(res => res.key);
          const doc_count = result['data'].map(res => res.doc_count);
          this.chartCategory.data = {
            labels: key,
            datasets: [
              {
                data: doc_count,
                backgroundColor: [
                  '#ff5d5d',
                  '#ff9000',
                  '#ffc400',
                  '#c0dc4e',
                  '#76c802',
                  '#77bef4',
                  '#2196f0',
                  '#b39ddb',
                  '#cccccc',
                  '#454545',
                ],
                fill: true
              },
            ]
          };
          this.chartCategory.update();
        });
      // Docker : 호스트 별 컨테이너
      this.dashboardService.dockerConPerHost(this.gte, this.lte, result => {
        // System.instance.create(result);
        const key = result['data'].map(res => res.key);
        const doc_count = result['data'].map(res => res.count);
        this.chartDocker.data = {
          labels: key,
          datasets: [
            {
              data: doc_count,
              backgroundColor: [
                '#ff5d5d',
                '#ff9000',
                '#ffc400',
                '#c0dc4e',
                '#76c802',
                '#77bef4',
                '#2196f0',
                '#b39ddb',
                '#cccccc',
                '#454545',
              ],
              fill: true
            },
          ]
        };
        this.chartDocker.update();
      });

      // 초기화
      this.dockerCons = [];

      // Docker : 컨테이너 정보
      this.dashboardService.dockerCon(this.gte, this.lte, result => {
        for (let i = 0; i < result.data.length; i++) {
          const item = {};
          item[Localization.pick('컨테이너 이름')] = result.data[i].key;
          item[Localization.pick('CPU 사용량')] = result.data[i].cpu;
          item[Localization.pick('Memory 사용량')] = result.data[i].memory;
          item[Localization.pick('컨테이너 수')] = result.data[i].count;
          this.dockerCons.push(item);
        }
      });
  }
    /**
     * 기간 검색 버튼 이벤트 핸들러
     * @param dates
     */
    onSearch(dates: { startDate: Date, endDate: Date }) {
      this.load();
      setInterval(() => {
          this.load();
        },
        36000000);
    }

}
