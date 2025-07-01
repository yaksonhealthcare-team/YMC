export interface CollapseProps {
  /**
   * 열림/닫힘 상태
   */
  isOpen: boolean;

  /**
   * 보여줄 콘텐츠
   */
  children: React.ReactNode;

  /**
   * 열 때 마운트 여부
   */
  mountOnEnter?: boolean;

  /**
   * 닫고 나서 언마운트 여부
   */
  unmountOnExit?: boolean;
}
