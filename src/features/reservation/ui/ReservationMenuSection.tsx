import { convertMembershipForSwiperBySlot } from '@/features/membership-purchase/lib/membership.business';
import { ConvertedConsultMenuData } from '@/features/reservation/lib/menu.business';
import { isConsultReservationType, isReservationType, ReservationFormValues } from '@/entities/reservation/model';
import { Collapse, Divider, InputBox, RadioLabelCard, setMultipleValues } from '@/_shared';
import CaretRightIcon from '@/assets/icons/CaretRightIcon.svg?react';
import CloseIcon from '@/assets/icons/CloseIcon.svg?react';
import { useOverlay } from '@/shared/ui/modal/ModalContext';
import clsx from 'clsx';
import { useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { ReservationMembershipCardItem, ReservationMembershipSwiper } from '@/features/reservation/ui';
import { ReservationMenuSectionProps } from '@/features/reservation/ui/ReservationMenuSection.types';
import MenuChoicePage from '@/pages/reservation/MenuChoicePage';

export const ReservationMenuSection = ({ memberships, consultCount }: ReservationMenuSectionProps) => {
  const [showMenuPage, setShowMenuPage] = useState<{ open: boolean; idx?: number }>({ open: false });
  const [renderCount, setRenderCount] = useState(memberships.length > 0 ? 1 : 0); // 멤버십이 1개 이상이면 스와이퍼 최소 1개 렌더링
  const [currentIndexes, setCurrentIndexes] = useState<number[]>(Array(renderCount).fill(0));

  const { openModal, closeOverlay } = useOverlay();
  const { setValue, control } = useFormContext<ReservationFormValues>();
  const { fields, insert, remove } = useFieldArray({ control, name: 'services' });
  const [type, [consultService], branch, services] = useWatch({
    control,
    name: ['type', 'consultService', 'branch', 'services']
  });

  const handleChangeType = (_: boolean, value: string) => {
    if (!value || !isReservationType(value)) return;

    if (value === 'consult') {
      setMultipleValues(setValue, {
        services: [],
        consultService: [{ type: 'only_consult', mp_idx: '', ss_idx: '', name: '' }]
      });
      setRenderCount(memberships.length > 0 ? 1 : 0);
    } else if (value === 'membership') {
      setValue('consultService', []);
    }

    setMultipleValues(setValue, {
      branch: { id: '', name: '' },
      date: null,
      timeSlot: { code: '', time: '' },
      type: value
    });
  };
  const handleClickConsult = (value: string) => {
    if (!isConsultReservationType(value)) return;

    switch (value) {
      case 'only_consult':
        setMultipleValues(setValue, {
          consultService: [{ type: 'only_consult', mp_idx: '', ss_idx: '', name: '' }],
          date: null,
          timeSlot: { code: '', time: '' }
        });
        break;
      case 'add_menu':
        if (!branch?.id) {
          openModal({
            title: '지점을 먼저 선택해주세요.',
            message: '',
            onConfirm: closeOverlay
          });
          break;
        }

        setShowMenuPage({ open: true });
        setMultipleValues(setValue, {
          consultService: [{ ...consultService, type: value }],
          date: null,
          timeSlot: { code: '', time: '' }
        });
        break;
      default:
        break;
    }
  };
  const handleBack = () => {
    const hasValue = !!consultService?.ss_idx;
    if (!hasValue) {
      setValue('consultService', [{ ...consultService, type: 'only_consult' }]);
    }

    setShowMenuPage({ open: false });
  };
  const handleClickMenu = ({ name, ss_idx, price }: ConvertedConsultMenuData[number]) => {
    if (type === 'consult') {
      setValue('consultService', [{ ...consultService, name, ss_idx, price }]);
    } else if (type === 'membership') {
      const { idx } = showMenuPage;

      if (idx !== undefined) {
        setValue(`services.${idx}`, { ...services[idx], name, ss_idx, price });
      }
    }

    setShowMenuPage({ open: false });
  };
  const handleChangeMemberships = (value: string, item: ReservationMembershipCardItem, idx: number) => {
    const exists = Boolean(fields[idx]);
    if (exists) {
      setValue(`services.${idx}`, { mp_idx: value, ss_idx: '', type: item.type });
    } else {
      insert(idx, { mp_idx: value, ss_idx: '', type: item.type });
    }

    handleChangeType(false, 'membership');
    setValue('branch', { id: item.branchId, name: item.branchName });

    if (idx === 0 && branch?.id !== item.branchId) {
      setRenderCount(1);
    }
  };
  const handleClickAddReservation = () => {
    if (!services[renderCount - 1]?.mp_idx) return;

    setRenderCount((prev) => prev + 1);
    setCurrentIndexes((prev) => [...prev, 0]);
  };
  const handleRemoveReservation = (idx: number) => {
    remove(idx);
    setRenderCount((prev) => prev - 1);
    setCurrentIndexes((prev) => prev.filter((_, index) => index !== idx));
  };

  const { currentCount, maxCount } = consultCount;
  const isConsultDisable = maxCount - currentCount <= 0;
  const consultLabel = formatConsultLabel(maxCount, currentCount);
  const menuChoiceType = type === 'consult' ? 'standard' : 'pre-paid';
  const menuChoiceFetchParams = () => {
    if (menuChoiceType === 'standard') {
      return { b_idx: branch?.id ?? '', mp_idx: '' };
    }
    if ((menuChoiceType === 'pre-paid' && showMenuPage.idx !== null, showMenuPage.idx !== undefined)) {
      return { mp_idx: services[showMenuPage.idx]?.mp_idx ?? '', b_idx: '' };
    }
    return { b_idx: '', mp_idx: '' };
  };

  const hasMembership = memberships && memberships.length > 0;

  return (
    <>
      <div className="px-5">
        <h2 className="text-lg text-gray-700 font-sb mb-2">원하는 예약을 선택해주세요.</h2>
        <div className="flex flex-col mb-2">
          {maxCount > 0 && (
            <p className="text-sm text-gray-500">* 방문 완료 전 최대 {maxCount}회까지 예약 가능합니다.</p>
          )}
          {!hasMembership && (
            <p className="text-sm text-gray-500">* 관리 프로그램은 회원권 구매 후 예약이 가능합니다.</p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <RadioLabelCard
            checked={type === 'consult'}
            value={'consult'}
            onChange={handleChangeType}
            disabled={isConsultDisable}
            label={
              <div className="flex items-center gap-2">
                <p className={clsx('text-base font-sb truncate', isConsultDisable && 'text-gray-400')}>상담 예약</p>
                <div
                  className={clsx(
                    'px-2 py-0.5 rounded-full flex items-center justify-center text-xs font-m',
                    isConsultDisable ? 'bg-[#FFF8F7] text-error' : 'bg-tag-greenBg text-tag-green'
                  )}
                >
                  {consultLabel}
                </div>
              </div>
            }
          />

          <Collapse isOpen={type === 'consult'}>
            <div className="flex flex-row gap-4 mb-4">
              <RadioLabelCard
                value={'only_consult'}
                label="상담만"
                checked={consultService?.type === 'only_consult'}
                onChange={(_, value) => handleClickConsult(value)}
              />
              <RadioLabelCard
                value={'add_menu'}
                label={consultService?.name || '상담 후 관리'}
                checked={consultService?.type === 'add_menu'}
                onClick={handleClickConsult}
              />
            </div>
          </Collapse>
        </div>
      </div>

      <div className="mb-4">
        {Array.from({ length: renderCount }).map((_, idx) => {
          const { name, price, mp_idx, ss_idx, type } = services[idx] || {};
          const dataForSwiper = convertMembershipForSwiperBySlot(memberships, services, idx);
          const formattedPrice = `(${price}원 차감)`;
          const isPrepaid = type === 'pre-paid';
          const hasMembershipMenu = !!ss_idx;
          const isAddReservationSection = idx === renderCount - 1 && (hasMembershipMenu || type === 'standard');
          const isAddReservation = idx > 0;
          const hasAddReservation = dataForSwiper.length > 0;

          return (
            <div key={idx}>
              {isAddReservation && (
                <>
                  <Divider className="my-5" />
                  <div className="flex justify-between items-center px-5 mb-2">
                    <p className="font-sb text-lg">추가 관리를 선택해주세요.</p>
                    <button onClick={() => handleRemoveReservation(idx)}>
                      <CloseIcon width={18} height={18} className="text-gray-700" />
                    </button>
                  </div>
                  {!hasAddReservation && <p className="px-5 mt-4 text-gray-500">추가 가능한 회원권이 없습니다.</p>}
                </>
              )}
              <div className="px-5">
                <ReservationMembershipSwiper
                  data={dataForSwiper}
                  value={mp_idx}
                  currentIndex={currentIndexes[idx]}
                  onChange={(_, value, item) => handleChangeMemberships(value, item, idx)}
                  onChangeIndex={(newSlideIdx) => {
                    setCurrentIndexes((prev) => prev.map((v, i) => (i === idx ? newSlideIdx : v)));
                  }}
                />
                <Collapse isOpen={isPrepaid} mountOnEnter unmountOnExit>
                  <div className="mt-5">
                    <InputBox
                      type="button"
                      placeholder="관리 메뉴를 선택해주세요."
                      onClick={() => setShowMenuPage({ open: true, idx })}
                      icon={<CaretRightIcon width={16} height={16} className="text-gray-300" />}
                    >
                      {hasMembershipMenu ? (
                        <div className="flex items-center justify-between w-full min-w-0">
                          <span className="min-w-0 truncate text-black font-r text-base text-left">{name}</span>
                          <span className="flex-shrink-0 whitespace-nowrap mx-2 text-black font-r text-base">
                            {formattedPrice}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-300 text-base font-r">관리 메뉴를 선택해주세요.</span>
                      )}
                    </InputBox>
                  </div>
                </Collapse>

                {isAddReservationSection && (
                  <InputBox
                    type="button"
                    placeholder="+ 관리 예약 추가"
                    onClick={handleClickAddReservation}
                    className="mt-5"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showMenuPage.open && (
        <MenuChoicePage
          onBack={handleBack}
          onClickCard={handleClickMenu}
          type={menuChoiceType}
          fetchParams={menuChoiceFetchParams()}
        />
      )}
    </>
  );
};

const formatConsultLabel = (maxCount: number, currentCount: number) => {
  const remaining = maxCount - currentCount;

  switch (true) {
    case currentCount >= maxCount:
      return '소진';
    case currentCount === 0:
      return 'FREE';
    case remaining > 0:
      return `${remaining}/${maxCount}`;
    default:
      return '';
  }
};
