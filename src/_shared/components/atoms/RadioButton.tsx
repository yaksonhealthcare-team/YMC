import clsx from 'clsx';
import { RadioButtonProps } from './RadioButton.types';

/**
 * @description
 * RadioButton을 여러개 핸들링 할 경우, RadioGroup과 함께 사용해주세요.
 */
export const RadioButton = ({ className, value, label, checked = false, onChange, name }: RadioButtonProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked, value);
  };

  return (
    <label className={clsx('inline-flex flex-row items-center cursor-pointer w-max', className)}>
      <div className="relative w-5 h-5 items-center justify-center">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={handleChange}
          className="absolute inset-0 opacity-0 peer cursor-pointer"
        />
        <Outer checked={checked} />
        {checked && <Inner />}
      </div>
      {label && label}
    </label>
  );
};

const Outer = ({ checked }: Record<'checked', RadioButtonProps['checked']>) => {
  return <div className={clsx('w-full h-full rounded-full', checked ? 'bg-primary' : 'border-2 border-gray-200')} />;
};

const Inner = () => {
  return <div className="absolute w-2 h-2 rounded-full bg-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />;
};
