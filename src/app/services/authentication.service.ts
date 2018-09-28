import { Injectable } from '@angular/core';
import {BaseService} from './base.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable()
export class AuthenticationService extends BaseService {

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

  login(data: Object, completeCallback, errorCallback = null): void {
    this.request('/user/authenticate/login', data, completeCallback, errorCallback);
  }

  logout(completeCallback, errorCallback = null): void {
    this.request('/user/authenticate/logout', { token: this.token }, completeCallback, errorCallback);
  }
}
