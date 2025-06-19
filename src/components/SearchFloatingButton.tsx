import clsx from 'clsx';

const BUTTON_STYLES = {
  list: 'px-3 h-10',
  search: 'px-3 h-10 bg-white'
} as const;

const BUTTON_ICONS = {
  list: {
    src: '/assets/floatingIcons/list.png',
    alt: '리스트'
  },
  search: {
    src: '/assets/floatingIcons/map.png',
    alt: '지도'
  }
} as const;

const BASE_BUTTON_STYLES = 'shadow-floatingButton rounded-full flex items-center justify-center bg-white';

interface SearchFloatingButtonProps {
  type: keyof typeof BUTTON_STYLES;
  title: string;
  onClick: () => void;
}

export const SearchFloatingButton = ({ type, title, onClick }: SearchFloatingButtonProps) => (
  <button onClick={onClick} className={clsx(BASE_BUTTON_STYLES, BUTTON_STYLES[type])}>
    <img {...BUTTON_ICONS[type]} alt={'Button'} />
    <span className="font-m text-14px text-gray-700 ml-1">{title}</span>
  </button>
);
