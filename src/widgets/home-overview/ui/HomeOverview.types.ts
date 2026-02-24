import { UserSchema } from '@/entities/user/model/user.types';
import { BannerSchema } from '@/entities/banner/model/banners.types';
import { ContentsSchema } from '@/entities/content/model/contents.types';

export interface HomeOverviewProps {
  user: UserSchema | null;
  banners?: BannerSchema[];
  notices?: ContentsSchema[];
  notiCount: number;
}
