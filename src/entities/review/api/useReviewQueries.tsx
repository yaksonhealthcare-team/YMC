import { useInfiniteQuery, useQuery, useMutation } from '@tanstack/react-query';
import {
  CreateReviewRequest,
  createReview,
  fetchReviewDetail,
  fetchReviews,
  fetchReviewSections,
  fetchReviewQuestions
} from './review.api';
import { useNavigate } from 'react-router-dom';
import { reviews } from '@/shared/constants/queryKeys/keys/reviews.keys';

export const useReviews = () => {
  return useInfiniteQuery({
    queryKey: ['reviews'],
    queryFn: ({ pageParam = 1 }) => fetchReviews(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined;
      const totalPages = lastPage[0].total_page_count;
      const nextPage = allPages.length + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    retry: false,
    enabled: true,
    refetchOnMount: true,
    staleTime: 0
  });
};

export const useReviewDetail = (reviewId: string) => {
  return useQuery({
    queryKey: ['review', reviewId],
    queryFn: () => fetchReviewDetail(reviewId),
    retry: false
  });
};

export const useCreateReviewMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (request: CreateReviewRequest) => createReview(request),
    onSuccess: () => {
      navigate('/review', {
        replace: true,
        state: { returnPath: '/mypage' }
      });
    },
    retry: false
  });
};

export const useReviewSections = () => {
  return useQuery({
    queryKey: reviews.sections,
    queryFn: fetchReviewSections,
    retry: false
  });
};

export const useReviewQuestions = (reviewId: string) => {
  return useQuery({
    queryKey: ['reviewQuestions', reviewId],
    queryFn: () => fetchReviewQuestions(reviewId),
    enabled: !!reviewId,
    retry: false
  });
};
