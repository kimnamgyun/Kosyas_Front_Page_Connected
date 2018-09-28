import {AuthenticateLogout, AuthenticateLogin, FindId, FindPw, UpdatePw, JoinDupcheck, JoinJoin} from './user.enum';
import {ServerToken} from './server.enum';
import {Localization} from '../localization/localization';
import {LoglistList, LoglistUpdate, SystemList, SystemUpdate, UserSearch} from './admin.enum';
import {LocaleGet, LocaleSet} from './locale.enum';

export class Messages {
    private static _instance;
    static get instance() {
        if (!this._instance) {
            this._instance = new Messages();
        }
        return this._instance;
    }

    AuthenticateLogin: Map<AuthenticateLogin, string> = new Map<AuthenticateLogin, string>();
    AuthenticateLogout: Map<AuthenticateLogout, string> = new Map<AuthenticateLogout, string>();
    FindId: Map<FindId, string> = new Map<FindId, string>();
    FindPw: Map<FindPw, string> = new Map<FindPw, string>();
    UpdatePw: Map<UpdatePw, string> = new Map<UpdatePw, string>();
    JoinDupcheck: Map<JoinDupcheck, string> = new Map<JoinDupcheck, string>();
    JoinJoin: Map<JoinJoin, string> = new Map<JoinJoin, string>();

    ServerToken: Map<ServerToken, string> = new Map<ServerToken, string>();

    UserSearch: Map<UserSearch, string> = new Map<UserSearch, string>();
    SystemList: Map<SystemList, string> = new Map<SystemList, string>();
    SystemUpdate: Map<SystemUpdate, string> = new Map<SystemUpdate, string>();
    LoglistList: Map<LoglistList, string> = new Map<LoglistList, string>();
    LoglistUpdate: Map<LoglistUpdate, string> = new Map<LoglistUpdate, string>();

    LocaleGet: Map<LocaleGet, string> = new Map<LocaleGet, string>();
    LocaleSet: Map<LocaleSet, string> = new Map<LocaleSet, string>();

    constructor() {
        this.init();
    }

    init() {
      // 로그인
      this.AuthenticateLogin[AuthenticateLogin.OK] = Localization.pick('로그인 성공');
      this.AuthenticateLogin[AuthenticateLogin.FIRST_LOGIN_ADM] = Localization.pick('최초로 로그인하는 관리자입니다. 비밀번호 변경 후 이용하십시오');
      this.AuthenticateLogin[AuthenticateLogin.ID_PW_REQUIRED] = Localization.pick('아이디 또는 비밀번호가 없습니다.');
      this.AuthenticateLogin[AuthenticateLogin.INVALID_ID] = Localization.pick('아이디를 확인하십시오.');
      this.AuthenticateLogin[AuthenticateLogin.INVALID_PW_BLOCKED] = Localization.pick('비밀번호를 확인하십시오.(계정잠금)');
      this.AuthenticateLogin[AuthenticateLogin.INVALID_PW] = Localization.pick('비밀번호를 확인하십시오.');
      this.AuthenticateLogin[AuthenticateLogin.ACCOUNT_READY] = Localization.pick('아직 승인되지 않은 사용자입니다. 관리자에게 문의하십시오');
      this.AuthenticateLogin[AuthenticateLogin.ACCOUNT_DENIED] = Localization.pick('승인이 거부된 사용자입니다. 관리자에게 문의하십시오');
      this.AuthenticateLogin[AuthenticateLogin.ACCOUNT_EXPIRED] = Localization.pick('탈퇴한 사용자입니다');
      this.AuthenticateLogin[AuthenticateLogin.ACCOUNT_BLOCKED] = Localization.pick('로그인 실패 횟수 초과로 잠겨진 계정입니다. 관리자에게 문의하십시오');
      this.AuthenticateLogin[AuthenticateLogin.ACCOUNT_BLOCK] = Localization.pick('로그인 실패 횟수 초과로 계정이 잠금 처리 되었습니다. 관리자에게 문의하십시오');
      this.AuthenticateLogin[AuthenticateLogin.FIRST_LOGIN] = Localization.pick('임시비밀번호로 로그인하는 사용자입니다. 비밀번호 변경 후 이용하십시오');
      this.AuthenticateLogin[AuthenticateLogin.ERROR] = '';
      // 로그아웃
      this.AuthenticateLogout[AuthenticateLogout.OK] = Localization.pick('로그아웃 성공');
      this.AuthenticateLogout[AuthenticateLogout.OK] = Localization.pick('token값이 없습니다.');
      this.AuthenticateLogout[AuthenticateLogout.OK] = Localization.pick('만료 혹은 비정상 token 입니다');
      this.AuthenticateLogout[AuthenticateLogout.ERROR] = '';
      // FindId
      this.FindId[FindId.OK] = Localization.pick('ID 찾기 성공');
      this.FindId[FindId.INVALID_DATA] = Localization.pick('등록된 이름 또는 전화번호를 찾을수 없습니다.');
      this.FindId[FindId.DENIED_PERMOSSION_ID] = Localization.pick('승인이 거부된 사용자입니다. 관리자에게 문의하십시오');
      this.FindId[FindId.EXPIRED_ID] = Localization.pick('탈퇴한 사용자입니다');
      this.FindId[FindId.ERROR] = '';
      // FindPw
      this.FindPw[FindPw.OK] = Localization.pick('관리자 비밀번호 변경성공');
      this.FindPw[FindPw.INVALID_ID] = Localization.pick('아이디를 확인하십시오.');
      this.FindPw[FindPw.NOT_PERMOSSION_ID] = Localization.pick('아직 승인되지 않은 사용자입니다. 관리자에게 문의하십시오');
      this.FindPw[FindPw.DENIED_PERMOSSION_ID] = Localization.pick('승인이 거부된 사용자입니다. 관리자에게 문의하십시오');
      this.FindPw[FindPw.EXPIRED_ID] = Localization.pick('탈퇴한 사용자입니다');
      this.FindPw[FindPw.ERROR] = '';
      // UpdatePw
      this.UpdatePw[UpdatePw.OK] = Localization.pick('관리자 비밀번호 변경성공');
      this.UpdatePw[UpdatePw.INVALID_ID] = Localization.pick('아이디를 확인하십시오.');
      this.UpdatePw[UpdatePw.ERROR] = '';
      // JoinDupcheck
      this.JoinDupcheck[JoinDupcheck.OK] = Localization.pick('성공');
      this.JoinDupcheck[JoinDupcheck.INVALID_ID] = Localization.pick('아이디가 없습니다.');
      this.JoinDupcheck[JoinDupcheck.ALREADYUSE_ID] = Localization.pick('이미 사용중인 아이디입니다.');
      this.JoinDupcheck[JoinDupcheck.ERROR] = '';
      // JoinJoin
      this.JoinJoin[JoinJoin.OK] = Localization.pick('성공');
      this.JoinJoin[JoinJoin.INVALID_ID] = Localization.pick('아이디가 없습니다.');
      this.JoinJoin[JoinJoin.ALREADYUSE_ID] = Localization.pick('이미 사용중인 아이디입니다.');
      this.JoinJoin[JoinJoin.INVALID_PW] = Localization.pick('비밀번호 없습니다.');
      this.JoinJoin[JoinJoin.INVALID_NM] = Localization.pick('이름이 없습니다.');
      this.JoinJoin[JoinJoin.INVALID_HP] = Localization.pick('전화번호가 없습니다.');
      this.JoinJoin[JoinJoin.INVALID_COMPNM] = Localization.pick('회사명이 없습니다.');
      this.JoinJoin[JoinJoin.ALREADYUSE_ID] = Localization.pick('국가코드가 없습니다.');
      this.JoinJoin[JoinJoin.ERROR] = '';

      // ServerToken
      this.ServerToken[ServerToken.OK] = Localization.pick('성공');
      this.ServerToken[ServerToken.NO_TOKEN] = Localization.pick('token이 없습니다.');
      this.ServerToken[ServerToken.INVALID_TOKEN] = Localization.pick('만료 혹은 비정상 token 입니다.');
      this.ServerToken[ServerToken.INVALID_PERMISSION] = Localization.pick('권한이 없습니다.');
      this.ServerToken[ServerToken.ERROR] = '';

      // UserSearch
      this.UserSearch[UserSearch.OK] = Localization.pick('성공');
      this.UserSearch[UserSearch.ERROR] = '';

      // SystemList
      this.SystemList[SystemList.OK] = Localization.pick('성공');
      this.SystemList[SystemList.ERROR] = '';

      // SystemUpdate
      this.SystemUpdate[SystemUpdate.OK] = Localization.pick('시스템 등록이 완료 되었습니다.');
      this.SystemUpdate[SystemUpdate.NO_SEQ] = Localization.pick('seq가 없습니다. 관리자에게 문의하세요.');
      this.SystemUpdate[SystemUpdate.ERROR] = '';

      // LoglistList
      this.LoglistList[LoglistList.OK] = Localization.pick('성공');
      this.LoglistList[LoglistList.ERROR] = '';

      // LoglistUpdate
      this.LoglistUpdate[LoglistUpdate.OK] = Localization.pick('시스템 등록이 완료 되었습니다.');
      this.LoglistUpdate[LoglistUpdate.NO_SEQ] = Localization.pick('seq가 없습니다. 관리자에게 문의하세요.');
      this.LoglistUpdate[LoglistUpdate.ERROR] = '';

      // 다국어 설정 파일 가져오기
      this.LocaleGet[LocaleGet.OK] = Localization.pick('다국어 설정 파일 가져오기 성공');
      this.LocaleGet[LocaleGet.ERROR] = '';

      // 다국어 설정 파일 저장하기
      this.LocaleSet[LocaleSet.OK] = Localization.pick('다국어 설정 파일 저장하기 성공');
      this.LocaleSet[LocaleSet.ERROR] = '';
    }
}
