import CalendarIcon from '@/assets/icons/CalendarIcon.svg?react';
import EditIcon from '@/assets/icons/EditIcon.svg?react';
import StoreIcon from '@/assets/icons/StoreIcon.svg?react';
import { Image } from '@/shared/ui/image/Image';
import { useLayout } from '@/stores/LayoutContext';
import { ReviewDetail } from '@/entities/review/model/Review';
import { formatDate, formatDateWithDay } from '@/shared/lib/utils/date';
import { useEffect } from 'react';

const RATING_TYPE_LABEL: Record<'H' | 'M' | 'L', string> = {
  H: '만족',
  M: '보통',
  L: '불만족'
} as const;

interface Props {
  review: ReviewDetail;
}

export const ReviewDetailContent = ({ review }: Props) => {
  const { setHeader, setNavigation } = useLayout();

  useEffect(() => {
    setHeader({
      display: true,
      title: '만족도 보기',
      left: 'back',
      backgroundColor: 'bg-white'
    });
    setNavigation({ display: true });
  }, []);

  const ratings = [
    { rs_grade: 'H' as const, count: review.grade.H },
    { rs_grade: 'M' as const, count: review.grade.M },
    { rs_grade: 'L' as const, count: review.grade.L }
  ];

  return (
    <div className="flex flex-col bg-white pb-8">
      <div className="px-5 pt-4">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <EditIcon className="w-3.5 h-3.5 text-primary" />
              <span className="text-gray-500 text-sm font-medium">{formatDate(review.date, 'YYYY.MM.DD HH:mm')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary text-lg font-bold">{review.visit}회차</span>
              <span className="text-gray-700 text-lg font-bold">
                {review.programName} {review.totalCount}
              </span>
            </div>
            {review.serviceDate && (
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-gray-500 text-sm font-medium">{formatDateWithDay(review.serviceDate)}</span>
              </div>
            )}
            <div className="flex flex-wrap items-center">
              {review.additionalServices.map((service, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && <div className="mx-2 w-[1px] h-3 border border-gray-200" />}
                  <span className="text-gray-500 text-xs font-medium whitespace-nowrap">{service}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <StoreIcon className={'w-[14px] h-[14px] text-gray-500'} />
            <span className="text-gray-500 text-sm font-medium">{review.brandName}</span>
          </div>
        </div>
      </div>

      <div className="w-full h-2 bg-gray-50 mt-6" />

      <div className="px-5 py-6">
        <div className="flex gap-1.5">
          {ratings.map((rating) => (
            <div key={rating.rs_grade} className="px-2 py-[3px] bg-tag-redBg rounded-full">
              <span className="text-primary text-xs font-medium">
                {RATING_TYPE_LABEL[rating.rs_grade]} {rating.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 flex flex-col gap-3">
        <h3 className="text-gray-700 text-sm font-semibold">만족도 평가</h3>
        <div className="flex flex-col gap-2">
          {review.evaluations.map((evaluation) => (
            <div key={evaluation.question} className="flex justify-between items-center">
              <span className="text-gray-700 text-sm">{evaluation.question}</span>
              <span className="text-gray-700 text-sm">{evaluation.response}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full h-px bg-gray-100 my-6" />

      <div className="px-5 flex flex-col gap-3">
        <h3 className="text-gray-700 text-sm font-semibold">종합 평가</h3>
        {review.content ? (
          <p className="text-gray-700 text-sm leading-[23.52px]">{review.content}</p>
        ) : (
          <p className="text-gray-400 text-sm">작성된 평가가 없습니다.</p>
        )}
      </div>

      <div className="w-full h-px bg-gray-100 my-6" />

      <div className="px-5 flex flex-col gap-3">
        <h3 className="text-gray-700 text-sm font-semibold">업로드한 사진</h3>
        {review.images && review.images.length > 0 ? (
          <div className="flex flex-col gap-4 mb-16">
            <div className="flex gap-4 overflow-x-auto no-scrollbar touch-pan-x">
              {review.images.map((image, index) => (
                <div key={index} className="relative w-[100px] h-[100px] shrink-0 rounded-lg">
                  <Image
                    src={image}
                    alt={`리뷰 이미지 ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-sm mb-16">업로드한 사진이 없습니다.</p>
        )}
      </div>
    </div>
  );
};
