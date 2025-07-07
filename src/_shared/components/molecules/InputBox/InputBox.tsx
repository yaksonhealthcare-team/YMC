import clsx from 'clsx';
import { InputBoxProps } from './InputBox.types';

export const InputBox = ({
  placeholder,
  disabled = false,
  type = 'button',
  onClick,
  icon,
  className,
  children,
  inputProps
}: InputBoxProps) => {
  const Container = type === 'button' ? 'button' : 'div';

  return (
    <Container
      className={clsx(
        'w-full px-5 py-4 flex items-center justify-between border border-gray-100 rounded-xl',
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {type === 'button' ? (
        <Button placeholder={placeholder}>{children}</Button>
      ) : (
        <TextField placeholder={placeholder} disabled={disabled} {...inputProps} />
      )}
      {icon && icon}
    </Container>
  );
};

interface ButtonProps {
  placeholder?: string;
  children?: React.ReactNode;
}
const Button = ({ children, placeholder }: ButtonProps) => {
  if (children) return children;
  if (placeholder) return <p className="text-gray-300 text-base font-r">{placeholder}</p>;
};

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  disabled?: boolean;
}
const TextField = ({ ...props }: TextFieldProps) => {
  return (
    <input
      type="text"
      className="flex-1 bg-transparent placeholder-gray-300 placeholder:font-r placeholder:text-base focus:outline-none"
      {...props}
    />
  );
};
