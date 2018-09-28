import {ElementRef, HostListener} from '@angular/core';

export class BaseInputDirective {
  protected regex: RegExp = new RegExp(/[0-9]+([0-9]*){0,1}$/g);
  protected specialKeys: Array<string> = [ 'Backspace', 'Delete', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Enter' ];

  constructor(protected el: ElementRef) {}

  @HostListener('keydown', [ '$event' ])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}
