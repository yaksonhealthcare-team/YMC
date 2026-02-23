import { fetchPoints } from '@/entities/point/api/points.api';
import LoadingIndicator from '@/shared/ui/loading/LoadingIndicator';
import { useOverlay } from '@/shared/ui/modal/ModalContext';
import { usePaymentStore } from '@/features/payment/lib/usePaymentStore';
import { PaymentResponse, PaymentStatus } from '@/entities/payment/model/Payment';
import { safeDecodeAndParseJson } from '@/shared/lib/utils/sentry.utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CARD_CODE_MAP: { [key: string]: string } = {
  '01': '외환카드',
  '03': '롯데카드',
  '04': '현대카드',
  '06': '국민카드',
  '11': 'BC카드',
  '12': '삼성카드',
  '14': '신한카드',
  '15': '한미카드',
  '16': 'NH카드',
  '17': '하나SK카드',
  '21': '글로벌BC카드',
  '22': '제주카드',
  '23': '광주카드',
  '24': '전북카드',
  '25': '씨티카드',
  '26': '우리카드',
  '32': '우체국카드',
  '33': '저축은행카드',
  '34': 'MG새마을금고카드',
  '35': '전북은행카드',
  '36': '광주은행카드',
  '37': '카카오뱅크카드',
  '38': '케이뱅크카드',
  '39': '페이코',
  '41': '신협카드',
  '42': 'KDB산업은행카드',
  '43': '제주은행카드',
  '44': '현대증권카드',
  '48': '신협체크카드',
  '51': '삼성증권카드',
  '52': '케이뱅크카드',
  '54': '카카오뱅크카드',
  '55': '토스뱅크카드',
  '56': '토스페이먼츠',
  '71': 'AmericanExpress',
  '91': '네이버페이',
  '93': '토스페이',
  '94': 'SSG페이',
  '95': '카카오페이',
  '96': '페이코',
  '97': 'L페이',
  '98': '삼성페이'
};

export default function PaymentCallbackPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { openModal } = useOverlay();
  const { setPaymentStatus, clear: clearPayment } = usePaymentStore();
  const queryClient = useQueryClient();

  const { data: availablePoint = 0 } = useQuery({
    queryKey: ['points'],
    queryFn: () => fetchPoints(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: false
  });

  useEffect(() => {
    console.group('💰 결제 콜백 데이터');

    // 이니시스 결제 응답 파라미터
    const searchParams = new URLSearchParams(location.search);

    // jsonData 파싱
    const jsonDataStr = searchParams.get('jsonData');
    if (!jsonDataStr) {
      console.error('❌ jsonData가 없습니다.');
      setPaymentStatus(PaymentStatus.FAILED);
      navigate('/payment/failed', {
        state: {
          message: '결제 정보를 받아올 수 없습니다.'
        }
      });
      return;
    }

    try {
      const jsonData = safeDecodeAndParseJson<PaymentResponse>(jsonDataStr, {
        source: 'payment_callback_jsonData',
        tags: { feature: 'payment_callback' }
      });
      if (!jsonData) {
        throw new Error('결제 콜백 데이터 파싱 실패');
      }

      // 필수 데이터 검증
      if (!jsonData.body?.orderid || !jsonData.body?.items || !jsonData.body?.pay_info) {
        console.error('❌ 필수 결제 정보 누락:', { body: jsonData.body });
        setPaymentStatus(PaymentStatus.FAILED);
        navigate('/payment/failed', {
          state: {
            message: '결제 정보가 올바르지 않습니다.'
          }
        });
        return;
      }

      // 결제 실패 처리
      if (jsonData.resultCode !== '00') {
        console.error('❌ 결제 실패:', jsonData.resultMessage);
        setPaymentStatus(PaymentStatus.FAILED);
        navigate('/payment/failed', {
          state: {
            message: jsonData.resultMessage || '결제에 실패했습니다.'
          }
        });
        return;
      }

      // 결제 성공 처리

      setPaymentStatus(PaymentStatus.COMPLETED);

      // 결제 성공 시 포인트 정보 갱신
      queryClient.invalidateQueries({ queryKey: ['points'] });

      const payInfo = jsonData.body.pay_info;
      const cardName =
        payInfo.type === 'CARD' ? CARD_CODE_MAP[payInfo.cardcd] || payInfo.cardname || '알 수 없는 카드' : undefined;

      navigate('/payment/complete', {
        state: {
          orderId: jsonData.body.orderid,
          type: 'additional',
          items: jsonData.body.items,
          paymentMethod: jsonData.body.pay_info?.type,
          cardPaymentInfo:
            payInfo.type === 'CARD'
              ? {
                  cardName,
                  installment: payInfo.quota === '00' ? '일시불' : `${payInfo.quota}개월`
                }
              : undefined,
          vbankInfo:
            payInfo.type === 'VBANK'
              ? {
                  bankName: payInfo.bankname,
                  bankCode: payInfo.bankcode,
                  account: payInfo.account,
                  accountName: payInfo.account_name,
                  limitDate: payInfo.limitdate
                }
              : undefined,
          amount_info: {
            total_amount: jsonData.body.amount_info.total_amount,
            discount_amount: jsonData.body.amount_info.discount_amount,
            point_amount: jsonData.body.amount_info.point_amount,
            payment_amount: jsonData.body.amount_info.payment_amount
          },
          point_info: {
            used_point: jsonData.body.point_info.used_point,
            remaining_point: jsonData.body.point_info.remaining_point
          },
          message: jsonData.resultMessage
        }
      });

      clearPayment();
    } catch (error) {
      console.error('❌ 결제 데이터 파싱 실패:', error);
      setPaymentStatus(PaymentStatus.FAILED);
      navigate('/payment/failed', {
        state: {
          message: '결제 정보 처리 중 오류가 발생했습니다.'
        }
      });
    }

    console.groupEnd();
  }, [location, navigate, setPaymentStatus, openModal, clearPayment, availablePoint]);

  return <LoadingIndicator className="min-h-screen" />;
}
