import { RadioButtonProps } from '../../atoms';

export interface RadioLabelCardProps extends RadioButtonProps {
  /**
   * 라디오 버튼과 함께 사용할 레이블
   */
  label: string;

  /**
   * 클릭 이벤트
   */
  onClick?: (value: string, checked?: boolean) => void;
}
