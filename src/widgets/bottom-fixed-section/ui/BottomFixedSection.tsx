import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { BottomFixedSectionProps } from './BottomFixedSection.types';

export const BottomFixedSection = ({ children, className }: BottomFixedSectionProps) => {
  const [height, setHeight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeight = () => {
      if (ref.current) setHeight(ref.current.offsetHeight);
    };

    updateHeight();

    window.addEventListener('resize', updateHeight);
    const ro = new ResizeObserver(updateHeight);
    if (ref.current) ro.observe(ref.current);

    return () => {
      window.removeEventListener('resize', updateHeight);
      ro.disconnect();
    };
  }, []);

  return (
    <>
      <div style={{ paddingBottom: height }} />

      <section
        ref={ref}
        className={clsx(
          'fixed bottom-0 left-0 right-0 bg-white z-[1000] max-w-[500px] mx-auto pointer-events-none border-t border-gray-100',
          className
        )}
      >
        <div className="flex pointer-events-auto px-5 pb-7 pt-3">{children}</div>
      </section>
    </>
  );
};
