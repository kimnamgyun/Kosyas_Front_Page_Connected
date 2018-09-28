import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {HttpClient} from '../../../node_modules/@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable()
export class AdminService extends BaseService {

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
   * 사용자 관리
   * @param {string}
   * @returns {Observable<Object>}
   */
  userList(data: Object, completeCallback, errorCallback = null): void {
    data['token'] = this.token;
    this.request('/admin/user/search', data, completeCallback, errorCallback);
  }
  userIdList(seq: string, completeCallback, errorCallback = null): void {
    this.request('/admin/user/idList', {token: this.token, seq: seq}, completeCallback, errorCallback);
  }
  userUpdate(data: Object, completeCallback, errorCallback = null): void {
    data['token'] = this.token;
    this.request('/admin/user/update', data, completeCallback, errorCallback);
  }
  deleteUser(seq: string, completeCallback, errorCallback = null): void {
    this.request('/admin/user/delete', {token: this.token, seq: seq}, completeCallback, errorCallback);
  }
  statusUpdate(seq: number, status: number, completeCallback, errorCallback = null): void {
    this.request('/admin/user/statusUpdate', {token: this.token, seq: seq, status: status}, completeCallback, errorCallback);
  }
  pwUpdate(seq: number, pw: string, completeCallback, errorCallback = null): void {
    this.request('/admin/user/pwUpdate', {token: this.token, seq: seq, pw: pw}, completeCallback, errorCallback);
  }
  userInsert(data: Object, completeCallback, errorCallback = null): void {
    data['token'] = this.token;
    this.request('/admin/user/insert', data, completeCallback, errorCallback);
  }

  /**
   * 감사 로그
   * @param {string}
   * @returns {Observable<Object>}
   */
  logList(startDate: string, endDate: string, page: number, keyword: string, step: number, rowsSize: number, act: string, completeCallback, errorCallback = null): void {
    this.request('/admin/loglist/list', {token: this.token, startDate: startDate, endDate: endDate, page: page, keyword: keyword, step: step, rowsSize: rowsSize, act: act}, completeCallback, errorCallback);
  }
  actList(startDate: string, endDate: string, page: number, keyword: string, step: number, rowsSize: number, typ: string, ac: string, completeCallback, errorCallback = null): void {
    this.request('/admin/loglist/list', {token: this.token, startDate: startDate, endDate: endDate, page: page, keyword: keyword, step: step, rowsSize: rowsSize, typ: typ, ac: ac}, completeCallback, errorCallback);
  }
  /**
   * 시스템 등록
   * @param {string}
   * @returns {Observable<Object>}
   */
  systemList(completeCallback, errorCallback = null): void {
    this.request('/admin/system/list', {token: this.token}, completeCallback, errorCallback);
  }
  systemUpdate(data: Object, completeCallback, errorCallback = null): void {
    this.request('/admin/system/update', {token: this.token, items: data}, completeCallback, errorCallback);
  }
  systemSelect(seq: number, completeCallback, errorCallback = null): void {
    this.request('/admin/system/select', {token: this.token, seq: seq}, completeCallback, errorCallback);
  }

}
