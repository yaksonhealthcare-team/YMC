import { BannerSchema } from '@/_domain/contents/types';

export interface BannerSwiperProps {
  banners: BannerSchema[];
  onClickBanner?: (link: string) => void;
}
