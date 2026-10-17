import { Search, X } from 'lucide-react';
import { cn } from '../../utils';

const sizes = {
  sm: 'py-2 text-sm',
  md: 'py-2.5 text-sm',
  lg: 'py-3 text-base',
};

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  className,
  size = 'md',
}) {
  return (
    <div className={cn('relative flex items-center', className)}>
      <Search
        size={16}
        className="absolute left-3.5 text-surface-400 dark:text-surface-500 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full pl-10 pr-10 rounded-xl border border-surface-200 dark:border-surface-700',
          'bg-white dark:bg-surface-800',
          'text-surface-900 dark:text-surface-100',
          'placeholder:text-surface-400 dark:placeholder:text-surface-500',
          'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500',
          'transition-all duration-200',
          sizes[size] || sizes.md
        )}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3.5 text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
