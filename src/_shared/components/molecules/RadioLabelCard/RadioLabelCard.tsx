import clsx from 'clsx';
import { RadioButton } from '../../atoms';
import { RadioLabelCardProps } from './RadioLabelCard.types';

export const RadioLabelCard = ({
  className,
  label,
  checked,
  value,
  name,
  onChange,
  onClick,
  disabled = false
}: RadioLabelCardProps) => {
  const handleClick = () => {
    onClick?.(value, checked);
  };

  return (
    <label
      onClick={handleClick}
      className={clsx(
        'flex-1 min-w-0 px-5 py-4 bg-white rounded-xl border inline-flex items-center justify-between cursor-pointer',
        checked ? 'border-primary' : 'border-gray-100',
        className
      )}
    >
      {typeof label === 'string' ? <p className="text-base font-semibold truncate">{label}</p> : label}
      {!disabled && <RadioButton value={value} name={name} checked={checked} onChange={onChange} disabled={disabled} />}
    </label>
  );
};
