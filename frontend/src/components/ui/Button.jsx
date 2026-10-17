import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils';

const variants = {
  primary: `
    bg-brand-gradient text-white shadow-brand
    hover:shadow-brand-lg hover:-translate-y-0.5
    active:translate-y-0 active:shadow-brand
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-brand disabled:hover:translate-y-0
  `,
  secondary: `
    bg-surface-100 dark:bg-surface-700 text-surface-900 dark:text-surface-100
    hover:bg-surface-200 dark:hover:bg-surface-600
    border border-surface-200 dark:border-surface-600
    active:scale-[0.98]
  `,
  ghost: `
    text-surface-700 dark:text-surface-300
    hover:bg-surface-100 dark:hover:bg-surface-800
    active:bg-surface-200 dark:active:bg-surface-700
  `,
  outline: `
    border border-brand-500 text-brand-600 dark:text-brand-400
    hover:bg-brand-50 dark:hover:bg-brand-900/20
    active:scale-[0.98]
  `,
  danger: `
    bg-danger-500 text-white
    hover:bg-danger-600 hover:-translate-y-0.5 hover:shadow-lg
    active:translate-y-0
  `,
  glass: `
    glass-card text-surface-900 dark:text-surface-100
    hover:bg-white/90 dark:hover:bg-surface-700/90
    active:scale-[0.98]
  `,
};

const sizes = {
  xs: 'px-2.5 py-1.5 text-xs rounded-lg gap-1',
  sm: 'px-3.5 py-2 text-sm rounded-xl gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-2xl gap-2',
  xl: 'px-8 py-4 text-lg rounded-2xl gap-2.5 font-semibold',
};

export const Button = forwardRef(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
          'select-none cursor-pointer',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={size === 'xs' ? 12 : size === 'sm' ? 14 : 16} />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
