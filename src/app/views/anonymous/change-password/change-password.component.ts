import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../services/index';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonValidators} from '../../../directives';
import {CurrentUser} from '../../../models/current-user';
import {first} from 'rxjs/operators';
import {FindPw} from '../../../properties/user.enum';
import {Messages} from '../../../properties';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['../styles.scss'],
})
export class ChangePasswordComponent implements OnInit {

  returnUrl: string;

  gbn: string;

  /**
   * 1: 아이디 / 비밀번호 변경
   * @type {number}
   */
  step = 1;
  /**
   * 폼
   */
  chgPwForm: FormGroup;
  /**
   * 제출 시도 여부
   * @type {boolean}
   */
  submitted = false;
  /**
   * 최초 접근 관리자 계정 변경 폼 그룹 반환
   * @returns {{[p: string]: AbstractControl}}
   */
  get chgPwGroup() {
    return this.chgPwForm.controls;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService) {}

  /**
   * 초기화
   */
  ngOnInit() {
    this.chgPwForm = this.formBuilder.group({
      id: ['', [Validators.required, Validators.minLength(7), CommonValidators.email]],
      pw: ['', [Validators.required, Validators.minLength(9),
        Validators.pattern(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[~`!@#$%\\^&*()-])/)]],
      pw_repeat: ['', [Validators.required, CommonValidators.match(this, 'chgPwForm', 'pw')]],
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    // this.chgPwGroup.id.setValue(JSON.parse(localStorage.getItem('id')));
    const id_nav = this.route.snapshot.params.id;
    this.gbn = this.route.snapshot.params.gbn;

    this.chgPwGroup.id.setValue(id_nav);
  }

  /**
   * 제출하기 핸들러
   */
  onSubmit() {
    this.submitted = true;
    if (this.chgPwForm.invalid) {
      return;
    }
    this.userService.changePassword(this.chgPwForm.value, result => {
      if (result.success) {
        CurrentUser.instance.create(result);
        this.router.navigate([this.returnUrl]);
      }
    });
  }
}
