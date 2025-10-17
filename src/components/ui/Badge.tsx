import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full font-medium transition-all duration-fast',
  {
    variants: {
      variant: {
        default: 'bg-bg-elevated text-text-primary border border-border',
        primary: 'bg-primary/10 text-primary border border-primary/20',
        secondary: 'bg-secondary/10 text-secondary border border-secondary/20',
        success: 'bg-success/10 text-success border border-success/20',
        warning: 'bg-warning/10 text-warning border border-warning/20',
        danger: 'bg-danger/10 text-danger border border-danger/20',
        info: 'bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20',
        accent: 'bg-accent/10 text-[#D97706] border border-accent/20',
        solid: 'bg-primary text-white border-0 shadow-sm',
        outline: 'bg-transparent text-text-primary border border-border',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs h-5',
        md: 'px-3 py-1 text-sm h-6',
        lg: 'px-4 py-1.5 text-base h-8',
      },
      rounded: {
        default: 'rounded-full',
        square: 'rounded-md',
        pill: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      rounded: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  dot?: boolean;
  onRemove?: () => void;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      leftIcon,
      rightIcon,
      dot,
      onRemove,
      children,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: { icon: 'w-3 h-3', dot: 'w-1.5 h-1.5', gap: 'gap-1' },
      md: { icon: 'w-3.5 h-3.5', dot: 'w-2 h-2', gap: 'gap-1.5' },
      lg: { icon: 'w-4 h-4', dot: 'w-2.5 h-2.5', gap: 'gap-2' },
    }[size || 'md'];

    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size, rounded, className }))}
        {...props}
      >
        <div className={cn('flex items-center', sizeClasses.gap)}>
          {dot && (
            <span
              className={cn(
                'rounded-full',
                sizeClasses.dot,
                variant === 'success' && 'bg-success',
                variant === 'warning' && 'bg-warning',
                variant === 'danger' && 'bg-danger',
                variant === 'info' && 'bg-[#3B82F6]',
                variant === 'primary' && 'bg-primary',
                variant === 'secondary' && 'bg-secondary',
                !variant && 'bg-text-secondary'
              )}
            />
          )}
          
          {leftIcon && (
            <span className={cn('flex-shrink-0', sizeClasses.icon)}>
              {leftIcon}
            </span>
          )}
          
          {children && <span className="truncate">{children}</span>}
          
          {rightIcon && !onRemove && (
            <span className={cn('flex-shrink-0', sizeClasses.icon)}>
              {rightIcon}
            </span>
          )}
          
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className={cn(
                'flex-shrink-0 ml-0.5 hover:opacity-70 transition-opacity',
                sizeClasses.icon
              )}
              aria-label="Remove"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-full h-full"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants };

/**
 * StatusBadge - Specialized badge for status indicators
 */
export interface StatusBadgeProps extends Omit<BadgeProps, 'variant' | 'dot'> {
  status: 'active' | 'pending' | 'completed' | 'failed' | 'cancelled' | 'in-progress';
}

const statusConfig = {
  active: { variant: 'success' as const, label: '활성', dot: true },
  pending: { variant: 'warning' as const, label: '대기중', dot: true },
  completed: { variant: 'success' as const, label: '완료', dot: false },
  failed: { variant: 'danger' as const, label: '실패', dot: false },
  cancelled: { variant: 'default' as const, label: '취소됨', dot: false },
  'in-progress': { variant: 'info' as const, label: '진행중', dot: true },
};

export const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ status, children, ...props }, ref) => {
    const config = statusConfig[status];
    
    return (
      <Badge
        ref={ref}
        variant={config.variant}
        dot={config.dot}
        {...props}
      >
        {children || config.label}
      </Badge>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';

/**
 * PlatformBadge - Badge for social media platforms
 */
export interface PlatformBadgeProps extends Omit<BadgeProps, 'variant' | 'leftIcon'> {
  platform: 'tiktok' | 'youtube' | 'instagram';
  verified?: boolean;
}

const platformConfig = {
  tiktok: {
    icon: '🎵',
    label: 'TikTok',
    className: 'bg-[#000000] text-white border-0',
  },
  youtube: {
    icon: '▶️',
    label: 'YouTube',
    className: 'bg-[#FF0000] text-white border-0',
  },
  instagram: {
    icon: '📷',
    label: 'Instagram',
    className: 'bg-gradient-to-tr from-[#FCAF45] via-[#E1306C] to-[#833AB4] text-white border-0',
  },
};

export const PlatformBadge = React.forwardRef<HTMLDivElement, PlatformBadgeProps>(
  ({ platform, verified, children, className, ...props }, ref) => {
    const config = platformConfig[platform];
    
    return (
      <Badge
        ref={ref}
        className={cn(config.className, className)}
        leftIcon={<span>{config.icon}</span>}
        rightIcon={
          verified ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-3.5 h-3.5"
            >
              <path
                fillRule="evenodd"
                d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          ) : undefined
        }
        {...props}
      >
        {children || config.label}
      </Badge>
    );
  }
);

PlatformBadge.displayName = 'PlatformBadge';

/**
 * CountBadge - Badge for displaying counts (notifications, messages, etc.)
 */
export interface CountBadgeProps extends Omit<BadgeProps, 'children' | 'variant'> {
  count: number;
  max?: number;
  showZero?: boolean;
}

export const CountBadge = React.forwardRef<HTMLDivElement, CountBadgeProps>(
  ({ count, max = 99, showZero = false, className, ...props }, ref) => {
    if (count === 0 && !showZero) return null;
    
    const displayCount = count > max ? `${max}+` : count;
    
    return (
      <Badge
        ref={ref}
        variant="solid"
        size="sm"
        className={cn('min-w-[20px] px-1.5', className)}
        {...props}
      >
        {displayCount}
      </Badge>
    );
  }
);

CountBadge.displayName = 'CountBadge';

/**
 * VerifiedBadge - Verified checkmark badge
 */
export const VerifiedBadge = React.forwardRef<
  HTMLDivElement,
  Omit<BadgeProps, 'children' | 'leftIcon'>
>(({ className, ...props }, ref) => {
  return (
    <Badge
      ref={ref}
      variant="primary"
      size="sm"
      className={cn('gap-1', className)}
      leftIcon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-3.5 h-3.5"
        >
          <path
            fillRule="evenodd"
            d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clipRule="evenodd"
          />
        </svg>
      }
      {...props}
    >
      인증됨
    </Badge>
  );
});

VerifiedBadge.displayName = 'VerifiedBadge';
