import clsx from 'clsx';

export interface DividerProps {
  className?: string;
}

export const Divider = ({ className }: DividerProps) => {
  return <div className={clsx('w-full h-[8px] bg-gray-50', className)} />;
};
