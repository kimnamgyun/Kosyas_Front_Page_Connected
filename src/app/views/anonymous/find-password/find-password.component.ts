import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../../../services';
import {CommonValidators} from '../../../directives';
import {Localization} from '../../../localization';
import {JoinJoin, Messages} from '../../../properties';
import {FindPw} from '../../../properties/user.enum';

@Component({
  selector: 'app-find-password',
  templateUrl: './find-password.component.html',
  styleUrls: ['../styles.scss']
})
export class FindPasswordComponent implements OnInit {

  /**
   * 1: 비밀번호 찾기, 2: 완료
   * @type {number}
   */
  step = 1;

  /**
   * 비밀번호찾기 폼
   */
  findPasswordForm: FormGroup;
  /**
   * 제출 시도 여부
   * @type {boolean}
   */
  submitted = false;

  /**
   * 비밀번호찾기 폼 그룹 반환
   * @returns {{[p: string]: AbstractControl}}
   */
  get findPasswordGroup() {
    return this.findPasswordForm.controls;
  }

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService) { }

  ngOnInit() {
    this.findPasswordForm = this.formBuilder.group({
      id: ['', [Validators.required, Validators.minLength(7), CommonValidators.email]],
    });
  }

  /**
   * 제출하기 핸들러
   */
  onSubmit() {
    this.submitted = true;
    if (this.findPasswordForm.invalid) {
      return;
    }
    this.userService.findPassword(this.findPasswordForm.value, result => {
      if (result.success) {
        alert(Localization.pick('발송 되었습니다.'));   // 주석제거 필요
        // this.router.navigate(['/anonymous']);
        this.step = 2;
      } else {
        if (result.status !== FindPw.ERROR) {
          alert(Messages.instance.FindPw[result.status]);
        }
      }
    });
  }

}
