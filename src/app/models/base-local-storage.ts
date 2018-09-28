export class BaseLocalStorage {

  /**
   * 로컬 스토리지 키 이름
   */
  private key: string;
  /**
   * 저장된 자료
   * @returns {object}
   */
  protected get _source(): object {
    return JSON.parse(localStorage.getItem(this.key));
  }

  constructor(key: string) {
    this.key = key;
  }

  /**
   * 해당 객체를 로컬 스토리지에 생성한다.
   * @param {object} source
   */
  create(source: object) {
    localStorage.setItem(this.key, JSON.stringify(source));
  }
  /**
   * 현재 상태를 로컬 스토리지에 반영한다.
   */
  protected flush() {
    localStorage.setItem(this.key, JSON.stringify(this._source));
  }
  /**
   * 로컬 스토리지에서 자신을 제거한다.
   */
  clear(): void {
    localStorage.removeItem(this.key);
  }
}
