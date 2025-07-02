import { ConsultMenuSchema } from '@/_domain/category/types/menu.types';

export type ConvertedConsultMenuData = ReturnType<typeof convertConsultMenu>;
/**
 * MenuChoicePage에서 사용할 데이터 변환
 * @return {ConvertedConsultMenuData}
 */
export const convertConsultMenu = (data?: ConsultMenuSchema[]) => {
  const hasData = data && data.length > 0;
  if (!hasData) return [];

  return data.map(({ s_name, s_time, sc_name, ss_count, ss_idx, ss_price }) => ({
    idx: ss_idx,
    name: s_name,
    category: sc_name,
    price: ss_price,
    spentTime: s_time,
    count: ss_count
  }));
};
