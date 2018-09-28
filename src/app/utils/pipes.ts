import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'label'})
export class LabelPipe implements PipeTransform {
    transform(value: string, options: {label: string, value: number | string}[]): string {
        return options.filter(option => option.value.toString() === value.toString())
            .reduce((str: string, option) => {
                return option.label;
            }, '');
    }
}
