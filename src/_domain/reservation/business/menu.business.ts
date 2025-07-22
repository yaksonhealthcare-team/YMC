import { ConsultMenuSchema, PrepaidMenuSchema } from '@/_domain/category/types/menu.types';

export type ConvertedConsultMenuData = ReturnType<typeof convertConsultMenu>;
/**
 * MenuChoicePage에서 사용할 상담 데이터 변환
 * @return {ConvertedConsultMenuData}
 */
export const convertConsultMenu = (data?: ConsultMenuSchema[]) => {
  const hasData = data && data.length > 0;
  if (!hasData) return [];

  return data.map(({ s_name, s_time, sc_name, ss_count, ss_idx, ss_price }) => ({
    ss_idx,
    name: s_name,
    category: sc_name,
    price: ss_price,
    spentTime: s_time,
    count: ss_count
  }));
};

export type ConvertedPrepaidMenuData = ReturnType<typeof convertPrepaidMenu>;
/**
 * MenuChoicePage에서 사용할 정액권 데이터 변환
 * @return {ConvertedPrepaidMenuData}
 */
export const convertPrepaidMenu = (data?: PrepaidMenuSchema[]) => {
  const hasData = data && data.length > 0;
  if (!hasData) return [];

  return data.map(({ s_name, s_time, sc_name, ss_count, ss_idx, ss_unit_price }) => ({
    ss_idx,
    name: s_name,
    category: sc_name,
    price: ss_unit_price,
    spentTime: s_time,
    count: ss_count
  }));
};
