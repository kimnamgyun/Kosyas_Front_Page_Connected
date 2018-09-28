import {BaseLocalStorage} from './base-local-storage';
import {Result} from './result';
import {User} from './user';

export class CurrentUser extends BaseLocalStorage {

  /**
   * 인스턴스
   * @returns {CurrentUser}
   */
  static get instance() {
    if (!this._instance) {
      this._instance = new CurrentUser('currentUser');
    }
    return this._instance;
  }
  private static _instance: CurrentUser;
  /**
   * 로컬 스토리지에 저장된 정보
   * @returns {Result}
   */
  get source(): Result {
    return this._source as Result;
  }
  /**
   * 인증 토큰
   * @returns {string}
   */
  get token(): string {
    return this.source ? this.source.token : '';
  }
  set token(value: string) {
    if (this.source) {
      this.source.token = value;
      this.flush();
    }
  }
  /**
   * 사용자 정보
   * @returns {User}
   */
  get data(): User {
    return this.source ? this.source.data as User : null;
  }

}
