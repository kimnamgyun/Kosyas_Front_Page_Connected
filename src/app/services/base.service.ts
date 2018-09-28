import {environment} from '../../environments/environment';
import {Result} from '../models';
import {CurrentUser} from '../models/current-user';
import { HttpClient } from '@angular/common/http';
import {first} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Messages, ServerToken} from '../properties';
import {ActivationEnd, Router, RouterStateSnapshot} from '@angular/router';
import {Localization} from '../localization';

export class BaseService {

  /**
   * 뷰 이동시 요청 취소
   */
  subcription: {closed: boolean, unsubscribe: () => void }[] = [];
  /**
   * 요청이 들어온 뷰 경로
   */
  protected state: RouterStateSnapshot;

  /**
   * 생성자
   * @param http
   * @param router
   * @param state
   */
  constructor(
    protected http: HttpClient,
    protected router: Router,
  ) {
    this.state = router.routerState.snapshot;
    this.router.events.subscribe(event => {
      if (event instanceof ActivationEnd) {
        this.subcription.forEach(item => {
          item.unsubscribe();
        });
      }
    });
  }

  /**
   * 기본 Rest Url 반환
   * @param url
   */
  getUrl(url: string): string {
    return environment.apiBaseUrl + url;
  }
  /**
   * 엘라스틱 URL 반환
   * @param url
   */
  getElasticUrl(url: string): string {
    return environment.elasticBasecUrl + url;
  }
  /**
   * 토큰
   */
  get token(): string {
    return CurrentUser.instance.token;
  }
  /**
   * 기본 Rest 서버에 기본 방식(POST)으로 요청
   * @param url
   * @param data
   * @param completeCallback
   * @param errorCallback
   */
  request(url, data: Object, completeCallback, errorCallback = null): void {
    console.log(this.getUrl(url));
    const work = (this.http.post(this.getUrl(url), data) as Observable<Result>)
      .pipe(first()).subscribe(value => {
        if (!value.success) {
          switch (value.status) {
            // 토큰 인증 오류인 경우 공통 처리
            case ServerToken.NO_TOKEN:
            case ServerToken.INVALID_TOKEN:
            case ServerToken.INVALID_PERMISSION:
            {
              if (value.status === ServerToken.INVALID_PERMISSION) { // Logout
                alert(Messages.instance.ServerToken[value.status]);
              } else {
                this.router.navigate(['/anonymous/login'], { queryParams: { returnUrl: this.state.url }});
              }
              return;
            }
            // 모든 에러 공통
            case 99:
            {
              console.log('99=====================================================================================');
              console.log(this.getUrl(url));
              this.showErrorMessage();
              break;
            }
          }
        }
        // 토큰 갱신
        if (value.hasOwnProperty('token') && value.token) {
          CurrentUser.instance.token = value.token;
        }
        completeCallback(value);
      },
      errorCallback ? errorCallback : error => { // error page
        this.showErrorMessage();
      });
    this.addSubcription(work);
  }
  /**
   * 외부 Rest 서버(엘라스틱 서치)에 기본 방식(GET)으로 요청
   * @param url
   * @param data
   * @param completeCallback
   * @param errorCallback
   */
  requestExternal(url, data: Object, completeCallback, errorCallback = null): void {
    const params = new URLSearchParams();
    if (data) {
      Object.keys(data).forEach(key => params.set(key, data[key]));
    }
    // params.forin(key => params[key]);
    console.log(this.getElasticUrl(url));
    console.log(params.toString());
    const work = (this.http.get(this.getElasticUrl(`${url}?${params.toString()}`)))
      .pipe(first()).subscribe(value => {
        if (value['error'] === '0') {
          completeCallback(value);
        } else { // error page
          this.showErrorMessage();
        }
      },
      errorCallback ? errorCallback : error => { // error page
        this.showErrorMessage();
      });
    this.addSubcription(work);
  }
  /**
   * 외부 Rest 서버(엘라스틱 서치)에 POST 방식으로 요청
   * @param url
   * @param data
   * @param completeCallback
   * @param errorCallback
   */
  requestExternalPost(url, data: Object, completeCallback, errorCallback = null): void {
    console.log(this.getElasticUrl(url));
    console.log(JSON.stringify(data));
    const work = (this.http.post(this.getElasticUrl(url), data) as Observable<Result>)
      .pipe(first()).subscribe(value => {
        if (value['error'] === '0') {
          completeCallback(value);
        } else { // error page
          this.showErrorMessage();
        }
      },
      errorCallback ? errorCallback : error => { // error page
        this.showErrorMessage();
      });
    this.addSubcription(work);
  }

  /**
   * 기존 요청을 확인하여 종료된 요청은 목록에서 제거하고 진행한 요청을 목록에 추가
   * @param work
   */
  addSubcription(work): void {
    const len = this.subcription.length;
    for (let i = len - 1; i >= 0; i--) {
      const item = this.subcription[i];
      if (item.closed) {
        this.subcription.splice(i, 1);
      }
    }
    this.subcription.push(work);
  }
  /**
   * 에러 페이지로 이동
   */
  showErrorMessage(): void {
    // this.router.navigate(['/error'], { queryParams: { returnUrl: this.state.url }});
    alert(Localization.pick('요청하신 작업에 문제가 발생하였습니다.'));
  }

}
