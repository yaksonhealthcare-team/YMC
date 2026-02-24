import { useUserStore } from '@/features/auth/model/user.store';
import { useGetGuideMessages } from '@/features/reservation/lib/guide.services';
import type { BranchesSchema } from '@/entities/branch/model/branch.types';
import type { ReservationFormValues } from '@/entities/reservation/model/reservation.types';
import type { TimeSlot } from '@/entities/schedule/model/schedule.types';
import { formatReservationDate } from '@/shared/lib/utils/date.utils';
import { setMultipleValues } from '@/shared/lib/utils/form.utils';
import { InputBox } from '@/shared/ui/text-field/InputBox';
import { DateBottomSheet } from '@/widgets/date-bottom-sheet/ui/DateBottomSheet';
import CalendarIcon from '@/assets/icons/CalendarIcon.svg?react';
import CaretRightIcon from '@/assets/icons/CaretRightIcon.svg?react';
import { MembershipBranchSelectModal } from '@/pages/membership/ui/MembershipBranchSelectModal';
import { useOverlay } from '@/shared/ui/modal/ModalContext';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

export const ReservationRestSection = () => {
  const [showBranchModal, setShowBranchModal] = useState(false);

  const { control, getValues, setValue } = useFormContext<ReservationFormValues>();
  const [type, branch, date, timeSlot, request] = useWatch({
    control,
    name: ['type', 'branch', 'date', 'timeSlot', 'request']
  });
  const { getUserId } = useUserStore();
  const userId = getUserId();
  const { openBottomSheet, showToast, closeOverlay } = useOverlay();
  const { data: guideMessagesData } = useGetGuideMessages(userId);

  const handleSelectBranch = (branch: BranchesSchema) => {
    setMultipleValues(setValue, {
      type: 'consult',
      services: [],
      consultService: [{ type: 'only_consult', mp_idx: '', ss_idx: '', name: '' }],
      branch: { id: branch.b_idx, name: branch.b_name },
      date: null,
      timeSlot: { code: '', time: '' }
    });
  };
  const handleClickBranch = () => {
    const { consultService, services } = getValues();
    const hasConsultService = consultService.length > 0;
    const hasServices = services.length > 0;

    if (!hasConsultService && !hasServices) {
      showToast('회원권을 먼저 선택해주세요.');
      return;
    }

    setShowBranchModal(true);
  };
  const handleClickSchedule = () => {
    const { type, consultService, services } = getValues();
    const hasConsultService = consultService.length > 0;
    const hasServices = services.length > 0;

    if (!hasConsultService && !hasServices) {
      showToast('회원권을 먼저 선택해주세요.');
      return;
    }
    if (!branch?.id) {
      showToast('지점을 먼저 선택해주세요.');
      return;
    }
    if (type === 'membership') {
      const invalidPrepaid = services.some((s) => s.type === 'pre-paid' && !s.ss_idx);
      if (invalidPrepaid) {
        showToast('정액권의 관리메뉴를 선택해주세요.');
        return;
      }
    }

    openBottomSheet(<DateBottomSheet onClose={closeOverlay} onSelect={handleSelectSchedule} values={getValues()} />, {
      height: 'large'
    });
  };
  const handleSelectSchedule = useCallback(
    (date: dayjs.Dayjs, timeSlot: TimeSlot) => {
      setMultipleValues(setValue, { date, timeSlot });
    },
    [setValue]
  );

  const reservationDate = useMemo(() => formatReservationDate(date, timeSlot), [date, timeSlot]);
  const reserveMessage = useMemo(() => guideMessagesData?.body?.[0]?.reserve_msg ?? '', [guideMessagesData]);
  const canInputBox = type === 'consult';

  return (
    <>
      <div className="px-5 flex flex-col gap-6">
        <label className="flex flex-col gap-2">
          <p className="text-base font-sb">지점 선택</p>
          <InputBox
            type="button"
            placeholder="지점을 선택해주세요."
            icon={canInputBox && <CaretRightIcon className="w-4 h-4 text-gray-300" />}
            onClick={handleClickBranch}
            disabled={!canInputBox}
          >
            {branch?.name && (
              <p className={clsx('font-r', !canInputBox ? 'text-gray-200' : 'text-gray-700')}>{branch.name}</p>
            )}
          </InputBox>
        </label>

        <label className="flex flex-col gap-2">
          <p className="text-base font-sb">예약 일시</p>
          <InputBox
            type="button"
            placeholder="예약 날짜를 선택해주세요."
            icon={<CalendarIcon className="w-5 h-5 text-gray-300" />}
            onClick={handleClickSchedule}
          >
            {reservationDate && <p className="font-r">{reservationDate}</p>}
          </InputBox>
        </label>

        <label className="flex flex-col gap-2">
          <p className="text-base font-sb">요청사항</p>
          <InputBox
            type="textfield"
            placeholder="요청사항을 입력해주세요."
            inputProps={{ value: request, maxLength: 100, onChange: (e) => setValue('request', e.target.value) }}
          />
        </label>

        {reserveMessage && <p className="text-sm text-gray-500">{reserveMessage}</p>}
      </div>

      {showBranchModal && (
        <MembershipBranchSelectModal onSelect={handleSelectBranch} onClose={() => setShowBranchModal(false)} />
      )}
    </>
  );
};
