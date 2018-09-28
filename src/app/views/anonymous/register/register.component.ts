import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../services/index';
import {CommonValidators} from '../../../directives/index';
import {JoinDupcheck, JoinJoin, Messages} from '../../../properties';
import {Localization} from '../../../localization';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../styles.scss']
})
export class RegisterComponent implements OnInit {

  /**
   * 1: 약관, 2: 가입신청
   * @type {number}
   */
  step = 1;
  /**
   * 약관 폼
   */
  termsForm: FormGroup;
  /**
   * 전체 동의 여부
   * @returns {boolean}
   */
  get all(): boolean {
    return this.service && this.privacy;
  }
  /**
   * 서비스 이용약관 동의 여부
   */
  service: boolean;
  /**
   * 개인정보 수집 및 이용 안내 동의 여부
   */
  privacy: boolean;
  /**
   * 가입신청 폼
   */
  registerForm: FormGroup;
  /**
   * 제출 시도 여부
   * @type {boolean}
   */
  submitted = false;
  /**
   * 노출할 국가코드 목록
   * @type {{label: string; value: string}[]}
   */
  countries = [{label: Localization.pick('대한민국'), value: 'kr'}, {label: Localization.pick('미국'), value: 'us'}, {label: Localization.pick('프랑스'), value: 'fr'}];
  /**
   * 국가코드 라벨 모델
   * @returns {string}
   */
  get country() {
    return this.countries.filter(country => country.value === this.registerGroup.nat_cd.value)
      .reduce(function (str: string, country) {
        return country.label;
      }, '');
  }
  /**
   * 가입신청 폼 그룹 반환
   * @returns {{[p: string]: AbstractControl}}
   */
  get registerGroup() {
    return this.registerForm.controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService) {}

  /**
   * 초기화
   */
  ngOnInit() {
    this.termsForm = this.formBuilder.group({
      all: [false, [Validators.requiredTrue]],
      service: [false, null],
      privacy: [false, null],
    });
    this.registerForm = this.formBuilder.group({
      id: ['', [Validators.required, Validators.minLength(7),
        CommonValidators.email, CommonValidators.match(this, 'registerForm', 'id_correct')]],
      id_correct: ['', [Validators.required]],
      pw: ['', [Validators.required, Validators.minLength(9),
        Validators.pattern(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[~`!@#$%\\^&*()-])/)]],
      pw_repeat: ['', [Validators.required, CommonValidators.match(this, 'registerForm', 'pw')]],
      nm: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      comp_nm: ['', [Validators.required, Validators.minLength(2)]],
      nat_cd: ['kr', [Validators.required]],
    });
  }

  changeAll() {
    this.service = this.privacy = !this.all;
  }
  /**
   * 약관 동의 핸들러
   */
  onAgree() {
    this.submitted = true;
    if (this.termsForm.invalid) {
      return;
    }
    this.submitted = false;
    this.step = 2;
  }
  /**
   * 아아디 중복 검사 핸들러
   */
  onCheckDuplication() {
    const errors = this.registerGroup.id.errors;
    if (errors && (errors.hasOwnProperty('required') || errors.hasOwnProperty('email'))) {
      this.submitted = true;
      return;
    }
    const userId = this.registerGroup.id.value;
    this.userService.checkDuplication(userId, result => {
      if (result.success) {
        this.registerGroup.id_correct.setValue(userId);
        this.registerGroup.id.setValue(userId);
      } else {
        if (result.status !== JoinDupcheck.ERROR) {
          alert(Messages.instance.JoinDupcheck[result.status]);
        }
        this.registerGroup.id_correct.setValue('');
      }
    });
  }
  /**
   * 제출하기 핸들러
   */
  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    this.userService.join(this.registerForm.value, result => {
      if (result.success) {
        this.step = 3;
      } else {
        if (result.status !== JoinJoin.ERROR) {
          alert(Messages.instance.JoinJoin[result.status]);
        }
        this.registerGroup.pw.setValue('');
        this.registerGroup.pw_repeat.setValue('');
      }
    });
  }
}
