import { Directive, ElementRef } from '@angular/core';
import {BaseInputDirective} from './base-input-directive';

@Directive({
  selector: '[appPhoneOnly]'
})
export class PhoneOnlyDirective extends BaseInputDirective {

  constructor(protected el: ElementRef) {
    super(el);
    this.regex = new RegExp(/[0-9]+([0-9]*){0,1}$/g);
    this.specialKeys = this.specialKeys.concat(['-']);
  }

}
