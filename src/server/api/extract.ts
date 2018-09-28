import * as csv2json from 'csvtojson';
import * as json2csv from 'json-to-csv';
import {LocaleGet, LocaleSet} from '../../app/properties/index';
import * as path from 'path';
import {verifyToken} from '../token';
import {LocaleItem} from '../../app/models/locale-item';
import * as fs from 'fs';

/**
 * 다국어 CSV 파일 관리
 * @param req
 * @param res
 * @param next
 */
export function extract (req, res, next): void {
  const userInfo = verifyToken(res, req.body.token);

  if (!userInfo) {
    return;
  }
  const file = path.resolve(__dirname, '../language.csv');
  try {
    csv2json().fromFile(file)
      .then(data => {
        const items: LocaleItem[] = data as LocaleItem[];
        const foundItems: string[] = find(path.resolve(__dirname, '../../../src/app'));
        merge(res, file, items, foundItems);
      });
  } catch (error) {
    res.json({success: false, status: LocaleSet.ERROR, message: 'error in extract', token: userInfo.token});
  }
}
/**
 * 지정 폴더로 부터 다국어용 키를 검색해서 반환
 * @param source
 */
function find(source: string): string[] {
  const items = fs.readdirSync(source);
  let foundItems: string[] = [];
  items.forEach(item => {
    const fullPath = source + '/' + item;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      foundItems = foundItems.concat(find(fullPath));
    } else if (stat.isFile()) {
      const extension = path.parse(fullPath).ext;
      if (extension === '.ts' && fullPath.indexOf('.spec.') === -1) {
        console.log(fullPath);
        const results = extractTypscript(fullPath);
        if (results) {
          foundItems = foundItems.concat(results);
        }
      } else if (extension === '.html') {
        console.log(fullPath);
        const results = extractTemplate(fullPath);
        if (results) {
          foundItems = foundItems.concat(results);
        }
      }
    }
  });
  return foundItems;
}
/**
 * 타입스크립트 코드소스(*.ts)으로 부터 다국어용 키를 추출해서 반환
 * @param file
 */
function extractTypscript(file: string): string[] {
  const pattern = /(?<=Localization.pick\s*\(').+?(?='\))/g;
  const data: string = fs.readFileSync(file, 'utf-8');
  console.log(JSON.stringify(data.match(pattern)));
  return data.match(pattern);
}
/**
 * 템플릿(*.html)으로 부터 다국어용 키를 추출해서 반환
 * @param file
 */
function extractTemplate(file: string): string[] {
  const pattern = /(?<=\{{2}s*').+?(?='\s*\|\s*localize)/g;
  const data: string = fs.readFileSync(file, 'utf-8');
  // console.log(JSON.stringify(data.match(pattern)));
  return data.match(pattern);
}
/**
 * 다국어 CSV 파일 저장하기
 * @param req
 * @param res
 * @param next
 */
function merge(res, file, items, foundItems): void {
  let addItem: LocaleItem;
  let item: string;
  for (item of foundItems) {
    if (items.filter(compareItem => compareItem.key === item).length === 0) {
      addItem = new LocaleItem();
      addItem.key = addItem['ko-KR'] = item;
      items.push(addItem);
    }
  }
  json2csv(items, file)
    .then(() => {
      res.json({success: true, status: LocaleSet.OK});
    })
    .catch(error => {
      res.json({success: false, status: LocaleSet.ERROR, message: 'error in merge'});
    });
}
