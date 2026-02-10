import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { BannerSwiperProps } from './BannerSwiper.types';

const BannerSwiper = ({ banners, onClickBanner }: BannerSwiperProps) => {
  return (
    <Swiper
      modules={[Pagination]}
      pagination={{ clickable: true }}
      slidesPerView={1}
      className="w-full aspect-[8/5] rounded-2xl"
      loop={banners.length > 1}
    >
      {banners.map((banner, idx) => {
        const key = `${banner.code}-${idx}`;

        return (
          <SwiperSlide key={key}>
            <button className="w-full" onClick={() => onClickBanner?.(banner.link)}>
              <img
                src={banner.fileurl}
                alt={banner.title}
                className="object-cover rounded-2xl"
                width="100%"
                height="auto"
              />
            </button>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default BannerSwiper;
