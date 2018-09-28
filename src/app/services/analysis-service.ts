import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {HttpClient} from '../../../node_modules/@angular/common/http';
import {Router} from '@angular/router';

@Injectable()
export class AnalysisService extends BaseService {

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
   * 룰 목록
   * @param cr                : 연관성 분석 여부 (yes | no)
   * @param page              : 페이지
   * @param rule              : 검색 룰 명
   * @param completeCallback  : 완료 콜백
   * @param errorCallback     : 에러 콜백
   */
  getRules(cr: 'yes' | 'no', page: number, rule: string, completeCallback, errorCallback = null): void {
    this.requestExternal(`/ea/rules/${cr}/${page}/${rule}`, null, completeCallback, errorCallback);
  }
  /**
   * 룰 정보
   * @param rule
   * @param completeCallback
   * @param errorCallback
   */
  getRule(rule: string, completeCallback, errorCallback = null): void {
    this.requestExternal(`/ea/rules/${rule}`, null, completeCallback, errorCallback);
  }
  /**
   * 룰 등록/수정
   * @param rule
   * @param completeCallback
   * @param errorCallback
   */
  setRule(rule: string, data: string, completeCallback, errorCallback = null): void {
    this.requestExternalPost(`/ea/rules/${rule}`, {data: data}, completeCallback, errorCallback);
  }
  /**
   * 룰 삭제
   * @param rule
   * @param completeCallback
   * @param errorCallback
   */
  deleteRule(rule: string, completeCallback, errorCallback = null): void {
    this.requestExternal(`/ea/rulesDel/${rule}`, null, completeCallback, errorCallback);
  }
  /**
   * 필드 목록
   * @param index
   * @param completeCallback
   * @param errorCallback
   */
  getFields(index: string, completeCallback, errorCallback = null): void {
    this.requestExternal(`/es/fields/${index}`, null, completeCallback, errorCallback);
  }
  /**
   * 룰 명 중복 검사
   * @param rule
   * @param completeCallback
   * @param errorCallback
   */
  checkDuplication(rule: string, completeCallback, errorCallback = null): void {
    this.requestExternal(`/ea/rulecheck/${rule}`, null, completeCallback, errorCallback);
  }
  /**
   * 인덱스 사용가능 여부 검사
   * @param index
   * @param completeCallback
   * @param errorCallback
   */
  checkIndex(index: string, completeCallback, errorCallback = null): void {
    this.requestExternal(`/es/index/exist/${index}`, null, completeCallback, errorCallback);
  }
  /**
   * 사용자 알람 목록 요청
   * @param rule
   * @param completeCallback
   * @param errorCallback
   */
  getOwners(rule: string, completeCallback, errorCallback = null): void {
    this.request(`/analysis/alarm/owners`, {token: this.token, name: rule}, completeCallback, errorCallback);
  }
  /**
   * 사용자 목록 요청
   * @param rule
   * @param keyword
   * @param completeCallback
   * @param errorCallback
   */
  getUsers(rule: string, keyword: string, completeCallback, errorCallback = null): void {
    this.request(`/analysis/alarm/users`, {token: this.token, name: rule, keyword: keyword}, completeCallback, errorCallback);
  }
  /**
   * 사용자 알람 갱신
   * @param rule
   * @param owners
   * @param completeCallback
   * @param errorCallback
   */
  setOwners(rule: string, owners: {seq: number, id: string, lvl: number, status: string, email: boolean, web: boolean}[], completeCallback, errorCallback = null): void {
    this.request(`/analysis/alarm/update`, {token: this.token, name: rule, users: owners}, completeCallback, errorCallback);
  }
  /**
   * 알람 정보 요청
   * @param seq
   * @param completeCallback
   * @param errorCallback
   */
  getAlarm(seq: number, completeCallback, errorCallback = null): void {
    this.request(`/analysis/alarm/alarm`, {token: this.token, seq: seq}, completeCallback, errorCallback);
  }

}
