import HeartDisabledIcon from '@/assets/icons/HeartDisabledIcon.svg?react';
import HeartEnabledIcon from '@/assets/icons/HeartEnabledIcon.svg?react';
import { Button } from '@/components/Button';
import FixedButtonContainer from '@/components/FixedButtonContainer';

interface BranchDetailBottomActionBarProps {
  isBookmarked: boolean;
  bookmarkCount: number;
  onBookmark: () => void;
  onClickReservation: () => void;
}

const BookmarkSection = ({
  isBookmarked,
  bookmarkCount,
  onBookmark
}: {
  isBookmarked: boolean;
  bookmarkCount: number;
  onBookmark: () => void;
}) => {
  const iconSize = { width: 28, height: 28 };

  return (
    <div className={'flex flex-col items-center gap-1'}>
      <button onClick={onBookmark}>
        {isBookmarked ? <HeartEnabledIcon {...iconSize} /> : <HeartDisabledIcon {...iconSize} />}
      </button>
      <p className={'text-14px text-gray-400'}>{bookmarkCount}</p>
    </div>
  );
};

const BranchDetailBottomActionBar = ({
  isBookmarked,
  bookmarkCount,
  onClickReservation,
  onBookmark
}: BranchDetailBottomActionBarProps) => {
  return (
    <FixedButtonContainer className="!bg-white flex gap-5">
      <BookmarkSection isBookmarked={isBookmarked} bookmarkCount={bookmarkCount} onBookmark={onBookmark} />
      <Button variantType="primary" sizeType={'l'} className={'w-full'} onClick={onClickReservation}>
        {'예약하기'}
      </Button>
    </FixedButtonContainer>
  );
};

export default BranchDetailBottomActionBar;
