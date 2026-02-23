import { formatPriceKO } from '@/shared/lib/utils/format.utils';

/**
 * 정액권 / 횟수권 단위 변환
 */
export const formatAmount = (remainAmount: string, totalAmount: string, type: 'pre-paid' | 'standard') => {
  switch (type) {
    case 'pre-paid':
      return `${formatPriceKO(Number(remainAmount))}원 / ${formatPriceKO(Number(totalAmount))}원`;
    case 'standard':
      return `${remainAmount}회 / ${totalAmount}회`;
    default:
      return null;
  }
};
