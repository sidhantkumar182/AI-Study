import { cn, clamp } from '../../utils';

const heights = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const fills = {
  brand: 'bg-brand-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
  gradient: 'bg-brand-gradient',
};

export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  variant = 'gradient',
  showLabel = false,
  label,
  animated = true,
  className,
}) {
  const percent = clamp((value / max) * 100, 0, 100);

  return (
    <div className={cn('w-full', className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-surface-500 dark:text-surface-400">{label}</span>}
          {showLabel && (
            <span className="text-xs font-semibold text-surface-700 dark:text-surface-300">
              {Math.round(percent)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full rounded-full bg-surface-100 dark:bg-surface-700 overflow-hidden',
          heights[size] || heights.md
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-700 ease-out',
            fills[variant] || fills.gradient,
            animated && 'progress-bar'
          )}
          style={{ width: `${percent}%`, '--progress': `${percent}%` }}
        />
      </div>
    </div>
  );
}

const strokeColors = {
  brand: '#6366f1',
  success: '#22c55e',
  warning: '#eab308',
};

export function CircularProgress({
  value,
  size = 80,
  strokeWidth = 6,
  variant = 'brand',
  children,
  className,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamp(value, 0, 100) / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-surface-200 dark:stroke-surface-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColors[variant] || strokeColors.brand}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">{children}</div>
      )}
    </div>
  );
}
