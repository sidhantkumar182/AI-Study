import { useState } from 'react';
import { cn } from '../../utils';

export function Tabs({ items, activeTab, onChange, variant = 'underline', className }) {
  if (variant === 'pill') {
    return (
      <div className={cn('flex gap-1.5 p-1 bg-surface-100 dark:bg-surface-800 rounded-2xl', className)}>
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
              item.id === activeTab
                ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-surface-100 shadow-sm'
                : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200'
            )}
          >
            {item.icon}
            {item.label}
            {item.badge !== undefined && (
              <span className="px-1.5 py-0.5 text-xs rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn('flex gap-2', className)}>
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200',
              item.id === activeTab
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400'
                : 'border-surface-200 dark:border-surface-700 text-surface-500 hover:border-surface-300 hover:text-surface-700 dark:hover:text-surface-200'
            )}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    );
  }

  // Underline (default)
  return (
    <div className={cn('flex border-b border-surface-200 dark:border-surface-700', className)}>
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={cn(
            'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-all duration-200',
            item.id === activeTab
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-surface-500 hover:text-surface-700 dark:hover:text-surface-200 hover:border-surface-300'
          )}
        >
          {item.icon}
          {item.label}
          {item.badge !== undefined && (
            <span className="px-1.5 py-0.5 text-xs rounded-full bg-surface-100 dark:bg-surface-700">
              {item.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function TabPanel({ activeTab, tabId, children }) {
  if (activeTab !== tabId) return null;
  return <div className="animate-fade-in">{children}</div>;
}

export function Accordion({ items, allowMultiple = false, className }) {
  const [openIds, setOpenIds] = useState(new Set());

  const toggle = (id) => {
    setOpenIds(prev => {
      const next = new Set(allowMultiple ? prev : new Set());
      if (prev.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className={cn('space-y-2', className)}>
      {items.map(item => {
        const isOpen = openIds.has(item.id);
        return (
          <div key={item.id} className="card overflow-hidden">
            <button
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors"
            >
              <span className="font-medium text-surface-900 dark:text-surface-100">
                {item.title}
              </span>
              <span
                className={cn(
                  'text-surface-400 transition-transform duration-200',
                  isOpen && 'rotate-180'
                )}
              >
                ▾
              </span>
            </button>
            {isOpen && (
              <div className="px-4 pb-4 text-sm text-surface-600 dark:text-surface-400 animate-slide-down border-t border-surface-100 dark:border-surface-700 pt-3">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
