import { useHeaderStore } from '@/_shared/stores';
import CaretLeftIcon from '@/assets/icons/CaretLeftIcon.svg?react';
import clsx from 'clsx';

export const Header = () => {
  const { title, onBack } = useHeaderStore();

  return (
    <div className={clsx('h-[48px] flex justify-between py-3 px-5')}>
      <div className="shrink-0 min-w-20">
        <button onClick={onBack} className="flex items-center h-full">
          <CaretLeftIcon className={'w-5 h-5 text-gray-700'} />
        </button>
      </div>

      <div className="flex flex-1 mx-4 justify-center min-w-0">
        <p className="font-sb text-gray-700 text-base truncate">{title}</p>
      </div>

      <div className="shrink-0 min-w-20 flex justify-end">
        <div className="w-5 h-5" />
      </div>
    </div>
  );
};
