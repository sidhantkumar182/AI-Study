import { getInitials, cn } from '../../utils';

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const dotSizes = {
  xs: 'w-1.5 h-1.5 border',
  sm: 'w-2 h-2 border',
  md: 'w-2.5 h-2.5 border-2',
  lg: 'w-3 h-3 border-2',
  xl: 'w-3.5 h-3.5 border-2',
};

export function Avatar({ src, name, size = 'md', className, online }) {
  return (
    <div className={cn('relative shrink-0', className)}>
      {src ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          className={cn(
            'rounded-full object-cover bg-surface-200 dark:bg-surface-700',
            sizes[size]
          )}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <div
          className={cn(
            'rounded-full bg-brand-gradient flex items-center justify-center text-white font-semibold',
            sizes[size]
          )}
        >
          {name ? getInitials(name) : '?'}
        </div>
      )}
      {online !== undefined && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-white dark:border-surface-900',
            online ? 'bg-success-500' : 'bg-surface-400',
            dotSizes[size]
          )}
        />
      )}
    </div>
  );
}

export function AvatarWithName({ src, name, email, subtitle, size = 'md', online, className }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Avatar src={src} name={name} size={size} online={online} />
      <div className="min-w-0">
        {name && (
          <p className="text-sm font-semibold text-surface-900 dark:text-surface-100 truncate">
            {name}
          </p>
        )}
        {(email || subtitle) && (
          <p className="text-xs text-surface-500 dark:text-surface-400 truncate">
            {email || subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
