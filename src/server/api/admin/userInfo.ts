// getUrl/admin/item.ts

import * as express from 'express';
import db from '../../db';
import {makeToken, verifyToken, payloadValue, blockToken} from '../../token';
import {UserSearch, SystemUpdate, FindPw} from '../../../app/properties';
import {System} from '../../../app/models/system';
import {startRow, insertActionLog, insertLoginLog} from '../common';

// const router   = express.Router();

export function userInfoData (req, res, next) {
    const command = req.params.command;
    const token = req.body.token;
    const seq = req.body.seq;
    const id = req.body.id;
    const pw = req.body.pw;
    const nm = req.body.nm;
    const phone = req.body.phone;
    const comp_nm = req.body.comp_nm;
    const nat_cd = req.body.nat_cd;
    const lvl = req.body.lvl;
    const status = String(req.body.status);

    let logData;
    logData = {};

    const pVal = payloadValue(token);

    // Token verify
    const userInfo = verifyToken(res, token);
    // const userInfo = true;

    if (userInfo) {

        if (command === 'select') {
            db.any('select seq, id, nm, phone, comp_nm, nat_cd, lvl from tb_user where seq = $1', [seq])
                .then(rows => {
                    res.json({success: true, messageCode: '', data: rows[0], status: UserSearch.OK, token: userInfo.token});
                })
                .catch(error => {
                    res.json({success: false, messageCode: error, status: UserSearch.ERROR, token: userInfo.token});
                });
        } else if (command === 'update') {
          db.none('update tb_user' +
            '   set nm = $2' +
            '      ,phone = $3' +
            '      ,comp_nm = $4' +
            '      ,nat_cd = $5' +
            '      ,mod_date = current_date' +
            '      ,mod_user = $6' +
            ' where 1=1' +
            '   and seq = $1', [seq, nm, phone, comp_nm, nat_cd, pVal.seq])
            .then(rows => {
              // 엑션 로그 등록
              // 타입(연관분석:1/알람항목:2/사용자정보:3/관리자설정:4/가입하기:5)
              logData.type = '3';
              // 행위(등록:I/수정:U/삭제:D)
              logData.action = 'U';
              logData.reg_user = pVal.seq;
              insertActionLog(logData);

              res.json({success: true, messageCode: '', data: {}, status: UserSearch.OK, token: userInfo.token});
            })
            .catch(error => {
              res.json({success: false, messageCode: error, status: UserSearch.ERROR, token: userInfo.token});
            });
        } else if (command === 'pwUpdate') {
            db.none('update tb_user' +
                '   set pw = sha256($3)' +
                '      ,mod_date = now()' +
                '      ,mod_user = $2' +
                ' where 1=1' +
                '   and seq = $1', [seq, pVal.seq, pw])
                .then(rows => {
                    // 엑션 로그 등록
                    // 타입(연관분석:1/알람항목:2/사용자정보:3/관리자설정:4/가입하기:5)
                    logData.type = '3';
                    // 행위(등록:I/수정:U/삭제:D)
                    logData.action = 'U';
                    logData.reg_user = pVal.seq;
                    insertActionLog(logData);

                    res.json({success: true, messageCode: '', data: {}, status: UserSearch.OK, token: userInfo.token});
                })
                .catch(error => {
                    res.json({success: false, messageCode: error, status: UserSearch.ERROR, token: userInfo.token});
                });
        } else {
            res.json({success: false, messageCode: 'command error!', status: SystemUpdate.ERROR, token: userInfo.token});
        }

    } else {
        return;
    }
}


