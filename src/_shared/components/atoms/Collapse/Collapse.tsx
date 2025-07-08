import { useEffect, useRef, useState } from 'react';
import { CollapseProps } from './Collapse.types';

export const Collapse = ({ children, isOpen, mountOnEnter = false, unmountOnExit = false }: CollapseProps) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxH, setMaxH] = useState('0px');

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else if (!isOpen && unmountOnExit) {
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, unmountOnExit]);

  useEffect(() => {
    if (contentRef.current) {
      setMaxH(isOpen ? `${contentRef.current.scrollHeight}px` : '0px');
    }
  }, [isOpen, children]);

  if (!shouldRender && mountOnEnter && !isOpen) {
    return null;
  }

  return (
    <div
      ref={contentRef}
      style={{ maxHeight: maxH, transition: 'max-height 300ms ease' }}
      className="overflow-hidden w-full"
    >
      {children}
    </div>
  );
};
