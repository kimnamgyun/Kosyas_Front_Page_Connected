import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../services/index';
import {Router} from '@angular/router';
import {CommonValidators} from '../../../directives/index';
import {UserRight} from '../../../models/user-right';
import {CurrentUser} from '../../../models/current-user';
import {Localization} from '../../../localization';

@Component({
  selector: 'app-user',
  templateUrl: './user-info.component.html',
  styleUrls: ['../../admin/user-management/user-management.component.scss']
})
export class UserInfoComponent implements OnInit {
  /**
   * 폼
   */
  userForm: FormGroup;
  /**
   * 저장 시도 여부
   * @type {boolean}
   */
  submitted = false;
  /**
   * 비밀번호 변경 시도 여부
   */
  submittedPassword = false;
  /**
   * 사용자 정보
   */
  users: UserRight;
  /**
   * 상태명 목록
   */
  statusNames = [{label: Localization.pick('전체'), value: '0'}, {label: Localization.pick('승인대기'), value: '1'}, {label: Localization.pick('승인완료'), value: '2'}
                , {label: Localization.pick('승인거부'), value: '3'}, {label: Localization.pick('탈퇴'), value: '4'}, {label: Localization.pick('잠금'), value: '5'}];

  /**
   * 노출할 국가코드 목록
   * @type {{label: string; value: string}[]}
   */
  countries = [{label: Localization.pick('대한민국'), value: 'kr'}, {label: Localization.pick('미국'), value: 'us'}, {label: Localization.pick('프랑스'), value: 'fr'}];

  /**
   * 폼 그룹 반환
   * @returns {{[p: string]: AbstractControl}}
   */
  get userGroup() {
    return this.userForm.controls;
  }

  /**
   * 생성자
   * @param router
   * @param formBuilder
   * @param userService
   */
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService) {}

  /**
   * 초기화
   */
  ngOnInit() {
    this.userForm = this.formBuilder.group({
      seq: [-1, []],
      id: ['', []],
      lvl: [0, []],
      pw: ['', [Validators.required, Validators.minLength(9),
        Validators.pattern(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[~`!@#$%\\^&*()-])/)]],
      pw_t: ['', [Validators.required, CommonValidators.match(this, 'userForm', 'pw')]],
      nm: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      comp_nm: ['', [Validators.required, Validators.minLength(2)]],
      nat_cd: ['kr', [Validators.required]],
    });
    this.getUser();
  }
  /**
   * 사용자 정보 조회
   * @param seq
   */
  getUser(): void {
    this.userService.userData(CurrentUser.instance.data.seq, result => {
      if (result.success) {
        this.submitted = false;
        this.users = result.data;
        this.users.pw = this.users.pw_t = '';
        this.userForm.setValue(this.users);
      }
    });
  }
  /**
   * 변경 하기 핸들러 (패스워드)
   */
  onChangePassword(): void {
    this.submittedPassword = true;
    if (this.userGroup.pw.status === 'INVALID' || this.userGroup.pw_t.status === 'INVALID') {
      return;
    }
    this.submittedPassword = false;
    this.userService.pwDataUpdate(this.userGroup['seq'].value, this.userGroup['pw'].value, result => {
      if (result.success) {
        // pw 초기화
        this.userGroup.pw.setValue('');
        this.userGroup.pw_t.setValue('');
        alert(Localization.pick('변경 되었습니다.'));
      }
    });
  }
  /**
   * 등록하기 핸들러
   */
  onSave() {
    this.submitted = true;
    if (this.userGroup.id.status === 'INVALID' || this.userGroup.nm.status === 'INVALID' || this.userGroup.phone.status === 'INVALID' || this.userGroup.comp_nm.status === 'INVALID') {
      return;
    }
    this.submitted = false;
    this.userGroup.pw.setValue('');
    this.userGroup.pw_t.setValue('');
    this.userService.userDataUpdate(this.userForm.value, result => {
      if (result.success) {
        alert(Localization.pick('변경 되었습니다.'));
        this.getUser();
      }
    });
  }
  /**
   * 모델 초기화
   */
  onReset(): void {
    this.userForm.setValue(this.users);
  }
}
