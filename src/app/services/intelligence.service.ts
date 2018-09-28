import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {BaseService} from './base.service';
import {Router} from '@angular/router';


@Injectable()
export class IntelligenceService extends BaseService {
  private startTimeText = 'T00:00:00.000Z';
  private endTimeText = 'T23:59:59.999Z';
  /**
   * 생성자
   * @param http
   * @param router
   */
  constructor(
    protected http: HttpClient,
    protected router: Router,
  ) {
    super(http, router);
  }

  /**
   * IOC 업데이트 사항
   * @param {string, string}
   * @returns {Observable<Object>}
   */
  updateInfo(gte: string, lte: string, completeCallback, errorCallback = null): void {
    this.requestExternal('/ioc/updateInfo', {gte: gte + this.startTimeText, lte: lte + this.endTimeText}, completeCallback, errorCallback);
  }
  /**
   * 위험 IP 대역대
   * @param {string, string}
   * @returns {Observable<Object>}
   */
  ipInfo(page: number, gte: string, lte: string, completeCallback, errorCallback = null): void {
    this.requestExternal(`/ioc/ipInfo/${page}`, {gte: gte + this.startTimeText, lte: lte + this.endTimeText}, completeCallback, errorCallback);
  }

}
