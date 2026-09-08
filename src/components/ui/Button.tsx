import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  id,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-mono font-medium rounded-xl transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:ring-cyan-500 whitespace-nowrap active:scale-[0.98]';

  // 44px+ touch targets and 2x horizontal padding rule
  const sizeStyles = {
    sm: 'min-h-[44px] px-4 py-2 text-sm gap-2',
    md: 'min-h-[44px] px-5 py-2.5 text-base gap-2.5',
    lg: 'min-h-[48px] px-6 py-3 text-base sm:text-lg gap-3',
  }[size];

  const variantStyles = {
    primary:
      'bg-cyan-500 text-zinc-950 hover:bg-cyan-400 font-semibold shadow-sm hover:shadow-[0_0_15px_rgba(6,182,212,0.35)]',
    secondary:
      'bg-pink-600 text-white hover:bg-pink-500 font-semibold shadow-sm hover:shadow-[0_0_15px_rgba(236,72,153,0.35)]',
    outline:
      'border border-zinc-700 bg-zinc-900/60 text-zinc-200 hover:bg-zinc-800 hover:text-cyan-400 hover:border-cyan-500/50',
    ghost:
      'bg-transparent text-zinc-300 hover:bg-zinc-800/80 hover:text-zinc-100',
    danger:
      'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20',
  }[variant];

  return (
    <button
      id={id}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" aria-hidden="true" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span className="leading-none">{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
