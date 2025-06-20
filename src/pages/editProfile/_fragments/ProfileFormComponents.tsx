import { Button } from '@/components/Button';
import clsx from 'clsx';
import { ReactNode } from 'react';

export const LabeledForm = ({
  label,
  className = '',
  children
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) => (
  <div className={'flex flex-col gap-3 items-stretch'}>
    <p className={'font-sb text-gray-500 self-start'}>{label}</p>
    <div className={clsx('w-full font-m text-18px', className)}>{children}</div>
  </div>
);

export const FieldWithButton = ({
  fieldValue,
  buttonLabel,
  onClick,
  buttonClassName = '',
  fieldClassName = ''
}: {
  fieldValue: string;
  buttonLabel: string;
  onClick: () => void;
  buttonClassName?: string;
  fieldClassName?: string;
}) => (
  <div className={'flex items-center gap-1 h-[52px]'}>
    <div className={clsx('border border-gray-100 px-4 rounded-[12px] w-full h-full flex items-center', fieldClassName)}>
      <p className={'text-16px font-r'}>{fieldValue}</p>
    </div>
    <Button className={clsx('h-full rounded-[12px]', buttonClassName)} variantType={'primary'} onClick={onClick}>
      <p className={'text-nowrap'}>{buttonLabel}</p>
    </Button>
  </div>
);
