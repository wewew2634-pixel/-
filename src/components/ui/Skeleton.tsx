import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Skeleton Component
 * 
 * A placeholder component for loading states.
 * Displays a pulsing gray box that mimics content structure.
 * 
 * @example
 * ```tsx
 * <Skeleton className="h-4 w-full" />
 * <Skeleton variant="circular" className="h-12 w-12" />
 * <Skeleton variant="text" />
 * ```
 */

const skeletonVariants = cva(
  'relative overflow-hidden bg-bg-tertiary before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-bg-secondary/50 before:to-transparent',
  {
    variants: {
      variant: {
        default: 'rounded-md',
        circular: 'rounded-full',
        rectangular: 'rounded-none',
        text: 'rounded-sm h-4',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number;
  height?: string | number;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, width, height, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(skeletonVariants({ variant }), className)}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          ...style,
        }}
        role="status"
        aria-label="Loading content"
        {...props}
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);

Skeleton.displayName = 'Skeleton';

/**
 * Skeleton Avatar Component
 * 
 * Pre-configured skeleton for avatar placeholders.
 */

export interface SkeletonAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <Skeleton
      variant="circular"
      className={cn(sizeClasses[size], className)}
    />
  );
};

SkeletonAvatar.displayName = 'SkeletonAvatar';

/**
 * Skeleton Card Component
 * 
 * Pre-configured skeleton for card placeholders.
 */

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('flex flex-col gap-3 p-4 rounded-lg border border-border bg-bg-secondary', className)}>
      <div className="flex items-center gap-3">
        <SkeletonAvatar size="md" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-24 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
  );
};

SkeletonCard.displayName = 'SkeletonCard';

/**
 * Skeleton Text Component
 * 
 * Pre-configured skeleton for text content.
 */

export interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-4/5' : 'w-full' // Last line is shorter
          )}
        />
      ))}
    </div>
  );
};

SkeletonText.displayName = 'SkeletonText';

/**
 * Skeleton Button Component
 * 
 * Pre-configured skeleton for button placeholders.
 */

export interface SkeletonButtonProps {
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export const SkeletonButton: React.FC<SkeletonButtonProps> = ({
  size = 'md',
  fullWidth = false,
  className,
}) => {
  const sizeClasses = {
    sm: 'h-10 w-24',
    md: 'h-12 w-32',
    lg: 'h-14 w-40',
  };

  return (
    <Skeleton
      className={cn(
        sizeClasses[size],
        fullWidth && 'w-full',
        'rounded-md',
        className
      )}
    />
  );
};

SkeletonButton.displayName = 'SkeletonButton';

/**
 * Skeleton Input Component
 * 
 * Pre-configured skeleton for input field placeholders.
 */

export interface SkeletonInputProps {
  label?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SkeletonInput: React.FC<SkeletonInputProps> = ({
  label = false,
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    sm: 'h-10',
    md: 'h-12',
    lg: 'h-14',
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && <Skeleton className="h-4 w-24" />}
      <Skeleton className={cn(sizeClasses[size], 'w-full')} />
    </div>
  );
};

SkeletonInput.displayName = 'SkeletonInput';

/**
 * Skeleton List Component
 * 
 * Pre-configured skeleton for list items.
 */

export interface SkeletonListProps {
  items?: number;
  avatar?: boolean;
  className?: string;
}

export const SkeletonList: React.FC<SkeletonListProps> = ({
  items = 5,
  avatar = true,
  className,
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          {avatar && <SkeletonAvatar size="md" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

SkeletonList.displayName = 'SkeletonList';

/**
 * Skeleton Mission Card Component
 * 
 * Pre-configured skeleton for mission card placeholders.
 * Matches the structure of MissionCard component.
 */

export const SkeletonMissionCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('flex flex-col gap-4 p-4 rounded-xl border border-border bg-bg-secondary', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SkeletonAvatar size="lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      {/* Image */}
      <Skeleton className="h-48 w-full rounded-lg" />

      {/* Content */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <SkeletonText lines={2} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Button */}
      <SkeletonButton size="md" fullWidth />
    </div>
  );
};

SkeletonMissionCard.displayName = 'SkeletonMissionCard';
