import { BannerRequestType } from '@/types/Banner';
import { createQueryKeyFactory } from '../queryKeyFactory';

const bannersKeys = createQueryKeyFactory('banners');

export const banners = {
  all: bannersKeys.all(),
  bannerType: (bannerRequestType: BannerRequestType) => [...banners.all, { bannerRequestType }] as const
} as const;
