import { pass } from "../apis/pass.api.ts"

export const openPassPopup = async () => {
  try {
    const data = await pass()

    console.log("폼 데이터:", data)

    const form = document.createElement("form")
    form.method = "POST"
    form.action = "https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb"
    form.target = "popupChk"

    const formData = data["body"][0]

    console.log(formData)

    // https://devapi.yaksonhc.com/api/auth/crypto/checkplus_main.php 접속 하여 화면에 올라온 데이터 가져와서 테스트 해보기
    // const formData = {
    //   m: "service",
    //   token_version_id: "202412041634224F-NCB1CE264-91G1F-9BEADE0A1E",
    //   enc_data: "",
    //   integrity_value: "Sgc0LRoDgzhQnZsEYMZcoPn1w0ga06ENl/TC8FpBx10=",
    // }

    Object.entries(formData).forEach(([key, value]) => {
      const input = document.createElement("input")
      input.type = "hidden"
      input.name = key
      input.value = value as string
      form.appendChild(input)
    })

    document.body.appendChild(form)

    const popup = window.open(
      "about:blank",
      "popupChk",
      "width=500, height=550, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no",
    )

    if (!popup) {
      console.error("팝업이 차단되었습니다.")
      return
    }

    form.submit()
    document.body.removeChild(form)
  } catch (error) {
    console.error("PASS 팝업 실행 실패:", error)
  }
}
