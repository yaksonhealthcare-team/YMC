import SearchIcon from '@/assets/icons/SearchIcon.svg?react';
import XCircle from '@/assets/icons/XCircle.svg?react';
import clsx from 'clsx';
import { SearchTextFieldProps } from './SearchTextField.types';

export const SearchTextField = ({ onClear, onChange, value, placeholder, className }: SearchTextFieldProps) => {
  const showClearButton = !!onClear && !!value;

  return (
    <div
      className={clsx(
        'flex items-center w-full rounded-xl border border-gray-100 px-4 py-3',
        'focus-within:ring-1 focus-within:ring-gray-500',
        className
      )}
    >
      <SearchIcon className="w-6 h-6 text-gray-700 mr-2" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="flex-1 bg-transparent text-base placeholder-gray-300 focus:outline-none"
      />
      <button
        type="button"
        onClick={onClear}
        className={clsx(
          'ml-2 transition-opacity duration-200 ease-in-out',
          showClearButton ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <XCircle className="w-5 h-5 text-gray-300" />
      </button>
    </div>
  );
};
