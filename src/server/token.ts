// token.ts
import * as jwt from 'jsonwebtoken';
import secretObj from './jwt';
import * as jwtBlacklist from 'jwt-blacklist';
import {ServerToken} from '../app/properties';
import {User} from '../app/models';

/*
jwtBlacklist(jwt).config({
  maxBlacklistPerUnit: 100000,
  error: 0.00001,
  unitType: 'h',
  expiresDuration: 1,
  fileName: 'blackList'
});
*/

export function makeToken (data): string {
  // const token = jwtBlacklist(jwt).sign({
    const token = jwt.sign({
      seq: data.seq,
      id: data.id,
      nm: data.nm,
      lvl: data.lvl,
    },
    secretObj.secret ,  // 비밀 키
    {
      expiresIn: 43200000  // 유효 시간은 30일
    });

  return token;
}


export function verifyToken (res, token): {token: string, seq: number, id: string, nm: string, lvl: number, exp: number, iat: number} {
  if (!token) {
    res.json({success: false, messageCode: '', status: ServerToken.NO_TOKEN});
    return null;
  } else {

    let decoded;
    try {
      // blackList error check
      // const eCheck = jwtBlacklist(jwt).verify(token, secretObj.secret);
      // console.log('blackList error check:' + eCheck);

      decoded = jwt.verify(token, secretObj.secret);

    } catch (exception) {

      res.json({success: false, messageCode: '', status: ServerToken.INVALID_TOKEN});
      return null;
    }

    if (decoded) {
      // res.json({success: true, message: "정상 token 입니다"});
      const data = Object();

      data.seq = decoded.seq;
      data.id = decoded.id;
      data.nm = decoded.nm;
      data.lvl = decoded.lvl;
      // console.log("source[] : ", source);
      const newToken = this.makeToken(data);

      decoded.token = newToken;

      // 구'Token block 처리
      // console.log(this.blockToken(token));

      return decoded;
    } else {
      res.json({success: false, messageCode: 'verify error!', status: ServerToken.ERROR});
      return null;
    }
  }

}


export function blockToken (token) {

  const msg = jwtBlacklist(jwt).blacklist(token);

  if (msg) {
    return 'Token has blackListed.';
  } else {
    return 'blockToken error!!!!';
  }

}

export function payloadValue (token) {

  try {
    const value = jwt.verify(token, secretObj.secret);
    return value;
  } catch (exception) {
    return false;
  }

}

