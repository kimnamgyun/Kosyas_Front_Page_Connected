import {BaseService} from './base.service';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable()
export class LocaleService extends BaseService {

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
   * 다국어 메시지 파일 조회
   * @param completeCallback
   * @param {any} errorCallback
   */
  get(completeCallback, errorCallback = null): void {
    this.request('/locale/get', null, completeCallback, errorCallback);
  }
  /**
   * 다국어 메시지 저장
   * @param data : 저장할 다국어 메시지 배열
   * @param completeCallback
   * @param errorCallback
   */
  set(data, completeCallback, errorCallback = null): void {
    this.request('/locale/set', {token: this.token, data: data}, completeCallback, errorCallback);
  }
  /**
   * 다국어 추출 및 갱신
   * @param completeCallback
   * @param errorCallback
   */
  extract(completeCallback, errorCallback = null): void {
    this.request('/extract', {token: this.token}, completeCallback, errorCallback);
  }
}
