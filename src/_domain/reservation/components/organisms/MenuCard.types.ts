export interface MenuCardProps {
  item: MenuCardItemProps;

  /**
   * 카드 타입
   * pre-paid: 정액권
   * @default 'standard'
   */
  type?: 'pre-paid' | 'standard';
}

export interface MenuCardItemProps {
  name: string;
  category?: string;
  spentTime?: string;
  price?: string;
}
