import * as express from 'express';

import db from './db';
import * as path from 'path';
class App {
  express;

  constructor () {
    this.express = express();
    this.mountRoutes();
  }

  private mountRoutes (): void {
    const router = express.Router();
    router.post('/api/user/hello', (req, res, next) => {
      return res.json({
        message: 'Hello World!!!'
      });
    });

    this.express.use('/', router);

    // angular
    this.express.use(express.static(path.resolve(__dirname, '../html')));
  }

}
export default new App().express;

