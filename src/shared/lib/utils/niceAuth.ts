import { useOverlay } from '@/shared/ui/modal/ModalContext';
import { safeDecodeAndParseJson } from '@/_shared';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * NICE 본인 인증 API의 응답 데이터 구조 인터페이스.
 */
export interface NiceAuthResponse {
  resultCode: string; // 응답 코드 ("00"이면 성공)
  resultMessage: string; // 응답 메시지
  resultCount: string; // 결과 개수 (일반적으로 "1")
  body: {
    name: string; // 이름
    hp: string; // 휴대폰 번호
    birthdate: string; // 생년월일 (YYYYMMDD)
    sex: string; // 성별 코드
    nationality_type: string; // 내외국인 구분 코드
    token_version_id: string; // 토큰 버전 ID
    di: string; // 중복가입 확인값 (DI)
    ci: string; // 연계정보 (CI)
    is_social_exist: {
      E: string; // 이메일 존재 여부
      G: string; // 구글 존재 여부
      K: string; // 카카오 존재 여부
      N: string; // 네이버 존재 여부
      A: string; // 애플 존재 여부
    };
    is_id_exist: string;
  };
}

/**
 * NICE 본인 인증 콜백 데이터를 처리하고 결과를 반환하는 커스텀 훅.
 * 콜백 URL에서 받은 암호화된 데이터를 파싱하고 유효성을 검사합니다.
 * 오류 발생 시 모달을 표시하고 지정된 경로로 이동합니다.
 */
export const useNiceAuthCallback = () => {
  const { openModal } = useOverlay();
  const navigate = useNavigate();

  /**
   * NICE 인증 콜백 데이터(JSON 문자열)를 파싱하고 유효성을 검사하여 인증 정보를 반환합니다.
   * @param jsonData - URL 쿼리 파라미터 등에서 받은 인코딩된 JSON 문자열.
   * @param fallbackPath - 인증 실패 시 이동할 경로.
   * @returns 파싱 및 검증에 성공한 경우 인증 정보 객체(NiceAuthResponse["body"]), 실패 시 null.
   */
  const parseNiceAuthData = useCallback(
    (jsonData: string | null | undefined, fallbackPath: string): NiceAuthResponse['body'] | null => {
      try {
        if (!jsonData) {
          console.warn('parseNiceAuthData: No JSON data provided.');
          return null;
        }

        const decodedData = safeDecodeAndParseJson<NiceAuthResponse>(jsonData, {
          source: 'nice_auth_callback_jsonData',
          tags: { feature: 'nice_auth' }
        });
        if (!decodedData) {
          throw new Error('본인인증 응답 파싱에 실패했습니다.');
        }

        if (decodedData.resultCode !== '00') {
          console.error('NICE Authentication failed:', decodedData.resultCode, decodedData.resultMessage);
          throw new Error(decodedData.resultMessage || '본인인증에 실패했습니다.');
        }

        return decodedData.body;
      } catch (error) {
        console.error('NICE Authentication processing error:', error);
        const errorMessage = error instanceof Error ? error.message : '본인인증 처리 중 오류가 발생했습니다.';
        openModal({
          title: '인증 오류',
          message: errorMessage,
          onConfirm: () => {
            navigate(fallbackPath, { replace: true });
          }
        });
        return null;
      }
    },
    [navigate, openModal]
  );

  return { parseNiceAuthData };
};
