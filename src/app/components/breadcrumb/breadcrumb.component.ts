import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  parentSnapshot: ActivatedRouteSnapshot;
  snapshot: ActivatedRouteSnapshot;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.snapshot = this.activatedRoute.snapshot;
    this.parentSnapshot = this.snapshot.parent;
  }

}
