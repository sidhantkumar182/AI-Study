import { forwardRef } from 'react';
import { cn } from '../../utils';

export const Input = forwardRef(
  ({ label, error, hint, leftIcon, rightIcon, onRightIconClick, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-surface-700 dark:text-surface-300"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3.5 text-surface-400 dark:text-surface-500 pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'input-base',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-danger-500 focus:ring-danger-500/50 focus:border-danger-500',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <button
              type="button"
              onClick={onRightIconClick}
              className={cn(
                'absolute right-3.5 text-surface-400 dark:text-surface-500',
                onRightIconClick && 'hover:text-surface-700 dark:hover:text-surface-200 cursor-pointer transition-colors'
              )}
            >
              {rightIcon}
            </button>
          )}
        </div>
        {error && (
          <p className="text-xs text-danger-500 flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
        {!error && hint && (
          <p className="text-xs text-surface-400 dark:text-surface-500">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export const Textarea = forwardRef(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-surface-700 dark:text-surface-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'input-base resize-none min-h-[100px]',
            error && 'border-danger-500 focus:ring-danger-500/50',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-danger-500">⚠ {error}</p>}
        {!error && hint && <p className="text-xs text-surface-400">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
