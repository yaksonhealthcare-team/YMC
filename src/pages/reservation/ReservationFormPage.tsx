import { createAdditionalManagementOrder } from '@/apis/order.api';
import { Button } from '@/components/Button';
import FixedButtonContainer from '@/components/FixedButtonContainer';
import LoadingIndicator from '@/components/LoadingIndicator';
import { MembershipSwiper } from '@/components/MembershipSwiper';
import { RadioCard } from '@/components/RadioCard';
import { useLayout } from '@/contexts/LayoutContext';
import { useOverlay } from '@/contexts/ModalContext';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useUserMemberships } from '@/queries/useMembershipQueries';
import { Membership } from '@/types/Membership';
import { formatDateForAPI } from '@/utils/date';
import { toNumber } from '@/utils/number';
import { CircularProgress, RadioGroup } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getConsultationCount } from '../../apis/reservation.api';
import { useBranch } from '../../hooks/useBranch';
import { useCreateReservationMutation } from '../../queries/useReservationQueries';
import { ReservationFormData, useReservationFormStore } from '../../stores/reservationFormStore';
import { Branch } from '../../types/Branch';
import { MembershipBranchSelectModal } from '../membership/_fragments/MembershipBranchSelectModal';
import DateAndTimeBottomSheet from './_fragments/DateAndTimeBottomSheet';
import { ReservationFormSection } from './_fragments/ReservationFormSection';

const BRAND_CODE = '001'; // 약손명가

interface LocationState {
  rebookingMembershipId?: string;
  isConsultation?: boolean;
  branchId?: string;
  brandCode?: string;
  selectedBranch?: Branch;
  selectedItem?: string;
}

function calculateInitialState(
  location: ReturnType<typeof useLocation>,
  memberships: Membership[],
  openModal: ReturnType<typeof useOverlay>['openModal'],
  closeOverlay: ReturnType<typeof useOverlay>['closeOverlay'],
  handleBack: () => void
): {
  initialFormData: Partial<ReservationFormData>;
  initialSwiperId: string | undefined;
  initialSelectedBranch: Branch | null;
  shouldShowNoMembershipToast: boolean;
} {
  const locationState = location.state as LocationState | null;
  const params = new URLSearchParams(location.search);
  const membershipIdFromUrl = params.get('membershipId');
  const branchIdFromUrl = params.get('branchId');

  let initialFormData: Partial<ReservationFormData> = {};
  let initialSwiperId: string | undefined = undefined;
  let initialSelectedBranch: Branch | null = null;
  let shouldShowNoMembershipToast = false;

  const isValidMembershipId = (id: string | null): id is string => !!id && memberships.some((m) => m.mp_idx === id);

  const isValidMembershipUrl = (id: string | null): id is string => !!id && memberships.some((m) => m.mp_idx === id);

  // [0] 최우선: 다시 예약하기 (rebookingMembershipId & branchId)
  if (locationState) {
    const {
      rebookingMembershipId,
      isConsultation,
      branchId: branchIdFromState,
      selectedBranch: branchFromState,
      selectedItem,
      brandCode
    } = locationState;

    // 재예약 회원권 ID가 있는 경우
    if (rebookingMembershipId) {
      // 유효한 회원권인지 체크
      if (isValidMembershipId(rebookingMembershipId) && branchIdFromState) {
        initialFormData = {
          item: rebookingMembershipId,
          branch: branchIdFromState,
          membershipId: rebookingMembershipId
        };
        initialSwiperId = rebookingMembershipId;
        initialSelectedBranch = branchFromState || null;
        return {
          initialFormData,
          initialSwiperId,
          initialSelectedBranch,
          shouldShowNoMembershipToast
        };
      }
      // 회원권이 유효하지 않은 경우 (토스트 메시지 표시)
      else {
        // 유효하지 않은 회원권 ID인 경우 토스트 메시지 표시 플래그 설정
        shouldShowNoMembershipToast = true;

        // 상담 예약으로 초기화하되 지점 정보는 유지
        initialFormData = {
          item: '상담 예약',
          branch: branchIdFromState,
          membershipId: undefined
        };
        initialSwiperId = undefined;
        initialSelectedBranch = branchFromState || null;

        return {
          initialFormData,
          initialSwiperId,
          initialSelectedBranch,
          shouldShowNoMembershipToast
        };
      }
    }
    // [1] 1순위: 지점 상세 (isConsultation & branchId)
    else if (isConsultation !== undefined && branchIdFromState) {
      initialFormData = {
        item: isConsultation ? '상담 예약' : undefined,
        branch: branchIdFromState,
        membershipId: undefined
      };
      initialSwiperId = undefined;
      initialSelectedBranch = branchFromState || null;
      return {
        initialFormData,
        initialSwiperId,
        initialSelectedBranch,
        shouldShowNoMembershipToast
      };
    }
    // [1.5] 1.5순위: 브랜드 상세 -> 현재는 아무것도 안함 (기본 상태로 진행)
    else if (brandCode) {
      // initialFormData = { brandCode } // 필요시 여기에 브랜드 코드 관련 로직 추가
    }
    // 그 외 상황 (예: 선택된 아이템이 있는 경우)
    else if (selectedItem && isValidMembershipId(selectedItem)) {
      initialFormData = {
        item: selectedItem,
        membershipId: selectedItem
      };
      initialSwiperId = selectedItem;
    } else if (rebookingMembershipId || branchIdFromState || selectedItem) {
      console.warn('Invalid ID provided in location state:', location.state);
    }
  }

  // [2] 2순위: URL 파라미터 (membershipId)
  if (Object.keys(initialFormData).length === 0 && memberships.length >= 0) {
    if (isValidMembershipUrl(membershipIdFromUrl)) {
      const foundMembership = memberships.find((m) => m.mp_idx === membershipIdFromUrl);

      if (foundMembership && Number(foundMembership.remain_amount) <= 0) {
        openModal({
          title: '알림',
          message: '해당 회원권의 잔여 횟수가 없습니다.',
          onConfirm: () => {
            closeOverlay();
            handleBack();
          }
        });
        return {
          initialFormData: {},
          initialSwiperId: undefined,
          initialSelectedBranch: null,
          shouldShowNoMembershipToast: true
        };
      }

      initialFormData = {
        item: membershipIdFromUrl,
        branch: undefined,
        membershipId: membershipIdFromUrl
      };
      initialSwiperId = membershipIdFromUrl;

      // 단일 지점 자동 선택 로직
      if (foundMembership?.branchs && foundMembership.branchs.length === 1) {
        const singleBranchInfo = foundMembership.branchs[0];
        initialFormData.branch = singleBranchInfo.b_idx;
      }
      return {
        initialFormData,
        initialSwiperId,
        initialSelectedBranch,
        shouldShowNoMembershipToast
      };
    }
    // [3] 3순위: URL 파라미터 (branchId만 있는 경우)
    else if (branchIdFromUrl && !membershipIdFromUrl) {
      initialFormData = {
        item: undefined,
        branch: branchIdFromUrl,
        membershipId: undefined
      };
      initialSwiperId = undefined;
      return {
        initialFormData,
        initialSwiperId,
        initialSelectedBranch,
        shouldShowNoMembershipToast
      };
    } else if (membershipIdFromUrl || branchIdFromUrl) {
      console.warn('Invalid ID provided in URL parameters:', membershipIdFromUrl, branchIdFromUrl);
    }
  }

  // [4] 4순위: 기본값 - 위 모든 정보가 없으면 빈 상태로 시작
  return {
    initialFormData,
    initialSwiperId,
    initialSelectedBranch,
    shouldShowNoMembershipToast
  };
}

const ReservationFormPage = () => {
  const { openBottomSheet, closeOverlay, openModal, showToast } = useOverlay();
  const { setHeader, setNavigation } = useLayout();
  const navigate = useNavigate();
  const location = useLocation();
  const { handleError } = useErrorHandler();
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const isInitialized = useRef(false);

  const {
    formData,
    setFormData: setFormDataInStore,
    clearAll,
    setInitialMembershipId,
    initialMembershipId
  } = useReservationFormStore();

  const {
    data: userMembershipPaginationData,
    isLoading: isMembershipsLoading,
    error: membershipsError,
    isError: isMembershipsError
  } = useUserMemberships('T');

  const {
    data: initialBranchData,
    isLoading: isInitialBranchLoading,
    error: initialBranchError,
    isError: isInitialBranchError
  } = useBranch(formData.branch);

  const memberships = useMemo(() => {
    if (!userMembershipPaginationData || userMembershipPaginationData.pages.length === 0) return [];
    return userMembershipPaginationData.pages.flatMap((page) => page.body || []);
  }, [userMembershipPaginationData]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const { data: consultationCount } = useQuery({
    queryKey: ['consultation-count', location.key],
    queryFn: getConsultationCount
  });
  const { mutateAsync: createReservation, isPending: isCreatingReservation } = useCreateReservationMutation();

  const selectedMembershipInfo = useMemo(() => {
    return memberships.find((m) => m.mp_idx === formData.membershipId);
  }, [memberships, formData.membershipId]);

  const isBranchSelectionDisabled = useMemo(
    () => formData.item !== '상담 예약' && !!selectedMembershipInfo && selectedMembershipInfo.branchs?.length === 1,
    [formData.item, selectedMembershipInfo]
  );

  useEffect(() => {
    if (showBranchModal) return;

    setHeader({
      display: true,
      title: '예약하기',
      left: 'back',
      onClickBack: handleBack,
      backgroundColor: 'bg-white'
    });
    setNavigation({ display: false });

    // 컴포넌트가 언마운트될 때만 clearAll이 호출되도록 수정
    // 모달이 열리고 닫힐 때는 폼 데이터를 유지
  }, [showBranchModal, setHeader, setNavigation, handleBack]);

  // 컴포넌트 언마운트 시에만 clearAll 실행
  useEffect(() => {
    return () => {
      clearAll();
    };
  }, [clearAll]);

  // 초기 데이터 로딩 Effect - 최초 한 번만 실행되도록 수정
  useEffect(() => {
    // 이미 초기화가 완료되었거나 로딩 중인 경우 중복 실행 방지
    if (isInitialized.current || isMembershipsLoading) {
      return;
    }

    if (isMembershipsError && membershipsError) {
      handleError(membershipsError, '회원권 정보를 불러오는데 실패했습니다.');
      isInitialized.current = true; // 에러 발생 시에도 초기화 완료로 표시
      return;
    }

    // 멤버십 데이터가 로드된 경우에만 초기화 진행
    if (!isMembershipsLoading && memberships.length >= 0) {
      const { initialFormData, initialSwiperId, initialSelectedBranch, shouldShowNoMembershipToast } =
        calculateInitialState(location, memberships, openModal, closeOverlay, handleBack);

      // 한 번만 설정하도록 조건 추가
      if (!isInitialized.current) {
        setFormDataInStore({
          ...initialFormData,
          date: null,
          timeSlot: null,
          request: '',
          additionalServices: []
        });

        if (initialSwiperId) {
          setInitialMembershipId(initialSwiperId);
        }

        if (initialSelectedBranch) {
          setSelectedBranch(initialSelectedBranch);
        } else if (!initialFormData.branch && selectedBranch) {
          setSelectedBranch(null);
        }

        // 토스트 메시지 표시
        if (shouldShowNoMembershipToast) {
          showToast('가능한 회원권이 없습니다');
        }

        isInitialized.current = true; // 초기화 완료 표시
      }
    }
  }, [
    isMembershipsLoading,
    isMembershipsError,
    membershipsError,
    memberships.length,
    location,
    openModal,
    closeOverlay,
    handleBack,
    setFormDataInStore,
    setInitialMembershipId,
    handleError,
    showToast
  ]);

  // 컴포넌트 언마운트 시 isInitialized 리셋
  useEffect(() => {
    return () => {
      isInitialized.current = false;
    };
  }, []);

  // formData.branch 변경 시 selectedBranch 업데이트 Effect - 최적화
  useEffect(() => {
    const branchId = formData.branch;

    // 이미 분기ID와 선택된 지점 객체가 일치하면 아무 작업도 하지 않음
    if (selectedBranch?.b_idx === branchId) {
      return;
    }

    // branch ID가 없으면 selectedBranch 초기화
    if (!branchId) {
      if (selectedBranch) {
        setSelectedBranch(null);
      }
      return;
    }

    // 데이터 로딩 시작 전에 로그만 출력
    if (isInitialBranchLoading) {
      return;
    }

    // 에러 처리
    if (isInitialBranchError && initialBranchError) {
      const message =
        initialBranchError instanceof Error && initialBranchError.message.includes('위치 정보')
          ? '지점 상세 정보를 보려면 위치 정보 권한이 필요합니다.'
          : `지점 정보(${branchId})를 불러오는데 실패했습니다.`;

      handleError(
        initialBranchError instanceof Error
          ? initialBranchError
          : new Error(String(initialBranchError) || 'Unknown error'),
        message
      );

      if (selectedBranch) {
        setSelectedBranch(null);
      }
      return;
    }

    // 데이터가 로드되었고 현재 branch ID와 일치하는 경우
    if (initialBranchData && initialBranchData.b_idx === branchId) {
      // 이미 적절한 브랜치가 설정되어 있으면 업데이트 하지 않음
      if (selectedBranch?.b_idx === branchId) {
        return;
      }

      // Branch 객체 생성
      const branchObject: Branch = {
        b_idx: initialBranchData.b_idx,
        name: initialBranchData.name,
        address: initialBranchData.location.address,
        latitude: initialBranchData.location.latitude,
        longitude: initialBranchData.location.longitude,
        canBookToday: true,
        distanceInMeters: initialBranchData.location.distance ?? null,
        isFavorite: initialBranchData.isBookmarked ?? false,
        brandCode: initialBranchData.brandCode,
        brand: initialBranchData.brand
      };

      setSelectedBranch(branchObject);
    }
  }, [
    formData.branch,
    initialBranchData,
    isInitialBranchLoading,
    isInitialBranchError,
    initialBranchError,
    handleError
  ]);

  const handleOnChangeItem = useCallback(
    (value: string) => {
      // 이미 선택된 항목이면 중복 업데이트하지 않음
      if (formData.item === value) {
        return;
      }

      // 상담 예약이 아닌 회원권을 선택한 경우
      if (value !== '상담 예약') {
        // 선택한 회원권 정보 찾기
        const selectedMembership = memberships.find((m) => m.mp_idx === value);

        // 단일 지점 자동 선택 로직
        let branchId = undefined;
        if (selectedMembership?.branchs && selectedMembership.branchs.length === 1) {
          branchId = selectedMembership.branchs[0].b_idx;
        }

        setFormDataInStore({
          item: value,
          date: null,
          timeSlot: null,
          additionalServices: [],
          membershipId: value,
          // 단일 지점이 있으면 자동 선택, 없으면 undefined
          branch: branchId
        });
      } else {
        // 상담 예약 선택 시
        setFormDataInStore({
          item: value,
          date: null,
          timeSlot: null,
          additionalServices: [],
          membershipId: undefined
        });
      }

      // 멤버십 ID 변경
      if (initialMembershipId !== (value !== '상담 예약' ? value : undefined)) {
        setInitialMembershipId(value !== '상담 예약' ? value : undefined);
      }
    },
    [
      setFormDataInStore,
      setInitialMembershipId,
      formData.item,
      initialMembershipId,
      memberships // 회원권 목록 의존성 추가
    ]
  );

  const handleOpenCalendar = useCallback(() => {
    if (!formData.item) {
      handleError(new Error('회원권을 먼저 선택해주세요.'));
      return;
    }
    if (!formData.branch) {
      handleError(new Error('지점을 먼저 선택해주세요.'));
      return;
    }

    openBottomSheet(
      <DateAndTimeBottomSheet
        onClose={closeOverlay}
        date={formData.date}
        time={formData.timeSlot}
        onSelect={(date, timeSlot) => {
          setFormDataInStore({ date, timeSlot });
        }}
        membershipIndex={formData.item === '상담 예약' ? 0 : toNumber(formData.membershipId)}
        addServices={formData.additionalServices.map((service) => toNumber(service.s_idx))}
        b_idx={formData.branch}
      />,
      { height: 'large' }
    );
  }, [formData, handleError, openBottomSheet, closeOverlay, setFormDataInStore]);

  const handleNavigateBranchSelect = useCallback(() => {
    if (!formData.item) {
      handleError(new Error('회원권을 먼저 선택해주세요.'));
      return;
    }
    setShowBranchModal(true);
  }, [formData.item, handleError]);

  const handleBranchSelect = useCallback(
    (branch: Branch) => {
      setSelectedBranch(branch);
      setFormDataInStore({
        branch: branch.b_idx,
        timeSlot: null,
        date: null
      });
      setShowBranchModal(false);
    },
    [setFormDataInStore]
  );

  const handleCloseBranchModal = useCallback(() => {
    setShowBranchModal(false);
  }, []);

  const validateReservationData = useCallback(() => {
    if (!formData.item) {
      handleError(new Error('회원권을 먼저 선택해주세요.'));
      return false;
    }
    if (!formData.date || !formData.timeSlot) {
      handleError(new Error('예약 날짜와 시간을 선택해주세요.'));
      return false;
    }
    if (!formData.branch) {
      handleError(new Error('지점을 선택해주세요.'));
      return false;
    }
    return true;
  }, [formData, handleError]);

  const handleConsultationReservation = useCallback(async () => {
    try {
      if (!validateReservationData()) return;
      const branchId = formData.branch!;

      const response = (await createReservation({
        r_gubun: 'C',
        mp_idx: formData.item!,
        b_idx: branchId,
        r_date: formatDateForAPI(formData.date?.toDate() || null),
        r_stime: formData.timeSlot!.time,
        r_memo: formData.request
      })) as any;

      if (response.resultCode !== '00') {
        handleError(new Error(response.resultMessage));
        return;
      }

      openModal({
        title: '예약 완료',
        message: '상담 예약이 완료되었습니다.',
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
      handleError(error, '상담 예약에 실패했습니다. 다시 시도해주세요.');
    }
  }, [
    validateReservationData,
    formData,
    createReservation,
    handleError,
    formatDateForAPI,
    openModal,
    navigate,
    closeOverlay
  ]);

  const handleMembershipReservation = useCallback(async () => {
    try {
      if (!validateReservationData()) return;
      const branchId = formData.branch!;
      const membershipId = formData.membershipId;

      if (!membershipId) {
        handleError(new Error('회원권 정보가 올바르지 않습니다.'));
        return;
      }

      const reservationResponse = (await createReservation({
        r_gubun: 'R',
        mp_idx: membershipId,
        b_idx: branchId,
        r_date: formatDateForAPI(formData.date?.toDate() || null),
        r_stime: formData.timeSlot!.time,
        add_services: formData.additionalServices.map((service) => toNumber(service.s_idx)),
        r_memo: formData.request
      })) as any;

      if (reservationResponse.resultCode !== '00') {
        handleError(new Error(reservationResponse.resultMessage));
        return;
      }

      if (formData.additionalServices.length > 0) {
        const orderResponse = await createAdditionalManagementOrder({
          add_services: formData.additionalServices.map((service) => ({
            s_idx: service.s_idx,
            ss_idx: service.options[0].ss_idx,
            amount: 1
          })),
          b_idx: branchId
        });

        if (orderResponse.resultCode !== '00') {
          handleError(
            new Error(orderResponse.resultMessage),
            '추가 관리 주문 생성에 실패했습니다. 예약 정보를 확인해주세요.'
          );
          return;
        }

        navigate('/payment', {
          state: {
            type: 'additional',
            orderId: orderResponse.orderSheet.orderid,
            items: orderResponse.orderSheet.items
          },
          replace: true
        });
      } else {
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
      }
    } catch (error) {
      handleError(error, '예약에 실패했습니다. 다시 시도해주세요.');
    }
  }, [
    validateReservationData,
    formData,
    createReservation,
    handleError,
    formatDateForAPI,
    toNumber,
    createAdditionalManagementOrder,
    navigate,
    openModal,
    closeOverlay
  ]);

  if (isMembershipsLoading) {
    return <LoadingIndicator className="min-h-screen" />;
  }

  return (
    <div className="flex-1 space-y-3 pb-32 overflow-y-auto overflow-x-hidden">
      {showBranchModal && (
        <MembershipBranchSelectModal
          onBranchSelect={handleBranchSelect}
          onClose={handleCloseBranchModal}
          brandCode={selectedMembershipInfo?.brandCode || BRAND_CODE}
          memberShipId={formData.membershipId}
        />
      )}

      <section className="px-5 pt-2 pb-6 border-b-8 border-[#f7f7f7]">
        <h2 className="text-gray-700 text-18px font-sb leading-[148%] tracking-[-0.09px] mb-4">
          원하는 예약을 선택해주세요.
        </h2>
        <RadioGroup
          className="flex flex-col space-y-4"
          value={formData.item ?? ''}
          onChange={(e) => handleOnChangeItem(e.target.value)}
        >
          <div>
            <RadioCard
              checked={formData.item === '상담 예약'}
              value="상담 예약"
              disabled={consultationCount && consultationCount.maxCount - consultationCount.currentCount <= 0}
            >
              <div className="justify-start items-center gap-2 flex">
                <div
                  className={`text-16px font-sb ${
                    consultationCount && consultationCount.maxCount - consultationCount.currentCount <= 0
                      ? 'text-gray-400'
                      : 'text-gray-700'
                  }`}
                >
                  상담 예약
                </div>
                <div
                  className={`px-2 py-0.5 rounded-[999px] justify-center items-center flex ${
                    consultationCount && consultationCount.maxCount - consultationCount.currentCount <= 0
                      ? 'bg-[#FFF8F7]'
                      : 'bg-tag-greenBg'
                  }`}
                >
                  <div
                    className={`text-center text-12px font-m ${
                      consultationCount && consultationCount.maxCount - consultationCount.currentCount <= 0
                        ? 'text-error'
                        : 'text-tag-green'
                    }`}
                  >
                    {!consultationCount
                      ? '...'
                      : consultationCount.currentCount >= consultationCount.maxCount
                        ? '소진'
                        : consultationCount.currentCount === 0
                          ? 'FREE'
                          : `${consultationCount.maxCount - consultationCount.currentCount}/${consultationCount.maxCount}`}
                  </div>
                </div>
              </div>
            </RadioCard>
          </div>
          {memberships.length > 0 && (
            <MembershipSwiper
              membershipsData={{
                ...(userMembershipPaginationData?.pages[0] || {
                  resultCode: '00',
                  resultMessage: '',
                  resultCount: 0,
                  total_count: 0,
                  total_page_count: 0,
                  current_page: 0
                }),
                body: memberships
              }}
              selectedItem={formData.item}
              onChangeItem={handleOnChangeItem}
              initialMembershipId={initialMembershipId}
            />
          )}
        </RadioGroup>
        <div className="flex flex-col mt-[16px]">
          <p className="text-gray-500 text-14px">
            * 상담 예약은 월간 {consultationCount?.maxCount ?? '?'}회까지 이용 가능합니다.
          </p>
          {memberships.length === 0 && !isMembershipsLoading && (
            <p className="text-gray-500 text-14px">* 관리 프로그램은 회원권 구매 후 예약이 가능합니다.</p>
          )}
        </div>
      </section>

      <ReservationFormSection
        data={formData}
        selectedBranch={selectedBranch}
        onOpenCalendar={handleOpenCalendar}
        onChangeRequest={(value) => setFormDataInStore({ request: value })}
        onNavigateBranchSelect={handleNavigateBranchSelect}
        disableBranchSelection={isBranchSelectionDisabled}
      />

      <FixedButtonContainer className="bg-white">
        <Button
          variantType="primary"
          sizeType="l"
          onClick={async () => {
            if (isCreatingReservation) return;
            if (!validateReservationData()) return;

            if (formData.item === '상담 예약') {
              await handleConsultationReservation();
            } else {
              await handleMembershipReservation();
            }
          }}
          className="w-full"
        >
          {isCreatingReservation ? <CircularProgress size={20} /> : '예약하기'}
        </Button>
      </FixedButtonContainer>
    </div>
  );
};

export default ReservationFormPage;
