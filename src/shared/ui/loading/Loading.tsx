import clsx from 'clsx';
import { LoadingProps } from './Loading.types';

export const Loading = ({ variant = 'primary', ...props }: LoadingProps) => {
  switch (variant) {
    case 'primary':
      return <PrimaryLoading {...props} />;
    case 'button':
      return <ButtonLoading {...props} />;
    case 'global':
      return <GlobalLoading {...props} />;
    default:
      return <PrimaryLoading {...props} />;
  }
};

const PrimaryLoading = ({ size = 48, className }: LoadingProps) => {
  return (
    <div className={clsx('flex flex-col flex-1 h-full items-center justify-center', className)}>
      <div
        className={clsx('animate-spin rounded-full border-t-2 border-b-2 border-primary')}
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    </div>
  );
};

const ButtonLoading = ({ size = 24, className }: LoadingProps) => {
  return (
    <div
      className={clsx('animate-spin rounded-full border-2 border-white border-t-primary/50', className)}
      style={{ width: size, height: size }}
    />
  );
};

const GlobalLoading = ({ size = 48, className }: LoadingProps) => {
  return (
    <div
      className={clsx('fixed inset-0 z-9999 flex items-center justify-center bg-white/60 backdrop-blur-sm', className)}
    >
      <div
        className={clsx('animate-spin rounded-full border-t-2 border-b-2 border-primary')}
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    </div>
  );
};
