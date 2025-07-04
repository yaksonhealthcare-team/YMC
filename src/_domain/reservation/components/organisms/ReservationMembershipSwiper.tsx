import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper/types';
import { ReservationMembershipCard } from './ReservationMembershipCard';
import { ReservationMembershipCardItem } from './ReservationMembershipCard.types';
import { ReservationMembershipSwiperProps } from './ReservationMembershipSwiper.types';

export const ReservationMembershipSwiper = ({ data, value, onChange }: ReservationMembershipSwiperProps) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const renderRef = useRef(false);

  useEffect(() => {
    const isValid = data && data.length > 0 && value;
    if (!isValid) return;

    const setInitialIndex = () => {
      const idx = data.findIndex((item) => item.id === value);
      setActiveIdx(idx === -1 ? 0 : idx);
    };

    if (!renderRef.current) {
      setInitialIndex();
      renderRef.current = true;
    }
  }, [value, data]);

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setActiveIdx(swiper.activeIndex);
  }, []);

  const handleChange = useCallback(
    (checked: boolean, value: string, item: ReservationMembershipCardItem) => {
      onChange(checked, value, item);
    },
    [onChange]
  );

  return (
    <>
      <Swiper modules={[Pagination]} spaceBetween={20} onSlideChange={handleSlideChange} className="w-full">
        {data.map((item, idx) => {
          const key = `${item.id}-${idx}`;

          return (
            <SwiperSlide key={key}>
              <ReservationMembershipCard
                data={item}
                checked={value === item.id}
                onChange={(checked, value) => handleChange(checked, value, item)}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="flex justify-center mt-4">
        {data.map((item, idx) => {
          const key = `i-${item.id}-${idx}`;

          return <Indicator key={key} active={idx === activeIdx} />;
        })}
      </div>
    </>
  );
};

interface IndicatorProps {
  active?: boolean;
}
const Indicator = ({ active }: IndicatorProps) => {
  return (
    <div
      className={clsx(
        'w-[6px] h-[6px] mx-1 rounded-full',
        active ? 'bg-primary' : 'border border-gray-200 bg-transparent'
      )}
    />
  );
};
