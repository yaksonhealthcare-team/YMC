import { useUserStore } from '@/features/auth/model/user.store';
import { useGetUserMemberships } from '@/features/membership-purchase/lib/membership.services';
import { useGetBranchDetail } from '@/features/reservation/lib/branch.services';
import { useCreateReservationMutation, useGetReservationConsultCount } from '@/features/reservation/lib/reservation.services';
import { ReservationFormValues } from '@/entities/reservation/model/reservation.types';
import { UserMembershipSchema } from '@/entities/membership/model/membership.types';
import { ReservationMenuSectionProps } from '@/features/reservation/ui/ReservationMenuSection.types';
import { ReservationTemplate } from '@/features/reservation/ui/ReservationTemplate';
import { DEFAULT_COORDINATE } from '@/shared/constants/location.constants';
import { GET_RESERVATIONS } from '@/shared/constants/queryKeys/queryKey.constants';
import { parseScheduleTime } from '@/shared/lib/utils/date.utils';
import { Loading } from '@/shared/ui/loading/Loading';
import { useGeolocation } from '@/features/search-branch/lib/useGeolocation';
import { useOverlay } from '@/shared/ui/modal/ModalContext';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';

/**
 * 예약하기 페이지
 */
const ReservationPage = () => {
  const [enabled, setEnabled] = useState(false);
  const methods = useForm<ReservationFormValues>({
    defaultValues: {
      type: 'consult',
      branch: { id: '', name: '' },
      date: null,
      timeSlot: { time: '' },
      services: [],
      request: '',
      consultService: []
    }
  });
  const branchValues = useWatch({ control: methods.control, name: 'branch' });
  const [searchParams] = useSearchParams();
  const { getUserId } = useUserStore();
  const userId = getUserId();
  const { location } = useGeolocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const membershipId = searchParams.get('membershipId') ?? '';

  const { showToast, openModal, closeOverlay } = useOverlay();
  const { data: consultCountData } = useGetReservationConsultCount(userId);
  const { data: membershipData, isLoading } = useGetUserMemberships(userId, { search_type: 'T' });
  const { data: branchData } = useGetBranchDetail(
    userId,
    {
      b_idx: branchValues?.id || '',
      nowlat: location?.latitude || DEFAULT_COORDINATE.latitude,
      nowlon: location?.longitude || DEFAULT_COORDINATE.longitude
    },
    { enabled: !!branchValues?.id }
  );
  const { mutateAsync: reservationMutate, isPending } = useCreateReservationMutation();

  const handleSubmit = useCallback(
    async (values: ReservationFormValues) => {
      try {
        const { branch, date, timeSlot, services, consultService, request, type } = values;
        const hasConsultService = consultService.length > 0;
        const hasServices = services.length > 0;

        if (!hasConsultService && !hasServices) {
          throw new Error('회원권을 선택해주세요.');
        }
        if (!date || !timeSlot.time) {
          throw new Error('예약 날짜와 시간을 선택해주세요.');
        }
        if (!branch?.id) {
          throw new Error('지점을 선택해주세요.');
        }

        const formattedDate = date.format('YYYY-MM-DD');
        const formattedTime = parseScheduleTime(timeSlot.time);
        const servicesArray = type === 'consult' ? consultService : services;
        const formattedServices = servicesArray
          .map((service) => {
            const result: { mp_idx?: string; ss_idx?: string } = {};
            if (service.mp_idx) {
              result.mp_idx = service.mp_idx;
            }
            if (service.ss_idx) {
              result.ss_idx = service.ss_idx;
            }
            return result;
          })
          .filter((obj) => Object.keys(obj).length > 0);

        const response = await reservationMutate({
          r_gubun: type === 'consult' ? 'C' : 'R',
          b_idx: branch.id,
          r_date: formattedDate,
          r_stime: formattedTime,
          r_memo: request,
          services: formattedServices
        });

        if (response.data.resultCode !== '00') {
          const message = response.data.resultMessage || '예약에 실패했습니다. 다시 시도해주세요.';
          throw new Error(message);
        }

        queryClient.invalidateQueries({ queryKey: [GET_RESERVATIONS, userId] });

        openModal({
          title: '예약 완료',
          message: '예약이 완료되었습니다.',
          style: 'alert',
          onCancel: (_, reason) => {
            if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
              return;
            }
            closeOverlay();
          },
          onConfirm: () => {
            navigate('/member-history/reservation');
            closeOverlay();
          }
        });
      } catch (error) {
        if (error instanceof Error && error.message) {
          showToast(error.message);
        } else {
          showToast('예약에 실패했습니다. 다시 시도해주세요.');
        }
      }
    },
    [reservationMutate, queryClient, userId, openModal, closeOverlay, navigate, showToast]
  );

  const consultCount = useMemo(() => {
    const { consultation_max_count = 0, current_count = 0 } = consultCountData?.body || {};

    return {
      maxCount: Number(consultation_max_count),
      currentCount: Number(current_count)
    };
  }, [consultCountData?.body]);
  const memberships = useMemo(() => {
    const raw = membershipData?.flatMap((page) => page.data.body) || [];
    // 1) 만료일 기준 오름차순 정렬
    const expirationSorted = raw.slice().sort((a, b) => {
      const da = dayjs(a.expiration_date);
      const db = dayjs(b.expiration_date);
      if (da.isBefore(db)) return -1;
      if (da.isAfter(db)) return 1;
      return a.mp_idx.localeCompare(b.mp_idx);
    });

    // 2) membershipId 쿼리스트링이 있으면, 해당 항목을 맨 앞으로
    if (membershipId) {
      const idx = expirationSorted.findIndex((m) => m.mp_idx === membershipId);
      if (idx > 0) {
        const [matched] = expirationSorted.splice(idx, 1);
        expirationSorted.unshift(matched);
      }
    }

    return expirationSorted;
  }, [membershipData, membershipId]);

  useEffect(() => {
    if (enabled || (membershipId && !membershipData)) return;

    const initForms = getInitFormValues(searchParams, memberships, consultCount);
    (Object.entries(initForms) as Array<[keyof ReservationFormValues, any]>).forEach(([field, value]) => {
      methods.setValue(field, value);
    });

    setEnabled(true);
  }, [consultCount, enabled, membershipData, membershipId, memberships, methods, searchParams]);

  useEffect(() => {
    const [branch] = branchData?.body || [];
    if (!branch) return;

    methods.setValue('branch', { id: branch.b_idx, name: branch.b_name });
  }, [branchData?.body, methods]);

  if (isLoading) return <Loading variant="global" />;

  return (
    <FormProvider {...methods}>
      {enabled && (
        <ReservationTemplate
          consultCount={consultCount}
          memberships={memberships}
          onSubmit={handleSubmit}
          isPending={isPending}
        />
      )}
    </FormProvider>
  );
};

export default ReservationPage;

const getInitFormValues = (
  searchParams: URLSearchParams,
  memberships: UserMembershipSchema[],
  consultCount: ReservationMenuSectionProps['consultCount']
): ReservationFormValues | object => {
  const membershipId = searchParams.get('membershipId') ?? '';
  const branchId = searchParams.get('branchId') ?? '';
  const hasMemberships = memberships && memberships.length > 0;
  const canConsult = !!branchId && (consultCount.currentCount > 0 || consultCount.currentCount === 0);

  switch (true) {
    //   1. 상담횟수가 남아있을 경우 상담 예약이 기본값
    //    1.1. branchId가 쿼리스트링으로 넘어온 경우
    //      - branchId에 해당하는 지점과 상담 예약이 기본값
    case !membershipId && canConsult: {
      return {
        type: 'consult',
        branch: { id: branchId, name: '' },
        consultService: [{ ss_idx: '', type: 'only_consult' }]
      };
    }

    // 2. 멤버십이 있을 경우 멤버십이 기본값
    //   2.1 membershipId가 쿼리스트링으로 넘어온 경우
    //     - membershipId에 해당하는 멤버십, 지점이 기본값
    //   2.2 membershipId가 쿼리스트링으로 넘어오지 않은 경우
    //     - 멤버십중에 가장 빠른 배열, 지점이 기본값
    case hasMemberships: {
      if (membershipId) {
        const matched = memberships.find((m) => m.mp_idx === membershipId);
        if (matched) {
          return {
            type: 'membership',
            branch: { id: matched.branchs[0].b_idx, name: matched.branchs[0].b_name },
            services: [{ mp_idx: matched.mp_idx, ss_idx: '', type: matched.mp_gubun === 'F' ? 'pre-paid' : 'standard' }]
          };
        }
        return {};
      }

      const firstMembership = memberships[0];
      return {
        type: 'membership',
        services: [
          {
            mp_idx: firstMembership.mp_idx,
            ss_idx: '',
            type: firstMembership.mp_gubun === 'F' ? 'pre-paid' : 'standard'
          }
        ],
        branch: { id: firstMembership.branchs[0].b_idx, name: firstMembership.branchs[0].b_name }
      };
    }

    // 3. 멤버십도 없고 상담횟수가 남아있지 않을 경우 아무것도 선택 X
    default:
      return { type: null };
  }
};
