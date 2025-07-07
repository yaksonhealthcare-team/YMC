export interface RadioButtonProps {
  /**
   * 버튼의 값
   */
  value: string;

  /**
   * 버튼 옆 레이블
   */
  label?: React.ReactNode;

  /**
   * 변경 이벤트
   */
  onChange?: (checked: boolean, value: string) => void;

  /**
   * 버튼 선택 상태
   */
  checked?: boolean;

  /**
   * 그룹 이름
   */
  name?: string;

  /**
   * 추가 클래스
   */
  className?: string;
}
