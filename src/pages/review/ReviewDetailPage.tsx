import { useParams } from 'react-router-dom';
import { useReviewDetail } from '../../queries/useReviewQueries.tsx';
import { ReviewDetailSkeleton } from './_fragments/ReviewDetailSkeleton.tsx';
import { ReviewDetailContent } from './_fragments/ReviewDetailContent.tsx';

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
