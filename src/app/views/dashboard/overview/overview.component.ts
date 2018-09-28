import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DatePeriodComponent} from '../../../components/date-period/date-period.component';
import {DashboardService} from '../../../services';
import { Chart } from 'chart.js';
import {Common} from '../../../utils';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, AfterViewInit {

  @ViewChild('dateperiod')
  datePeriod: DatePeriodComponent;
    gte = '';
    lte = '';
    metricCount = 0;
    lv12Count = 0;
    authFailed = 0;
    authSuccess = 0;
    chartAlertCount: Chart = [];
    chartAlertCountPerTime: Chart = [];
    chartThreatTop5Agent: Chart = [];
    chartThreatAlertCountPerTime: Chart = [];

  constructor(
      private dashboardService: DashboardService) {}

  ngOnInit() {
    // Analysis : Alert Count
      this.chartAlertCount = new Chart('canvasAlertCount', {
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
      // Analysis : Alert Count per Time
      this.chartAlertCountPerTime = new Chart('canvasAlertCountPerTime', {
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
      // Threat intrusion : Top5 Agent
      this.chartThreatTop5Agent = new Chart('canvasThreatTop5Agent', {
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

      // Threat intrusion : Alerts per time
      this.chartThreatAlertCountPerTime = new Chart('canvasThreatAlertCountPerTime', {
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
    }
    load() {
        this.gte = this.datePeriod.startDate.getFullYear() + '-' + Common.pad(this.datePeriod.startDate.getMonth() + 1, 2) + '-' + Common.pad(this.datePeriod.startDate.getDate(), 2);
        this.lte = this.datePeriod.endDate.getFullYear() + '-' + Common.pad(this.datePeriod.endDate.getMonth() + 1, 2) + '-' + Common.pad(this.datePeriod.endDate.getDate(), 2);
        console.log(this.gte);
        // Analysis : Alert Count
        this.dashboardService.analysisAlertCount(this.gte, this.lte, result => {
          // System.instance.create(result);
          const key = [''];
          const doc_count = [result.data.alertCount];
          this.chartAlertCount.data = {
            labels: key,
            datasets: [
              {
                data: doc_count,
                backgroundColor: '#1c93ed',
                fill: true
              },
            ]
          };
          this.chartAlertCount.update();
        });
        // Analysis : Alert Count
        this.dashboardService.analysisAlertCountPerTime(this.gte, this.lte, result => {
          // System.instance.create(result);
          const key = result['data'].map(res => res.key_as_string.substring(0, 10));
          const doc_count = result['data'].map(res => res.doc_count);
          this.chartAlertCountPerTime.data = {
            labels: key,
            datasets: [
              {
                data: doc_count,
                backgroundColor: '#1c93ed',
                fill: true
              },
            ]
          };
          this.chartAlertCountPerTime.update();
        });
        // Threat intrusion : Top5 Agent
        this.dashboardService.threatTop5Agent(this.gte, this.lte, result => {
          // System.instance.create(result);
          const key = result['data'].map(res => res.key);
          const doc_count = result['data'].map(res => res.doc_count);
          this.chartThreatTop5Agent.data = {
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
          this.chartThreatTop5Agent.update();
        });
        // Threat intrusion : Alerts per time
        this.dashboardService.threatAlertCountPerTime(this.gte, this.lte, result => {
          // System.instance.create(result);
          const key = result['data'].map(res => res.key_as_string.substring(0, 10));
          const doc_count = result['data'].map(res => res.doc_count);
          this.chartThreatAlertCountPerTime.data = {
            labels: key,
            datasets: [
              {
                data: doc_count,
                backgroundColor: '#1c93ed',
                fill: true
              },
            ]
          };
          this.chartThreatAlertCountPerTime.update();
        });
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
          // System.instance.create(result);
          this.authSuccess = result.data.count;
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
