import React from 'react';

interface BranchIconProps {
  className?: string;
  color?: string;
}

const BranchIcon: React.FC<BranchIconProps> = ({ className, color = '#212121' }) => {
  return (
    <svg viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M2.00586 7.98047V10.9738C2.00586 13.9671 3.20586 15.1671 6.19919 15.1671H9.79253C12.7859 15.1671 13.9859 13.9671 13.9859 10.9738V7.98047"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.00097 8.49967C9.22097 8.49967 10.121 7.50634 10.001 6.28634L9.56097 1.83301H6.44764L6.00097 6.28634C5.88097 7.50634 6.78097 8.49967 8.00097 8.49967Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.2065 8.49967C13.5532 8.49967 14.5399 7.40634 14.4065 6.06634L14.2199 4.23301C13.9799 2.49967 13.3132 1.83301 11.5665 1.83301H9.5332L9.99987 6.50634C10.1132 7.60634 11.1065 8.49967 12.2065 8.49967Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.7609 8.49967C4.8609 8.49967 5.85423 7.60634 5.9609 6.50634L6.10757 5.03301L6.42757 1.83301H4.39423C2.64757 1.83301 1.9809 2.49967 1.7409 4.23301L1.5609 6.06634C1.42756 7.40634 2.41423 8.49967 3.7609 8.49967Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.00065 11.833C6.88732 11.833 6.33398 12.3863 6.33398 13.4997V15.1663H9.66732V13.4997C9.66732 12.3863 9.11398 11.833 8.00065 11.833Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default BranchIcon;
