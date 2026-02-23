import React from 'react';

interface LoadingIndicatorProps {
  className?: string;
  size?: number;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ className = '', size = 48 }) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[200px] ${className}`}>
      <div
        className={`animate-spin rounded-full border-t-2 border-b-2 border-primary`}
        style={{ width: `${size}px`, height: `${size}px` }}
      ></div>
    </div>
  );
};

export default LoadingIndicator;
