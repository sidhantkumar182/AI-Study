import { cn } from '../../utils';

const variants = {
  brand: 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400',
  accent: 'bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400',
  success: 'bg-success-500/10 text-success-600 dark:text-success-400',
  warning: 'bg-warning-500/10 text-warning-600 dark:text-warning-400',
  danger: 'bg-danger-500/10 text-danger-600 dark:text-danger-400',
  neutral: 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400',
  outline: 'border border-surface-300 dark:border-surface-600 text-surface-600 dark:text-surface-400',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
};

const dotColors = {
  brand: 'bg-brand-500',
  accent: 'bg-accent-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
  neutral: 'bg-surface-400',
  outline: 'bg-surface-400',
};

export function Badge({
  children,
  variant = 'neutral',
  size = 'sm',
  dot = false,
  className,
}) {
  return (
    <span
      className={cn(
        'badge font-medium',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />
      )}
      {children}
    </span>
  );
}
