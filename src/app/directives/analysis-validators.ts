import {AbstractControl, ValidatorFn} from '@angular/forms';
import {ValidationErrors} from '@angular/forms/src/directives/validators';

export class AnalysisValidators {
  /**
   * 지정한 목록 중 하나의 값과 일치하는지 검사
   * @param component
   */
  static match(component: {fieldOptions: string[]}): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control || control.value === '') {
        return null;
      }
      const compares: string[] = component.fieldOptions;
      return compares && compares.includes(control.value) ? null : {match: true};
    };
  }
}
