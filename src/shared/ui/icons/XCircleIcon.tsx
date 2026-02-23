import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

interface XCircleIconProps extends SvgIconProps {
  circleColor?: string;
}

export default function XCircleIcon({ circleColor = '#BDBDBD', ...props }: XCircleIconProps) {
  return (
    <SvgIcon {...props}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M2.66675 16.0003C2.66675 8.63653 8.63629 2.66699 16.0001 2.66699C23.3639 2.66699 29.3334 8.63653 29.3334 16.0003C29.3334 23.3641 23.3639 29.3337 16.0001 29.3337C8.63629 29.3337 2.66675 23.3641 2.66675 16.0003Z"
          fill={circleColor}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M22.2763 9.72406C22.797 10.2448 22.797 11.089 22.2763 11.6097L11.6101 22.2758C11.0894 22.7965 10.2452 22.7965 9.72452 22.2758C9.20383 21.7551 9.20382 20.9109 9.72452 20.3902L20.3907 9.72406C20.9114 9.20336 21.7556 9.20336 22.2763 9.72406Z"
          fill="white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M22.2762 22.2758C21.7555 22.7965 20.9113 22.7965 20.3906 22.2758L9.72441 11.6097C9.20371 11.089 9.20371 10.2447 9.72441 9.72404C10.2451 9.20334 11.0893 9.20334 11.61 9.72404L22.2762 20.3902C22.7969 20.9109 22.7969 21.7551 22.2762 22.2758Z"
          fill="white"
        />
      </svg>
    </SvgIcon>
  );
}
