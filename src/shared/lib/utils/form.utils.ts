/**
 * resetField 함수를 이용해 여러 필드를 한 번에 초기화합니다.
 *
 * @param resetFieldFn  react-hook-form resetField 함수
 * @param fields        초기화할 필드 이름들
 */
export const resetMultipleFields = (resetFieldFn: (name: any) => void, fields: any[]): void => {
  fields.forEach((field) => resetFieldFn(field));
};

/**
 * setValue 함수를 이용해 여러 필드를 한 번에 업데이트합니다.
 *
 * @param setValueFn  react-hook-form setValue 함수
 * @param values      업데이트할 필드 이름과 값의 객체
 */
export const setMultipleValues = (
  setValueFn: (name: any, value: any) => void,
  values: { [key: string]: any }
): void => {
  Object.entries(values).forEach(([field, val]) => {
    setValueFn(field, val);
  });
};
