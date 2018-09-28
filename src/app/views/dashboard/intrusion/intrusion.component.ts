import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DashboardService} from '../../../services';
import { Chart } from 'chart.js';
import {Common, Excel} from '../../../utils';
import {DatePeriodComponent} from '../../../components/date-period/date-period.component';
import {Localization} from '../../../localization';

@Component({
  selector: 'app-intrusion',
  templateUrl: './intrusion.component.html',
  styleUrls: ['./intrusion.component.scss']
})
export class IntrusionComponent implements OnInit, AfterViewInit {

    /**
     * 엑셀 제어
     */
    Excel = Excel;
    @ViewChild('dateperiod')
    datePeriod: DatePeriodComponent;
    gte = '';
    lte = '';
    metricCount = 0;
    lv12Count = 0;
    authFailed = 0;
    authSuccess = 0;
    chartPerManager: Chart = [];
    chartPerSignature: Chart = [];
    threatBasics = [];
    threatFiles = [];
    threatAgents = [];
    localization = Localization.instance;

    constructor(
        private dashboardService: DashboardService) {}

    ngOnInit() {
        // 매니저별 전체 알람
        this.chartPerManager = new Chart('canvasPerManager', {
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
        // 시그니처 별 침입탐지 로그
        this.chartPerSignature = new Chart('canvasPerSignature', {
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
        3600000);
    }

    load() {
        this.gte = this.datePeriod.startDate.getFullYear() + '-' + Common.pad(this.datePeriod.startDate.getMonth() + 1, 2) + '-' + Common.pad(this.datePeriod.startDate.getDate(), 2);
        this.lte = this.datePeriod.endDate.getFullYear() + '-' + Common.pad(this.datePeriod.endDate.getMonth() + 1, 2) + '-' + Common.pad(this.datePeriod.endDate.getDate(), 2);
        console.log(this.gte);
      // Metric 알림
      this.dashboardService.metricCount(this.gte, this.lte, result => {
        // System.instance.create(result);
        this.metricCount = result.data.count;
      });
      // 12레벨 알림
      this.dashboardService.lv12Count(this.gte, this.lte, result => {
        // System.instance.create(result);
        this.lv12Count = result.data.count;
      });
      // 인증 실패
      this.dashboardService.authFailed(this.gte, this.lte, result => {
        // System.instance.create(result);
        this.authFailed = result.data.count;
      });
      // 인증 성공
      this.dashboardService.authSuccess(this.gte, this.lte, result => {
        this.authSuccess = result.data.count;
      });
        // 매니저별 전체 알람
        this.dashboardService.alertPerManager(this.gte, this.lte, result => {
          const key = result['data'].map(res => res.key);
          const doc_count = result['data'].map(res => res.doc_count);
          this.chartPerManager.data = {
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
          this.chartPerManager.update();
        });
        // 시그니처 별 침입탐지 로그
        this.dashboardService.alertPerSignature(this.gte, this.lte, result => {
          const key = result['data'].map(res => res.key);
          const doc_count = result['data'].map(res => res.doc_count);
          this.chartPerSignature.data = {
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
          this.chartPerSignature.update();
        });
        // 초기화
        this.threatBasics = [];
        this.threatFiles = [];
        this.threatAgents = [];

      // 일반항목 침입탐지
        this.dashboardService.threatBasic(this.gte, this.lte, result => {
          for (let i = 0; i < result.data.length; i++) {
            const item = {};
            item[Localization.pick('규칙 ID')] = result.data[i].id;
            item[Localization.pick('설명')] = result.data[i].description;
            item[Localization.pick('알람 레벨')] = result.data[i].level;
            item[Localization.pick('개수')] = result.data[i].count;
            this.threatBasics.push(item);
          }
        });
        // 파일 무결성 침입탐지
        this.dashboardService.threatFile(this.gte, this.lte, result => {
          for (let i = 0; i < result.data.length; i++) {
            const item = {};
            item[Localization.pick('규칙 ID')] = result.data[i].id;
            item[Localization.pick('설명')] = result.data[i].description;
            item[Localization.pick('알람 레벨')] = result.data[i].level;
            item[Localization.pick('개수')] = result.data[i].count;
            this.threatFiles.push(item);
          }
        });
        // 에이전트 별 침입탐지
        this.dashboardService.threatAgent(this.gte, this.lte, result => {
          for (let i = 0; i < result.data.length; i++) {
            const item = {};
            item[Localization.pick('규칙 ID')] = result.data[i].id;
            item[Localization.pick('설명')] = result.data[i].description;
            item[Localization.pick('알람 레벨')] = result.data[i].level;
            item[Localization.pick('개수')] = result.data[i].count;
            this.threatAgents.push(item);
          }
        });
  }
    /**
     * 기간 검색 버튼 이벤트 핸들러
     * @param dates
     */
    onSearch(dates: { startDate: Date, endDate: Date }) {
      this.load();
    }

}
