// app/user/authenticate.ts

import db from '../../db';
import {makeToken, payloadValue, blockToken} from '../../token';
import {insertLoginLog} from '../common';
import {AuthenticateLogin, AuthenticateLogout} from '../../../app/properties';

export function login(req, res, next) {
  const command = req.params.command;
  console.log(command);
  let logData;
  logData = {};

  logData.ip = req.connection.remoteAddress;

  if (command === 'login') {
    const id = req.body.id;
    const pw = req.body.pw;
    const ip = req.body.ip;

    if (!id || !pw) {
      res.json({success: false, messageCode: '', status: AuthenticateLogin.ID_PW_REQUIRED});
    } else {
      // db.any('SELECT * from tb_user where id = $1 and pw = sha256($2)', [id, pw])
      db.any('select  a.* \n' +
        '   from (\n' +
        'select *, \'1\' as gbn\n' +
        '  from tb_user a\n' +
        ' where 1=1 and del_flag= \'N\' \n' +
        '   and id = $1\n' +
        'union all    \n' +
        'select *, \'2\' as gbn\n' +
        '  from tb_user' +
        '\n' +
        ' where 1=1 and del_flag= \'N\' \n' +
        '   and id = $1\n' +
        '   and pw = sha256($2)\n' +
        ') a\t   \n' +
        'order by gbn asc\t', [id, pw])
        .then(function (data) {
          if (data.length < 2) {

            if (data.length === 0) {
              res.json({success: false, messageCode: '', status: AuthenticateLogin.INVALID_ID});
            } else {

              // 로그인 실패시 login_fail_cnt 증가 및 5회 초과시 status 잠금(5) 처리
              db.none('UPDATE tb_user SET login_fa' +
                'il_cnt = login_fail_cnt+1, status = (case when login_fail_cnt >= 4 then \'5\' else status end) WHERE id = $1', id)
                .then(rows => {
                  logData.reg_user = data[0].seq;
                  logData.cnt = data[0].login_fail_cnt;

                  if (logData.cnt >= 4) {
                    // 로그인 로그 등록 (계정잠금)
                    logData.action = '3';
                    insertLoginLog(logData);

                    res.json({success: false, messageCode: '', status: AuthenticateLogin.INVALID_PW_BLOCKED});
                  } else {
                    // 로그인 로그 등록 (로그인 실패)
                    logData.action = '2';
                    insertLoginLog(logData);

                    res.json({success: false, messageCode: '', status: AuthenticateLogin.INVALID_PW});
                  }
                })
                .catch(error => {
                  res.json({success: false, messageCode: error, status: AuthenticateLogin.ERROR});
                });
            }
          } else {
            // status : 최초접근관리자계정 : 0, 승인대기 : 1, 승인완료 : 2, 승인거부 : 3, 탈퇴 : 4, 잠금 : 5
            if (data[0].status === '0') {

              // 로그인 로그 등록
              logData.action = '1';
              logData.reg_user = data[0].seq;
              insertLoginLog(logData);

              res.json({success: true, messageCode: '', status: AuthenticateLogin.FIRST_LOGIN_ADM, data: data[0], token: makeToken(data[0])});
            } else if (data[0].status === '1') {
              res.json({success: false, messageCode: '', status: AuthenticateLogin.ACCOUNT_READY});
            } else if (data[0].status === '3') {
              res.json({success: false, messageCode: '', status: AuthenticateLogin.ACCOUNT_DENIED});
            } else if (data[0].status === '4') {
              res.json({success: false, messageCode: '', status: AuthenticateLogin.ACCOUNT_EXPIRED});
            } else if (data[0].status === '5') {
              res.json({success: false, messageCode: '', status: AuthenticateLogin.ACCOUNT_BLOCKED});
            } else if (data[0].fail_cnt >= 5) {
              res.json({success: false, messageCode: '', status: AuthenticateLogin.ACCOUNT_BLOCK});
            } else if (data[0].pw_temp_yn === 'Y') {
                // 로그인 로그 등록
                logData.action = '1';
                logData.reg_user = data[0].seq;
                insertLoginLog(logData);

                res.json({success: true, messageCode: '', status: AuthenticateLogin.FIRST_LOGIN, data: data[0], token: makeToken(data[0])});
            } else {
              // 로그인 성공시 fail_cnt 초기화 처리
              db.none('UPDATE tb_user SET login_fail_cnt = 0 WHERE id = $1', id);

              // 로그인 로그 등록
              logData.action = '1';
              logData.reg_user = data[0].seq;
              insertLoginLog(logData);

              // res.json({success: true, messageCode: '로그인 성공', source:{id:source[1].id,nm:source[1].nm}, token:tk.makeToken(source[1])});
              res.json({success: true, messageCode: '', status: AuthenticateLogin.OK , data: data[0], token: makeToken(data[0])});
            }
          }
        })
        .catch(function (error) {
          // console.log('ERROR:', error);
          res.json({success: false, messageCode: error, status: AuthenticateLogin.ERROR});
        });
    }

  } else if (command === 'logout') {

    const token = req.body.token;
    const pVal = payloadValue(token);

    if (!token) {
      res.json({success: true, status: AuthenticateLogout.NO_TOKEN, messageCode: ''});
    } else if (!pVal) {
      res.json({success: true, status: AuthenticateLogout.INVALID_TOKEN, messageCode: ''});
    } else {
      // 로그인 로그 등록
      logData.action = '4';
      logData.reg_user = pVal.seq;
      insertLoginLog(logData);

      res.json({success: true, status: AuthenticateLogout.OK, messageCode: blockToken(token)});
    }
  }
}
