export interface InputBoxProps {
  type?: 'button' | 'textfield';
  onClick?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  children?: React.ReactNode;

  /**
   * type이 textfield일 경우에 사용합니다.
   */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}
