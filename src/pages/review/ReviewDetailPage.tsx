import { useReviewDetail } from '@/entities/review/api/useReviewQueries';
import { useParams } from 'react-router-dom';
import { ReviewDetailContent } from './ui/ReviewDetailContent';
import { ReviewDetailSkeleton } from './ui/ReviewDetailSkeleton';

const ReviewDetailPage = () => {
  const { reviewId } = useParams();
  const { data: review, isLoading } = useReviewDetail(reviewId!);

  if (isLoading) {
    return <ReviewDetailSkeleton />;
  }

  if (!review) {
    return null;
  }

  return <ReviewDetailContent review={review} />;
};

export default ReviewDetailPage;
