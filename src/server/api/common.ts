
import db from '../db';



export function insertLoginLog (data) {
  db.tx(t => {
    const obj = {
        action: data.action,
        ip : data.ip,
        cnt : data.cnt  ,
      reg_user : data.reg_user
  };
    db.none('INSERT INTO tb_log_login(${this:name}) VALUES(${this:list})', obj);
  })
    .then(rows => {
      return true;
    })
    .catch(error => {
      return false;
    });
}

export function insertActionLog (data) {
  db.tx(t => {
    const obj = {
      type: data.type,
      action: data.action,
      action_seq : data.action_seq,
      reg_user : data.reg_user
    };
    db.none('INSERT INTO tb_log_action(${this:name}) VALUES(${this:list})', obj);
  })
    .then(rows => {
      return true;
    })
    .catch(error => {
      return false;
    });
}

/**
 * 임의 비밀번호 10자리 생성
 * @return
 */
export function makeRandomPw (cnt) {
  const arrPass = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    '?', '=', '.', '*', '[', '~', '`', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', ']'];

  let ranPw = '';
  for (let i = 0; i < cnt; i++) {
    const selectRandomPw = Math.floor(Math.random() * arrPass.length); // Math.rondom()은 0.0이상 1.0미만의 난수를 생성해 준다.
    ranPw += arrPass[selectRandomPw];
  }
  console.log('ranPw:', ranPw);

  const reg = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[~`!@#$%\\^&*()-])/;
  const rst = reg.test(ranPw);

  if (rst) {
    return ranPw;
  } else {
    return this.makeRandomPw(cnt);
  }
}

/**
 * 페이징 start Row 계산
 * @return
 */
export function startRow (currentPage, rowSize) {
  return (currentPage - 1) * rowSize + 1;
}
