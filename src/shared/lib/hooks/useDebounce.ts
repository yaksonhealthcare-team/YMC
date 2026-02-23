import { useEffect, useState } from 'react';

/**
 * @param value   디바운스할 값 (string, number, 객체 등)
 * @param delay   지연 시간 (밀리초, 기본 300ms)
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
