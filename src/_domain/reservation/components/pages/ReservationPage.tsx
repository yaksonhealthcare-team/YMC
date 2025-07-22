import { useGetUserMembership, UserMembershipSchema } from '@/_domain/membership';
import { parseScheduleTime } from '@/_shared';
import { DEFAULT_COORDINATE } from '@/constants/coordinate';
import { useAuth } from '@/contexts/AuthContext';
import { useOverlay } from '@/contexts/ModalContext';
import { useGeolocation } from '@/hooks/useGeolocation';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCreateReservationMutation, useGetBranchDetail, useGetReservationConsultCount } from '../../services';
import { ReservationFormValues } from '../../types/reservation.types';
import { ReservationMenuSectionProps } from '../sections';
import { ReservationTemplate } from '../templates';

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
  const { user } = useAuth();
  const { location } = useGeolocation();
  const navigate = useNavigate();
  const membershipId = searchParams.get('membershipId') ?? '';

  const { showToast, openModal, closeOverlay } = useOverlay();
  const { data: consultCountData } = useGetReservationConsultCount(user?.phone || '');
  const { data: membershipData } = useGetUserMembership(user?.phone || '', { search_type: 'T' });
  const { data: branchData } = useGetBranchDetail(
    user?.phone || '',
    {
      b_idx: branchValues?.id || '',
      nowlat: location?.latitude || DEFAULT_COORDINATE.latitude,
      nowlon: location?.longitude || DEFAULT_COORDINATE.longitude
    },
    { enabled: !!branchValues?.id }
  );
  const { mutateAsync, isPending } = useCreateReservationMutation();

  const handleSubmit = useCallback(
    async (values: ReservationFormValues) => {
      const { branch, date, timeSlot, services, consultService, request, type } = values;
      const hasConsultService = consultService.length > 0;
      const hasServices = services.length > 0;

      if (!hasConsultService && !hasServices) {
        showToast('회원권을 선택해주세요.');
        return;
      }
      if (!date || !timeSlot.time) {
        showToast('예약 날짜와 시간을 선택해주세요.');
        return;
      }
      if (!branch?.id) {
        showToast('지점을 선택해주세요.');
        return;
      }

      try {
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

        const response = await mutateAsync({
          r_gubun: type === 'consult' ? 'C' : 'R',
          b_idx: branch.id,
          r_date: formattedDate,
          r_stime: formattedTime,
          r_memo: request,
          services: formattedServices
        });

        if (response.data.resultCode !== '00') {
          throw new Error();
        }

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
      } catch {
        showToast('예약에 실패했습니다. 다시 시도해주세요.');
      }
    },
    [closeOverlay, mutateAsync, navigate, openModal, showToast]
  );

  const consultCount = useMemo(() => {
    const { consultation_max_count, current_count } = consultCountData?.body || {};

    return {
      maxCount: Number(consultation_max_count || 0),
      currentCount: Number(current_count || 0)
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
  const [branch] = useMemo(() => branchData?.body || {}, [branchData?.body]);

  useEffect(() => {
    const initForms = getInitFormValues(searchParams, memberships, consultCount);
    (Object.entries(initForms) as Array<[keyof ReservationFormValues, any]>).forEach(([field, value]) => {
      methods.setValue(field, value);
    });

    setEnabled(true);
  }, [consultCount, memberships, methods, searchParams]);

  useEffect(() => {
    if (branch) {
      methods.setValue('branch', { id: branch.b_idx, name: branch.b_name });
    }
  }, [branch, methods]);

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
