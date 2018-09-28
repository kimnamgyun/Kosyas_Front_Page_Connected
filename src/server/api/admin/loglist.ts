// getUrl/admin/loglist.ts

import * as express from 'express';
// const router   = express.Router();
import db from '../../db';
import {makeToken, verifyToken, payloadValue, blockToken} from '../../token';
import {LoglistList, LoglistUpdate, ServerToken} from '../../../app/properties';

/**
 * 아직 개발중!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * @param req
 * @param res
 * @param next
 */

export function loglist (req, res, next) {
    const command = req.params.command;
    const token = req.body.token;
    const step = req.body.step;             // 화면 tab종류 ('login' : 로그인, 'action' : 행위추적)
    const startDate = req.body.startDate;   // 조회조건 (시작시간)
    const endDate = req.body.endDate;       // 조회조건 (종료시간)
    const act = req.body.act;               // 조회조건 (로그인 action)
    const typ = req.body.typ;               // 조회조건 (행위 type)
    const ac = req.body.ac;                // 조회조건 (헹위 action)
    const keyword = req.body.keyword;       // 조회조건 (아이디)
    const rowsSize = req.body.rowsSize;     // 한페이지 최대 rows
    const page = req.body.page;             // 페이지번호

    let tbl;

    // Token verify
    const userInfo = verifyToken(res, token);

    if (userInfo) {
      if (userInfo.lvl >= 5 ) {
        if (command === 'list') {

          if (step === 1) {
            tbl = 'tb_log_login';

            db.any('SELECT count(*) as total_cnt' +
              '  from ' + tbl + ' a' +
              '      ,tb_user b' +
              ' where 1=1' +
              '   and a.reg_user = b.seq' +
              '   and to_char(a.reg_date, \'yyyy-mm-dd\') between $1 and $2' +
              '   and  (((case when $4= \'\' then null' +
              '                when $4= \'0\'then null' +
              '                else $4' +
              '                 end) is null) or a.action = $4)' +
              '   and  (((case when $3 = \'\' then null' +
              '                else $3' +
              '                 end) is null) or id like  \'%\' || $3 || \'%\')'
              , [startDate, endDate, keyword, act])
              .then(rows => {
                db.any('SELECT a.reg_date as reg_date' +
                  '            ,b.id as id' +
                  '            ,a.action as action' +
                  '            ,a.cnt as cnt' +
                  '            ,coalesce(a.ip, \' \') as ip' +
                  '            ,case when a.action = \'1\' then \'LOGIN SUCCESS\' || \' : \' || coalesce(a.ip, \' \')' +
                  '                  when a.action = \'2\' then \'LOGIN FAIL\' || \' : \' || coalesce(a.ip, \' \')' +
                  '                  when a.action = \'3\' then \'LOGIN TOTAL \' || a.cnt || \' TIMES FAIL, ACCOUNT BLOCK \' || \' : \' || coalesce(a.ip, \' \')' +
                  '                  when a.action = \'4\' then \'LOGOUT \' || \' : \' || coalesce(a.ip, \' \')' +
                  '                  else \' \'' +
                  '                   end as contents' +
                  '  from ' + tbl + ' a' +
                  '      ,tb_user b' +
                  ' where 1=1' +
                  '   and a.reg_user = b.seq' +
                  '   and to_char(a.reg_date, \'yyyy-mm-dd\') between $1 and $2' +
                  '   and  (((case when $6= \'\' then null' +
                  '                when $6= \'0\'then null' +
                  '                else $6' +
                  '                 end) is null) or a.action = $6)' +
                  '   and  (((case when $3 = \'\' then null' +
                  '                else $3' +
                  '                 end) is null) or id like  \'%\' || $3 || \'%\')' +
                  '   order by a.reg_date desc' +
                  '   LIMIT $4 OFFSET $4*($5-1)'
                  , [startDate, endDate, keyword, rowsSize, page, act])
                  .then(dd => {
                    res.json({success: true, messageCode: '',  data: {totalRows: rows[0].total_cnt, page: page, keyword: keyword, step: step, items: dd}, status: LoglistList.OK, token: userInfo.token});
                  })
                  .catch(error => {
                    res.json({success: false, messageCode: error, status: LoglistList.ERROR, token: userInfo.token});
                  });
              })
              .catch(error => {
                res.json({success: false, messageCode: error, status: LoglistList.ERROR, token: userInfo.token});
              });
          } else {
            tbl = 'tb_log_action';

            db.any('SELECT count(*) as total_cnt\n' +
              '  from ' + tbl + ' a\n' +
              '      ,tb_user b\n' +
              ' where 1=1\n' +
              '   and a.reg_user = b.seq\n' +
              '   and to_char(a.reg_date, \'yyyy-mm-dd\') between $1 and $2' +
              '   and  (((case when $4= \'\' then null' +
              '                when $4= \'0\'then null' +
              '                else $4' +
              '                 end) is null) or a.type = $4)' +
              '   and  (((case when $5= \'\' then null' +
              '                when $5= \'0\'then null' +
              '                else $5' +
              '                 end) is null) or a.action = $5)' +
              '   and  (((case when $3 = \'\' then null' +
              '                else $3' +
              '                 end) is null) or id like  \'%\' || $3 || \'%\')'
              , [startDate, endDate, keyword, typ, ac])
              .then(rows => {
                db.any('SELECT a.reg_date as reg_date' +
                  '            ,b.id as id' +
                  '            ,a.action as action' +
                  '            ,a.action_seq as action_seq' +
                  '            ,a.type as type' +
                  '            ,(case when a.type = \'1\' then \'"연관분석" 에서 \'' +
                  '                  when a.type = \'2\' then \'"알림항목" 에서 \'' +
                  '                  when a.type = \'3\' then \'"사용자정보" 에서 \'' +
                  '                  when a.type = \'4\' then \'"관리자설정" 에서 \'' +
                  '                  when a.type = \'5\' then \'"가입하기" 에서 \'' +
                  '                  else \' \'' +
                  '                   end) || ' +
                  '             (case when a.action = \'I\' then \'"등록"\'' +
                  '                  when a.action = \'U\' then \'"수정"\'' +
                  '                  when a.action = \'D\' then \'"삭제"\'' +
                  '                  else \' \'' +
                  '                   end) as contents' +
                  '  from ' + tbl + ' a\n' +
                  '      ,tb_user b\n' +
                  ' where 1=1\n' +
                  '   and a.reg_user = b.seq\n' +
                  '   and to_char(a.reg_date, \'yyyy-mm-dd\') between $1 and $2' +
                  '   and  (((case when $6= \'\' then null' +
                  '                when $6= \'0\'then null' +
                  '                else $6' +
                  '                 end) is null) or a.type = $6)' +
                  '   and  (((case when $7= \'\' then null' +
                  '                when $7= \'0\'then null' +
                  '                else $7' +
                  '                 end) is null) or a.action = $7)' +
                  '   and  (((case when $3 = \'\' then null' +
                  '                else $3' +
                  '                 end) is null) or id like  \'%\' || $3 || \'%\')' +
                  '   order by a.reg_date desc' +
                  '   LIMIT $4 OFFSET $4*($5-1)'
                  , [startDate, endDate, keyword, rowsSize, page, typ, ac])
                  .then(dd => {
                    res.json({success: true, messageCode: '',  data: {totalRows: rows[0].total_cnt, page: page, keyword: keyword, step: step, items: dd}, status: LoglistList.OK, token: userInfo.token});
                  })
                  .catch(error => {
                    res.json({success: false, messageCode: error, status: LoglistList.ERROR, token: userInfo.token});
                  });
              })
              .catch(error => {
                res.json({success: false, messageCode: error, status: LoglistList.ERROR, token: userInfo.token});
              });
          }
        } else {
          res.json({success: false, messageCode: 'command error!', status: LoglistUpdate.ERROR, token: userInfo.token});
        }
      } else {
        res.json({success: false, messageCode: '', status: ServerToken.INVALID_PERMISSION});
      }
    } else {
      return;
    }
}

