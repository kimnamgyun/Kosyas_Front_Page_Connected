import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  /**
   * 이전 페이지 주소
   */
  returnUrl: string;

  /**
   * 생성자
   * @param location
   */
  constructor(
    private location: Location,
  ) {}

  /**
   * 초기화
   */
  ngOnInit() {
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.location.back();
  }

}
