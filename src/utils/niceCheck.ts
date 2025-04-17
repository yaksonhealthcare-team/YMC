import { EncryptData } from "../apis/pass.api"

/**
 * NICE 본인 인증을 위한 폼을 생성하고 제출합니다.
 * @param data - NICE 본인 인증에 필요한 암호화된 데이터 (m, token_version_id, enc_data, integrity_value)
 */
export const checkByNice = async (data: EncryptData) => {
  // NOTE: 이 함수는 현재 페이지를 벗어나 NICE 인증 페이지로 이동시킵니다.
  const form = document.createElement("form")
  form.method = "post"
  form.action = "https://nice.checkplus.co.kr/CheckPlusSafeModel/checkplus.cb"
  // target을 설정하여 새 창이나 특정 프레임에서 열 수도 있습니다.
  // form.target = "_blank"; // 예: 새 창에서 열기

  const fields = {
    m: data.m,
    token_version_id: data.token_version_id,
    enc_data: data.enc_data,
    integrity_value: data.integrity_value,
  }

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      // 값이 있는 필드만 추가
      const input = document.createElement("input")
      input.type = "hidden"
      input.name = key
      input.value = String(value) // 명시적으로 문자열 변환
      form.appendChild(input)
    }
  })

  document.body.appendChild(form)
  try {
    form.submit()
  } catch (error) {
    console.error("NICE check form submission failed:", error)
    // 실패 시 폼 제거 및 사용자에게 알림 등의 후처리 필요
  } finally {
    // 성공/실패 여부와 관계없이 폼 제거 (페이지 이동으로 인해 실행되지 않을 수 있음)
    if (document.body.contains(form)) {
      document.body.removeChild(form)
    }
  }
}
