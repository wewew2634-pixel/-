import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Loading Spinner Component
 * 
 * A reusable loading spinner with multiple sizes and variants.
 * Used for loading states across the application.
 * 
 * @example
 * ```tsx
 * <LoadingSpinner size="md" variant="primary" />
 * <LoadingSpinner size="lg" variant="white" label="Loading..." />
 * ```
 */

const spinnerVariants = cva(
  'inline-block animate-spin rounded-full border-solid border-current',
  {
    variants: {
      size: {
        xs: 'h-3 w-3 border-2',
        sm: 'h-4 w-4 border-2',
        md: 'h-6 w-6 border-2',
        lg: 'h-8 w-8 border-3',
        xl: 'h-12 w-12 border-4',
      },
      variant: {
        primary: 'text-primary',
        secondary: 'text-secondary',
        white: 'text-white',
        gray: 'text-text-tertiary',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'primary',
    },
  }
);

export interface LoadingSpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
  label?: string;
  labelPosition?: 'bottom' | 'right';
}

export const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ size, variant, className, label, labelPosition = 'bottom' }, ref) => {
    const Container = label ? 'div' : React.Fragment;
    const containerProps = label
      ? {
          className: cn(
            'flex items-center',
            labelPosition === 'bottom' ? 'flex-col gap-2' : 'flex-row gap-3'
          ),
        }
      : {};

    return (
      <Container {...containerProps}>
        <div
          ref={ref}
          className={cn(spinnerVariants({ size, variant }), className)}
          style={{
            borderTopColor: 'transparent',
            borderRightColor: 'transparent',
          }}
          role="status"
          aria-label={label || 'Loading'}
        >
          <span className="sr-only">{label || 'Loading'}</span>
        </div>
        {label && (
          <span className="text-sm font-medium text-text-secondary">{label}</span>
        )}
      </Container>
    );
  }
);

LoadingSpinner.displayName = 'LoadingSpinner';

/**
 * Full Page Loading Component
 * 
 * Displays a centered loading spinner with optional message.
 * Covers the entire viewport with a backdrop.
 * 
 * @example
 * ```tsx
 * <FullPageLoading message="Loading your data..." />
 * ```
 */

export interface FullPageLoadingProps {
  message?: string;
  backdrop?: boolean;
  backdropBlur?: boolean;
}

export const FullPageLoading: React.FC<FullPageLoadingProps> = ({
  message,
  backdrop = true,
  backdropBlur = false,
}) => {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        backdrop &&
          (backdropBlur
            ? 'bg-black/50 backdrop-blur-sm'
            : 'bg-bg-primary/80')
      )}
      role="dialog"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-4 p-8 rounded-xl bg-bg-primary shadow-2xl">
        <LoadingSpinner size="xl" variant="primary" />
        {message && (
          <p className="text-base font-medium text-text-primary">{message}</p>
        )}
      </div>
    </div>
  );
};

FullPageLoading.displayName = 'FullPageLoading';

/**
 * Inline Loading Component
 * 
 * Displays a small inline loading spinner with text.
 * Useful for loading states within components.
 * 
 * @example
 * ```tsx
 * <InlineLoading text="Saving..." />
 * ```
 */

export interface InlineLoadingProps {
  text?: string;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
  text,
  size = 'sm',
  className,
}) => {
  return (
    <div className={cn('flex items-center gap-2', className)} role="status">
      <LoadingSpinner size={size} variant="primary" />
      {text && <span className="text-sm text-text-secondary">{text}</span>}
    </div>
  );
};

InlineLoading.displayName = 'InlineLoading';

/**
 * Loading Overlay Component
 * 
 * Displays a loading overlay over a specific container.
 * Useful for loading states within cards or sections.
 * 
 * @example
 * ```tsx
 * <div className="relative">
 *   <YourContent />
 *   {isLoading && <LoadingOverlay message="Loading..." />}
 * </div>
 * ```
 */

export interface LoadingOverlayProps {
  message?: string;
  blur?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message,
  blur = true,
}) => {
  return (
    <div
      className={cn(
        'absolute inset-0 z-10 flex items-center justify-center rounded-lg',
        blur ? 'bg-bg-primary/80 backdrop-blur-sm' : 'bg-bg-primary/90'
      )}
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner size="lg" variant="primary" />
        {message && (
          <p className="text-sm font-medium text-text-secondary">{message}</p>
        )}
      </div>
    </div>
  );
};

LoadingOverlay.displayName = 'LoadingOverlay';

/**
 * Loading Dots Component
 * 
 * Three animated dots for inline loading states.
 * 
 * @example
 * ```tsx
 * <LoadingDots />
 * ```
 */

export const LoadingDots: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('flex items-center gap-1', className)} role="status">
      <span className="sr-only">Loading</span>
      <div className="h-2 w-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
      <div className="h-2 w-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
      <div className="h-2 w-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
    </div>
  );
};

LoadingDots.displayName = 'LoadingDots';
