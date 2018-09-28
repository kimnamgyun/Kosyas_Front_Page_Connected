import { Pipe, PipeTransform } from '@angular/core';

export class Common {
    static pad(num: number, size: number): string {
        let s = num + '';
        while (s.length < size) { s = '0' + s; }
        return s;
    }
    /**
     * 옵션 목록에서 value에 해당하는 value를 가진 옵션의 label 반환
     * @param options
     * @param value
     */
    static getLabel(options: {label: string, value: number | string}[], value: number | string): string {
        return options.filter(option => option.value === value)
            .reduce((str: string, option) => {
                return option.label;
            }, '');
    }
}