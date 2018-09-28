import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Result} from '../../../models/index';
import {UserService} from '../../../services/index';
import {Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {Messages} from '../../../properties';
import {FindId, FindPw} from '../../../properties/user.enum';

@Component({
  selector: 'app-find-id',
  templateUrl: './find-id.component.html',
  styleUrls: ['../styles.scss'],
})
export class FindIDComponent implements OnInit {

  /**
   * 1: 아이디 찾기, 2: 아이디 확인
   * @type {number}
   */
  step = 1;
  /**
   * 폼
   */
  findIdForm: FormGroup;
  selectIdForm: FormGroup;
  /**
   * 제출 시도 여부
   * @type {boolean}
   */
  submitted = false;
  /**
   * 가입신청 폼 그룹 반환
   * @returns {{[p: string]: AbstractControl}}
   */
  get findIDGroup() {
    return this.findIdForm.controls;
  }

  get selectIdGroup() {
    return this.selectIdForm.controls;
  }

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService) {}

  /**
   * 초기화
   */
  ngOnInit() {
    this.findIdForm = this.formBuilder.group({
      nm: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
    });

    this.selectIdForm = this.formBuilder.group({
      id: [''],
    });
  }

  /**
   * 제출하기 핸들러
   */
  onSubmit() {
    this.submitted = true;
    if (this.findIdForm.invalid) {
      return;
    }
    this.userService.findId(this.findIdForm.value, result => {
      if (result.success) {
        // alert(res.messageCode);   // 주석제거 필요
        // this.router.navigate(['/anonymous']);
        this.step = 2;
        this.selectIdGroup.id.setValue(result.data.id);
      } else {
        if (result.status !== FindId.ERROR) {
          alert(Messages.instance.FindId[result.status]);
        }
      }
    });
  }
}
