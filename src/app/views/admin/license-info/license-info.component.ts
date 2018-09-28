import { Component, OnInit } from '@angular/core';
import {LicenseService} from '../../../services';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'app-user',
    templateUrl: './license-info.component.html',
    styleUrls: ['./license-info.component.scss']
})
export class LicenseInfoComponent implements OnInit {
    name = '';
    start = '';
    end = '';

    constructor(
      private licenseService: LicenseService) { }

    ngOnInit() {
      this.licenseService.licenseInfo(environment.siteId, result => {
        if (result.error === '0') {
          this.name = result.data.name;
          this.start = result.data.start;
          this.end = result.data.end;
        } else {
          alert(result.messageCode);
        }
      });
    }
}
