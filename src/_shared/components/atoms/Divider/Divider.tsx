import clsx from 'clsx';
import { DividerProps } from './Divider.types';

export const Divider = ({ className }: DividerProps) => {
  return <div className={clsx('w-full h-[8px] bg-gray-50', className)} />;
};
