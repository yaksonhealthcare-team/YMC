import { ReservationFormValues } from '@/_domain/reservation';
import dayjs from 'dayjs';
import { describe, expect, it } from '@jest/globals';
import { buildScheduleParams, getDateBottomSheetQueryEnabled } from './DateBottomSheet.utils';

const baseValues: ReservationFormValues = {
  type: 'membership',
  branch: { id: '165', name: '테스트지점' },
  consultService: [],
  services: [{ mp_idx: '1341765', ss_idx: '' }],
  date: null,
  timeSlot: { time: '' },
  request: ''
};

describe('DateBottomSheet utils', () => {
  it('should enable date query only when userId and branchId exist', () => {
    expect(getDateBottomSheetQueryEnabled('', '165', dayjs()).isDateQueryEnabled).toBe(false);
    expect(getDateBottomSheetQueryEnabled('u1', '', dayjs()).isDateQueryEnabled).toBe(false);
    expect(getDateBottomSheetQueryEnabled('u1', '165', dayjs()).isDateQueryEnabled).toBe(true);
  });

  it('should enable time query only when selectedDate exists', () => {
    expect(getDateBottomSheetQueryEnabled('u1', '165', null).isTimeQueryEnabled).toBe(false);
    expect(getDateBottomSheetQueryEnabled('u1', '165', dayjs('2026-02-14')).isTimeQueryEnabled).toBe(true);
  });

  it('should build valid date params', () => {
    const params = buildScheduleParams('date', baseValues, dayjs('2026-02-01'));
    expect(params.search_date).toBe('2026-02');
    expect(params.b_idx).toBe('165');
    expect(params.mp_idx).toEqual(['1341765']);
    expect(params.ss_idx).toBeUndefined();
  });

  it('should build valid times params without empty strings', () => {
    const params = buildScheduleParams('times', baseValues, dayjs('2026-02-14'));
    expect(params.search_date).toBe('2026-02-14');
    expect(params.b_idx).toBe('165');
    expect(params.mp_idx).toEqual(['1341765']);
    expect(params.ss_idx).toBeUndefined();
  });
});
