import { UserSchema } from '@/_domain/auth';
import { BannerSchema, ContentsSchema } from '@/_domain/contents';

export interface HomeOverviewProps {
  user: UserSchema | null;
  banners?: BannerSchema[];
  notices?: ContentsSchema[];
  notiCount: number;
}
