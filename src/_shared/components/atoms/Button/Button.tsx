import clsx from 'clsx';
import { Loading } from '../Loading';
import { ButtonProps, ButtonSize, ButtonVariant } from './Button.types';

export const Button = ({
  children,
  variant = 'primary',
  size = 'large',
  isLoading = false,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      disabled={isLoading}
      className={clsx(
        'normal-case w-full rounded-lg transition-colors duration-200 ease-in-out disabled:cursor-not-allowed',
        isLoading && 'flex justify-center',
        getStyles(variant, size),
        className
      )}
      {...props}
    >
      {isLoading ? <Loading variant="button" /> : children}
    </button>
  );
};

const getStyles = (variant: ButtonVariant, size: ButtonSize) => {
  return clsx(VARIANT_STYLES[variant], SIZE_STYLES[size]);
};

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white active:bg-primary-500 disabled:bg-[#DCDCDC] disabled:text-gray-400',
  secondary: 'bg-secondary text-primary-400 active:bg-primary-200 disabled:bg-grey-50 disabled:text-gray-300'
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  small: '',
  medium: '',
  large: 'px-5 py-3.5 font-b text-base'
};
