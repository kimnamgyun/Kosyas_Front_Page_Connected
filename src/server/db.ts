
// db.js
import promise from 'bluebird';
import * as pgp from 'pg-promise';
import {environment} from './environment';

// const conString = 'postgres://sims:sims@coregen.ddns.net:5432/sims';
const conString = environment.dbUrl;
const db = pgp({promiseLib: promise})(conString);

export default db;
