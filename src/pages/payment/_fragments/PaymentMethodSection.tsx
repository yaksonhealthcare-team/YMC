import { Radio } from '@components/Radio.tsx';

interface PaymentMethodSectionProps {
  selectedPayment: 'card' | 'bank' | 'vbank';
  onPaymentMethodChange: (method: 'card' | 'bank' | 'vbank') => void;
}

const PaymentMethodSection = ({ selectedPayment, onPaymentMethodChange }: PaymentMethodSectionProps) => {
  return (
    <div className="p-5 border-b-8 border-gray-50">
      <h2 className="text-gray-700 font-sb text-16px mb-4">결제수단</h2>
      <div className="flex flex-col">
        <Radio
          checked={selectedPayment === 'card'}
          onChange={() => onPaymentMethodChange('card')}
          label="신용카드"
          className="py-4 border-b border-[#ECEFF2]"
        />

        <Radio
          checked={selectedPayment === 'bank'}
          onChange={() => onPaymentMethodChange('bank')}
          label="실시간계좌이체"
          className="py-4 border-b border-[#ECEFF2]"
        />

        <Radio
          checked={selectedPayment === 'vbank'}
          onChange={() => onPaymentMethodChange('vbank')}
          label="가상계좌"
          className="py-4"
        />
      </div>
    </div>
  );
};

export default PaymentMethodSection;
