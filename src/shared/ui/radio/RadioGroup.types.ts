export interface RadioGroupProps {
  /**
   * 라디오 그룹 이름
   */
  name: string;

  /**
   * 선택된 값
   */
  value: string;

  /**
   * 값 변경
   */
  onChange: (value: string) => void;

  /**
   * 자식 라디오 버튼
   */
  children: React.ReactNode;
  className?: string;
}
