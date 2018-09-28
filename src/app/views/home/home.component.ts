import { Component, OnInit } from '@angular/core';
import {filter} from 'rxjs/operators';
import {NavigationEnd, Route, Router, Routes} from '@angular/router';
import {AnalysisService, AuthenticationService, LicenseService} from '../../services';
import {CurrentUser} from '../../models/current-user';
import {User} from '../../models';
import {DatePipe, Location} from '@angular/common';
import {Localization} from '../../localization';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  /**
   * 레프트 메뉴 모델
   */
  menuData: Routes;
  /**
   * 레프트 메뉴 최소화 여부
   * @type {boolean}
   */
  minimizedMenu = false;
  /**
   * 사용자 정보 메뉴 열림 상태 모델
   * @type {boolean}
   */
  openedAccountInfo = false;
  /**
   * 언어 설정 메뉴 열림 상태 모델
   */
  openedLanguage = false;
  /**
   * 사용자 정보
   */
  user: User = CurrentUser.instance.data;
  /**
   * 오늘 날짜
   */
  today: string;
  endDate: string;
  /**
   * 알람 정보
   */
  alarm: {count: number, seq: number, rule_name: string, str_time: string, match: number};
  /**
   * 알람 메시지 보이기 여부
   */
  isShowAlarm = false;
  /**
   * site Id
   */
  siteId = environment.siteId;
  /**
   * 현재 언어
   */
  get language(): string {
    const matchList = {'ko-KR': 'KOREAN', 'en-US': 'ENGLISH', 'fr-FR': 'FRENCH'};
    return matchList[Localization.instance.language];
  }

  /**
   * 생성자
   * @param router
   * @param authenticationService
   */
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private analysisService: AnalysisService,
    private location: Location,
    private licenseService: LicenseService
  ) {}

  /**
   * 초기화
   */
  ngOnInit() {
    // 사이드바 메뉴 정보
    this.menuData = this.getRoutes(this.router.config.find(item => item.path === ''));
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      this.menuData.forEach(item => {
        item.data.opened = false;
      });
    });
    // 알람 정보 초기화
    // this.alarm = {count: 10, seq: 1, rule_name: 'rule_blacklist', str_time: '2018-09-02 11:11:13', match: 10};
    this.alarm = {count: 0, seq: -1, rule_name: '', str_time: '', match: 0};
    this.getAlarm();
    // 나의 정보. 현재는 현재 시간이 들어가지만 라이센스 만료 날짜를 넣어야 함
    this.getEndDate();
    setInterval(() => {
        this.getAlarm();
      },
      3600000);

  }
  /**
   * 사용자 정보 메뉴 닫기 핸들러
   */
  onClickOutsideAccountInfo() {
      this.openedAccountInfo = false;
  }
  /**
   * 사용자 정보 메뉴 열림 상태 토글 핸들러
   */
  onToggleAccountInfo() {
      this.openedAccountInfo = !this.openedAccountInfo;
  }
  /**
   * 언어 설정 메뉴 닫기 핸들러
   */
  onClickOutsideLanguage() {
      this.openedLanguage = false;
  }
  /**
   * 언어 설정 메뉴 열림 상태 토글 핸들러
   */
  onToggleLanguage() {
      this.openedLanguage = !this.openedLanguage;
  }
  /**
   * 로그아웃 핸들러
   */
  onLogout() {
    this.router.navigate(['/anonymous/login']);
  }
  /**
   * 메인 메뉴 클릭 핸들러
   * @param {Route} depths1
   */
  onSelectDepths1(depths1: Route) {
    this.minimizedMenu = false;
    depths1.data.opened = !depths1.data.opened;
  }
  /**
   * 서브 메뉴 클릭 핸들러
   * @param {Route} depths1
   * @param {Route} depths2
   */
  onSelectDepths2(depths1: Route, depths2: Route) {}
  /**
   * 해당 라우트의 자식 라우트들 중 실제 컴포넌트에 매치되고 권한을 충족하는 라우트만 반환
   * @param {Route} route
   * @returns {Routes}
   */
  getRoutes(route: Route): Routes {
    const level: Number = CurrentUser.instance.data ? CurrentUser.instance.data.lvl : 0;
    const config = route['_loadedConfig'];
    if (!config || !config.hasOwnProperty('routes')) {
      return null;
    }
    return config.routes.filter(p => p.hasOwnProperty('data') && !p.data.hasOwnProperty('hidden') && p.data.required_level <= level);
  }
  /**
   * 해당 메인 메뉴 라우트의 열림 상태 반환
   * @param {Route} route
   * @returns {boolean}
   */
  openedDetphs1(route: Route) {
    return this.isActiveDepths1(route) || route.data['opened'];
  }
  /**
   * 해당 라우트가 현재 활성화된 라우트인지 여부 반환
   * @param {Route} route
   * @returns {boolean}
   */
  isActiveDepths1(route: Route): boolean {
    return this.router.url.indexOf(route.path) === 1;
  }
  /**
   * 알람 정보 요청
   * @param seq
   */
  getAlarm(seq: number = -1): void {
    this.analysisService.getAlarm(seq, result => {
      if (result.success) {
        this.alarm = result.data;
      }
    });
  }
  /**
   * 알람 메시지 보여주기 핸들러
   */
  onShowAlarm(event: MouseEvent): void {
    if (this.isShowAlarm) {
      this.isShowAlarm = false;
    } else {
      if (this.alarm.count > 0) {
        this.isShowAlarm = true;
        this.getAlarm(this.alarm.seq);
      }
    }
  }
  /**
   * 알람 메시지 닫기 핸들러
   */
  onCloseAlarm(event: MouseEvent, seq: number): void {
    this.isShowAlarm = false;
  }
  /**
   * 사용자 언어 설정
   * @param language
   */
  setLanguage(language: string): void {
    Localization.instance.setLanguage(language);
    location.reload();
  }
  /**
   * 라이센스 만료일 정보 요청
   * @param seq
   */
  getEndDate(): void {
    this.licenseService.licenseInfo(this.siteId, result => {
      if (result.error === '0') {
        this.endDate = result.data.end;
        const datePipe = new DatePipe('en-US');
        this.endDate = datePipe.transform(this.endDate, Localization.pick('yyyy년 MM월 dd일'));
        // alert(this.endDate);
      }
    });
  }
}
