import { Pipe, PipeTransform } from '@angular/core';
import {Localization} from './localization';

@Pipe({name: 'localize'})
export class LocalizePipe implements PipeTransform {
  transform(value: string): string {
    return Localization.pick(value);
  }
}
