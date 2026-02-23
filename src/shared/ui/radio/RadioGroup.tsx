import React, { cloneElement, ReactNode } from 'react';
import { RadioGroupProps } from './RadioGroup.types';

/**
 * @description
 * RadioButton과 함께 사용해주세요.
 * children은 반드시 RadioButton의 props를 가진 컴포넌트여야 합니다.
 */
export const RadioGroup = ({ children, name, onChange, value, className }: RadioGroupProps) => {
  const handleChange = (checked: boolean, val: string) => {
    if (checked) onChange(val);
  };

  const inject = (nodes: React.ReactNode) => {
    return React.Children.map(nodes, (child: ReactNode) => {
      // ReactElement 가 아니면(문자열·null 등) 그대로 반환
      if (!React.isValidElement(child)) return child;

      return cloneElement<any>(child, {
        name,
        checked: child.props.value === value,
        onChange: handleChange
      });
    });
  };

  return (
    <div role="radiogroup" className={className}>
      {inject(children)}
    </div>
  );
};
