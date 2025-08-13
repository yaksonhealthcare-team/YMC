export interface LoadingProps {
  variant?: LoadingVariant;
  className?: string;
  size?: number;
}

/**
 * - primary: 기본적으로 쓰이는 스타일
 * - button: 버튼에 쓰이는 스타일
 * - global: 전체 뷰포트를 기준으로 중앙에 위치하는 스타일
 */
export type LoadingVariant = 'primary' | 'button' | 'global';
