import CaretRightIcon from '@/assets/icons/CaretRightIcon.svg?react';
import MegaPhoneIcon from '@/assets/icons/MegaPhoneIcon.svg?react';
import NoticesSummarySlider from '@/components/NoticesSummarySlider';
import { useNoticesSummary } from '@/entities/content/api/useContentQueries';
import { useNavigate } from 'react-router-dom';

const MyPageNotice = () => {
  const navigate = useNavigate();
  const { data: noticesData } = useNoticesSummary();

  if (!noticesData?.notices?.length) return null;

  return (
    <button
      type="button"
      className="flex gap-2 items-center px-5 h-[40px] my-5 rounded-[8px] bg-white text-primary w-full hover:bg-gray-50 transition-colors"
      onClick={() => navigate('/notice', { state: { from: '/mypage' } })}
    >
      <MegaPhoneIcon className="min-w-5 h-5" />
      <NoticesSummarySlider
        className="w-full h-[21px] overflow-hidden text-ellipsis whitespace-nowrap"
        fromPath="/mypage"
        right={<CaretRightIcon className="flex-shrink-0 min-w-[4px] h-4 ml-auto" />}
      />
    </button>
  );
};

export default MyPageNotice;
