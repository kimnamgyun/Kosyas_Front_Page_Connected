import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DashboardService} from '../../../../../services';
import {ActivatedRoute} from '@angular/router';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-full-logs',
  templateUrl: './full-logs.component.html',
  styleUrls: ['../styles.scss']
})
export class FullLogsComponent implements OnInit, AfterViewInit {

  gte = '';
  lte = '';
  /**
   * 바 차트
   */
  chart: Chart = []; // This will hold our chart info

  constructor(
    private dashboardService: DashboardService,
    private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.gte = params['gte'];
      this.lte = params['lte'];
    });
  }

  ngOnInit() {
    this.chart = new Chart('canvas', {
      type: 'bar',
      options: {
        animation: {
          onComplete: function(animation) {
            window.print();
          }
        },
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
  }

  load() {
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
}
