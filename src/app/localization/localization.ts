import {LocaleItem} from '../models/locale-item';

export class Localization {
    /**
     * 클래스 인스턴스
     * 싱글톤 패턴 구현
     * @returns {Localization}
     */
    static get instance() {
        if (!this._instance) {
            this._instance = new Localization();
        }
        return this._instance;
    }
    private static _instance;
    /**
     * 다국어 문자열 자료
     */
    data: LocaleItem[];
    /**
     * 설정 언어
     */
    language: string;

    /**
     * 생성자
     */
    constructor() {
        this.initLanguage();
    }

    /**
     * 해당하는 언어의 문자열 반환
     * 외부 노출용
     * @param {string} key
     * @returns {string}
     */
    static pick(key: string): string {
        return this.instance.pick(key);
    }
    /**
     * 해당하는 언어의 문자열 반환
     * 해당 키가 없는 경우 해당 키를 추가
     * @param {string} key
     * @returns {string}
     */
    pick(key: string): string {
        // console.log(key);
        if (!this.data) {
            console.log('다국어 현지화 오류');
            return key;
        }
        const foundItems = this.data.filter(item => item.key === key);
        if (foundItems.length > 0) {
            return foundItems[0][this.language];
        } else {
            // return '';
            return key;
/*
            const item = new LocaleItem();
            item.key = key;
            item['ko-KR'] = key;
            this.data.push(item);
            // console.log(JSON.stringify(this.data));
            return key;
*/
        }
    }
    /**
     * 사용자 언어 초기화
     * 로컬저장소에 설정이 없는 경우 현재 브라우져 언어로 설정하고 저장
     * @returns {string}
     */
    private initLanguage(): void {
        if (!localStorage.getItem('language')) {
            localStorage.setItem('language', navigator.language);
        }
        this.language = localStorage.getItem('language');
    }

    /**
     * 사용자 언어 설정
     * 해당 언어로 설정
     * @param language
     */
    setLanguage(language: string): void {
        localStorage.setItem('language', language);
        this.language = language;
    }
}
