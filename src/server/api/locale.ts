import * as csv2json from 'csvtojson';
import * as json2csv from 'json-to-csv';
import {LocaleGet, LocaleSet} from '../../app/properties/index';
import * as path from 'path';
import {verifyToken} from '../token';

/**
 * 다국어 CSV 파일 관리
 * @param req
 * @param res
 * @param next
 */
export function locale (req, res, next) {

    const command = req.params.command;

    if (command === 'get') {
        load(req, res, next);
    } else if (command === 'set') {
        save(req, res, next);
    }
}

/**
 * 다국어 CSV 파일 불러오기
 * @param req
 * @param res
 * @param next
 */
function load(req, res, next) {
    try {
        csv2json().fromFile(path.resolve(__dirname, '../language.csv'))
            .then(data => {
                res.json({success: true, status: LocaleGet.OK, messageCode: '', data: data});
            });
    } catch (error) {
        res.json({success: false, data: {}, messageCode: error, status: LocaleGet.ERROR});
    }
}
/**
 * 다국어 CSV 파일 저장하기
 * @param req
 * @param res
 * @param next
 */
function save(req, res, next) {

    const userInfo = verifyToken(res, req.body.token);

    if (!userInfo) {
        return;
    }
    json2csv(req.body.data, path.resolve(__dirname, '../language.csv'))
        .then(() => {
            res.json({success: true, status: LocaleSet.OK, messageCode: '', token: userInfo.token});
        })
        .catch(error => {
            res.json({success: false, data: {}, messageCode: error, status: LocaleSet.ERROR, token: userInfo.token});
        });

}
