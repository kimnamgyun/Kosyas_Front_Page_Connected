import app from './app';
import * as bodyParser from 'body-parser';
import {join} from './api/user/join';
import {login} from './api/user/authenticate';
import {find} from './api/user/find';
import {user} from './api/admin/user';
import {system} from './api/admin/system';
import {loglist} from './api/admin/loglist';
import {userInfoData} from './api/admin/userInfo';
import {alarm} from './api/analysis/alarm';
import * as express from 'express';
import * as path from 'path';
import {locale} from './api/locale';
import {extract} from './api/extract';

const port = 8080;

// Angular
app.get('*', function (req, res) {
  const indexFile = path.resolve(__dirname, '../html/index.html');
  res.sendFile(indexFile);
});

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'content-type');
  next();
});

app.use('/api/user/join', express.Router().post('/:command', join));

app.use('/api/user/authenticate', express.Router().post('/:command', login));

// findID/관리자 비번 최초변경
app.use('/api/user/find', express.Router().post('/:command', find));

// 관리자 설정 > 사용자 관리
app.use('/api/admin/user', express.Router().post('/:command', user));

// 관리자 설정 > 시스템 등록
app.use('/api/admin/system', express.Router().post('/:command', system));

// 관리자 설정 > 감사 로그
app.use('/api/admin/loglist', express.Router().post('/:command', loglist));

// 다국어 문자열 조회 및 저장
app.use('/api/locale', express.Router().post('/:command', locale));

// 다국어 문자열 추출
app.use('/api/extract', express.Router().post('/', extract));

// 사용자 정보
app.use('/api/admin/userInfoData', express.Router().post('/:command', userInfoData));

// 알람
app.use('/api/analysis/alarm', express.Router().post('/:command', alarm));


app.listen(port, (err) => {
  if (err) {
    return console.log(err);
  }

  return console.log(`server is listening on ${port}`);
});
