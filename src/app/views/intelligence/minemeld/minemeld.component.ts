import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AdminService, IntelligenceService} from '../../../services';
import {SystemSeq} from '../../../../app/properties';

@Component({
  selector: 'app-minemeld',
  templateUrl: './minemeld.component.html',
  styleUrls: ['./minemeld.component.scss']
})
export class MinemeldComponent implements OnInit {

  item = {url: ''};
  seq = SystemSeq.MINDMELD;

  constructor(
    private router: Router,
    private intelligenceService: IntelligenceService,
    private adminService: AdminService,
  ) { }

  ngOnInit() {
    this.onClick();
  }


  /**
   * 검색 click 이벤트
   * @param step
   */
  onClick() {
    this.adminService.systemSelect(this.seq, result => {
      if (result.success) {
        this.item = result.data;
      }
    });
  }

}
