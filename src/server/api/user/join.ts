import db from '../../db';
import {JoinDupcheck, JoinJoin} from '../../../app/properties';

export function join(req, res, next) {
  const command = req.params.command;
  if (command === 'dupcheck') {
    const id = req.body.id;

    if (!id) {
      res.json({success: false, messageCode: '', status: JoinDupcheck.INVALID_ID});
    } else {
      db.any('SELECT id from tb_user where id = $1', id)
        .then(function (data) {
          if (data.length > 0) {
            res.json({success: false, messageCode: '', status: JoinDupcheck.ALREADYUSE_ID});
          } else {
            res.json({success: true, messageCode: '', status: JoinDupcheck.OK});
          }
        })
        .catch(function (error) {
          console.log('ERROR:', error);
          res.json({success: false, messageCode: error, status: JoinDupcheck.ERROR});
        });
    }
  } else if (command === 'join') {
    const id = req.body.id;
    const pw = req.body.pw;
    const nm = req.body.nm;
    const phone = req.body.phone;
    const comp_nm = req.body.comp_nm;
    const nat_cd = req.body.nat_cd;

    if (!id) {
      res.json({success: false, messageCode: '', status: JoinJoin.INVALID_ID});
    } else if (!pw) {
      res.json({success: false, messageCode: '', status: JoinJoin.INVALID_PW});
    } else if (!nm) {
      res.json({success: false, messageCode: '', status: JoinJoin.INVALID_NM});
    } else if (!phone) {
      res.json({success: false, messageCode: '', status: JoinJoin.INVALID_HP});
    } else if (!comp_nm) {
      res.json({success: false, messageCode: '', status: JoinJoin.INVALID_COMPNM});
    } else if (!nat_cd) {
      res.json({success: false, messageCode: '', status: JoinJoin.INVALID_NATCD});
    } else {
      db.any('SELECT id from tb_user where id = $1', id)
        .then(function (data) {
          if (data.length > 0) {
            res.json({success: false, messageCode: '', status: JoinJoin.INVALID_ID});
          } else {
            db.one('SELECT nextval(\'seq_user\') as seq')
              .then(function (data2) {
                db.tx(t => {
                  const obj = {
                    seq: data2.seq,
                    id: id,
                    nm: nm,
                    phone: phone,
                    comp_nm: comp_nm,
                    nat_cd: nat_cd,
                    lvl: '1',
                    status : '2',
                    reg_user : data2.seq,
                    mod_user : data2.seq
                  };
                  db.none('INSERT INTO tb_user(${this:name}, pw) VALUES(${this:list}, sha256(\'' + pw + '\'))', obj);
                })
                  .then(rows => {
                    // console.log("postgresql: ", rows);
                    res.json({success: true, messageCode: '', status: JoinJoin.OK});
                  })
                  .catch(error => {
                    res.json({success: false, messageCode: error, status: JoinJoin.ERROR});
                  });
              });
          }
        })
        .catch(function (error) {
          console.log('ERROR:', error);
          res.json({success: false, messageCode: error, status: JoinJoin.ERROR});
        });
    }
  }

}
