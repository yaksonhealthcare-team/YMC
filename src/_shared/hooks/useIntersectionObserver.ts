import { useEffect } from 'react';

export interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

/**
 * 주어진 ref 엘리먼트를 IntersectionObserver로 감시하고,
 * 교차(intersect) 시 onIntersect 콜백을 호출합니다.
 *
 * @param ref         감시할 엘리먼트의 React ref
 * @param onIntersect 교차 시 실행할 콜백
 * @param options     IntersectionObserver 옵션 (root, rootMargin, threshold)
 */

export const useIntersectionObserver = <T extends Element>(
  ref: React.RefObject<T>,
  onIntersect: () => void,
  options: IntersectionObserverOptions = {}
) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            onIntersect();
          }
        }
      },
      {
        root: options.root ?? null,
        rootMargin: options.rootMargin ?? '0px',
        threshold: options.threshold ?? 0
      }
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [onIntersect, options.root, options.rootMargin, options.threshold, ref]);
};
