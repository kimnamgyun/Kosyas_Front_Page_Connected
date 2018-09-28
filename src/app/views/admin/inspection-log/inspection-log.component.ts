import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DatePeriodComponent} from '../../../components/date-period/date-period.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdminService, UserService} from '../../../services';
import {Localization} from '../../../localization';
import {Router} from '@angular/router';
import {Common} from '../../../utils';
import {forEach} from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-user',
  templateUrl: './inspection-log.component.html',
  styleUrls: ['./inspection-log.component.scss']
})
export class InspectionLogComponent implements OnInit, AfterViewInit {

  step = 1;

  page = 1 ;
  totalRows = 1 ;
  pageSize = 10;
  rowsSize = 10;

  startDate;
  endDate;

  act;
  typ;
  ac;

  items;

  keyword;

  types = [{label: Localization.pick('전체'), value: '0'}, {label: Localization.pick('연관분석'), value: '1'}, {label: Localization.pick('알림항목'), value: '2'}, {label: Localization.pick('사용자정보'), value: '3'}, {label: Localization.pick('관리자설정'), value: '4'}, {label: Localization.pick('가입하기'), value: 5}];
  actions = [{label: Localization.pick('전체'), value: 'X'}, {label: Localization.pick('등록'), value: 'I'}, {label: Localization.pick('수정'), value: 'U'}, {label: Localization.pick('삭제'), value: 'D'}];
  actionLogins = [{label: Localization.pick('전체'), value: '0'}, {label: Localization.pick('성공'), value: '1'}, {label: Localization.pick('실패'), value: '2'}, {label: Localization.pick('실패잠금'), value: '3'}, {label: Localization.pick('로그아웃'), value: '4'}];

  @ViewChild('dateperiod')
  datePeriod: DatePeriodComponent;

  /**
   * 폼
   */
  logForm: FormGroup;

  /**
   * 폼 그룹 반환
   * @returns {{[p: string]: AbstractControl}}
   */
  get logFormGroup() {
    return this.logForm.controls;
  }

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.logForm = this.formBuilder.group({
      keyword: ['', []],
      actionLogin: ['0', []],
      typ: ['0', []],
      ac: ['X', []],
    });

  }

  ngAfterViewInit() {

    this.startDate = this.datePeriod.startDate;
    this.endDate = this.datePeriod.endDate;

    this.onClick();
  }

  /**
   * 목록 조회
   * @param page
   */
  getList(startDate, endDate, page, keyword) {
    // step = 1
    if (this.step === 1) {
      if (this.logFormGroup.actionLogin.value === '0') {
        this.act = '';
      } else {
        this.act = this.logFormGroup.actionLogin.value;
      }

      this.adminService.logList(startDate, endDate, page, keyword, this.step, this.rowsSize, this.act, result => {
        if (result.success) {
          this.page = result.data.page;
          this.keyword = result.data.keyword;
          this.logFormGroup.keyword.setValue(this.keyword);

          this.totalRows = result.data.totalRows;
          this.items = result.data.items;
        }
      });
    } else { // step = 2
      if (this.logFormGroup.typ.value === '0') {
        this.typ = '';
      } else {
        this.typ = this.logFormGroup.typ.value;
      }
      if (this.logFormGroup.ac.value === 'X') {
        this.ac = '';
      } else {
        this.ac = this.logFormGroup.ac.value;
      }

      this.adminService.actList(startDate, endDate, page, keyword, this.step, this.rowsSize, this.typ, this.ac, result => {
        if (result.success) {
          this.page = result.data.page;
          this.keyword = result.data.keyword;
          this.logFormGroup.keyword.setValue(this.keyword);

          this.totalRows = result.data.totalRows;
          this.items = result.data.items;
        }
      });
    }
  }

  /**
   * tab click 이벤트
   * @param step
   */
  onTab(step) {
    this.step = step;

    this.items = null;

    this.onClick();
  }

  /**
   * 검색 click 이벤트
   * @param step
   */
  onClick() {
    this.startDate = this.datePeriod.startDate.getFullYear() + '-' + Common.pad(this.datePeriod.startDate.getMonth() + 1, 2) + '-' + Common.pad(this.datePeriod.startDate.getDate(), 2);
    this.endDate = this.datePeriod.endDate.getFullYear() + '-' + Common.pad(this.datePeriod.endDate.getMonth() + 1, 2) + '-' + Common.pad(this.datePeriod.endDate.getDate(), 2);

    this.getList(this.startDate, this.endDate, 1, this.logFormGroup.keyword.value);
  }

  /**
   * 페이지 이동 이벤트시 호출될
   * @param page
   */
  paginationHandler(page: number): void {
    this.startDate = this.datePeriod.startDate.getFullYear() + '-' + Common.pad(this.datePeriod.startDate.getMonth() + 1, 2) + '-' + Common.pad(this.datePeriod.startDate.getDate(), 2);
    this.endDate = this.datePeriod.endDate.getFullYear() + '-' + Common.pad(this.datePeriod.endDate.getMonth() + 1, 2) + '-' + Common.pad(this.datePeriod.endDate.getDate(), 2);

    this.getList(this.startDate, this.endDate, page, this.keyword);
  }
}
