import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper/types';
import { ReservationMembershipCard } from '../ReservationMembershipCard';
import { ReservationMembershipSwiperProps } from './ReservationMembershipSwiper.types';

export const ReservationMembershipSwiper = ({
  data,
  currentIndex,
  value,
  onChangeIndex,
  onChange
}: ReservationMembershipSwiperProps) => {
  const swiperRef = useRef<SwiperType>();
  const filteredData = data.filter((item) => !!item.mp_idx);

  const handleChangeSlide = (swiper: SwiperType) => {
    onChangeIndex(swiper.activeIndex);
  };

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(currentIndex, 0);
    }
  }, [currentIndex]);

  return (
    <>
      <Swiper
        modules={[Pagination]}
        spaceBetween={20}
        onSlideChange={handleChangeSlide}
        onSwiper={(sw) => (swiperRef.current = sw)}
        className="w-full"
      >
        {filteredData.map((item, idx) => {
          const key = `${item.mp_idx}-${idx}`;

          return (
            <SwiperSlide key={key}>
              <ReservationMembershipCard
                data={item}
                checked={value === item.mp_idx}
                onChange={(checked, value) => onChange(checked, value, item)}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="flex justify-center mt-4">
        {filteredData.map((item, idx) => {
          const key = `i-${item.mp_idx}-${idx}`;

          return <Indicator key={key} active={idx === currentIndex} />;
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
