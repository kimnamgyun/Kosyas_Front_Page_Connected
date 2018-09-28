import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService, LicenseService} from '../../../services';
import {ActivatedRoute, Router} from '@angular/router';
import {CurrentUser} from '../../../models/current-user';
import {AuthenticateLogin, Messages} from '../../../properties';
import {environment} from '../../../../environments/environment';
import {Localization} from '../../../localization';
import {CommonValidators} from '../../../directives';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private licenseService: LicenseService
  ) {}

  /**
   * 초기화
   */
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      id: ['', [Validators.required, Validators.minLength(7), CommonValidators.email]],
      pw: ['', [Validators.required, Validators.minLength(9),
        Validators.pattern(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[~`!@#$%\\^&*()-])/)]],
    });
    CurrentUser.instance.clear();
    this.authenticationService.logout(result => {
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  /**
   * 폼 객체 반환
   * @returns {{[p: string]: AbstractControl}}
   */
  get loginGroup() {
    return this.loginForm.controls;
  }
  /**
   * 제출하기 핸들러 (최초 접근관리자 계정변경/ 임시비밀번호 로그인 pw변경/ 정상 로그인)
   */
  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.licenseService.licenseCheck(environment.siteId, result1 => {
      if (result1.error === '0') {

        this.authenticationService.login(this.loginForm.value, result => {
          if (result.success) {
            if (result.status === AuthenticateLogin.FIRST_LOGIN_ADM) {
              alert(Messages.instance.AuthenticateLogin[result.status]);
              this.router.navigate(['/anonymous/change-password', result.data.id, 'adm']);
            } else if (result.status === AuthenticateLogin.FIRST_LOGIN) {
              alert(Messages.instance.AuthenticateLogin[result.status]);
              this.router.navigate(['/anonymous/change-password', result.data.id, 'temp']);
            } else {
              CurrentUser.instance.create(result);
              this.router.navigate([this.returnUrl]);
            }
          } else {
            if (result.status !== AuthenticateLogin.ERROR) {
              alert(Messages.instance.AuthenticateLogin[result.status]);
            }
            this.loginGroup.pw.setValue('');
            this.submitted = false;
          }
        });


      } else {
        alert(Localization.pick('라이센스가 만료되었습니다. 관리자에게 문의 바랍니다.'));
      }
    });




  }

}
