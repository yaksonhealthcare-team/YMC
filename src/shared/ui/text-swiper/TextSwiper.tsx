import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { TextSwiperProps } from './TextSwiper.types';

const TextSwiper = <T extends { title: string }>({
  contents,
  SlideProps,
  onClick,
  left,
  right,
  ...props
}: TextSwiperProps<T>) => {
  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 3000, pauseOnMouseEnter: true }}
      loop
      direction="vertical"
      slidesPerView={1}
      {...props}
    >
      {contents.map((content, idx) => {
        const key = `${content.title}-${idx}`;

        return (
          <SwiperSlide
            key={key}
            className="cursor-pointer text-sm"
            {...SlideProps}
            onClick={() => onClick?.(content, idx)}
          >
            {left}
            <p className="truncate max-w-[90%]">{content.title}</p>
            {right}
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default TextSwiper;
