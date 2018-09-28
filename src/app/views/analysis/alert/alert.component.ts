import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AnalysisService} from '../../../services/analysis-service';
import {Localization} from '../../../localization';
import {AlarmList, JoinDupcheck, Messages} from '../../../properties';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  /**
   * 제목
   */
  title = {list: Localization.pick('알람 룰 리스트'), edit: Localization.pick('알람 룰')};
  /**
   * 게시판 상태
   */
  mode: 'list' | 'view' | 'modify' | 'register' = 'list';
  /**
   * 검색어 룰 명칭
   */
  keyword = '';
  /**
   * 룰 명
   */
  name: string;
  /**
   * 사용자 알람 목록
   */
  ownerItems: {seq: number, id: string, lvl: number, status: string, email: boolean, web: boolean}[] = [];
  /**
   * 사용자 목록
   */
  get userItems(): {seq: number, id: string, lvl: number, status: string, email: boolean, web: boolean}[] {
    return this._userItems.filter(userItem => this.ownerItems.find(ownerItem => ownerItem.seq === userItem.seq) === undefined);
  }
  _userItems: {seq: number, id: string, lvl: number, status: string, email: boolean, web: boolean}[] = [];
  /**
   * 목록 폼
   */
  searchForm: FormGroup;

  /**
   * 생성자
   * @param formBuilder
   * @param analysisService
   */
  constructor(
    private analysisService: AnalysisService) {}

  /**
   * 초기화
   */
  ngOnInit() {
    this.searchForm = new FormGroup({
      id: new FormControl('')
    });
  }
  /**
   * 사용자 알람 목록 요청
   */
  getOwners(): void {
    this.analysisService.getOwners(this.name, result => {
      if (result.success) {
        this.ownerItems = result.data.items;
      }
    });
  }
  /**
   * 사용자 목록 요청
   */
  getUsers(id: string = ''): void {
    this.analysisService.getUsers(this.name, id, result => {
      if (result.success) {
        this._userItems = result.data.items;
        this.keyword = id;
      }
    });
  }
  /**
   * 검색
   */
  onSearch(): void {
    this.getUsers(this.searchForm.controls.id.value);
  }
  /**
   * 해당 사용자를 사용자 알람 목록에 추가
   * @param index
   */
  onAddUser(item: {seq: number, id: string, lvl: number, status: string, email: boolean, web: boolean}): void {
    item.email = true;
    item.web = false;
    this.ownerItems.push(item);
  }
  /**
   * 해당 사용자를 사용자 알람 목록에서 제외
   * @param index
   */
  onRemoveUser(item: {seq: number, id: string, lvl: number, status: string, email: boolean, web: boolean}): void {
    this.ownerItems.splice(this.ownerItems.indexOf(item), 1);
  }
  /**
   * 사용자 알람 목록 저장
   */
  onSave(): void {
    this.analysisService.setOwners(this.name, this.ownerItems, result => {
      if (result.success) {
        alert(Localization.pick('저장 되었습니다.'));
      }
    });
  }
  /**
   * editForm 초기화 완료 핸들러
   */
  editFormComplete(form: FormGroup): void {
    form.get('name').setValue('');
    form.get('http_post_static_payload').get('rule_name').setValue('');
    form.removeControl('filter');
    // form.addControl('filter', new FormControl(''));
  }
  /**
   * 룰 명 키 업 이벤트 핸들러
   * 룰 명을 cr_로 시작지 않게 변경
   * @param event
   */
  onKeyUpRuleName(event): void {
    const target = event.target;
    const value = target.value.replace(/ /g, '');
    if (value.substr(0, 3) === 'cr_') {
      target.value = value.substr(3);
    } else {
      target.value = value;
    }
    if (event.key === ' ') {
      event.preventDefault();
    }
  }
  /**
   * mode 변경 이벤트 핸들러
   * @param data
   */
  onChangeMode(data: {mode: 'list' | 'view' | 'modify' | 'register', name: string}): void {
    this.mode = data.mode;
    this.name = data.name;
    if (data.mode === 'modify') {
      this.ownerItems = [];
      this._userItems = [];
      this.getOwners();
      this.getUsers();
    }
  }

}
