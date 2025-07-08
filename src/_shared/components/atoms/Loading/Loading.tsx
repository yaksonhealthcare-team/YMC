import { LoadingProps } from './Loading.types';

export const Loading = ({ className, size = 48 }: LoadingProps) => {
  return (
    <div className={`flex flex-col flex-1 h-full items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-t-2 border-b-2 border-primary`}
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    </div>
  );
};
