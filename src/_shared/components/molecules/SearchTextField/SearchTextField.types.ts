import { ChangeEventHandler } from 'react';

export interface SearchTextFieldProps {
  /**
   * 문자열 값
   */
  value?: string;

  /**
   * 값 변경 이벤트
   */
  onChange?: ChangeEventHandler<HTMLInputElement>;

  /**
   * x버튼 클릭 이벤트
   */
  onClear?: () => void;

  /**
   * 플레이스 홀더
   */
  placeholder?: string;
  className?: string;
}
