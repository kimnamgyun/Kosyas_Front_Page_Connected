// getUrl/admin/item.ts

import db from '../../db';
import {verifyToken} from '../../token';
import {ServerToken, SystemList, SystemUpdate} from '../../../app/properties';

// const router   = express.Router();

export function system (req, res) {
  const command = req.params.command;
  const token = req.body.token;
  const items = req.body.items;
  const seq = req.body.seq;

  // Token verify
  const userInfo = verifyToken(res, token);
  // const userInfo = true;

    if (command === 'list') {
      if (userInfo) {
        if (userInfo.lvl >= 5) {
          db.many('SELECT nm, addr, port from tb_system order by seq asc')
            .then(rows => {
              // console.log('postgresql: ', rows);


              res.json({success: true, messageCode: '', data: rows, status: SystemList.OK, token: userInfo.token});
            })
            .catch(error => {
              console.log('ERROR:', error);
              res.json({success: false, messageCode: error, status: SystemList.ERROR, token: userInfo.token});
            });
        } else {
          res.json({success: false, messageCode: '', status: ServerToken.INVALID_PERMISSION});
        }
      } else {
        return;
      }
    } else if (command === 'update') {
      if (userInfo) {
        if (userInfo.lvl >= 5) {
          const transactions = [];
          let item;
          db.tx(t => {
            for (let i = 0; i < 4; i++) {
              item = items[i];
              if (!item.addr) {
                res.json({success: false, messageCode: '', status: SystemUpdate.NO_SEQ, token: userInfo.token});
                // return false;
              } else {
                transactions[i] = t.none('UPDATE tb_system' +
                  ' SET addr = $1, mod_date = now(),' +
                  ' port = $2, mod_user = $4 WHERE seq = $3', [item.addr, item.port, i, userInfo.seq]);
              }
            }
            // returning a promise that determines a successful transaction:
            return t.batch(transactions); // all of the queries are to be resolved;
          })
            .then(res.json({success: true, messageCode: '', status: SystemUpdate.OK, token: userInfo.token}))
            .catch(error => {
              res.json({success: false, messageCode: error, status: SystemUpdate.ERROR, token: userInfo.token});
            });
        } else {
          res.json({success: false, messageCode: '', status: ServerToken.INVALID_PERMISSION});
        }
      } else {
        return;
      }
    } else if (command === 'select') {
      db.many('SELECT seq, nm, addr, port, case port when \'80\' then addr else addr || \':\' || port end as url from tb_system where seq = $1', [seq])
        .then(rows => {
          res.json({success: true, messageCode: '', data: rows[0], status: SystemList.OK, token: userInfo.token});
        })
        .catch(error => {
          res.json({success: false, messageCode: error, status: SystemList.ERROR, token: userInfo.token});
        });
    } else {
      res.json({success: false, messageCode: 'command error!', status: SystemUpdate.ERROR, token: userInfo.token});
    }
}


