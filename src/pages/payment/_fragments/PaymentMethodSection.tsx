import { Button } from "@components/Button.tsx"
import { Radio } from "@components/Radio.tsx"

interface PaymentMethodSectionProps {
  selectedPayment: "card" | "simple" | "virtual"
  simplePayment: "naver" | "kakao" | "payco"
  onPaymentMethodChange: (method: "card" | "simple" | "virtual") => void
  onSimplePaymentChange: (method: "naver" | "kakao" | "payco") => void
}

const PaymentMethodSection = ({
  selectedPayment,
  simplePayment,
  onPaymentMethodChange,
  onSimplePaymentChange,
}: PaymentMethodSectionProps) => {
  return (
    <div className="p-5 border-b-8 border-gray-50">
      <h2 className="text-gray-700 font-sb text-16px mb-4">결제수단</h2>
      <div className="flex flex-col">
        <Radio
          checked={selectedPayment === "card"}
          onChange={() => onPaymentMethodChange("card")}
          label="카드결제"
          className="py-4 border-b border-[#ECEFF2]"
        />

        <Radio
          checked={selectedPayment === "simple"}
          onChange={() => onPaymentMethodChange("simple")}
          label="간편결제"
          className="py-4"
        />

        {selectedPayment === "simple" && (
          <div className="pb-4 pl-9 flex gap-2">
            <Button
              variantType={simplePayment === "naver" ? "primary" : "grayLine"}
              sizeType="s"
              onClick={() => onSimplePaymentChange("naver")}
              className={`h-[40px] text-14px ${simplePayment === "naver" ? "font-[500]" : "font-[400]"}`}
            >
              네이버 페이
            </Button>
            <Button
              variantType={simplePayment === "kakao" ? "primary" : "grayLine"}
              sizeType="s"
              onClick={() => onSimplePaymentChange("kakao")}
              className={`h-[40px] text-14px ${simplePayment === "kakao" ? "font-[500]" : "font-[400]"}`}
            >
              카카오페이
            </Button>
            <Button
              variantType={simplePayment === "payco" ? "primary" : "grayLine"}
              sizeType="s"
              onClick={() => onSimplePaymentChange("payco")}
              className={`h-[40px] text-14px ${simplePayment === "payco" ? "font-[500]" : "font-[400]"}`}
            >
              페이코
            </Button>
          </div>
        )}

        <div className="border-b border-[#ECEFF2]" />

        <Radio
          checked={selectedPayment === "virtual"}
          onChange={() => onPaymentMethodChange("virtual")}
          label="가상계좌"
          className="py-4"
        />
      </div>
    </div>
  )
}

export default PaymentMethodSection
