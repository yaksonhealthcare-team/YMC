import { BannerSchema } from '@/entities/banner/model/banners.types';

export interface BannerSwiperProps {
  banners: BannerSchema[];
  onClickBanner?: (link: string) => void;
}
