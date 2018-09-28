// getUrl/user/find.js

import db from '../../db';
import {makeRandomPw} from '../common';
import {login} from './authenticate';
import {FindId, FindPw, UpdatePw} from '../../../app/properties';
import {makeToken, verifyToken} from '../../token';
import {sendEmail} from '../../mail';
import {readFile} from 'fs';
import * as path from 'path';
import {environment} from '../../environment';
import {Localization} from '../../../app/localization';

export function find (req, res, next) {
    console.log('in find.js!!!!!!!');

    const command = req.params.command;
    const id = req.body.id;
    const pw = req.body.pw;
    const nm = req.body.nm;
    const seq = req.body.seq;
    const phone = req.body.phone;
    const token = req.body.token;

    if (command === 'findId') {

      db.any('SELECT id as org_id\n' +
        '\t  ,CONCAT(SUBSTR(id, 1, 2),lpad(\'\', length(id)-7,\'*\'),right(id, 5)) as id ,status from tb_user  where nm = $1 and phone = $2'
        , [nm, phone])
        .then(function (data) {
          if (data.length === 0) {
            res.json({success: false, messageCode: '', status: FindId.INVALID_DATA});
          } else {
            // status : 최초접근관리자계정 : 0,승인대기 : 1,승인완료 : 2,승인거부 : 3,탈퇴 : 4
            if (data[0].status === '3') {
              res.json({success: false, messageCode: '', status: FindId.DENIED_PERMOSSION_ID});
            } else if (data[0].status === '4') {
              res.json({success: false, messageCode: '', status: FindId.EXPIRED_ID});
            } else {
              res.json({
                success: true,
                messageCode: FindId.OK,
                data: {id: data[0].id}
              });
            }
          }
        })
        .catch(function (error) {
          // console.log('ERROR:', error);
          res.json({success: false, messageCode: error, status: FindId.ERROR});
        });

    } else if (command === 'findPassword') {
      db.any('SELECT id, nm, status from tb_user where id = $1', [id])
        .then(function (dtt) {
          if (dtt.length === 0) {
            res.json({success: false, messageCode: '', data: {}, status: FindPw.INVALID_ID});
          } else {
            db.any('SELECT id, nm, status from tb_user where id = $1', [id])
              .then(function (data) {
                if (data.length === 0) {
                  res.json({success: false, messageCode: '', status: FindPw.INVALID_ID, data: {}});
                } else {
                  // status : 최초접근관리자계정 : 0,승인대기 : 1,승인완료 : 2,승인거부 : 3,탈퇴 : 4
                  if (data[0].status === '1') {
                    res.json({success: false, messageCode: '', status: FindPw.NOT_PERMOSSION_ID, data: {}});
                  } else if (data[0].status === '3') {
                    res.json({success: false, messageCode: '', status: FindPw.DENIED_PERMOSSION_ID, data: {}});
                  } else if (data[0].status === '4') {
                    res.json({success: false, messageCode: '', status: FindPw.EXPIRED_ID, data: {}});
                  } else {
                    // validation 성공시 pw update
                    const randomPw = makeRandomPw(12);

                    db.none('update tb_user\n' +
                      '   set pw = sha256($2)\n' +
                      '      ,pw_temp_yn = \'Y\'\n' +
                      ' where 1=1\n' +
                      '   and id = $1', [id, randomPw])
                      .then(function () {
                        // email 전송
                        let ht;
                        let ht2;

                        readFile(path.resolve(__dirname, '../../../mail/mail_pw.html'), 'utf8', function(err, dt) {
                          if (err) {
                            throw err;
                          }
                          ht = dt.replace('@@randomPw@@', randomPw);
                          ht2 = ht.replace(/@@url@@/gi, environment.apiBaseUrl.replace('/api', ''));

                          sendEmail('mail@kosyas.com', id, '임시비밀번호가 생성되었습니다.', ht2);
                          // sendEmail('mail@kosyas.com', id, Localization.pick('임시비밀번호가 생성되었습니다.'), ht2);
                        });
                        res.json({success: true, messageCode: '', status: FindPw.OK, data: {}});
                      })
                      .catch(function (error) {
                        // console.log('ERROR:', error);
                        res.json({success: false, data: {}, messageCode: error, status: FindPw.ERROR});
                      });
                  }
                }
              })
              .catch(function (error) {
                // console.log('ERROR:', error);
                res.json({success: false, data: {}, messageCode: error, status: FindPw.ERROR});
              });
          }
        })
        .catch(function (error) {
          res.json({success: false, messageCode: error, status: FindPw.ERROR});
        });
    } else if (command === 'updateadmpw') {

        // 최초 접근 관리자 계정 비밀번호 변경
        db.any('SELECT id, nm, status from tb_user where id = $1', [id])
          .then(function (data) {
            if (data.length === 0) {
              res.json({success: false, messageCode: '', data: {}, status: UpdatePw.OK});
            } else {
              // status : 최초접근관리자계정 : 0,승인대기 : 1,승인완료 : 2,승인거부 : 3,탈퇴 : 4
              // validation 성공시 pw update
              db.none('update tb_user\n' +
                '   set pw = sha256($2)\n' +
                '      ,status = \'2\'\n' +
                '      ,pw_temp_yn = \'N\'\n' +
                ' where 1=1\n' +
                '   and id = $1\n', [id, pw])
                .then(function () {
                  req.params.command = 'login';
                  // res.json({success: true, messageCode: '관리자 비밀번호 변경성공', data:{id:id, pw:pw}, status:0, token:userInfo.token});
                  login(req, res, next);
                })
                .catch(function (error) {
                  // console.log('ERROR:', error);
                  res.json({success: false, data: {}, messageCode: error, status: UpdatePw.ERROR});
                });

            }
          })
          .catch(function (error) {
            // console.log('ERROR:', error);
            res.json({success: false, data: {}, messageCode: error, status: UpdatePw.ERROR});
          });
    }

}
