import { useOverlay } from '@/shared/ui/modal/ModalContext';
import { BasePaymentParams, OrderResponse, PaymentItem } from '@/entities/payment/model/Payment';
import { usePaymentStore } from './usePaymentStore';
import { authApi } from '@/_shared';

export const usePayment = () => {
  const { showToast } = useOverlay();
  const { points, selectedPaymentMethod, items } = usePaymentStore();

  const calculateTotalAmount = (items: PaymentItem[]) => {
    return items.reduce((total, item) => total + item.price * item.amount, 0) - points.usedPoints;
  };

  const requestPayment = async (orderData: OrderResponse) => {
    const appendInput = (name: string, value: string) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      return input;
    };

    const form = document.createElement('form');
    form.name = 'SendPayForm';
    form.method = 'post';
    form.action = 'https://mobile.inicis.com/smart/payment/';
    form.acceptCharset = 'euc-kr';

    const paymentMethod = selectedPaymentMethod?.toUpperCase() || 'CARD';

    // P_RESERVED 값 설정
    let pReserved = 'centerCd=Y'; // IDC 센터코드 수신 옵션

    // 계좌이체 시 뱅크페이 앱 스키마
    if (paymentMethod === 'BANK') {
      pReserved += '&appScheme=kftc-bankpay://';
    }

    const params: BasePaymentParams = {
      P_INI_PAYMENT: paymentMethod,
      P_MID: orderData.pg_info.P_MID,
      P_OID: orderData.pg_info.P_OID,
      P_AMT: String(orderData.pg_info.P_AMT),
      P_GOODS: orderData.pg_info.P_GOODS,
      P_UNAME: orderData.pg_info.P_UNAME,
      P_NEXT_URL: orderData.pg_info.P_NEXT_URL,
      P_NOTI_URL: orderData.pg_info.P_NOTI_URL,
      P_NOTI: `${orderData.orderSheet.orderid},${points.usedPoints || 0}`,
      P_CHARSET: 'utf8',
      P_HPP_METHOD: orderData.pg_info.P_HPP_METHOD,
      P_TIMESTAMP: orderData.pg_info.P_TIMESTAMP,
      P_RESERVED: pReserved,
      P_MOBILE: 'Y',
      P_APP_BASE: 'Y'
    };

    if (orderData.pg_info.P_VBANK_DT) {
      params.P_VBANK_DT = orderData.pg_info.P_VBANK_DT;
    }
    if (orderData.pg_info.P_VBANK_TM) {
      params.P_VBANK_TM = orderData.pg_info.P_VBANK_TM;
    }

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        form.appendChild(appendInput(key, String(value)));
      }
    });

    document.body.appendChild(form);
    form.submit();
  };

  const createMembershipOrder = async () => {
    const response = await authApi.post<OrderResponse>('/orders/memberships', {
      orders: items.map((item) => ({
        s_idx: item.s_idx,
        ss_idx: item.ss_idx,
        b_idx: item.b_type === '전지점' ? 0 : item.b_idx,
        brand_code: item.brand_code,
        amount: item.amount
      })),
      use_point: points.usedPoints
    });

    if (response.data.pg_info.P_AMT > calculateTotalAmount(items)) {
      response.data.pg_info.P_AMT = calculateTotalAmount(items);
    }

    return response.data;
  };

  const handlePayment = async () => {
    try {
      const response = await createMembershipOrder();

      if (response.resultCode !== '00') {
        showToast(response.resultMessage);
        return;
      }

      await requestPayment(response);
    } catch (error) {
      console.error('결제 요청 실패:', error);
      showToast('결제 요청에 실패했습니다.');
    }
  };

  return {
    calculateTotalAmount,
    handlePayment
  };
};
