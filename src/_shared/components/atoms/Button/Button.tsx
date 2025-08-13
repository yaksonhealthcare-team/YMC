import clsx from 'clsx';
import { Loading } from '../Loading';
import { ButtonProps, ButtonSize, ButtonVariant } from './Button.types';

export const Button = ({
  children,
  variant = 'primary',
  size = 'large',
  isLoading = false,
  className = '',
  ...props
}: ButtonProps) => {
  const hasCustomBg = /\bbg-/.test(className);
  const style = getStyles(variant, size, hasCustomBg);

  return (
    <button
      disabled={isLoading}
      className={clsx(
        'normal-case w-full rounded-lg transition-colors duration-200 ease-in-out disabled:cursor-not-allowed',
        isLoading && 'flex justify-center',
        style,
        className
      )}
      {...props}
    >
      {isLoading ? <Loading variant="button" /> : children}
    </button>
  );
};

const getStyles = (variant: ButtonVariant, size: ButtonSize, hasCustomBg: boolean) => {
  const variantStyles = hasCustomBg
    ? removeBgColor(VARIANT_STYLES[variant]) // bg-를 다 지움
    : VARIANT_STYLES[variant];

  return clsx(variantStyles, SIZE_STYLES[size]);
};

/**
 * @deprecated
 * tailwind.config.js 에 important: true로 되어있어
 * 외부에서 className 주입으로 backgroundColor 오버라이딩이 안되기 때문에 사용
 * 해결되면 제거 필요함
 */
const removeBgColor = (classes: string) => {
  return classes
    .split(' ')
    .filter((c) => !c.startsWith('bg-'))
    .join(' ');
};

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white active:opacity-70 disabled:bg-[#DCDCDC] disabled:text-gray-400',
  secondary: 'bg-secondary text-primary-400 active:bg-primary-200 disabled:bg-grey-50 disabled:text-gray-300'
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  small: '',
  medium: '',
  large: 'px-5 py-3.5 font-b text-base'
};
