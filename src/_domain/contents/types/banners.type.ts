export interface BannerParams {
  gubun: BannerGubun;
  area01?: string;
  area02?: string;
}
/**
 * - S01: SLIDE
 * - C01: CARD
 * - R01: RIBBON
 */
export type BannerGubun = 'S01' | 'C01' | 'R01';
export interface BannerSchema {
  code: string;
  title: string;
  link: string;
  prior: string;
  fileCode: string;
  fileUrl: string;
  startDate?: string;
  endDate?: string;
  isVisible?: boolean;
}
