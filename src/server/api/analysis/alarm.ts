import db from '../../db';
import {verifyToken, payloadValue} from '../../token';
import {AlarmList, Alarm} from '../../../app/properties';
import {readFile} from 'fs';
import {sendEmail} from '../../mail';
import * as path from 'path';
import {environment} from '../../environment';

export function alarm (req, res, next) {
  // console.log('in alarm.ts!!!!!!!');
  const command = req.params.command;
  const token = req.body.token;
  const rule_name = req.body.name;
  const users: {seq: number, id: string, lvl: number, status: string, email: boolean, web: boolean}[] = req.body.users;
  const keyword = req.body.keyword;
  const host = req.body.host;
  const hits = req.body.hits;
  const match = req.body.match;
  const str_time = req.body.timestamp;
  const seq = req.body.seq;


  if (command === 'outer') {
    db.none('insert into tb_alarm(rule_name,host,hits,match,str_time) values ($1, $2, $3, $4, $5)', [rule_name, host, hits, match, str_time])
      .then(function () {
        // 메일 발송
        db.any('select B.id ' +
          ' from tb_alarm_user A left outer join tb_user B on A.user_seq = B.seq ' +
          '  where A.email = true and B.status=\'2\' and B.del_flag = \'N\' and A.rule_name = $1'
          , [rule_name])
          .then(rows => {
            for (let i = 0; i < rows.length; i++) {
              // 메일을 날려주세요
              let ht0;
              let ht1;
              let ht2;
              let ht3;
              let ht4;
              let ht5;

              readFile(path.resolve(__dirname, '../../../mail/mail_alarm.html'), 'utf8', function(err, dt) {
                if (err) {
                  throw err;
                }
                // ht = dt.replace('@@hits@@', hits).replace(@@rule_name@@, rule_name).replace(@@host@@, host);
                ht0 = dt.replace('@@hits@@', hits);
                ht1 = ht0.replace('@@rule_name@@', rule_name);
                ht2 = ht1.replace('@@host@@', host);
                ht3 = ht2.replace('@@match@@', match);
                ht4 = ht3.replace('@@str_time@@', str_time);
                ht5 = ht4.replace(/@@url@@/gi, environment.apiBaseUrl.replace('/api', ''));
                sendEmail('mail@kosyas.com', rows[i].id, 'An alarm has occurred in ' + rule_name, ht5);
              });
              console.log(rows[i].id);
            }
             res.json({success: true, messageCode: '', status: Alarm.OK});
          })
          .catch(error => {
            res.json({success: false, messageCode: error, status: Alarm.ERROR});
          });
      })
      .catch(function (error) {
        // console.log('ERROR:', error);
         res.json({success: false, data: {}, messageCode: error, status: Alarm.ERROR});
      });
  } else {
    const pVal = payloadValue(token);

    // Token verify
    const userInfo = verifyToken(res, token);
    if (userInfo) {
      if (command === 'owners') {
        db.any('select B.seq, B.id, B.lvl, B.status, A.email, A.web ' +
          ' from tb_alarm_user A left outer join tb_user B on A.user_seq = B.seq ' +
          '  where A.rule_name = $1 and B.status not in (\'0\' ,\'1\') order by B.id asc'
          , [rule_name])
          .then(rows => {
            res.json({success: true, messageCode: '', data: {items: rows}, status: AlarmList.OK, token: userInfo.token});
          })
          .catch(error => {
            res.json({success: false, messageCode: error, status: AlarmList.ERROR, token: userInfo.token});
          });
      } else if (command === 'users') {
        let where = '';
        if (keyword !== '') {
          where = ' and id like  \'%' + keyword +  '%\' ';
        }
        db.any('select seq, id, lvl, status ' +
          ' from tb_user ' +
          '  where status = \'2\' ' + where + ' order by id asc'
          , [rule_name])
          .then(rows => {
            res.json({success: true, messageCode: '', data: {items: rows}, status: AlarmList.OK, token: userInfo.token});
          })
          .catch(error => {
            res.json({success: false, messageCode: error, status: AlarmList.ERROR, token: userInfo.token});
          });
      } else if (command === 'update') {
            const transactions = [];
            db.tx(t => {
              transactions[0] = t.none('delete from tb_alarm_user where rule_name = $1', [rule_name]);
              for (let i = 0; i < users.length; i++) {
                  transactions[i + 1] = t.none('INSERT INTO tb_alarm_user(user_seq,rule_name,email,web,reg_user) VALUES ($1, $2, $3, $4, $5)', [users[i].seq, rule_name, users[i].email, users[i].web, pVal.seq]);
              }
              // returning a promise that determines a successful transaction:
              return t.batch(transactions); // all of the queries are to be resolved;
            })
            .then(res.json({success: true, messageCode: '', status: Alarm.OK, token: userInfo.token}))
            .catch(error => {
              res.json({success: false, messageCode: error, status: Alarm.ERROR, token: userInfo.token});
            });
      } else if (command === 'alarm') {
          // 유효한  seq가 넘어오면 읽음 처리 후 select
          if (seq > -1) {
            db.none('update tb_alarm set read = true where seq = $1', [seq])
              .then(function () {
              })
              .catch(error => {
                res.json({success: false, data: {}, messageCode: error, status: Alarm.ERROR, token: userInfo.token});
              });
          }
        db.any('select seq, rule_name, str_time, match from tb_alarm where read = false and rule_name in (select rule_name from tb_alarm_user where web = true and user_seq = $1) order by seq desc limit 1', [pVal.seq])
          .then(rows => {
            db.any('select count(*) as cnt from tb_alarm where read = false and rule_name in (select rule_name from tb_alarm_user where web = true and user_seq = $1)', [pVal.seq])
              .then(rows2 => {
                const count: number = rows2[0]['cnt'];
                const item: {seq: number, rule_name: string, str_time: string, match: number} = rows[0];
                if (item) {
                  res.json({success: true, messageCode: '',
                    data: {count: count,
                      seq: item.seq, rule_name: item.rule_name, str_time: item.str_time, match: item.match},
                    status: Alarm.OK, token: userInfo.token});
                } else {
                  res.json({success: true, messageCode: '', data: {count: count, seq: -1, rule_name: '', str_time: '', match: 0}, status: Alarm.OK, token: userInfo.token});
                }
              })
              .catch(error => {
                res.json({success: false, messageCode: error, status: AlarmList.ERROR, token: userInfo.token});
              });
          })
          .catch(error => {
            res.json({success: false, messageCode: error, status: AlarmList.ERROR, token: userInfo.token});
          });
      } else {
        res.json({success: false, messageCode: 'command error!', status: Alarm.ERROR, token: userInfo.token});
      }
    } else {
      return;
    }
  }
}
