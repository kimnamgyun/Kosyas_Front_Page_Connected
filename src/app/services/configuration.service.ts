import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {BaseService} from './base.service';
import {Router} from '@angular/router';

@Injectable()
export class ConfigurationService extends BaseService {

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
   * 운영관리 : 시스템 상태
   * @param {}
   * @returns {Observable<Object>}
   */
  overview(completeCallback, errorCallback = null): void {
    this.requestExternal('/cats/overview', null, completeCallback, errorCallback);
  }
  /**
   * 운영관리 : 인덱스 리스트
   * @param {}
   * @returns {Observable<Object>}
   */
  indexList(completeCallback, errorCallback = null): void {
    this.requestExternal('/es/index/list', null, completeCallback, errorCallback);
  }
  /**
   * 운영관리 : 인덱스 확인
   * @param {string}
   * @returns {Observable<Object>}
   */
  indexExist(indexName: string, completeCallback, errorCallback = null): void {
    this.requestExternal(`/es/index/exist/${indexName}`, null, completeCallback, errorCallback);
  }
  /**
   * 운영관리 : 인덱스 삭제
   * @param {string}
   * @returns {Observable<Object>}
   */
  indexDelete(indexName: string, completeCallback, errorCallback = null): void {
    this.requestExternal(`/es/index/delete/${indexName}`, null, completeCallback, errorCallback);
  }

  /**
   * 에이전트관리 : 에이전트 매니저 리스트
   * @param {}
   * @returns {Observable<Object>}
   */
  agentManagerList(completeCallback, errorCallback = null): void {
    this.requestExternal('/wazuh/manager/info', null, completeCallback, errorCallback);
  }
  /**
   * 에이전트관리 : 에이전트 리스트
   * @param {}
   * @returns {Observable<Object>}
   */
  agentList(completeCallback, errorCallback = null): void {
    this.requestExternal('/wazuh/agents', null, completeCallback, errorCallback);
  }
}
