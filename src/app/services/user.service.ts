import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {BaseService} from './base.service';
import {Router} from '@angular/router';


@Injectable()
export class UserService extends BaseService {

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
   * 아이디 중복검사
   * @param {string} id
   * @returns {Observable<Object>}
   */
  checkDuplication(id: string, completeCallback, errorCallback = null): void {
    this.request('/user/join/dupcheck', { id: id }, completeCallback, errorCallback);
  }

  join(data: Object, completeCallback, errorCallback = null): void {
    this.request('/user/join/join', data, completeCallback, errorCallback);
  }

  findId(data: Object, completeCallback, errorCallback = null): void {
    this.request('/user/find/findId', data, completeCallback, errorCallback);
  }

  findPassword(data: Object, completeCallback, errorCallback = null): void {
    this.request('/user/find/findPassword', data, completeCallback, errorCallback);
  }

  changePassword(data: Object, completeCallback, errorCallback = null): void {
    this.request('/user/find/updateadmpw', data, completeCallback, errorCallback);
  }

  /**
   * 사용자 정보
   * @param {string}
   * @returns {Observable<Object>}
   */
  userData(seq: string, completeCallback, errorCallback = null): void {
    this.request('/admin/userInfoData/select', {token: this.token, seq: seq}, completeCallback, errorCallback);
  }
  userDataUpdate(data: Object, completeCallback, errorCallback = null): void {
    data['token'] = this.token;
    this.request('/admin/userInfoData/update', data, completeCallback, errorCallback);
  }
  pwDataUpdate(seq: number, pw: string, completeCallback, errorCallback = null): void {
    this.request('/admin/userInfoData/pwUpdate', {token: this.token, seq: seq, pw: pw}, completeCallback, errorCallback);
  }
}
