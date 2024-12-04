import { useLayout } from "../../contexts/LayoutContext.tsx"
import { useEffect } from "react"

// TODO: Replace after getting real terms
export const sampleTerms = `
1. 개인정보의 처리 목적
<000>은 다음의 목적을 위하여 개인정보를 처리하고 있으며, 다음의 목적 이외의 용도로는 이용하지 않습니다.
– 고객 가입의사 확인, 고객에 대한 서비스 제공에 따른 본인 식별.인증, 회원자격 유지.관리, 물품 또는 서비스 공급에 따른 금액 결제, 물품 또는 서비스의 공급.배송 등

2. 개인정보의 처리 및 보유 기간
① ‘000’는 정보주체로부터 개인정보를 수집할 때 동의 받은 개인정보 보유․이용기간 또는 법령에 따른 개인정보 보유․이용기간 내에서 개인정보를 처리․보유합니다.

② 구체적인 개인정보 처리 및 보유 기간은 다음과 같습니다.
– 고객 가입 및 관리 : 카카오싱크를 통한 회원가입 및 카카오채널을 통한 관리
– 보유 기간 : 카카오채널 탈퇴 시, 즉시 삭제

3. 정보주체와 법정대리인의 권리·의무 및 그 행사방법 이용자는 개인정보주체로써 다음과 같은 권리를 행사할 수 있습니다.

① 정보주체는 ‘000’ 에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
개인정보 열람요구
오류 등이 있을 경우 정정 요구

4. 개인정보의 제3자 제공

1) 회사는 원칙적으로 이용자의 사전 동의를 받아 이용자들의 개인정보를 외부에 제공합니다. 다만, 아래의 경우에는 예외로 합니다.

① 법령의 규정에 의거하거나, 수사, 조사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관 및 감독당국의 요구가 있는 경우② 요금 정산을 위하여 필요한 경우③ 이용자 또는 제3자의 급박한 생명, 신체, 재산의 이익을 위하여 필요함에도 불구하고 동의를 받을 수 없는 경우
2) 회사는 원칙적으로 “1. 개인정보의 수집 및 이용”에서 고지한 범위 내에서 개인정보를 이용하거나 제3자에게 제공하며, 동 범위를 초과하여 이용하거나 제3자에게 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.
① 이용자들이 사전에 공개 또는 제3자 제공에 동의한 경우② 법령의 규정에 의거하거나, 수사, 조사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관 및 감독당국의 요구가 있는 경우
`

const ServiceTermsPage = () => {
  const { setHeader, setNavigation } = useLayout()

  useEffect(() => {
    setHeader({
      left: "back",
      backgroundColor: "bg-white",
      display: true,
    })
    setNavigation({ display: false })
  }, [])

  return (
    <div className={"px-5 py-4"}>
      <p className={"font-b text-24px"}>{"서비스 이용약관"}</p>
      <p className={"whitespace-pre-wrap text-gray-600"}>{sampleTerms}</p>
    </div>
  )
}

export default ServiceTermsPage
