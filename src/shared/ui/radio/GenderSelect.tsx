import { Gender, getGenderDisplay } from '@/shared/lib/utils/gender';
import { RadioGroup } from '@mui/material';
import clsx from 'clsx';
import { RadioCard } from './RadioCard';

interface GenderSelectProps {
  value: Gender;
  onChange?: (gender: Gender) => void;
  disabled?: boolean;
  className?: string;
}

export function GenderSelect({ value, onChange, disabled, className = '' }: GenderSelectProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value as Gender);
  };

  if (disabled) {
    return (
      <div className="flex gap-2" role="radiogroup" aria-label="성별 선택">
        {['F', 'M'].map((gender) => (
          <button
            key={gender}
            className={clsx(
              'flex-1 h-[52px] px-5 rounded-xl border flex justify-between items-center cursor-not-allowed opacity-75',
              value === gender ? 'bg-[#FEF2F1] border-primary' : 'border-[#ECECEC] bg-gray-50',
              className
            )}
            disabled
            role="radio"
            aria-checked={value === gender}
            aria-label={`${getGenderDisplay(gender as Gender)} ${value === gender ? '선택됨' : ''}`}
          >
            <span className={clsx('text-16px', value === gender ? 'font-semibold' : 'text-gray-500')}>
              {getGenderDisplay(gender as Gender)}
            </span>
            <div
              className={clsx(
                'w-5 h-5 rounded-full',
                value === gender
                  ? 'bg-primary flex items-center justify-center opacity-75'
                  : 'border-2 border-[#DDDDDD] bg-gray-100'
              )}
              aria-hidden="true"
            >
              {value === gender && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </button>
        ))}
      </div>
    );
  }

  return (
    <RadioGroup value={value} onChange={handleChange} aria-label="성별 선택">
      <div className={clsx('flex gap-2', className)}>
        {['F', 'M'].map((gender) => (
          <RadioCard
            key={gender}
            value={gender}
            checked={value === gender}
            className={clsx(
              'flex-1 !min-h-[52px] !py-4 !px-4 !rounded-[12px]',
              value === gender ? '!bg-[#FEF2F1] !border-primary' : ''
            )}
            aria-label={`${getGenderDisplay(gender as Gender)} ${value === gender ? '선택됨' : ''}`}
          >
            <p className="text-[16px] font-semibold leading-[20px]">{getGenderDisplay(gender as Gender)}</p>
          </RadioCard>
        ))}
      </div>
    </RadioGroup>
  );
}
