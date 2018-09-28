import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-cover',
  templateUrl: './cover.component.html',
  styleUrls: ['../styles.scss']
})
export class CoverComponent implements OnInit, AfterViewInit {

  gte: string;
  lte: string;
  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.gte = params['gte'];
      this.lte = params['lte'];
    });
  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    window.print();
  }


}
