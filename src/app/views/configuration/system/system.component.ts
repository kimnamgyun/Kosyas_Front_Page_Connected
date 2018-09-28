import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {AdminService, ConfigurationService} from '../../../services';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SystemSeq} from '../../../../app/properties';
import {Localization} from '../../../localization';

@Component({
  selector: 'app-user',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss']
})
export class SystemComponent implements OnInit {
  node = 0;
  indices = 0;
  shards = 0;
  docs = 0;
  disk = '';
  disk_percent = 0;
  orginItems: string[] = [];
  items: string[] = [];

  indexForm: FormGroup;

  data = {url: ''};
  seq = SystemSeq.CELEBRO;

  /**
   * 폼 그룹 반환
   * @returns {{[p: string]: AbstractControl}}
   */
  get indexGroup() {
    return this.indexForm.controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private configurationService: ConfigurationService,
    private adminService: AdminService,
  ) {}

  ngOnInit() {
    this.indexForm = this.formBuilder.group({
      item: ['', [Validators.required]],
    });
    // 위험항목 : 치명적
    this.configurationService.overview( result => {
      // System.instance.create(result);
      this.node = result.data.node;
      this.indices = result.data.indices;
      this.shards = result.data.shards;
      this.docs = result.data.docs;
      this.disk = result.data.disk;
      this.disk_percent = result.data.disk_percent;
    });
    this.getIndexList();
    this.getUrl();
  }
  getIndexList(): void {
    this.configurationService.indexList(result => {
      for (let i = 0; i < result.data.indices.length; i++) {
        if (result.data.indices[i].substring(0, 1) !== '.') {
          this.orginItems.push(result.data.indices[i]);
        }
      }
      this.items = this.orginItems;
      this.indexGroup.item.setValue(this.orginItems[0]);
    });
  }
  /**
   * 인덱스 라벨 모델
   * @returns {string}
   */
  get item() {
    return this.items.filter(item => item === this.indexGroup.item.value)
      .reduce(function (str: string, item) {
        return item;
      }, '');
  }

  onDelete() {
    if (confirm(Localization.pick('선택한 인덱스를 삭제 하시겠습니까?'))) {
      this.configurationService.indexExist(this.indexGroup.item.value, result => {
        if (result.data.result === 'success') {
          this.configurationService.indexDelete(this.indexGroup.item.value, result2 => {
            if (result2.data.result === 'success') {
              alert(Localization.pick('삭제되었습니다.'));
              this.getIndexList();
            } else {
              alert(result2.data.reason);
            }
          });
        } else {
          alert(result.data.reason);
        }
      });
    }
  }

  /**
   * 시스템 링크 url 조회
   * @param
   */
  getUrl() {
    this.adminService.systemSelect(this.seq, result => {
      if (result.success) {
        this.data = result.data;
      }
    });
  }

}
