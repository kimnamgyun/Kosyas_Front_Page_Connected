export enum AuthenticateLogin {
  OK,
  FIRST_LOGIN_ADM,
  ID_PW_REQUIRED,
  INVALID_ID,
  INVALID_PW_BLOCKED,
  INVALID_PW,
  ACCOUNT_READY,
  ACCOUNT_DENIED,
  ACCOUNT_EXPIRED,
  ACCOUNT_BLOCKED,
  ACCOUNT_BLOCK,
  FIRST_LOGIN,
  ERROR = 99,
}

export enum AuthenticateLogout {
  OK,
  NO_TOKEN,
  INVALID_TOKEN,
  ERROR = 99,
}

export enum FindId {
  OK,
  INVALID_DATA,
  DENIED_PERMOSSION_ID,
  EXPIRED_ID,
  ERROR = 99,
}

export enum FindPw {
  OK,
  INVALID_ID,
  NOT_PERMOSSION_ID,
  DENIED_PERMOSSION_ID,
  EXPIRED_ID,
  ERROR = 99,
}

export enum UpdatePw {
    OK,
    INVALID_ID,
    ERROR = 99,
}

export enum JoinDupcheck {
    OK,
    INVALID_ID,
    ALREADYUSE_ID,
    NOT_PERMOSSION_ID,
    ERROR = 99,
}

export enum JoinJoin {
    OK,
    INVALID_ID,
    INVALID_PW,
    INVALID_NM,
    INVALID_HP,
    INVALID_COMPNM,
    INVALID_NATCD,
    ALREADYUSE_ID,
    ERROR = 99,
}