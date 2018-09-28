import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdminService, UserService} from '../../../services';
import {System} from '../../../models/system';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {Location} from '@angular/common';
import {Localization} from '../../../localization';
import {Messages, SystemUpdate} from '../../../properties';

@Component({
  selector: 'app-system-management',
  templateUrl: './system-management.component.html',
  styleUrls: ['./system-management.component.scss']
})
export class SystemManagementComponent implements OnInit {

  /**
   * 폼
   */
  systemForm: FormGroup;
  /**
   * 등록 시도 여부
   * @type {boolean}
   */
  submitted = false;
  /**
   * 노출할 시스템 목록
   * @type
   */
  /*
      get systems(): System[] {
          return this._systems;
      }
      set systems(value: System[]) {
          this._systems = value;
      }
  */
  systems: Observable<System[]>;
  oldsystems: Observable<System[]>;

  /**
   * 폼 그룹 반환
   * @returns {{[p: string]: AbstractControl}}
   */
  get systemGroup() {
    return this.systemForm.controls;
  }

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private location: Location) {}

  /**
   * 초기화
   */
  ngOnInit() {
    this.systemForm = this.formBuilder.group({
      items: this.formBuilder.array([])
    });
    for (let i = 0; i < 4; i++) {
      this.addItem();
    }
    this.onSearch();
  }
  /**
   * 등록하기 핸들러
   */
  onSubmit() {
    this.submitted = true;
    if (this.systemForm.invalid) {
        alert(Localization.pick('입력값을 확인하세요.'));
        return;
    }
    this.adminService.systemUpdate(this.systems, result => {
      if (result.success) {
        alert(Localization.pick('저장 되었습니다.'));
        location.reload();
      } else {
        if (result.status !== SystemUpdate.ERROR) {
          alert(Messages.instance.SystemUpdate[result.status]);
        }
      }
    });
  }

  /**
   * 조회하기 핸들러
   */
  onSearch() {
    this.adminService.systemList(result => {
      if (result.success) {
        this.submitted = false;
        this.systems = result.data;
        this.oldsystems = JSON.parse(JSON.stringify(this.systems));
      }
    });
  }
  createItem(): FormGroup {
    return this.formBuilder.group({
      addr: ['', [Validators.required,  Validators.maxLength(500)]],
      port: ['', [Validators.required,  Validators.maxLength(5)]],
    });
  }
  addItem(): void {
    (this.systemForm.get('items') as FormArray).push(this.createItem());
  }

  /**
   * 모델 초기화
   */
  clearModel(): void {
    // this.users = new UserRight();
    // this.users.nat_cd = 'kr';
    // this.users.id = CurrentUser.instance.data.id;
    this.systems = JSON.parse(JSON.stringify(this.oldsystems));
  }
}
