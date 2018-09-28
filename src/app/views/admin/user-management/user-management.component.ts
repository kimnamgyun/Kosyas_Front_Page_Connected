import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdminService, UserService} from '../../../services';
import {Router} from '@angular/router';
import {UserLeft} from '../../../models/user-left';
import {UserRight} from '../../../models/user-right';
import {Observable} from 'rxjs';
import {PaginationComponent} from '../../../components/pagination/pagination.component';
import {Localization} from '../../../localization';
import {CommonValidators} from '../../../directives';
import {JoinJoin, Messages} from '../../../properties';

@Component({
  selector: 'app-system-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  /**
   * 게시판 상태
   */
  mode: 'list' | 'view' | 'modify' | 'register' = 'register';
  /**
   * 페이징 인스턴스
   */
  @ViewChild(PaginationComponent)
  pagination: PaginationComponent;
  /**
   * 폼
   */
  userHForm: FormGroup;
  userRForm: FormGroup;

  /**
   * 등록 시도 여부
   * @type {boolean}
   */
  submitted = false;
  /**
   * 비밀번호 변경 시도 여부
   */
  submittedPassword = false;
  /**
   * 사용자 목록
   */
  users: Observable<UserLeft[]>;
  /**
   * 상태명 목록
   */
  statusNames = [{label: Localization.pick('전체'), value: '0'}, {label: Localization.pick('승인대기'), value: '1'}, {label: Localization.pick('승인완료'), value: '2'}
                , {label: Localization.pick('승인거부'), value: '3'}, {label: Localization.pick('잠금'), value: '5'}];
  /**
   * 노출할 국가코드 목록
   * @type {{label: string; value: string}[]}
   */
  countries = [{label: Localization.pick('대한민국'), value: 'kr'}, {label: Localization.pick('미국'), value: 'us'}, {label: Localization.pick('프랑스'), value: 'fr'}];
  /**
   * 노출할 권한코드 목록
   * @type {{label: string; value: string}[]}
   */
  levels = [{label: Localization.pick('일반'), value: 1}, {label: Localization.pick('관리자'), value: 5}, {label: Localization.pick('다국어'), value: 9}];
  /**
   * 인덱스 라벨 모델
   * @returns {string}
   */
  get smallStatusNames() {
    return this.statusNames.filter(item => item.value !== '0');
  }

  /**
   * 폼 그룹 반환
   * @returns {{[p: string]: AbstractControl}}
   */
  get userHGroup() {
    return this.userHForm.controls;
  }
  /**
   * 폼 그룹 반환
   * @returns {{[p: string]: AbstractControl}}
   */
  get userRGroup() {
    return this.userRForm.controls;
  }
  /**
   * 현재 페이지
   */
  page = 1;
  /**
   * 총 자료 수
   */
  totalRows = 1;
  /**
   * 표시할 페이지 번호 수
   */
  pageSize = 5;
  /**
   * 페이지당 표시할 행 수
   */
  rowsSize = 8;
  /**
   * 검색 된 아이디
   */
  foundId;
  /**
   * 검색 된 사용자 상태
   */
  foundStatus;

  /**
   * 생성자
   * @param router
   * @param formBuilder
   * @param adminService
   */
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private userService: UserService) {}

  /**
   * 초기화
   */
  ngOnInit() {
    this.userHForm = this.formBuilder.group({
      status: [0, [Validators.required]],
      id: ['', [Validators.required]],
      currentPage: [this.page, []],
      rowsSize: [this.rowsSize, []],
    });
    this.userRForm = this.formBuilder.group({
      seq: [-1, []],
      id: ['', [Validators.required, Validators.minLength(7),
        CommonValidators.email, CommonValidators.match(this, 'userRForm', 'id_correct')]],
      id_correct: ['', [Validators.required]],
      pw: ['', [Validators.required, Validators.minLength(9),
        Validators.pattern(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[~`!@#$%\\^&*()-])/)]],
      pw_t: ['', [Validators.required, CommonValidators.match(this, 'userRForm', 'pw')]],
      nm: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      comp_nm: ['', [Validators.required, Validators.minLength(2)]],
      nat_cd: ['kr', [Validators.required]],
      lvl: [this.levels[0].value, [Validators.required]],
    });
    this.getUsers();
  }
  /**
   * 등록하기 핸들러
   */
  onSave() {
    this.submitted = true;
    if (this.mode === 'register') {
      if (this.userRForm.invalid) {
        return;
      } else {
        this.submitted = false;
        this.adminService.userInsert(this.userRForm.value, result => {
          if (result.success) {
            alert(Localization.pick('등록 되었습니다.'));
            this.onReset();
            this.getUsers();
          }
        });
      }
    } else {
      if (this.userRGroup.id.status === 'INVALID' || this.userRGroup.id_correct.status === 'INVALID'
        || this.userRGroup.nm.status === 'INVALID' || this.userRGroup.phone.status === 'INVALID' || this.userRGroup.comp_nm.status === 'INVALID') {
        return;
      }
      this.submitted = false;
      this.adminService.userUpdate(this.userRForm.value, result => {
        if (result.success) {
          // this.usersR = result.data;
          alert(Localization.pick('변경 되었습니다.'));
          this.onGetUser(this.userRGroup['seq'].value);
        }
      });
    }
  }
  /**
   * 검색
   */
  onSearch(): void {
    this.getUsers(1, this.userHGroup['status'].value, this.userHGroup['id'].value);
  }
  /**
   * 사용자 목록 요청
   */
  getUsers(page: number = 1, status: number = 0, id: string = ''): void {
    this.foundId = id;
    this.foundStatus = status;
    this.userHGroup['currentPage'].setValue(page);
    this.userHGroup['status'].setValue(status);
    this.userHGroup['id'].setValue(id);
    this.adminService.userList(this.userHForm.value, result => {
      if (result.success) {
        this.users = result.data.items;
        this.page = result.data.page;
        this.totalRows = result.data.totalRows;
        this.userHGroup.id.setValue(this.foundId);
        this.userHGroup.status.setValue(this.foundStatus);
      }
    });
  }
  /**
   * 모델 초기화
   */
  onReset(): void {
    const user: UserRight = new UserRight();
    user.seq = -1;
    user.id = user['id_correct'] = '';
    user.pw = user.pw_t = '';
    user.nm = '';
    user.phone = '';
    user.comp_nm = '';
    user.nat_cd = 'kr';
    user.lvl = 1;
    this.userRForm.setValue(user);
    this.mode = 'register';
    this.userRGroup.id.enable();
    this.submitted = false;
  }
  /**
   * 사용자 아이디 클릭시 사용자등록 정보 조회
   * @param seq
   */
  onGetUser(seq): void {
    this.adminService.userIdList(seq, result => {
      if (result.success) {
        this.submitted = false;
        // this.usersR = result.data;
        const user: UserRight = result.data;
        user['id_correct'] = user.id;
        user.pw = user.pw_t = '';
        this.userRForm.setValue(user);
        this.mode = 'modify';
        this.userRGroup.id.disable();
      }
    });
  }
  /**
   * 사용자 상태 변경
   * @param {number} seq
   * @param {number} status
   */
  onChangeStatus(seq: number, status: number): void {
    this.adminService.statusUpdate(seq, status, result => {
      if (result.success) {
        alert(Localization.pick('저장 되었습니다.'));
        this.getUsers(this.page, this.foundStatus, this.foundId);
      }
    });
  }
  /**
   * 사용자 삭제
   * @param seq
   */
  onDeleteUser(user: UserLeft): void {
    if (user.lvl === 5) {
      return;
    }
    this.adminService.deleteUser(user.seq, result => {
      if (result.success) {
        alert(Localization.pick('삭제 되었습니다.'));
        this.getUsers(this.page, this.foundStatus, this.foundId);
      }
    });
  }
  /**
   * ID 중복 확인
   * @param seq
   */
  onCheckDuplication(id): void {
    const errors = this.userRGroup.id.errors;
    if (errors && (errors.hasOwnProperty('required') || errors.hasOwnProperty('email'))) {
      this.submitted = true;
      return;
    }
    const userId = this.userRGroup.id.value;
    this.userService.checkDuplication(userId, result => {
      if (result.success) {
        this.userRGroup.id_correct.setValue(userId);
        this.userRGroup.id.setValue(userId);
      } else {
        alert(Messages.instance.JoinDupcheck[result.status]);
        this.userRGroup.id_correct.setValue('');
      }
    });
  }
  /**
   * 변경 하기 핸들러 (패스워드)
   * @param {string} seq
   * @param {string} pw
   */
  onChangePassword(): void {
    this.submittedPassword = true;
    if (this.userRGroup.pw.status === 'INVALID' || this.userRGroup.pw_t.status === 'INVALID') {
      return;
    }
    this.submittedPassword = false;
    this.adminService.pwUpdate(this.userRGroup['seq'].value, this.userRGroup['pw'].value, result => {
      if (result.success) {
        // pw 초기화
        this.userRGroup.pw.setValue('');
        this.userRGroup.pw_t.setValue('');
        alert(Localization.pick('변경 되었습니다.'));
      }
    });
  }
  /**
   * 페이지 이동 이벤트시 호출될
   * @param page
   */
  paginationHandler(page: number): void {
    this.getUsers(page, this.foundStatus, this.foundId);
  }

}
