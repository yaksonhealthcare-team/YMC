/**
 * HTML 문자열에서 XSS 공격에 사용될 수 있는 위험한 태그와 속성을 제거합니다.
 * @param html HTML 문자열
 * @returns 안전하게 처리된 HTML 문자열
 */
export function sanitizeHtml(html: string): string {
  if (!html) return ""

  // DOMParser를 사용하여 HTML 파싱
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")

  // 위험한 태그 목록
  const dangerousTags = [
    "script",
    "iframe",
    "object",
    "embed",
    "form",
    "input",
    "button",
    "style",
  ]

  // 위험한 속성 목록
  const dangerousAttrs = [
    "onerror",
    "onload",
    "onclick",
    "onmouseover",
    "onmouseout",
    "onkeydown",
    "onkeypress",
    "onkeyup",
  ]

  // 위험한 태그 제거
  dangerousTags.forEach((tag) => {
    const elements = doc.getElementsByTagName(tag)
    for (let i = elements.length - 1; i >= 0; i--) {
      elements[i].parentNode?.removeChild(elements[i])
    }
  })

  // 모든 요소를 순회하며 위험한 속성 제거
  const allElements = doc.getElementsByTagName("*")
  for (let i = 0; i < allElements.length; i++) {
    const element = allElements[i]
    dangerousAttrs.forEach((attr) => {
      if (element.hasAttribute(attr)) {
        element.removeAttribute(attr)
      }
    })

    // href 속성 검사 - 화이트리스트 방식으로 안전한 프로토콜만 허용
    // javascript: URL은 eval()과 유사하게 코드를 실행할 수 있어 매우 위험함
    if (element.hasAttribute("href")) {
      const href = element.getAttribute("href")
      if (href) {
        // 허용된 프로토콜 목록 (화이트리스트 방식)
        const allowedProtocols = [
          "http:",
          "https:",
          "mailto:",
          "tel:",
          "#",
          "/",
        ]
        const normalizedHref = href.toLowerCase().trim()

        // 상대 경로나 허용된 프로토콜로 시작하는지 확인
        const isAllowed = allowedProtocols.some(
          (protocol) =>
            normalizedHref.startsWith(protocol) ||
            // 상대 경로 (프로토콜이 없는 경우)
            !normalizedHref.includes(":"),
        )

        if (!isAllowed) {
          // 허용되지 않은 프로토콜은 제거
          element.removeAttribute("href")
        }
      }
    }

    // src 속성 검사 - 화이트리스트 방식으로 안전한 프로토콜만 허용
    if (element.hasAttribute("src")) {
      const src = element.getAttribute("src")
      if (src) {
        // 허용된 프로토콜 목록 (화이트리스트 방식)
        const allowedProtocols = ["http:", "https:", "/"]
        // 허용된 data URI MIME 타입 (이미지만 허용)
        const allowedDataTypes = ["data:image/"]

        const normalizedSrc = src.toLowerCase().trim()

        // 상대 경로, 허용된 프로토콜, 또는 허용된 data URI로 시작하는지 확인
        const isAllowed =
          // 허용된 프로토콜로 시작하는 경우
          allowedProtocols.some((protocol) =>
            normalizedSrc.startsWith(protocol),
          ) ||
          // 상대 경로 (프로토콜이 없는 경우)
          !normalizedSrc.includes(":") ||
          // 허용된 data URI 타입으로 시작하는 경우
          allowedDataTypes.some((type) => normalizedSrc.startsWith(type))

        if (!isAllowed) {
          // 허용되지 않은 프로토콜은 제거
          element.removeAttribute("src")
        }
      }
    }
  }

  // 안전한 HTML 반환
  return doc.body.innerHTML
}

/**
 * 파일 업로드 시 파일 타입과 크기를 검증합니다.
 * @param file 검증할 파일
 * @param allowedTypes 허용된 MIME 타입 배열
 * @param maxSize 최대 파일 크기 (바이트)
 * @returns 검증 결과 객체
 */
export function validateFile(
  file: File,
  allowedTypes: string[] = ["image/jpeg", "image/jpg", "image/png"],
  maxSize: number = 5 * 1024 * 1024, // 기본 5MB
): { valid: boolean; message?: string } {
  // 파일 타입 검증
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      message: `허용된 파일 형식이 아닙니다. (${allowedTypes.join(", ")})`,
    }
  }

  // 파일 크기 검증
  if (file.size > maxSize) {
    return {
      valid: false,
      message: `파일 크기가 너무 큽니다. (최대 ${Math.floor(maxSize / 1024 / 1024)}MB)`,
    }
  }

  return { valid: true }
}

/**
 * 텍스트 입력에서 HTML 태그를 이스케이프 처리합니다.
 * @param text 이스케이프 처리할 텍스트
 * @returns 이스케이프 처리된 텍스트
 */
export function escapeHtml(text: string): string {
  if (!text) return ""

  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}
