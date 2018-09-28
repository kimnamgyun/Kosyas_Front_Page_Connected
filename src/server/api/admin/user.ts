// getUrl/admin/item.ts

import * as express from 'express';
import db from '../../db';
import {makeToken, verifyToken, payloadValue, blockToken} from '../../token';
import {UserSearch, SystemUpdate, FindPw, ServerToken} from '../../../app/properties';
import {System} from '../../../app/models/system';
import {startRow, insertActionLog, insertLoginLog} from '../common';

// const router   = express.Router();

export function user (req, res, next) {
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
    const currentPage = req.body.currentPage;
    const rowsSize = req.body.rowsSize;
    const id_t = id;
    const status_t = status;

    let logData;
    logData = {};

    logData.ip = req.connection.remoteAddress;

    const pVal = payloadValue(token);

    // Token verify
    const userInfo = verifyToken(res, token);
    // const userInfo = true;

    if (userInfo) {
      if (userInfo.lvl >= 5 ) {
        if (command === 'search') {
          db.any('select count(*) as totalrows from tb_user' +
            ' where  1=1' +
            '   and  del_flag != \'Y\'' +
            '   and  (((case when $1 = \'\' then null' +
            '                else $1' +
            '                 end) is null) or id like  \'%\' || $1 || \'%\')' +
            '   and  (((case when $2= \'\' then null' +
            '                when $2= \'0\'then null' +
            '                else $2' +
            '                 end) is null) or status = $2)'
            , [id, status, startRow(currentPage, rowsSize)])
            .then(function (data) {
                if (data.length === 0) {
                  res.json({success: false, messageCode: '', status: UserSearch.ERROR, data: {}, token: userInfo.token});
                } else {
                  db.any('SELECT * FROM (' +
                    'select ' +
                    '    seq,' +
                    '    id,' +
                    '    reg_date,' +
                    '    lvl,' +
                    '    status,' +
                    '    ROW_NUMBER () OVER (ORDER BY id)' +
                    '  from tb_user ' +
                    ' where  1=1' +
                    '   and  del_flag != \'Y\'' +
                    '   and  (((case when $1 = \'\' then null' +
                    '                else $1' +
                    '                 end) is null) or id like  \'%\' || $1 || \'%\')' +
                    '   and  (((case when $2= \'\' then null' +
                    '                when $2= \'0\'then null' +
                    '                else $2' +
                    '                 end) is null) or status = $2)' +
                    ') x WHERE ROW_NUMBER BETWEEN $3 AND $4' +
                    'order by x.id', [id, status, startRow(currentPage, rowsSize), currentPage * rowsSize])
                    .then(rows => {
                      res.json({success: true, messageCode: '', data: {totalRows: data[0].totalrows, page: currentPage, items: rows}, status: UserSearch.OK, token: userInfo.token});
                    })
                    .catch(error => {
                      res.json({success: false, messageCode: error, status: UserSearch.ERROR, token: userInfo.token});
                    });
                }
              }
            )
            .catch(error => {
              res.json({success: false, messageCode: error, status: UserSearch.ERROR, token: userInfo.token});
            });

        } else if (command === 'idList') {
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
            '      ,lvl = $7' +
            '      ,mod_date = current_date' +
            '      ,mod_user = $6' +
            ' where 1=1' +
            '   and seq = $1', [seq, nm, phone, comp_nm, nat_cd, pVal.seq, lvl])
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
        } else if (command === 'delete') {
          db.none('update tb_user' +
            '   set del_flag = \'Y\'' +
            '      ,mod_date = now()' +
            '      ,mod_user = $2' +
            ' where 1=1' +
            '   and seq = $1', [seq, pVal.seq])
            .then(rows => {
              // 엑션 로그 등록
              // 타입(연관분석:1/알람항목:2/사용자정보:3/관리자설정:4/가입하기:5)
              logData.type = '3';
              // 행위(등록:I/수정:U/삭제:D)
              logData.action = 'D';
              logData.reg_user = pVal.seq;
              insertActionLog(logData);

              res.json({success: true, messageCode: '', data: {}, status: UserSearch.OK, token: userInfo.token});
            })
            .catch(error => {
              res.json({success: false, messageCode: error, status: UserSearch.ERROR, token: userInfo.token});
            });
        } else if (command === 'statusUpdate') {
          db.none('update tb_user' +
            '   set status = $3' +
            '      ,mod_date = now()' +
            '      ,mod_user = $2' +
            ' where 1=1' +
            '   and seq = $1', [seq, pVal.seq, status])
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
        } else if (command === 'insert') {
          db.tx(t => {
            const obj = {
              id: id,
              pw: pw,
              nm: nm,
              phone: phone,
              comp_nm: comp_nm,
              nat_cd: nat_cd,
              lvl: lvl,
              reg_user: pVal.seq,
              status: '2',
              mod_user: pVal.seq,
              mod_date: 'now()'
            };
            db.none('INSERT INTO tb_user(${this:name}) VALUES(${this:list})', obj);
          })
            .then(rows => {
              // 엑션 로그 등록
              // 타입(연관분석:1/알람항목:2/사용자정보:3/관리자설정:4/가입하기:5)
              logData.type = '3';
              // 행위(등록:I/수정:U/삭제:D)
              logData.action = 'I';
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
        res.json({success: false, messageCode: '', status: ServerToken.INVALID_PERMISSION});
      }
    } else {
      return;
    }
}

