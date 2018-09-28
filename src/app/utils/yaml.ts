import {AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';

export class Yaml {
  /**
   * Yaml 소스를 JSON 형태로 반환
   * @param source
   */
  static parse(source: string): object {
    const result = {};
    const sources: string[] = source.trim().split('\n\n');
    // console.log(JSON.stringify(sources));
    sources.forEach(item => {
      const index: number = item.indexOf(':');
      const key: string = item.substr(0, index).replace(/\s/g, '');
      const value: string = item.substr(index).replace(/\:\s*/, '');
      console.log(`${key} => \n${value}`);
      result[key] = this.getJSON(value);
    });
    return result;
  }
  /**
   * 해당 값을 가공하여 반환
   * @param item
   */
  private static getJSON(item: string): any {
    if (item.search(/\s*- /) === 0) { // 복수
      const source = item.split('\n');
      if (item.indexOf(':') === -1) { // 값
        const results = [];
        source.forEach(value => {
          results.push({item: this.getJSON(value.replace(/\s*-\s*/, ''))});
        });
        return results;
      } else { // : 존재
        const len = source.length;
        let counter = 0;
        let startIndex = 0;
        let compare = source[counter++];
        const results = {};
        if (compare.substr(compare.indexOf(':') + 1).replace(/\s/g, '') === '') { // 하위 값 존재
          // - propertyName: 케이스 없는 걸로 절충
          do {
            compare = source[counter];
            if (counter === len - 1 || (compare.search(/\s*- /) === 0 && compare.indexOf(':') > -1)) {
              if (counter === len - 1) { counter++; }
              const key = source[startIndex].replace(/\s*-\s*/, '').replace(/\s*:\s*/, '');
              results[key] = this.getJSON(source.slice(startIndex + 1, counter).join('\n'));
              startIndex = counter;
            }
          } while (++counter < len);
        } else {
          source.forEach(value => {
            const keyValuePair: string[] = value.split(/\s*:\s*/);
            const key = keyValuePair[0].replace(/s*-s*/, '');
            results[key] = this.getJSON(keyValuePair[1]);
          });
        }
        return results;
      }
    } else { // 단수
      if (item.indexOf(':') === -1 || item.indexOf('://') > -1) { // value
        if (!isNaN(Number(item))) {
          return Number(item);
        } else if (item === 'true' || item === 'false') {
          return item === 'true' ? true : false;
        } else {
          return item.replace(/\"/g, '');
        }
      } else {
        const index: number = item.indexOf(':');
        const key: string = item.substr(0, index).replace(/\s/g, '');
        const value: string = item.substr(index).replace(/\:\s*/, '');
        const result = {};
        result[key] = this.getJSON(value);
        return result;
      }
    }
  }
  /**
   * 해당 폼 그룹의 값을 변경
   * @param source
   * @param target
   */
  static patch(source: object, target: AbstractControl, validatorsConfig: {[key: string]: Validators | ValidatorFn} = null): void {
    let key: string;
    for (key of Object.keys(source)) {
      if (!target || !target.get(key)) {
        continue;
      }
      const value: any = source[key];
      const condition = typeof value;
      switch (condition) {
        case 'number':
        case 'string':
        case 'boolean':
        {
          target.get(key).setValue(value);
          break;
        }
        case 'object':
        {
          if (Array.isArray(value)) {
            const validators = validatorsConfig.hasOwnProperty(key) ? validatorsConfig[key] : null;
            (target.get(key) as FormArray).controls = [];
            (value as object[]).forEach(item => {
              (target.get(key) as FormArray).push(new FormGroup({
                item: new FormControl(item['item'], validators)
              }));
            });
          } else {
            this.patch(value, target.get(key), validatorsConfig);
          }
        }
      }
    }
  }
  /**
   * 해당 yaml 소스를 문자열로 반환
   * @param source
   */
  static stringify(source: object): string {
    // console.log(JSON.stringify(source));
    const results: string[] = [];
    let key;
    for (key of Object.keys(source)) {
      // console.log(key);
      const value = source[key];
      results.push(`\n\n${key}: ${this.getYaml(value, 0)}`);
    }
    return results.join('').trim();
  }
  /**
   * 미정
   * @param value
   * @param depths
   */
  static getYaml(value: any, depths: number): string {
    const results: string[] = [];
    const type = typeof value;
    switch (type) {
      case 'number':
      case 'boolean':
      case 'string':
      {
        results.push(`${value}`);
        break;
      }
      default:
      {
        const whiteSpace = ' '.repeat(4 * depths);
        if (Array.isArray(value)) {
          value.forEach(item => {
            results.push(`\n${whiteSpace}- "${item.item}"`);
          });
        } else {
          const obj = Object.keys(value);
          const startChar = obj.length > 1 ? '- ' : (depths === 0 ? '    ' : '');
          let key;
          for (key of obj) {
            results.push(`\n${whiteSpace}${startChar}${key}: `);
            results.push(`${this.getYaml(value[key], depths + 1)}`);
          }
        }
        break;
      }
    }
    return results.join('');
  }

}
