/**
 * HTTP 응답 구조체
 */
export class Result {
  /**
   * 요청 성공 여부
   */
  success: boolean;
  /**
   * 상태 코드
   */
  status: number;
  /**
   * 메시지 코드
   * 다국어 지원을 위해 코드로 사용
   * 다국어 변환 방식이 기본 언어의 내용을 키로 사용할 경우를 위해 문자열 타입으로 정함
   */
  messageCode: string;
  /**
   * 인증 토큰
   */
  token: string;
  /**
   * 결과 정보
   */
  data: any;
}
