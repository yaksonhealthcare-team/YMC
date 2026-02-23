import { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  className?: string;
}

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonSize = 'small' | 'medium' | 'large';
