import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {BaseService} from './base.service';
import {Router} from '@angular/router';

@Injectable()
export class LicenseService extends BaseService {

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
   * 라이선스 정보
   * @param {string}
   * @returns {Observable<Object>}
   */
  licenseInfo(siteId: string, completeCallback, errorCallback = null): void {
    this.requestExternal(`/license/info/${siteId}`, null, completeCallback, errorCallback);
  }

  /**
   * 라이선스 체크
   * @param {string}
   * @returns {Observable<Object>}
   */
  licenseCheck(siteId: string, completeCallback, errorCallback = null): void {
    this.requestExternal(`/license/login/${siteId}`, null, completeCallback, errorCallback);
  }
}
