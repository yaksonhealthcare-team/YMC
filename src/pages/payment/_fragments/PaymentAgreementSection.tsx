interface PaymentAgreementSectionProps {
  isAgreed: boolean
  onAgreementChange: (checked: boolean) => void
}

import { usePaymentGuideMessages } from "../../../hooks/useGuideMessages"

const PaymentAgreementSection = ({
  isAgreed,
  onAgreementChange,
}: PaymentAgreementSectionProps) => {
  const { paymentMessage, isLoading: isGuideMessageLoading } = usePaymentGuideMessages()
  
  return (
    <>
      <div className="p-5">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isAgreed}
            onChange={(e) => onAgreementChange(e.target.checked)}
            className=""
            style={{
              appearance: "none",
              width: "20px",
              minWidth: "20px",
              height: "20px",
              borderRadius: "4px",
              backgroundColor: isAgreed ? "#F37165" : "white",
              border: isAgreed ? "1px solid #F37165" : "1px solid #DDDDDD",
              backgroundImage: isAgreed
                ? `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")`
                : "none",
            }}
          />
          <span className="text-black text-14px font-r">
            상품, 가격, 할인정보, 유의사항 등을 확인하였으며 구매에 동의합니다.
            (필수)
          </span>
        </label>
      </div>

      {(!isGuideMessageLoading && paymentMessage) && (
        <div className="px-5 py-3 bg-gray-50">
          <p className="text-gray-500 text-12px font-m">
            {paymentMessage}
          </p>
        </div>
      )}
    </>
  )
}

export default PaymentAgreementSection
