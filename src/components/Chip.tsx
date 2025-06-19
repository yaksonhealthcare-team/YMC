import clsx from 'clsx';

interface ChipProps extends React.HTMLAttributes<HTMLButtonElement> {
  type?: 'default' | 'finish' | 'strong';
  title: string;
  onClick?: () => void;
}

export const Chip = (props: ChipProps) => {
  const { type = 'default', title } = props;

  const styles = {
    default: `bg-tag-redBg text-primary`,
    finish: `bg-gray-100 text-gray-400`,
    strong: `bg-primary text-white`
  };

  return (
    <button
      onClick={props.onClick}
      className={clsx('py-[3px] px-2 font-m text-12px rounded-full', styles[type], '')}
      aria-label={`${title} ${type === 'finish' ? '완료됨' : type === 'strong' ? '강조됨' : ''}`}
      aria-pressed={type === 'strong'}
    >
      {title}
    </button>
  );
};
