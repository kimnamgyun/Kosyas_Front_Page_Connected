import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {BaseService} from './base.service';
import {Router} from '@angular/router';


@Injectable()
export class DashboardService extends BaseService {
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
   * 개요 -  Analysis : Alert Count
   * @param {string, string}
   * @returns {Observable<Object>}
   */
  analysisAlertCount(gte: string, lte: string, completeCallback, errorCallback = null): void {
    this.requestExternal('/dashboard/overview/analysisAlertCount', {gte: gte + this.startTimeText, lte: lte + this.endTimeText}, completeCallback, errorCallback);
  }
  /**
   * 개요 -  Analysis : Alert Count per Time
   * @param {string, string}
   * @returns {Observable<Object>}
   */
  analysisAlertCountPerTime(gte: string, lte: string, completeCallback, errorCallback = null): void {
    this.requestExternal('/dashboard/overview/analysisAlertCountPerTime', {gte: gte + this.startTimeText, lte: lte + this.endTimeText}, completeCallback, errorCallback);
  }
  /**
   * 개요 -  Threat intrusion : Top5 Agent
   * @param {string, string}
   * @returns {Observable<Object>}
   */
  threatTop5Agent(gte: string, lte: string, completeCallback, errorCallback = null): void {
    this.requestExternal('/dashboard/overview/threatTop5Agent', {gte: gte + this.startTimeText, lte: lte + this.endTimeText}, completeCallback, errorCallback);
  }
  /**
   * 개요 -  Threat intrusion : Alerts per time
   * @param {string, string}
   * @returns {Observable<Object>}
   */
  threatAlertCountPerTime(gte: string, lte: string, completeCallback, errorCallback = null): void {
    this.requestExternal('/dashboard/overview/threatAlertCountPerTime', {gte: gte + this.startTimeText, lte: lte + this.endTimeText}, completeCallback, errorCallback);
  }

  /**
   * 침입탐지 -  Metric 알림
   * @param {string, string}
   * @returns {Observable<Object>}
   */
  metricCount(gte: string, lte: string, completeCallback, errorCallback = null): void {
    this.requestExternal('/dashboard/intrusion/metricCount', {gte: gte + this.startTimeText, lte: lte + this.endTimeText}, completeCallback, errorCallback);
  }
  /**
   * 침입탐지 - 12레벨 알림
   * @param {string, string}
   * @returns {Observable<Object>}
   */
  lv12Count(gte: string, lte: string, completeCallback, errorCallback = null): void {
    this.requestExternal('/dashboard/intrusion/lv12Count', {gte: gte + this.startTimeText, lte: lte + this.endTimeText}, completeCallback, errorCallback);
  }
  /**
   * 침입탐지 - 인증 실패
   * @param {string, string}
   * @returns {Observable<Object>}
   */
  authFailed(gte: string, lte: string, completeCallback, errorCallback = null): void {
    this.requestExternal('/dashboard/intrusion/authFailed', {gte: gte + this.startTimeText, lte: lte + this.endTimeText}, completeCallback, errorCallback);
  }
  /**
   * 침입탐지 - 인증 성공
   * @param {string, string}
   * @returns {Observable<Object>}
   */
  authSuccess(gte: string, lte: string, completeCallback, errorCallback = null): void {
    this.requestExternal('/dashboard/intrusion/authSuccess', {gte: gte + this.startTimeText, lte: lte + this.endTimeText}, completeCallback, errorCallback);
  }
  /**
   * 침입탐지 - 매니저별 전체 알람
   * @param {string, string}
   * @returns {Observable<Object>}
   */
  alertPerManager(gte: string, lte: string, completeCallback, errorCallback = null): void {
    this.requestExternal('/dashboard/intrusion/alertPerManager', {gte: gte + this.startTimeText, lte: lte + this.endTimeText}, completeCallback, errorCallback);
  }
  /**
   * 침입탐지 - 시그니처 별 침입탐지 로그
   * @param {string, string}
   * @returns {Observable<Object>}
   */
  alertPerSignature(gte: string, lte: string, completeCallback, errorCallback = null): void {
    this.requestExternal('/dashboard/intrusion/alertPerSignature', {gte: gte + this.startTimeText, lte: lte + this.endTimeText}, completeCallback, errorCallback);
  }
  /**
   * 침입탐지 - 일반항목 침입탐지
   * @param {string, string}
   * @returns {Observable<Object>}
   */
  threatBasic(gte: string, lte: string, completeCallback, errorCallback = null): void {
    this.requestExternal('/dashboard/intrusion/threatBasic', {gte: gte + this.startTimeText, lte: lte + this.endTimeText}, completeCallback, errorCallback);
  }
  /**
   * 침입탐지 - 파일 무결성 침입탐지
   * @param {string, string}
   * @returns {Observable<Object>}
   */
  threatFile(gte: string, lte: string, completeCallback, errorCallback = null): void {
    this.requestExternal('/dashboard/intrusion/threatFile', {gte: gte + this.startTimeText, lte: lte + this.endTimeText}, completeCallback, errorCallback);
  }
  /**
   * 침입탐지 - 에이전트 별 침입탐지
   * @param {string, string}
   * @returns {Observable<Object>}
   */
  threatAgent(gte: string, lte: string, completeCallback, errorCallback = null): void {
    this.requestExternal('/dashboard/intrusion/threatAgent', {gte: gte + this.startTimeText, lte: lte + this.endTimeText}, completeCallback, errorCallback);
  }
  /**
   * 취약점 - 위험항목 : 전체
   * @param {string, string}
   * @returns {Observable<Object>}
   */
  countAll(gte: string, lte: string, completeCallback, errorCallback = null): void {
    this.requestExternal('/dashboard/vuln/countAll', {gte: gte + this.startTimeText, lte: lte + this.endTimeText}, completeCallback, errorCallback);
  }
  /**
   * 취약점 - 위험항목 : 치명적
   * @param {string, string}
   * @returns {Observable<Object>}
   */
  countCritical(gte: string, lte: string, completeCallback, errorCallback = null): void {
    this.requestExternal('/dashboard/vuln/countCritical', {gte: gte + this.startTimeText, lte: lte + this.endTimeText}, completeCallback, errorCallback);
  }
  /**
   * 취약점 - 호스트 별 취약점 개수
   * @param {string, string}
   * @returns {Observable<Object>}
   */
  countPerHost(gte: string, lte: string, completeCallback, errorCallback = null): void {
    this.requestExternal('/dashboard/vuln/countPerHost', {gte: gte + this.startTimeText, lte: lte + this.endTimeText}, completeCallback, errorCallback);
  }
  /**
   * 취약점 - 타겟 별 취약점 개수
   * @param {string, string}
   * @returns {Observable<Object>}
   */
  countPerVulnHost(gte: string, lte: string, completeCallback, errorCallback = null): void {
    this.requestExternal('/dashboard/vuln/countPerVulnHost', {gte: gte + this.startTimeText, lte: lte + this.endTimeText}, completeCallback, errorCallback);
  }
  /**
   * 취약점 - 포트 별 취약점 개수
   * @param {string, string}
   * @returns {Observable<Object>}
   */
  countPerVulnPort(gte: string, lte: string, completeCallback, errorCallback = null): void {
    this.requestExternal('/dashboard/vuln/countPerVulnPort', {gte: gte + this.startTimeText, lte: lte + this.endTimeText}, completeCallback, errorCallback);
  }
  /**
   * 취약점 - 등급 별 취약점 개수
   * @param {string, string}
   * @returns {Observable<Object>}
   */
  countPerVulnThreat(gte: string, lte: string, completeCallback, errorCallback = null): void {
    this.requestExternal('/dashboard/vuln/countPerVulnThreat', {gte: gte + this.startTimeText, lte: lte + this.endTimeText}, completeCallback, errorCallback);
  }
  /**
   * 취약점 - NVT 별 취약점 개수
   * @param {string, string}
   * @returns {Observable<Object>}
   */
  countPerVulnNVT(gte: string, lte: string, completeCallback, errorCallback = null): void {
    this.requestExternal('/dashboard/vuln/countPerVulnNVT', {gte: gte + this.startTimeText, lte: lte + this.endTimeText}, completeCallback, errorCallback);
  }
  /**
   * 취약점 - CVE 별 취약점 개수
   * @param {string, string}
   * @returns {Observable<Object>}
   */
  countPerCVE(gte: string, lte: string, completeCallback, errorCallback = null): void {
    this.requestExternal('/dashboard/vuln/countPerCVE', {gte: gte + this.startTimeText, lte: lte + this.endTimeText}, completeCallback, errorCallback);
  }
  /**
   * 취약점 - 취약점 이름 별 개수
   * @param {string, string}
   * @returns {Observable<Object>}
   */
  countPerVulnName(gte: string, lte: string, completeCallback, errorCallback = null): void {
    this.requestExternal('/dashboard/vuln/countPerVulnName', {gte: gte + this.startTimeText, lte: lte + this.endTimeText}, completeCallback, errorCallback);
  }
  /**
   * 시스템 - CPU 사용량 탑
   * @param {string, string}
   * @returns {Observable<Object>}
   */
  cpu(gte: string, lte: string, completeCallback, errorCallback = null): void {
    this.requestExternal('/dashboard/system/cpu', {gte: gte + this.startTimeText, lte: lte + this.endTimeText}, completeCallback, errorCallback);
  }
  /**
   * 시스템 - Memory 사용량 탑
   * @param {string, string}
   * @returns {Observable<Object>}
   */
  memory(gte: string, lte: string, completeCallback, errorCallback = null): void {
    this.requestExternal('/dashboard/system/memory', {gte: gte + this.startTimeText, lte: lte + this.endTimeText}, completeCallback, errorCallback);
  }
  /**
   * 시스템 - 이벤트 알람
   * @param {string, string}
   * @returns {Observable<Object>}
   */
  eventPerTime(gte: string, lte: string, completeCallback, errorCallback = null): void {
    this.requestExternal('/dashboard/system/eventPerTime', {gte: gte + this.startTimeText, lte: lte + this.endTimeText}, completeCallback, errorCallback);
  }
  /**
   * 시스템 - 카테고리 별 이벤트 발생
   * @param {string, string}
   * @returns {Observable<Object>}
   */
  eventCountPerCategory(gte: string, lte: string, completeCallback, errorCallback = null): void {
    this.requestExternal('/dashboard/system/eventCountPerCategory', {gte: gte + this.startTimeText, lte: lte + this.endTimeText}, completeCallback, errorCallback);
  }
  /**
   * 시스템 - Docker : 호스트 별 컨테이너
   * @param {string, string}
   * @returns {Observable<Object>}
   */
  dockerConPerHost(gte: string, lte: string, completeCallback, errorCallback = null): void {
    this.requestExternal('/dashboard/system/dockerConPerHost', {gte: gte + this.startTimeText, lte: lte + this.endTimeText}, completeCallback, errorCallback);
  }
  /**
   * 시스템 - Docker : 컨테이너 정보
   * @param {string, string}
   * @returns {Observable<Object>}
   */
  dockerCon(gte: string, lte: string, completeCallback, errorCallback = null): void {
    this.requestExternal('/dashboard/system/dockerCon', {gte: gte + this.startTimeText, lte: lte + this.endTimeText}, completeCallback, errorCallback);
  }
  /**
   * 전체로그 - 챠트
   * @param {string, string, string}
   * @returns {Observable<Object>}
   */
  fullLogChart(gte: string, lte: string, period: string, completeCallback, errorCallback = null): void {
    this.requestExternal('/dashboard/fullLog/chart', {gte: gte + this.startTimeText, lte: lte + this.endTimeText, period : period}, completeCallback, errorCallback);
  }
  /**
   * 전체로그 - 리스트
   * @param {string, string, number}
   * @returns {Observable<Object>}
   */
  fullLogList(gte: string, lte: string, page: number, completeCallback, errorCallback = null): void {
    this.requestExternal('/dashboard/fullLog/text', {gte: gte + this.startTimeText, lte: lte + this.endTimeText, page : page}, completeCallback, errorCallback);
  }
}
