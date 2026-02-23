import { SwiperProps, SwiperSlideProps } from 'swiper/react';

export interface TextSwiperProps<T extends { title: string }> extends Omit<SwiperProps, 'onClick'> {
  contents: T[];
  onClick?: (contents: T, idx: number) => void;
  SlideProps?: SwiperSlideProps;
  left?: React.ReactNode;
  right?: React.ReactNode;
}
