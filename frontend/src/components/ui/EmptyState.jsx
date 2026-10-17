import { FileX, SearchX, BookOpen, MessageSquare, BarChart3 } from 'lucide-react';
import { cn } from '../../utils';

const configs = {
  default: {
    Icon: FileX,
    defaultTitle: 'Nothing here yet',
    defaultDesc: 'Get started by creating your first item.',
  },
  search: {
    Icon: SearchX,
    defaultTitle: 'No results found',
    defaultDesc: 'Try adjusting your search or filters.',
  },
  documents: {
    Icon: BookOpen,
    defaultTitle: 'No documents yet',
    defaultDesc: 'Upload your first PDF to get started.',
  },
  chat: {
    Icon: MessageSquare,
    defaultTitle: 'No conversations yet',
    defaultDesc: 'Start a new chat with your study materials.',
  },
  analytics: {
    Icon: BarChart3,
    defaultTitle: 'No data yet',
    defaultDesc: 'Complete some study sessions to see your analytics.',
  },
};

export function EmptyState({ title, description, action, variant = 'default', className }) {
  const { Icon, defaultTitle, defaultDesc } = configs[variant] || configs.default;

  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-8 text-center', className)}>
      <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
        <Icon size={28} className="text-surface-400 dark:text-surface-500" />
      </div>
      <h3 className="text-base font-semibold text-surface-900 dark:text-surface-100 mb-1">
        {title || defaultTitle}
      </h3>
      <p className="text-sm text-surface-500 dark:text-surface-400 max-w-xs">
        {description || defaultDesc}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-8 text-center', className)}>
      <div className="w-16 h-16 rounded-2xl bg-danger-500/10 flex items-center justify-center mb-4">
        <span className="text-3xl">⚠️</span>
      </div>
      <h3 className="text-base font-semibold text-surface-900 dark:text-surface-100 mb-1">
        {title || 'Something went wrong'}
      </h3>
      <p className="text-sm text-surface-500 dark:text-surface-400 max-w-xs">
        {description || 'An error occurred. Please try again.'}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
