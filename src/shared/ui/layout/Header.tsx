import CaretDownIcon from '@/assets/icons/CaretDownIcon.svg?react';
import CaretLeftIcon from '@/assets/icons/CaretLeftIcon.svg?react';
import SearchIcon from '@/shared/ui/icons/SearchIcon';
import clsx from 'clsx';
import { cloneElement, type ReactElement, type SVGProps } from 'react';

const HEADER_STYLES = {
  location: 'py-3 px-5 bg-white',
  back_w: 'py-3.5 px-5',
  back_b: 'py-3.5 px-5',
  back_title: 'py-3 px-5',
  back_title_icon: 'py-3 px-5',
  two_icon: 'py-3 px-5',
  back_title_text: 'py-3 px-5',
  title_right_icon: 'py-3 px-5',
  back_title_right_icon: 'py-3 px-5'
} as const;

const TITLE_STYLES = {
  location: 'text-14px',
  default: 'text-16px'
} as const;

const ICON_DIMENSIONS = {
  width: '24px',
  height: '24px'
} as const;

interface HeaderProps {
  type: keyof typeof HEADER_STYLES;
  title?: string;
  textRight?: string;
  iconLeft?: ReactElement<SVGProps<SVGSVGElement>>;
  iconRight?: ReactElement<SVGProps<SVGSVGElement>>;
  onClickLeft?: () => void;
  onClickRight?: () => void;
  onClickLocation?: () => void;
  onClickBack?: () => void;
}

const LeftSection = ({ type, iconLeft, onClickLeft, onClickBack }: HeaderProps) => (
  <button onClick={type.startsWith('back') ? onClickBack : onClickLeft} className="flex items-center h-full">
    {type === 'two_icon' ? (
      cloneElement(iconLeft!, ICON_DIMENSIONS)
    ) : type === 'title_right_icon' ? (
      <div className="w-5 h-5" />
    ) : type.includes('back') ? (
      <CaretLeftIcon className={clsx('w-5 h-5', type === 'back_w' ? 'text-white' : 'text-gray-700')} />
    ) : (
      <div className="w-5 h-5" />
    )}
  </button>
);

const TitleSection = ({ type, title, onClickLocation }: HeaderProps) => (
  <div className="flex justify-center gap-2">
    <span className={clsx('font-sb text-gray-700', type === 'location' ? TITLE_STYLES.location : TITLE_STYLES.default)}>
      {title}
    </span>
    {type === 'location' && (
      <button onClick={onClickLocation} aria-label="위치 선택">
        <CaretDownIcon className="w-4 h-4" />
      </button>
    )}
  </div>
);

const RightSection = ({ type, iconRight, textRight, onClickRight }: HeaderProps) => {
  if (['back_w', 'back_b', 'back_title'].includes(type)) {
    return <div className="w-5 h-5" />;
  }

  if (type === 'location') {
    return (
      <button onClick={onClickRight}>
        <SearchIcon className="w-6 h-6" />
      </button>
    );
  }

  if (type === 'back_title_text') {
    return (
      <button onClick={onClickRight}>
        <span className="font-m text-16px text-gray-500">{textRight}</span>
      </button>
    );
  }

  if (iconRight) {
    return <button onClick={onClickRight}>{cloneElement(iconRight, ICON_DIMENSIONS)}</button>;
  }

  return <div className="w-5 h-5" />;
};

export const Header = (props: HeaderProps) => (
  <div className={clsx('flex justify-between items-center h-[48px]', HEADER_STYLES[props.type])}>
    <div className="shrink-0 min-w-20">
      <LeftSection {...props} />
    </div>

    <div className="flex-1 mx-4">
      <TitleSection {...props} />
    </div>

    <div className="shrink-0 min-w-20 flex justify-end">
      <RightSection {...props} />
    </div>
  </div>
);

Header.displayName = 'Header';

export default Header;
