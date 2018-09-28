import {AbstractControl, ValidatorFn} from '@angular/forms';
import {ValidationErrors} from '@angular/forms/src/directives/validators';

export class CommonValidators {

  /**
   * 지정한 컨트롤의 값과 일치하는지 검사
   * @param component : 컴포넌트(this)
   * @param {string} formName : 컨트롤이 속한 폼
   * @param {string} targetName : 컨트롤명
   * @returns {ValidatorFn}
   */
  static match(component: any, formName: string, targetName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const form = component[formName];
      if (!form) {
        return null;
      }
      return form.get(targetName).value !== '' && form.get(targetName).value === control.value ? null : {match: true};
    };
  }
  /**
   * 이메일 형식 검사
   */
  static email(control: AbstractControl): ValidationErrors | null {
      const value: string = control.value;
      return value === '' || value.match(/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])+.[a-zA-Z]{2,3}$/i) ? null : {email: true};
  }
}
