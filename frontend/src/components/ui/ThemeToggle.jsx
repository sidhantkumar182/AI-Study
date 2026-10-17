import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils';

export function ThemeToggle({ className, size = 'md' }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className={cn(
        'relative rounded-full transition-all duration-300',
        'bg-surface-100 dark:bg-surface-700',
        'hover:bg-surface-200 dark:hover:bg-surface-600',
        'border border-surface-200 dark:border-surface-600',
        size === 'md' ? 'w-14 h-7' : 'w-11 h-6',
        className
      )}
    >
      {/* Track */}
      <span
        className={cn(
          'absolute inset-0.5 rounded-full transition-all duration-300',
          theme === 'dark' ? 'bg-brand-600/30' : 'bg-amber-400/20'
        )}
      />
      {/* Thumb */}
      <span
        className={cn(
          'absolute top-0.5 rounded-full shadow-md transition-all duration-300 flex items-center justify-center',
          'bg-white dark:bg-surface-900',
          size === 'md' ? 'w-6 h-6' : 'w-5 h-5',
          theme === 'dark'
            ? size === 'md' ? 'left-[calc(100%-1.625rem)]' : 'left-[calc(100%-1.375rem)]'
            : 'left-0.5'
        )}
      >
        {theme === 'dark' ? (
          <Moon size={size === 'md' ? 12 : 10} className="text-brand-400" />
        ) : (
          <Sun size={size === 'md' ? 12 : 10} className="text-amber-500" />
        )}
      </span>
    </button>
  );
}
